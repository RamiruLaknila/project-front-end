import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Calculator,
  Question,
  Info,
  Package,
  ArrowsCounterClockwise,
  ShieldCheck,
  Sparkle,
  Truck,
  Globe,
  WarningCircle,
  Tag,
  CheckCircle,
  CurrencyDollar,
} from "@phosphor-icons/react";

import AppNavbar from "../components/ui/AppNavbar";
import BackButton from "../components/ui/BackButton";
import { api, ApiError } from "../lib/api";

// Labels for every levy the backend's duty_calculator.py can return, in the
// order they're applied: CID -> SCD -> PAL -> Cess -> Excise -> SCL -> SSCL
// -> VAT. SCL, when present on a code, replaces CID only -- every other
// layer still applies normally on top.
const LEVY_LABELS = {
  cid: "Customs Import Duty (CID)",
  scd: "Surcharge on Customs Duty (SCD)",
  pal: "Ports & Airports Levy (PAL)",
  cess: "Cess",
  excise: "Excise (Special Provisions Duty)",
  scl: "Special Commodity Levy (SCL)",
  sscl: "Social Security Contribution Levy (SSCL)",
  vat: "VAT",
  luxuryTax: "Luxury Tax",
};

// The origin dropdown only offers this curated set, in this order, rather
// than every country in duty_calculator.py's full PREFERENTIAL_AGREEMENTS
// data. Thailand is deliberately excluded: it only qualifies under GSTP (the
// broad, weaker catch-all agreement), not APTA -- the backend still checks
// every agreement a selected country qualifies for and uses whichever rate
// is cheapest, this list just curates what's offered here.
const ORIGIN_COUNTRY_ORDER = [
  "India",
  "Pakistan",
  "Singapore",
  "China",
  "South Korea",
  "Bangladesh",
  "Nepal",
];

