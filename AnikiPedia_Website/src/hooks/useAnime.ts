import { useState, useEffect } from 'react';
import { Anime, getAnimeDetails } from '../services/anilist';

interface UseAnimeResult {
  anime: Anime | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useAnime = (id: string): UseAnimeResult => {
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAnime = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAnimeDetails(id);
      setAnime(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch anime'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnime();
  }, [id]);

  return { anime, loading, error, refetch: fetchAnime };
};