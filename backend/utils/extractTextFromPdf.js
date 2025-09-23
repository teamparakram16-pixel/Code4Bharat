import PDFParser from "pdf2json";
import ExpressError from "./expressError.js";

const extractPdfText = (buffer) => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (err) => {
      reject(new ExpressError(400, "PDF parsing error: " + err.parserError));
    });

    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      try {
        const pages = pdfData?.Pages || [];
        const text = pages
          .map((page) =>
            page.Texts.map((textItem) =>
              decodeURIComponent(textItem.R.map((r) => r.T).join(""))
            ).join(" ")
          )
          .join("\n");

        resolve(text);
      } catch (err) {
        reject(new ExpressError(500, "Failed to extract PDF text: " + err));
      }
    });

    pdfParser.parseBuffer(buffer);
  });
};

export default extractPdfText;
