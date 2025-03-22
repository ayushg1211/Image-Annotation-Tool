import { configureStore } from '@reduxjs/toolkit';
import commentsReducer from './slices/commentSlice';
import imagesReducer from "./slices/imageSlice" ;
export const store = configureStore({
  reducer: {
    comments: commentsReducer,
    images: imagesReducer,
  },
});