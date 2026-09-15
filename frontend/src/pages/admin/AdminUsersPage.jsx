import { useState, useEffect } from 'react';
import { usersAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';

const AdminUsersPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await usersAPI.getAll();
        setUsers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleRoleChange = async (id, role) => {
    await usersAPI.updateRole(id, { role });
    setUsers(users.map((u) => (u._id === id ? { ...u, role } : u)));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await usersAPI.delete(id);
    setUsers(users.filter((u) => u._id !== id));
  };

  if (loading) return <Loader />;

  return (
    <div className="admin-page">
      <h1>👥 Manage Users</h1>
      <p className="admin-count">{users.length} registered users</p>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Wishlist</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  <div className="user-avatar-row">
                    <div className="avatar-sm">{user.name.charAt(0).toUpperCase()}</div>
                    {user.name}
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="role-select"
                    disabled={user._id === currentUser._id}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>{user.wishlist?.length || 0} items</td>
                <td>
                  {user._id !== currentUser._id && (
                    <button
                      className="btn-danger-sm"
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsersPage;
