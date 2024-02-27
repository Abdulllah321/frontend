import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createBrand,
  createCategory,
  createProduct,
  createRating,
  createSubCategory,
  deleteBrand,
  deleteCategory,
  deleteRating,
  deleteSubCategory,
  fetchBrands,
  fetchCategories,
  fetchDeletedProducts,
  fetchProductById,
  fetchProductsByFilters,
  fetchRating,
  fetchRatingById,
  fetchSubCategories,
  restoreDeletedProduct,
  searchProduct,
  searchSuggestion,
  updateBrand,
  updateCategory,
  updateProduct,
  updateRating,
  updateSubCategory,
} from "./productAPI";

const initialState = {
  products: [],
  brands: [],
  categories: [],
  subCategories: [],
  status: "idle",
  categoriesStatus: "idle",
  totalItems: 0,
  rating: [],
  selectedProduct: null,
  selectedRating: [],
  deletedProducts: [],
  searchResults: [],
  searchStatus: "idle",
  searchTerm: "",
  productLoaded: false,
  brandLoaded: false,
  categoriesLoaded: false,
  ratingLoaded: false,
  searchSuggestion: [],
  singleProductLoaded: false,
};

//products
export const fetchProductByIdAsync = createAsyncThunk(
  "product/fetchProductById",
  async (id) => {
    const response = await fetchProductById(id);
    return response.data;
  }
);

export const fetchProductsByFiltersAsync = createAsyncThunk(
  "product/fetchProductsByFilters",
  async ({ filter, sort, pagination, admin, min, max, search,rating }) => {
    const response = await fetchProductsByFilters(
      filter,
      sort,
      pagination,
      admin,
      min,
      max,
      rating,
      search
    );
    return response.data;
  }
);

export const createProductAsync = createAsyncThunk(
  "product/create",
  async (product) => {
    const response = await createProduct(product);
    return response.data;
  }
);
export const updateProductAsync = createAsyncThunk(
  "product/update",
  async (update) => {
    const response = await updateProduct(update);
    return response.data;
  }
);
export const fetchDeletedProductsAsync = createAsyncThunk(
  "product/fetchDeletedProducts",
  async () => {
    const response = await fetchDeletedProducts();
    return response.data;
  }
);
export const restoreDeletedProductAsync = createAsyncThunk(
  "product/restoreDeletedProduct",
  async (id) => {
    const response = await restoreDeletedProduct(id);
    return response.data;
  }
);

//categories
export const fetchBrandsAsync = createAsyncThunk(
  "product/fetchBrands",
  async () => {
    const response = await fetchBrands();
    return response.data;
  }
);
export const createBrandAsync = createAsyncThunk(
  "product/createBrand",
  async (brand) => {
    const response = await createBrand(brand);
    return response.data;
  }
);
export const updateBrandAsync = createAsyncThunk(
  "product/updateBrand",
  async (update) => {
    const response = await updateBrand(update);
    return response.data;
  }
);

export const deleteBrandAsync = createAsyncThunk(
  "product/deleteBrand",
  async (brandId) => {
    const response = await deleteBrand(brandId);

    return response.data;
  }
);

//categories
export const fetchCategoriesAsync = createAsyncThunk(
  "product/fetchCategories",
  async () => {
    const response = await fetchCategories();

    return response.data;
  }
);
export const createCategoryAsync = createAsyncThunk(
  "product/createCategory",
  async (category) => {
    const response = await createCategory(category);
    return response.data;
  }
);
export const updateCategoryAsync = createAsyncThunk(
  "product/updateCategory",
  async (update) => {
    const response = await updateCategory(update);
    return response.data;
  }
);
export const deleteCategoryAsync = createAsyncThunk(
  "product/deleteCategory",
  async (categoryId) => {
    const response = await deleteCategory(categoryId);

    return response.data;
  }
);

//subCategories
export const fetchSubCategoriesAsync = createAsyncThunk(
  "product/fetchSubCategories",
  async () => {
    const response = await fetchSubCategories();
    return response.data;
  }
);

export const createSubCategoryAsync = createAsyncThunk(
  "product/createSubCategory",
  async (category) => {
    const response = await createSubCategory(category);
    return response.data;
  }
);

export const updateSubCategoryAsync = createAsyncThunk(
  "product/updateSubCategory",
  async (update) => {
    const response = await updateSubCategory(update);
    return response.data;
  }
);

export const deleteSubCategoryAsync = createAsyncThunk(
  "product/deleteSubCategory",
  async (categoryId) => {
    const response = await deleteSubCategory(categoryId);

    return response.data;
  }
);

