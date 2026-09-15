import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', password: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password && form.password !== form.confirmPassword) {
      setError('Passwords do not match'); return;
    }
    try {
      setLoading(true);
      setError('');
      const payload = { name: form.name, email: form.email };
      if (form.password) payload.password = form.password;

      const updated = await authAPI.updateProfile(payload);
      updateUser(updated);
      setMessage('✅ Profile updated successfully!');
      setForm({ ...form, password: '', confirmPassword: '' });
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-avatar">
          <div className="avatar-circle">{user?.name?.charAt(0).toUpperCase()}</div>
          <div>
            <h2>{user?.name}</h2>
            <span className={`role-badge ${user?.role}`}>{user?.role}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <h3>Edit Profile</h3>
          {error && <p className="form-error">{error}</p>}
          {message && <p className="form-success">{message}</p>}

          {[
            { name: 'name', label: 'Full Name', type: 'text' },
            { name: 'email', label: 'Email Address', type: 'email' },
            { name: 'password', label: 'New Password (leave blank to keep)', type: 'password' },
            { name: 'confirmPassword', label: 'Confirm New Password', type: 'password' },
          ].map((field) => (
            <div className="form-group" key={field.name}>
              <label>{field.label}</label>
              <input
                type={field.type}
                value={form[field.name]}
                onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                className="form-input"
              />
            </div>
          ))}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
