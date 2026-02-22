// src/services/resumeParser.service.js
import fs from "fs";
import path from "path";
import mammoth from "mammoth";
import pdfParse from "pdf-parse";

export async function parseResume(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  try {
    if (ext === ".pdf") {
      const buffer = fs.readFileSync(filePath);
      const data = await pdfParse(buffer);
      return data.text;
    } 
    else if (ext === ".docx") {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    } 
    else {
      throw new Error("Unsupported file type. Only PDF and DOCX are allowed.");
    }
  } catch (err) {
    console.error("Error parsing resume:", err);
    throw err;
  }
}