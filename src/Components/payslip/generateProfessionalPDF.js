import { jsPDF } from "jspdf";

const formatAmount = (value) =>
  `${new Intl.NumberFormat("en-IN").format(Number(value || 0))}.00`;

export const generateProfessionalPDF = (formData) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [270, 225],
  });

  //-------------------------------------------------------
  // OUTER BORDER
  //-------------------------------------------------------

  doc.setDrawColor(0);
  doc.setLineWidth(0.4);
  doc.rect(15, 30, 195, 140);

  //-------------------------------------------------------
  // LOGO
  //-------------------------------------------------------

  const logo = "./images/panorama.png";

  doc.addImage(
    logo,
    "PNG",
    20,
    37,
    51,
    11
  );

  //-------------------------------------------------------
  // WATERMARK
  //-------------------------------------------------------

  const watermark = "./images/pano-logo-30.png";

  doc.addImage(
    watermark,
    "PNG",
    60,
    88,
    100,
    22
  );

  //-------------------------------------------------------
  // COMPANY DETAILS
  //-------------------------------------------------------

  const companyName = formData.includePvtLtd
    ? "Panorama Software Solutions Pvt Ltd"
    : "Panorama Software Solutions";

  const address1 =
    "621-622, Tower 1, Assotech Business Cresterra";

  const address2 =
    "Sector-135, Noida-201301, Uttar Pradesh";

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);

  const longestWidth = Math.max(
    (doc.getStringUnitWidth(companyName) * 11) /
      doc.internal.scaleFactor,
    (doc.getStringUnitWidth(address1) * 9) /
      doc.internal.scaleFactor,
    (doc.getStringUnitWidth(address2) * 9) /
      doc.internal.scaleFactor
  );

  const rightX = 220 - 15 - longestWidth;

  doc.text(companyName, rightX, 40);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  doc.text(address1, rightX, 45);

  doc.text(address2, rightX, 50);

  //-------------------------------------------------------
  // TITLE
  //-------------------------------------------------------

  // doc.setFont("helvetica", "bold");
  // doc.setFontSize(11);

  // doc.text(
  //   `Professional Payslip`,
  //   88,
  //   63
  // );

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");

  doc.text(
    `Payslip for the period of ${formData.payPeriod}`,
    74,
    62
  );

  //-------------------------------------------------------
  // HEADER DIVIDER
  //-------------------------------------------------------

  // doc.line(
  //   15,
  //   73,
  //   210,
  //   73
  // );

    //-------------------------------------------------------
  // EMPLOYEE DETAILS
  //-------------------------------------------------------

  // doc.setFont("helvetica", "bold");
  doc.setFontSize(9);

  // Left Side
  doc.text("Employee ID", 20, 71);
  doc.text("Invoice Number", 20, 78);
  doc.text("Bank Name", 20, 85);

  // Right Side
  doc.text("Employee Name", 115, 71);
  doc.text("Invoice Date", 115, 78);
  doc.text("Pay Date", 115, 85);

  doc.setFont("helvetica", "normal");

  doc.text(`: ${formData.employeeId}`, 58, 71);

  doc.text(
    `: ${formData.invoiceNumber}`,
    58,
    78
  );

  doc.text(
    `: ${formData.bankName}`,
    58,
    85
  );

  doc.text(
    `: ${formData.employeeName}`,
    153,
    71
  );

  doc.text(
    `: ${formData.invoiceDate}`,
    153,
    78
  );

  doc.text(
    `: ${formData.payDate}`,
    153,
    85
  );

    //-------------------------------------------------------
    // TABLE HEADER
    //-------------------------------------------------------

    doc.line(15, 100, 210, 100);
    doc.line(15, 110, 210, 110);

    // vertical divider (same as existing payslip)
    doc.line(110, 100, 110, 147);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);

    doc.text("Earnings", 20, 106);
    doc.text("Amount", 83, 106);

    doc.text("Deductions", 115, 106);
    doc.text("Amount", 175, 106);

    //-------------------------------------------------------
    // ROW 1
    //-------------------------------------------------------

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    // LEFT

    doc.text(
      `Pay Period (${formData.payPeriod})`,
      20,
      116
    );

    doc.text(
      formatAmount(formData.totalPay),
      95,
      116,
      { align: "right" }
    );

    // RIGHT

    doc.text("TDS",115,116);

    doc.text(
      formatAmount(formData.tds),
      187,
      116,
      { align:"right" }
    );

    //-------------------------------------------------------
    // ROW 2 (GST)
    //-------------------------------------------------------

    doc.text(
      formData.gst === "18"
        ? "GST (18%)"
        : "GST",
      20,
      124
    );

    const gstAmount =
      formData.gst === "18"
        ? Number(formData.totalPay) * 0.18
        : 0;

    doc.text(
      formData.gst === "18"
        ? formatAmount(gstAmount)
        : "Not Applicable",
      95,
      124,
      {
        align:"right"
      }
    );

    //-------------------------------------------------------
    // Divider
    //-------------------------------------------------------

    doc.line(15,140,210,140);

    //-------------------------------------------------------
    // TOTALS
    //-------------------------------------------------------

    // const totalEarnings =
    //   Number(formData.totalPay) +
    //   (formData.gst === "18"
    //       ? Number(formData.gstAmount)
    //       : 0);

    const totalEarnings =
      Number(formData.totalPay || 0) + gstAmount;

    const totalDeductions =
      Number(formData.tds || 0);

    const netPay =
      totalEarnings - totalDeductions;

    doc.setFont("helvetica","bold");

    doc.text(
      "Total Earnings (Rounded)",
      20,
      145
    );

    doc.text(
      formatAmount(totalEarnings),
      95,
      145,
      {
        align:"right"
      }
    );

    doc.text(
      "Total Deductions",
      115,
      145
    );

    doc.text(
      formatAmount(totalDeductions),
      187,
      145,
      {
        align: "right",
      }
    );

    //-------------------------------------------------------
    // Bottom Divider
    //-------------------------------------------------------

    doc.line(15,147,210,147);

    //-------------------------------------------------------
    // NET PAY
    //-------------------------------------------------------

    doc.text(
      "Net Pay (Rounded)",
      115,
      152
    );

    doc.text(
      formatAmount(netPay),
      187,
      152,
      {
        align: "right",
      }
    );

    //-------------------------------------------------------
    // Footer Divider
    //-------------------------------------------------------

    doc.line(15,160,210,160);

    let y = 153.5;

    //-------------------------------------------------------
  // FOOTER
  //-------------------------------------------------------

  y += 12;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  doc.text(
    "Message: This is a computer generated document and does not require signature.",
    20,
    y
  );

  //-------------------------------------------------------
  // OPTIONAL NOTES
  //-------------------------------------------------------

  // if (formData.gst === "18") {
  //   y += 6;

  //   doc.setFontSize(7.5);
  //   doc.setTextColor(120);

  //   doc.text(
  //     "* GST has been calculated at 18% for invoice reference.",
  //     20,
  //     y
  //   );

  //   doc.setTextColor(0);
  // }

  //-------------------------------------------------------
  // GENERATE PDF BLOB
  //-------------------------------------------------------

  const pdfBlob = doc.output("blob");

  const url = URL.createObjectURL(pdfBlob);

  return url;
};

export default generateProfessionalPDF;