import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import Loader from '../components/Loader';

const STATUS_COLORS = {
  pending: '#f39c12', processing: '#3498db',
  completed: '#27ae60', cancelled: '#e74c3c',
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await ordersAPI.getMyOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this order?')) return;
    await ordersAPI.cancel(id);
    setOrders(orders.map((o) => o._id === id ? { ...o, status: 'cancelled' } : o));
  };

  if (loading) return <Loader />;

  return (
    <div className="orders-page">
      <h1>📦 My Orders</h1>

      {orders.length === 0 ? (
        <div className="empty-state">
          <h2>No orders yet</h2>
          <p>Start shopping to see your orders here.</p>
          <Link to="/games" className="btn-primary">Browse Games</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-card-header">
                <div>
                  <p className="order-id">Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="order-date">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span className="status-badge" style={{ backgroundColor: STATUS_COLORS[order.status] }}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>

              <div className="order-items-preview">
                {order.orderItems?.slice(0, 3).map((item) => (
                  <img
                    key={item._id}
                    src={item.image || 'https://placehold.co/60x40/1a1a2e/fff?text=G'}
                    alt={item.title}
                    title={item.title}
                    className="order-thumb"
                  />
                ))}
                {order.orderItems?.length > 3 && (
                  <span className="more-items">+{order.orderItems.length - 3} more</span>
                )}
              </div>

              <div className="order-card-footer">
                <div>
                  <span className="order-total">₹{order.totalPrice?.toLocaleString()}</span>
                  <span className="order-payment"> · {order.paymentMethod.toUpperCase()}</span>
                </div>
                <div className="order-actions">
                  <Link to={`/orders/${order._id}`} className="btn-outline-sm">View Details</Link>
                  {order.status === 'pending' && (
                    <button className="btn-danger-sm" onClick={() => handleCancel(order._id)}>
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
