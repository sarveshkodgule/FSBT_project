import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usersAPI } from '../../services/api';
import Loader from '../../components/Loader';

const StatCard = ({ icon, label, value, color }) => (
  <div className="stat-card" style={{ borderTopColor: color }}>
    <span className="stat-icon">{icon}</span>
    <div>
      <p className="stat-value">{value}</p>
      <p className="stat-label">{label}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await usersAPI.getStats();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="admin-page">
      <h1>⚙️ Admin Dashboard</h1>

      <div className="stats-grid">
        <StatCard icon="👤" label="Total Users" value={stats?.totalUsers || 0} color="#3498db" />
        <StatCard icon="🎮" label="Total Games" value={stats?.totalGames || 0} color="#9b59b6" />
        <StatCard icon="📦" label="Total Orders" value={stats?.totalOrders || 0} color="#f39c12" />
        <StatCard icon="💰" label="Revenue" value={`₹${(stats?.revenue || 0).toLocaleString()}`} color="#27ae60" />
      </div>

      <div className="admin-actions-grid">
        {[
          { to: '/admin/games', icon: '🎮', label: 'Manage Games', desc: 'Add, edit, delete games' },
          { to: '/admin/games/add', icon: '➕', label: 'Add New Game', desc: 'List a new game' },
          { to: '/admin/orders', icon: '📦', label: 'Manage Orders', desc: 'View and update orders' },
          { to: '/admin/users', icon: '👥', label: 'Manage Users', desc: 'View users, update roles' },
        ].map((item) => (
          <Link key={item.to} to={item.to} className="admin-action-card">
            <span className="action-icon">{item.icon}</span>
            <div>
              <h3>{item.label}</h3>
              <p>{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
