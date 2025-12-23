// src/pages/ToolPage.jsx
import React from "react";
import { useParams } from "react-router-dom";

// Import all tool components
import MergeTool from "../components/tools/MergeTool";
import SplitTool from "../components/tools/SplitTool";
import CompressTool from "../components/tools/CompressTool";
import RotateTool from "../components/tools/RotateTool";
import PdfToImagesTool from "../components/tools/PdfToImagesTool";
import ImagesToPdfTool from "../components/tools/ImagesToPdfTool";
import ReorderTool from "../components/tools/ReorderPdfTool";
import DeletePdfTool from "../components/tools/DeletePdfTool";
import ExtractTextTool from "../components/tools/ExtractTextTool";
import AddWatermarkTool from "../components/tools/AddWatermarkTool";
import ProtectPdfTool from "../components/tools/ProtectPdfTool";
import UnlockPdfTool from "../components/tools/UnlockPdfTool";
import AddPageNumbersTool from "../components/tools/AddPageNumbersTool";
import PdfToPdfATool from "../components/tools/PdfToPdfATool";
import CropTool from "../components/tools/CropTool";


const toolComponents = {
  merge: MergeTool,
  split: SplitTool,
  compress: CompressTool,
  rotate: RotateTool,
  "pdf-to-images": PdfToImagesTool,
  "images-to-pdf": ImagesToPdfTool,
  "reorder-pdf": ReorderTool,
  "delete-pdf": DeletePdfTool,
    "extract-text": ExtractTextTool,
     "add-watermark": AddWatermarkTool,
    "protect-pdf": ProtectPdfTool,
    "unlock-pdf": UnlockPdfTool,
    "add-page-numbers": AddPageNumbersTool,
    "pdf-to-pdfa": PdfToPdfATool,
     "crop-pdf": CropTool,
};

export default function ToolPage() {
  const { mode } = useParams();
  const ToolComponent = toolComponents[mode];

  if (!ToolComponent) return <div className="container mt-5"><h3>Tool not found</h3></div>;

  return (
    <div className="container mt-5">
      <ToolComponent />
    </div>
  );
}
