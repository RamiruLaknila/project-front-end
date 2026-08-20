import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Filter,
  MapPin,
  MessageSquare,
  Search,
  ShieldCheck,
  Star,
  UserCheck,
  Users,
} from "lucide-react";

function FindAgent() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("All");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState(null);

  /*
  =========================================================
  AGENT DATA
  =========================================================
  Replace these demo agents with your real backend data later.
  */

  const agents = [
    {
      id: "agent-001",
      name: "ABC Customs Solutions",
      initials: "AC",
      location: "Colombo",
      rating: 4.9,
      reviews: 128,
      experience: "8+ years",
      completed: 450,
      price: 25000,
      verified: true,
      responseTime: "Usually responds within 1 hour",
      specialties: ["Commercial Imports", "Electronics"],
    },

    {
      id: "agent-002",
      name: "Lanka Clear Services",
      initials: "LC",
      location: "Colombo",
      rating: 4.8,
      reviews: 96,
      experience: "6+ years",
      completed: 320,
      price: 22000,
      verified: true,
      responseTime: "Usually responds within 2 hours",
      specialties: ["SME Imports", "Machinery"],
    },

    {
      id: "agent-003",
      name: "Global Trade Clearing",
      initials: "GT",
      location: "Negombo",
      rating: 4.7,
      reviews: 84,
      experience: "5+ years",
      completed: 280,
      price: 20000,
      verified: true,
      responseTime: "Usually responds within 2 hours",
      specialties: ["General Imports", "Food Products"],
    },

    {
      id: "agent-004",
      name: "Prime Customs Agency",
      initials: "PC",
      location: "Colombo",
      rating: 4.6,
      reviews: 71,
      experience: "4+ years",
      completed: 210,
      price: 18000,
      verified: false,
      responseTime: "Usually responds within 3 hours",
      specialties: ["SME Imports", "General Cargo"],
    },
  ];

  /*
  =========================================================
  FILTER AGENTS
  =========================================================
  */

  const filteredAgents = useMemo(() => {
    return agents.filter((agent) => {
      const matchesSearch =
        agent.name.toLowerCase().includes(search.toLowerCase()) ||
        agent.location.toLowerCase().includes(search.toLowerCase()) ||
        agent.specialties.some((item) =>
          item.toLowerCase().includes(search.toLowerCase())
        );

      const matchesLocation =
        locationFilter === "All" ||
        agent.location === locationFilter;

      const matchesVerified =
        !verifiedOnly || agent.verified;

      return (
        matchesSearch &&
        matchesLocation &&
        matchesVerified
      );
    });
  }, [search, locationFilter, verifiedOnly]);

  /*
  =========================================================
  SELECT AGENT
  =========================================================
  THIS IS THE IMPORTANT PART.

  We save the complete agent object before going
  to Shipment Confirmation.
  */

  const handleSelectAgent = (agent) => {
    setSelectedAgentId(agent.id);

    localStorage.setItem(
      "selectedAgent",
      JSON.stringify(agent)
    );

    navigate("/shipment-confirmation");
  };

  /*
  =========================================================
  BACK
  =========================================================
  */

  const handleBack = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-900">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">

        <div className="mx-auto flex h-[68px] max-w-[1280px] items-center justify-between px-5 sm:px-8">

          <Link
            to="/dashboard"
            className="flex items-center gap-3"
          >

            <img
              src="/logo.jpeg"
              alt="ImportEase"
              className="h-11 w-11 object-contain mix-blend-multiply"
            />

            <div>

              <div className="text-[18px] font-bold tracking-tight text-[#173563]">
                Import<span className="text-slate-900">Ease</span>
              </div>

              <div className="hidden text-[9px] font-semibold uppercase tracking-[0.13em] text-slate-400 sm:block">
                SME Import Platform
              </div>

            </div>

          </Link>

          <div className="flex items-center gap-3">

            <button
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100"
              aria-label="Notifications"
            >

              <Bell size={17} />

              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blue-600 ring-2 ring-white" />

            </button>

            <div className="hidden h-7 w-px bg-slate-200 sm:block" />

            <div className="flex items-center gap-2.5">

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#173563] text-[10px] font-bold text-white">
                MB
              </div>

              <div className="hidden sm:block">

                <p className="text-xs font-semibold text-slate-800">
                  My Business
                </p>

                <p className="text-[9px] text-slate-400">
                  SME Account
                </p>

              </div>

            </div>

          </div>

        </div>

      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-8 lg:py-10">

        {/* Breadcrumb */}

        <div className="mb-7 flex flex-wrap items-center gap-2 text-xs text-slate-400">

          <Link
            to="/dashboard"
            className="transition hover:text-slate-700"
          >
            Dashboard
          </Link>

          <ChevronRight size={13} />

          <span className="font-medium text-slate-600">
            Find Agent
          </span>

        </div>

        {/* =====================================================
            HEADER
        ===================================================== */}

        <section className="mb-8">

          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5">

            <Users
              size={13}
              className="text-blue-700"
            />

            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
              Agent marketplace
            </span>

          </div>

          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">

            <div>

              <h1 className="text-2xl font-bold tracking-tight text-[#14213D] sm:text-3xl">
                Find a clearing agent
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Compare verified clearing agents and choose the
                right partner for your import.
              </p>

            </div>

            <button
              onClick={handleBack}
              className="flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
            >

              <ArrowLeft size={14} />

              Back to dashboard

            </button>

          </div>

        </section>

        {/* =====================================================
            SEARCH / FILTER
        ===================================================== */}

        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_4px_20px_rgba(15,23,42,0.025)]">

          <div className="flex flex-col gap-3 lg:flex-row">

            {/* Search */}

            <div className="relative flex-1">

              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search agent, location or specialty..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-xs outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />

            </div>

            {/* Location */}

            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3">

              <MapPin
                size={15}
                className="text-slate-400"
              />

              <select
                value={locationFilter}
                onChange={(e) =>
                  setLocationFilter(e.target.value)
                }
                className="bg-transparent py-3 text-xs font-semibold text-slate-600 outline-none"
              >

                <option value="All">
                  All locations
                </option>

                <option value="Colombo">
                  Colombo
                </option>

                <option value="Negombo">
                  Negombo
                </option>

              </select>

            </div>

            {/* Verified */}

            <button
              onClick={() =>
                setVerifiedOnly(!verifiedOnly)
              }
              className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-xs font-bold transition ${
                verifiedOnly
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
              }`}
            >

              <ShieldCheck size={15} />

              Verified only

            </button>

          </div>

        </section>

        {/* =====================================================
            RESULTS HEADER
        ===================================================== */}

        <div className="mb-4 flex items-center justify-between">

          <div className="flex items-center gap-2">

            <Filter
              size={14}
              className="text-slate-400"
            />

            <span className="text-xs font-semibold text-slate-600">
              {filteredAgents.length} agents available
            </span>

          </div>

          <span className="hidden text-[10px] text-slate-400 sm:block">
            Compare experience, ratings and service fees
          </span>

        </div>

        {/* =====================================================
            AGENTS
        ===================================================== */}

        <div className="grid gap-4">

          {filteredAgents.map((agent) => (

            <article
              key={agent.id}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.025)] transition duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_12px_35px_rgba(15,23,42,0.07)]"
            >

              <div className="flex flex-col gap-5 lg:flex-row lg:items-center">

                {/* Agent identity */}

                <div className="flex min-w-0 flex-1 items-start gap-4">

                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#173563] text-sm font-bold text-white shadow-sm">
                    {agent.initials}
                  </div>

                  <div className="min-w-0 flex-1">

                    <div className="flex flex-wrap items-center gap-2">

                      <h2 className="text-sm font-bold text-slate-900">
                        {agent.name}
                      </h2>

                      {agent.verified && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-1.5 py-1 text-[8px] font-bold text-emerald-700">

                          <ShieldCheck size={10} />

                          VERIFIED

                        </span>
                      )}

                    </div>

                    <div className="mt-2 flex flex-wrap gap-3">

                      <span className="flex items-center gap-1 text-[10px] text-slate-400">

                        <MapPin size={11} />

                        {agent.location}

                      </span>

                      <span className="flex items-center gap-1 text-[10px] text-slate-500">

                        <Star
                          size={11}
                          className="fill-amber-400 text-amber-400"
                        />

                        <strong>
                          {agent.rating}
                        </strong>

                      </span>

                      <span className="text-[10px] text-slate-400">
                        {agent.reviews} reviews
                      </span>

                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">

                      {agent.specialties.map((specialty) => (

                        <span
                          key={specialty}
                          className="rounded-md bg-slate-50 px-2 py-1 text-[9px] font-semibold text-slate-500"
                        >
                          {specialty}
                        </span>

                      ))}

                    </div>

                  </div>

                </div>

                {/* Stats */}

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:w-[390px]">

                  <Stat
                    label="Experience"
                    value={agent.experience}
                  />

                  <Stat
                    label="Imports handled"
                    value={`${agent.completed}+`}
                  />

                  <Stat
                    label="Service fee"
                    value={`LKR ${agent.price.toLocaleString()}`}
                  />

                </div>

                {/* Actions */}

                <div className="flex flex-col gap-2 sm:flex-row lg:w-[190px] lg:flex-col">

                  <button
                    onClick={() =>
                      handleSelectAgent(agent)
                    }
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#173563] px-4 py-3 text-xs font-bold text-white shadow-lg shadow-blue-900/10 transition hover:bg-[#102A4D]"
                  >

                    <UserCheck size={14} />

                    Select agent

                    <ArrowRight size={14} />

                  </button>

                  <button
                    onClick={() => {
                      alert(
                        `Messaging ${agent.name} will be available in the next version.`
                      );
                    }}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
                  >

                    <MessageSquare size={14} />

                    Contact

                  </button>

                </div>

              </div>

              <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">

                <Clock3
                  size={12}
                  className="text-slate-400"
                />

                <span className="text-[9px] text-slate-400">
                  {agent.responseTime}
                </span>

              </div>

            </article>

          ))}

        </div>

        {/* =====================================================
            EMPTY STATE
        ===================================================== */}

        {filteredAgents.length === 0 && (

          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">

              <Search
                size={20}
                className="text-slate-400"
              />

            </div>

            <h3 className="mt-4 text-sm font-bold text-slate-700">
              No agents found
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Try changing your search or filters.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setLocationFilter("All");
                setVerifiedOnly(false);
              }}
              className="mt-4 rounded-lg bg-[#173563] px-4 py-2 text-xs font-bold text-white"
            >
              Clear filters
            </button>

          </div>

        )}

        {/* =====================================================
            TRUST FOOTER
        ===================================================== */}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-[9px] text-slate-400">

          <span className="flex items-center gap-1.5">
            <ShieldCheck
              size={13}
              className="text-emerald-600"
            />
            Verified agents
          </span>

          <span className="flex items-center gap-1.5">
            <CheckCircle2
              size={13}
              className="text-emerald-600"
            />
            Transparent pricing
          </span>

          <span className="flex items-center gap-1.5">
            <Users
              size={13}
              className="text-blue-600"
            />
            SME focused
          </span>

        </div>

      </main>

    </div>
  );
}

/* =========================================================
   STAT COMPONENT
========================================================= */

function Stat({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">

      <p className="text-[9px] text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-xs font-bold text-slate-700">
        {value}
      </p>

    </div>
  );
}

export default FindAgent;