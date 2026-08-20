import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  DollarSign,
  FileText,
  Info,
  MapPin,
  Package,
  PackagePlus,
  Upload,
  X,
} from "lucide-react";

import AppNavbar from "../components/ui/AppNavbar";
import BackButton from "../components/ui/BackButton";

function NewImport() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    category: "",
    quantity: "",
    unit: "Units",
    country: "",
    supplier: "",
    productValue: "",
    currency: "USD",
    shippingCost: "",
  });

  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (selectedFiles.length > 0) {
      setFiles((prev) => [...prev, ...selectedFiles]);
    }

    e.target.value = "";
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.productName ||
      !formData.category ||
      !formData.quantity ||
      !formData.country ||
      !formData.productValue
    ) {
      setError(
        "Please complete all required fields before continuing."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    const importData = {
      ...formData,
      id: `IMP-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: "Draft",
      documents: files.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
      })),
    };

    localStorage.setItem(
      "currentImport",
      JSON.stringify(importData)
    );

    navigate("/hs-code-search");
  };

  const inputClass =
    "h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-[#173B6C] focus:ring-4 focus:ring-[#173B6C]/[0.07]";

  const selectClass =
    "h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 outline-none transition-all duration-200 hover:border-slate-300 focus:border-[#173B6C] focus:ring-4 focus:ring-[#173B6C]/[0.07]";

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-900">

      {/* =========================================================
          ANIMATIONS
      ========================================================== */}

      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        .page-fade {
          animation: fadeUp .55s cubic-bezier(.22,1,.36,1) both;
        }

        .section-fade {
          animation: fadeUp .55s cubic-bezier(.22,1,.36,1) both;
        }

        .section-delay-1 {
          animation-delay: .06s;
        }

        .section-delay-2 {
          animation-delay: .12s;
        }

        .section-delay-3 {
          animation-delay: .18s;
        }

        .section-delay-4 {
          animation-delay: .24s;
        }

        @media (prefers-reduced-motion: reduce) {
          .page-fade,
          .section-fade {
            animation: none;
          }
        }
      `}</style>

      {/* =========================================================
          NAVBAR
      ========================================================== */}

      <AppNavbar />

      {/* =========================================================
          MAIN
      ========================================================== */}

      <main className="mx-auto w-full max-w-[1180px] px-5 py-7 sm:px-7 lg:py-9">

        {/* =======================================================
            BACK
        ======================================================== */}

        <div className="page-fade mb-6">
          <BackButton current="New Import" />
        </div>

        {/* =======================================================
            HEADER
        ======================================================== */}

        <section className="page-fade mb-8">

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

            <div>

              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5">

                <Package
                  size={13}
                  strokeWidth={2}
                  className="text-[#2563EB]"
                />

                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#173B6C]">
                  Import workspace
                </span>

              </div>

              <h1 className="text-[28px] font-bold tracking-[-0.04em] text-[#14213D] sm:text-[32px]">
                Start a new import
              </h1>

              <p className="mt-2 max-w-[650px] text-[13px] leading-6 text-slate-500 sm:text-sm">
                Tell us about the product you want to import. ImportEase
                will help identify the HS code, estimate costs, and connect
                you with suitable clearing agents.
              </p>

            </div>

            <div className="hidden shrink-0 items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3.5 py-2 sm:flex">

              <CheckCircle2
                size={14}
                strokeWidth={2}
                className="text-emerald-600"
              />

              <span className="text-[11px] font-semibold text-emerald-700">
                Secure workspace
              </span>

            </div>

          </div>

        </section>

        {/* =======================================================
            PROGRESS
        ======================================================== */}

        <section className="page-fade section-delay-1 mb-7 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_2px_12px_rgba(15,23,42,.025)] sm:p-5">

          <div className="flex items-center">

            {/* STEP 1 */}

            <div className="flex shrink-0 items-center gap-2">

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#173B6C] text-xs font-bold text-white shadow-sm">
                1
              </div>

              <span className="hidden text-xs font-semibold text-[#173B6C] sm:block">
                Import details
              </span>

            </div>

            <div className="mx-2 h-px flex-1 bg-slate-200 sm:mx-4" />

            {/* STEP 2 */}

            <div className="flex shrink-0 items-center gap-2">

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-400">
                2
              </div>

              <span className="hidden text-xs font-medium text-slate-400 sm:block">
                HS Code
              </span>

            </div>

            <div className="mx-2 h-px flex-1 bg-slate-200 sm:mx-4" />

            {/* STEP 3 */}

            <div className="flex shrink-0 items-center gap-2">

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-400">
                3
              </div>

              <span className="hidden text-xs font-medium text-slate-400 sm:block">
                Costs
              </span>

            </div>

            <div className="mx-2 h-px flex-1 bg-slate-200 sm:mx-4" />

            {/* STEP 4 */}

            <div className="flex shrink-0 items-center gap-2">

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-400">
                4
              </div>

              <span className="hidden text-xs font-medium text-slate-400 sm:block">
                Agent
              </span>

            </div>

          </div>

        </section>

        {/* =======================================================
            ERROR
        ======================================================== */}

        {error && (
          <div className="page-fade mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5">

            <Info
              size={17}
              className="mt-0.5 shrink-0 text-red-600"
            />

            <div className="flex-1">

              <p className="text-xs font-bold text-red-700">
                Required information missing
              </p>

              <p className="mt-0.5 text-xs leading-5 text-red-600">
                {error}
              </p>

            </div>

            <button
              type="button"
              onClick={() => setError("")}
              className="rounded-md p-1 text-red-400 transition hover:bg-red-100 hover:text-red-600"
            >
              <X size={15} />
            </button>

          </div>
        )}

        {/* =======================================================
            FORM
        ======================================================== */}

        <form onSubmit={handleSubmit}>

          <div className="space-y-5">

            {/* =================================================
                PRODUCT INFORMATION
            ================================================= */}

            <section className="section-fade section-delay-1 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,.025)]">

              <div className="border-b border-slate-100 px-5 py-4.5 sm:px-6">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
                    <Package size={17} strokeWidth={1.9} />
                  </div>

                  <div>

                    <h2 className="text-sm font-bold text-[#14213D]">
                      Product information
                    </h2>

                    <p className="mt-0.5 text-[11px] text-slate-400">
                      Tell us what you're planning to import.
                    </p>

                  </div>

                </div>

              </div>

              <div className="space-y-5 p-5 sm:p-6">

                {/* PRODUCT NAME */}

                <div>

                  <label
                    htmlFor="productName"
                    className="mb-1.5 block text-xs font-semibold text-slate-700"
                  >
                    Product name
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <input
                    id="productName"
                    name="productName"
                    value={formData.productName}
                    onChange={handleChange}
                    placeholder="e.g. Solar panels"
                    className={inputClass}
                  />

                  <p className="mt-1.5 text-[10px] text-slate-400">
                    Use a clear commercial name for the product.
                  </p>

                </div>

                {/* DESCRIPTION */}

                <div>

                  <label
                    htmlFor="description"
                    className="mb-1.5 block text-xs font-semibold text-slate-700"
                  >
                    Product description
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Describe the product, material, model, or main purpose..."
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-[#173B6C] focus:ring-4 focus:ring-[#173B6C]/[0.07]"
                  />

                  <p className="mt-1.5 text-[10px] text-slate-400">
                    A detailed description helps identify the correct HS code.
                  </p>

                </div>

                {/* CATEGORY */}

                <div>

                  <label
                    htmlFor="category"
                    className="mb-1.5 block text-xs font-semibold text-slate-700"
                  >
                    Product category
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={selectClass}
                  >
                    <option value="">
                      Select a category
                    </option>

                    <option value="electronics">
                      Electronics & Computers
                    </option>

                    <option value="solar">
                      Solar & Renewable Energy
                    </option>

                    <option value="textiles">
                      Textiles & Apparel
                    </option>

                    <option value="automotive">
                      Motor Vehicles & Parts
                    </option>

                    <option value="machinery">
                      Machinery & Equipment
                    </option>

                    <option value="food">
                      Food & Agricultural Products
                    </option>

                    <option value="other">
                      Other
                    </option>
                  </select>

                </div>

                {/* QUANTITY */}

                <div className="grid gap-4 sm:grid-cols-2">

                  <div>

                    <label
                      htmlFor="quantity"
                      className="mb-1.5 block text-xs font-semibold text-slate-700"
                    >
                      Quantity
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <input
                      id="quantity"
                      name="quantity"
                      type="number"
                      min="1"
                      value={formData.quantity}
                      onChange={handleChange}
                      placeholder="e.g. 100"
                      className={inputClass}
                    />

                  </div>

                  <div>

                    <label
                      htmlFor="unit"
                      className="mb-1.5 block text-xs font-semibold text-slate-700"
                    >
                      Unit
                    </label>

                    <select
                      id="unit"
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                      className={selectClass}
                    >
                      <option value="Units">Units</option>
                      <option value="Kg">Kilograms</option>
                      <option value="Tonnes">Tonnes</option>
                      <option value="Boxes">Boxes</option>
                      <option value="Pieces">Pieces</option>
                      <option value="Litres">Litres</option>
                    </select>

                  </div>

                </div>

              </div>

            </section>

            {/* =================================================
                SUPPLIER / ORIGIN
            ================================================= */}

            <section className="section-fade section-delay-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,.025)]">

              <div className="border-b border-slate-100 px-5 py-4.5 sm:px-6">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <MapPin size={17} strokeWidth={1.9} />
                  </div>

                  <div>

                    <h2 className="text-sm font-bold text-[#14213D]">
                      Supplier & origin
                    </h2>

                    <p className="mt-0.5 text-[11px] text-slate-400">
                      Tell us where your goods are coming from.
                    </p>

                  </div>

                </div>

              </div>

              <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">

                <div>

                  <label
                    htmlFor="country"
                    className="mb-1.5 block text-xs font-semibold text-slate-700"
                  >
                    Country of origin
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={selectClass}
                  >
                    <option value="">
                      Select country
                    </option>

                    <option value="China">
                      China
                    </option>

                    <option value="India">
                      India
                    </option>

                    <option value="Singapore">
                      Singapore
                    </option>

                    <option value="United Arab Emirates">
                      United Arab Emirates
                    </option>

                    <option value="Japan">
                      Japan
                    </option>

                    <option value="South Korea">
                      South Korea
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>

                </div>

                <div>

                  <label
                    htmlFor="supplier"
                    className="mb-1.5 block text-xs font-semibold text-slate-700"
                  >
                    Supplier name
                  </label>

                  <input
                    id="supplier"
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleChange}
                    placeholder="e.g. ABC Trading Co."
                    className={inputClass}
                  />

                </div>

              </div>

            </section>

            {/* =================================================
                IMPORT VALUE
            ================================================= */}

            <section className="section-fade section-delay-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,.025)]">

              <div className="border-b border-slate-100 px-5 py-4.5 sm:px-6">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                    <DollarSign size={17} strokeWidth={1.9} />
                  </div>

                  <div>

                    <h2 className="text-sm font-bold text-[#14213D]">
                      Import value
                    </h2>

                    <p className="mt-0.5 text-[11px] text-slate-400">
                      Give us an estimated value for your shipment.
                    </p>

                  </div>

                </div>

              </div>

              <div className="space-y-5 p-5 sm:p-6">

                <div className="grid gap-4 sm:grid-cols-[1fr_190px]">

                  <div>

                    <label
                      htmlFor="productValue"
                      className="mb-1.5 block text-xs font-semibold text-slate-700"
                    >
                      Product value
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <div className="relative">

                      <DollarSign
                        size={15}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        id="productValue"
                        name="productValue"
                        type="number"
                        min="0"
                        value={formData.productValue}
                        onChange={handleChange}
                        placeholder="e.g. 5000"
                        className={`${inputClass} pl-9`}
                      />

                    </div>

                  </div>

                  <div>

                    <label
                      htmlFor="currency"
                      className="mb-1.5 block text-xs font-semibold text-slate-700"
                    >
                      Currency
                    </label>

                    <select
                      id="currency"
                      name="currency"
                      value={formData.currency}
                      onChange={handleChange}
                      className={selectClass}
                    >
                      <option value="USD">
                        USD — US Dollar
                      </option>

                      <option value="LKR">
                        LKR — Sri Lankan Rupee
                      </option>

                      <option value="EUR">
                        EUR — Euro
                      </option>

                      <option value="GBP">
                        GBP — British Pound
                      </option>

                      <option value="CNY">
                        CNY — Chinese Yuan
                      </option>
                    </select>

                  </div>

                </div>

                <div>

                  <label
                    htmlFor="shippingCost"
                    className="mb-1.5 block text-xs font-semibold text-slate-700"
                  >
                    Estimated shipping cost
                  </label>

                  <input
                    id="shippingCost"
                    name="shippingCost"
                    type="number"
                    min="0"
                    value={formData.shippingCost}
                    onChange={handleChange}
                    placeholder="Optional"
                    className={inputClass}
                  />

                  <p className="mt-1.5 text-[10px] text-slate-400">
                    You can update this later when the exact shipping amount
                    is available.
                  </p>

                </div>

              </div>

            </section>

            {/* =================================================
                DOCUMENTS
            ================================================= */}

            <section className="section-fade section-delay-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,.025)]">

              <div className="border-b border-slate-100 px-5 py-4.5 sm:px-6">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                    <FileText size={17} strokeWidth={1.9} />
                  </div>

                  <div>

                    <h2 className="text-sm font-bold text-[#14213D]">
                      Supporting documents
                    </h2>

                    <p className="mt-0.5 text-[11px] text-slate-400">
                      Optional now. You can add documents later.
                    </p>

                  </div>

                </div>

              </div>

              <div className="p-5 sm:p-6">

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xlsx,.xls"
                  onChange={handleFileChange}
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="group flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/60 px-6 py-8 text-center transition-all duration-300 hover:border-[#2563EB] hover:bg-blue-50/30"
                >

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm transition-all duration-300 group-hover:-translate-y-0.5 group-hover:text-[#2563EB]">
                    <Upload size={18} />
                  </div>

                  <p className="mt-3 text-sm font-semibold text-slate-700">
                    Upload documents
                  </p>

                  <p className="mt-1 max-w-md text-xs leading-5 text-slate-400">
                    Invoice, quotation, product specification, or other
                    supporting documents
                  </p>

                  <span className="mt-4 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm transition group-hover:border-blue-200 group-hover:text-[#173B6C]">
                    Choose files
                  </span>

                </button>

                {/* FILE LIST */}

                {files.length > 0 && (
                  <div className="mt-4 space-y-2">

                    {files.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-3"
                      >

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                          <FileText size={15} />
                        </div>

                        <div className="min-w-0 flex-1">

                          <p className="truncate text-xs font-semibold text-slate-700">
                            {file.name}
                          </p>

                          <p className="mt-0.5 text-[10px] text-slate-400">
                            {(file.size / 1024).toFixed(1)} KB
                          </p>

                        </div>

                        <Check
                          size={15}
                          className="text-emerald-500"
                        />

                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-red-500"
                        >
                          <X size={15} />
                        </button>

                      </div>
                    ))}

                  </div>
                )}

              </div>

            </section>

          </div>

          {/* =====================================================
              ACTION BAR
          ====================================================== */}

          <div className="mt-7 flex flex-col-reverse items-stretch justify-between gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center">

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="group flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-slate-500 transition-all duration-200 hover:bg-white hover:text-slate-800 hover:shadow-sm sm:justify-start"
            >
              <ArrowLeft
                size={16}
                className="transition-transform group-hover:-translate-x-0.5"
              />

              Cancel
            </button>

            <button
              type="submit"
              className="group flex items-center justify-center gap-2 rounded-xl bg-[#173B6C] px-6 py-3 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(23,59,108,.14)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#12315B] hover:shadow-[0_10px_25px_rgba(23,59,108,.2)]"
            >
              Continue to HS Code

              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>

          </div>

          {/* =====================================================
              INFORMATION NOTE
          ====================================================== */}

          <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3">

            <Info
              size={15}
              className="mt-0.5 shrink-0 text-blue-600"
            />

            <p className="text-[11px] leading-5 text-blue-700">
              Your information helps ImportEase identify the appropriate
              HS code, estimate import costs, and connect you with suitable
              clearing agents.
            </p>

          </div>

        </form>

        {/* =====================================================
            FOOTER
        ====================================================== */}

        <div className="mt-8 flex items-center justify-between border-t border-slate-200/80 pt-5">

          <p className="text-[9px] text-slate-400">
            ImportEase · SME Import Platform
          </p>

          <div className="flex items-center gap-1.5 text-[9px] text-slate-400">

            <Check
              size={11}
              strokeWidth={2.5}
              className="text-emerald-500"
            />

            Secure workspace

          </div>

        </div>

      </main>
    </div>
  );
}

export default NewImport;