import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const generatePDF = async (elementId, filename = "Health_Report.pdf") => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error("Element not found");
    return;
  }

  try {
    // We add a temporary class to the element to style it specifically for printing if needed
    element.classList.add("pdf-export-mode");
    
    // Capture the element as an image using html2canvas
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better resolution
      useCORS: true, // Allow cross-origin images (like external SVGs)
      logging: false,
      backgroundColor: "#fdf8f0", // Match the cream background
    });
    
    element.classList.remove("pdf-export-mode");

    const imgData = canvas.toDataURL("image/png");
    
    // Calculate PDF dimensions (A4 size)
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    
    const finalWidth = imgWidth * ratio;
    const finalHeight = imgHeight * ratio;
    
    // Center the image horizontally
    const marginX = (pdfWidth - finalWidth) / 2;
    // Add a slight top margin
    const marginY = 10;

    pdf.addImage(imgData, "PNG", marginX, marginY, finalWidth, finalHeight);
    
    // Allow dots in filename so we don't ruin the extension
    let safeFilename = filename.replace(/[^a-zA-Z0-9_.-]/g, "_");
    if (!safeFilename.toLowerCase().endsWith(".pdf")) {
      safeFilename += ".pdf";
    }

    // Use jsPDF's built-in save method which robustly handles browser quirks
    // and ensures the proper filename and .pdf extension are applied.
    pdf.save(safeFilename);
    
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};
