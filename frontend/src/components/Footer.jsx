import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="footer">
    <div className="footer-container">
      <div className="footer-brand">
        <h3>🎮 GameStore</h3>
        <p>Your ultimate destination for digital games. Explore thousands of titles across every genre.</p>
      </div>
      <div className="footer-links">
        <h4>Browse</h4>
        <Link to="/games">All Games</Link>
        <Link to="/games?genre=Action">Action</Link>
        <Link to="/games?genre=RPG">RPG</Link>
        <Link to="/games?genre=Sports">Sports</Link>
      </div>
      <div className="footer-links">
        <h4>Account</h4>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/orders">My Orders</Link>
        <Link to="/wishlist">Wishlist</Link>
      </div>
      <div className="footer-links">
        <h4>Info</h4>
        <span>College Project</span>
        <span>Full Stack Lab - CI4392</span>
        <span>RIT Rajaramnagar</span>
      </div>
    </div>
    <div className="footer-bottom">
      <p>© 2026 GameStore — Full Stack Backend Lab Project | CI4392</p>
    </div>
  </footer>
);

export default Footer;
