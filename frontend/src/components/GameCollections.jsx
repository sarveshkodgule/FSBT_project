import { Link } from 'react-router-dom';

const collections = [
  { genre: 'Action', title: 'Own the night', description: 'High stakes. Non-stop action.', image: 'action' },
  { genre: 'Adventure', title: 'Beyond the horizon', description: 'Take the road less travelled.', image: 'adventure' },
  { genre: 'Racing', title: 'Chase the finish', description: 'Find your line. Make your move.', image: 'racing' },
  { genre: 'RPG', title: 'Become the legend', description: 'A new world. A story of your own.', image: 'rpg' },
];

const GameCollections = () => (
  <section className="section collections-section" aria-labelledby="collections-heading">
    <div className="section-header">
      <div>
        <span className="eyebrow">PICK YOUR NEXT WORLD</span>
        <h2 className="section-title" id="collections-heading">Made for your kind of play</h2>
      </div>
      <Link to="/games" className="see-all">Explore all games →</Link>
    </div>
    <div className="collection-grid">
      {collections.map((collection) => (
        <Link key={collection.genre} to={`/games?genre=${encodeURIComponent(collection.genre)}`} className="collection-card">
          <img src={`/images/collections/${collection.image}.svg`} alt="" width="800" height="500" loading="lazy" />
          <div className="collection-copy">
            <span className="collection-label">{collection.genre} collection</span>
            <h3>{collection.title}</h3>
            <p>{collection.description}</p>
            <span className="collection-link">Explore {collection.genre} <span aria-hidden="true">↗</span></span>
          </div>
        </Link>
      ))}
    </div>
  </section>
);

export default GameCollections;
