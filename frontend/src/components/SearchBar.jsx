import { useState, useEffect } from 'react';

const SearchBar = ({ onSearch, initialValue = '' }) => {
  const [query, setQuery] = useState(initialValue);
  useEffect(() => { setQuery(initialValue); }, [initialValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        aria-label="Search games"
        placeholder="Search games by title, genre, tags..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
      />
      <button type="submit" className="search-btn">🔍 Search</button>
      {query && (
        <button type="button" className="clear-btn" aria-label="Clear search" onClick={() => { setQuery(''); onSearch(''); }}>
          ✕
        </button>
      )}
    </form>
  );
};

export default SearchBar;
