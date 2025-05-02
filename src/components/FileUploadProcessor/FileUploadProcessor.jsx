import { useState } from "react";
import mammoth from "mammoth";
import "./FileUploadProcessor.css";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import pdf from '/public/images/pdf_file_icon.png';
import docx from '/public/images/doc_file_icon.png';
import txt from '/public/images/txt_file_icon.png';

import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf.worker.min.js";

const FileUploadProcessor = ({ onExtractedText }) => {
  const [status, setStatus] = useState(null);
  const [fileName, setFileName] = useState("");

  const handleFile = async (e) => {
    const file = e.target.files[0];
    setFileName(file.name);
    if (!file) return;

    console.log(file);

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
      onExtractedText(extractedText); // Pass to AI assistant for summarizing or quiz generation
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

  const setImg = (fileName) => {
    if (fileName.endsWith(".pdf")) return pdf;
    if (fileName.endsWith(".docx") || fileName.endsWith(".doc")) return docx;
    if (fileName.endsWith(".txt")) return txt;
    return "";
  };
    
    const displayFileName = () => {
      if (fileName.length > 20) {
        return fileName.substring(0, 10) + "..." + fileName.substring(fileName.length - 10);
      }
      return fileName;
    };

  return (
    <div className="file-upload-wrapper">
      <label htmlFor="file" className="file-upload-container">
        <div className="label-left">
          <UploadFileOutlinedIcon
            style={{ fontSize: "3rem", color: "#e74c3c" }}
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
      { status && <div className="file-name">
        <img src={setImg(fileName)} alt="" />
        <p>{displayFileName()}</p>
      </div>}
    </div>
  );
};

export default FileUploadProcessor;
