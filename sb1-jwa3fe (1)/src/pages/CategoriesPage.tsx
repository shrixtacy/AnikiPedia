import React, { useEffect, useState } from 'react';
import { Loader, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAllGenres, getAnimeByGenre, type Anime } from '../services/anilist';

const ITEMS_PER_PAGE = 12;

const CategoriesPage: React.FC = () => {
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await getAllGenres();
        setGenres(data);
        if (data.length > 0) {
          setSelectedGenre(data[0]);
        }
      } catch (error) {
        console.error('Error fetching genres:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchAnimeByGenre = async () => {
      if (!selectedGenre) return;
      setLoading(true);
      try {
        const data = await getAnimeByGenre(selectedGenre);
        setAnimeList(data);
        setTotalPages(Math.ceil(data.length / ITEMS_PER_PAGE));
        setCurrentPage(1); // Reset to first page when changing genre
      } catch (error) {
        console.error('Error fetching anime by genre:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimeByGenre();
  }, [selectedGenre]);

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get current page items
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = animeList.slice(indexOfFirstItem, indexOfLastItem);

  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  if (loading && genres.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-title mb-4">
          <span className="bg-green-400 px-6 py-2 rounded-lg transform -rotate-1 inline-block">
            Anime Categories
          </span>
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore anime by your favorite genres. From action-packed adventures to heartwarming romances,
          find the perfect series for your taste.
        </p>
      </div>

      <div className="mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => handleGenreChange(genre)}
              className={`px-4 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                selectedGenre === genre
                  ? 'bg-green-500 text-white shadow-lg scale-105'
                  : 'bg-green-100 text-green-800 hover:bg-green-200'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(ITEMS_PER_PAGE)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg overflow-hidden comic-border animate-pulse"
            >
              <div className="h-64 bg-gray-200" />
              <div className="p-4">
                <div className="h-6 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentItems.map((anime, index) => (
              <Link
                key={anime.id}
                to={`/anime/${anime.id}`}
                className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 comic-border"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative">
                  <img
                    src={anime.coverImage.large}
                    alt={anime.title.english || anime.title.romaji}
                    className="w-full h-64 object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-0 right-0 bg-green-400 text-black font-bold py-2 px-3 rounded-bl-lg">
                    <Star className="inline-block w-4 h-4 mr-1" />
                    {(anime.averageScore / 10).toFixed(1)}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2 line-clamp-1">
                    {anime.title.english || anime.title.romaji}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {anime.genres.slice(0, 2).map((genre, index) => (
                      <span
                        key={index}
                        className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-full ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                }`}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {pageNumbers.map((number) => (
                <button
                  key={number}
                  onClick={() => handlePageChange(number)}
                  className={`w-10 h-10 rounded-full font-medium transition-all duration-300 ${
                    currentPage === number
                      ? 'bg-green-500 text-white transform scale-110'
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  }`}
                >
                  {number}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-full ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                }`}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CategoriesPage;