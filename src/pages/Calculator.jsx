import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Calculator,
  CircleHelp,
  Info,
  Package,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Truck,
  CheckCircle2,
} from "lucide-react";

import AppNavbar from "../components/ui/AppNavbar";
import BackButton from "../components/ui/BackButton";

function ImportCalculator() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    productValue: "",
    freight: "",
    dutyRate: "10",
    vatRate: "18",
    otherCharges: "",
  });

  const [calculated, setCalculated] = useState(false);

  /* =========================================================
     CALCULATIONS
  ========================================================= */

  const values = useMemo(() => {
    const product = Number(form.productValue) || 0;
    const freight = Number(form.freight) || 0;
    const dutyRate = Number(form.dutyRate) || 0;
    const vatRate = Number(form.vatRate) || 0;
    const other = Number(form.otherCharges) || 0;

    const customsValue = product + freight;

    const customsDuty = customsValue * (dutyRate / 100);

    const vatBase = customsValue + customsDuty;
    const vat = vatBase * (vatRate / 100);

    const totalTaxes = customsDuty + vat;

    const totalImportCost =
      customsValue + totalTaxes + other;

    return {
      product,
      freight,
      customsValue,
      customsDuty,
      vat,
      totalTaxes,
      other,
      totalImportCost,
    };
  }, [form]);

  /* =========================================================
     HANDLE CHANGE
  ========================================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setCalculated(false);
  };

  /* =========================================================
     CALCULATE
  ========================================================= */

  const calculate = (e) => {
    e.preventDefault();

    if (!form.productValue || Number(form.productValue) <= 0) {
      setCalculated(false);
      return;
    }

    setCalculated(true);

    const savedImport = localStorage.getItem("currentImport");

    if (savedImport) {
      try {
        const importData = JSON.parse(savedImport);

        const updatedImport = {
          ...importData,
          calculator: {
            ...form,
            customsValue: values.customsValue,
            customsDuty: values.customsDuty,
            vat: values.vat,
            totalTaxes: values.totalTaxes,
            totalImportCost: values.totalImportCost,
          },
          status: "Cost Estimated",
        };

        localStorage.setItem(
          "currentImport",
          JSON.stringify(updatedImport)
        );
      } catch (error) {
        console.error(
          "Unable to save calculator data:",
          error
        );
      }
    }
  };

  /* =========================================================
     RESET
  ========================================================= */

  const reset = () => {
    setForm({
      productValue: "",
      freight: "",
      dutyRate: "10",
      vatRate: "18",
      otherCharges: "",
    });

    setCalculated(false);
  };

  /* =========================================================
     CONTINUE
  ========================================================= */

  const continueToAgent = () => {
    const savedImport = localStorage.getItem("currentImport");

    if (savedImport) {
      try {
        const importData = JSON.parse(savedImport);

        const updatedImport = {
          ...importData,
          calculator: {
            ...form,
            customsValue: values.customsValue,
            customsDuty: values.customsDuty,
            vat: values.vat,
            totalTaxes: values.totalTaxes,
            totalImportCost: values.totalImportCost,
          },
          status: "Cost Estimated",
        };

        localStorage.setItem(
          "currentImport",
          JSON.stringify(updatedImport)
        );
      } catch (error) {
        console.error(
          "Unable to save calculator data:",
          error
        );
      }
    }

    navigate("/find-agent");
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-slate-900">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <AppNavbar />

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mx-auto w-full max-w-[1120px] px-5 py-8 sm:px-8 lg:py-10">

        {/* ===================================================
            BACK BUTTON
        =================================================== */}

        <div className="mb-6">
          <BackButton current="Import Calculator" />
        </div>

        {/* ===================================================
            PAGE HEADER
        =================================================== */}

        <section className="mb-8">

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

            <div>

              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-100 bg-amber-50 px-3 py-1.5">

                <Calculator
                  size={13}
                  className="text-amber-700"
                />

                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-amber-700">
                  Import cost estimator
                </span>

              </div>

              <h1 className="text-2xl font-bold tracking-[-0.03em] text-[#14213D] sm:text-3xl">
                Estimate your import cost
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Estimate customs duty, VAT, freight, and other
                import costs before placing your order.
              </p>

            </div>

            <div className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 sm:flex">

              <CheckCircle2
                size={14}
                className="text-emerald-600"
              />

              <span className="text-[11px] font-semibold text-emerald-700">
                Planning estimate
              </span>

            </div>

          </div>

        </section>

        {/* ===================================================
            PROGRESS
        =================================================== */}

        <div className="mb-7 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">

          <div className="flex items-center">

            {/* STEP 1 */}

            <div className="flex items-center gap-2">

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white">

                <CheckCircle2 size={16} />

              </div>

              <span className="hidden text-xs font-semibold text-emerald-700 sm:block">
                Import details
              </span>

            </div>

            <div className="mx-2 h-px flex-1 bg-emerald-200" />

            {/* STEP 2 */}

            <div className="flex items-center gap-2">

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white">

                <CheckCircle2 size={16} />

              </div>

              <span className="hidden text-xs font-semibold text-emerald-700 sm:block">
                HS Code
              </span>

            </div>

            <div className="mx-2 h-px flex-1 bg-emerald-200" />

            {/* STEP 3 */}

            <div className="flex items-center gap-2">

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#173B6C] text-xs font-bold text-white">
                3
              </div>

              <span className="hidden text-xs font-semibold text-[#173B6C] sm:block">
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
            INFO BANNER
        =================================================== */}

        <div className="mb-6 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3.5">

          <Info
            size={16}
            className="mt-0.5 shrink-0 text-blue-600"
          />

          <div>

            <p className="text-[10px] font-bold text-blue-800">
              Estimated calculation
            </p>

            <p className="mt-1 text-[11px] leading-5 text-blue-700">
              Results are estimates for planning purposes.
              Actual customs charges may vary depending on the
              final HS code, customs valuation, applicable
              exemptions, and current regulations.
            </p>

          </div>

        </div>

        {/* ===================================================
            MAIN GRID
        =================================================== */}

        <div className="grid gap-5 lg:grid-cols-[1fr_380px]">

          {/* =================================================
              LEFT FORM
          ================================================= */}

          <section className="rounded-2xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,.025)]">

            {/* HEADER */}

            <div className="border-b border-slate-100 px-5 py-5 sm:px-6">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-700">

                  <Package
                    size={17}
                    strokeWidth={1.8}
                  />

                </div>

                <div>

                  <h2 className="text-sm font-bold text-slate-900">
                    Import information
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Enter the estimated costs for your shipment.
                  </p>

                </div>

              </div>

            </div>

            {/* FORM */}

            <form
              onSubmit={calculate}
              className="space-y-5 p-5 sm:p-6"
            >

              {/* PRODUCT VALUE */}

              <InputField
                label="Product value"
                name="productValue"
                value={form.productValue}
                onChange={handleChange}
                placeholder="e.g. 5000"
                suffix="LKR"
                required
                help="Purchase price of the goods."
              />

              {/* FREIGHT */}

              <InputField
                label="Freight / shipping"
                name="freight"
                value={form.freight}
                onChange={handleChange}
                placeholder="e.g. 500"
                suffix="LKR"
                help="Estimated cost of transporting the goods."
              />

              {/* TAX ASSUMPTIONS */}

              <div className="border-t border-slate-100 pt-5">

                <div className="mb-4">

                  <h3 className="text-xs font-bold text-slate-800">
                    Tax assumptions
                  </h3>

                  <p className="mt-1 text-[10px] leading-5 text-slate-400">
                    Adjust these values based on the applicable
                    tariff information.
                  </p>

                </div>

                <div className="grid gap-4 sm:grid-cols-2">

                  {/* DUTY */}

                  <InputField
                    label="Customs duty"
                    name="dutyRate"
                    value={form.dutyRate}
                    onChange={handleChange}
                    placeholder="0"
                    suffix="%"
                    help="Estimated customs duty rate."
                  />

                  {/* VAT */}

                  <InputField
                    label="VAT"
                    name="vatRate"
                    value={form.vatRate}
                    onChange={handleChange}
                    placeholder="0"
                    suffix="%"
                    help="Estimated VAT rate."
                  />

                </div>

              </div>

              {/* OTHER CHARGES */}

              <InputField
                label="Other charges"
                name="otherCharges"
                value={form.otherCharges}
                onChange={handleChange}
                placeholder="Optional"
                suffix="LKR"
                help="Port, handling, or other estimated costs."
              />

              {/* ACTIONS */}

              <div className="flex flex-col gap-2 pt-2 sm:flex-row">

                <button
                  type="submit"
                  className="group flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#173B6C] py-3.5 text-xs font-bold text-white shadow-[0_6px_18px_rgba(23,59,108,.12)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#12315B] hover:shadow-[0_10px_24px_rgba(23,59,108,.18)]"
                >

                  <Calculator
                    size={15}
                    className="transition-transform duration-300 group-hover:scale-105"
                  />

                  Calculate import cost

                </button>

                <button
                  type="button"
                  onClick={reset}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-xs font-bold text-slate-600 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800"
                >

                  <RefreshCcw size={14} />

                  Reset

                </button>

              </div>

            </form>

          </section>

          {/* =================================================
              RIGHT RESULT
          ================================================= */}

          <aside className="h-fit lg:sticky lg:top-24">

            {/* RESULT CARD */}

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_14px_rgba(15,23,42,.035)]">

              {/* TOTAL */}

              <div className="bg-[#173B6C] px-5 py-5 text-white">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-blue-200">
                      Estimated total
                    </p>

                    <h2 className="mt-2 text-2xl font-bold tracking-[-0.03em]">
                      LKR{" "}
                      {formatCurrency(
                        values.totalImportCost
                      )}
                    </h2>

                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">

                    <Sparkles size={18} />

                  </div>

                </div>

                <p className="mt-2 text-[10px] leading-4 text-blue-100">
                  Estimated landed import cost
                </p>

              </div>

              {/* BREAKDOWN */}

              <div className="p-5">

                <div className="space-y-3">

                  <ResultRow
                    label="Product value"
                    value={values.product}
                  />

                  <ResultRow
                    label="Freight"
                    value={values.freight}
                  />

                  <div className="my-3 border-t border-slate-100" />

                  <ResultRow
                    label={`Customs duty (${form.dutyRate}%)`}
                    value={values.customsDuty}
                  />

                  <ResultRow
                    label={`VAT (${form.vatRate}%)`}
                    value={values.vat}
                  />

                  <ResultRow
                    label="Other charges"
                    value={values.other}
                  />

                  <div className="border-t border-slate-200 pt-4">

                    <div className="flex items-center justify-between gap-4">

                      <span className="text-xs font-bold text-slate-800">
                        Total import cost
                      </span>

                      <span className="text-sm font-bold text-[#173B6C]">
                        LKR{" "}
                        {formatCurrency(
                          values.totalImportCost
                        )}
                      </span>

                    </div>

                  </div>

                </div>

                {!calculated && (

                  <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-3.5 text-center">

                    <p className="text-[10px] leading-5 text-slate-400">
                      Enter your values and calculate to
                      generate your estimate.
                    </p>

                  </div>

                )}

                {calculated && (

                  <div className="mt-5 flex items-start gap-2 rounded-xl border border-emerald-100 bg-emerald-50 p-3.5">

                    <ShieldCheck
                      size={14}
                      className="mt-0.5 shrink-0 text-emerald-600"
                    />

                    <p className="text-[10px] leading-5 text-emerald-700">
                      Estimate generated successfully. Review
                      the result before continuing.
                    </p>

                  </div>

                )}

              </div>

            </section>

            {/* =================================================
                HOW IT WORKS
            ================================================= */}

            <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)]">

              <div className="flex items-center gap-2">

                <Truck
                  size={15}
                  className="text-slate-500"
                />

                <h3 className="text-xs font-bold text-slate-800">
                  How the estimate works
                </h3>

              </div>

              <div className="mt-4 space-y-3">

                <Formula
                  number="01"
                  title="Customs value"
                  text="Product + freight"
                />

                <Formula
                  number="02"
                  title="Customs duty"
                  text="Customs value × duty rate"
                />

                <Formula
                  number="03"
                  title="VAT estimate"
                  text="(Customs value + duty) × VAT rate"
                />

              </div>

            </section>

            {/* =================================================
                HELP CARD
            ================================================= */}

            <Link
              to="/hs-code-search"
              className="group mt-4 flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-sm"
            >

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue-700 shadow-sm">

                <CircleHelp size={16} />

              </div>

              <div className="min-w-0 flex-1">

                <p className="text-[10px] font-bold text-blue-900">
                  Not sure about your duty rate?
                </p>

                <p className="mt-1 text-[9px] leading-4 text-blue-700">
                  Search your product to review its HS code
                  and applicable tariff information.
                </p>

              </div>

              <ArrowRight
                size={14}
                className="text-blue-500 transition-transform duration-300 group-hover:translate-x-1"
              />

            </Link>

          </aside>

        </div>

        {/* ===================================================
            ACTIONS
        =================================================== */}

        <div className="mt-7 flex flex-col-reverse items-stretch justify-between gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center">

          <Link
            to="/hs-code-search"
            className="flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 sm:justify-start"
          >

            <ArrowLeft size={16} />

            Back to HS Code

          </Link>

          <button
            type="button"
            disabled={!calculated}
            onClick={continueToAgent}
            className={`group flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 ${
              calculated
                ? "bg-[#173B6C] text-white shadow-[0_6px_18px_rgba(23,59,108,.12)] hover:-translate-y-0.5 hover:bg-[#12315B] hover:shadow-[0_10px_24px_rgba(23,59,108,.18)]"
                : "cursor-not-allowed bg-slate-200 text-slate-400"
            }`}
          >

            Continue to Find Agent

            <ArrowRight
              size={17}
              className={`transition-transform duration-300 ${
                calculated
                  ? "group-hover:translate-x-0.5"
                  : ""
              }`}
            />

          </button>

        </div>

        {/* ===================================================
            FOOTER NOTE
        =================================================== */}

        <div className="mt-6 flex items-center justify-center gap-2 text-center text-[10px] text-slate-400">

          <ShieldCheck
            size={13}
            className="text-emerald-600"
          />

          <span>
            ImportEase estimates are for planning purposes only.
          </span>

        </div>

      </main>

    </div>
  );
}

