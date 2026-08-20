import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Search,
  Package,
  CheckCircle2,
  Info,
  ShieldCheck,
  Sparkles,
  FileText,
  X,
  ChevronRight,
  CircleHelp,
} from "lucide-react";

import AppNavbar from "../components/ui/AppNavbar";
import BackButton from "../components/ui/BackButton";

function HSCodeSearch() {
  const navigate = useNavigate();

  const [importData, setImportData] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedCode, setSelectedCode] = useState(null);

  useEffect(() => {
    const savedImport = localStorage.getItem("currentImport");

    if (savedImport) {
      try {
        setImportData(JSON.parse(savedImport));
      } catch (error) {
        console.error("Unable to read import data:", error);
      }
    }
  }, []);

  /*
   * Demo HS code database.
   * Replace these records with real tariff/customs data later.
   */
  const hsCodes = [
    {
      code: "8541.43",
      title:
        "Photovoltaic cells assembled in modules or made up into panels",
      category: "Solar & Renewable Energy",
      keywords: [
        "solar",
        "solar panel",
        "solar panels",
        "photovoltaic",
        "pv",
        "panel",
      ],
      confidence: "High",
      description:
        "Classification commonly associated with photovoltaic cells assembled in modules or panels.",
    },
    {
      code: "8471.30",
      title:
        "Portable automatic data processing machines, weighing not more than 10 kg",
      category: "Electronics & Computers",
      keywords: [
        "laptop",
        "computer",
        "notebook",
        "portable computer",
      ],
      confidence: "High",
      description:
        "Example classification for certain portable computers and related devices.",
    },
    {
      code: "8471.49",
      title:
        "Other automatic data processing machines presented in the form of systems",
      category: "Electronics & Computers",
      keywords: [
        "desktop",
        "computer",
        "pc",
        "server",
        "computer system",
      ],
      confidence: "Medium",
      description:
        "Example classification for certain computer systems.",
    },
    {
      code: "6109.10",
      title: "T-shirts, singlets and other vests of cotton",
      category: "Textiles & Apparel",
      keywords: [
        "shirt",
        "t-shirt",
        "tshirt",
        "cotton shirt",
        "clothing",
      ],
      confidence: "High",
      description:
        "Example classification for certain cotton knitted garments.",
    },
    {
      code: "8703.23",
      title:
        "Motor cars and other motor vehicles principally designed for transport of persons",
      category: "Motor Vehicles & Parts",
      keywords: [
        "car",
        "vehicle",
        "motor car",
        "automobile",
      ],
      confidence: "Medium",
      description:
        "Example classification for certain passenger motor vehicles.",
    },
    {
      code: "8504.40",
      title: "Electrical static converters",
      category: "Electrical Equipment",
      keywords: [
        "inverter",
        "converter",
        "power converter",
        "solar inverter",
      ],
      confidence: "Medium",
      description:
        "Example classification for electrical static converters.",
    },
  ];

  /*
   * Load product name from previous import step.
   */
  useEffect(() => {
    if (importData?.productName) {
      setSearch(importData.productName);
    }
  }, [importData]);

  /*
   * Search and rank results.
   */
  const results = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return hsCodes;
    }

    const words = query.split(/\s+/).filter(Boolean);

    return hsCodes
      .map((item) => {
        let score = 0;

        const title = item.title.toLowerCase();
        const category = item.category.toLowerCase();

        const keywords = item.keywords.map((keyword) =>
          keyword.toLowerCase()
        );

        if (title.includes(query)) {
          score += 10;
        }

        if (category.includes(query)) {
          score += 6;
        }

        words.forEach((word) => {
          if (title.includes(word)) {
            score += 4;
          }

          if (category.includes(word)) {
            score += 3;
          }

          if (
            keywords.some((keyword) =>
              keyword.includes(word)
            )
          ) {
            score += 7;
          }
        });

        return {
          ...item,
          score,
        };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);
  }, [search]);

  const handleSelectCode = (item) => {
    setSelectedCode(item);
  };

  const handleContinue = () => {
    if (!selectedCode) {
      return;
    }

    const updatedImport = {
      ...(importData || {}),
      hsCode: selectedCode.code,
      hsCodeTitle: selectedCode.title,
      hsCodeCategory: selectedCode.category,
      hsCodeConfidence: selectedCode.confidence,
      hsCodeDescription: selectedCode.description,
      status: "HS Code Selected",
    };

    localStorage.setItem(
      "currentImport",
      JSON.stringify(updatedImport)
    );

    navigate("/calculator");
  };

  const clearSearch = () => {
    setSearch("");
    setSelectedCode(null);
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-900">

      {/* =====================================================
          ANIMATIONS
      ====================================================== */}

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

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.96);
          }

          to {
            opacity: 1;
            transform: scale(1);
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
          animation: fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .scale-in {
          animation: scaleIn 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .pulse-soft {
          animation: pulseSoft 2.5s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .fade-up,
          .scale-in,
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

      <main className="mx-auto w-full max-w-[980px] px-5 py-8 sm:px-8 lg:py-10">

        {/* ===================================================
            BACK BUTTON
        ==================================================== */}

        <div className="mb-6">
          <BackButton current="HS Code Search" />
        </div>

        {/* ===================================================
            PAGE HEADER
        ==================================================== */}

        <section className="fade-up mb-8">

          <div className="flex flex-col items-center justify-center text-center">

            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5">

              <Sparkles
                size={13}
                className="text-blue-600"
                strokeWidth={2}
              />

              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-700">
                Classification assistant
              </span>

            </div>

            <h1 className="text-[28px] font-bold tracking-[-0.04em] text-[#14213D] sm:text-[40px]">
              Find your HS code
            </h1>

            <p className="mx-auto mt-2 max-w-2xl text-[13px] leading-6 text-slate-500 sm:text-sm">
              Search for your product and select the most appropriate
              classification. ImportEase will use this information to
              estimate your import costs.
            </p>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5">

              <ShieldCheck
                size={14}
                className="text-emerald-600"
              />

              <span className="text-[10px] font-semibold text-emerald-700">
                Secure classification workspace
              </span>

            </div>

          </div>

        </section>

        {/* ===================================================
            SMALL CENTERED PROGRESS BAR
        ==================================================== */}

        <section className="fade-up mx-auto mb-7 w-full max-w-[760px] rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-[0_2px_8px_rgba(15,23,42,.02)]">

          <div className="flex items-center">

            {/* STEP 1 */}

            <div className="flex shrink-0 items-center gap-2">

              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
                <CheckCircle2 size={14} />
              </div>

              <span className="hidden text-[11px] font-semibold text-emerald-700 sm:block">
                Import details
              </span>

            </div>

            <div className="mx-2 h-px flex-1 bg-emerald-200" />

            {/* STEP 2 */}

            <div className="flex shrink-0 items-center gap-2">

              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#173B6C] text-[11px] font-bold text-white shadow-sm">
                2
              </div>

              <span className="hidden text-[11px] font-semibold text-[#173B6C] sm:block">
                HS Code
              </span>

            </div>

            <div className="mx-2 h-px flex-1 bg-slate-200" />

            {/* STEP 3 */}

            <div className="flex shrink-0 items-center gap-2">

              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-400">
                3
              </div>

              <span className="hidden text-[11px] font-medium text-slate-400 sm:block">
                Costs
              </span>

            </div>

            <div className="mx-2 h-px flex-1 bg-slate-200" />

            {/* STEP 4 */}

            <div className="flex shrink-0 items-center gap-2">

              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-400">
                4
              </div>

              <span className="hidden text-[11px] font-medium text-slate-400 sm:block">
                Agent
              </span>

            </div>

          </div>

        </section>

        {/* ===================================================
            IMPORT SUMMARY
        ==================================================== */}

        {importData && (
          <section className="fade-up mb-6 rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,.02)]">

            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex min-w-0 items-start gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-[#173B6C]">
                  <Package
                    size={18}
                    strokeWidth={1.8}
                  />
                </div>

                <div className="min-w-0">

                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Current import
                  </p>

                  <h2 className="mt-1 truncate text-sm font-bold text-slate-800">
                    {importData.productName || "Unnamed product"}
                  </h2>

                  <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">

                    <span>
                      {importData.quantity || "—"}{" "}
                      {importData.unit || "units"}
                    </span>

                    {importData.country && (
                      <>
                        <span className="text-slate-300">
                          •
                        </span>

                        <span>
                          {importData.country}
                        </span>
                      </>
                    )}

                    {importData.category && (
                      <>
                        <span className="text-slate-300">
                          •
                        </span>

                        <span>
                          {importData.category}
                        </span>
                      </>
                    )}

                  </div>

                </div>

              </div>

              <Link
                to="/new-import"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#173B6C] transition hover:text-blue-700"
              >
                Edit details

                <ChevronRight size={13} />
              </Link>

            </div>

          </section>
        )}

        {/* ===================================================
            SEARCH CARD
        ==================================================== */}

<section className="fade-up rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
          {/* CARD HEADER */}

          <div className="border-b border-slate-100 px-5 py-5 sm:px-6">

            <div className="flex items-start justify-between gap-4">

              <div>

                <div className="flex items-center gap-2">

                  <h2 className="text-sm font-bold text-[#14213D]">
                    Product classification
                  </h2>

                  <div className="hidden rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-semibold text-slate-500 sm:block">
                    Step 2 of 4
                  </div>

                </div>

                <p className="mt-1 text-[11px] leading-5 text-slate-500">
                  Search using the product name, material, model,
                  or main purpose.
                </p>

              </div>

              <div className="hidden h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 sm:flex">

                <Search
                  size={15}
                  strokeWidth={1.8}
                />

              </div>

            </div>

          </div>

          {/* SEARCH AREA */}

          <div className="p-5 sm:p-6">

            <div className="relative">

              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                strokeWidth={1.8}
              />

              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedCode(null);
                }}
                placeholder="Search your product..."
                aria-label="Search product for HS code"
                className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-11 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-400 focus:border-[#173B6C] focus:ring-4 focus:ring-[#173B6C]/10"
              />

              {search && (
                <button
                  type="button"
                  onClick={clearSearch}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={15} />
                </button>
              )}

            </div>

            {/* SEARCH HELP */}

            <div className="mt-3 flex items-start gap-2">

              <CircleHelp
                size={13}
                className="mt-0.5 shrink-0 text-slate-400"
              />

              <p className="text-[10px] leading-5 text-slate-400">
                Try specific terms such as{" "}
                <span className="font-semibold text-slate-500">
                  solar panels
                </span>
                ,{" "}
                <span className="font-semibold text-slate-500">
                  laptop computer
                </span>
                ,{" "}
                <span className="font-semibold text-slate-500">
                  cotton t-shirt
                </span>
                , or{" "}
                <span className="font-semibold text-slate-500">
                  motor car
                </span>
                .
              </p>

            </div>

          </div>

        </section>

        {/* ===================================================
            RESULTS HEADER
        ==================================================== */}

        <section className="mt-7">

          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <div className="flex items-center gap-2">

                <h2 className="text-sm font-bold text-[#14213D]">
                  Matching classifications
                </h2>

                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-500">
                  {results.length}
                </span>

              </div>

              <p className="mt-1 text-[11px] text-slate-500">
                Review the available classifications and select the
                closest match.
              </p>

            </div>

            {search && results.length > 0 && (
              <p className="text-[10px] text-slate-400">
                Results ranked by keyword relevance
              </p>
            )}

          </div>

          {/* RESULTS */}

          <div className="space-y-3">

            {results.length > 0 ? (
              results.map((item, index) => {

                const selected =
                  selectedCode?.code === item.code;

                const recommended =
                  index === 0 &&
                  search.trim().length > 0;

                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() =>
                      handleSelectCode(item)
                    }
                    className={`group relative w-full overflow-hidden rounded-2xl border bg-white p-5 text-left transition-all duration-300 sm:p-6 ${
                      selected
                        ? "border-[#173B6C] bg-[#173B6C]/[0.025] shadow-[0_8px_30px_rgba(23,59,108,.09)]"
                        : "border-slate-200 shadow-[0_2px_10px_rgba(15,23,42,.018)] hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_10px_28px_rgba(15,23,42,.06)]"
                    }`}
                  >

                    {/* BEST MATCH */}

                    {recommended && (
                      <div className="absolute right-0 top-0">

                        <div className="rounded-bl-xl bg-blue-50 px-3 py-1.5">

                          <span className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-[0.12em] text-blue-700">

                            <Sparkles size={10} />

                            Best match

                          </span>

                        </div>

                      </div>
                    )}

                    <div className="flex items-start gap-4">

                      {/* NUMBER */}

                      <div
                        className={`hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition sm:flex ${
                          selected
                            ? "bg-[#173B6C] text-white"
                            : "bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-700"
                        }`}
                      >
                        {index + 1}
                      </div>

                      {/* CONTENT */}

                      <div className="min-w-0 flex-1">

                        <div className="flex flex-wrap items-center gap-2 pr-16 sm:pr-20">

                          <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-[11px] font-bold text-slate-700">
                            HS {item.code}
                          </span>

                          <span
                            className={`rounded-full px-2 py-1 text-[8px] font-bold uppercase tracking-[0.08em] ${
                              item.confidence === "High"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {item.confidence} confidence
                          </span>

                        </div>

                        <h3 className="mt-3 text-[13px] font-bold leading-5 text-slate-800 transition-colors group-hover:text-[#173B6C] sm:text-sm">
                          {item.title}
                        </h3>

                        <p className="mt-1.5 max-w-3xl text-[11px] leading-5 text-slate-500 sm:text-xs">
                          {item.description}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1">

                          <span className="text-[9px] font-medium uppercase tracking-wide text-slate-400">
                            Category
                          </span>

                          <span className="text-[10px] font-semibold text-slate-600">
                            {item.category}
                          </span>

                        </div>

                      </div>

                      {/* SELECT INDICATOR */}

                      <div
                        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
                          selected
                            ? "scale-105 border-[#173B6C] bg-[#173B6C] text-white"
                            : "border-slate-200 text-transparent group-hover:border-blue-300 group-hover:text-blue-300"
                        }`}
                      >
                        <CheckCircle2
                          size={17}
                          strokeWidth={2}
                        />
                      </div>

                    </div>

                  </button>
                );
              })
            ) : (

              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-[0_2px_10px_rgba(15,23,42,.015)]">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                  <Search size={21} />
                </div>

                <h3 className="mt-4 text-sm font-bold text-slate-800">
                  No matching classifications
                </h3>

                <p className="mx-auto mt-1.5 max-w-md text-[11px] leading-5 text-slate-500">
                  Try a broader product name or include information
                  about the material, model, or purpose of the product.
                </p>

                <button
                  type="button"
                  onClick={clearSearch}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-[10px] font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
                >
                  Clear search
                </button>

              </div>

            )}

          </div>

        </section>

        {/* ===================================================
            SELECTED CODE
        ==================================================== */}

        {selectedCode && (
          <section className="scale-in mt-6 overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-[0_8px_28px_rgba(37,99,235,.07)]">

            <div className="border-b border-blue-100 bg-blue-50/50 px-5 py-4 sm:px-6">

              <div className="flex items-center gap-2">

                <CheckCircle2
                  size={15}
                  className="text-emerald-600"
                />

                <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-blue-700">
                  Classification selected
                </p>

              </div>

            </div>

            <div className="p-5 sm:p-6">

              <div className="flex items-start gap-4">

                <div className="pulse-soft flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#173B6C] text-white shadow-sm">

                  <FileText
                    size={19}
                    strokeWidth={1.8}
                  />

                </div>

                <div className="min-w-0 flex-1">

                  <div className="flex flex-wrap items-center gap-2">

                    <span className="font-mono text-lg font-bold tracking-tight text-[#173B6C]">
                      {selectedCode.code}
                    </span>

                    <span
                      className={`rounded-full px-2 py-1 text-[8px] font-bold uppercase tracking-wide ${
                        selectedCode.confidence === "High"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {selectedCode.confidence} confidence
                    </span>

                  </div>

                  <h3 className="mt-1 text-[13px] font-bold leading-5 text-slate-800 sm:text-sm">
                    {selectedCode.title}
                  </h3>

                  <p className="mt-2 text-[11px] leading-5 text-slate-500">
                    This classification will be carried forward to the
                    calculator so ImportEase can estimate the relevant
                    import costs.
                  </p>

                </div>

              </div>

            </div>

          </section>
        )}

        {/* ===================================================
            IMPORTANT NOTICE
        ==================================================== */}

        <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50/60 px-4 py-3.5">

          <ShieldCheck
            size={16}
            className="mt-0.5 shrink-0 text-amber-600"
            strokeWidth={1.8}
          />

          <div>

            <p className="text-[10px] font-bold text-amber-800">
              Classification guidance
            </p>

            <p className="mt-0.5 text-[10px] leading-5 text-amber-800/80">
              HS code suggestions are intended to assist with
              classification. Final classification should be verified
              against the applicable official tariff and customs
              information before completing an import.
            </p>

          </div>

        </div>

        {/* ===================================================
            ACTIONS
        ==================================================== */}

        <div className="mt-7 flex flex-col-reverse items-stretch justify-between gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center">

          <Link
            to="/new-import"
            className="group flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-slate-500 transition-all duration-200 hover:bg-slate-100 hover:text-slate-800 sm:justify-start"
          >

            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-0.5"
            />

            Back to import details

          </Link>

          <button
            type="button"
            disabled={!selectedCode}
            onClick={handleContinue}
            className={`group flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 ${
              selectedCode
                ? "bg-[#173B6C] text-white shadow-[0_6px_18px_rgba(23,59,108,.16)] hover:-translate-y-0.5 hover:bg-[#12315B] hover:shadow-[0_10px_24px_rgba(23,59,108,.22)]"
                : "cursor-not-allowed bg-slate-200 text-slate-400"
            }`}
          >

            Continue to Calculator

            <ArrowRight
              size={17}
              className={`transition-transform duration-200 ${
                selectedCode
                  ? "group-hover:translate-x-0.5"
                  : ""
              }`}
            />

          </button>

        </div>

        {/* ===================================================
            FOOTER INFO
        ==================================================== */}

        <div className="mt-6 flex items-center justify-center gap-2 text-center text-[10px] text-slate-400">

          <Info size={12} />

          <span>
            Your selected classification will be saved to this import.
          </span>

        </div>

      </main>
    </div>
  );
}

export default HSCodeSearch;