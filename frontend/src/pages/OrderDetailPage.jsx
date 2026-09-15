import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import Loader from '../components/Loader';

const STATUS_COLORS = {
  pending: '#f39c12', processing: '#3498db',
  completed: '#27ae60', cancelled: '#e74c3c',
};

const OrderDetailPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isSuccess = searchParams.get('success') === 'true';
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await ordersAPI.getById(id);
        setOrder(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return <Loader />;
  if (!order) return <p>Order not found.</p>;

  return (
    <div className="order-detail-page">
      {isSuccess && (
        <div className="success-banner">
          🎉 Order placed successfully! Thank you for your purchase.
        </div>
      )}

      <div className="order-detail-header">
        <div>
          <h1>Order Details</h1>
          <p className="order-id">#{order._id.slice(-8).toUpperCase()}</p>
          <p className="order-date">{new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <span className="status-badge large" style={{ backgroundColor: STATUS_COLORS[order.status] }}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </div>

      <div className="order-detail-grid">
        {/* Items */}
        <div className="order-items-card">
          <h2>Items Ordered</h2>
          {order.orderItems?.map((item) => (
            <div key={item._id} className="order-item-row">
              <img src={item.image || 'https://placehold.co/80x50/1a1a2e/fff?text=G'} alt={item.title} />
              <div className="order-item-info">
                <p>{item.title}</p>
                <p className="qty-label">Qty: {item.quantity}</p>
              </div>
              <span>₹{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="order-summary-panel">
          <div className="order-summary-card">
            <h2>Payment</h2>
            <div className="summary-row">
              <span>Method</span>
              <span>{order.paymentMethod?.toUpperCase()}</span>
            </div>
            <div className="summary-row">
              <span>Status</span>
              <span style={{ color: order.paymentStatus === 'paid' ? '#27ae60' : '#e74c3c' }}>
                {order.paymentStatus?.toUpperCase()}
              </span>
            </div>
            <div className="summary-row total-row">
              <span>Total</span>
              <span>₹{order.totalPrice?.toLocaleString()}</span>
            </div>
          </div>

          {order.shippingAddress && (
            <div className="order-summary-card">
              <h2>Shipping Address</h2>
              <p>{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
              <p>{order.shippingAddress.pincode}</p>
            </div>
          )}
        </div>
      </div>

      <Link to="/orders" className="btn-outline" style={{ marginTop: '1.5rem', display: 'inline-block' }}>
        ← Back to Orders
      </Link>
    </div>
  );
};

export default OrderDetailPage;
