import SearchIcon from "@mui/icons-material/Search";
import "../assets/styles/searchBar.css";
import { Button } from "@mui/material";

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

const SearchResult = ({ result, addToCart }) => {
  return (
    <div className="search-result" style={{ display: "flex" }}>
      <span style={{ overflow: "hidden" }}>{result.name}</span>
      <Button
        size="small"
        style={{ marginLeft: "auto" }}
        onClick={() => {
          addToCart(result);
        }}
      >
        Add
      </Button>
    </div>
  );
};

export const SearchResultsList = ({ results, addToCart }) => {
  return (
    <>
      {console.log(results)}
      {results.length === 0 ? (
        <div className="results-list-container not-found">Not Found</div>
      ) : (
        <div className="results-list-container">
          <div className="results-list">
            {results.slice(0, 15).map((result) => (
              <SearchResult
                result={result}
                addToCart={addToCart}
                key={result.id}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};
