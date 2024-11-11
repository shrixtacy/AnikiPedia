import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Loader, Users, Calendar, Clock } from 'lucide-react';
import { getAnimeDetails, type Anime } from '../services/anilist';

const AnimeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnime = async () => {
      if (!id) return;
      try {
        const data = await getAnimeDetails(id);
        setAnime(data);
      } catch (error) {
        console.error('Error fetching anime details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="text-center py-12 animate-float">
        <h2 className="text-2xl font-bold text-gray-700">Anime not found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="relative h-96 mb-8 comic-border overflow-hidden">
        <img
          src={anime.bannerImage || anime.coverImage.large}
          alt={anime.title.english || anime.title.romaji}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 w-full">
          <h1 className="text-5xl font-title text-white mb-4 animate-float">
            {anime.title.english || anime.title.romaji}
          </h1>
          <div className="flex items-center gap-6 text-white">
            <div className="flex items-center gap-2">
              <Star className="text-yellow-400" />
              <span className="font-bold">{(anime.averageScore / 10).toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg p-6 comic-border mb-8">
            <h2 className="text-2xl font-title mb-4">Synopsis</h2>
            <p
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: anime.description || 'No description available.' }}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 comic-border">
            <h2 className="text-2xl font-title mb-4">Details</h2>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {anime.genres.map((genre, index) => (
                  <span key={index} className="badge badge-blue">
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 comic-border">
        <h2 className="text-2xl font-title mb-6 flex items-center gap-2">
          <Users className="text-blue-600" />
          Characters
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {anime.characters?.nodes.slice(0, 6).map((character, index) => (
            <div 
              key={character.id} 
              className="text-center animate-float"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative w-full pt-[100%] mb-2 comic-border overflow-hidden">
                <img
                  src={character.image.medium}
                  alt={character.name.full}
                  className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-300 hover:scale-110"
                />
              </div>
              <p className="font-medium text-sm line-clamp-2">{character.name.full}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimeDetailPage;