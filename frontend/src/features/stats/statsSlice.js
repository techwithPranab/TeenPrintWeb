import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getStats } from './statsAPI';

const initialState = {
  stats: {
    totalCustomers: '50K+',
    totalOrders: '200K+',
    totalProducts: '100+',
    averageRating: '4.8/5',
    totalCategories: '10+'
  },
  loading: false,
  error: null,
};

// Async thunk for fetching stats
export const fetchStats = createAsyncThunk(
  'stats/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getStats();
      console.log('Fetched stats:', response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
    }
  }
);

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default statsSlice.reducer;
