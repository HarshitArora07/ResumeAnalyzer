// backend/testPdf.js
import fs from "fs";
import path from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

const filePath = path.join("uploads", "1771620346590.pdf"); // use your actual uploaded filename
const buffer = fs.readFileSync(filePath);

pdfParse(buffer)
  .then((data) => {
    console.log("PDF parsed text:", data.text.slice(0, 200)); // first 200 chars
  })
  .catch((err) => console.error("PDF parse error:", err));