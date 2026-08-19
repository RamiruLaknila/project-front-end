import { useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  Calculator,
  Package,
  FileText,
  Users,
  Settings,
  Bell,
  ChevronDown,
  ChevronRight,
  Plus,
  ArrowUpRight,
  Clock3,
  CheckCircle2,
  CircleAlert,
  Menu,
  X,
  LogOut,
  Ship,
  MoreHorizontal,
  TrendingUp,
} from "lucide-react";

function SMEDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const shipments = [
    {
      id: "IMP-2026-001",
      product: "Laptop Computers",
      origin: "China",
      status: "In Clearance",
      progress: 72,
      date: "Aug 17, 2026",
    },
    {
      id: "IMP-2026-002",
      product: "Solar Panels",
      origin: "Malaysia",
      status: "Agent Assigned",
      progress: 38,
      date: "Aug 15, 2026",
    },
    {
      id: "IMP-2026-003",
      product: "Cotton Fabric",
      origin: "India",
      status: "Completed",
      progress: 100,
      date: "Aug 08, 2026",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">

      {/* =========================================================
          MOBILE OVERLAY
      ========================================================= */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden dashboard-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* =========================================================
          SIDEBAR
      ========================================================= */}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[250px] flex-col border-r border-slate-200 bg-white transition-transform duration-300 ease-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >

        {/* LOGO */}

        <div className="flex h-[72px] items-center border-b border-slate-100 px-6">

          <Link
            to="/"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-2.5"
          >
            <img
              src="/logo.jpeg"
              alt="ImportEase"
              className="h-10 w-10 object-contain mix-blend-multiply"
            />

            <span className="text-xl font-bold tracking-tight text-[#173563]">
              Import<span className="text-slate-900">Ease</span>
            </span>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 lg:hidden"
          >
            <X size={19} />
          </button>

        </div>

        {/* ACCOUNT TYPE */}

        <div className="mx-4 mt-5 rounded-xl bg-[#F4F7FB] px-3 py-3">

          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Account
          </p>

          <div className="mt-1 flex items-center gap-2">

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#173563] text-xs font-bold text-white">
              SM
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-800">
                SME / Importer
              </p>

              <p className="text-[10px] text-slate-400">
                Business Account
              </p>
            </div>

          </div>

        </div>

        {/* NAVIGATION */}

        <nav className="mt-6 flex-1 px-4">

          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Main Menu
          </p>

          <NavItem
            icon={<LayoutDashboard size={17} />}
            label="Dashboard"
            active
          />

          <NavItem
            to="/hs-search"
            icon={<Search size={17} />}
            label="HS Code Search"
          />

          <NavItem
            icon={<Calculator size={17} />}
            label="Import Calculator"
          />

          <NavItem
            icon={<Users size={17} />}
            label="Find Clearing Agent"
          />
          

          <NavItem
            icon={<Ship size={17} />}
            label="My Shipments"
          />

          <NavItem
            icon={<FileText size={17} />}
            label="Documents"
          />

          <p className="mb-2 mt-7 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Account
          </p>

          <NavItem
            icon={<Settings size={17} />}
            label="Settings"
          />

        </nav>

        {/* SIDEBAR USER */}

      

            

      </aside>

      {/* =========================================================
          MAIN AREA
      ========================================================= */}

      <div className="lg:pl-[250px]">

        {/* =======================================================
            TOP BAR
        ======================================================= */}

        <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">

          <div className="flex items-center gap-3">

            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-500 transition duration-200 hover:bg-slate-100 hover:text-slate-800 lg:hidden"
            >
              <Menu size={21} />
            </button>

            <div className="hidden sm:block">

              <p className="text-xs text-slate-400">
                SME Portal
              </p>

              <p className="text-sm font-semibold text-slate-800">
                Import Management
              </p>

            </div>

          </div>

          <div className="flex items-center gap-2 sm:gap-4">

            {/* SEARCH */}

            <button className="hidden rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-400 transition duration-200 hover:border-slate-300 hover:bg-slate-50 sm:flex sm:items-center sm:gap-2">

              <Search size={15} />

              Search

              <span className="rounded border border-slate-200 px-1.5 py-0.5 text-[9px]">
                /
              </span>

            </button>

            {/* NOTIFICATIONS */}

            <button className="relative rounded-xl p-2.5 text-slate-500 transition duration-200 hover:bg-slate-100 hover:text-slate-800">

              <Bell size={19} />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />

            </button>

            {/* PROFILE */}

            <button className="flex items-center gap-2 rounded-xl p-1.5 transition duration-200 hover:bg-slate-50">

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#173563] text-xs font-bold text-white">
                ML
              </div>

              <div className="hidden text-left md:block">

                <p className="text-xs font-semibold text-slate-800">
                  My Business
                </p>

                <p className="text-[10px] text-slate-400">
                  SME Account
                </p>

              </div>

              <ChevronDown
                size={15}
                className="hidden text-slate-400 md:block"
              />

            </button>

          </div>

        </header>

        {/* =======================================================
            DASHBOARD CONTENT
        ======================================================= */}

        <main className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

          {/* =====================================================
              WELCOME
          ===================================================== */}

          <div className="dashboard-fade-up flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

            <div>

              <p className="text-sm font-medium text-[#173563]">
                Wednesday, August 19, 2026
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Good morning, My Business
              </h1>

              <p className="mt-1.5 text-sm text-slate-500">
                Here's an overview of your import activity.
              </p>

            </div>

            <button className="group flex w-fit items-center gap-2 rounded-xl bg-[#173563] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#173563]/15 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#102547] hover:shadow-lg active:scale-[0.98]">

              <Plus
                size={17}
                className="transition-transform duration-200 group-hover:rotate-90"
              />

              Start New Import

            </button>

          </div>

          {/* =====================================================
              STAT CARDS
          ===================================================== */}

          <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <div
              className="dashboard-fade-up"
              style={{ animationDelay: "100ms" }}
            >
              <StatCard
                title="Active Shipments"
                value="3"
                description="Currently in progress"
                icon={<Package size={19} />}
                trend="+1 this month"
              />
            </div>

            <div
              className="dashboard-fade-up"
              style={{ animationDelay: "150ms" }}
            >
              <StatCard
                title="Pending Clearances"
                value="2"
                description="Awaiting action"
                icon={<Clock3 size={19} />}
                trend="Needs attention"
                warning
              />
            </div>

            <div
              className="dashboard-fade-up"
              style={{ animationDelay: "200ms" }}
            >
              <StatCard
                title="Completed"
                value="12"
                description="Successfully cleared"
                icon={<CheckCircle2 size={19} />}
                trend="+3 this month"
              />
            </div>

            <div
              className="dashboard-fade-up"
              style={{ animationDelay: "250ms" }}
            >
              <StatCard
                title="Documents"
                value="8"
                description="Available documents"
                icon={<FileText size={19} />}
                trend="2 new"
              />
            </div>

          </div>

          {/* =====================================================
              MAIN GRID
          ===================================================== */}

          <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_330px]">

            {/* ===================================================
                RECENT SHIPMENTS
            =================================================== */}

            <section
              className="dashboard-fade-up overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              style={{ animationDelay: "300ms" }}
            >

              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">

                <div>

                  <h2 className="text-sm font-bold text-slate-900">
                    Recent Shipments
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-400">
                    Track your latest import activity
                  </p>

                </div>

                <button className="flex items-center gap-1 text-xs font-semibold text-[#173563] transition hover:text-blue-700">

                  View all

                  <ChevronRight size={14} />

                </button>

              </div>

              {/* DESKTOP TABLE */}

              <div className="hidden overflow-x-auto md:block">

                <table className="w-full">

                  <thead>

                    <tr className="border-b border-slate-100 bg-slate-50/70">

                      <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Shipment
                      </th>

                      <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Origin
                      </th>

                      <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Status
                      </th>

                      <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Progress
                      </th>

                      <th className="px-4 py-3" />

                    </tr>

                  </thead>

                  <tbody>

                    {shipments.map((shipment) => (

                      <tr
                        key={shipment.id}
                        className="border-b border-slate-100 last:border-0 transition-colors duration-200 hover:bg-slate-50/60"
                      >

                        <td className="px-6 py-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[#173563] transition duration-200 hover:scale-105">
                              <Package size={17} />
                            </div>

                            <div>

                              <p className="text-xs font-semibold text-slate-800">
                                {shipment.product}
                              </p>

                              <p className="mt-0.5 text-[10px] text-slate-400">
                                {shipment.id}
                              </p>

                            </div>

                          </div>

                        </td>

                        <td className="px-4 py-4 text-xs text-slate-500">
                          {shipment.origin}
                        </td>

                        <td className="px-4 py-4">
                          <StatusBadge status={shipment.status} />
                        </td>

                        <td className="px-4 py-4">

                          <div className="flex min-w-[130px] items-center gap-3">

                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">

                              <div
                                className="dashboard-progress h-full rounded-full bg-[#173563]"
                                style={{
                                  width: `${shipment.progress}%`,
                                  animationDelay: "500ms",
                                }}
                              />

                            </div>

                            <span className="text-[10px] font-semibold text-slate-500">
                              {shipment.progress}%
                            </span>

                          </div>

                        </td>

                        <td className="px-4 py-4 text-right">

                          <button className="rounded-lg p-1.5 text-slate-400 transition duration-200 hover:bg-slate-100 hover:text-slate-700">

                            <MoreHorizontal size={17} />

                          </button>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

              {/* MOBILE SHIPMENTS */}

              <div className="divide-y divide-slate-100 md:hidden">

                {shipments.map((shipment) => (

                  <div
                    key={shipment.id}
                    className="p-4 transition-colors duration-200 hover:bg-slate-50"
                  >

                    <div className="flex items-start justify-between">

                      <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[#173563]">
                          <Package size={17} />
                        </div>

                        <div>

                          <p className="text-xs font-semibold text-slate-800">
                            {shipment.product}
                          </p>

                          <p className="text-[10px] text-slate-400">
                            {shipment.id}
                          </p>

                        </div>

                      </div>

                      <StatusBadge status={shipment.status} />

                    </div>

                    <div className="mt-4">

                      <div className="mb-1.5 flex justify-between">

                        <span className="text-[10px] text-slate-400">
                          Clearance progress
                        </span>

                        <span className="text-[10px] font-semibold text-slate-600">
                          {shipment.progress}%
                        </span>

                      </div>

                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">

                        <div
                          className="dashboard-progress h-full rounded-full bg-[#173563]"
                          style={{
                            width: `${shipment.progress}%`,
                          }}
                        />

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            </section>

            {/* ===================================================
                RIGHT COLUMN
            =================================================== */}

            <div className="space-y-6">

              {/* =================================================
                  ACTION REQUIRED
              ================================================= */}

              <section
                className="dashboard-fade-up rounded-2xl border border-blue-100 bg-blue-50/60 p-5"
                style={{ animationDelay: "350ms" }}
              >

                <div className="flex items-start gap-3">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#173563] shadow-sm">
                    <CircleAlert size={17} />
                  </div>

                  <div>

                    <p className="text-xs font-bold text-[#173563]">
                      Action required
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      Your Solar Panels shipment is waiting for
                      document verification.
                    </p>

                    <button className="mt-2 text-xs font-semibold text-[#173563] transition hover:underline">
                      Review documents
                    </button>

                  </div>

                </div>

              </section>

              {/* =================================================
                  IMPORT OVERVIEW
              ================================================= */}

              <section
                className="dashboard-fade-up rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                style={{ animationDelay: "400ms" }}
              >

                <div className="flex items-center justify-between">

                  <div>

                    <h2 className="text-sm font-bold text-slate-900">
                      Import Overview
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-400">
                      Current activity
                    </p>

                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EEF3F9] text-[#173563]">
                    <TrendingUp size={17} />
                  </div>

                </div>

                <div className="mt-5 space-y-4">

                  <OverviewRow
                    label="Active imports"
                    value="3"
                  />

                  <OverviewRow
                    label="Awaiting clearance"
                    value="2"
                  />

                  <OverviewRow
                    label="Completed imports"
                    value="12"
                  />

                  <div className="border-t border-slate-100 pt-4">

                    <div className="flex items-center justify-between">

                      <span className="text-xs text-slate-500">
                        Clearance progress
                      </span>

                      <span className="text-xs font-semibold text-[#173563]">
                        72%
                      </span>

                    </div>

                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">

                      <div
                        className="dashboard-progress h-full rounded-full bg-[#173563]"
                        style={{ width: "72%" }}
                      />

                    </div>

                  </div>

                </div>

              </section>

              {/* =================================================
                  SUPPORT
              ================================================= */}

              <section
                className="dashboard-fade-up rounded-2xl bg-[#173563] p-5 text-white"
                style={{ animationDelay: "450ms" }}
              >

                <div className="flex items-start justify-between">

                  <div>

                    <p className="text-sm font-bold">
                      Need help?
                    </p>

                    <p className="mt-1 text-xs leading-5 text-blue-100">
                      Our support team can help with your
                      import clearance.
                    </p>

                  </div>

                  <ArrowUpRight
                    size={18}
                    className="text-blue-200"
                  />

                </div>

                <button className="mt-4 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-[#173563] transition duration-200 hover:-translate-y-0.5 hover:bg-blue-50 active:scale-95">
                  Contact Support
                </button>

              </section>

            </div>

          </div>

          {/* =====================================================
              FOOTER
          ===================================================== */}

          <footer className="mt-8 flex flex-col justify-between gap-2 border-t border-slate-200 pt-5 text-[10px] text-slate-400 sm:flex-row">

            <p>
              © 2026 ImportEase. All rights reserved.
            </p>

            <div className="flex gap-4">

              <button className="transition hover:text-slate-600">
                Privacy
              </button>

              <button className="transition hover:text-slate-600">
                Terms
              </button>

              <button className="flex items-center gap-1 transition hover:text-slate-600">

                <LogOut size={11} />

                Sign out

              </button>

            </div>

          </footer>

        </main>

      </div>

    </div>
  );
}


/* =============================================================
   NAVIGATION ITEM
============================================================= */

function NavItem({
  to,
  icon,
  label,
  active = false,
}) {
  return (
    <Link
      to={to || "#"}
      className={`group mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-medium transition-all duration-200 ${
        active
          ? "bg-[#173563] text-white shadow-sm"
          : "text-slate-500 hover:translate-x-0.5 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <span className="transition-transform duration-200 group-hover:scale-105">
        {icon}
      </span>

      <span>
        {label}
      </span>

      {active && (
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white" />
      )}
    </Link>
  );
}


/* =============================================================
   STAT CARD
============================================================= */

function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  warning = false,
}) {
  return (
    <div className="group h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">

      <div className="flex items-start justify-between">

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EEF3F9] text-[#173563] transition duration-200 group-hover:scale-105 group-hover:bg-[#E5EDF8]">
          {icon}
        </div>

        <span
          className={`rounded-full px-2 py-1 text-[9px] font-semibold ${
            warning
              ? "bg-amber-50 text-amber-600"
              : "bg-emerald-50 text-emerald-600"
          }`}
        >
          {trend}
        </span>

      </div>

      <div className="mt-4">

        <p className="text-[11px] font-medium text-slate-400">
          {title}
        </p>

        <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
          {value}
        </p>

        <p className="mt-1 text-[10px] text-slate-400">
          {description}
        </p>

      </div>

    </div>
  );
}


/* =============================================================
   STATUS BADGE
============================================================= */

function StatusBadge({ status }) {

  const styles = {
    "In Clearance": "bg-blue-50 text-blue-600",
    "Agent Assigned": "bg-amber-50 text-amber-600",
    Completed: "bg-emerald-50 text-emerald-600",
  };

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[9px] font-semibold ${
        styles[status] || "bg-slate-100 text-slate-500"
      }`}
    >
      {status}
    </span>
  );
}


/* =============================================================
   IMPORT OVERVIEW ROW
============================================================= */

function OverviewRow({
  label,
  value,
}) {
  return (
    <div className="flex items-center justify-between">

      <span className="text-xs text-slate-500">
        {label}
      </span>

      <span className="text-sm font-semibold text-slate-800">
        {value}
      </span>

    </div>
  );
}


export default SMEDashboard;