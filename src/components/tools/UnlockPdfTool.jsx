import React, { useState } from "react";
import FileUploader from "../FileUploader";
import api from "../../utils/api";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function UnlockPdfTool() {
  const [pdfFile, setPdfFile] = useState(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [needsPassword, setNeedsPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState(null);

  const handlePdf = (files) => {
    const file = files?.[0];
    if (!file || file.type !== "application/pdf") {
      return setError("Select a valid PDF file");
    }
    setPdfFile(file);
    setNeedsPassword(false);
    setDownloadUrl(null);
    setError(null);
  };

  const handleUnlock = async () => {
  if (!pdfFile) return setError("Upload a PDF first");

  setLoading(true);
  setError(null);

  try {
    const formData = new FormData();
    formData.append("pdf", pdfFile);
    if (password) formData.append("password", password);

    const resp = await api.post("/unlock", formData, {
      responseType: "blob",
      validateStatus: () => true,
    });

    /* Password required (first time) */
    if (resp.status === 401 && !password) {
      setNeedsPassword(true);
      setError(null);
      return;
    }

    /* Wrong password */
    if (resp.status === 401 && password) {
      setError("Incorrect password. Please try again.");
      return;
    }

    /* Success */
    const blobUrl = URL.createObjectURL(
      new Blob([resp.data], { type: "application/pdf" })
    );
    setDownloadUrl(blobUrl);
  } catch (err) {
    console.error(err);
    setError("Failed to unlock PDF");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="card p-4">
      <h3>Remove password from PDF file</h3>

      <FileUploader
        onFilesSelected={handlePdf}
        accept="application/pdf"
        fileName={pdfFile?.name}
      />

      {/* Password required message */}
      {needsPassword && (
        <div className="mt-4">
          <div className="alert alert-warning p-2">
            Some files require password
          </div>

          <label className="fw-bold">Enter password</label>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="PDF password"
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
      )}
        <div className="mt-3 d-flex gap-2">
      <button
        className="btn btn-primary"
        disabled={!pdfFile || loading}
        onClick={handleUnlock}
      >
        {loading ? "Processing..." : needsPassword ? "Send" : "Unlock PDF"}
      </button>

      {downloadUrl && (
        
          <a  className="btn btn-success"
            href={downloadUrl}
            download="unlocked.pdf"
            
          >
            Download 
          </a>
       
        
      )}
</div>
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
    
  );
}
