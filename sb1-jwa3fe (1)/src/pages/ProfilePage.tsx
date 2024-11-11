import React, { useState } from 'react';
import { User, Edit2 } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState({
    name: 'Anime Fan',
    email: 'animefan@example.com',
    favoriteAnime: ['Attack on Titan', 'My Hero Academia', 'Demon Slayer'],
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    // Save user data (implement API call here)
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Profile</h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          {isEditing ? 'Cancel' : 'Edit'}
          <Edit2 size={20} className="ml-2" />
        </button>
      </div>

      <div className="mb-6">
        <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
          <User size={64} className="text-gray-600" />
        </div>
        {isEditing ? (
          <input
            type="text"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            className="w-full text-center text-2xl font-semibold mb-2 border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
          />
        ) : (
          <h2 className="text-2xl font-semibold text-center mb-2">{user.name}</h2>
        )}
        <p className="text-gray-600 text-center">{user.email}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Favorite Anime</h3>
        <ul className="list-disc list-inside">
          {user.favoriteAnime.map((anime, index) => (
            <li key={index} className="mb-1">
              {isEditing ? (
                <input
                  type="text"
                  value={anime}
                  onChange={(e) => {
                    const newFavorites = [...user.favoriteAnime];
                    newFavorites[index] = e.target.value;
                    setUser({ ...user, favoriteAnime: newFavorites });
                  }}
                  className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-600"
                />
              ) : (
                anime
              )}
            </li>
          ))}
        </ul>
      </div>

      {isEditing && (
        <button
          onClick={handleSave}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save Changes
        </button>
      )}
    </div>
  );
};

export default ProfilePage;