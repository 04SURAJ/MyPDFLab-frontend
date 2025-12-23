import React, { useState, useRef } from "react";
import FileUploader from "../FileUploader";
import api from "../../utils/api"; 

export default function CompressTool() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [quality, setQuality] = useState(75);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);
  const [downloadName, setDownloadName] = useState("");

  const handleFile = (files) => {
    const file = files[0];
    if (!file || file.type !== "application/pdf") return setError("Select a PDF file");
    setSelectedFile(file);
    setDownloadUrl(null);
    setError(null);
  };

  const handleAction = async () => {
    if (!selectedFile) return setError("Select a PDF file first");
    setLoading(true);
    setError(null);
    setDownloadUrl(null);

    try {
      const formData = new FormData();
      formData.append("pdf", selectedFile);
      formData.append("quality", quality);

      abortRef.current = new AbortController();
      const resp = await api.post("/compress", formData, {
        responseType: "blob",
        signal: abortRef.current.signal,
      });

      const downloadName = selectedFile.name.replace(".pdf","") + "-compressed.pdf";
      setDownloadUrl(URL.createObjectURL(resp.data));
      setDownloadName(downloadName);
    } catch (err) {
      console.error(err);
      setError("Compression failed. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="card p-4">
      <h3>Compress PDF</h3>

<FileUploader
  onFilesSelected={handleFile}
  accept="application/pdf"
  fileName={selectedFile ? selectedFile.name : ""}
/>
      {selectedFile && (
        <div className="mt-2">
          <label>Quality: {quality}%</label>
          <input type="range" min={10} max={100} value={quality} onChange={e => setQuality(Number(e.target.value))} className="form-range" />
        </div>
      )}

      <div className="mt-3 d-flex gap-2">
        <button className="btn btn-primary" onClick={handleAction} disabled={loading}>
          {loading ? "Processing..." : "Compress PDF"}
        </button>

        {loading && (
          <button className="btn btn-outline-secondary" onClick={() => abortRef.current?.abort()}>
            Cancel
          </button>
        )}
      

      

      {downloadUrl && (
        <a className="btn btn-success " href={downloadUrl} download={selectedFile?.name.replace(".pdf","") + "-compressed.pdf"}>
          Download
        </a>
      )}
    </div>
    {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
}
