import React, { useState } from "react";
import { Box } from "@mui/material";
import { IconButton } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

const ImageField = ({ name, initialImage, onImageChange, value, ...props }) => {
  const [image, setImage] = useState(initialImage);
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setFile(selectedFile);
      setImage(reader.result);
      onImageChange(reader.result);
    };

    if (selectedFile) {
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleImageRemove = () => {
    setFile(null);
    setImage(null);
    onImageChange(null);
  };

  return (
    <Box display="flex" alignItems="center">
      {!image && (
        <Box>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            {...props}
            name={name}
          />
        </Box>
      )}
      {image && (
        <div style={{ position: "relative" }}>
          <img
            src={image}
            alt="Book"
            style={{
              width: "70px",
              height: "100px",
              marginRight: "1vw",
              marginTop: "1vh",
            }}
          />
          <IconButton
            color="secondary"
            size="small"
            onClick={handleImageRemove}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              backgroundColor: "black",
              color: "white",
              borderRadius: "50%",
              padding: "2px",
              boxShadow: "0 0 3px rgba(0, 0, 0, 0.3)",
            }}
          >
            <CloseIcon />
          </IconButton>
        </div>
      )}
    </Box>
  );
};

export default ImageField;
