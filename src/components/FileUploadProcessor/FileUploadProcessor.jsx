import { useState } from "react";

import mammoth from "mammoth";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";

import pdf from "/images/pdf.png";
import docx from "/images/docx.png";
import txt from "/images/txt.png";

import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";

import "./FileUploadProcessor.css";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

const FileUploadProcessor = ({ onExtractedText }) => {
  const [status, setStatus] = useState(null);
  const [displayFileName, setDisplayFileName] = useState("");

  const handleFile = async (e) => {
    const file = e.target.files[0];
    const fileName = file.name;
    setDisplayFileName(file.name);
    if (!file) return;

    setStatus({ loading: true, message: "Uploading file..." });
    let extractedText = "";

    try {
      if (file.type === "application/pdf") {
        extractedText = await extractTextFromPDF(file);
      } else if (
        file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        extractedText = await extractTextFromDocx(file);
      } else if (file.type === "text/plain") {
        extractedText = await extractTextFromTxt(file);
      } else {
        throw new Error("Unsupported file type");
      }

      setStatus({ success: true, message: "File uploaded successfully" });
      onExtractedText(extractedText, fileName, setDisplayFileName, setStatus);
    } catch (error) {
      console.error(error);
      setStatus({ error: true, message: "Failed to upload file" });
    }
  };

  const extractTextFromPDF = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      const pageText = content.items.map((item) => item.str).join(" ");
      fullText += pageText + "\n";
    }

    return fullText;
  };

  const extractTextFromDocx = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  };

  const extractTextFromTxt = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const setImg = (displayFileName) => {
    if (displayFileName.endsWith(".pdf")) return pdf;
    if (displayFileName.endsWith(".docx") || displayFileName.endsWith(".doc"))
      return docx;
    if (displayFileName.endsWith(".txt")) return txt;
    return "";
  };

  const formatFileName = () => {
    if (displayFileName.length > 30) {
      return (
        displayFileName.substring(0, 15) +
        "..." +
        displayFileName.substring(displayFileName.length - 15)
      );
    }
    return displayFileName;
  };

  return (
    <div className="file-upload-wrapper">
      <label htmlFor="file" className="file-upload-container">
        <div className="label-left">
          <UploadFileOutlinedIcon
            style={{ fontSize: "3rem", color: "#FF7B00" }}
          />
        </div>
        <div className="label-right">
          <p>Upload notes</p>
          <span>(PDF, DOCX, TXT)</span>
        </div>
      </label>
      <input
        type="file"
        id="file"
        name="file"
        accept=".pdf,.docx,.txt"
        onChange={handleFile}
      />
      <p
        className={`file-upload-status ${
          status?.success ? "success" : status?.error ? "error" : ""
        }`}
      >
        {status?.message}
      </p>
      {status?.success && (
        <div className="file-name">
          <div className="">
            <img src={setImg(displayFileName)} alt="file icon" className="text-white" />
          </div>
          <p>{formatFileName()}</p>
        </div>
      )}
    </div>
  );
};

export default FileUploadProcessor;
