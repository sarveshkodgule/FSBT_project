import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Inline SVG data-URI used as the last-resort fallback when the image URL
// fails to load — zero network dependency, always renders.
const FALLBACK_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450' viewBox='0 0 800 450'%3E%3Crect width='800' height='450' fill='%231a1a2e'/%3E%3Ctext x='50%25' y='44%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui,sans-serif' font-size='52' fill='%23e94560'%3E🎮%3C/text%3E%3Ctext x='50%25' y='62%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui,sans-serif' font-size='22' fill='%23a8a8b3'%3ENo Image Available%3C/text%3E%3C/svg%3E";

const StarRating = ({ rating }) => {
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= Math.round(rating) ? 'star filled' : 'star'}>★</span>
      ))}
      <span className="rating-num">({rating.toFixed(1)})</span>
    </div>
  );
};

const GameCard = ({ game }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState('');
  const soldOut = game.stock === 0;

  useEffect(() => { setImgLoaded(false); }, [game.image]);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (adding || soldOut) return;
    if (!user) { navigate('/login', { state: { from: { pathname: `/games/${game._id}` } } }); return; }
    setAdding(true);
    setError('');
    setAdded(false);
    try {
      await addToCart(game._id, 1);
      setAdded(true);
    } catch (err) {
      setError(err.message || 'Could not add this game. Please try again.');
    } finally {
      setAdding(false);
    }
  };

  const handleImgError = (e) => {
    // Prevent infinite error loop if the fallback itself somehow fails
    e.currentTarget.onerror = null;
    e.currentTarget.src = FALLBACK_IMG;
    setImgLoaded(true);
  };

  const hasDiscount = game.discountPrice > 0 && game.discountPrice < game.price;
  const displayPrice = hasDiscount ? game.discountPrice : game.price;
  const discount = hasDiscount
    ? Math.round(((game.price - game.discountPrice) / game.price) * 100)
    : 0;

  return (
    <article className="game-card">
      <Link to={`/games/${game._id}`} className="game-card-cover" aria-label={`View ${game.title}`}>
        <div className="game-card-image">
          {/* Skeleton shimmer shown until the image finishes loading */}
          {!imgLoaded && <div className="img-skeleton" aria-hidden="true" />}
          <img
            src={game.image || FALLBACK_IMG}
            alt={game.title}
            loading="lazy"
            decoding="async"
            onLoad={() => setImgLoaded(true)}
            onError={handleImgError}
            className={imgLoaded ? 'img-visible' : 'img-hidden'}
          />
          {discount > 0 && <span className="discount-badge">-{discount}%</span>}
          {game.featured && <span className="featured-badge">⭐ Featured</span>}
        </div>
      </Link>
      <div className="game-card-body">
        <span className="game-genre">{game.genre}</span>
        <Link to={`/games/${game._id}`}>
          <h3 className="game-title">{game.title}</h3>
        </Link>
        <p className="game-developer">{game.developer}</p>
        <p className="game-card-description">{game.description}</p>
        <StarRating rating={game.rating || 0} />
        <div className="game-platforms">
          {game.platform?.map((p) => (
            <span key={p} className="platform-tag">{p}</span>
          ))}
        </div>
        <div className="game-card-footer">
          <div className="price-block">
            {game.price === 0 ? (
              <span className="price free">FREE</span>
            ) : (
              <>
                <span className="price">₹{displayPrice.toLocaleString('en-IN')}</span>
                {discount > 0 && (
                  <span className="original-price">₹{game.price.toLocaleString('en-IN')}</span>
                )}
              </>
            )}
          </div>
          <button className="btn-add-cart" onClick={handleAddToCart} disabled={adding || soldOut} aria-label={soldOut ? `${game.title} is out of stock` : `Add ${game.title} to cart`}>
            {soldOut ? 'Out of stock' : adding ? 'Adding…' : 'Add to cart'}
          </button>
        </div>
        <div className="game-card-feedback" aria-live="polite">
          {added && <span className="cart-added">Added to cart. <Link to="/cart">View cart →</Link></span>}
          {error && <span className="cart-add-error" role="alert">{error}</span>}
        </div>
      </div>
    </article>
  );
};

export default GameCard;
