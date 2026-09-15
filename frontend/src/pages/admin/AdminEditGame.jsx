import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { gamesAPI } from '../../services/api';
import Loader from '../../components/Loader';

const GENRES = [
  'Action', 'Adventure', 'RPG', 'Strategy', 'Sports', 'Racing',
  'Simulation', 'Horror', 'Puzzle', 'Fighting', 'Shooter',
  'Platformer', 'Sandbox', 'MMO', 'Battle Royale',
];
const PLATFORMS = ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile'];

const AdminEditGame = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await gamesAPI.getById(id);
        setForm({
          ...data,
          tags: data.tags?.join(', ') || '',
          releaseDate: data.releaseDate ? new Date(data.releaseDate).toISOString().split('T')[0] : '',
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handlePlatform = (p) => {
    setForm({
      ...form,
      platform: form.platform.includes(p)
        ? form.platform.filter((x) => x !== p)
        : [...form.platform, p],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError('');
      await gamesAPI.update(id, {
        ...form,
        price: Number(form.price),
        discountPrice: Number(form.discountPrice) || 0,
        stock: Number(form.stock),
        tags: typeof form.tags === 'string'
          ? form.tags.split(',').map((t) => t.trim()).filter(Boolean)
          : form.tags,
      });
      navigate('/admin/games');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;
  if (!form) return <p>Game not found</p>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>✏️ Edit Game</h1>
        <Link to="/admin/games" className="btn-outline">← Back</Link>
      </div>

      {error && <div className="form-error">{error}</div>}

      <form className="game-form" onSubmit={handleSubmit}>
        <div className="form-grid-2">
          <div className="form-group">
            <label>Title</label>
            <input name="title" value={form.title} onChange={handleChange} className="form-input" />
          </div>
          <div className="form-group">
            <label>Genre</label>
            <select name="genre" value={form.genre} onChange={handleChange} className="form-input">
              {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Developer</label>
            <input name="developer" value={form.developer} onChange={handleChange} className="form-input" />
          </div>
          <div className="form-group">
            <label>Publisher</label>
            <input name="publisher" value={form.publisher} onChange={handleChange} className="form-input" />
          </div>
          <div className="form-group">
            <label>Price (₹)</label>
            <input type="number" name="price" value={form.price} onChange={handleChange} className="form-input" min="0" />
          </div>
          <div className="form-group">
            <label>Discount Price (₹)</label>
            <input type="number" name="discountPrice" value={form.discountPrice} onChange={handleChange} className="form-input" min="0" />
          </div>
          <div className="form-group">
            <label>Stock</label>
            <input type="number" name="stock" value={form.stock} onChange={handleChange} className="form-input" min="0" />
          </div>
          <div className="form-group">
            <label>Release Date</label>
            <input type="date" name="releaseDate" value={form.releaseDate} onChange={handleChange} className="form-input" />
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="form-input" rows={4} />
        </div>

        <div className="form-group">
          <label>Image URL</label>
          <input name="image" value={form.image} onChange={handleChange} className="form-input" />
        </div>

        <div className="form-group">
          <label>Tags (comma separated)</label>
          <input name="tags" value={form.tags} onChange={handleChange} className="form-input" />
        </div>

        <div className="form-group">
          <label>Platforms</label>
          <div className="checkbox-group">
            {PLATFORMS.map((p) => (
              <label key={p} className="checkbox-label">
                <input type="checkbox" checked={form.platform?.includes(p)} onChange={() => handlePlatform(p)} />
                {p}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
            Featured Game
          </label>
        </div>

        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving...' : '💾 Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default AdminEditGame;