//rating
export const fetchRatingByIdAsync = createAsyncThunk(
  "product/fetchRatingById",
  async (id) => {
    const response = await fetchRatingById(id);

    return response.data;
  }
);
export const fetchRatingAsync = createAsyncThunk(
  "product/fetchRating",
  async () => {
    const response = await fetchRating();

    return response.data;
  }
);
export const createRatingAsync = createAsyncThunk(
  "product/createRating",
  async (rating) => {
    const response = await createRating(rating);
    return response.data;
  }
);
export const updateRatingAsync = createAsyncThunk(
  "product/updateRating",
  async (update) => {
    const response = await updateRating(update);
    return response.data;
  }
);
export const deleteRatingAsync = createAsyncThunk(
  "product/deleteRating",
  async (ratingId) => {
    const response = await deleteRating(ratingId);

    return response.data;
  }
);

export const searchProductsAsync = createAsyncThunk(
  "product/searchProducts",
  async (searchTerm) => {
    try {
      const response = await searchProduct(searchTerm);
      return response;
    } catch (error) {
      console.error("Error fetching search results:", error);
      throw error;
    }
  }
);
export const searchSuggestionAsync = createAsyncThunk(
  "product/searchSuggestion",
  async (searchTerm) => {
    try {
      const response = await searchSuggestion(searchTerm);
      return response;
    } catch (error) {
      console.error("Error fetching search results:", error);
      throw error;
    }
  }
);

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    clearSelectedRating: (state) => {
      state.selectedRating = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // product
      .addCase(fetchProductsByFiltersAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductsByFiltersAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.products = action.payload.products;
        state.totalItems = action.payload.totalItems;
        state.productLoaded = true;
      })
      .addCase(fetchProductsByFiltersAsync.rejected, (state) => {
        state.status = "loading";
        state.productLoaded = true;
      })
      .addCase(fetchProductByIdAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductByIdAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.selectedProduct = action.payload;
        state.singleProductLoaded = true;
      })
      .addCase(fetchProductByIdAsync.rejected, (state, action) => {
        state.status = "idle";
        state.singleProductLoaded = true;
      })
      .addCase(createProductAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createProductAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.products.push(action.payload);
      })
      .addCase(updateProductAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateProductAsync.fulfilled, (state, action) => {
        state.status = "idle";
        const index = state.products.findIndex(
          (product) => product._id === action.payload.id
        );
        state.products[index] = action.payload;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchDeletedProductsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDeletedProductsAsync.fulfilled, (state, action) => {
        state.deletedProducts = action.payload;
        state.productLoaded = true;
      })
      .addCase(fetchDeletedProductsAsync.rejected, (state) => {
        state.status = "loading";
        state.productLoaded = true;
      })
      .addCase(restoreDeletedProductAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(restoreDeletedProductAsync.fulfilled, (state, action) => {
        const restoredProductId = action.payload.id;
        state.deletedProducts = state.deletedProducts.filter(
          (product) => product.id !== restoredProductId
        );
      })

      //brand start
      .addCase(fetchBrandsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBrandsAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.brands = action.payload;
        state.brandLoaded = true;
      })
      .addCase(fetchBrandsAsync.rejected, (state, action) => {
        state.status = "idle";
        state.brandLoaded = true;
      })
      .addCase(createBrandAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createBrandAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.brands.push(action.payload);
      })
      .addCase(updateBrandAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateBrandAsync.fulfilled, (state, action) => {
        state.status = "idle";
        const index = state.brands.findIndex(
          (brands) => brands.id === action.payload.id
        );
        state.brands[index] = action.payload;
      })
      .addCase(deleteBrandAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteBrandAsync.fulfilled, (state, action) => {
        state.status = "idle";
        const index = state.brands.findIndex(
          (brands) => brands.id === action.payload.id
        );
        state.brands.splice(index, 1);
      })

      // categories
      .addCase(fetchCategoriesAsync.pending, (state) => {
        state.categoriesStatus = "loading";
      })
      .addCase(fetchCategoriesAsync.fulfilled, (state, action) => {
        state.categoriesStatus = "idle";
        state.categories = action.payload;
        state.categoriesLoaded = true;
      })
      .addCase(fetchCategoriesAsync.rejected, (state, action) => {
        state.categoriesStatus = "idle";
        state.categoriesLoaded = true;
      })
      .addCase(createCategoryAsync.pending, (state) => {
        state.categoriesStatus = "loading";
      })
      .addCase(createCategoryAsync.fulfilled, (state, action) => {
        state.categoriesStatus = "idle";
        state.categories.push(action.payload);
      })
      .addCase(updateCategoryAsync.pending, (state) => {
        state.categoriesStatus = "loading";
      })
      .addCase(updateCategoryAsync.fulfilled, (state, action) => {
        state.categoriesStatus = "idle";
        const index = state.categories.findIndex(
          (categories) => categories.id === action.payload.id
        );
        state.categories[index] = action.payload;
      })
      .addCase(deleteCategoryAsync.pending, (state) => {
        state.categoriesStatus = "loading";
      })
      .addCase(deleteCategoryAsync.fulfilled, (state, action) => {
        state.categoriesStatus = "idle";
        const index = state.categories.findIndex(
          (categories) => categories.id === action.payload.id
        );
        state.categories.splice(index, 1);
      })

      // subCategories
      .addCase(fetchSubCategoriesAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSubCategoriesAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.subCategories = action.payload;
      })
      .addCase(fetchSubCategoriesAsync.rejected, (state, action) => {
        state.status = "idle";
      })

      .addCase(createSubCategoryAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createSubCategoryAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.subCategories.push(action.payload);
      })
      .addCase(updateSubCategoryAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateSubCategoryAsync.fulfilled, (state, action) => {
        state.status = "idle";
        const index = state.subCategories.findIndex(
          (categories) => categories.id === action.payload.id
        );
        state.subCategories[index] = action.payload;
      })
      .addCase(deleteSubCategoryAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteSubCategoryAsync.fulfilled, (state, action) => {
        state.status = "idle";
        const index = state.subCategories.findIndex(
          (categories) => categories.id === action.payload.id
        );
        state.subCategories.splice(index, 1);
      })

      // rating
      .addCase(fetchRatingByIdAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRatingByIdAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.selectedRating = action.payload;
        state.ratingLoaded = true;
      })
      .addCase(fetchRatingByIdAsync.rejected, (state, action) => {
        state.status = "idle";
        state.ratingLoaded = true;
      })
      .addCase(fetchRatingAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRatingAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.rating = action.payload;
        state.ratingLoaded = true;
      })
      .addCase(fetchRatingAsync.rejected, (state, action) => {
        state.status = "idle";
        state.ratingLoaded = true;
      })
      .addCase(createRatingAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createRatingAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.rating.push(action.payload);
        state.selectedRating.push(action.payload);
      })
      .addCase(updateRatingAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateRatingAsync.fulfilled, (state, action) => {
        state.status = "idle";
        const index = state.rating.findIndex(
          (item) => item.id === action.payload.id
        );
        const selectedIndex = state.selectedRating.findIndex(
          (item) => item.id === action.payload.id
        );
        state.rating[index] = action.payload;
        state.selectedRating[selectedIndex] = action.payload;
      })
      .addCase(deleteRatingAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteRatingAsync.fulfilled, (state, action) => {
        state.status = "idle";
        const index = state.rating.findIndex(
          (item) => item.id === action.payload.id
        );
        state.rating.splice(index, 1);
        state.selectedRating.splice(index, 1);
      })
      //search
      .addCase(searchProductsAsync.pending, (state) => {
        state.searchStatus = "loading";
      })
      .addCase(searchProductsAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.searchResults = action.payload;
      })
      .addCase(searchSuggestionAsync.pending, (state) => {
        state.searchStatus = "loading";
      })
      .addCase(searchSuggestionAsync.fulfilled, (state, action) => {
        state.searchStatus = "idle";
        state.searchSuggestion = action.payload;
      });
  },
});

