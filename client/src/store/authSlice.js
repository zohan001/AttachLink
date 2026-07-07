import { createSlice } from "@reduxjs/toolkit";

function isTokenValid(token) {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

function loadState() {
  const token = localStorage.getItem("accessToken");
  if (!token || !isTokenValid(token)) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    return { user: null, accessToken: null, isAuthenticated: false };
  }
  return {
    user: JSON.parse(localStorage.getItem("user") || "null"),
    accessToken: token,
    isAuthenticated: true,
  };
}

const initialState = loadState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action) {
      const { user, accessToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.isAuthenticated = true;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("accessToken", accessToken);
    },
    updateUser(state, action) {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
    },
  },
});

export const { setCredentials, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;
