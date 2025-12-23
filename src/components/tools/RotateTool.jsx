import React, { useState, useRef } from "react";
import FileUploader from "../FileUploader";
import api from "../../utils/api"; 

export default function RotateTool() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [angle, setAngle] = useState(90);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const handleFile = (files) => {
    const file = files[0];
    if (!file || file.type !== "application/pdf") return setError("Select a PDF file");
    setSelectedFile(file);
    setDownloadUrl(null);
    setError(null);
  };

  const handleRotate = async () => {
    if (!selectedFile) return setError("Select a PDF file first");
    setLoading(true);
    setError(null);
    setDownloadUrl(null);

    try {
      const formData = new FormData();
      formData.append("pdf", selectedFile);
      formData.append("angle", angle);

      abortRef.current = new AbortController();
      const resp = await api.post("/rotate-pdf", formData, {
        responseType: "blob",
        signal: abortRef.current.signal,
      });

      setDownloadUrl(URL.createObjectURL(resp.data));
    } catch (err) {
      console.error(err);
      setError("Rotate failed");
    }
    setLoading(false);
  };

  return (
    <div className="card p-4">
      <h3>Rotate PDF</h3>

<FileUploader
  onFilesSelected={handleFile}
  accept="application/pdf"
  fileName={selectedFile ? selectedFile.name : ""}
/>
      {selectedFile && (
        <div className="mt-2">
          <label>Angle: </label>
          <select
            className="form-select"
            value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
          >
            <option value={90}>90°</option>
            <option value={180}>180°</option>
            <option value={270}>270°</option>
          </select>
        </div>
      )}

      <div className="mt-3 d-flex gap-2">
        <button className="btn btn-primary" onClick={handleRotate} disabled={loading}>
          {loading ? "Processing..." : "Rotate PDF"}
        </button>
        {loading && (
          <button className="btn btn-outline-secondary" onClick={() => abortRef.current?.abort()}>
            Cancel
          </button>
        )}
      

      
      {downloadUrl && (
        <a className="btn btn-success" href={downloadUrl} download={selectedFile?.name.replace(".pdf","") + "-rotated.pdf"}>
          Download
        </a>
      )}
    </div>
    {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
}
