import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  MapPin,
  MessageSquare,
  Package,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";

function FindAgent() {
  const navigate = useNavigate();

  const [importData, setImportData] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [published, setPublished] = useState(false);

  useEffect(() => {
    const savedImport = localStorage.getItem("currentImport");

    if (savedImport) {
      try {
        setImportData(JSON.parse(savedImport));
      } catch (error) {
        console.error("Unable to load import:", error);
      }
    }
  }, []);

  const agents = [
    {
      id: 1,
      name: "Prime Customs Solutions",
      initials: "PC",
      location: "Colombo",
      rating: 4.9,
      reviews: 128,
      experience: "8+ years",
      response: "< 1 hour",
      price: 185,
      verified: true,
      specialty: "General Import Clearance",
      description:
        "Experienced clearing team specializing in SME commercial imports and customs documentation.",
    },
    {
      id: 2,
      name: "LankaClear Logistics",
      initials: "LL",
      location: "Colombo",
      rating: 4.8,
      reviews: 96,
      experience: "6+ years",
      response: "< 2 hours",
      price: 210,
      verified: true,
      specialty: "Commercial Imports",
      description:
        "Full-service customs clearance support with shipment tracking and documentation assistance.",
    },
    {
      id: 3,
      name: "Express Customs Lanka",
      initials: "EC",
      location: "Negombo",
      rating: 4.7,
      reviews: 74,
      experience: "5+ years",
      response: "< 3 hours",
      price: 165,
      verified: true,
      specialty: "Fast Clearance",
      description:
        "Focused on fast and reliable clearance services for small and medium-sized businesses.",
    },
  ];

  const formatMoney = (value) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value || 0);
  };

  const productName =
    importData?.productName || "Your imported product";

  const hsCode = importData?.hsCode || "Not selected";

  const total =
    importData?.calculation?.estimatedTotal || 0;

  const handlePublish = () => {
    setPublished(true);

    const updatedImport = {
      ...(importData || {}),
      status: "Agent Search",
      agentRequestPublished: true,
    };

    localStorage.setItem(
      "currentImport",
      JSON.stringify(updatedImport)
    );
  };

  const handleSelectAgent = (agent) => {
    setSelectedAgent(agent);

    const updatedImport = {
      ...(importData || {}),
      selectedAgent: agent,
      status: "Agent Selected",
    };

    localStorage.setItem(
      "currentImport",
      JSON.stringify(updatedImport)
    );
  };

  const handleContinue = () => {
    if (!selectedAgent) return;

    navigate("/shipment-confirmation");
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
            to="/calculator"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          >
            <ArrowLeft size={16} />

            <span className="hidden sm:inline">
              Back to Calculator
            </span>
          </Link>

        </div>
      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}
      <main className="mx-auto max-w-[1120px] px-5 py-8 sm:px-7 lg:py-12">

        {/* ===================================================
            BREADCRUMB
        =================================================== */}
        <div className="mb-4 flex items-center gap-2 text-xs font-medium text-slate-400">

          <Link
            to="/dashboard"
            className="hover:text-slate-700"
          >
            Dashboard
          </Link>

          <ChevronRight size={13} />

          <span>Import Calculator</span>

          <ChevronRight size={13} />

          <span className="text-slate-600">
            Find Clearing Agent
          </span>

        </div>

        {/* ===================================================
            TITLE
        =================================================== */}
        <section className="mb-7">

          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5">

            <Users
              size={13}
              className="text-emerald-600"
            />

            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
              Agent marketplace
            </span>

          </div>

          <h1 className="text-2xl font-bold tracking-tight text-[#14213D] sm:text-3xl">
            Find a clearing agent
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Compare verified clearing agents, review their experience,
            and choose the right partner for your import.
          </p>

        </section>

        {/* ===================================================
            PROGRESS
        =================================================== */}
        <div className="mb-7 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">

          <div className="flex items-center">

            <Step
              number="1"
              label="Import details"
              complete
            />

            <ProgressLine complete />

            <Step
              number="2"
              label="HS Code"
              complete
            />

            <ProgressLine complete />

            <Step
              number="3"
              label="Costs"
              complete
            />

            <ProgressLine />

            <Step
              number="4"
              label="Agent"
              active
            />

          </div>

        </div>

        {/* ===================================================
            IMPORT SUMMARY
        =================================================== */}
        <section className="mb-7 rounded-2xl border border-slate-200 bg-white">

          <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <Package size={21} />
              </div>

              <div>

                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Import request
                </p>

                <h2 className="mt-1 text-sm font-bold text-slate-800">
                  {productName}
                </h2>

                <div className="mt-2 flex flex-wrap items-center gap-2">

                  <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-[10px] font-semibold text-slate-600">
                    HS {hsCode}
                  </span>

                  {importData?.quantity && (
                    <span className="text-[10px] text-slate-400">
                      {importData.quantity}{" "}
                      {importData.unit || "units"}
                    </span>
                  )}

                </div>

              </div>

            </div>

            <div className="border-t border-slate-100 pt-4 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">

              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Estimated import cost
              </p>

              <p className="mt-1 text-xl font-bold text-[#173563]">
                ${formatMoney(total)}
              </p>

            </div>

          </div>

        </section>

        {/* ===================================================
            PUBLISH REQUEST
        =================================================== */}
        {!published && (
          <section className="mb-8 overflow-hidden rounded-2xl border border-blue-100 bg-white">

            <div className="relative p-6 sm:p-7">

              <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-blue-50 blur-3xl" />

              <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                <div className="max-w-2xl">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                      <MessageSquare size={18} />
                    </div>

                    <div>
                      <h2 className="text-sm font-bold text-slate-900">
                        Get offers from clearing agents
                      </h2>

                      <p className="mt-1 text-xs text-slate-500">
                        Share your import request with verified agents.
                      </p>
                    </div>

                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">

                    <MiniBenefit
                      icon={<ShieldCheck size={15} />}
                      text="Verified agents"
                    />

                    <MiniBenefit
                      icon={<Users size={15} />}
                      text="Compare offers"
                    />

                    <MiniBenefit
                      icon={<Clock3 size={15} />}
                      text="Save time"
                    />

                  </div>

                </div>

                <button
                  onClick={handlePublish}
                  className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#173563] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#173563]/10 transition hover:-translate-y-0.5 hover:bg-[#102A50]"
                >
                  Find clearing agents

                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </button>

              </div>

            </div>

          </section>
        )}

        {/* ===================================================
            PUBLISHED MESSAGE
        =================================================== */}
        {published && (
          <section className="mb-7 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5">

            <div className="flex items-start gap-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 size={18} />
              </div>

              <div>

                <h2 className="text-sm font-bold text-emerald-900">
                  Your request is now visible to clearing agents
                </h2>

                <p className="mt-1 text-xs leading-5 text-emerald-700">
                  We found suitable agents based on your shipment
                  details. Review their profiles and choose the best offer.
                </p>

              </div>

            </div>

          </section>
        )}

        {/* ===================================================
            AGENT RESULTS
        =================================================== */}
        {published && (
          <section>

            <div className="mb-5 flex items-end justify-between">

              <div>
                <h2 className="text-lg font-bold text-[#14213D]">
                  Recommended clearing agents
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {agents.length} verified agents available for your request
                </p>
              </div>

              <span className="hidden rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-semibold text-slate-500 sm:block">
                Best matches first
              </span>

            </div>

            <div className="space-y-4">

              {agents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  selected={selectedAgent?.id === agent.id}
                  onSelect={() => handleSelectAgent(agent)}
                />
              ))}

            </div>

          </section>
        )}

        {/* ===================================================
            CONTINUE
        =================================================== */}
        {published && (
          <div className="mt-7 flex flex-col-reverse items-stretch justify-between gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center">

            <Link
              to="/calculator"
              className="flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            >
              <ArrowLeft size={16} />
              Back to calculator
            </Link>

            <button
              onClick={handleContinue}
              disabled={!selectedAgent}
              className={`group flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all ${
                selectedAgent
                  ? "bg-[#173563] text-white shadow-lg shadow-[#173563]/10 hover:-translate-y-0.5 hover:bg-[#102A50]"
                  : "cursor-not-allowed bg-slate-200 text-slate-400"
              }`}
            >
              Continue with selected agent

              <ArrowRight
                size={17}
                className={
                  selectedAgent
                    ? "transition-transform group-hover:translate-x-0.5"
                    : ""
                }
              />
            </button>

          </div>
        )}

        {/* ===================================================
            FOOTER NOTE
        =================================================== */}
        <div className="mt-7 flex justify-center">

          <div className="flex items-center gap-2 text-[10px] text-slate-400">

            <ShieldCheck size={12} />

            <span>
              Agent information is provided for comparison purposes.
            </span>

          </div>

        </div>

      </main>
    </div>
  );
}

