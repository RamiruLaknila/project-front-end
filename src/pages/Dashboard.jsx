import { useEffect, useMemo, useState } from "react";
import {
  Calculator,
  CheckCircle2,
  ChevronRight,
  Search,
  Ship,
  Sparkles,
  Users,
  Info,
  UserRound,
  ArrowRight,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import AppNavbar from "../components/ui/AppNavbar";

function Dashboard() {
  const location = useLocation();

  const [shipments, setShipments] = useState([]);
  const [user, setUser] = useState(null);

  /* =========================================================
     LOAD USER
  ========================================================= */

  const loadUser = () => {
    try {
      const storedUser = localStorage.getItem(
        "importease_user"
      );

      if (!storedUser) {
        setUser(null);
        return;
      }

      const parsedUser = JSON.parse(storedUser);

      setUser(parsedUser);
    } catch (error) {
      console.error("Failed to load user:", error);
      setUser(null);
    }
  };

  /* =========================================================
     LOAD SHIPMENTS
  ========================================================= */

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
      console.error("Failed to load shipments:", error);
      setShipments([]);
    }
  };

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    loadUser();
    loadShipments();
  }, [location.key]);

  /* =========================================================
     REFRESH USER + SHIPMENTS WHEN PAGE CHANGES
  ========================================================= */

  useEffect(() => {
    loadUser();
    loadShipments();
  }, [location.pathname]);

  /* =========================================================
     STORAGE LISTENER
  ========================================================= */

  useEffect(() => {
    const handleStorageChange = () => {
      loadUser();
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

  /* =========================================================
     PROFILE INFORMATION
  ========================================================= */

  const fullName =
    user?.fullName?.trim() || "there";

  const businessName =
    user?.business?.name ||
    user?.businessName ||
    "";

  const profileComplete =
    user?.profileComplete === true;

  /* =========================================================
     DASHBOARD GREETING
  ========================================================= */

  const dashboardName =
    businessName || fullName;

  /* =========================================================
     ACTIVE SHIPMENTS
  ========================================================= */

  const activeShipments = useMemo(() => {
    return shipments.filter((shipment) => {
      const status = shipment?.status;

      return (
        status !== "Completed" &&
        status !== "Cancelled"
      );
    });
  }, [shipments]);

  /* =========================================================
     QUICK TOOLS
  ========================================================= */

  const quickTools = [
    {
      title: "HS Code Search",
      description:
        "Find your tariff code and duty rates",
      icon: Search,
      to: "/hs-code-search",
      iconStyle:
        "bg-blue-50 text-blue-600",
    },
    {
      title: "Cost Calculator",
      description:
        "Calculate duties, VAT, and landed cost",
      icon: Calculator,
      to: "/calculator",
      iconStyle:
        "bg-amber-50 text-amber-700",
    },
    {
      title: "Find an Agent",
      description:
        "Compare clearing agents and get bids",
      icon: Users,
      to: "/find-agent",
      iconStyle:
        "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Track Shipment",
      description:
        "Follow your clearing process live",
      icon: Ship,
      to: "/track-shipment",
      iconStyle:
        "bg-indigo-50 text-indigo-600",
    },
  ];

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

        .fade-up {
          animation: fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @media (prefers-reduced-motion: reduce) {
          .fade-up {
            animation: none;
          }
        }
      `}</style>

      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <AppNavbar />

      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="mx-auto w-full max-w-[1120px] px-5 py-8 sm:px-8 lg:py-10">

        {/* ===================================================
            PAGE HEADER
        ==================================================== */}

        <section className="fade-up mb-8">

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

            <div>

              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5">

                <Sparkles
                  size={13}
                  className="text-blue-600"
                  strokeWidth={2}
                />

                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-700">
                  Importer dashboard
                </span>

              </div>

              <h1 className="text-[28px] font-bold tracking-[-0.04em] text-[#14213D] sm:text-[40px]">

                Welcome back,{" "}

                <span>
                  {dashboardName}.
                </span>

              </h1>

              <p className="mt-2 max-w-2xl text-[13px] leading-6 text-slate-500 sm:text-sm">
                Manage your imports, track clearances,
                and connect with agents, all from one
                workspace.
              </p>

            </div>

            {/* ACCOUNT STATUS */}

            <div
              className={`hidden items-center gap-2 rounded-full px-3 py-1.5 md:flex ${
                profileComplete
                  ? "border border-emerald-100 bg-emerald-50"
                  : "border border-amber-100 bg-amber-50"
              }`}
            >

              <CheckCircle2
                size={14}
                className={
                  profileComplete
                    ? "text-emerald-600"
                    : "text-amber-600"
                }
              />

              <span
                className={`text-[10px] font-semibold ${
                  profileComplete
                    ? "text-emerald-700"
                    : "text-amber-700"
                }`}
              >
                {profileComplete
                  ? "Profile complete"
                  : "Profile incomplete"}
              </span>

            </div>

          </div>

        </section>

        {/* ===================================================
            COMPLETE PROFILE BANNER
        ==================================================== */}

        {!profileComplete && (
          <section className="fade-up mb-6">

            <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-[0_4px_20px_rgba(37,99,235,.06)]">

              {/* DECORATION */}

              <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-blue-100/50 blur-3xl" />

              <div className="relative flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">

                {/* LEFT */}

                <div className="flex min-w-0 items-start gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                    <UserRound
                      size={20}
                      strokeWidth={1.8}
                    />

                  </div>

                  <div className="min-w-0">

                    <div className="flex flex-wrap items-center gap-2">

                      <h2 className="text-sm font-bold text-slate-800">
                        Complete your profile
                      </h2>

                      <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-bold text-amber-700">
                        Recommended
                      </span>

                    </div>

                    <p className="mt-1 max-w-2xl text-[11px] leading-5 text-slate-500 sm:text-xs">
                      Add your phone number and business
                      information so you can get the full
                      ImportEase experience, including
                      finding agents, marketplace access,
                      bidding, and shipment management.
                    </p>

                  </div>

                </div>

                {/* ACTION */}

                <Link
                  to="/complete-profile"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#173563] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#102547]"
                >
                  Complete Profile

                  <ArrowRight size={14} />
                </Link>

              </div>

            </div>

          </section>
        )}

        {/* ===================================================
            ACTIVE SHIPMENTS
        ==================================================== */}

        {activeShipments.length > 0 && (
          <section className="fade-up mb-6 rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,.02)]">

            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex min-w-0 items-start gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">

                  <Ship
                    size={18}
                    strokeWidth={1.8}
                  />

                </div>

                <div className="min-w-0">

                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Live tracking
                  </p>

                  <h2 className="mt-1 text-sm font-bold text-slate-800">
                    {activeShipments.length} active shipment
                    {activeShipments.length !== 1
                      ? "s"
                      : ""}
                  </h2>

                  <p className="mt-1 text-[11px] text-slate-500">
                    Follow your clearing process in
                    real time.
                  </p>

                </div>

              </div>

              <Link
                to="/track-shipment"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#173B6C] transition hover:text-blue-700"
              >
                View shipments

                <ChevronRight size={13} />
              </Link>

            </div>

          </section>
        )}

        {/* ===================================================
            QUICK TOOLS
        ==================================================== */}

        <section className="fade-up">

          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <div className="flex items-center gap-2">

                <h2 className="text-sm font-bold text-[#14213D]">
                  Quick tools
                </h2>

                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-500">
                  {quickTools.length}
                </span>

              </div>

              <p className="mt-1 text-[11px] text-slate-500">
                Jump straight into the tools you use
                most.
              </p>

            </div>

          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

            {quickTools.map((tool) => {

              const Icon = tool.icon;

              return (
                <Link
                  key={tool.title}
                  to={tool.to}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)] transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_10px_28px_rgba(15,23,42,.06)]"
                >

                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${tool.iconStyle} transition-all duration-300 group-hover:scale-105`}
                  >

                    <Icon
                      size={17}
                      strokeWidth={1.8}
                    />

                  </div>

                  <h3 className="mt-3 text-[13px] font-bold leading-5 text-slate-800 transition-colors group-hover:text-[#173B6C]">
                    {tool.title}
                  </h3>

                  <p className="mt-1.5 text-[11px] leading-5 text-slate-500">
                    {tool.description}
                  </p>

                  <div className="mt-3 flex items-center gap-1">

                    <span className="text-[10px] font-semibold text-[#173B6C]">
                      Open
                    </span>

                    <ChevronRight
                      size={12}
                      className="text-[#173B6C] transition-transform duration-200 group-hover:translate-x-0.5"
                    />

                  </div>

                </Link>
              );
            })}

          </div>

        </section>

        {/* ===================================================
            FOOTER
        ==================================================== */}

        <div className="mt-10 flex items-center justify-center gap-2 border-t border-slate-200 pt-6 text-center text-[10px] text-slate-400">

          <Info size={12} />

          <span>
            ImportEase · SME Import Platform
          </span>

        </div>

      </main>

    </div>
  );
}

export default Dashboard;