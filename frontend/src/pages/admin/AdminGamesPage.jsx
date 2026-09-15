import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gamesAPI } from '../../services/api';
import Loader from '../../components/Loader';

const AdminGamesPage = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchGames = async () => {
    try {
      setLoading(true);
      const data = await gamesAPI.getAll({ limit: 100 });
      setGames(data.games);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGames(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this game?')) return;
    await gamesAPI.delete(id);
    setGames(games.filter((g) => g._id !== id));
  };

  const filtered = games.filter((g) =>
    g.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loader />;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>🎮 Manage Games</h1>
        <Link to="/admin/games/add" className="btn-primary">+ Add New Game</Link>
      </div>

      <input
        type="text"
        className="form-input"
        placeholder="Search games..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ maxWidth: '360px', marginBottom: '1.5rem' }}
      />

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Game</th>
              <th>Genre</th>
              <th>Price</th>
              <th>Rating</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((game) => (
              <tr key={game._id}>
                <td>
                  <div className="table-game-info">
                    <img src={game.image || 'https://placehold.co/60x35/1a1a2e/fff?text=G'} alt={game.title} />
                    <span>{game.title}</span>
                  </div>
                </td>
                <td><span className="genre-chip-sm">{game.genre}</span></td>
                <td>
                  {game.price === 0 ? 'FREE' : `₹${game.price.toLocaleString()}`}
                  {game.discountPrice > 0 && (
                    <span className="discount-sm"> (₹{game.discountPrice})</span>
                  )}
                </td>
                <td>{game.rating.toFixed(1)} ⭐</td>
                <td>{game.stock}</td>
                <td>
                  <div className="table-actions">
                    <Link to={`/games/${game._id}`} className="btn-outline-sm">View</Link>
                    <Link to={`/admin/games/edit/${game._id}`} className="btn-outline-sm">Edit</Link>
                    <button className="btn-danger-sm" onClick={() => handleDelete(game._id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminGamesPage;
