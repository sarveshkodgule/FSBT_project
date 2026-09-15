// Experiment 9: Data Fetching in React.js - Games listing with filters
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { gamesAPI } from '../services/api';
import GameCard from '../components/GameCard';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import Loader from '../components/Loader';

const GENRES = [
  'All', 'Action', 'Adventure', 'RPG', 'Strategy', 'Sports',
  'Racing', 'Simulation', 'Horror', 'Puzzle', 'Fighting',
  'Shooter', 'Platformer', 'Sandbox', 'MMO', 'Battle Royale',
];

const PLATFORMS = ['All', 'PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

const GamesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Filter state from URL
  const search = searchParams.get('search') || '';
  const genre = searchParams.get('genre') || '';
  const platform = searchParams.get('platform') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = Number(searchParams.get('page')) || 1;
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    params.set('page', '1');
    setSearchParams(params);
  };

  const fetchGames = useCallback(async () => {
    try {
      setLoading(true);
      const params = { sort, page, limit: 12 };
      if (search) params.search = search;
      if (genre) params.genre = genre;
      if (platform) params.platform = platform;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const data = await gamesAPI.getAll(params);
      setGames(data.games);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, genre, platform, sort, page, minPrice, maxPrice]);

  useEffect(() => { fetchGames(); }, [fetchGames]);

  const clearFilters = () => setSearchParams({});

  return (
    <div className="games-page">
      <div className="games-page-header">
        <h1>🎮 All Games</h1>
        <SearchBar onSearch={(q) => updateParam('search', q)} initialValue={search} />
      </div>

      <div className="games-layout">
        {/* Sidebar Filters */}
        <aside className="filters-sidebar">
          <div className="filter-header">
            <h3>Filters</h3>
            <button className="clear-filters-btn" onClick={clearFilters}>Clear All</button>
          </div>

          <div className="filter-group">
            <label>Sort By</label>
            <select value={sort} onChange={(e) => updateParam('sort', e.target.value)} className="filter-select">
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          <div className="filter-group">
            <label>Genre</label>
            <div className="filter-list">
              {GENRES.map((g) => (
                <button
                  key={g}
                  className={`filter-option ${(genre === g || (!genre && g === 'All')) ? 'active' : ''}`}
                  onClick={() => updateParam('genre', g === 'All' ? '' : g)}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label>Platform</label>
            <div className="filter-list">
              {PLATFORMS.map((p) => (
                <button
                  key={p}
                  className={`filter-option ${(platform === p || (!platform && p === 'All')) ? 'active' : ''}`}
                  onClick={() => updateParam('platform', p === 'All' ? '' : p)}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label>Price Range (₹)</label>
            <div className="price-range">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => updateParam('minPrice', e.target.value)}
                className="price-input"
              />
              <span>–</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => updateParam('maxPrice', e.target.value)}
                className="price-input"
              />
            </div>
          </div>
        </aside>

        {/* Games Grid */}
        <div className="games-main">
          <div className="games-result-info">
            {loading ? 'Searching...' : `${total} game${total !== 1 ? 's' : ''} found`}
            {search && <span className="search-query"> for "{search}"</span>}
          </div>

          {loading ? (
            <Loader text="Fetching games..." />
          ) : games.length === 0 ? (
            <div className="empty-state">
              <p>🎮 No games found. Try different filters.</p>
              <button className="btn-primary" onClick={clearFilters}>Clear Filters</button>
            </div>
          ) : (
            <div className="games-grid">
              {games.map((game) => <GameCard key={game._id} game={game} />)}
            </div>
          )}

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => {
              const params = new URLSearchParams(searchParams);
              params.set('page', p);
              setSearchParams(params);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default GamesPage;
