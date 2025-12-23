import React, { useState, useRef } from "react";
import FileUploader from "../FileUploader";
import api from "../../utils/api";

export default function CropTool() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [crop, setCrop] = useState({
    top: 40,
    bottom: 40,
    left: 40,
    right: 40,
  });
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const handleFile = (files) => {
    const file = files[0];
    if (!file || file.type !== "application/pdf") {
      return setError("Select a valid PDF file");
    }
    setSelectedFile(file);
    setDownloadUrl(null);
    setError(null);
  };

  const handleCrop = async () => {
    if (!selectedFile) return setError("Upload a PDF first");

    setLoading(true);
    setError(null);
    setDownloadUrl(null);

    try {
      const formData = new FormData();
      formData.append("pdf", selectedFile);
      formData.append("crop", JSON.stringify(crop));

      abortRef.current = new AbortController();
      const res = await api.post("/crop", formData, {
        responseType: "blob",
        signal: abortRef.current.signal,
      });

      setDownloadUrl(URL.createObjectURL(res.data));
    } catch (err) {
      console.error(err);
      setError("Crop failed");
    }

    setLoading(false);
  };

  return (
    <div className="card p-4">
      <h3>Crop PDF</h3>

      <FileUploader
        onFilesSelected={handleFile}
        accept="application/pdf"
        fileName={selectedFile ? selectedFile.name : ""}
      />

      {selectedFile && (
        <div className="row mt-3">
          {["top", "bottom", "left", "right"].map((key) => (
            <div className="col-6 col-md-3 mb-2" key={key}>
              <label className="form-label">{key}</label>
              <input
                type="number"
                className="form-control"
                value={crop[key]}
                onChange={(e) =>
                  setCrop({ ...crop, [key]: Number(e.target.value) })
                }
                min={0}
              />
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 d-flex gap-2">
        <button
          className="btn btn-primary"
          onClick={handleCrop}
          disabled={loading}
        >
          {loading ? "Processing..." : "Crop PDF"}
        </button>
        {loading && (
          <button
            className="btn btn-outline-secondary"
            onClick={() => abortRef.current?.abort()}
          >
            Cancel
          </button>
        )}
      

      

      {downloadUrl && (
        <a
          className="btn btn-success "
          href={downloadUrl}
          download={
            selectedFile?.name.replace(".pdf", "") + "-cropped.pdf"
          }
        >
          Download PDF
        </a>
      )}
    </div>
    {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
}
