import { useRef } from "react";
import { useState } from "react";

export const UseSearch = () => {
  const [selectedSearch, setSelectedSearch] = useState("movies");
  const searchQuery = useRef(null);

  const handleSearchQueryChange = (e) => {
    e.preventDefault();
    searchQuery.current.value = e.target.value;
    console.log(`Buscando: ${searchQuery.current.value}`);
  };

  return {
    selectedSearch,
    setSelectedSearch,
    searchQuery,
    handleSearchQueryChange
  };
}