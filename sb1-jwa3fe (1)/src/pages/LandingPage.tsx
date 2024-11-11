import React, { useEffect, useState } from 'react';
import { Star, Loader, TrendingUp, Flame, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getTrendingAnime, getPopularAnime, type Anime } from '../services/anilist';

const LandingPage: React.FC = () => {
  const [trendingAnime, setTrendingAnime] = useState<Anime[]>([]);
  const [popularAnime, setPopularAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'trending' | 'popular'>('trending');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trending, popular] = await Promise.all([
          getTrendingAnime(),
          getPopularAnime()
        ]);
        setTrendingAnime(trending);
        setPopularAnime(popular);
      } catch (error) {
        console.error('Error fetching anime:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const AnimeCard: React.FC<{ anime: Anime; index: number }> = ({ anime, index }) => (
    <Link 
      to={`/anime/${anime.id}`} 
      className="anime-card group"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="relative overflow-hidden">
        <img 
          src={anime.coverImage.large} 
          alt={anime.title.english || anime.title.romaji} 
          className="w-full h-64 object-cover transform transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute top-0 right-0 bg-yellow-400 text-black font-bold py-2 px-3 rounded-bl-lg border-b-2 border-l-2 border-black">
          <Star className="inline-block w-4 h-4 mr-1" />
          {(anime.averageScore / 10).toFixed(1)}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 p-4 text-white">
            <p className="font-medium mb-2">{anime.title.english || anime.title.romaji}</p>
            <div className="flex flex-wrap gap-2">
              {anime.genres.slice(0, 2).map((genre, index) => (
                <span key={index} className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                  {genre}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="relative bg-gradient-to-b from-blue-600 to-purple-600 text-white py-16 -mt-8 mb-16 comic-border">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-5xl font-title mb-6 animate-float">Discover Your Next Anime Adventure</h1>
          <p className="text-xl mb-8 text-blue-100">Explore thousands of anime titles, from classics to the latest releases</p>
          <Link 
            to="/search"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-full font-bold hover:bg-blue-50 transition-colors comic-border"
          >
            <Search className="w-5 h-5" />
            Search Anime
          </Link>
        </div>
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
              fill="currentColor" fillOpacity="0.2"/>
          </svg>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveSection('trending')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300 ${
              activeSection === 'trending'
                ? 'bg-yellow-400 text-black scale-110'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            Trending Now
          </button>
          <button
            onClick={() => setActiveSection('popular')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300 ${
              activeSection === 'popular'
                ? 'bg-blue-600 text-white scale-110'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Flame className="w-5 h-5" />
            All-Time Popular
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(activeSection === 'trending' ? trendingAnime : popularAnime).map((anime, index) => (
            <AnimeCard key={anime.id} anime={anime} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;