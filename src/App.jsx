import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedImage } from "./redux/slices/imageSlice";
import ImageUploader from "./components/image-uploader/ImageUploader";
import ImageCanvas from "./components/image-canvas/ImageCanvas";
import styles from "./App.module.css";

const App = () => {
  const dispatch = useDispatch();
  const images = useSelector((state) => state.images.images);
  const selectedImageUrl = useSelector((state) => state.images.selectedImage);

  // Find the actual image object based on the selected URL
  const selectedImageObj = images.find((img) => img.url === selectedImageUrl);
  
  useEffect(() => {
    const storedImageUrl = localStorage.getItem("selectedImage");
    if (storedImageUrl) {
      dispatch(setSelectedImage(storedImageUrl));
    }
  }, [dispatch]);

  // Update localStorage when image changes
  useEffect(() => {
    if (selectedImageUrl) {
      localStorage.setItem("selectedImage", selectedImageUrl);
    }
  }, [selectedImageUrl]);

  return (
    <div className={styles.appContainer}>
      <h1 className={styles.title}>Image Annotation Tool</h1>
      <ImageUploader/>
      {selectedImageObj && <ImageCanvas image={selectedImageObj} />}
    </div>
  );
};

export default App;
