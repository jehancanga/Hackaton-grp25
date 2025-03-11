
const SearchBar = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Rechercher des tweets, hashtags, ou auteurs..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;