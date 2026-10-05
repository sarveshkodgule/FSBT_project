// Experiment 6: User Authentication and Authorization
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Please fill all fields'); return; }
    try {
      setLoading(true);
      setError('');
      await login(form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <aside className="auth-intro">
        <span className="eyebrow">YOUR NEXT ADVENTURE STARTS HERE</span>
        <h2>Great games.<br /><span>Your world.</span></h2>
        <p>Discover a new favourite, save your wishlist, and make every play session count.</p>
        <div className="auth-feature-list">
          <span>01 / Explore every genre</span>
          <span>02 / Build your wishlist</span>
          <span>03 / Find your next favourite</span>
        </div>
        <Link to="/games" className="see-all">Explore the store →</Link>
      </aside>
      <div className="auth-card">
        <div className="auth-header">
          <span className="eyebrow">PLAYER LOGIN</span>
          <h1>Welcome back.</h1>
          <p>Sign in to your GameStore account</p>
        </div>

        {error && <div className="form-error" role="alert">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              autoComplete="email"
              required
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <div className="password-field">
            <input
              id="login-password"
              autoComplete="current-password"
              required
              type={showPassword ? 'text' : 'password'}
              placeholder="Your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="form-input"
            />
            <button type="button" className="password-toggle" aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Hide' : 'Show'}</button>
            </div>
          </div>
          <button type="submit" className="btn-primary full-width" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Create one →</Link>
        </p>

        {import.meta.env.DEV && <div className="demo-creds">
          <p>🔑 Demo Admin: <strong>admin@gamestore.com</strong> / <strong>admin123</strong></p>
        </div>}
      </div>
    </div>
  );
};

export default LoginPage;
