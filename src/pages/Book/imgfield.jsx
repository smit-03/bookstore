import React from "react";

const ImageField = ({ label, onImageChange, value }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const imageData = reader.result;
      onImageChange(imageData);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <label>{label}</label>
      <input type="file" onChange={handleFileChange} accept="image/*" />
      {value && <img src={value} alt="Selected" />}
    </div>
  );
};

export default ImageField;