function ImportCalculator() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    cifUsd: "",
    origin: "",
    otherCharges: "",
  });

  const [result, setResult] = useState(null);
  const [calculating, setCalculating] = useState(false);
  const [calcError, setCalcError] = useState("");

  /* =========================================================
     LOAD THE HS CODE PICKED IN THE PREVIOUS STEP
     Read once, lazily, as the initial state -- no effect needed, and
     hsCodeMissing is just derived from whether we got a usable hsCode.
  ========================================================= */

  const [importData, setImportData] = useState(() => {
    try {
      const saved = localStorage.getItem("currentImport");
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      return parsed.hsCode ? parsed : null;
    } catch (error) {
      console.error("Unable to read import data:", error);
      return null;
    }
  });

  const hsCodeMissing = !importData?.hsCode;

  /* =========================================================
     FULL HS CODE DETAIL -- fetched fresh from Firestore (via the backend),
     not trusted from the localStorage snapshot the search step left behind.
  ========================================================= */

  const [codeDetail, setCodeDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(true);
  const [detailError, setDetailError] = useState("");

  useEffect(() => {
    if (!importData?.hsCode) return;
    let active = true;

    (async () => {
      try {
        const detail = await api.get(
          `/hscodes/${encodeURIComponent(importData.hsCode)}`,
          { auth: false }
        );
        if (active) setCodeDetail(detail);
      } catch (err) {
        if (active) {
          setDetailError(
            err instanceof ApiError ? err.message : "Could not load this HS code."
          );
        }
      } finally {
        if (active) setDetailLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [importData?.hsCode]);

  /* =========================================================
     ORIGIN-COUNTRY DROPDOWN + LIVE USD -> LKR EXCHANGE RATE
  ========================================================= */

  const [countries, setCountries] = useState([]);
  const [exchangeRate, setExchangeRate] = useState(null); // { rate, asOf }
  const [rateError, setRateError] = useState("");
  const [manualRate, setManualRate] = useState("");
  const [editingRate, setEditingRate] = useState(false);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const list = await api.get("/hscodes/preferential-countries", { auth: false });
        if (!active) return;
        const byCountry = new Map(list.map((c) => [c.country, c]));
        const curated = ORIGIN_COUNTRY_ORDER.map((name) => byCountry.get(name)).filter(Boolean);
        setCountries(curated);
      } catch {
        /* dropdown just falls back to "General (no FTA)" only */
      }
    })();

    (async () => {
      try {
        const rate = await api.get("/exchange-rate", { auth: false });
        if (active) setExchangeRate(rate);
      } catch (err) {
        if (active) {
          setRateError(
            err instanceof ApiError
              ? err.message
              : "Live exchange rate unavailable -- enter it manually below."
          );
        }
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  // A manual override always wins once set, regardless of whether the live
  // fetch succeeded -- "Edit" is available any time, not just as a fallback.
  const effectiveRate =
    manualRate.trim() !== "" ? Number(manualRate) || null : exchangeRate?.rate ?? null;

  /* =========================================================
     LOCAL SUB-TOTALS (client-side only, before the real duty call)
  ========================================================= */

  const cifUsd = Number(form.cifUsd) || 0;
  const cifLkr = effectiveRate ? cifUsd * effectiveRate : 0;
  const other = Number(form.otherCharges) || 0;

  const totalImportCost = result ? result.totalLandedCost + other : 0;

  /* =========================================================
     HANDLE CHANGE
  ========================================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setResult(null);
  };

  /* =========================================================
     CALCULATE -- GET /hscodes/{code}/landed-cost (public)
  ========================================================= */

  const calculate = async (e) => {
    e.preventDefault();
    setCalcError("");

    if (!importData?.hsCode) {
      return;
    }

    if (!effectiveRate) {
      setCalcError("Exchange rate unavailable. Enter one manually below.");
      return;
    }

    if (cifUsd <= 0) {
      setCalcError("Enter a CIF value greater than zero.");
      return;
    }

    setCalculating(true);
    try {
      const params = new URLSearchParams({ value: String(cifLkr) });
      if (form.origin.trim()) params.set("origin", form.origin.trim());

      const data = await api.get(
        `/hscodes/${encodeURIComponent(importData.hsCode)}/landed-cost?${params}`,
        { auth: false }
      );
      setResult(data);

      const updatedImport = {
        ...importData,
        calculator: { ...form, cifLkr, exchangeRate: effectiveRate, ...data },
        status: "Cost Estimated",
      };
      localStorage.setItem("currentImport", JSON.stringify(updatedImport));
      setImportData(updatedImport);
    } catch (err) {
      setResult(null);
      setCalcError(
        err instanceof ApiError
          ? err.message
          : "Could not calculate the landed cost. Is the backend running?"
      );
    } finally {
      setCalculating(false);
    }
  };

  /* =========================================================
     RESET
  ========================================================= */

  const reset = () => {
    setForm({
      cifUsd: "",
      origin: "",
      otherCharges: "",
    });

    setResult(null);
    setCalcError("");
  };

  /* =========================================================
     CONTINUE
  ========================================================= */

  const continueToAgent = () => {
    navigate("/find-agent");
  };

  if (hsCodeMissing) {
    return <Navigate to="/hs-code-search" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-900">

      {/* =====================================================
          ANIMATIONS
      ====================================================== */}

            <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.98);
          }

          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulseSoft {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(23, 59, 108, 0);
          }

          50% {
            box-shadow: 0 0 0 6px rgba(23, 59, 108, 0.05);
          }
        }

        .fade-up {
          animation:
            fadeUp 0.25s cubic-bezier(0.22, 1, 0.36, 1)
            both;
        }

        .scale-in {
          animation:
            scaleIn 0.2s cubic-bezier(0.22, 1, 0.36, 1)
            both;
        }

        .slide-down {
          animation:
            slideDown 0.15s cubic-bezier(0.22, 1, 0.36, 1)
            both;
        }

        .pulse-soft {
          animation:
            pulseSoft 2.5s ease-in-out infinite;
        }

        .calculator-delay-1 {
          animation-delay: 0.02s;
        }

        .calculator-delay-2 {
          animation-delay: 0.04s;
        }

        .calculator-delay-3 {
          animation-delay: 0.06s;
        }

        .calculator-delay-4 {
          animation-delay: 0.08s;
        }

        .calculator-delay-5 {
          animation-delay: 0.1s;
        }

        @media (prefers-reduced-motion: reduce) {
          .fade-up,
          .scale-in,
          .slide-down,
          .pulse-soft {
            animation: none;
          }
        }
      `}</style>
      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <AppNavbar />

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <main className="mx-auto w-full max-w-[1000px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">

        {/* ===================================================
            BACK BUTTON
        ==================================================== */}

        <div className="fade-up mb-6">
          <BackButton current="Import Calculator" />
        </div>

        {/* ===================================================
            PAGE HEADER
        ==================================================== */}

        <section className="fade-up -mt-8 mb-6">

          <div className="flex flex-col items-center justify-center text-center">

            <h1 className="text-[35px] font-bold tracking-[-0.04em] text-[#14213D] sm:text-[45px]">
              Estimate your import cost
            </h1>

            <p className="mx-auto mt-2 max-w-2xl text-[14px] leading-6 text-slate-500 sm:text-[16px]">
              Estimate customs duty, VAT, freight, and other
              import costs before placing your order.
            </p>

          </div>

        </section>

        {/* ===================================================
            HS CODE SUMMARY
        ==================================================== */}

        <section className="fade-up mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,.025)]">

          <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-3">
            <div className="flex items-center gap-2">
              <Tag size={15} className="text-blue-600" />
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                Calculating for this HS code
              </p>
            </div>
            <Link
              to="/hs-code-search"
              className="shrink-0 text-[12px] font-semibold text-[#173B6C] hover:underline"
            >
              Change
            </Link>
          </div>

          <div className="p-5">
            {detailLoading ? (
              <div className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-[#173B6C]" />
                <p className="text-[12px] text-slate-400">Loading HS code details…</p>
              </div>
            ) : detailError ? (
              <div className="flex items-start gap-2">
                <WarningCircle size={16} className="mt-0.5 shrink-0 text-red-600" />
                <p className="text-[12px] leading-5 text-red-700">{detailError}</p>
              </div>
            ) : codeDetail ? (
              <div className="flex flex-wrap items-start justify-between gap-4">

                <div className="min-w-0">
                  <span className="font-mono text-base font-bold tracking-tight text-[#173B6C]">
                    {codeDetail.code}
                  </span>

                  <h3 className="mt-1 text-[14px] font-bold leading-5 text-slate-800">
                    {codeDetail.description || codeDetail.headingDescription}
                  </h3>

                  {codeDetail.classificationPath?.length > 0 && (
                    <p className="mt-1 text-[11px] font-semibold text-slate-400">
                      {codeDetail.classificationPath.join(" › ")}
                    </p>
                  )}

                  {codeDetail.chapterTitle && (
                    <div className="mt-2 inline-block rounded-lg border border-slate-200 bg-slate-50/60 px-2.5 py-1 text-[11px] text-slate-500">
                      Ch. {codeDetail.chapter} · {codeDetail.chapterTitle}
                    </div>
                  )}

                  {codeDetail.headingDescription &&
                    codeDetail.headingDescription !== codeDetail.description && (
                      <p className="mt-2 max-w-xl text-[10px] leading-4 text-slate-400">
                        {codeDetail.headingDescription}
                      </p>
                    )}
                </div>

                {/* ICL/SLSI status */}
                {codeDetail.iclSlsi ? (
                  <div className="flex shrink-0 items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 sm:max-w-[420px]">
                    <WarningCircle size={16} className="mt-0.5 shrink-0 text-amber-600" />
                    <div>
                      <p className="text-[11px] font-bold text-amber-800">
                        Import Control License (ICL) and SLSI certification required
                      </p>
                      <p className="mt-0.5 text-[10px] leading-4 text-amber-700">
                        Marking: {codeDetail.iclSlsi} — verify exact requirements
                        with Sri Lanka Customs / the Import &amp; Export Control
                        Department before importing.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex shrink-0 items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-3">
                    <CheckCircle size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                    <p className="text-[11px] font-semibold text-emerald-700">
                      No Import Control License (ICL) or SLSI certification required
                    </p>
                  </div>
                )}

              </div>
            ) : null}
          </div>

        </section>

        {/* ===================================================
            MAIN GRID
        ==================================================== */}

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">

          {/* =================================================
              LEFT FORM
          ================================================= */}

          <section className="fade-up calculator-delay-4 rounded-2xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,.025)]">

            {/* HEADER */}

            <div className="border-b border-slate-100 px-5 py-5 sm:px-6">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-700">

                  <Package
                    size={18}
                  />

                </div>

                <div>

                  <h2 className="text-base font-bold text-slate-900">
                    Import information
                  </h2>

                  <p className="mt-1 text-[14px] text-slate-500">
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

              {/* CIF VALUE (USD) */}

              <div>

                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <label htmlFor="cifUsd" className="text-sm font-semibold text-slate-700">
                    CIF value <span className="ml-1 text-red-500">*</span>
                  </label>
                  <span className="hidden text-[11px] text-slate-400 sm:block">
                    Cost + Insurance + Freight, as declared to Customs.
                  </span>
                </div>

                <div className="relative">
                  <CurrencyDollar
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="cifUsd"
                    name="cifUsd"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.cifUsd}
                    onChange={handleChange}
                    placeholder="e.g. 500"
                    required
                    className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-14 text-sm font-medium text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-400 focus:border-[#173B6C] focus:ring-2 focus:ring-[#173B6C]/10"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400">
                    USD
                  </span>
                </div>

                <p className="mt-1.5 text-[11px] text-slate-400 sm:hidden">
                  Cost + Insurance + Freight, as declared to Customs.
                </p>

                {/* EXCHANGE RATE -- always editable, not just as a fallback */}
                <div className="mt-2.5 rounded-lg bg-slate-50 px-3 py-2">
                  {editingRate ? (
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-500">1 USD =</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        autoFocus
                        value={manualRate}
                        onChange={(e) => setManualRate(e.target.value)}
                        placeholder="e.g. 300"
                        className="h-7 w-24 rounded-md border border-slate-300 px-2 text-[11px] outline-none focus:border-[#173B6C]"
                      />
                      <span className="text-[11px] text-slate-500">LKR</span>
                      <button
                        type="button"
                        onClick={() => setEditingRate(false)}
                        className="ml-auto text-[10px] font-semibold text-[#173B6C] hover:underline"
                      >
                        Done
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-3">
                      {manualRate.trim() !== "" ? (
                        <p className="text-[11px] text-slate-500">
                          1 USD = <span className="font-semibold text-slate-700">
                            {Number(manualRate).toFixed(2)} LKR
                          </span>{" "}
                          <span className="text-slate-400">(manual)</span>
                        </p>
                      ) : exchangeRate ? (
                        <p className="text-[11px] text-slate-500">
                          1 USD = <span className="font-semibold text-slate-700">
                            {exchangeRate.rate.toFixed(2)} LKR
                          </span>{" "}
                          <span className="text-slate-400">
                            ({exchangeRate.cached ? "cached" : "live"})
                          </span>
                        </p>
                      ) : rateError ? (
                        <p className="text-[11px] text-red-600">{rateError}</p>
                      ) : (
                        <span className="flex items-center gap-2 text-[11px] text-slate-400">
                          <span className="h-3 w-3 animate-spin rounded-full border-2 border-slate-300 border-t-[#173B6C]" />
                          Fetching live USD → LKR rate…
                        </span>
                      )}

                      <div className="flex shrink-0 items-center gap-3">
                        {manualRate.trim() !== "" && (
                          <button
                            type="button"
                            onClick={() => setManualRate("")}
                            className="text-[10px] font-semibold text-slate-500 hover:underline"
                          >
                            Use live rate
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setEditingRate(true)}
                          className="text-[10px] font-semibold text-[#173B6C] hover:underline"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {cifUsd > 0 && effectiveRate && (
                  <p className="mt-1.5 text-[11px] leading-5 text-slate-500">
                    ≈ <span className="font-semibold text-slate-700">
                      LKR {formatCurrency(cifLkr)}
                    </span>{" "}
                    at this rate
                  </p>
                )}

              </div>

              {/* ORIGIN */}

              <div className="border-t border-slate-100 pt-5">

                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <label htmlFor="origin" className="text-sm font-semibold text-slate-700">
                    Country of origin
                  </label>
                  <span className="hidden text-[11px] text-slate-400 sm:block">
                    Optional — may lower the duty rate.
                  </span>
                </div>

                <div className="relative">
                  <Globe
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <select
                    id="origin"
                    name="origin"
                    value={form.origin}
                    onChange={handleChange}
                    className="h-12 w-full appearance-none rounded-xl border border-slate-300 bg-white pl-10 pr-3.5 text-sm font-medium text-slate-800 outline-none transition-all duration-200 hover:border-slate-400 focus:border-[#173B6C] focus:ring-2 focus:ring-[#173B6C]/10"
                  >
                    <option value="">General (no FTA)</option>
                    {countries.map((c) => (
                      <option key={c.country} value={c.country}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <p className="mt-1.5 text-[11px] text-slate-400 sm:hidden">
                  Optional — may lower the duty rate.
                </p>
                <p className="mt-1.5 text-[11px] leading-5 text-slate-400">
                  If this HS code qualifies for a trade agreement with your
                  declared origin (e.g. ISFTA, SAFTA, APTA), the cheaper rate
                  is used automatically.
                </p>

              </div>

              {/* OTHER CHARGES */}

              <InputField
                label="Other charges"
                name="otherCharges"
                value={form.otherCharges}
                onChange={handleChange}
                placeholder="Optional"
                suffix="LKR"
                help="Port, handling, or other costs -- not part of Customs duty, added on top of the estimate."
              />

              {calcError && (
                <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                  <WarningCircle size={16} className="mt-0.5 shrink-0 text-red-600" />
                  <p className="text-[12px] leading-5 text-red-700">{calcError}</p>
                </div>
              )}

              {/* ACTIONS */}

              <div className="flex flex-col gap-2 pt-2 sm:flex-row">

                <button
                  type="submit"
                  disabled={calculating}
                  className="group flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#173B6C] py-3.5 text-sm font-bold text-white shadow-[0_6px_18px_rgba(23,59,108,.12)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#12315B] hover:shadow-[0_10px_24px_rgba(23,59,108,.18)] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                >

                  {calculating ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  ) : (
                    <Calculator
                      size={17}
                      className="transition-transform duration-300 group-hover:scale-105"
                    />
                  )}

                  {calculating ? "Calculating…" : "Calculate import cost"}

                </button>

                <button
                  type="button"
                  onClick={reset}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-600 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800"
                >

                  <ArrowsCounterClockwise size={15} />

                  Reset

                </button>

              </div>

            </form>

          </section>

          {/* =================================================
              RIGHT RESULT
          ================================================= */}

          <aside className="fade-up calculator-delay-5 h-fit lg:sticky lg:top-24">

            {/* RESULT CARD */}

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_14px_rgba(15,23,42,.035)]">

              {/* TOTAL */}

              <div className="bg-[#173B6C] px-5 py-5 text-white">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-200">
                      Estimated total
                    </p>

                    <h2 className="mt-2 text-[28px] font-bold tracking-[-0.03em]">
                      LKR {formatCurrency(totalImportCost)}
                    </h2>

                  </div>

                  <div className="pulse-soft flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">

                    <Sparkle size={19} />

                  </div>

                </div>

                <p className="mt-2 text-[12px] leading-4 text-blue-100">
                  Estimated landed import cost
                </p>

              </div>

              {/* BREAKDOWN */}

              <div className="p-5">

                <div className="space-y-3.5">

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[12px] text-slate-500">CIF value</span>
                    <span className="text-[12px] font-semibold text-slate-700">
                      USD {formatCurrency(cifUsd)}
                    </span>
                  </div>

                  <ResultRow
                    label="CIF value (LKR)"
                    value={result ? result.declaredValue : cifLkr}
                  />

                  {result && (
                    <>
                      <div className="my-3 border-t border-slate-100" />

                      <ResultRow
                        label={LEVY_LABELS.cid}
                        value={result.cid}
                        rate={result.rates?.cid}
                        note={
                          result.cidBasis === "replaced_by_scl"
                            ? "Replaced by the Special Commodity Levy (SCL) for this code"
                            : result.cidBasis?.startsWith("preferential")
                              ? result.cidBasis.replace("preferential:", "Preferential: ")
                              : null
                        }
                      />
                      {Object.entries(LEVY_LABELS)
                        .filter(([key]) => key !== "cid")
                        .map(([key, label]) =>
                          result[key] ? (
                            <ResultRow
                              key={key}
                              label={label}
                              value={result[key]}
                              rate={result.rates?.[key]}
                            />
                          ) : null
                        )}
                    </>
                  )}

                  {other > 0 && (
                    <ResultRow label="Other charges (your estimate)" value={other} />
                  )}

                  <div className="border-t border-slate-200 pt-4">

                    <div className="flex items-center justify-between gap-4">

                      <span className="text-sm font-bold text-slate-800">
                        Total import cost
                      </span>

                      <span className="text-base font-bold text-[#173B6C]">
                        LKR {formatCurrency(totalImportCost)}
                      </span>

                    </div>

                  </div>

                </div>

                {/* NOT CALCULATED */}

                {!result && !calculating && (

                  <div className="slide-down mt-5 rounded-xl border border-slate-100 bg-slate-50 p-4 text-center">

                    <p className="text-[12px] leading-5 text-slate-400">
                      Enter your values and calculate to
                      generate your estimate.
                    </p>

                  </div>

                )}

                {/* CALCULATING */}

                {calculating && (
                  <div className="slide-down mt-5 flex items-center justify-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-[#173B6C]" />
                    <p className="text-[12px] leading-5 text-slate-400">
                      Calculating your estimate…
                    </p>
                  </div>
                )}

                {/* CALCULATED */}

                {result && !calculating && (

                  <div className="scale-in mt-5 space-y-3">

                    <div className="flex items-start gap-2 rounded-xl border border-emerald-100 bg-emerald-50 p-4">

                      <ShieldCheck
                        size={15}
                        className="mt-0.5 shrink-0 text-emerald-600"
                      />

                      <p className="text-[12px] leading-5 text-emerald-700">
                        Estimate generated successfully. Review
                        the result before continuing.
                      </p>

                    </div>

                    {result.disclaimer && (
                      <div className="flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <Info size={14} className="mt-0.5 shrink-0 text-slate-400" />
                        <p className="text-[11px] leading-5 text-slate-500">
                          {result.disclaimer}
                        </p>
                      </div>
                    )}

                  </div>

                )}

              </div>

            </section>

            {/* =================================================
                HOW IT WORKS
            ================================================= */}

            <section className="slide-down mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)]">

              <div className="flex items-center gap-2">

                <Truck
                  size={16}
                  className="text-slate-500"
                />

                <h3 className="text-sm font-bold text-slate-800">
                  How the estimate works
                </h3>

              </div>

              <div className="mt-4 space-y-3.5">

                <Formula
                  number="01"
                  title="CIF value"
                  text="Product + freight"
                />

                <Formula
                  number="02"
                  title="Customs Import Duty (CID)"
                  text="On CIF -- uses a trade-agreement rate instead of the general rate if your declared origin qualifies and it's cheaper"
                />

                <Formula
                  number="03"
                  title="SCD, PAL, Cess, Excise"
                  text="Additional levies, each applied on top of CIF and/or CID where they apply to this code"
                />

                <Formula
                  number="04"
                  title="VAT & SSCL"
                  text="Charged on CIF + CID + every levy above"
                />

                <Formula
                  number="05"
                  title="SCL override"
                  text="If this code carries a Special Commodity Levy, it replaces the entire stack above"
                />

              </div>

            </section>

            {/* =================================================
                HELP CARD
            ================================================= */}

            <Link
              to="/hs-code-search"
              className="fade-up group mt-4 flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-sm"
            >

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-blue-700 shadow-sm">

                <Question size={17} />

              </div>

              <div className="min-w-0 flex-1">

                <p className="text-[12px] font-bold text-blue-900">
                  Not sure about your duty rate?
                </p>

                <p className="mt-1 text-[11px] leading-4 text-blue-700">
                  Search your product to review its HS code
                  and applicable tariff information.
                </p>

              </div>

              <ArrowRight
                size={15}
                className="text-blue-500 transition-transform duration-300 group-hover:translate-x-1"
              />

            </Link>

          </aside>

        </div>

        {/* ===================================================
            ACTIONS
        ==================================================== */}

        <div className="fade-up mt-7 flex flex-col-reverse items-stretch justify-between gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center">

          <Link
            to="/hs-code-search"
            className="flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 sm:justify-start"
          >

            <ArrowLeft size={17} />

            Back to HS Code

          </Link>

          <button
            type="button"
            disabled={!result}
            onClick={continueToAgent}
            className={`group flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold transition-all duration-300 ${
              result
                ? "bg-[#173B6C] text-white shadow-[0_6px_18px_rgba(23,59,108,.12)] hover:-translate-y-0.5 hover:bg-[#12315B] hover:shadow-[0_10px_24px_rgba(23,59,108,.18)]"
                : "cursor-not-allowed bg-slate-200 text-slate-400"
            }`}
          >

            Continue to Find Agent

            <ArrowRight
              size={18}
              className={`transition-transform duration-300 ${
                result
                  ? "group-hover:translate-x-0.5"
                  : ""
              }`}
            />

          </button>

        </div>

        {/* ===================================================
            FOOTER NOTE
        ==================================================== */}

        <div className="fade-up mt-6 flex items-center justify-center gap-2 text-center text-[12px] text-slate-400">

          <ShieldCheck
            size={14}
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
          className="text-sm font-semibold text-slate-700"
        >

          {label}

          {required && (
            <span className="ml-1 text-red-500">
              *
            </span>
          )}

        </label>

        <span className="hidden text-[11px] text-slate-400 sm:block">
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
          className="h-12 w-full rounded-xl border border-slate-300 bg-white px-3.5 pr-14 text-sm font-medium text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-400 focus:border-[#173B6C] focus:ring-2 focus:ring-[#173B6C]/10"
        />

        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400">
          {suffix}
        </span>

      </div>

      <p className="mt-1.5 text-[11px] text-slate-400 sm:hidden">
        {help}
      </p>

    </div>
  );
}

/* =========================================================
   RESULT ROW
========================================================= */

function ResultRow({ label, value, rate, note }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-4">

        <span className="min-w-0 flex-1 text-[12px] text-slate-500">
          {label}
          {rate && (
            <span className="ml-1.5 whitespace-nowrap rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
              {rate}
            </span>
          )}
        </span>

        <span className="shrink-0 whitespace-nowrap text-[12px] font-semibold text-slate-700">
          LKR {formatCurrency(value)}
        </span>

      </div>

      {note && (
        <p className="mt-0.5 text-[10px] leading-4 text-slate-400">{note}</p>
      )}
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

      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100 text-[10px] font-bold text-slate-500">
        {number}
      </div>

      <div>

        <p className="text-[11px] font-bold text-slate-700">
          {title}
        </p>

        <p className="mt-0.5 text-[10px] text-slate-400">
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