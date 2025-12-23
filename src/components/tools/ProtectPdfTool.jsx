import React, { useState } from "react";
import FileUploader from "../FileUploader";
import api from "../../utils/api";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function ProtectPdfTool() {
  const [pdfFile, setPdfFile] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
const [showPassword1, setShowPassword1] = useState(false);
const [showPassword2, setShowPassword2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState(null);

  const handlePdf = (files) => {
    const file = files?.[0];
    if (!file || file.type !== "application/pdf") {
      return setError("Select a valid PDF file");
    }
    setPdfFile(file);
    setError(null);
    setDownloadUrl(null);
  };

  /* ---------- Password Strength Logic ---------- */
  const getStrength = () => {
    let score = 0;
    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { label: "Weak", color: "danger", value: 25 };
    if (score === 2) return { label: "Medium", color: "warning", value: 60 };
    return { label: "Strong", color: "success", value: 100 };
  };

  const strength = getStrength();

  const handleProtect = async () => {
    if (!pdfFile) return setError("Upload a PDF first");
    if (password.length < 4) return setError("Password too short");
    if (password !== confirmPassword)
      return setError("Passwords do not match");

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("pdf", pdfFile);
      formData.append("userPassword", password);
      formData.append("ownerPassword", password);

      const resp = await api.post("/protect", formData, {
        responseType: "blob",
      });

      const blobUrl = URL.createObjectURL(
        new Blob([resp.data], { type: "application/pdf" })
      );
      setDownloadUrl(blobUrl);
    } catch (err) {
      console.error(err);
      setError("Failed to protect PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-4">
      <h3>Set a password to protect your PDF file</h3>

      <FileUploader
        onFilesSelected={handlePdf}
        accept="application/pdf"
        fileName={pdfFile?.name}
      />

      {/* Password Input */}
      <div className="mt-4">
        <label className="fw-bold">Type password</label>
        <div className="input-group">
          <input
            type={showPassword1 ? "text" : "password"}
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={() => setShowPassword1(!showPassword1)}
          >
            {showPassword1 ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {password && (
          <div className="mt-2">
            <div className="progress" style={{ height: "6px" }}>
              <div
                className={`progress-bar bg-${strength.color}`}
                style={{ width: `${strength.value}%` }}
              />
            </div>
            <small className={`text-${strength.color}`}>
              Strength: {strength.label}
            </small>
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div className="mt-3">
  <label className="fw-bold">Repeat password</label>

  <div className="input-group">
    <input
      type={showPassword2 ? "text" : "password"}
      className="form-control"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      placeholder="Repeat password"
    />
    <button
      className="btn btn-outline-secondary"
      type="button"
      onClick={() => setShowPassword2(!showPassword2)}
    >
      {showPassword2 ? <FaEyeSlash /> : <FaEye />}
    </button>
  </div>
</div>
        <div className="mt-3 d-flex gap-2">
      <button
        className="btn btn-primary "
        disabled={!pdfFile || loading}
        onClick={handleProtect}
      >
        {loading ? "Processing..." : "Protect PDF"}
      </button>

      {downloadUrl && (
        
          <a   className="btn btn-success"
            href={downloadUrl}
            download="protected.pdf"
            
          >
            Download 
          </a>
         
        
      )}
       </div>
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
}
