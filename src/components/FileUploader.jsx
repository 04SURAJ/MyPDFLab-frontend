import React, { useState, useRef } from "react";

export default function FileUploader({ onFilesSelected, accept = "application/pdf", multiple = false, fileName }) {
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  const handleClick = () => {
    if (fileRef.current) fileRef.current.click();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) onFilesSelected(files);
  };

  const handleChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) onFilesSelected(files);
    e.target.value = null;
  };

  return (
    <div
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      style={{
        border: "2px dashed #999",
        borderRadius: "12px",
        padding: "40px",
        textAlign: "center",
        backgroundColor: dragOver ? "#f1f1f1" : "#fff",
        cursor: "pointer",
      }}
    >
      <input
        type="file"
        ref={fileRef}
        style={{ display: "none" }}
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
      />
      <h5>Click to upload or drag & drop</h5>
      <h5 >
        Accepted: {accept === "image/*" ? "Images (JPG, PNG, WEBP)" : "PDF Files"}
      </h5>
      {multiple && <p >(Multiple files allowed)</p>}

      {fileName && (
        <div >
          Selected: {fileName}
        </div>
      )}
    </div>
  );
}
