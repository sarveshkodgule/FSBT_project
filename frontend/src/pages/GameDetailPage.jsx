// Experiment 9: Data Fetching in React.js
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gamesAPI, authAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ReviewSection from '../components/ReviewSection';
import Loader from '../components/Loader';

const FALLBACK_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450' viewBox='0 0 800 450'%3E%3Crect width='800' height='450' fill='%231a1a2e'/%3E%3Ctext x='50%25' y='44%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui,sans-serif' font-size='52' fill='%23e94560'%3E🎮%3C/text%3E%3Ctext x='50%25' y='62%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui,sans-serif' font-size='22' fill='%23a8a8b3'%3ENo Image Available%3C/text%3E%3C/svg%3E";

const GameDetailPage = () => {
  const { id } = useParams();
  const { user, updateUser } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartMsg, setCartMsg] = useState('');
  const [wishlist, setWishlist] = useState([]);
  const [qty, setQty] = useState(1);
  const [heroImgLoaded, setHeroImgLoaded] = useState(false);
  const [adding, setAdding] = useState(false);
  const [savingWishlist, setSavingWishlist] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await gamesAPI.getById(id);
        setGame(data);
      } catch {
        navigate('/games');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  useEffect(() => {
    if (user?.wishlist) setWishlist(user.wishlist);
  }, [user]);

  const handleAddToCart = async () => {
    if (!user) { navigate('/login', { state: { from: { pathname: `/games/${id}` } } }); return; }
    if (adding) return;
    setAdding(true);
    try {
      await addToCart(game._id, qty);
      setCartMsg('✅ Added to cart!');
      setTimeout(() => setCartMsg(''), 3000);
    } catch (err) {
      setCartMsg(`❌ ${err.message}`);
    } finally {
      setAdding(false);
    }
  };

  const handleWishlist = async () => {
    if (!user) { navigate('/login', { state: { from: { pathname: `/games/${id}` } } }); return; }
    if (savingWishlist) return;
    setSavingWishlist(true);
    try {
      const data = await authAPI.toggleWishlist(game._id);
      setWishlist(data.wishlist);
      updateUser({ wishlist: data.wishlist });
    } catch (err) {
      setCartMsg(`❌ ${err.message}`);
    } finally {
      setSavingWishlist(false);
    }
  };

  if (loading) return <Loader />;
  if (!game) return null;

  const isWishlisted = wishlist.includes(game._id);
  const displayPrice = game.discountPrice > 0 ? game.discountPrice : game.price;
  const discount = game.discountPrice > 0
    ? Math.round(((game.price - game.discountPrice) / game.price) * 100)
    : 0;

  return (
    <div className="game-detail-page">
      {/* Game Hero */}
      <div className="game-detail-hero">
        {!heroImgLoaded && <div className="img-skeleton hero-skeleton" aria-hidden="true" />}
        <img
          src={game.image || FALLBACK_IMG}
          alt={game.title}
          className={`game-detail-img${heroImgLoaded ? ' img-visible' : ' img-hidden'}`}
          loading="eager"
          decoding="async"
          onLoad={() => setHeroImgLoaded(true)}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = FALLBACK_IMG;
            setHeroImgLoaded(true);
          }}
        />
      </div>

      <div className="game-detail-container">
        <div className="game-detail-main">
          {/* Info */}
          <div className="game-info-card">
            <div className="game-info-header">
              <span className="game-genre">{game.genre}</span>
              {game.featured && <span className="featured-badge">⭐ Featured</span>}
            </div>
            <h1>{game.title}</h1>
            <p className="game-dev-pub">{game.developer} · {game.publisher}</p>

            <div className="star-rating large">
              {[1,2,3,4,5].map((s) => (
                <span key={s} className={s <= Math.round(game.rating) ? 'star filled' : 'star'}>★</span>
              ))}
              <span>{game.rating.toFixed(1)} ({game.numReviews} reviews)</span>
            </div>

            <div className="game-platforms">
              {game.platform?.map((p) => <span key={p} className="platform-tag">{p}</span>)}
            </div>

            <p className="game-description">{game.description}</p>

            <div className="game-tags">
              {game.tags?.map((tag) => <span key={tag} className="tag">#{tag}</span>)}
            </div>

            <div className="game-meta">
              <span>📅 Released: {game.releaseDate ? new Date(game.releaseDate).toLocaleDateString() : 'TBA'}</span>
              <span>📦 In Stock: {game.stock > 0 ? game.stock : 'Out of Stock'}</span>
            </div>
          </div>

          <ReviewSection gameId={id} />
        </div>

        {/* Purchase Card */}
        <aside className="purchase-card">
          <div className="purchase-price">
            {game.price === 0 ? (
              <span className="price free">FREE TO PLAY</span>
            ) : (
              <>
                <span className="price">₹{displayPrice.toLocaleString()}</span>
                {discount > 0 && (
                  <>
                    <span className="original-price">₹{game.price.toLocaleString()}</span>
                    <span className="discount-badge">-{discount}%</span>
                  </>
                )}
              </>
            )}
          </div>

          <div className="qty-selector">
            <label>Quantity</label>
            <div className="qty-controls">
              <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <span>{qty}</span>
              <button disabled={qty >= game.stock} onClick={() => setQty(qty + 1)}>+</button>
            </div>
          </div>

          {cartMsg && <p className="cart-msg" role="status">{cartMsg}</p>}

          <button
            className="btn-primary full-width"
            onClick={handleAddToCart}
            disabled={game.stock === 0 || adding}
          >
            {game.stock === 0 ? 'Out of Stock' : adding ? 'Adding…' : '🛒 Add to Cart'}
          </button>

          <button
            className={`btn-outline full-width wishlist-btn ${isWishlisted ? 'wishlisted' : ''}`}
            onClick={handleWishlist}
            disabled={savingWishlist}
          >
            {isWishlisted ? '❤️ Wishlisted' : '🤍 Add to Wishlist'}
          </button>

          <div className="purchase-info">
            <p>🔒 Secure checkout</p>
            <p>📧 Instant delivery to email</p>
            <p>↩️ Easy refund policy</p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default GameDetailPage;
