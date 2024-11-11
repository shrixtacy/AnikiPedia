import { useState, useEffect, useCallback } from 'react';
import { Anime, searchAnime, SearchResult } from '../services/anilist';

interface UseSearchResult {
  results: Anime[];
  loading: boolean;
  error: Error | null;
  hasMore: boolean;
  currentPage: number;
  totalResults: number;
  search: (query: string) => Promise<void>;
  loadMore: () => Promise<void>;
}

export const useSearch = (): UseSearchResult => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const performSearch = useCallback(async (searchQuery: string, page: number, append = false) => {
    try {
      setLoading(true);
      setError(null);
      const data = await searchAnime(searchQuery, page);
      
      setResults(prev => append ? [...prev, ...data.media] : data.media);
      setHasMore(data.pageInfo.hasNextPage);
      setTotalResults(data.pageInfo.total);
      setCurrentPage(data.pageInfo.currentPage);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Search failed'));
    } finally {
      setLoading(false);
    }
  }, []);

  const search = async (newQuery: string) => {
    setQuery(newQuery);
    await performSearch(newQuery, 1);
  };

  const loadMore = async () => {
    if (!loading && hasMore) {
      await performSearch(query, currentPage + 1, true);
    }
  };

  useEffect(() => {
    if (query) {
      const timeoutId = setTimeout(() => {
        performSearch(query, 1);
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [query, performSearch]);

  return {
    results,
    loading,
    error,
    hasMore,
    currentPage,
    totalResults,
    search,
    loadMore,
  };
};