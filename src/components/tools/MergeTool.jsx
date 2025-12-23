import React, { useState, useRef } from "react";
import FileUploader from "../FileUploader";
import api from "../../utils/api"; 

export default function MergeTool() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

const handleFiles = (files) => {
  const arr = Array.from(files).filter(f => f.type === "application/pdf");
  if (!arr.length) return setError("Select PDF files");

  setSelectedFiles(prev => [...prev, ...arr]); // ADD files to previous list
  setDownloadUrl(null);
  setError(null);
};


  const handleAction = async () => {
    if (!selectedFiles.length) return setError("Select PDFs first");
    setLoading(true);
    setError(null);
    setDownloadUrl(null);

    try {
      const formData = new FormData();
      selectedFiles.forEach(f => formData.append("pdfs", f));

      abortRef.current = new AbortController();
      const resp = await api.post("/merge", formData, {
        responseType: "blob",
        signal: abortRef.current.signal,
      });

      setDownloadUrl(URL.createObjectURL(resp.data));
    } catch {
      setError("Merge failed");
    }
    setLoading(false);
  };

  return (
    <div className="card p-4">
      <h3>Merge PDFs</h3>
      
      <FileUploader onFilesSelected={handleFiles} accept="application/pdf" multiple />
      {selectedFiles.length > 0 && (
        <ul className="list-group mt-2">
          {selectedFiles.map((f, i) => (
            <li key={i} className="list-group-item d-flex justify-content-between">
              {f.name}
              <button className="btn btn-sm btn-outline-danger" onClick={() => setSelectedFiles(prev => prev.filter((_, idx) => idx !== i))}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-3 d-flex gap-2">
      <button className="btn btn-primary" onClick={handleAction} disabled={loading}>
        {loading ? "Merging..." : "Merge PDFs"}
      </button>

      
      {downloadUrl && (
        <a className="btn btn-success " href={downloadUrl} download="merged.pdf">
          Download
        </a>
      )}
      </div>
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
}
