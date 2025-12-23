import React, { useState } from "react";
import FileUploader from "../FileUploader";
import api from "../../utils/api";

export default function PdfToPdfATool() {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfaLevel, setPdfaLevel] = useState("PDF/A-1b"); // default
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState(null);

  const handleFile = (files) => {
    const file = files[0];
    if (!file || file.type !== "application/pdf") {
      return setError("Select a valid PDF");
    }
    setPdfFile(file);
    setError(null);
    setDownloadUrl(null);
  };

  const handleConvert = async () => {
    if (!pdfFile) return setError("Upload a PDF first");

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("pdf", pdfFile);
      formData.append("pdfaLevel", pdfaLevel);

      const resp = await api.post("/pdf-to-pdfa", formData, {
        responseType: "blob",
      });

      setDownloadUrl(URL.createObjectURL(resp.data));
    } catch (err) {
      console.error(err);
      setError("Failed to convert PDF to PDF/A");
    }

    setLoading(false);
  };

  return (
    <div className="card p-4">
      <h3>Convert PDF to PDF/A</h3>

      <FileUploader
        onFilesSelected={handleFile}
        accept="application/pdf"
        fileName={pdfFile?.name}
      />

      <div className="mt-3">
        <label className="fw-bold">PDF/A Level</label>
        <select
          className="form-select"
          value={pdfaLevel}
          onChange={(e) => setPdfaLevel(e.target.value)}
        >
          <option value="PDF/A-1b">PDF/A-1b (Recommended)</option>
          <option value="PDF/A-2b">PDF/A-2b</option>
          <option value="PDF/A-3b">PDF/A-3b</option>
        </select>
      </div>
      <div className="mt-3 d-flex gap-2">
      <button
        className="btn btn-primary "
        disabled={!pdfFile || loading}
        onClick={handleConvert}
      >
        {loading ? "Converting..." : "Convert to PDF/A"}
      </button>

      {downloadUrl && (
        <a    className="btn btn-success "
          href={downloadUrl}
          download="pdfa.pdf"
         
        >
          Download 
        </a>
      )}
      </div>
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
}
