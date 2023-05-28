import SearchIcon from "@mui/icons-material/Search";
import "./searchBar.css";

export const SearchBar = ({ onSearch, setInput }) => {
  const handleChange = (value) => {
    setInput(value);
    if (value.trim() !== "") {
      onSearch(value);
    }
  };

  return (
    <div className="input-wrapper">
      <SearchIcon id="search-icon" />
      <input
        placeholder="What are you looking for..."
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
};

const SearchResult = ({ result }) => {
  return (
    <div
      className="search-result"
      onClick={(e) => alert(`You selected ${result}!`)}
    >
      {result}
    </div>
  );
};

export const SearchResultsList = ({ results }) => {
  return (
    <>
      {results.length === 0 ? (
        <div className="results-list not-found">Not Found</div>
      ) : (
        <div className="results-list-container">
          <div className="results-list">
            {results.map((result) => (
              <SearchResult result={result.name} key={result.id} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};
