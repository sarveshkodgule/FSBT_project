import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="not-found-page">
    <h1>404</h1>
    <h2>Page Not Found</h2>
    <p>The page you are looking for doesn't exist.</p>
    <Link to="/" className="btn-primary">Go Home</Link>
  </div>
);

export default NotFoundPage;
