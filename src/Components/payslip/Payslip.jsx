import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";

import DashboardPdf from "../../Components/DashboardPdf";
import PayslipForm from "./PayslipForm";
import ProfessionalPayslipForm from "./ProfessionalPayslipForm";
import generateProfessionalPDF from "./generateProfessionalPDF";

const Payslip = () => {
  const [pdfUrl, setPdfUrl] = useState("");

  const [formData, setFormData] = useState(null);

  const [showForm, setShowForm] = useState(false);

  const [showProfessionalForm, setShowProfessionalForm] =
    useState(false);

  const [isProfessional, setIsProfessional] =
    useState(false);

  //----------------------------------------------------------
  // Cleanup Blob URL
  //----------------------------------------------------------

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  //----------------------------------------------------------
  // Existing Payslip Generator
  //----------------------------------------------------------

  const generatePDF = (data = formData) => {
    if (!data) return null;

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [270, 225],
    });

    //----------------------------------------------------------
    // Border
    //----------------------------------------------------------

    doc.rect(15, 30, 195, 140);

    //----------------------------------------------------------
    // Logo
    //----------------------------------------------------------

    const logo = "./images/panorama.png";

    doc.addImage(
      logo,
      "PNG",
      20,
      37,
      51,
      11
    );

    //----------------------------------------------------------
    // Watermark
    //----------------------------------------------------------

    const watermark = "./images/pano-logo-30.png";

    doc.addImage(
      watermark,
      "PNG",
      60,
      90,
      100,
      22
    );

    //----------------------------------------------------------
    // Company
    //----------------------------------------------------------

    const companyName =
      data.includePvtLtd
        ? "Panorama Software Solutions Pvt Ltd"
        : "Panorama Software Solutions";

    const addressLine1 =
      "621-622, Tower 1, Assotech Business Cresterra";

    const addressLine2 =
      "Sector-135, Noida-201301, Uttar Pradesh";

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);

    const longestLineWidth = Math.max(
      (doc.getStringUnitWidth(companyName) * 11) /
        doc.internal.scaleFactor,

      (doc.getStringUnitWidth(addressLine1) * 9) /
        doc.internal.scaleFactor,

      (doc.getStringUnitWidth(addressLine2) * 9) /
        doc.internal.scaleFactor
    );

    const textX =
      220 -
      15 -
      longestLineWidth;

    doc.text(
      companyName,
      textX,
      40
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    doc.text(
      addressLine1,
      textX,
      45
    );

    doc.text(
      addressLine2,
      textX,
      50
    );

    //----------------------------------------------------------
    // Title
    //----------------------------------------------------------

    doc.setFontSize(10);

    const payPeriod =
      data.payPeriod || "Invalid date";

    doc.text(
      `Payslip for the period of ${payPeriod}`,
      80,
      65
    );

    //----------------------------------------------------------
    // Employee Details
    //----------------------------------------------------------

    doc.setFontSize(9);

    doc.text(
      "Employee ID",
      20,
      75
    );

    doc.text(
      `: ${data.empId}`,
      60,
      75
    );

    doc.text(
      "Pay Date",
      20,
      80
    );

    doc.text(
      `: ${data.payDate}`,
      60,
      80
    );

    doc.text(
      "Name",
      115,
      75
    );

    doc.text(
      `: ${data.name}`,
      150,
      75
    );

    doc.text(
      "Bank Name",
      115,
      80
    );

    doc.text(
      `: ${data.bankName}`,
      150,
      80
    );

    doc.setFont(
      "helvetica",
      "normal"
    );

        //----------------------------------------------------------
    // Table Headers
    //----------------------------------------------------------

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");

    doc.text("Earnings", 20, 106);
    doc.text("Amount", 83, 106);

    doc.text("Deductions", 115, 106);
    doc.text("Amount", 175, 106);

    //----------------------------------------------------------
    // Table Lines
    //----------------------------------------------------------

    doc.line(15, 100, 210, 100);

    doc.line(15, 110, 210, 110);

    doc.line(110, 100, 110, 147);

    //----------------------------------------------------------
    // Earnings
    //----------------------------------------------------------

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    doc.text("Basic Pay", 20, 115);

    doc.text(
      `${new Intl.NumberFormat("en-IN").format(
        data.basicPay
      )}.00`,
      95,
      115,
      {
        align: "right",
      }
    );

    doc.text(
      "House Rent Allowance",
      20,
      120
    );

    doc.text(
      `${new Intl.NumberFormat("en-IN").format(
        data.houseRentAllowance
      )}.00`,
      95,
      120,
      {
        align: "right",
      }
    );

    doc.text(
      "Project Allowance",
      20,
      125
    );

    doc.text(
      `${new Intl.NumberFormat("en-IN").format(
        data.projectAllowance
      )}.00`,
      95,
      125,
      {
        align: "right",
      }
    );

    doc.text(
      "Medical Allowance",
      20,
      130
    );

    doc.text(
      `${new Intl.NumberFormat("en-IN").format(
        data.medicalAllowance
      )}.00`,
      95,
      130,
      {
        align: "right",
      }
    );

    doc.text(
      "Conveyance Allowance",
      20,
      135
    );

    doc.text(
      `${new Intl.NumberFormat("en-IN").format(
        data.conveyanceAllowance
      )}.00`,
      95,
      135,
      {
        align: "right",
      }
    );

    //----------------------------------------------------------
    // Total Earnings
    //----------------------------------------------------------

    doc.line(
      15,
      140,
      210,
      140
    );

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.text(
      "Total Earnings (Rounded)",
      20,
      145
    );

    doc.text(
      `${new Intl.NumberFormat("en-IN").format(
        data.totalPay
      )}.00`,
      95,
      145,
      {
        align: "right",
      }
    );

    doc.line(
      15,
      147,
      210,
      147
    );

        //----------------------------------------------------------
    // Deductions
    //----------------------------------------------------------

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    doc.text(
      "TDS",
      115,
      115
    );

    doc.text(
      `${new Intl.NumberFormat("en-IN").format(
        data.tds ? data.tds : 0
      )}.00`,
      187,
      115,
      {
        align: "right",
      }
    );

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.text(
      "Total Deductions",
      115,
      145
    );

    doc.text(
      `${new Intl.NumberFormat("en-IN").format(
        data.tds ? data.tds : 0
      )}.00`,
      187,
      145,
      {
        align: "right",
      }
    );

    //----------------------------------------------------------
    // Net Pay
    //----------------------------------------------------------

    doc.setFontSize(10);

    doc.text(
      "Net Pay (Rounded)",
      115,
      152
    );

    doc.text(
      `${new Intl.NumberFormat("en-IN").format(
        data.netPay
      )}.00`,
      187,
      152,
      {
        align: "right",
      }
    );

    //----------------------------------------------------------
    // Bottom Line
    //----------------------------------------------------------

    doc.line(
      15,
      160,
      210,
      160
    );

    //----------------------------------------------------------
    // Footer
    //----------------------------------------------------------

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(8.5);

    doc.text(
      "Message: This is a computer generated document and does not require signature.",
      20,
      165
    );

    //----------------------------------------------------------
    // Generate Blob URL
    //----------------------------------------------------------

    const pdfBlob = doc.output("blob");

    const url = URL.createObjectURL(pdfBlob);

    return url;
  };

    //----------------------------------------------------------
  // Existing Payslip Submit
  //----------------------------------------------------------

  const handleFormSubmit = (data) => {
    setFormData(data);
    setShowForm(false);
    setIsProfessional(false);

    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }

    const url = generatePDF(data);

    if (url) {
      setPdfUrl(url);
    }
  };

  //----------------------------------------------------------
  // Professional Payslip Submit
  //----------------------------------------------------------

  const handleProfessionalSubmit = (data) => {
    setFormData(data);
    setShowProfessionalForm(false);
    setIsProfessional(true);

    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }

    const url = generateProfessionalPDF(data);

    if (url) {
      setPdfUrl(url);
    }
  };

  //----------------------------------------------------------
  // Button Styles
  //----------------------------------------------------------

  const primaryButton =
    "py-2 px-5 rounded-md bg-pano-blue text-white shadow-lg hover:bg-blue-700 transition-all";

  const secondaryButton =
    "py-2 px-5 rounded-md bg-green-600 text-white shadow-lg hover:bg-green-700 transition-all";

      return (
    <div className="mx-auto">
      <DashboardPdf />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col mt-3 rounded-2xl w-full h-screen md:px-7 lg:px-20 sm:px-5">

          {/* Buttons */}

          <div className="mt-5 flex gap-4">

            <button
              onClick={() => {
                setIsProfessional(false);
                setShowForm(true);
              }}
              className={primaryButton}
            >
              Generate Payslip
            </button>

            <button
              onClick={() => {
                setIsProfessional(true);
                setShowProfessionalForm(true);
              }}
              className={secondaryButton}
            >
              Generate Professional Payslip
            </button>

          </div>

          {/* Existing Payslip Form */}

          {showForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

              <div className="bg-white rounded-xl shadow-xl p-6 max-h-[95vh] overflow-y-auto">

                <PayslipForm
                  onSubmit={handleFormSubmit}
                  onClose={() => setShowForm(false)}
                />

              </div>

            </div>
          )}

          {/* Professional Payslip Form */}

          {showProfessionalForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

              <div className="bg-white rounded-xl shadow-xl p-6 max-h-[95vh] overflow-y-auto">

                <ProfessionalPayslipForm
                  onSubmit={handleProfessionalSubmit}
                  onClose={() => setShowProfessionalForm(false)}
                />

              </div>

            </div>
          )}

          {/* PDF Preview */}

          {pdfUrl && (
            <div className="mt-6 bg-white rounded-xl shadow-lg overflow-hidden">

              <iframe
                title={
                  isProfessional
                    ? "Professional Payslip Preview"
                    : "Payslip Preview"
                }
                src={pdfUrl}
                width="100%"
                height="900"
                frameBorder="0"
              />

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Payslip;