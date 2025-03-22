import React, { useState, useEffect } from "react";
import { nanoid } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { addImages, setSelectedImage } from "../../redux/slices/imageSlice";
import styles from "./ImageUploader.module.css";

const ImageUploader = () => {
  const dispatch = useDispatch();
  const images = useSelector((state) => state.images.images);
  const selectedImage = useSelector((state) => state.images.selectedImage);
  console.log(images) ;

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    // console.log(files);

    if (files.length === 0) return;
    
    const newImages = await Promise.all(
      files.map(async (file) => {
        const base64 = await convertToBase64(file); // Convert to Base64
        return {
          id: nanoid(),
          url: base64, // Store Base64 instead of object URL
        };
      })
    );

    dispatch(addImages(newImages));

    if (!selectedImage && newImages.length > 0) {
      dispatch(setSelectedImage(newImages[0].url)); // Set the first image as selected
    }

  };

  const handleImageSelect = (url) => {
    dispatch(setSelectedImage(url));
  };

  return (
    <div className={styles.uploaderContainer}>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageUpload}
      />

      <div className={styles.imageThumbnails}>
        {images.map((img) => (
          <img
            key={img.id}
            src={img.url}
            alt="Uploaded"
            className={selectedImage === img.url ? styles.selected : ""}
            onClick={() => handleImageSelect(img.url)}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;
