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
  ChevronRight,
  Sparkles,
  FileText,
} from "lucide-react";

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
   *
   * IMPORTANT:
   * These are example records for the UI flow.
   * Connect this section to your real tariff/customs data later.
   */
  const hsCodes = [
    {
      code: "8541.43",
      title: "Photovoltaic cells assembled in modules or made up into panels",
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
      title: "Other automatic data processing machines presented in the form of systems",
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
   * Determine the initial search term from the New Import page.
   */
  useEffect(() => {
    if (importData?.productName) {
      setSearch(importData.productName);
    }
  }, [importData]);

  /*
   * Search and rank matching results.
   */
  const results = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return hsCodes;
    }

    const words = query
      .split(/\s+/)
      .filter(Boolean);

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
          if (title.includes(word)) score += 4;
          if (category.includes(word)) score += 3;

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
            to="/new-import"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          >
            <ArrowLeft size={16} />

            <span className="hidden sm:inline">
              Back to Import
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

          <span className="text-slate-600">
            HS Code
          </span>

        </div>

        {/* ===================================================
            TITLE
        =================================================== */}
        <div className="mb-7">

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

            <div>

              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5">

                <Sparkles
                  size={13}
                  className="text-blue-600"
                />

                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
                  Classification assistant
                </span>

              </div>

              <h1 className="text-2xl font-bold tracking-tight text-[#14213D] sm:text-3xl">
                Find your HS code
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Search for your product and select the most appropriate
                HS code from the available classifications.
              </p>

            </div>

          </div>

        </div>

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

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#173563] text-xs font-bold text-white">
                2
              </div>

              <span className="hidden text-xs font-semibold text-[#173563] sm:block">
                HS Code
              </span>

            </div>

            <div className="mx-2 h-px flex-1 bg-slate-200" />

            {/* STEP 3 */}
            <div className="flex items-center gap-2">

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-400">
                3
              </div>

              <span className="hidden text-xs text-slate-400 sm:block">
                Costs
              </span>

            </div>

            <div className="mx-2 h-px flex-1 bg-slate-200" />

            {/* STEP 4 */}
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
            IMPORT SUMMARY
        =================================================== */}
        {importData && (
          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-start gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                  <Package size={19} />
                </div>

                <div>

                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Current import
                  </p>

                  <h2 className="mt-0.5 text-sm font-bold text-slate-800">
                    {importData.productName || "Unnamed product"}
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    {importData.quantity || "—"}{" "}
                    {importData.unit || "units"}
                    {importData.country
                      ? ` • ${importData.country}`
                      : ""}
                  </p>

                </div>
              </div>

              <Link
                to="/new-import"
                className="text-xs font-semibold text-blue-700 hover:text-blue-800"
              >
                Edit details
              </Link>

            </div>

          </section>
        )}

        {/* ===================================================
            SEARCH CARD
        =================================================== */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.025)]">

          <div className="border-b border-slate-100 px-5 py-5 sm:px-6">

            <h2 className="text-sm font-bold text-slate-900">
              Product classification
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Search using the product name, material, or main purpose.
            </p>

          </div>

          <div className="p-5 sm:p-6">

            {/* SEARCH */}
            <div className="relative">

              <Search
                size={19}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your product..."
                className="h-13 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[#173563] focus:ring-4 focus:ring-[#173563]/10"
              />

            </div>

            {/* SEARCH HELP */}
            <div className="mt-3 flex items-start gap-2">

              <Info
                size={14}
                className="mt-0.5 shrink-0 text-slate-400"
              />

              <p className="text-[11px] leading-5 text-slate-400">
                Example searches: solar panels, laptop computer,
                cotton t-shirt, motor car, inverter.
              </p>

            </div>

          </div>
        </section>

        {/* ===================================================
            RESULTS
        =================================================== */}
        <section className="mt-6">

          <div className="mb-4 flex items-center justify-between">

            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Matching classifications
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {results.length}{" "}
                {results.length === 1
                  ? "possible match"
                  : "possible matches"}{" "}
                found
              </p>
            </div>

          </div>

          <div className="space-y-3">

            {results.length > 0 ? (
              results.map((item, index) => {
                const selected =
                  selectedCode?.code === item.code;

                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => handleSelectCode(item)}
                    className={`group w-full rounded-2xl border bg-white p-5 text-left transition-all duration-200 ${
                      selected
                        ? "border-[#173563] bg-blue-50/30 shadow-[0_6px_24px_rgba(23,53,99,0.08)]"
                        : "border-slate-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                    }`}
                  >

                    <div className="flex items-start gap-4">

                      {/* NUMBER */}
                      <div
                        className={`hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold sm:flex ${
                          selected
                            ? "bg-[#173563] text-white"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {index + 1}
                      </div>

                      <div className="min-w-0 flex-1">

                        <div className="flex flex-wrap items-center gap-2">

                          <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs font-bold text-slate-700">
                            HS {item.code}
                          </span>

                          <span
                            className={`rounded-full px-2 py-1 text-[9px] font-bold uppercase tracking-wide ${
                              item.confidence === "High"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {item.confidence} confidence
                          </span>

                        </div>

                        <h3 className="mt-3 text-sm font-semibold leading-5 text-slate-800">
                          {item.title}
                        </h3>

                        <p className="mt-1.5 text-xs leading-5 text-slate-500">
                          {item.description}
                        </p>

                        <div className="mt-3 flex items-center gap-2">

                          <span className="text-[10px] font-medium text-slate-400">
                            Category
                          </span>

                          <span className="text-[10px] font-semibold text-slate-600">
                            {item.category}
                          </span>

                        </div>

                      </div>

                      {/* SELECT */}
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition ${
                          selected
                            ? "border-[#173563] bg-[#173563] text-white"
                            : "border-slate-200 text-transparent group-hover:border-blue-300"
                        }`}
                      >
                        <CheckCircle2 size={17} />
                      </div>

                    </div>

                  </button>
                );
              })
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                  <Search size={21} />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-slate-800">
                  No matching classifications
                </h3>

                <p className="mx-auto mt-1.5 max-w-md text-xs leading-5 text-slate-500">
                  Try using a broader product name or include the material
                  and purpose of the product.
                </p>

              </div>
            )}

          </div>
        </section>

        {/* ===================================================
            SELECTED CODE
        =================================================== */}
        {selectedCode && (
          <section className="mt-6 rounded-2xl border border-blue-200 bg-blue-50/50 p-5 sm:p-6">

            <div className="flex items-start gap-4">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#173563] text-white">
                <CheckCircle2 size={19} />
              </div>

              <div className="min-w-0 flex-1">

                <p className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
                  Selected HS Code
                </p>

                <div className="mt-1 flex flex-wrap items-center gap-2">

                  <span className="font-mono text-lg font-bold text-[#173563]">
                    {selectedCode.code}
                  </span>

                  <span className="text-xs text-blue-700">
                    {selectedCode.title}
                  </span>

                </div>

                <p className="mt-2 text-xs leading-5 text-blue-700/80">
                  This classification will be used for the next step,
                  where ImportEase will estimate your import-related costs.
                </p>

              </div>

            </div>

          </section>
        )}

        {/* ===================================================
            IMPORTANT NOTICE
        =================================================== */}
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50/60 px-4 py-3.5">

          <ShieldCheck
            size={16}
            className="mt-0.5 shrink-0 text-amber-600"
          />

          <p className="text-[11px] leading-5 text-amber-800">
            HS code suggestions are intended to assist with classification.
            The final classification should be verified against the
            applicable official tariff and customs information before
            completing an import.
          </p>

        </div>

        {/* ===================================================
            ACTIONS
        =================================================== */}
        <div className="mt-7 flex flex-col-reverse items-stretch justify-between gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center">

          <Link
            to="/new-import"
            className="flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 sm:justify-start"
          >
            <ArrowLeft size={16} />
            Back
          </Link>

          <button
            type="button"
            disabled={!selectedCode}
            onClick={handleContinue}
            className={`group flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all ${
              selectedCode
                ? "bg-[#173563] text-white shadow-lg shadow-[#173563]/10 hover:-translate-y-0.5 hover:bg-[#102A50] hover:shadow-xl"
                : "cursor-not-allowed bg-slate-200 text-slate-400"
            }`}
          >
            Continue to Calculator

            <ArrowRight
              size={17}
              className={`transition-transform ${
                selectedCode
                  ? "group-hover:translate-x-0.5"
                  : ""
              }`}
            />
          </button>

        </div>

        {/* ===================================================
            FOOTER INFO
        =================================================== */}
        <div className="mt-6 flex items-center justify-center gap-2 text-center text-[10px] text-slate-400">

          <FileText size={13} />

          <span>
            Your selected classification will be saved to this import.
          </span>

        </div>

      </main>
    </div>
  );
}

export default HSCodeSearch;