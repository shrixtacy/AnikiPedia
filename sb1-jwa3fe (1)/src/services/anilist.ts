import { apiClient } from './api';

// Types
export interface Anime {
  id: number;
  title: {
    english: string | null;
    romaji: string;
  };
  coverImage: {
    large: string;
    medium: string;
  };
  bannerImage?: string;
  genres: string[];
  averageScore: number;
  description?: string;
  startDate?: {
    year: number;
    month: number;
    day: number;
  };
  characters?: {
    nodes: Character[];
  };
  status?: string;
  episodes?: number;
  duration?: number;
  popularity?: number;
  trending?: number;
  nextAiringEpisode?: {
    airingAt: number;
    episode: number;
  };
}

export interface Character {
  id: number;
  name: {
    full: string;
    native: string;
  };
  image: {
    medium: string;
    large: string;
  };
  description?: string;
  gender?: string;
  dateOfBirth?: {
    year?: number;
    month?: number;
    day?: number;
  };
}

// Queries
const TRENDING_ANIME_QUERY = `
  query {
    Page(page: 1, perPage: 6) {
      media(type: ANIME, sort: TRENDING_DESC) {
        id
        title {
          english
          romaji
        }
        coverImage {
          large
          medium
        }
        genres
        averageScore
        description
        episodes
        status
        trending
      }
    }
  }
`;

const POPULAR_ANIME_QUERY = `
  query {
    Page(page: 1, perPage: 6) {
      media(type: ANIME, sort: POPULARITY_DESC) {
        id
        title {
          english
          romaji
        }
        coverImage {
          large
          medium
        }
        genres
        averageScore
        description
        episodes
        status
        popularity
      }
    }
  }
`;

const ANIME_DETAILS_QUERY = `
  query ($id: Int!) {
    Media(id: $id, type: ANIME) {
      id
      title {
        english
        romaji
        native
      }
      coverImage {
        large
        medium
      }
      bannerImage
      genres
      averageScore
      description
      status
      episodes
      duration
      popularity
      trending
      nextAiringEpisode {
        airingAt
        episode
      }
      characters(sort: ROLE) {
        nodes {
          id
          name {
            full
            native
          }
          image {
            medium
            large
          }
          description
          gender
          dateOfBirth {
            year
            month
            day
          }
        }
      }
    }
  }
`;

const SEARCH_ANIME_QUERY = `
  query ($search: String!, $page: Int) {
    Page(page: $page, perPage: 12) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
      media(type: ANIME, search: $search) {
        id
        title {
          english
          romaji
        }
        coverImage {
          large
          medium
        }
        genres
        averageScore
        description
        episodes
        status
      }
    }
  }
`;

const UPCOMING_ANIME_QUERY = `
  query {
    Page(page: 1, perPage: 12) {
      media(type: ANIME, status: NOT_YET_RELEASED, sort: POPULARITY_DESC) {
        id
        title {
          english
          romaji
        }
        coverImage {
          large
          medium
        }
        startDate {
          year
          month
          day
        }
        genres
        averageScore
        description
      }
    }
  }
`;

const ANIME_BY_GENRE_QUERY = `
  query ($genre: String) {
    Page(page: 1, perPage: 12) {
      media(type: ANIME, genre: $genre, sort: POPULARITY_DESC) {
        id
        title {
          english
          romaji
        }
        coverImage {
          large
          medium
        }
        genres
        averageScore
      }
    }
  }
`;

const GENRE_COLLECTION_QUERY = `
  query {
    GenreCollection
  }
`;

// API Functions
export const getTrendingAnime = async (): Promise<Anime[]> => {
  const data = await apiClient.request(TRENDING_ANIME_QUERY);
  return data.Page.media;
};

export const getPopularAnime = async (): Promise<Anime[]> => {
  const data = await apiClient.request(POPULAR_ANIME_QUERY);
  return data.Page.media;
};

export const getAnimeDetails = async (id: string): Promise<Anime> => {
  const data = await apiClient.request(ANIME_DETAILS_QUERY, { id: parseInt(id) });
  return data.Media;
};

export interface SearchResult {
  media: Anime[];
  pageInfo: {
    total: number;
    currentPage: number;
    lastPage: number;
    hasNextPage: boolean;
    perPage: number;
  };
}

export const searchAnime = async (
  search: string,
  page = 1
): Promise<SearchResult> => {
  const data = await apiClient.request(SEARCH_ANIME_QUERY, { search, page });
  return data.Page;
};

export const getUpcomingAnime = async (): Promise<Anime[]> => {
  const data = await apiClient.request(UPCOMING_ANIME_QUERY);
  return data.Page.media;
};

export const getAnimeByGenre = async (genre: string): Promise<Anime[]> => {
  const data = await apiClient.request(ANIME_BY_GENRE_QUERY, { genre });
  return data.Page.media;
};

export const getAllGenres = async (): Promise<string[]> => {
  const data = await apiClient.request(GENRE_COLLECTION_QUERY);
  return data.GenreCollection;
};

// Utility functions
export const formatDate = (year?: number, month?: number, day?: number): string => {
  if (!year || !month || !day) return 'TBA';
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatAiringTime = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });
};

export const getStatusColor = (status: string): string => {
  const colors = {
    FINISHED: 'green',
    RELEASING: 'blue',
    NOT_YET_RELEASED: 'yellow',
    CANCELLED: 'red',
    HIATUS: 'orange',
  };
  return colors[status as keyof typeof colors] || 'gray';
};