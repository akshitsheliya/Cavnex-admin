import html2pdf from "html2pdf.js";

export const generatePDF = async (
  elementId,
  filename = "agreement.pdf",
  options = {}
) => {
  const element = document.getElementById(elementId);

  if (!element) {
    throw new Error("Element not found");
  }

  const defaultOptions = {
    margin: [10, 10, 10, 10],
    filename: filename,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    },
    pagebreak: { mode: ["avoid-all", "css", "legacy"] },
  };

  const mergedOptions = { ...defaultOptions, ...options };

  try {
    await html2pdf().set(mergedOptions).from(element).save();
    return true;
  } catch (error) {
    console.error("PDF generation failed:", error);
    throw error;
  }
};

export const generatePDFBlob = async (elementId, options = {}) => {
  const element = document.getElementById(elementId);

  if (!element) {
    throw new Error("Element not found");
  }

  const defaultOptions = {
    margin: [10, 10, 10, 10],
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    },
  };

  const mergedOptions = { ...defaultOptions, ...options };

  try {
    const blob = await html2pdf()
      .set(mergedOptions)
      .from(element)
      .outputPdf("blob");
    return blob;
  } catch (error) {
    console.error("PDF generation failed:", error);
    throw error;
  }
};

export const printDocument = (elementId) => {
  const element = document.getElementById(elementId);

  if (!element) {
    throw new Error("Element not found");
  }

  const printWindow = window.open("", "_blank");

  printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Print Agreement</title>
            <style>
                body {
                    font-family: 'Times New Roman', Times, serif;
                    line-height: 1.6;
                    color: #000;
                    background: #fff;
                    padding: 20mm;
                }
                h1 { font-size: 24px; text-align: center; margin-bottom: 30px; }
                h2 { font-size: 18px; margin-top: 20px; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
                h3 { font-size: 16px; margin-top: 15px; }
                p { margin: 10px 0; text-align: justify; }
                ul { margin: 10px 0 10px 20px; }
                li { margin: 5px 0; }
                .signature-section { margin-top: 50px; display: flex; justify-content: space-between; }
                .signature-box { width: 45%; }
                .signature-line { border-top: 1px solid #000; margin-top: 60px; padding-top: 10px; }
                @media print {
                    body { padding: 0; }
                    @page { margin: 20mm; }
                }
            </style>
        </head>
        <body>
            ${element.innerHTML}
        </body>
        </html>
    `);

  printWindow.document.close();
  printWindow.focus();

  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
};