/* =========================================================
   PROGRESS COMPONENTS
========================================================= */

function Step({
  number,
  label,
  active = false,
  complete = false,
}) {
  return (
    <div className="flex shrink-0 items-center gap-2">

      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
          complete
            ? "bg-emerald-500 text-white"
            : active
              ? "bg-[#173563] text-white"
              : "bg-slate-100 text-slate-400"
        }`}
      >
        {complete ? (
          <CheckCircle2 size={15} />
        ) : (
          number
        )}
      </div>

      <span
        className={`hidden text-xs sm:block ${
          active
            ? "font-semibold text-[#173563]"
            : complete
              ? "font-semibold text-emerald-700"
              : "text-slate-400"
        }`}
      >
        {label}
      </span>

    </div>
  );
}

function ProgressLine({ complete = false }) {
  return (
    <div
      className={`mx-2 h-px flex-1 ${
        complete
          ? "bg-emerald-200"
          : "bg-slate-200"
      }`}
    />
  );
}

/* =========================================================
   MINI BENEFIT
========================================================= */

function MiniBenefit({ icon, text }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">

      <span className="text-blue-600">
        {icon}
      </span>

      <span className="text-[10px] font-semibold text-slate-600">
        {text}
      </span>

    </div>
  );
}

/* =========================================================
   AGENT CARD
========================================================= */

function AgentCard({
  agent,
  selected,
  onSelect,
}) {
  return (
    <article
      className={`rounded-2xl border bg-white p-5 transition-all sm:p-6 ${
        selected
          ? "border-[#173563] shadow-[0_10px_35px_rgba(23,53,99,0.10)]"
          : "border-slate-200 shadow-[0_4px_20px_rgba(15,23,42,0.03)] hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
      }`}
    >

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center">

        {/* PROFILE */}
        <div className="flex min-w-0 flex-1 items-start gap-4">

          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#173563] text-xs font-bold text-white">
            {agent.initials}

            {agent.verified && (
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white">
                <BadgeCheck
                  size={15}
                  className="fill-emerald-500 text-white"
                />
              </span>
            )}
          </div>

          <div className="min-w-0">

            <div className="flex flex-wrap items-center gap-2">

              <h3 className="truncate text-sm font-bold text-slate-900">
                {agent.name}
              </h3>

              {agent.verified && (
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                  VERIFIED
                </span>
              )}

            </div>

            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-400">

              <span className="flex items-center gap-1">
                <MapPin size={11} />
                {agent.location}
              </span>

              <span>
                {agent.experience}
              </span>

            </div>

            <p className="mt-2 max-w-xl text-xs leading-5 text-slate-500">
              {agent.description}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2">

              <span className="flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700">
                <Star
                  size={11}
                  className="fill-current"
                />
                {agent.rating}
              </span>

              <span className="text-[10px] text-slate-400">
                {agent.reviews} reviews
              </span>

              <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-500">
                {agent.specialty}
              </span>

            </div>

          </div>

        </div>

        {/* OFFER */}
        <div className="border-t border-slate-100 pt-4 lg:w-[210px] lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">

          <div className="flex items-center justify-between lg:block">

            <div>

              <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                Estimated service fee
              </p>

              <p className="mt-1 text-xl font-bold text-[#173563]">
                ${agent.price.toFixed(2)}
              </p>

            </div>

            <div className="text-right lg:mt-2 lg:text-left">

              <p className="text-[9px] text-slate-400">
                Typical response
              </p>

              <p className="mt-0.5 text-[10px] font-semibold text-slate-600">
                {agent.response}
              </p>

            </div>

          </div>

          <button
            onClick={onSelect}
            className={`mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-xl text-xs font-semibold transition ${
              selected
                ? "bg-emerald-500 text-white"
                : "border border-slate-200 bg-white text-slate-700 hover:border-[#173563] hover:text-[#173563]"
            }`}
          >
            {selected ? (
              <>
                <CheckCircle2 size={15} />
                Agent selected
              </>
            ) : (
              <>
                Select agent
                <ArrowRight size={14} />
              </>
            )}
          </button>

        </div>

      </div>

    </article>
  );
}

export default FindAgent;