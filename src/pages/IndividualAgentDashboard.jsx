import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  ChevronRight,
  FileText,
  Package,
  RefreshCw,
  Search,
  ShieldCheck,
  Users,
  TrendingUp,
} from "lucide-react";
import IndividualAgentSidebar from "../components/IndividualAgentSidebar";

function IndividualAgentDashboard() {
  const [agent, setAgent] = useState(null);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const savedAgent = localStorage.getItem("clearingAgent");

    if (savedAgent) {
      try {
        setAgent(JSON.parse(savedAgent));
      } catch {
        setAgent(null);
      }
    }

    const savedRequests = localStorage.getItem("smeRequests");

    if (savedRequests) {
      try {
        setRequests(JSON.parse(savedRequests));
      } catch {
        setRequests([]);
      }
    }
  }, []);

  const demoRequests = [
    {
      id: "REQ-1001",
      product: "Solar Panels",
      category: "Electronics",
      destination: "Colombo Port",
      value: "USD 12,500",
      status: "Open",
    },
    {
      id: "REQ-1002",
      product: "Cotton T-Shirts",
      category: "Textiles",
      destination: "Colombo Port",
      value: "USD 8,200",
      status: "Open",
    },
    {
      id: "REQ-1003",
      product: "Industrial Machinery",
      category: "Machinery",
      destination: "Hambantota Port",
      value: "USD 25,000",
      status: "Open",
    },
  ];

  const availableRequests = useMemo(() => {
    return requests.length > 0 ? requests : demoRequests;
  }, [requests]);

  const displayName =
    agent?.fullName ||
    agent?.name ||
    localStorage.getItem("agentName") ||
    "Individual Agent";

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-[#173563]">
      <IndividualAgentSidebar />

      <div className="min-h-screen">
        {/* =====================================================
            MAIN CONTENT
        ===================================================== */}
        <main className="min-h-screen pt-[68px] lg:ml-[260px] lg:pt-0">
          {/* =====================================================
              HEADER
          ===================================================== */}
          <header className="sticky top-[68px] z-30 flex h-[70px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:top-0">
            <div className="flex items-center">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                  Individual Agent Workspace
                </p>

                <h1 className="mt-0.5 text-base font-bold text-slate-800">
                  Dashboard
                </h1>
              </div>
            </div>

            {/* Header Actions */}
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#2563EB]"
                title="Refresh"
              >
                <RefreshCw size={17} />
              </button>

              <button
                type="button"
                className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#2563EB]"
                title="Notifications"
              >
                <Bell size={17} />

                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
              </button>
            </div>
          </header>

          {/* =====================================================
              PAGE CONTENT
          ===================================================== */}
          <div className="mx-auto max-w-[1180px] px-5 py-7 sm:px-8 lg:py-9">
            {/* =====================================================
                PAGE TITLE
            ===================================================== */}
            <section className="mb-7">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                  <p className="text-sm font-medium text-slate-500">
            
                  </p>

                  <h2 className="mt-1 text-[32px] font-bold tracking-[-0.04em] text-[#14213D] sm:text-[42px]">
                   Welcome back, {displayName}
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-[15px]">
                    Manage SME import requests, submit bids, and keep track of
                    your shipments from one place.
                  </p>
                </div>

                <Link
                  to="/individual-agent-requests"
                  className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-[#173563] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#10294d]"
                >
                  <Search size={17} />
                  Browse Requests
                </Link>
              </div>
            </section>

            {/* =====================================================
                STAT CARDS
            ===================================================== */}
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                icon={<Users size={20} />}
                title="Available Requests"
                value={availableRequests.length}
                description="Open SME requests"
              />

              <StatCard
                icon={<FileText size={20} />}
                title="My Bids"
                value="5"
                description="Bids submitted"
              />

              <StatCard
                icon={<Package size={20} />}
                title="Active Shipments"
                value="3"
                description="Currently handling"
              />

              <StatCard
                icon={<ShieldCheck size={20} />}
                title="Completed"
                value="8"
                description="Completed shipments"
              />
            </section>

            {/* =====================================================
                QUICK ACTIONS
            ===================================================== */}
            <section className="mt-8">
              <div className="mb-4">
                <h2 className="text-base font-bold text-[#173563]">
                  Quick Actions
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Access your most important agent tasks.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <QuickAction
                  icon={<Search size={20} />}
                  title="Browse SME Requests"
                  description="Find import requests that match your services."
                  to="/individual-agent-requests"
                />

                <QuickAction
                  icon={<FileText size={20} />}
                  title="View My Bids"
                  description="Review the bids you have submitted."
                  to="/individual-agent-bids"
                />

                <QuickAction
                  icon={<Package size={20} />}
                  title="Track Shipments"
                  description="Manage your active and completed shipments."
                  to="/individual-agent-shipments"
                />
              </div>
            </section>

            {/* =====================================================
                AVAILABLE SME REQUESTS
            ===================================================== */}
            <section className="mt-8">
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-[#173563]">
                    Available SME Requests
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    Import requests currently available for bidding.
                  </p>
                </div>

                <Link
                  to="/individual-agent-requests"
                  className="hidden items-center gap-1 text-xs font-semibold text-[#2563EB] sm:flex"
                >
                  View all
                  <ChevronRight size={15} />
                </Link>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,.02)]">
                {availableRequests.slice(0, 3).map((request) => (
                  <RequestRow key={request.id} request={request} />
                ))}

                {availableRequests.length === 0 && (
                  <div className="px-6 py-10 text-center">
                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                      <FileText size={19} />
                    </div>

                    <p className="mt-3 text-sm font-semibold text-[#173563]">
                      No requests available
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      New SME requests will appear here.
                    </p>
                  </div>
                )}
              </div>

              <Link
                to="/individual-agent-requests"
                className="mt-3 flex items-center justify-center gap-1 text-xs font-semibold text-[#2563EB] sm:hidden"
              >
                View all requests
                <ChevronRight size={15} />
              </Link>
            </section>

            {/* =====================================================
                ACCOUNT STATUS
            ===================================================== */}
            <section className="mt-8">
              <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5 sm:p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#2563EB] shadow-sm">
                      <ShieldCheck size={21} />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-[#173563]">
                        Individual Agent Account
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Your account is set up as an independent clearing
                        agent. You can work directly with SMEs without joining
                        an agency.
                      </p>
                    </div>
                  </div>

                  <Link
                    to="/profile"
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#173563] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#10294d]"
                  >
                    View Profile
                    <ChevronRight size={15} />
                  </Link>
                </div>
              </div>
            </section>

            {/* =====================================================
                FOOTER
            ===================================================== */}
            <footer className="mt-10 border-t border-slate-200 pt-5">
              <div className="flex flex-col gap-2 text-[11px] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                <p>
                  © {new Date().getFullYear()} ImportEase. All rights
                  reserved.
                </p>

                <p>Individual Agent Workspace</p>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ============================================================
   STAT CARD
============================================================ */
function StatCard({ icon, title, value, description }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)] transition hover:-translate-y-0.5 hover:border-blue-100 hover:shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
          {icon}
        </div>
      </div>

      <div className="mt-5">
        <p className="text-xs font-medium text-slate-400">{title}</p>

        <p className="mt-1 text-2xl font-bold tracking-tight text-[#173563]">
          {value}
        </p>

        <p className="mt-1 text-[11px] text-slate-400">{description}</p>
      </div>
    </div>
  );
}

