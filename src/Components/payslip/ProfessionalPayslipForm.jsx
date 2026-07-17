import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { format } from "date-fns";

import "react-datepicker/dist/react-datepicker.css";

const ProfessionalPayslipForm = ({ onSubmit, onClose }) => {
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState({
    employeeName: "",
    employeeId: "",

    invoiceNumber: "",
    invoiceDate: new Date(),

    bankName: "",

    payPeriodStart: new Date(),
    payPeriodEnd: new Date(),

    payDate: new Date(),

    totalPay: "",

    tds: "",

    gst: "NA",

    gstAmount: 0,

    netPay: "",

    includePvtLtd: true,
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const formatDate = (date) => {
    if (!date) return "";

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatPayPeriod = (start, end) => {
    if (!start || !end) return "";

    return `${format(start, "dd MMM yyyy")} - ${format(
      end,
      "dd MMM yyyy"
    )}`;
  };

  const handlePreview = (e) => {
    e.preventDefault();
    setShowPreview(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedData = {
      ...formData,

      invoiceDate: formatDate(formData.invoiceDate),

      payDate: formatDate(formData.payDate),

      payPeriod: formatPayPeriod(
        formData.payPeriodStart,
        formData.payPeriodEnd
      ),
    };

    onSubmit(formattedData);
  };

  useEffect(() => {
    const total = Number(formData.totalPay) || 0;
    const tds = Number(formData.tds) || 0;

    const gstAmount =
      formData.gst === "18"
        ? Math.round(total * 0.18)
        : 0;

    // GST is informational only
    const netPay = total - tds;

    setFormData((prev) => ({
      ...prev,
      gstAmount,
      netPay,
    }));
  }, [
    formData.totalPay,
    formData.tds,
    formData.gst,
  ]);

  const renderPreview = () => (
    <div className="space-y-6">

      <h2 className="text-2xl font-bold text-center">
        Preview
      </h2>

      <div className="grid grid-cols-2 gap-5">

        <p>
          <strong>Employee Name:</strong>{" "}
          {formData.employeeName}
        </p>

        <p>
          <strong>Employee ID:</strong>{" "}
          {formData.employeeId}
        </p>

        <p>
          <strong>Invoice Number:</strong>{" "}
          {formData.invoiceNumber}
        </p>

        <p>
          <strong>Invoice Date:</strong>{" "}
          {formatDate(formData.invoiceDate)}
        </p>

        <p>
          <strong>Bank Name:</strong>{" "}
          {formData.bankName}
        </p>

        <p>
          <strong>Pay Date:</strong>{" "}
          {formatDate(formData.payDate)}
        </p>

        <p className="col-span-2">
          <strong>Pay Period:</strong>{" "}
          {formatPayPeriod(
            formData.payPeriodStart,
            formData.payPeriodEnd
          )}
        </p>

        <p>
          <strong>Total Pay:</strong>{" "}
          ₹{Number(formData.totalPay).toLocaleString("en-IN")}
        </p>

        <p>
          <strong>TDS:</strong>{" "}
          ₹{Number(formData.tds).toLocaleString("en-IN")}
        </p>

        <p>
          <strong>GST:</strong>{" "}
          {formData.gst === "18"
            ? "18%"
            : "Not Applicable"}
        </p>

        <p>
          <strong>GST Amount:</strong>{" "}
          ₹{Number(formData.gstAmount).toLocaleString("en-IN")}
        </p>

        <p>
          <strong>Net Pay:</strong>{" "}
          ₹{Number(formData.netPay).toLocaleString("en-IN")}
        </p>

        <p>
          <strong>Include Pvt Ltd:</strong>{" "}
          {formData.includePvtLtd ? "Yes" : "No"}
        </p>

      </div>

      <div className="flex justify-end gap-4 pt-5">

        <button
          onClick={() => setShowPreview(false)}
          className="px-5 py-2 rounded border"
        >
          Edit
        </button>

        <button
          onClick={handleSubmit}
          className="px-5 py-2 rounded bg-pano-blue text-white"
        >
          Generate Professional Payslip
        </button>

      </div>

    </div>
  );

    const renderForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Employee Details */}

      <div className="grid grid-cols-2 gap-6">

        <div>
          <label className="block text-sm font-medium mb-1">
            Employee Name
          </label>

          <input
            type="text"
            name="employeeName"
            value={formData.employeeName}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full border rounded-md px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Employee ID
          </label>

          <input
            type="text"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            placeholder="EMP001"
            className="w-full border rounded-md px-3 py-2"
            required
          />
        </div>

      </div>

      {/* Invoice */}

      <div className="grid grid-cols-2 gap-6">

        <div>
          <label className="block text-sm font-medium mb-1">
            Invoice Number
          </label>

          <input
            type="text"
            name="invoiceNumber"
            value={formData.invoiceNumber}
            onChange={handleChange}
            placeholder="INV-2026-001"
            className="w-full border rounded-md px-3 py-2"
            required
          />
        </div>

        <div>

          <label className="block text-sm font-medium mb-1">
            Invoice Date
          </label>

          <DatePicker
            selected={formData.invoiceDate}
            onChange={(date) =>
              setFormData({
                ...formData,
                invoiceDate: date,
              })
            }
            dateFormat="dd/MM/yyyy"
            className="w-full border rounded-md px-3 py-2"
          />

        </div>

      </div>

      {/* Bank */}

      <div className="grid grid-cols-2 gap-6">

        <div>

          <label className="block text-sm font-medium mb-1">
            Bank Name
          </label>

          <input
            type="text"
            name="bankName"
            value={formData.bankName}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
            required
          />

        </div>

        <div>

          <label className="block text-sm font-medium mb-1">
            Pay Date
          </label>

          <DatePicker
            selected={formData.payDate}
            onChange={(date) =>
              setFormData({
                ...formData,
                payDate: date,
              })
            }
            dateFormat="dd/MM/yyyy"
            className="w-full border rounded-md px-3 py-2"
          />

        </div>

      </div>

      {/* Pay Period */}

      <div className="grid grid-cols-2 gap-6">

        <div>

          <label className="block text-sm font-medium mb-1">
            Pay Period From
          </label>

          <DatePicker
            selected={formData.payPeriodStart}
            onChange={(date) =>
              setFormData({
                ...formData,
                payPeriodStart: date,
              })
            }
            dateFormat="dd MMM yyyy"
            className="w-full border rounded-md px-3 py-2"
          />

        </div>

        <div>

          <label className="block text-sm font-medium mb-1">
            Pay Period To
          </label>

          <DatePicker
            selected={formData.payPeriodEnd}
            onChange={(date) =>
              setFormData({
                ...formData,
                payPeriodEnd: date,
              })
            }
            dateFormat="dd MMM yyyy"
            className="w-full border rounded-md px-3 py-2"
          />

        </div>

      </div>

      {/* Salary */}

      <div className="grid grid-cols-2 gap-6">

        <div>

          <label className="block text-sm font-medium mb-1">
            Total Pay
          </label>

          <input
            type="number"
            name="totalPay"
            value={formData.totalPay}
            onChange={handleChange}
            placeholder="50000"
            className="w-full border rounded-md px-3 py-2"
            required
          />

        </div>

        <div>

          <label className="block text-sm font-medium mb-1">
            TDS
          </label>

          <input
            type="number"
            name="tds"
            value={formData.tds}
            onChange={handleChange}
            placeholder="5000"
            className="w-full border rounded-md px-3 py-2"
          />

        </div>

      </div>

      {/* GST */}

      <div className="grid grid-cols-2 gap-6">

        <div>

          <label className="block text-sm font-medium mb-1">
            GST
          </label>

          <select
            name="gst"
            value={formData.gst}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="NA">Not Applicable</option>
            <option value="18">18%</option>
          </select>

        </div>

        <div>

          <label className="block text-sm font-medium mb-1">
            Net Pay
          </label>

          <input
            value={new Intl.NumberFormat("en-IN").format(formData.netPay)}
            disabled
            className="w-full border rounded-md px-3 py-2 bg-gray-100"
          />

        </div>

      </div>

      {/* Checkbox */}

      <div className="flex items-center gap-2">

        <input
          type="checkbox"
          name="includePvtLtd"
          checked={formData.includePvtLtd}
          onChange={handleChange}
        />

        <label>
          Include "Pvt Ltd" in Company Name
        </label>

      </div>

      {/* Buttons */}

      <div className="flex justify-end gap-4">

        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2 border rounded-md"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handlePreview}
          className="px-5 py-2 bg-pano-blue text-white rounded-md"
        >
          Preview
        </button>

      </div>

    </form>
  );

  return (
    <div className="max-w-3xl w-full bg-white rounded-lg p-8">

      <h2 className="text-3xl font-bold text-center mb-8">
        Professional Payslip Details
      </h2>

      {showPreview ? renderPreview() : renderForm()}

    </div>
  );
};

export default ProfessionalPayslipForm;