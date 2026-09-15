// Experiment 7: React State Management - Cart
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Loader from '../components/Loader';

const CartPage = () => {
  const { cart, updateItem, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  if (cart.loading) return <Loader />;

  if (cart.items.length === 0) {
    return (
      <div className="empty-page">
        <div className="empty-state">
          <h2>🛒 Your cart is empty</h2>
          <p>Looks like you haven't added any games yet.</p>
          <Link to="/games" className="btn-primary">Browse Games</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>🛒 Shopping Cart</h1>

      <div className="cart-layout">
        {/* Cart Items */}
        <div className="cart-items">
          <div className="cart-header">
            <span>{cart.items.length} item(s)</span>
            <button className="clear-btn-text" onClick={clearCart}>Clear Cart</button>
          </div>

          {cart.items.map((item) => {
            const game = item.game;
            if (!game) return null;
            const unitPrice = item.price || (game.discountPrice > 0 ? game.discountPrice : game.price);

            return (
              <div key={item._id} className="cart-item">
                <img
                  src={game.image || 'https://placehold.co/120x70/1a1a2e/fff?text=Game'}
                  alt={game.title}
                  className="cart-item-img"
                />
                <div className="cart-item-info">
                  <Link to={`/games/${game._id}`}>
                    <h3>{game.title}</h3>
                  </Link>
                  <p className="cart-item-price">₹{unitPrice?.toLocaleString()}</p>
                </div>
                <div className="cart-qty-controls">
                  <button onClick={() => updateItem(game._id, item.quantity - 1)}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateItem(game._id, item.quantity + 1)}>+</button>
                </div>
                <div className="cart-item-subtotal">
                  ₹{(unitPrice * item.quantity).toLocaleString()}
                </div>
                <button className="remove-btn" onClick={() => removeItem(game._id)}>✕</button>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="order-summary-card">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{cart.total?.toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>Delivery</span>
            <span className="free-delivery">FREE</span>
          </div>
          <div className="summary-row total-row">
            <span>Total</span>
            <span>₹{cart.total?.toLocaleString()}</span>
          </div>
          <button className="btn-primary full-width" onClick={() => navigate('/checkout')}>
            Proceed to Checkout →
          </button>
          <Link to="/games" className="btn-outline full-width" style={{ marginTop: '0.75rem', display: 'block', textAlign: 'center' }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
