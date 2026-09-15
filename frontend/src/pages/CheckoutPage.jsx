import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ordersAPI } from '../services/api';

const CheckoutPage = () => {
  const { cart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '', address: '', city: '', state: '', pincode: '', paymentMethod: 'card',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullName, address, city, state, pincode } = form;
    if (!fullName || !address || !city || !state || !pincode) {
      setError('Please fill all shipping fields'); return;
    }

    try {
      setLoading(true);
      setError('');

      const orderItems = cart.items.map((item) => ({
        game: item.game._id,
        title: item.game.title,
        image: item.game.image,
        price: item.price,
        quantity: item.quantity,
      }));

      const order = await ordersAPI.place({
        orderItems,
        totalPrice: cart.total,
        paymentMethod: form.paymentMethod,
        shippingAddress: { fullName, address, city, state, pincode },
      });

      navigate(`/orders/${order._id}?success=true`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0) {
    navigate('/cart'); return null;
  }

  return (
    <div className="checkout-page">
      <h1>🔒 Checkout</h1>

      <div className="checkout-layout">
        {/* Form */}
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h2>Shipping Information</h2>
          {error && <p className="form-error">{error}</p>}

          <div className="form-grid">
            {[
              { name: 'fullName', label: 'Full Name', placeholder: 'John Doe' },
              { name: 'address', label: 'Street Address', placeholder: '123 Main Street' },
              { name: 'city', label: 'City', placeholder: 'Mumbai' },
              { name: 'state', label: 'State', placeholder: 'Maharashtra' },
              { name: 'pincode', label: 'Pincode', placeholder: '400001' },
            ].map((field) => (
              <div className="form-group" key={field.name}>
                <label>{field.label}</label>
                <input
                  type="text"
                  name={field.name}
                  placeholder={field.placeholder}
                  value={form[field.name]}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            ))}
          </div>

          <h2>Payment Method</h2>
          <div className="payment-methods">
            {[
              { value: 'card', label: '💳 Credit / Debit Card' },
              { value: 'upi', label: '📱 UPI' },
              { value: 'wallet', label: '👛 Wallet' },
              { value: 'cod', label: '💵 Cash on Delivery' },
            ].map((method) => (
              <label key={method.value} className={`payment-option ${form.paymentMethod === method.value ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.value}
                  checked={form.paymentMethod === method.value}
                  onChange={handleChange}
                />
                {method.label}
              </label>
            ))}
          </div>

          <button type="submit" className="btn-primary full-width" disabled={loading}>
            {loading ? 'Placing Order...' : `Place Order — ₹${cart.total?.toLocaleString()}`}
          </button>
        </form>

        {/* Order Summary */}
        <div className="checkout-summary">
          <h2>Your Order</h2>
          {cart.items.map((item) => (
            <div key={item._id} className="summary-item">
              <img src={item.game?.image || 'https://placehold.co/60x40/1a1a2e/fff?text=G'} alt={item.game?.title} />
              <div>
                <p>{item.game?.title}</p>
                <p className="summary-qty">× {item.quantity}</p>
              </div>
              <span>₹{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div className="summary-total">
            <span>Total</span>
            <span>₹{cart.total?.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
