import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          🎮 <span>GameStore</span>
        </Link>

        {/* Desktop Links */}
        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/games" onClick={() => setMenuOpen(false)}>Games</Link>

          {user ? (
            <>
              <Link to="/cart" className="cart-link" onClick={() => setMenuOpen(false)}>
                🛒 Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>
              <Link to="/wishlist" onClick={() => setMenuOpen(false)}>❤️ Wishlist</Link>
              <Link to="/orders" onClick={() => setMenuOpen(false)}>📦 Orders</Link>

              <div className="nav-dropdown">
                <button className="nav-user-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
                  👤 {user.name.split(' ')[0]} ▾
                </button>
                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <Link to="/profile" onClick={() => setDropdownOpen(false)}>My Profile</Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={() => setDropdownOpen(false)}>⚙️ Admin Panel</Link>
                    )}
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="btn-primary-sm" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
