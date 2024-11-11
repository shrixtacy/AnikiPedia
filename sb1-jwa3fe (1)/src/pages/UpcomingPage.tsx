import React, { useEffect, useState } from 'react';
import { Calendar, Loader, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getUpcomingAnime, type Anime } from '../services/anilist';

const UpcomingPage: React.FC = () => {
  const [upcomingAnime, setUpcomingAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const data = await getUpcomingAnime();
        setUpcomingAnime(data);
      } catch (error) {
        console.error('Error fetching upcoming anime:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcoming();
  }, []);

  const formatDate = (year?: number, month?: number, day?: number) => {
    if (!year || !month || !day) return 'TBA';
    return new Date(year, month - 1, day).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-4xl font-title mb-8 text-center">
        <span className="bg-purple-400 px-6 py-2 rounded-lg transform rotate-2 inline-block">
          Upcoming Releases
        </span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {upcomingAnime.map((anime) => (
          <Link
            key={anime.id}
            to={`/anime/${anime.id}`}
            className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 comic-border"
          >
            <div className="relative">
              <img
                src={anime.coverImage.large}
                alt={anime.title.english || anime.title.romaji}
                className="w-full h-64 object-cover"
                loading="lazy"
              />
              <div className="absolute top-0 right-0 bg-purple-400 text-white font-bold py-1 px-3 rounded-bl-lg">
                <Calendar className="inline-block w-4 h-4 mr-1" />
                {formatDate(anime.startDate?.year, anime.startDate?.month, anime.startDate?.day)}
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-xl font-title mb-2">
                {anime.title.english || anime.title.romaji}
              </h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {anime.description?.replace(/<[^>]*>/g, '') || 'No description available.'}
              </p>
              <div className="flex flex-wrap gap-2">
                {anime.genres.slice(0, 3).map((genre, index) => (
                  <span
                    key={index}
                    className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default UpcomingPage;