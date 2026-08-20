import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  Bell,
  Calculator,
  Check,
  CheckCircle2,
  ChevronRight,
  FileText,
  Package,
  PackagePlus,
  Search,
  Ship,
  Truck,
  Users,
  RefreshCw,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

function Dashboard() {
  const location = useLocation();

  const [shipments, setShipments] = useState([]);

  /*
  =========================================================
  LOAD SHIPMENTS FROM LOCAL STORAGE
  =========================================================
  */

  const loadShipments = () => {
    try {
      const stored = localStorage.getItem("shipments");

      if (!stored) {
        setShipments([]);
        return;
      }

      const parsed = JSON.parse(stored);

      if (Array.isArray(parsed)) {
        setShipments(parsed);
      } else {
        setShipments([]);
      }
    } catch (error) {
      console.error(
        "Failed to load shipments:",
        error
      );

      setShipments([]);
    }
  };

  /*
  =========================================================
  LOAD WHEN DASHBOARD OPENS
  =========================================================
  */

  useEffect(() => {
    loadShipments();
  }, [location.key]);

  /*
  =========================================================
  ALSO LISTEN FOR STORAGE CHANGES
  =========================================================
  */

  useEffect(() => {
    const handleStorageChange = () => {
      loadShipments();
    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );
    };
  }, []);

  /*
  =========================================================
  CALCULATED DASHBOARD DATA
  =========================================================
  */

  const activeShipments = useMemo(() => {
    return shipments.filter((shipment) => {
      const status = shipment?.status;

      return (
        status !== "Completed" &&
        status !== "Cancelled"
      );
    });
  }, [shipments]);

  const connectedAgents = useMemo(() => {
    const names = shipments
      .map((shipment) => shipment?.agent?.name)
      .filter(Boolean);

    return new Set(names).size;
  }, [shipments]);

  /*
  =========================================================
  KPI STATS
  =========================================================
  */

  const stats = [
    {
      label: "Active Imports",
      value: activeShipments.length.toString(),
      description: "Currently in progress",
      icon: Package,
      color: "blue",
    },
    {
      label: "Pending Documents",
      value: "0",
      description: "Documents requiring action",
      icon: FileText,
      color: "amber",
    },
    {
      label: "Shipments",
      value: shipments.length.toString(),
      description: "Total shipments",
      icon: Ship,
      color: "violet",
    },
    {
      label: "Agents Connected",
      value: connectedAgents.toString(),
      description: "Clearing agents",
      icon: Users,
      color: "emerald",
    },
  ];

  /*
  =========================================================
  WORKFLOW
  =========================================================
  */

  const workflow = [
    {
      number: "01",
      title: "Product",
      description: "Tell us what you're importing",
      icon: Package,
      color: "blue",
    },
    {
      number: "02",
      title: "HS Code",
      description: "Identify the correct classification",
      icon: Search,
      color: "indigo",
    },
    {
      number: "03",
      title: "Costs",
      description: "Estimate duties and taxes",
      icon: Calculator,
      color: "amber",
    },
    {
      number: "04",
      title: "Agent",
      description: "Find a suitable clearing agent",
      icon: Users,
      color: "emerald",
    },
    {
      number: "05",
      title: "Shipment",
      description: "Track your import progress",
      icon: Truck,
      color: "violet",
    },
  ];

  /*
  =========================================================
  QUICK TOOLS
  =========================================================
  */

  const quickTools = [
    {
      title: "HS Code Search",
      description: "Identify product codes",
      icon: Search,
      to: "/hs-code-search",
      color: "blue",
    },
    {
      title: "Import Calculator",
      description: "Estimate total costs",
      icon: Calculator,
      to: "/calculator",
      color: "amber",
    },
    {
      title: "Find an Agent",
      description: "Compare clearing agents",
      icon: Users,
      to: "/find-agent",
      color: "emerald",
    },
    {
      title: "Track Shipments",
      description: "Monitor shipment status",
      icon: Truck,
      to: "/track-shipment",
      color: "violet",
    },
  ];

  /*
  =========================================================
  COLORS
  =========================================================
  */

  const colorStyles = {
    blue: {
      icon: "bg-blue-50 text-blue-700",
      hover: "group-hover:bg-blue-100",
      border: "hover:border-blue-200",
      arrow: "group-hover:text-blue-600",
    },

    indigo: {
      icon: "bg-indigo-50 text-indigo-700",
      hover: "group-hover:bg-indigo-100",
      border: "hover:border-indigo-200",
      arrow: "group-hover:text-indigo-600",
    },

    amber: {
      icon: "bg-amber-50 text-amber-700",
      hover: "group-hover:bg-amber-100",
      border: "hover:border-amber-200",
      arrow: "group-hover:text-amber-600",
    },

    emerald: {
      icon: "bg-emerald-50 text-emerald-700",
      hover: "group-hover:bg-emerald-100",
      border: "hover:border-emerald-200",
      arrow: "group-hover:text-emerald-600",
    },

    violet: {
      icon: "bg-violet-50 text-violet-700",
      hover: "group-hover:bg-violet-100",
      border: "hover:border-violet-200",
      arrow: "group-hover:text-violet-600",
    },
  };

  /*
  =========================================================
  FORMAT DATE
  =========================================================
  */

  const formatDate = (date) => {
    if (!date) {
      return "Recently created";
    }

    try {
      return new Date(date).toLocaleDateString(
        "en-LK",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return "Recently created";
    }
  };

  /*
  =========================================================
  STATUS STYLE
  =========================================================
  */

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-50 text-emerald-700";

      case "Cancelled":
        return "bg-red-50 text-red-700";

      case "Agent Requested":
        return "bg-blue-50 text-blue-700";

      case "In Progress":
        return "bg-amber-50 text-amber-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB] font-[Inter,sans-serif] text-slate-900">

      {/* =====================================================
          GLOBAL STYLES
      ===================================================== */}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

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

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-5px);
          }
        }

        .fade-up {
          animation: fadeUp 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .delay-1 {
          animation-delay: 0.05s;
        }

        .delay-2 {
          animation-delay: 0.1s;
        }

        .delay-3 {
          animation-delay: 0.15s;
        }

        .delay-4 {
          animation-delay: 0.2s;
        }

        .delay-5 {
          animation-delay: 0.25s;
        }

        .float {
          animation: float 4s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .fade-up,
          .float {
            animation: none;
          }
        }
      `}</style>

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">

        <div className="mx-auto flex h-[68px] max-w-[1180px] items-center justify-between px-5 sm:px-7">

          <Link
            to="/dashboard"
            className="group flex items-center gap-3"
          >

            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white">

              <img
                src="/logo.jpeg"
                alt="ImportEase logo"
                className="h-full w-full object-contain"
              />

            </div>

            <div>

              <p className="text-[17px] font-bold tracking-[-0.035em] text-[#173B6C]">
                Import<span className="text-[#173563]">
                  Ease
                </span>
              </p>

              <p className="hidden text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-400 sm:block">
                SME Import Platform
              </p>

            </div>

          </Link>

          <div className="flex items-center gap-2 sm:gap-4">

            <button
              type="button"
              aria-label="Notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-all duration-200 hover:bg-slate-100 hover:text-slate-800"
            >

              <Bell
                size={18}
                strokeWidth={1.8}
              />

              <span className="absolute right-[7px] top-[6px] h-1.5 w-1.5 rounded-full bg-[#2563EB] ring-2 ring-white" />

            </button>

            <div className="hidden h-7 w-px bg-slate-200 sm:block" />

            <button
              type="button"
              className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-all duration-200 hover:bg-slate-50"
            >

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#173B6C] text-[10px] font-bold text-white">
                MB
              </div>

              <div className="hidden text-left sm:block">

                <p className="text-[12px] font-semibold text-slate-800">
                  My Business
                </p>

                <p className="text-[10px] text-slate-400">
                  SME Account
                </p>

              </div>

              <ChevronRight
                size={14}
                className="hidden rotate-90 text-slate-400 sm:block"
              />

            </button>

          </div>

        </div>

      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mx-auto w-full max-w-[1180px] px-5 py-8 sm:px-7 lg:py-10">

        {/* =====================================================
            PAGE HEADER
        ===================================================== */}

        <section className="fade-up mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">

          <div>

            <div className="mb-2 flex items-center gap-2">

              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-600">
                Business overview
              </span>

            </div>

            <h1 className="text-[28px] font-bold tracking-[-0.04em] text-[#14213D] sm:text-[32px]">
              Welcome back, My Business
            </h1>

            <p className="mt-2 max-w-xl text-[13px] leading-6 text-slate-500 sm:text-sm">
              Manage your imports, calculate costs, find clearing
              agents, and monitor shipments from one place.
            </p>

          </div>

          <div className="flex gap-2">

            <button
              onClick={loadShipments}
              title="Refresh shipments"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
            >

              <RefreshCw size={16} />

            </button>

            <Link
              to="/new-import"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#173B6C] px-5 py-3 text-[13px] font-semibold text-white shadow-[0_6px_18px_rgba(23,59,108,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#12315B] hover:shadow-[0_10px_24px_rgba(23,59,108,0.22)] md:w-auto"
            >

              <PackagePlus
                size={16}
                className="transition-transform duration-300 group-hover:scale-110"
              />

              Start New Import

              <ArrowUpRight
                size={14}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />

            </Link>

          </div>

        </section>

        {/* =====================================================
            KPI STATS
        ===================================================== */}

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">

          {stats.map((stat, index) => {

            const Icon = stat.icon;
            const colors = colorStyles[stat.color];

            return (
              <div
                key={stat.label}
                className={`fade-up delay-${index + 1} group rounded-xl border border-slate-200 bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.025)] transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_10px_24px_rgba(15,23,42,0.06)] sm:p-5`}
              >

                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${colors.icon} transition-all duration-300 ${colors.hover} group-hover:scale-105`}
                >

                  <Icon
                    size={17}
                    strokeWidth={1.8}
                  />

                </div>

                <div className="mt-4">

                  <p className="text-[25px] font-bold tracking-[-0.04em] text-[#14213D]">
                    {stat.value}
                  </p>

                  <p className="mt-1 text-[13px] font-semibold text-slate-700">
                    {stat.label}
                  </p>

                  <p className="mt-1 text-[11px] leading-4 text-slate-400">
                    {stat.description}
                  </p>

                </div>

              </div>
            );
          })}

        </section>

        {/* =====================================================
            ACTIVE IMPORTS
        ===================================================== */}

        <section className="mt-7 grid gap-5 lg:grid-cols-[1.55fr_1fr]">

          <div className="fade-up delay-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_14px_rgba(15,23,42,0.025)]">

            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

              <div>

                <h2 className="text-[14px] font-semibold text-[#14213D]">
                  Active imports
                </h2>

                <p className="mt-1 text-[11px] text-slate-400">
                  Your current import activity
                </p>

              </div>

              <Link
                to="/track-shipment"
                className="group flex items-center gap-1 text-[11px] font-semibold text-[#2563EB] transition-colors hover:text-blue-700"
              >

                View shipments

                <ChevronRight
                  size={13}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />

              </Link>

            </div>

            {/* =================================================
                IF THERE ARE SHIPMENTS
            ================================================= */}

            {shipments.length > 0 ? (

              <div className="divide-y divide-slate-100">

                {shipments.slice(0, 5).map((shipment) => {

                  const product =
                    shipment?.importData?.productName ||
                    shipment?.importData?.product ||
                    "Import shipment";

                  const hsCode =
                    shipment?.importData?.hsCode ||
                    "Not specified";

                  const agent =
                    shipment?.agent?.name ||
                    "Agent not specified";

                  const status =
                    shipment?.status ||
                    "Pending";

                  return (
                    <div
                      key={shipment.id}
                      className="group p-5 transition hover:bg-slate-50/70"
                    >

                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div className="flex min-w-0 items-start gap-3">

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">

                            <Package size={18} />

                          </div>

                          <div className="min-w-0">

                            <div className="flex flex-wrap items-center gap-2">

                              <h3 className="truncate text-[13px] font-bold text-slate-800">
                                {product}
                              </h3>

                              <span
                                className={`rounded-full px-2 py-1 text-[8px] font-bold ${getStatusStyle(
                                  status
                                )}`}
                              >
                                {status}
                              </span>

                            </div>

                            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">

                              <span className="text-[10px] text-slate-400">
                                ID:{" "}
                                <strong className="text-slate-500">
                                  {shipment.id}
                                </strong>
                              </span>

                              <span className="text-[10px] text-slate-400">
                                HS:{" "}
                                <strong className="text-slate-500">
                                  {hsCode}
                                </strong>
                              </span>

                              <span className="text-[10px] text-slate-400">
                                {formatDate(
                                  shipment.createdAt
                                )}
                              </span>

                            </div>

                            <p className="mt-1.5 text-[10px] text-slate-400">
                              Agent:{" "}
                              <span className="font-semibold text-slate-500">
                                {agent}
                              </span>
                            </p>

                          </div>

                        </div>

                        <Link
                          to="/track-shipment"
                          className="flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] font-bold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                        >

                          Track

                          <ArrowUpRight size={12} />

                        </Link>

                      </div>

                    </div>
                  );
                })}

              </div>

            ) : (

              /* =================================================
                  EMPTY STATE
              ================================================= */

              <div className="relative flex min-h-[285px] items-center justify-center px-6 py-10">

                <div className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-50 blur-3xl" />

                <div className="relative max-w-md text-center">

                  <div className="float mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-[#2563EB] shadow-sm">

                    <Ship
                      size={25}
                      strokeWidth={1.6}
                    />

                  </div>

                  <h3 className="text-[15px] font-semibold text-slate-800">
                    No active imports yet
                  </h3>

                  <p className="mx-auto mt-2 max-w-sm text-[12px] leading-5 text-slate-500">
                    Your active shipments and clearance progress
                    will appear here once you create an import.
                  </p>

                  <Link
                    to="/new-import"
                    className="group mt-5 inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2.5 text-[12px] font-semibold text-white shadow-[0_5px_14px_rgba(37,99,235,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700"
                  >

                    <PackagePlus size={14} />

                    Create your first import

                    <ArrowUpRight
                      size={13}
                      className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />

                  </Link>

                </div>

              </div>

            )}

          </div>

          {/* =====================================================
              WORKFLOW
          ===================================================== */}

          <div className="fade-up delay-4 rounded-2xl border border-slate-200 bg-white shadow-[0_2px_14px_rgba(15,23,42,0.025)]">

            <div className="border-b border-slate-100 px-5 py-4">

              <h2 className="text-[14px] font-semibold text-[#14213D]">
                Import workflow
              </h2>

              <p className="mt-1 text-[11px] text-slate-400">
                How ImportEase helps you
              </p>

            </div>

            <div className="px-5 py-5">

              <div className="relative">

                <div className="absolute left-[16px] top-4 h-[calc(100%-32px)] w-px bg-slate-200" />

                <div className="space-y-5">

                  {workflow.map((step) => {

                    const Icon = step.icon;
                    const colors = colorStyles[step.color];

                    return (
                      <div
                        key={step.number}
                        className="group relative flex gap-3"
                      >

                        <div
                          className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${colors.icon} transition-all duration-300 ${colors.hover} group-hover:scale-105`}
                        >

                          <Icon
                            size={14}
                            strokeWidth={1.8}
                          />

                        </div>

                        <div className="pt-0.5">

                          <div className="flex items-center gap-2">

                            <span className="text-[9px] font-semibold tracking-[0.12em] text-slate-300">
                              {step.number}
                            </span>

                            <p className="text-[12px] font-semibold text-slate-800 transition-colors duration-200 group-hover:text-[#2563EB]">
                              {step.title}
                            </p>

                          </div>

                          <p className="mt-1 text-[10px] leading-4 text-slate-400">
                            {step.description}
                          </p>

                        </div>

                      </div>
                    );
                  })}

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            QUICK TOOLS
        ===================================================== */}

        <section className="fade-up delay-5 mt-7">

          <div className="mb-4">

            <h2 className="text-[14px] font-semibold text-[#14213D]">
              Quick tools
            </h2>

            <p className="mt-1 text-[11px] text-slate-400">
              Frequently used import tools
            </p>

          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

            {quickTools.map((tool) => {

              const Icon = tool.icon;
              const colors = colorStyles[tool.color];

              return (
                <Link
                  key={tool.title}
                  to={tool.to}
                  className={`group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(15,23,42,0.06)] ${colors.border}`}
                >

                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${colors.icon} transition-all duration-300 ${colors.hover} group-hover:scale-105`}
                  >

                    <Icon
                      size={16}
                      strokeWidth={1.8}
                    />

                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="text-[12px] font-semibold text-slate-800">
                      {tool.title}
                    </p>

                    <p className="mt-1 truncate text-[10px] text-slate-400">
                      {tool.description}
                    </p>

                  </div>

                  <ArrowUpRight
                    size={14}
                    className={`text-slate-300 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${colors.arrow}`}
                  />

                </Link>
              );
            })}

          </div>

        </section>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <footer className="mt-8 flex flex-col gap-3 border-t border-slate-200/80 pt-5 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-[10px] text-slate-400">
            ImportEase · SME Import Platform
          </p>

          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">

            <Check
              size={11}
              strokeWidth={2.5}
              className="text-emerald-500"
            />

            Secure workspace

          </div>

        </footer>

      </main>

    </div>
  );
}

export default Dashboard;