import React, { useState, useRef } from "react";
import FileUploader from "../FileUploader";
import api from "../../utils/api"; 

export default function ImagesToPdfTool() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const handleFiles = (files) => {
    const imgs = Array.from(files).filter(f => f.type.startsWith("image/"));
    if (imgs.length === 0) return setError("Select image files");
    setSelectedFiles(prev => [...prev, ...imgs]);
    setDownloadUrl(null);
    setError(null);
  };

  const removeFile = (i) => {
    setSelectedFiles(prev => prev.filter((_, idx) => idx !== i));
  };

  const handleConvert = async () => {
    if (selectedFiles.length === 0) return setError("Select images first");

    setLoading(true);
    setError(null);
    setDownloadUrl(null);

    try {
      const formData = new FormData();
      selectedFiles.forEach(f => formData.append("images", f));

      abortRef.current = new AbortController();

      const resp = await api.post("/images-to-pdf", formData, {
        responseType: "blob",
        signal: abortRef.current.signal,
      });

      const url = URL.createObjectURL(resp.data);
      setDownloadUrl(url);
    } catch (err) {
      console.error(err);
      setError("Conversion failed");
    }

    setLoading(false);
  };

  return (
    <div className="card p-4">
      <h3>Images to PDF</h3>

<FileUploader onFilesSelected={handleFiles} accept="image/*" multiple />

      {selectedFiles.length > 0 && (
        <ul className="list-group mt-2">
          {selectedFiles.map((file, i) => (
            <li key={i} className="list-group-item d-flex justify-content-between">
              {file.name}
              <button className="btn btn-sm btn-outline-danger" onClick={() => removeFile(i)}>Remove</button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 d-flex gap-2">
        <button className="btn btn-primary" onClick={handleConvert} disabled={loading}>
          {loading ? "Processing..." : "Convert to PDF"}
        </button>
        {loading && <button className="btn btn-outline-secondary" onClick={() => abortRef.current?.abort()}>Cancel</button>}
      

      

      {downloadUrl && (
        <a className="btn btn-success" href={downloadUrl} download="images.pdf">
          Download PDF
        </a>
      )}
      </div>
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
}
