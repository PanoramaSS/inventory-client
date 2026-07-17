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

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);

  doc.text(
    `Professional Payslip`,
    88,
    63
  );

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");

  doc.text(
    `Payslip for the period of ${formData.payPeriod}`,
    66,
    69
  );

  //-------------------------------------------------------
  // HEADER DIVIDER
  //-------------------------------------------------------

  doc.line(
    15,
    73,
    210,
    73
  );

    //-------------------------------------------------------
  // EMPLOYEE DETAILS
  //-------------------------------------------------------

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);

  // Left Side
  doc.text("Employee ID", 20, 82);
  doc.text("Invoice Number", 20, 89);
  doc.text("Bank Name", 20, 96);

  // Right Side
  doc.text("Employee Name", 115, 82);
  doc.text("Invoice Date", 115, 89);
  doc.text("Pay Date", 115, 96);

  doc.setFont("helvetica", "normal");

  doc.text(`: ${formData.employeeId}`, 58, 82);

  doc.text(
    `: ${formData.invoiceNumber}`,
    58,
    89
  );

  doc.text(
    `: ${formData.bankName}`,
    58,
    96
  );

  doc.text(
    `: ${formData.employeeName}`,
    153,
    82
  );

  doc.text(
    `: ${formData.invoiceDate}`,
    153,
    89
  );

  doc.text(
    `: ${formData.payDate}`,
    153,
    96
  );

  //-------------------------------------------------------
  // TABLE HEADER
  //-------------------------------------------------------

  doc.line(15, 103, 210, 103);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);

  doc.text("Description", 20, 110);

  doc.text(
    "Amount",
    190,
    110,
    {
      align: "right",
    }
  );

  doc.line(15, 114, 210, 114);

  //-------------------------------------------------------
  // PAY DETAILS
  //-------------------------------------------------------

  let y = 122;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  //-------------------------------------------------------
  // PAY PERIOD
  //-------------------------------------------------------

  doc.text(
    "Pay Period",
    20,
    y
  );

  doc.text(
    formData.payPeriod,
    190,
    y,
    {
      align: "right",
    }
  );

  y += 8;

  //-------------------------------------------------------
  // TOTAL PAY
  //-------------------------------------------------------

  doc.text(
    "Total Pay",
    20,
    y
  );

  doc.text(
    formatAmount(formData.totalPay),
    190,
    y,
    {
      align: "right",
    }
  );

  y += 8;

  //-------------------------------------------------------
  // TDS
  //-------------------------------------------------------

  doc.text(
    "TDS",
    20,
    y
  );

  doc.text(
    formatAmount(formData.tds),
    190,
    y,
    {
      align: "right",
    }
  );

  y += 8;

  //-------------------------------------------------------
  // GST
  //-------------------------------------------------------

  doc.text(
    "GST",
    20,
    y
  );

  if (formData.gst === "18") {
    doc.text(
        `${formatAmount(formData.gstAmount)} (18%)`,
        190,
        y,
        {
        align: "right",
        }
    );
    } else {
    doc.text(
      "Not Applicable",
      190,
      y,
      {
        align: "right",
      }
    );
  }

  y += 10;

  //-------------------------------------------------------
  // DIVIDER
  //-------------------------------------------------------

  doc.line(
    15,
    y,
    210,
    y
  );

  y += 10;

  //-------------------------------------------------------
  // NET PAY
  //-------------------------------------------------------

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);

  doc.text(
    "Net Pay",
    20,
    y
  );

  doc.text(
    formatAmount(formData.netPay),
    190,
    y,
    {
      align: "right",
    }
  );

  y += 8;

  //-------------------------------------------------------
  // GRAND TOTAL DIVIDER
  //-------------------------------------------------------

  doc.line(
    15,
    y,
    210,
    y
  );

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

  if (formData.gst === "18") {
    y += 6;

    doc.setFontSize(7.5);
    doc.setTextColor(120);

    doc.text(
      "* GST has been calculated at 18% for invoice reference.",
      20,
      y
    );

    doc.setTextColor(0);
  }

  //-------------------------------------------------------
  // GENERATE PDF BLOB
  //-------------------------------------------------------

  const pdfBlob = doc.output("blob");

  const url = URL.createObjectURL(pdfBlob);

  return url;
};

export default generateProfessionalPDF;