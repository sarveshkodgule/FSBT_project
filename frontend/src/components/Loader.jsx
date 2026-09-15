const Loader = ({ text = 'Loading...' }) => (
  <div className="loader-wrapper">
    <div className="spinner"></div>
    <p>{text}</p>
  </div>
);

export default Loader;
