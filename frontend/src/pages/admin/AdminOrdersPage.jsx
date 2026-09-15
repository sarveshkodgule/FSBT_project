import { useState, useEffect } from 'react';
import { ordersAPI } from '../../services/api';
import Loader from '../../components/Loader';

const STATUS_COLORS = {
  pending: '#f39c12', processing: '#3498db',
  completed: '#27ae60', cancelled: '#e74c3c',
};

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await ordersAPI.getAll();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleStatusChange = async (id, status) => {
    await ordersAPI.updateStatus(id, { status });
    setOrders(orders.map((o) => (o._id === id ? { ...o, status } : o)));
  };

  if (loading) return <Loader />;

  return (
    <div className="admin-page">
      <h1>📦 Manage Orders</h1>
      <p className="admin-count">{orders.length} total orders</p>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="mono">#{order._id.slice(-8).toUpperCase()}</td>
                <td>
                  <p>{order.user?.name}</p>
                  <p className="text-muted">{order.user?.email}</p>
                </td>
                <td>{order.orderItems?.length} game(s)</td>
                <td>₹{order.totalPrice?.toLocaleString()}</td>
                <td>
                  <span className={`payment-tag ${order.paymentStatus}`}>
                    {order.paymentStatus}
                  </span>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="status-select"
                    style={{ borderColor: STATUS_COLORS[order.status] }}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
