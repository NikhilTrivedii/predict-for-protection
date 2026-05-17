import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const generatePDF = async (
  elementId,
  filename = "Health_Report.pdf"
) => {
  const element = document.getElementById(elementId);

  if (!element) {
    console.error("Element not found");
    return;
  }

  try {
    // Optional print/export styling
    element.classList.add("pdf-export-mode");

    // Capture HTML as canvas
    const canvas = await html2canvas(element, {
      scale: 2, // Better quality
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: "#fdf8f0",
    });

    element.classList.remove("pdf-export-mode");

    // Convert canvas to image
    const imgData = canvas.toDataURL("image/png");

    // Create PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // PDF dimensions
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Canvas dimensions
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    // Scale image to fit inside PDF
    const ratio = Math.min(
      pdfWidth / imgWidth,
      pdfHeight / imgHeight
    );

    const finalWidth = imgWidth * ratio;
    const finalHeight = imgHeight * ratio;

    // Center image
    const marginX = (pdfWidth - finalWidth) / 2;
    const marginY = 10;

    // Add image to PDF
    pdf.addImage(
      imgData,
      "PNG",
      marginX,
      marginY,
      finalWidth,
      finalHeight
    );

    // Safe filename
    let safeFilename = filename.replace(/[^a-zA-Z0-9_.-]/g, "_");

    if (!safeFilename.toLowerCase().endsWith(".pdf")) {
      safeFilename += ".pdf";
    }

    // Download PDF (BEST METHOD)
    pdf.save(safeFilename);

  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};