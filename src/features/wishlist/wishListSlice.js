import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addToWishlist,
  deleteItemFromWishlist,
  fetchWishlistItemsByUserId,
  resetWishlist,
  updateWishlistItem,
} from "./wishListAPI";

const initialState = {
  status: "idle",
  items: [],
  error: "",
  addToWishlist: null,
  addToWishlistStatus: "idle",
  updateWishlistStatus: "idle",
  deleteWishlistStatus: "idle",
  wishlistLoaded: false,
};

export const addToWishlistAsync = createAsyncThunk(
  "wishlist/addToWishlist",
  async (item) => {
    const response = await addToWishlist(item);
    return response.data;
  }
);

export const fetchWishlistItemsByUserIdAsync = createAsyncThunk(
  "wishlist/fetchWishlistItemsByUserId",
  async () => {
    const response = await fetchWishlistItemsByUserId();
    return response.data;
  }
);
export const updateWishlistItemAsync = createAsyncThunk(
  "wishlist/updateWishlistItem",
  async (update) => {
    const response = await updateWishlistItem(update);
    return response.data;
  }
);

export const deleteItemFromWishlistAsync = createAsyncThunk(
  "wishlist/deleteItemFromWishlist",
  async (itemId) => {
    const response = await deleteItemFromWishlist(itemId);
    return response.data;
  }
);

export const resetWishlistAsync = createAsyncThunk(
  "wishlist/resetWishlist",
  async () => {
    const response = await resetWishlist();
    return response.data;
  }
);

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addToWishlistAsync.pending, (state) => {
        state.addToWishlistStatus = "loading";
      })
      .addCase(addToWishlistAsync.fulfilled, (state, action) => {
        state.addToWishlistStatus = "succeeded";
        state.items.push(action.payload);
        state.addToWishlist = action.payload;
      })
      .addCase(addToWishlistAsync.rejected, (state, action) => {
        state.addToWishlistStatus = "failed";
        state.error = action.payload;
      })
      .addCase(fetchWishlistItemsByUserIdAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWishlistItemsByUserIdAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
        state.wishlistLoaded = true;
      })
      .addCase(fetchWishlistItemsByUserIdAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.wishlistLoaded = true;
      })
      .addCase(updateWishlistItemAsync.pending, (state) => {
        state.updateWishlistStatus = "loading";
      })
      .addCase(updateWishlistItemAsync.fulfilled, (state, action) => {
        state.updateWishlistStatus = "succeeded";
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        state.items[index] = action.payload;
      })
      .addCase(updateWishlistItemAsync.rejected, (state, action) => {
        state.updateWishlistStatus = "failed";
        state.error = action.payload;
      })
      .addCase(deleteItemFromWishlistAsync.pending, (state) => {
        state.deleteWishlistStatus = "loading";
      })
      .addCase(deleteItemFromWishlistAsync.fulfilled, (state, action) => {
        state.deleteWishlistStatus = "succeeded";
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        state.items.splice(index, 1);
      })
      .addCase(deleteItemFromWishlistAsync.rejected, (state, action) => {
        state.deleteWishlistStatus = "failed";
        state.error = action.payload;
      })
      .addCase(resetWishlistAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(resetWishlistAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = [];
      });
  },
});

// export const { increment } = wishlistSlice.actions;
export const selectWishListItems = (state) => state?.wishlist?.items || [];
export const selectWishlistStatus = (state) => state?.wishlist?.status;
export const selectWishlistLoaded = (state) => state?.wishlist?.wishlistLoaded;
export const selectAddToWishlist = (state) => state?.wishlist?.addToWishlist;
export const selectAddToWishlistError = (state) => state.wishlist.error;
export const selectAddToWishlistStatus = (state) =>
  state.wishlist.addToWishlistStatus;
export const selectUpdateWishlistStatus = (state) =>
  state.wishlist.updateWishlistStatus;
export const selectDeleteWishlistStatus = (state) =>
  state.wishlist.deleteWishlistStatus;

export default wishlistSlice.reducer;
