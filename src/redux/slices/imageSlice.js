import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  images: JSON.parse(localStorage.getItem("images")) || [],
  selectedImage: localStorage.getItem("selectedImage") || null,
};

const imageSlice = createSlice({
  name: "images",
  initialState,
  reducers: {
    addImages: (state, action) => {

      state.images = [...state.images, ...action.payload];
      localStorage.setItem("images", JSON.stringify(state.images));
    },
    setSelectedImage: (state, action) => {
      state.selectedImage = action.payload;
      localStorage.setItem("selectedImage", action.payload);
    },
  },
});

export const { addImages, setSelectedImage } = imageSlice.actions;
export default imageSlice.reducer;