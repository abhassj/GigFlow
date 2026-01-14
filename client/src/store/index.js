
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import gigReducer from './gigSlice';
import bidReducer from './bidSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    gigs: gigReducer,
    bids: bidReducer,
  },
});

