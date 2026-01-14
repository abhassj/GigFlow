import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// Fetch all open gigs
export const fetchGigs = createAsyncThunk('gigs/fetchGigs', async (searchTerm = '', thunkAPI) => {
  try {
    const response = await api.get(`/gigs?search=${searchTerm}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch gigs');
  }
});

// Fetch single gig details
export const fetchGigById = createAsyncThunk('gigs/fetchGigById', async (id, thunkAPI) => {
  try {
    const response = await api.get(`/gigs/${id}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch gig');
  }
});

// Create new gig
export const createGig = createAsyncThunk('gigs/createGig', async (gigData, thunkAPI) => {
  try {
    const response = await api.post('/gigs', gigData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to create gig');
  }
});

// Fetch my gigs
export const fetchMyGigs = createAsyncThunk('gigs/fetchMyGigs', async (_, thunkAPI) => {
  try {
    const response = await api.get('/gigs/my-gigs');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch my gigs');
  }
});

const gigSlice = createSlice({
  name: 'gigs',
  initialState: {
    items: [],
    currentGig: null,
    loading: false,
    error: null,
  },
  reducers: {
    updateGigStatus: (state, action) => {
      const { id, status } = action.payload;
      const gig = state.items.find(g => g._id === id);
      if (gig) gig.status = status;
      if (state.currentGig && state.currentGig._id === id) state.currentGig.status = status;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Gigs
      .addCase(fetchGigs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGigs.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchGigs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Single Gig
      .addCase(fetchGigById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGigById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentGig = action.payload;
      })
      .addCase(fetchGigById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Gig
      .addCase(createGig.pending, (state) => {
        state.loading = true;
      })
      .addCase(createGig.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createGig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch My Gigs
      .addCase(fetchMyGigs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyGigs.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMyGigs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateGigStatus } = gigSlice.actions;
export default gigSlice.reducer;
