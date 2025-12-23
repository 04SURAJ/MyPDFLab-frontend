import React, { useState, useRef } from "react";
import FileUploader from "../FileUploader";
import api from "../../utils/api"; 

export default function SplitTool() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fromPage, setFromPage] = useState(1);
  const [toPage, setToPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const handleFile = async (files) => {
    const file = files[0];
    if (!file || file.type !== "application/pdf") return setError("Select a PDF file");
    setSelectedFile(file);
    setDownloadUrl(null);
    setError(null);

    // Optional: Read total pages using pdf-lib
    try {
      const { PDFDocument } = await import("pdf-lib");
      const buffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(buffer);
      setTotalPages(pdf.getPageCount());
      setFromPage(1);
      setToPage(pdf.getPageCount());
    } catch (err) {
      console.error(err);
      setError("Invalid PDF");
    }
  };

  const handleSplit = async () => {
    if (!selectedFile) return setError("Select a PDF file first");
    setLoading(true);
    setError(null);
    setDownloadUrl(null);

    try {
      const formData = new FormData();
      formData.append("pdf", selectedFile);
      formData.append("fromPage", fromPage);
      formData.append("toPage", toPage);

      abortRef.current = new AbortController();
      const resp = await api.post("/split", formData, {
        responseType: "blob",
        signal: abortRef.current.signal,
      });

      setDownloadUrl(URL.createObjectURL(resp.data));
    } catch (err) {
      console.error(err);
      setError("Split failed");
    }
    setLoading(false);
  };

  return (
    <div className="card p-4">
      <h3>Split PDF</h3>

<FileUploader
  onFilesSelected={handleFile}
  accept="application/pdf"
  fileName={selectedFile ? selectedFile.name : ""}
/>
      {selectedFile && (
        <div className="mt-2 d-flex gap-2">
          <input type="number" min={1} max={totalPages} value={fromPage} onChange={e => setFromPage(Number(e.target.value))} className="form-control" />
          <input type="number" min={1} max={totalPages} value={toPage} onChange={e => setToPage(Number(e.target.value))} className="form-control" />
        </div>
      )}

      <div className="mt-3 d-flex gap-2">
        <button className="btn btn-primary" onClick={handleSplit} disabled={loading}>
          {loading ? "Processing..." : "Split PDF"}
        </button>
        {loading && (
          <button className="btn btn-outline-secondary" onClick={() => abortRef.current?.abort()}>
            Cancel
          </button>
        )}
      

      
      {downloadUrl && (
        <a className="btn btn-success" href={downloadUrl} download={selectedFile?.name.replace(".pdf","") + "-split.pdf"}>
          Download
        </a>
      )}
      </div>
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
}
