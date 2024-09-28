import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define types for user and auth state
export interface User {
  id: number;
  username: string;
  token: string; // Assuming you're working with JWT tokens
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

// Initialize the auth slice state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: null,
};

// Define the credentials type for login
interface Credentials {
  username: string;
  password: string;
}

// Asynchronous thunk action for login
export const loginUser = createAsyncThunk(
  "auth/loginUser", // The action type string
  async (credentials: Credentials, thunkAPI) => {
    try {
      // Example API request using axios (you can use fetch too)
      const response = await axios.post("/api/login", credentials);
      // In this example, response.data will contain `{ id, username, token }`

      return response.data as User; // Return the user object
    } catch (error: any) {
      // Handle error and reject the action
      return thunkAPI.rejectWithValue(
        "Login failed. Please check your credentials.",
      );
    }
  },
);

// Create the slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Simple logout action that clears the state
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login pending state
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // Login fulfilled / success state
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload; // Set the logged-in user
      })
      // Login rejected / error state
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string; // Set error message
      });
  },
});

// Export actions
export const { logout } = authSlice.actions;

// Export the reducer to the store
export default authSlice.reducer;
