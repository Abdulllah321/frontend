import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  searchProductsAsync,
  selectSearchResults,
  selectSearchStatus,
} from "../productSlice";
import ProductGrid from "./ProductGrid";
import NavBar from "../../navbar/Navbar";
import { FaRegFrownOpen } from "react-icons/fa";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export default function SearchResults() {
  const searchResults = useSelector(selectSearchResults);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const clearSearch = () => {
    dispatch(searchProductsAsync(""));
    navigate("/");
  };

  return (
    <NavBar>
      <div className="bg-white p-6">
        <div className="flex justify-between items-center w-[95%] mx-auto mb-4">
          <p className="text-xl font-semibold">
            Showing results for "{searchResults?.data?.searchQuery}"
          </p>
          <XMarkIcon
            className="w-6 h-6 cursor-pointer"
            onClick={() => clearSearch()}
          />
        </div>
        {searchResults &&
        searchResults.data &&
        searchResults.data.results &&
        searchResults?.data?.results.length > 0 ? (
          <ProductGrid products={searchResults?.data?.results} />
        ) : (
          <div className="text-center p-8">
            <FaRegFrownOpen className="w-36 h-36 mx-auto text-slate-600 mb-4" />
            <h1 className="text-3xl">
              No results found for search {searchResults?.data?.searchQuery}
            </h1>
            <p className="text-xl font-semibold mb-2">
              Please try a different search query or
              <span className="text-blue-800 cursor-pointer ml-1" onClick={()=>clearSearch()}>
                remove Search filters
              </span>
              .
            </p>
            <p className="text-gray-600">
              Alternatively, you can explore our full product range.
            </p>
          </div>
        )}
      </div>
    </NavBar>
  );
}
