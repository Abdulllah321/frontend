import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchLoggedInUserOrders,
  updateUser,
  fetchLoggedInUser,
  fetchAllUser,
  deleteUser,
  updateAllUser,
} from "./userAPI";

const initialState = {
  status: "idle",
  allUsers: [],
  userLoaded: false,
  userInfo: null, // this info will be used in case of detailed user info, while auth will
};

export const fetchLoggedInUserOrderAsync = createAsyncThunk(
  "user/fetchLoggedInUserOrders",
  async () => {
    const response = await fetchLoggedInUserOrders();
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const fetchLoggedInUserAsync = createAsyncThunk(
  "user/fetchLoggedInUser",
  async () => {
    const response = await fetchLoggedInUser();
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const updateUserAsync = createAsyncThunk(
  "user/updateUser",
  async (update) => {
    // this is name mistake
    const response = await updateUser(update);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);
export const fetchAllUserAsync = createAsyncThunk(
  "user/fetchAllUser",
  async () => {
    // this is name mistake
    const response = await fetchAllUser();
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const deleteUserAsync = createAsyncThunk(
  "product/deleteUser",
  async (userId) => {
    const response = await deleteUser(userId);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);
export const updateAllUserAsync = createAsyncThunk(
  "user/updateAllUser",
  async (update) => {
    // this is name mistake
    const response = await updateAllUser(update);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLoggedInUserOrderAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLoggedInUserOrderAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.userInfo.orders = action.payload;
        state.userLoaded = true
      })
      .addCase(fetchLoggedInUserOrderAsync.rejected, (state, action) => {
        state.status = "idle";
        state.userLoaded = true
      })
      .addCase(updateUserAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        state.status = "idle";
        // earlier there was loggedInUser variable in other slice
        state.userInfo = action.payload;
      })
      .addCase(fetchLoggedInUserAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLoggedInUserAsync.fulfilled, (state, action) => {
        state.status = "idle";
        // this info can be different or more from logged-in User info
        state.userInfo = action.payload;
      })
      .addCase(fetchAllUserAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllUserAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.allUsers = action.payload;
                state.userLoaded = true

      })
      .addCase(fetchAllUserAsync.rejected, (state, action) => {
        state.status = "idle";
        state.userLoaded = true;
      })
      .addCase(deleteUserAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteUserAsync.fulfilled, (state, action) => {
        state.status = "idle";
        const index = state.allUsers.findIndex(
          (user) => user.id === action.payload.id
        );
        state.allUsers.splice(index, 1);
      })
      .addCase(updateAllUserAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateAllUserAsync.fulfilled, (state, action) => {
        state.status = "idle";
        const index = state.allUsers.findIndex(
          (user) => user.id === action.payload.id
        );
        state.allUsers[index] = action.payload;
      });
  },
});

// TODO: change orders and address to be independent of user;
export const selectUserOrders = (state) => state.user.userInfo.orders;
export const selectUserInfo = (state) => state.user.userInfo;
export const selectAllUsers = (state) => state.user.allUsers;
export const selectUserInfoStatus = (state) => state.user.status;
export const selectUserLoaded = (state) => state.user.userLoaded;

// export const { increment } = userSlice.actions;

export default userSlice.reducer;
