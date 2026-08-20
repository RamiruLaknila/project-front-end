import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Package,
  MapPin,
  DollarSign,
  Hash,
  FileText,
  Info,
  CheckCircle2,
  Upload,
} from "lucide-react";

function NewImport() {
  const navigate = useNavigate();

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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.productName ||
      !formData.category ||
      !formData.quantity ||
      !formData.country ||
      !formData.productValue
    ) {
      setError("Please complete all required fields before continuing.");
      return;
    }

    // Temporary draft import
    const importData = {
      ...formData,
      id: `IMP-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: "Draft",
    };

    localStorage.setItem("currentImport", JSON.stringify(importData));

    // Move to HS Code Search
    navigate("/hs-code-search");
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-900">

      {/* =====================================================
          HEADER
      ===================================================== */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">

        <div className="mx-auto flex h-[70px] max-w-[1180px] items-center justify-between px-5 sm:px-7">

          <Link
            to="/dashboard"
            className="flex items-center gap-3"
          >
            <img
              src="/logo.jpeg"
              alt="ImportEase"
              className="h-10 w-10 object-contain mix-blend-multiply"
            />

            <div>
              <div className="text-[17px] font-bold tracking-tight text-[#173563]">
                Import<span className="text-slate-900">Ease</span>
              </div>

              <div className="hidden text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400 sm:block">
                SME Import Platform
              </div>
            </div>
          </Link>

          <Link
            to="/dashboard"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">
              Back to Dashboard
            </span>
          </Link>

        </div>
      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}
      <main className="mx-auto max-w-[1000px] px-5 py-8 sm:px-7 lg:py-12">

        {/* ===================================================
            PAGE HEADER
        =================================================== */}
        <div className="mb-8">

          <div className="mb-3 flex items-center gap-2 text-xs font-medium text-slate-400">
            <Link
              to="/dashboard"
              className="hover:text-slate-700"
            >
              Dashboard
            </Link>

            <span>/</span>

            <span className="text-slate-600">
              New Import
            </span>
          </div>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#14213D] sm:text-3xl">
                Start a new import
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Tell us about the product you want to import. We'll help
                you identify the HS code, estimate costs, and find a
                suitable clearing agent.
              </p>
            </div>

            <div className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 sm:flex">
              <CheckCircle2
                size={14}
                className="text-emerald-600"
              />

              <span className="text-[11px] font-semibold text-emerald-700">
                Secure workspace
              </span>
            </div>

          </div>
        </div>

        {/* ===================================================
            PROGRESS
        =================================================== */}
        <div className="mb-7 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">

          <div className="flex items-center justify-between">

            {/* STEP 1 */}
            <div className="flex items-center gap-2">

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#173563] text-xs font-bold text-white">
                1
              </div>

              <span className="hidden text-xs font-semibold text-[#173563] sm:block">
                Import details
              </span>

            </div>

            <div className="mx-2 h-px flex-1 bg-slate-200" />

            {/* STEP 2 */}
            <div className="flex items-center gap-2">

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-400">
                2
              </div>

              <span className="hidden text-xs font-medium text-slate-400 sm:block">
                HS Code
              </span>

            </div>

            <div className="mx-2 h-px flex-1 bg-slate-200" />

            {/* STEP 3 */}
            <div className="flex items-center gap-2">

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-400">
                3
              </div>

              <span className="hidden text-xs font-medium text-slate-400 sm:block">
                Costs
              </span>

            </div>

            <div className="mx-2 h-px flex-1 bg-slate-200" />

            {/* STEP 4 */}
            <div className="flex items-center gap-2">

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-400">
                4
              </div>

              <span className="hidden text-xs font-medium text-slate-400 sm:block">
                Agent
              </span>

            </div>

          </div>
        </div>

        {/* ===================================================
            ERROR
        =================================================== */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5">

            <Info
              size={18}
              className="mt-0.5 shrink-0 text-red-600"
            />

            <p className="text-sm font-medium text-red-700">
              {error}
            </p>

          </div>
        )}

        {/* ===================================================
            FORM
        =================================================== */}
        <form onSubmit={handleSubmit}>

          <div className="space-y-6">

            {/* =================================================
                PRODUCT INFORMATION
            ================================================= */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.025)]">

              <div className="border-b border-slate-100 px-5 py-5 sm:px-6">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                    <Package size={18} />
                  </div>

                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      Product information
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-500">
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
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[#173563] focus:ring-2 focus:ring-[#173563]/10"
                  />

                  <p className="mt-1.5 text-[11px] text-slate-400">
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
                    className="w-full resize-none rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[#173563] focus:ring-2 focus:ring-[#173563]/10"
                  />

                  <p className="mt-1.5 text-[11px] text-slate-400">
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
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm text-slate-700 outline-none transition hover:border-slate-400 focus:border-[#173563] focus:ring-2 focus:ring-[#173563]/10"
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
                      className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[#173563] focus:ring-2 focus:ring-[#173563]/10"
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
                      className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm text-slate-700 outline-none transition hover:border-slate-400 focus:border-[#173563] focus:ring-2 focus:ring-[#173563]/10"
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
            <section className="rounded-2xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.025)]">

              <div className="border-b border-slate-100 px-5 py-5 sm:px-6">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                    <MapPin size={18} />
                  </div>

                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      Supplier & origin
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-500">
                      Provide information about where the goods are coming from.
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
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm text-slate-700 outline-none transition hover:border-slate-400 focus:border-[#173563] focus:ring-2 focus:ring-[#173563]/10"
                  >
                    <option value="">
                      Select country
                    </option>
                    <option value="China">China</option>
                    <option value="India">India</option>
                    <option value="Singapore">Singapore</option>
                    <option value="United Arab Emirates">
                      United Arab Emirates
                    </option>
                    <option value="Japan">Japan</option>
                    <option value="South Korea">
                      South Korea
                    </option>
                    <option value="Other">Other</option>
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
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[#173563] focus:ring-2 focus:ring-[#173563]/10"
                  />
                </div>

              </div>
            </section>

            {/* =================================================
                VALUE
            ================================================= */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.025)]">

              <div className="border-b border-slate-100 px-5 py-5 sm:px-6">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
                    <DollarSign size={18} />
                  </div>

                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      Import value
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-500">
                      Give us an estimated value for your shipment.
                    </p>
                  </div>

                </div>

              </div>

              <div className="space-y-5 p-5 sm:p-6">

                <div className="grid gap-4 sm:grid-cols-[1fr_180px]">

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
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        id="productValue"
                        name="productValue"
                        type="number"
                        min="0"
                        value={formData.productValue}
                        onChange={handleChange}
                        placeholder="e.g. 5000"
                        className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[#173563] focus:ring-2 focus:ring-[#173563]/10"
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
                      className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm text-slate-700 outline-none transition hover:border-slate-400 focus:border-[#173563] focus:ring-2 focus:ring-[#173563]/10"
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
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[#173563] focus:ring-2 focus:ring-[#173563]/10"
                  />

                  <p className="mt-1.5 text-[11px] text-slate-400">
                    You can update this later when you have the exact shipping
                    amount.
                  </p>
                </div>

              </div>
            </section>

            {/* =================================================
                DOCUMENTS
            ================================================= */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.025)]">

              <div className="border-b border-slate-100 px-5 py-5 sm:px-6">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
                    <FileText size={18} />
                  </div>

                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      Supporting documents
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-500">
                      Optional for now. You can upload documents later.
                    </p>
                  </div>

                </div>

              </div>

              <div className="p-5 sm:p-6">

                <div className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/60 px-6 py-8 text-center transition hover:border-blue-300 hover:bg-blue-50/30">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm">
                    <Upload size={18} />
                  </div>

                  <p className="mt-3 text-sm font-semibold text-slate-700">
                    Upload documents
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Invoice, quotation, product specification, or other
                    supporting documents
                  </p>

                  <button
                    type="button"
                    className="mt-4 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
                  >
                    Choose files
                  </button>

                </div>

              </div>
            </section>

          </div>

          {/* ===================================================
              BOTTOM ACTION
          =================================================== */}
          <div className="mt-7 flex flex-col-reverse items-stretch justify-between gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center">

            <Link
              to="/dashboard"
              className="flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 sm:justify-start"
            >
              <ArrowLeft size={16} />
              Cancel
            </Link>

            <button
              type="submit"
              className="group flex items-center justify-center gap-2 rounded-xl bg-[#173563] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#173563]/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#102A50] hover:shadow-xl"
            >
              Continue to HS Code
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </button>

          </div>

          {/* INFO */}
          <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-blue-100 bg-blue-50/50 px-4 py-3">

            <Info
              size={15}
              className="mt-0.5 shrink-0 text-blue-600"
            />

            <p className="text-[11px] leading-5 text-blue-700">
              Your information is used to help identify the appropriate
              HS code, estimate import costs, and connect you with suitable
              clearing agents.
            </p>

          </div>

        </form>

      </main>
    </div>
  );
}

export default NewImport;