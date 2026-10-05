// Experiment 9: Data Fetching in React.js
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gamesAPI } from '../services/api';
import GameCard from '../components/GameCard';
import Loader from '../components/Loader';
import SearchBar from '../components/SearchBar';
import GameCollections from '../components/GameCollections';

const GENRES = [
  { name: 'Action', icon: '⚔️' }, { name: 'Adventure', icon: '🗺️' },
  { name: 'RPG', icon: '🧙' }, { name: 'Strategy', icon: '♟️' },
  { name: 'Sports', icon: '⚽' }, { name: 'Racing', icon: '🏎️' },
  { name: 'Simulation', icon: '🏙️' }, { name: 'Horror', icon: '👻' },
  { name: 'Puzzle', icon: '🧩' }, { name: 'Fighting', icon: '🥊' },
  { name: 'Shooter', icon: '🔫' }, { name: 'Platformer', icon: '🕹️' },
  { name: 'Sandbox', icon: '🏗️' }, { name: 'MMO', icon: '🌐' },
  { name: 'Battle Royale', icon: '🎯' },
];

const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredData, newData, ratedData] = await Promise.all([
          gamesAPI.getFeatured(),
          gamesAPI.getAll({ sort: 'newest', limit: 4 }),
          gamesAPI.getAll({ sort: 'rating', limit: 4 }),
        ]);
        setFeatured(featuredData);
        setNewReleases(newData.games);
        setTopRated(ratedData.games);
      } catch (err) {
        setError('We could not load the games. Please try again in a moment.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (query) => {
    if (query) navigate(`/games?search=${encodeURIComponent(query)}`);
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <span className="eyebrow">DISCOVER. PLAY. REPEAT.</span>
          <h1>Find your next<br /><span className="brand-highlight">great adventure.</span></h1>
          <p>Epic worlds. Fresh challenges. Your next favourite game.<br />Explore something worth getting lost in.</p>
          <div className="hero-search">
            <SearchBar onSearch={handleSearch} />
          </div>
          <div className="hero-actions">
            <Link to="/games" className="btn-primary">Browse All Games</Link>
            <Link to="/register" className="btn-outline">Create Account</Link>
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat"><span>25+</span><p>Games</p></div>
          <div className="stat"><span>15</span><p>Genres</p></div>
          <div className="stat"><span>4</span><p>Platforms</p></div>
        </div>
      </section>

      <GameCollections />

      {loading && <Loader text="Loading games..." />}

      {error && <div className="section" role="alert"><div className="form-error">{error} <button className="btn-outline-sm" onClick={() => window.location.reload()}>Try again</button></div></div>}

      {/* Genre Grid */}
      <section className="section">
        <h2 className="section-title">Browse by Genre</h2>
        <div className="genre-grid">
          {GENRES.map((g) => (
            <Link key={g.name} to={`/games?genre=${g.name}`} className="genre-chip">
              <span>{g.icon}</span> {g.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Games */}
      {featured.length > 0 && (
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">⭐ Featured Games</h2>
            <Link to="/games?featured=true" className="see-all">See All →</Link>
          </div>
          <div className="games-grid">
            {featured.map((game) => <GameCard key={game._id} game={game} />)}
          </div>
        </section>
      )}

      {/* New Releases */}
      {!loading && !error && <section className="section">
        <div className="section-header">
          <h2 className="section-title">🆕 New Releases</h2>
          <Link to="/games?sort=newest" className="see-all">See All →</Link>
        </div>
        <div className="games-grid">
          {newReleases.map((game) => <GameCard key={game._id} game={game} />)}
        </div>
        {newReleases.length === 0 && <p className="empty-text">New games are on their way. Explore a collection above to find your next adventure.</p>}
      </section>}

      {/* Top Rated */}
      {topRated.length > 0 && <section className="section">
        <div className="section-header">
          <h2 className="section-title">🏆 Top Rated</h2>
          <Link to="/games?sort=rating" className="see-all">See All →</Link>
        </div>
        <div className="games-grid">
          {topRated.map((game) => <GameCard key={game._id} game={game} />)}
        </div>
      </section>}

      {/* CTA Banner */}
      <section className="cta-banner">
        <h2>Ready to Play?</h2>
        <p>Create a free account and start building your game library today.</p>
        <Link to="/register" className="btn-primary">Get Started Free</Link>
      </section>
    </div>
  );
};

export default HomePage;
