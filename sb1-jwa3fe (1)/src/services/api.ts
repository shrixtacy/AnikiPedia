import { GraphQLClient } from 'graphql-request';

// Initialize the GraphQL client with proper error handling and retries
class APIClient {
  private client: GraphQLClient;
  private cache: Map<string, { data: any; timestamp: number }>;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_RETRIES = 3;

  constructor() {
    this.client = new GraphQLClient('https://graphql.anilist.co', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    this.cache = new Map();
  }

  private async fetchWithRetry<T>(
    query: string,
    variables?: Record<string, any>,
    retryCount = 0
  ): Promise<T> {
    try {
      return await this.client.request<T>(query, variables);
    } catch (error: any) {
      if (retryCount < this.MAX_RETRIES && this.shouldRetry(error)) {
        await this.delay(Math.pow(2, retryCount) * 1000);
        return this.fetchWithRetry(query, variables, retryCount + 1);
      }
      throw this.handleError(error);
    }
  }

  private shouldRetry(error: any): boolean {
    const retriableStatuses = [408, 429, 500, 502, 503, 504];
    return retriableStatuses.includes(error?.response?.status);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private handleError(error: any): Error {
    if (error?.response?.status === 429) {
      return new Error('Rate limit exceeded. Please try again later.');
    }
    if (error?.response?.status === 404) {
      return new Error('The requested resource was not found.');
    }
    return new Error('An unexpected error occurred. Please try again.');
  }

  private getCacheKey(query: string, variables?: Record<string, any>): string {
    return `${query}-${JSON.stringify(variables || {})}`;
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  async request<T>(
    query: string,
    variables?: Record<string, any>,
    skipCache = false
  ): Promise<T> {
    const cacheKey = this.getCacheKey(query, variables);

    if (!skipCache) {
      const cached = this.cache.get(cacheKey);
      if (cached && this.isCacheValid(cached.timestamp)) {
        return cached.data as T;
      }
    }

    const data = await this.fetchWithRetry<T>(query, variables);
    this.cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const apiClient = new APIClient();