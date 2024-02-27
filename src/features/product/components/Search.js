import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import {
  searchProductsAsync,
  searchSuggestionAsync,
  selectSearchSuggestion,
} from "../productSlice";

export default function Search() {
  const [value, setValue] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const suggestion = useSelector(selectSearchSuggestion);

  const onchange = (e) => {
    const inputValue = e.target.value;
    setValue(inputValue);
    if (inputValue !== "") {
      setTimeout(() => {
        dispatch(searchSuggestionAsync(inputValue));
      }, 500);
    }
  };
  

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(searchProductsAsync(value));
    navigate("/search");
  };

  const clearSearchFilter = () => {
    navigate(`/`);
    setValue("");
  };

  const searchFilters =
    suggestion.data && suggestion.data.results
      ? suggestion.data.results.flatMap((searchFilter) => {
          const tempSuggestions = [];

          if (searchFilter.title) {
            tempSuggestions.push(searchFilter.title);
          }
          if (searchFilter.category) {
            tempSuggestions.push(searchFilter.category);
          }
          if (searchFilter.brand) {
            tempSuggestions.push(searchFilter.brand);
          }
          if (searchFilter.keywords) {
            tempSuggestions.push(...searchFilter.keywords);
          }
          if(searchFilter.subCategory) {
            tempSuggestions.push(...searchFilter.subCategory);
          }
          return tempSuggestions;
        })
      : [];

  const flattenedSuggestions = searchFilters.flat();

  const uniqueSuggestions = [...new Set(flattenedSuggestions)]
  const fullSearch = uniqueSuggestions.filter(suggestion => suggestion.toLowerCase().includes(value.toLowerCase()))
  .slice(0, 10);
  return (
    <div>
      <div className="w-full relative top-0 bg-white py-6 left-0">
        <div className="mx-auto bg-transparent w-[90%] md:w-1/2 z-10 max-w-7xl relative">
          <form className="flex border border-blue-800 border-l-3 rounded-full overflow-hidden">
            <input
              type="text"
              onChange={onchange}
              value={value}
              placeholder="Search..."
              className="flex-1 py-2 px-4 bg-transparent focus:outline-none input-field border-none outline-none"
            />
            {value && (
              <button
                onClick={clearSearchFilter}
                className="text-red-600 p-2"
                type="button"
              >
                <IoClose className="w-6 h-6" />
              </button>
            )}
            <button
              onClick={(e) => handleSearch(e)}
              type="submit"
              className="bg-custom-gradient text-white px-4 text-xl"
            >
              <FaSearch className="w-6 h-6" />
            </button>
          </form>
        </div>
      </div>

      {value && (
        <div
          className="max-w-7xl md:mx-2 md:w-1/2 mx-auto bg-white absolute left-1/2 -translate-x-1/2 w-[90%] z-[100] rounded-md -mt-4"
          style={{
            boxShadow:
              "0px 4px 8px -2px rgba(9, 30, 66, 0.25), 0px 0px 0px 1px rgba(9, 30, 66, 0.08)",
          }}
        >
          {fullSearch.map((suggestion) => (
            <div
              key={suggestion}
              className="hover:bg-gray-100 p-2 cursor-pointer"
              onClick={() => setValue(suggestion)}
            >
              {highlightMatch(suggestion, value)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function highlightMatch(suggestion, query) {
  const parts = suggestion.split(new RegExp(`(${query})`, "gi"));
  return (
    <div>
      {parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <strong key={index} className="text-blue-700">
            {part}
          </strong>
        ) : (
          part
        )
      )}
    </div>
  );
}
