import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  ArrowLeft,
  PackageSearch,
  Sparkles,
  Clock3,
  ChevronRight,
  X,
  History,
  ShieldCheck,
  Info,
  Copy,
  Check,
  ArrowUpRight,
} from "lucide-react";

function HSCodeSearch() {
  const [search, setSearch] = useState("");
  const [searched, setSearched] = useState(false);
  const [copied, setCopied] = useState(false);

  const recentSearches = [
    "Laptop computers",
    "Solar panels",
    "Cotton fabric",
    "Mobile phones",
  ];

  const results = [
    {
      code: "8471.30.00",
      title: "Portable automatic data processing machines",
      description:
        "Portable computers, including laptops and notebook computers.",
      duty: "0%",
      vat: "18%",
      confidence: "High match",
    },
  ];

  const handleSearch = () => {
    if (!search.trim()) return;
    setSearched(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText("8471.30.00");
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1800);
  };

  const clearSearch = () => {
    setSearch("");
    setSearched(false);
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-slate-900">

      {/* =====================================================
          TOP NAVIGATION
      ===================================================== */}

      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">

        <div className="mx-auto flex h-[72px] max-w-[1500px] items-center justify-between px-4 sm:px-6 lg:px-8">

          <div className="flex items-center gap-4">

            <Link
              to="/dashboard"
              className="group flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-all duration-200 hover:-translate-x-0.5 hover:border-slate-300 hover:text-[#173563]"
            >
              <ArrowLeft
                size={17}
                className="transition-transform duration-200 group-hover:-translate-x-0.5"
              />
            </Link>

            <div className="h-6 w-px bg-slate-200" />

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                ImportEase
              </p>

              <h1 className="text-sm font-bold text-slate-900">
                HS Code Search
              </h1>
            </div>

          </div>

          <div className="hidden items-center gap-2 sm:flex">

            <div className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />

              <span className="text-[10px] font-semibold text-emerald-700">
                Customs data available
              </span>
            </div>

          </div>

        </div>

      </header>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mx-auto max-w-[1180px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">

        {/* ===================================================
            HERO
        =================================================== */}

        <section className="hs-fade-up text-center">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#173563] text-white shadow-lg shadow-[#173563]/20">

            <PackageSearch size={22} />

          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#173563]">
            Import Classification
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Find the HS Code
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
            Search for your product and discover the most relevant
            Harmonized System code, import duty and tax information.
          </p>

        </section>


        {/* ===================================================
            SEARCH CARD
        =================================================== */}

        <section
          className="hs-fade-up mx-auto mt-8 max-w-3xl"
          style={{ animationDelay: "100ms" }}
        >

          <div className="rounded-3xl border border-slate-200 bg-white p-2 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.25)] transition-all duration-300 focus-within:border-[#173563]/30 focus-within:shadow-[0_25px_70px_-30px_rgba(23,53,99,0.25)]">

            <div className="flex items-center gap-2">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F0F4F9] text-[#173563]">

                <Search size={20} />

              </div>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                placeholder="Search a product, e.g. laptop computers"
                className="h-12 min-w-0 flex-1 bg-transparent px-2 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
              />

              {search && (
                <button
                  onClick={clearSearch}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={16} />
                </button>
              )}

              <button
                onClick={handleSearch}
                disabled={!search.trim()}
                className="flex h-12 shrink-0 items-center gap-2 rounded-2xl bg-[#173563] px-5 text-xs font-bold text-white shadow-lg shadow-[#173563]/15"              >
                Search

                <ArrowUpRight
                  size={15}
                  className="transition-transform duration-200 group-hover:translate-x-0.5 translatey-0.5"
                />
              </button>

            </div>

          </div>

          <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-2 text-[10px] text-slate-400">

            <span>Try:</span>

            {recentSearches.slice(0, 3).map((item) => (
              <button
                key={item}
                onClick={() => {
                  setSearch(item);
                  setSearched(true);
                }}
                className="font-medium text-slate-500 transition hover:text-[#173563]"
              >
                {item}
              </button>
            ))}

          </div>

        </section>


        {/* ===================================================
            RESULTS
        =================================================== */}

        {searched ? (

          <section
            className="hs-fade-up mx-auto mt-10 max-w-5xl"
            style={{ animationDelay: "150ms" }}
          >

            {/* Result header */}

            <div className="mb-4 flex items-end justify-between">

              <div>

                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Search results
                </p>

                <h3 className="mt-1 text-lg font-bold text-slate-900">
                  Matching HS classifications
                </h3>

              </div>

              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-semibold text-slate-500">
                1 result found
              </span>

            </div>


            {/* Main result */}

            {results.map((result) => (

              <div
                key={result.code}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_20px_50px_-25px_rgba(15,23,42,0.3)]"
              >

                <div className="p-5 sm:p-7">

                  <div className="flex flex-col justify-between gap-6 sm:flex-row">

                    <div className="flex gap-4">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EEF3F9] text-[#173563] transition-transform duration-300 group-hover:scale-105">
                        <PackageSearch size={21} />
                      </div>

                      <div>

                        <div className="flex flex-wrap items-center gap-2">

                          <span className="font-mono text-xl font-bold tracking-tight text-[#173563]">
                            {result.code}
                          </span>

                          <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-600">
                            <Check size={11} />
                            {result.confidence}
                          </span>

                        </div>

                        <h4 className="mt-2 max-w-2xl text-sm font-bold leading-6 text-slate-900">
                          {result.title}
                        </h4>

                        <p className="mt-1.5 max-w-2xl text-xs leading-5 text-slate-500">
                          {result.description}
                        </p>

                      </div>

                    </div>

                    <button
                      onClick={handleCopy}
                      className="flex h-9 shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 text-[10px] font-semibold text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800"
                    >
                      {copied ? (
                        <>
                          <Check size={13} />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          Copy code
                        </>
                      )}
                    </button>

                  </div>


                  {/* Data cards */}

                  <div className="mt-7 grid gap-3 sm:grid-cols-3">

                    <InfoCard
                      label="HS Code"
                      value={result.code}
                    />

                    <InfoCard
                      label="Import Duty"
                      value={result.duty}
                    />

                    <InfoCard
                      label="VAT"
                      value={result.vat}
                    />

                  </div>

                </div>


                {/* Footer */}

                <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">

                  <div className="flex items-center gap-2 text-[10px] text-slate-500">

                    <ShieldCheck
                      size={14}
                      className="text-emerald-500"
                    />

                    Classification based on available customs information

                  </div>

                  <button className="flex items-center gap-1 text-[10px] font-bold text-[#173563] transition hover:gap-2">
                    View classification details
                    <ChevronRight size={13} />
                  </button>

                </div>

              </div>

            ))}

          </section>

        ) : (

          /* ===================================================
             EMPTY / INITIAL STATE
          =================================================== */

          <section
            className="hs-fade-up mx-auto mt-12 max-w-5xl"
            style={{ animationDelay: "200ms" }}
          >

            <div className="grid gap-4 md:grid-cols-3">

              <FeatureCard
                icon={<Sparkles size={18} />}
                title="Smart classification"
                description="Search using simple product names instead of complicated tariff terminology."
              />

              <FeatureCard
                icon={<ShieldCheck size={18} />}
                title="Reliable information"
                description="Designed to present customs and tariff information in a clear format."
              />

              <FeatureCard
                icon={<Clock3 size={18} />}
                title="Save time"
                description="Quickly narrow down possible classifications before starting your import."
              />

            </div>


            {/* Recent searches */}

            <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

              <div className="flex items-center gap-2">

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                  <History size={15} />
                </div>

                <div>

                  <h3 className="text-xs font-bold text-slate-800">
                    Recent searches
                  </h3>

                  <p className="text-[10px] text-slate-400">
                    Quickly search something you looked up before
                  </p>

                </div>

              </div>


              <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">

                {recentSearches.map((item, index) => (

                  <button
                    key={item}
                    onClick={() => {
                      setSearch(item);
                      setSearched(true);
                    }}
                    className="group flex items-center justify-between rounded-xl border border-slate-100 px-3 py-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-200 hover:bg-slate-50"
                  >

                    <div className="flex items-center gap-2">

                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-[9px] font-bold text-slate-400">
                        0{index + 1}
                      </span>

                      <span className="text-[11px] font-medium text-slate-600">
                        {item}
                      </span>

                    </div>

                    <ChevronRight
                      size={13}
                      className="text-slate-300 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[#173563]"
                    />

                  </button>

                ))}

              </div>

            </div>

          </section>

        )}


        {/* ===================================================
            INFORMATION
        =================================================== */}

        <section className="mx-auto mt-8 max-w-5xl">

          <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/50 p-4">

            <Info
              size={16}
              className="mt-0.5 shrink-0 text-[#173563]"
            />

            <p className="text-[10px] leading-5 text-slate-500">
              HS codes can depend on the exact specifications, material,
              intended use and other characteristics of a product.
              Always verify the final classification with the relevant
              customs authority or your clearing agent before importing.
            </p>

          </div>

        </section>


        {/* ===================================================
            FOOTER
        =================================================== */}

        <footer className="mx-auto mt-12 max-w-5xl border-t border-slate-200 pt-5 text-center text-[10px] text-slate-400">

          ImportEase · Import classification made simpler

        </footer>

      </main>


      {/* =====================================================
          ANIMATION CSS
      ===================================================== */}

      <style>{`

        @keyframes hsFadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hs-fade-up {
          animation: hsFadeUp 0.65s cubic-bezier(.22,1,.36,1) both;
        }

        @media (prefers-reduced-motion: reduce) {
          .hs-fade-up {
            animation: none;
          }
        }

      `}</style>

    </div>
  );
}


/* =============================================================
   FEATURE CARD
============================================================= */

function FeatureCard({
  icon,
  title,
  description,
}) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md">

      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EEF3F9] text-[#173563] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
        {icon}
      </div>

      <h3 className="mt-4 text-xs font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-1.5 text-[10px] leading-5 text-slate-400">
        {description}
      </p>

    </div>
  );
}


/* =============================================================
   INFO CARD
============================================================= */

function InfoCard({
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition-all duration-200 hover:border-slate-200 hover:bg-slate-50">

      <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1.5 font-mono text-sm font-bold text-slate-800">
        {value}
      </p>

    </div>
  );
}


export default HSCodeSearch;