// export const {  } = productSlice.actions;

export const { clearSelectedProduct, clearSelectedRating } =
  productSlice.actions;

export const selectAllProducts = (state) => state.product.products;
export const selectBrands = (state) => state.product.brands;
export const selectRating = (state) => state.product.rating;
export const selectCategories = (state) => state.product.categories;
export const selectSubCategories = (state) => state.product.subCategories;
export const selectProductById = (state) => state.product.selectedProduct;
export const selectRatingById = (state) => state.product.selectedRating;
export const selectProductListStatus = (state) => state.product.status;
export const selectDeletedProducts = (state) => state.product.deletedProducts;
export const selectSearchResults = (state) => state.product.searchResults;
export const selectSearchStatus = (state) => state.product.searchStatus;
export const selectTotalItems = (state) => state.product.totalItems;
export const selectProductLoaded = (state) => state.product.productLoaded;
export const selectBrandLoaded = (state) => state.product.brandLoaded;
export const selectCategoriesLoaded = (state) => state.product.categoriesLoaded;
export const selectRatingLoaded = (state) => state.product.ratingLoaded;
export const selectSingleProductLoaded = (state) =>
  state.product.singleProductLoaded;
export const selectCategoriesStatus = (state) => state.product.selectCategories;
export const selectSearchSuggestion = (state) => state.product.searchSuggestion;

export default productSlice.reducer;
