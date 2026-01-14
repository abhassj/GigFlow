import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// Fetch bids for a gig
export const fetchBids = createAsyncThunk('bids/fetchBids', async (gigId, thunkAPI) => {
  try {
    const response = await api.get(`/bids/${gigId}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch bids');
  }
});

// Place a new bid
export const placeBid = createAsyncThunk('bids/placeBid', async (bidData, thunkAPI) => {
  try {
    const response = await api.post('/bids', bidData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to place bid');
  }
});

// Hire freelancer (Atomic)
export const hireFreelancer = createAsyncThunk('bids/hireFreelancer', async ({ bidId }, thunkAPI) => {
  try {
    const response = await api.patch(`/bids/${bidId}/hire`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to hire freelancer');
  }
});

// Fetch my bids
export const fetchMyBids = createAsyncThunk('bids/fetchMyBids', async (_, thunkAPI) => {
  try {
    const response = await api.get('/bids/my-bids');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch my bids');
  }
});

const bidSlice = createSlice({
  name: 'bids',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    addBid: (state, action) => {
      state.items.push(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Bids
      .addCase(fetchBids.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBids.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBids.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Place Bid
      .addCase(placeBid.pending, (state) => {
        state.loading = true;
      })
      .addCase(placeBid.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(placeBid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Hire Freelancer
      .addCase(hireFreelancer.pending, (state) => {
        state.loading = true;
      })
      .addCase(hireFreelancer.fulfilled, (state, action) => {
        state.loading = false;
        // Update local state is complex because other bids get rejected.
        // It's cleaner to re-fetch or trust the response if it returns the updated list,
        // but our API returns the hired bid and gig.
        // Let's manually update the specific bid to hired.
        const hiredBid = state.items.find(b => b._id === action.payload.bid._id);
        if (hiredBid) hiredBid.status = 'hired';

        // Mark others as rejected
        state.items.forEach(b => {
          if (b._id !== action.payload.bid._id) {
            b.status = 'rejected';
          }
        });
      })
      .addCase(hireFreelancer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch My Bids
      .addCase(fetchMyBids.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyBids.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMyBids.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addBid } = bidSlice.actions;
export default bidSlice.reducer;
