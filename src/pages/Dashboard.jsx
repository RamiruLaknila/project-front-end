import { useEffect, useMemo, useState } from "react";
import {
  Calculator,
  ChevronRight,
  Info,
  Search,
  Ship,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

import AppNavbar from "../components/ui/AppNavbar";

function Dashboard() {
  const [shipments, setShipments] = useState([]);
  const [user, setUser] = useState(null);

  // =========================================================
  // LOAD USER + SHIPMENTS
  // =========================================================

  const loadDashboardData = () => {
    try {
      const storedUser = localStorage.getItem("smeUser");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }

      const storedShipments = localStorage.getItem("shipments");

      if (storedShipments) {
        const parsedShipments = JSON.parse(storedShipments);

        setShipments(
          Array.isArray(parsedShipments) ? parsedShipments : []
        );
      } else {
        setShipments([]);
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      setUser(null);
      setShipments([]);
    }
  };

  useEffect(() => {
    loadDashboardData();

    const handleStorageChange = () => {
      loadDashboardData();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // =========================================================
  // USER INFORMATION
  // =========================================================

  const fullName = user?.fullName?.trim() || "there";

  const businessName =
    user?.business?.name ||
    user?.businessName ||
    "";

  const dashboardName = businessName || fullName;

  // =========================================================
  // ACTIVE SHIPMENTS
  // =========================================================

  const activeShipments = useMemo(() => {
    return shipments.filter((shipment) => {
      const status = shipment?.status;

      return status !== "Completed" && status !== "Cancelled";
    });
  }, [shipments]);

  // =========================================================
  // QUICK TOOLS
  // =========================================================

  const quickTools = [
    {
      title: "HS Code Search",
      description: "Find the correct tariff code and duty rates.",
      icon: Search,
      to: "/hs-code-search",
      iconStyle: "bg-blue-50 text-blue-700",
    },
    {
      title: "Import Calculator",
      description: "Estimate duty, VAT, and your total import cost.",
      icon: Calculator,
      to: "/calculator",
      iconStyle: "bg-amber-50 text-amber-700",
    },
    {
      title: "Find a Clearing Agent",
      description:
        "Compare agents and choose the right one for your import.",
      icon: Users,
      to: "/find-agent",
      iconStyle: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Track Shipment",
      description: "Check the current status of your shipment.",
      icon: Ship,
      to: "/track-shipment",
      iconStyle: "bg-indigo-50 text-indigo-700",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-900">

      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <AppNavbar />

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <main className="mx-auto w-full max-w-[1120px] px-5 pb-10 pt-5 sm:px-8 sm:pt-6 lg:pt-7">

        {/* ===================================================
            WELCOME
        ==================================================== */}

        <section className="mb-8">
          <div>
          

            <h1 className="text-3xl font-bold tracking-tight text-[#14213D] sm:text-4xl lg:text-[42px]">
              Welcome back, {dashboardName}.
            </h1>

        
          </div>
        </section>

        {/* ===================================================
            ACTIVE SHIPMENTS
        ==================================================== */}

        {activeShipments.length > 0 && (
          <section className="mb-8">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">

                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <Ship
                      size={22}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Active shipments
                    </p>

                    <h2 className="mt-1 text-lg font-bold text-slate-900">
                      {activeShipments.length} shipment
                      {activeShipments.length !== 1 ? "s" : ""} in progress
                    </h2>

                    <p className="mt-1 text-sm text-slate-600">
                      Follow your clearing process and shipment status.
                    </p>
                  </div>

                </div>

                <Link
                  to="/track-shipment"
                  className="inline-flex min-h-10 items-center justify-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-[#173B6C] transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                >
                  View shipments

                  <ChevronRight
                    size={16}
                    aria-hidden="true"
                  />
                </Link>

              </div>
            </div>
          </section>
        )}

        {/* ===================================================
            QUICK TOOLS
        ==================================================== */}

        <section>

          <div className="mb-5">
            <h2 className="text-xl font-bold text-[#14213D]">
              Quick tools
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Start an import task or manage an existing shipment.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {quickTools.map((tool) => {
              const Icon = tool.icon;

              return (
                <Link
                  key={tool.title}
                  to={tool.to}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                >

                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${tool.iconStyle}`}
                  >
                    <Icon
                      size={20}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </div>

                  <h3 className="mt-4 text-base font-bold leading-6 text-slate-900 group-hover:text-[#173B6C]">
                    {tool.title}
                  </h3>

                  <p className="mt-2 text-sm leading-5 text-slate-600">
                    {tool.description}
                  </p>

                  <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#173B6C]">
                    Open tool

                    <ChevronRight
                      size={15}
                      className="transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
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

        <footer className="mt-12 flex items-center justify-center gap-2 border-t border-slate-200 pt-6 text-center text-xs text-slate-500">
          <Info
            size={14}
            aria-hidden="true"
          />

          <span>
            ImportEase · SME Import Platform
          </span>
        </footer>

      </main>
    </div>
  );
}

export default Dashboard;