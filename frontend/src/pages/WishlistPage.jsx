import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gamesAPI, authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import GameCard from '../components/GameCard';
import Loader from '../components/Loader';

const WishlistPage = () => {
  const { user, updateUser } = useAuth();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistGames = async () => {
      if (!user?.wishlist?.length) { setLoading(false); return; }
      try {
        const promises = user.wishlist.map((id) => gamesAPI.getById(id));
        const results = await Promise.allSettled(promises);
        const valid = results
          .filter((r) => r.status === 'fulfilled')
          .map((r) => r.value);
        setGames(valid);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlistGames();
  }, [user?.wishlist?.length]);

  const handleRemove = async (gameId) => {
    const data = await authAPI.toggleWishlist(gameId);
    updateUser({ wishlist: data.wishlist });
    setGames(games.filter((g) => g._id !== gameId));
  };

  if (loading) return <Loader />;

  return (
    <div className="wishlist-page">
      <h1>❤️ My Wishlist</h1>
      {games.length === 0 ? (
        <div className="empty-state">
          <h2>Your wishlist is empty</h2>
          <p>Browse games and click "Add to Wishlist" to save them here.</p>
          <Link to="/games" className="btn-primary">Browse Games</Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {games.map((game) => (
            <div key={game._id} className="wishlist-item">
              <GameCard game={game} />
              <button className="remove-wish-btn" onClick={() => handleRemove(game._id)}>
                ❤️ Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
