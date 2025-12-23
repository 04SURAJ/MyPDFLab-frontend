import React, { useState, useRef } from "react";
import FileUploader from "../FileUploader";
import api from "../../utils/api";

export default function ExtractTextTool() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [pagesText, setPagesText] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const abortRef = useRef(null);

  /* ---------- LOAD FILE ---------- */
  const handleFile = (files) => {
    const file = files[0];
    if (!file || file.type !== "application/pdf") {
      return setError("Select a valid PDF");
    }

    setSelectedFile(file);
    setError(null);
    setPagesText([]);
  };

  /* ---------- EXTRACT ---------- */
  const handleExtract = async () => {
    if (!selectedFile) return setError("Upload a PDF first");

    setLoading(true);
    setError(null);
    setPagesText([]);

    try {
      const formData = new FormData();
      formData.append("pdf", selectedFile);

      abortRef.current = new AbortController();

      const resp = await api.post("/extract-text", formData, {
        signal: abortRef.current.signal,
      });

      setPagesText(resp.data.pages || []);
    } catch {
      setError("Text extraction failed");
    }

    setLoading(false);
  };

  /* ---------- COPY / DOWNLOAD ---------- */
  const fullText = pagesText.map((p) => p.text).join("\n\n");

  const copyText = () => {
    if (!fullText) return;

    const textarea = document.createElement("textarea");
    textarea.value = fullText;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "absolute";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);

    textarea.select();
    let success = false;
    try {
      success = document.execCommand("copy");
    } catch (err) {
      console.error("Copy failed:", err);
    }
    document.body.removeChild(textarea);

    setToast({
      show: true,
      message: success ? "Text copied successfully!" : "Copy failed, please try manually",
      type: success ? "success" : "danger",
    });
  };

  const downloadTxt = () => {
    const blob = new Blob([fullText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "extracted-text.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ---------- UI ---------- */
  return (
    <div className="card p-4">
      <h3>Extract Text from PDF</h3>

      <FileUploader
        onFilesSelected={handleFile}
        accept="application/pdf"
        fileName={selectedFile ? selectedFile.name : ""}
      />
       <div className="mt-3 d-flex gap-2">
      <button
        className="btn btn-primary "
        onClick={handleExtract}
        disabled={loading}
      >
        {loading ? "Extracting..." : "Extract Text"}
      </button>
</div>
      {error && <div className="alert alert-danger mt-3">{error}</div>}

      {pagesText.length > 0 && (
        <>
          <div className="mt-3 d-flex gap-2">
            <button className="btn btn-outline-secondary" onClick={copyText}>
              Copy Text
            </button>
            <button className="btn btn-outline-success" onClick={downloadTxt}>
              Download .txt
            </button>
          </div>

          <div className="mt-4">
            <textarea
              className="form-control"
              rows={10}
              value={fullText}
              readOnly
            />
          </div>
        </>
      )}

      {/* ---------- Bootstrap Toast ---------- */}
      {toast.show && (
        <div
          className={`toast align-items-center text-bg-${toast.type} border-0 show position-fixed top-0 end-0 m-3`}
          role="alert"
        >
          <div className="d-flex">
            <div className="toast-body">{toast.message}</div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              onClick={() => setToast({ ...toast, show: false })}
            ></button>
          </div>
        </div>
      )}
    </div>
  );
}
