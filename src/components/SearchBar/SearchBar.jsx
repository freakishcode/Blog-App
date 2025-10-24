import { useContext, useState, useEffect, useMemo, useCallback } from "react";
import "./SearchBar.css";

import { AppContext } from "../../Context/Context";

// MUI
import { IconButton } from "@mui/material";
import SavedSearchIcon from "@mui/icons-material/SavedSearch";

import useDebounce from "../../Hooks/useDebounce";

function SearchBar() {
  const { data, setInputRecords } = useContext(AppContext);
  const [query, setQuery] = useState("");

  // ✅ Debounce search input (500ms delay)
  const debouncedQuery = useDebounce(query, 500);

  // ✅ Normalize data only when it changes
  const rowsData = useMemo(() => {
    if (Array.isArray(data)) return data;
    if (data && typeof data === "object") return Object.values(data);
    return [];
  }, [data]);

  // ✅ Search logic (memoized)
  const applySearch = useCallback(
    (searchValue) => {
      const trimmed = searchValue.trim().toLowerCase();
      if (!trimmed) {
        setInputRecords(rowsData); // reset
        return;
      }

      const filtered = rowsData.filter((user) =>
        ["full_name", "phone", "email"].some((key) =>
          user[key]?.toLowerCase().includes(trimmed)
        )
      );

      setInputRecords(filtered);
    },
    [rowsData, setInputRecords]
  );

  // ✅ Auto-run search when debounced query updates
  useEffect(() => {
    applySearch(debouncedQuery);
  }, [debouncedQuery, applySearch]);

  // ✅ Handle Enter key
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
      <IconButton aria-label='search' onClick={() => applySearch(query)}>
        <SavedSearchIcon />
      </IconButton>
    </div>
  );
}

export default SearchBar;
