import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Calculator as CalculatorIcon,
  CheckCircle2,
  ChevronRight,
  Info,
  Package,
  RefreshCw,
  ShieldCheck,
  Truck,
} from "lucide-react";

function Calculator() {
  const navigate = useNavigate();

  const [importData, setImportData] = useState(null);

  const [formData, setFormData] = useState({
    productValue: "",
    shippingCost: "",
    insuranceCost: "",
    otherCosts: "",
  });

  const [calculated, setCalculated] = useState(false);

  useEffect(() => {
    const savedImport = localStorage.getItem("currentImport");

    if (savedImport) {
      try {
        const parsed = JSON.parse(savedImport);

        setImportData(parsed);

        setFormData((previous) => ({
          ...previous,
          productValue:
            parsed.productValue ||
            parsed.value ||
            "",
        }));
      } catch (error) {
        console.error("Unable to load import:", error);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setCalculated(false);
  };

  /*
   * Demo rates.
   *
   * Replace these with your actual tariff/customs data/API.
   */
  const rates = {
    customsDuty: 0.10,
    vat: 0.18,
    otherTax: 0,
  };

  const calculation = useMemo(() => {
    const productValue =
      Number(formData.productValue) || 0;

    const shipping =
      Number(formData.shippingCost) || 0;

    const insurance =
      Number(formData.insuranceCost) || 0;

    const otherCosts =
      Number(formData.otherCosts) || 0;

    const cifValue =
      productValue + shipping + insurance;

    const customsDuty =
      cifValue * rates.customsDuty;

    const otherTax =
      cifValue * rates.otherTax;

    const taxableValue =
      cifValue + customsDuty + otherTax;

    const vat =
      taxableValue * rates.vat;

    const governmentTaxes =
      customsDuty + otherTax + vat;

    const estimatedTotal =
      cifValue + governmentTaxes + otherCosts;

    return {
      productValue,
      shipping,
      insurance,
      otherCosts,
      cifValue,
      customsDuty,
      otherTax,
      vat,
      governmentTaxes,
      estimatedTotal,
    };
  }, [formData]);

  const handleCalculate = () => {
    if (!formData.productValue) {
      return;
    }

    setCalculated(true);
  };

  const handleContinue = () => {
    const updatedImport = {
      ...(importData || {}),

      productValue: formData.productValue,
      shippingCost: formData.shippingCost,
      insuranceCost: formData.insuranceCost,
      otherCosts: formData.otherCosts,

      calculation: {
        ...calculation,
      },

      status: "Cost Estimated",
    };

    localStorage.setItem(
      "currentImport",
      JSON.stringify(updatedImport)
    );

    navigate("/find-agent");
  };

  const formatMoney = (value) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
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
            to="/hs-code-search"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          >
            <ArrowLeft size={16} />

            <span className="hidden sm:inline">
              Back to HS Code
            </span>
          </Link>

        </div>
      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}
      <main className="mx-auto max-w-[1050px] px-5 py-8 sm:px-7 lg:py-12">

        {/* ===================================================
            BREADCRUMB
        =================================================== */}
        <div className="mb-4 flex items-center gap-2 text-xs font-medium text-slate-400">

          <Link
            to="/dashboard"
            className="transition hover:text-slate-700"
          >
            Dashboard
          </Link>

          <ChevronRight size={13} />

          <Link
            to="/new-import"
            className="transition hover:text-slate-700"
          >
            New Import
          </Link>

          <ChevronRight size={13} />

          <Link
            to="/hs-code-search"
            className="transition hover:text-slate-700"
          >
            HS Code
          </Link>

          <ChevronRight size={13} />

          <span className="text-slate-600">
            Calculator
          </span>

        </div>

        {/* ===================================================
            TITLE
        =================================================== */}
        <div className="mb-7">

          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5">

            <CalculatorIcon
              size={13}
              className="text-blue-600"
            />

            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
              Import cost estimator
            </span>

          </div>

          <h1 className="text-2xl font-bold tracking-tight text-[#14213D] sm:text-3xl">
            Estimate your import cost
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Enter the shipment value and additional costs to get an
            estimated breakdown of your import expenses.
          </p>

        </div>

        {/* ===================================================
            PROGRESS
        =================================================== */}
        <div className="mb-7 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">

          <div className="flex items-center">

            <div className="flex items-center gap-2">

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white">
                <CheckCircle2 size={16} />
              </div>

              <span className="hidden text-xs font-semibold text-emerald-700 sm:block">
                Import details
              </span>

            </div>

            <div className="mx-2 h-px flex-1 bg-emerald-200" />

            <div className="flex items-center gap-2">

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white">
                <CheckCircle2 size={16} />
              </div>

              <span className="hidden text-xs font-semibold text-emerald-700 sm:block">
                HS Code
              </span>

            </div>

            <div className="mx-2 h-px flex-1 bg-emerald-200" />

            <div className="flex items-center gap-2">

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#173563] text-xs font-bold text-white">
                3
              </div>

              <span className="hidden text-xs font-semibold text-[#173563] sm:block">
                Costs
              </span>

            </div>

            <div className="mx-2 h-px flex-1 bg-slate-200" />

            <div className="flex items-center gap-2">

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-400">
                4
              </div>

              <span className="hidden text-xs text-slate-400 sm:block">
                Agent
              </span>

            </div>

          </div>
        </div>

        {/* ===================================================
            SELECTED PRODUCT
        =================================================== */}
        {importData && (
          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-start gap-3">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <Package size={19} />
                </div>

                <div>

                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Product
                  </p>

                  <h2 className="mt-0.5 text-sm font-bold text-slate-800">
                    {importData.productName ||
                      "Unnamed product"}
                  </h2>

                  <div className="mt-2 flex flex-wrap items-center gap-2">

                    {importData.hsCode && (
                      <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-[10px] font-semibold text-slate-600">
                        HS {importData.hsCode}
                      </span>
                    )}

                    {importData.quantity && (
                      <span className="text-[10px] text-slate-400">
                        {importData.quantity}{" "}
                        {importData.unit || "units"}
                      </span>
                    )}

                  </div>

                </div>

              </div>

              <Link
                to="/hs-code-search"
                className="text-xs font-semibold text-blue-700 hover:text-blue-800"
              >
                Change HS code
              </Link>

            </div>
          </section>
        )}

        {/* ===================================================
            CALCULATOR GRID
        =================================================== */}
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">

          {/* =================================================
              LEFT FORM
          ================================================= */}
          <section className="rounded-2xl border border-slate-200 bg-white">

            <div className="border-b border-slate-100 px-5 py-5 sm:px-6">

              <h2 className="text-sm font-bold text-slate-900">
                Shipment costs
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Enter the amounts related to this shipment.
              </p>

            </div>

            <div className="space-y-5 p-5 sm:p-6">

              {/* PRODUCT VALUE */}
              <div>

                <label
                  htmlFor="productValue"
                  className="mb-2 block text-xs font-semibold text-slate-700"
                >
                  Product value
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <div className="relative">

                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                    USD
                  </span>

                  <input
                    id="productValue"
                    name="productValue"
                    type="number"
                    min="0"
                    value={formData.productValue}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-14 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[#173563] focus:ring-4 focus:ring-[#173563]/10"
                  />

                </div>

                <p className="mt-1.5 text-[10px] text-slate-400">
                  Purchase value of the imported goods.
                </p>

              </div>

              {/* SHIPPING */}
              <div>

                <label
                  htmlFor="shippingCost"
                  className="mb-2 block text-xs font-semibold text-slate-700"
                >
                  Shipping / freight
                </label>

                <div className="relative">

                  <Truck
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="shippingCost"
                    name="shippingCost"
                    type="number"
                    min="0"
                    value={formData.shippingCost}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-14 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[#173563] focus:ring-4 focus:ring-[#173563]/10"
                  />

                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                    USD
                  </span>

                </div>

              </div>

              {/* INSURANCE */}
              <div>

                <label
                  htmlFor="insuranceCost"
                  className="mb-2 block text-xs font-semibold text-slate-700"
                >
                  Insurance
                </label>

                <div className="relative">

                  <input
                    id="insuranceCost"
                    name="insuranceCost"
                    type="number"
                    min="0"
                    value={formData.insuranceCost}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 pr-14 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[#173563] focus:ring-4 focus:ring-[#173563]/10"
                  />

                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                    USD
                  </span>

                </div>

              </div>

              {/* OTHER COSTS */}
              <div>

                <label
                  htmlFor="otherCosts"
                  className="mb-2 block text-xs font-semibold text-slate-700"
                >
                  Other import costs
                </label>

                <div className="relative">

                  <input
                    id="otherCosts"
                    name="otherCosts"
                    type="number"
                    min="0"
                    value={formData.otherCosts}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 pr-14 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[#173563] focus:ring-4 focus:ring-[#173563]/10"
                  />

                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                    USD
                  </span>

                </div>

                <p className="mt-1.5 text-[10px] text-slate-400">
                  Optional handling, documentation, or other estimated
                  costs.
                </p>

              </div>

              {/* CALCULATE */}
              <button
                type="button"
                onClick={handleCalculate}
                disabled={!formData.productValue}
                className={`flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all ${
                  formData.productValue
                    ? "bg-[#173563] text-white shadow-lg shadow-[#173563]/10 hover:-translate-y-0.5 hover:bg-[#102A50]"
                    : "cursor-not-allowed bg-slate-200 text-slate-400"
                }`}
              >
                <CalculatorIcon size={17} />
                Calculate import cost
              </button>

            </div>
          </section>

          {/* =================================================
              RIGHT SUMMARY
          ================================================= */}
          <section className="h-fit rounded-2xl border border-slate-200 bg-white">

            <div className="border-b border-slate-100 px-5 py-5">

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="text-sm font-bold text-slate-900">
                    Cost estimate
                  </h2>

                  <p className="mt-1 text-[11px] text-slate-400">
                    Estimated breakdown
                  </p>

                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                  <CalculatorIcon size={17} />
                </div>

              </div>

            </div>

            <div className="p-5">

              {!calculated ? (
                <div className="py-8 text-center">

                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                    <CalculatorIcon size={21} />
                  </div>

                  <p className="mt-4 text-sm font-semibold text-slate-700">
                    Your estimate will appear here
                  </p>

                  <p className="mx-auto mt-1.5 max-w-[250px] text-xs leading-5 text-slate-400">
                    Enter your product value and calculate to see the
                    estimated import cost.
                  </p>

                </div>
              ) : (
                <div>

                  {/* TOTAL */}
                  <div className="rounded-xl bg-[#173563] p-5 text-white">

                    <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-200">
                      Estimated total
                    </p>

                    <p className="mt-1 text-3xl font-bold tracking-tight">
                      ${formatMoney(calculation.estimatedTotal)}
                    </p>

                    <p className="mt-1 text-[10px] text-blue-200">
                      Includes estimated taxes and entered costs
                    </p>

                  </div>

                  {/* BREAKDOWN */}
                  <div className="mt-5 space-y-3">

                    <div className="flex items-center justify-between text-xs">

                      <span className="text-slate-500">
                        Product value
                      </span>

                      <span className="font-semibold text-slate-800">
                        ${formatMoney(calculation.productValue)}
                      </span>

                    </div>

                    <div className="flex items-center justify-between text-xs">

                      <span className="text-slate-500">
                        Shipping
                      </span>

                      <span className="font-semibold text-slate-800">
                        ${formatMoney(calculation.shipping)}
                      </span>

                    </div>

                    <div className="flex items-center justify-between text-xs">

                      <span className="text-slate-500">
                        Insurance
                      </span>

                      <span className="font-semibold text-slate-800">
                        ${formatMoney(calculation.insurance)}
                      </span>

                    </div>

                    <div className="my-3 border-t border-slate-100" />

                    <div className="flex items-center justify-between text-xs">

                      <span className="text-slate-500">
                        CIF value
                      </span>

                      <span className="font-semibold text-slate-800">
                        ${formatMoney(calculation.cifValue)}
                      </span>

                    </div>

                    <div className="flex items-center justify-between text-xs">

                      <span className="text-slate-500">
                        Customs duty
                        <span className="ml-1 text-[9px] text-slate-400">
                          10%
                        </span>
                      </span>

                      <span className="font-semibold text-slate-800">
                        ${formatMoney(calculation.customsDuty)}
                      </span>

                    </div>

                    <div className="flex items-center justify-between text-xs">

                      <span className="text-slate-500">
                        VAT
                        <span className="ml-1 text-[9px] text-slate-400">
                          18%
                        </span>
                      </span>

                      <span className="font-semibold text-slate-800">
                        ${formatMoney(calculation.vat)}
                      </span>

                    </div>

                    <div className="flex items-center justify-between text-xs">

                      <span className="text-slate-500">
                        Other costs
                      </span>

                      <span className="font-semibold text-slate-800">
                        ${formatMoney(calculation.otherCosts)}
                      </span>

                    </div>

                    <div className="my-3 border-t border-slate-100" />

                    <div className="flex items-center justify-between">

                      <span className="text-sm font-bold text-slate-800">
                        Total
                      </span>

                      <span className="text-sm font-bold text-[#173563]">
                        ${formatMoney(calculation.estimatedTotal)}
                      </span>

                    </div>

                  </div>

                  {/* RATE INFO */}
                  <div className="mt-5 rounded-xl bg-slate-50 p-3.5">

                    <div className="flex items-start gap-2">

                      <Info
                        size={14}
                        className="mt-0.5 shrink-0 text-slate-400"
                      />

                      <p className="text-[10px] leading-5 text-slate-500">
                        This is an estimate based on the rates currently
                        configured in the application. Actual customs
                        charges may vary.
                      </p>

                    </div>

                  </div>

                </div>
              )}

            </div>
          </section>

        </div>

        {/* ===================================================
            TAX NOTICE
        =================================================== */}
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50/60 px-4 py-3.5">

          <ShieldCheck
            size={16}
            className="mt-0.5 shrink-0 text-amber-600"
          />

          <div>

            <p className="text-[11px] font-semibold text-amber-800">
              Important: Estimated figures
            </p>

            <p className="mt-0.5 text-[10px] leading-5 text-amber-700">
              Import duties and taxes depend on the final HS classification,
              customs valuation, applicable exemptions, and current
              regulations. Use this calculator for planning purposes only.
            </p>

          </div>

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
            onClick={handleContinue}
            className={`group flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all ${
              calculated
                ? "bg-[#173563] text-white shadow-lg shadow-[#173563]/10 hover:-translate-y-0.5 hover:bg-[#102A50]"
                : "cursor-not-allowed bg-slate-200 text-slate-400"
            }`}
          >
            Continue to Find Agent

            <ArrowRight
              size={17}
              className={`transition-transform ${
                calculated
                  ? "group-hover:translate-x-0.5"
                  : ""
              }`}
            />
          </button>

        </div>

        {/* ===================================================
            FOOTER
        =================================================== */}
        <div className="mt-6 flex items-center justify-center gap-2 text-center text-[10px] text-slate-400">

          <RefreshCw size={12} />

          <span>
            Your calculation is saved with this import.
          </span>

        </div>

      </main>
    </div>
  );
}

export default Calculator;