/* ============================================================
   QUICK ACTION
============================================================ */
function QuickAction({ icon, title, description, to }) {
  return (
    <Link
      to={to}
      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)] transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/30 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB] transition group-hover:bg-blue-100">
          {icon}
        </div>

        <ChevronRight
          size={18}
          className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-[#2563EB]"
        />
      </div>

      <h3 className="mt-4 text-sm font-bold text-[#173563]">{title}</h3>

      <p className="mt-1 text-xs leading-5 text-slate-400">{description}</p>
    </Link>
  );
}

/* ============================================================
   REQUEST ROW
============================================================ */
function RequestRow({ request }) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 transition last:border-b-0 hover:bg-blue-50/20 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
          <Package size={18} />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-sm font-bold text-[#173563]">
              {request.product}
            </h3>

            <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-600">
              {request.status || "Open"}
            </span>
          </div>

          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-400">
            <span>{request.id}</span>
            <span>{request.category}</span>
            <span>{request.destination}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <div className="text-left sm:text-right">
          <p className="text-[10px] font-medium text-slate-400">
            Estimated Value
          </p>

          <p className="mt-0.5 text-sm font-bold text-[#173563]">
            {request.value}
          </p>
        </div>

        <Link
          to="/individual-agent-requests"
          className="flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-[#173563] transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#2563EB]"
        >
          View
          <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
}

export default IndividualAgentDashboard;
