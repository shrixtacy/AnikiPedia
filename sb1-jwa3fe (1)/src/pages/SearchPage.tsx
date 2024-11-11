import React, { useState } from 'react';
import { Search, Loader, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { searchAnime, type Anime } from '../services/anilist';

const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<{
    media: Anime[];
    pageInfo: {
      total: number;
      currentPage: number;
      lastPage: number;
      hasNextPage: boolean;
      perPage: number;
    };
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      const results = await searchAnime(searchTerm);
      setSearchResults(results);
      setSearched(true);
    } catch (error) {
      console.error('Error searching anime:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <form onSubmit={handleSearch} className="mb-12">
        <div className="relative">
          <div className="flex items-center comic-border overflow-hidden bg-white">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search anime by title..."
              className="input-primary border-0"
            />
            <button
              type="submit"
              className="btn-primary rounded-none border-0 comic-border-0"
            >
              <Search size={24} />
            </button>
          </div>
          <div className="absolute inset-0 bg-black opacity-10 -rotate-1 comic-border -z-10"></div>
        </div>
      </form>

      {loading ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <Loader className="w-12 h-12 animate-spin text-blue-600" />
        </div>
      ) : searched && (!searchResults || searchResults.media.length === 0) ? (
        <div className="text-center py-12 animate-float">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">No results found</h2>
          <p className="text-gray-600">Try searching with different keywords</p>
        </div>
      ) : (
        searchResults && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {searchResults.media.map((anime, index) => (
              <Link
                key={anime.id}
                to={`/anime/${anime.id}`}
                className="anime-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative group">
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
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white text-lg font-bold">View Details</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-title mb-2 line-clamp-1">
                    {anime.title.english || anime.title.romaji}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {anime.genres.slice(0, 2).map((genre, index) => (
                      <span key={index} className="badge badge-blue">
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default SearchPage;