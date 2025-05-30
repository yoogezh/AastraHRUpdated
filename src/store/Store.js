// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import CandidateReducer from './reducer/FormReducer';

const store = configureStore({
  reducer: {
    candidates: CandidateReducer,
    // other reducers...
  }
});

export default store;