/* =========================================================
   INPUT FIELD
========================================================= */

function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
  suffix,
  help,
  required,
}) {
  return (
    <div>

      <div className="mb-1.5 flex items-center justify-between gap-3">

        <label
          htmlFor={name}
          className="text-xs font-semibold text-slate-700"
        >

          {label}

          {required && (
            <span className="ml-1 text-red-500">
              *
            </span>
          )}

        </label>

        <span className="hidden text-[9px] text-slate-400 sm:block">
          {help}
        </span>

      </div>

      <div className="relative">

        <input
          id={name}
          name={name}
          type="number"
          min="0"
          step="0.01"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 pr-14 text-sm font-medium text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-400 focus:border-[#173B6C] focus:ring-2 focus:ring-[#173B6C]/10"
        />

        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-400">
          {suffix}
        </span>

      </div>

      <p className="mt-1.5 text-[9px] text-slate-400 sm:hidden">
        {help}
      </p>

    </div>
  );
}

/* =========================================================
   RESULT ROW
========================================================= */

function ResultRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4">

      <span className="text-[10px] text-slate-500">
        {label}
      </span>

      <span className="text-[10px] font-semibold text-slate-700">
        LKR {formatCurrency(value)}
      </span>

    </div>
  );
}

/* =========================================================
   FORMULA
========================================================= */

function Formula({
  number,
  title,
  text,
}) {
  return (
    <div className="flex gap-3">

      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-100 text-[8px] font-bold text-slate-500">
        {number}
      </div>

      <div>

        <p className="text-[9px] font-bold text-slate-700">
          {title}
        </p>

        <p className="mt-0.5 text-[8px] text-slate-400">
          {text}
        </p>

      </div>

    </div>
  );
}

/* =========================================================
   FORMAT CURRENCY
========================================================= */

function formatCurrency(value) {
  return Number(value || 0).toLocaleString(
    "en-LK",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  );
}

export default ImportCalculator;