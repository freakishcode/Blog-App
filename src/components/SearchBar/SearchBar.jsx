import { useContext, useState, useEffect } from "react";
import "./SearchBar.css";

// importing the created context FROM HOME COMPONENT
import { AppContext } from "../../Context/Context";

// Material UI library
import { IconButton } from "@mui/material";

// MATERIAL UI ICONS
import SavedSearchIcon from "@mui/icons-material/SavedSearch";

// ✅ Import debounce hook
import useDebounce from "../../Hooks/useDebounce";

function SearchBar() {
  // Accessing context values
  const { data, setInputRecords } = useContext(AppContext);
  // Local state for search query
  const [query, setQuery] = useState("");

  // ✅ Debounced search value (delays update by 500ms)
  const debouncedQuery = useDebounce(query, 500);

  // Safely normalize data to an array
  const rowsData = Array.isArray(data)
    ? data
    : data && typeof data === "object"
    ? Object.values(data)
    : [];

  // ✅ Function to apply search
  const applySearch = (searchValue) => {
    if (!searchValue.trim()) {
      setInputRecords(rowsData); // reset if input is empty
      return;
    }

    const searchTerm = searchValue.toLowerCase().trim();

    setInputRecords(
      rowsData.filter((user) =>
        [user.full_name, user.phone, user.email].some((field) =>
          field?.toLowerCase().includes(searchTerm)
        )
      )
    );
  };

  // ✅ Run search when debounced value changes
  useEffect(() => {
    applySearch(debouncedQuery);
  }, [debouncedQuery, rowsData]);

  // ✅ Handle Enter key for instant search
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      applySearch(query);
    }
  };

  return (
    <div className='SearchBar'>
      <input
        type='search'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder='Search by name, phone, or email'
        aria-label='Search users'
      />
      {/* SEARCH ICON (Instant search) */}
      <IconButton aria-label='search' onClick={() => applySearch(query)}>
        <SavedSearchIcon />
      </IconButton>
    </div>
  );
}

export default SearchBar;
