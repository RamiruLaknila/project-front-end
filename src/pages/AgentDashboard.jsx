import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock3,
  DollarSign,
  FileText,
  LogOut,
  Menu,
  Package,
  Search,
  Settings,
  ShieldCheck,
  TrendingUp,
  User,
  Users,
  X,
} from "lucide-react";

const demoRequests = [
  {
    id: "SME-2048",
    company: "ABC Trading",
    product: "Electronic Components",
    origin: "China",
    destination: "Colombo",
    value: "LKR 2,450,000",
    posted: "2 hours ago",
    status: "New",
  },
  {
    id: "SME-2047",
    company: "Lanka Home Supplies",
    product: "Kitchen Equipment",
    origin: "India",
    destination: "Colombo",
    value: "LKR 1,820,000",
    posted: "5 hours ago",
    status: "New",
  },
  {
    id: "SME-2046",
    company: "Island Retailers",
    product: "Textile Products",
    origin: "Vietnam",
    destination: "Colombo",
    value: "LKR 3,100,000",
    posted: "Yesterday",
    status: "New",
  },
];

const demoBids = [
  {
    id: "BID-1008",
    request: "SME-2045",
    company: "Global Merchants",
    amount: "LKR 82,500",
    status: "Under Review",
  },
  {
    id: "BID-1007",
    request: "SME-2041",
    company: "Metro Supplies",
    amount: "LKR 65,000",
    status: "Accepted",
  },
  {
    id: "BID-1006",
    request: "SME-2038",
    company: "Prime Retail",
    amount: "LKR 91,000",
    status: "Submitted",
  },
];

const demoShipments = [
  {
    id: "IMP-1024",
    company: "Metro Supplies",
    product: "Industrial Equipment",
    status: "Customs Clearance",
    progress: 68,
  },
  {
    id: "IMP-1021",
    company: "Global Merchants",
    product: "Electronic Goods",
    status: "Documents Verified",
    progress: 42,
  },
];

function AgentDashboard() {
  const navigate = useNavigate();

  const [agent, setAgent] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const storedAgent = localStorage.getItem("individualAgent");

    if (storedAgent) {
      try {
        setAgent(JSON.parse(storedAgent));
      } catch {
        setAgent(null);
      }
    }
  }, []);

  const agentName = agent?.fullName || "Clearing Agent";

  const firstName = useMemo(() => {
    return agentName.split(" ")[0];
  }, [agentName]);

  const handleLogout = () => {
    localStorage.removeItem("agentLoggedIn");
    navigate("/agent-signin");
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-900">

      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}

      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:translate-x-0 ${
          menuOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        {/* Logo */}

        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-5">

          <Link
            to="/"
            className="flex items-center gap-3"
          >

            <img
              src="/logo.jpeg"
              alt="ImportEase"
              className="h-11 w-11 object-contain mix-blend-multiply"
            />

            <div>
              <p className="text-lg font-bold tracking-tight">
                Import
                <span className="text-[#173563]">
                  Ease
                </span>
              </p>

              <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                Agent Portal
              </p>
            </div>

          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 lg:hidden"
          >
            <X size={18} />
          </button>

        </div>

        {/* Agent mini profile */}

        <div className="border-b border-slate-100 p-4">

          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#173563] text-sm font-bold text-white">
              {getInitials(agentName)}
            </div>

            <div className="min-w-0">

              <p className="truncate text-sm font-bold text-slate-800">
                {agentName}
              </p>

              <div className="mt-1 flex items-center gap-1">

                <CheckCircle2
                  size={12}
                  className="text-emerald-500"
                />

                <span className="text-[10px] font-semibold text-emerald-600">
                  Verified Agent
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* Navigation */}

        <nav className="flex-1 overflow-y-auto px-3 py-5">

          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Workspace
          </p>

          <SidebarItem
            icon={<TrendingUp size={18} />}
            label="Dashboard"
            active
            onClick={() => {
              navigate("/agent-dashboard");
              setMenuOpen(false);
            }}
          />

          <SidebarItem
            icon={<Search size={18} />}
            label="SME Requests"
            onClick={() => {
              navigate("/agent-marketplace");
              setMenuOpen(false);
            }}
          />

          <SidebarItem
            icon={<FileText size={18} />}
            label="My Bids"
            onClick={() => {
              navigate("/agent-my-bids");
              setMenuOpen(false);
            }}
          />

          <SidebarItem
            icon={<Package size={18} />}
            label="Shipments"
            onClick={() => {
              navigate("/agent-shipments");
              setMenuOpen(false);
            }}
          />

          <div className="my-5 border-t border-slate-100" />

          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Account
          </p>

          <SidebarItem
            icon={<User size={18} />}
            label="My Profile"
            onClick={() => {
              navigate("/profile");
              setMenuOpen(false);
            }}
          />

          <SidebarItem
            icon={<Settings size={18} />}
            label="Settings"
            onClick={() => {
              navigate("/settings");
              setMenuOpen(false);
            }}
          />

        </nav>

        {/* Bottom */}

        <div className="border-t border-slate-100 p-3">

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-500 transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={18} />
            Sign Out
          </button>

        </div>

      </aside>

      {/* =====================================================
          MAIN AREA
      ===================================================== */}

      <div className="lg:pl-64">

        {/* Topbar */}

        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">

          <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">

            <div className="flex items-center gap-3">

              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="rounded-xl border border-slate-200 p-2.5 text-slate-600 lg:hidden"
              >
                <Menu size={20} />
              </button>

              <div>

                <p className="text-xs font-medium text-slate-400">
                  Agent Workspace
                </p>

                <h1 className="text-lg font-bold text-slate-900">
                  Dashboard
                </h1>

              </div>

            </div>

            <div className="flex items-center gap-3">

              {/* Notification */}

              <button
                type="button"
                className="relative rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 transition hover:bg-slate-50"
              >
                <Bell size={18} />

                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
              </button>

              {/* Profile */}

              <div className="hidden items-center gap-3 border-l border-slate-200 pl-4 sm:flex">

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#173563] text-xs font-bold text-white">
                  {getInitials(agentName)}
                </div>

                <div className="max-w-[150px]">

                  <p className="truncate text-xs font-bold text-slate-800">
                    {agentName}
                  </p>

                  <p className="text-[10px] text-slate-400">
                    Individual Agent
                  </p>

                </div>

              </div>

            </div>

          </div>

        </header>

        {/* Page */}

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

          {/* =================================================
              WELCOME
          ================================================= */}

          <section className="relative overflow-hidden rounded-2xl bg-[#173563] p-6 text-white shadow-lg sm:p-7">

            <div className="relative z-10">

              <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">

                <div>

                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5">

                    <CheckCircle2 size={14} />

                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Account Approved
                    </span>

                  </div>

                  <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    Welcome back, {firstName}
                  </h2>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100">
                    Find new SME import requests, submit competitive
                    bids and manage your active clearing work from
                    one place.
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() => navigate("/agent-marketplace")}
                  className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#173563] shadow-lg transition hover:bg-blue-50"
                >
                  <Search size={17} />
                  Browse Requests
                </button>

              </div>

            </div>

            <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/5" />

            <div className="pointer-events-none absolute -bottom-24 right-24 h-48 w-48 rounded-full bg-blue-400/10" />

          </section>

          {/* =================================================
              KPI CARDS
          ================================================= */}

          <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <KpiCard
              icon={<Search size={20} />}
              title="New SME Requests"
              value="12"
              subtitle="Available to bid"
              iconClass="bg-blue-50 text-blue-600"
            />

            <KpiCard
              icon={<FileText size={20} />}
              title="Active Bids"
              value="8"
              subtitle="Awaiting decisions"
              iconClass="bg-violet-50 text-violet-600"
            />

            <KpiCard
              icon={<CheckCircle2 size={20} />}
              title="Won Requests"
              value="24"
              subtitle="Successfully accepted"
              iconClass="bg-emerald-50 text-emerald-600"
            />

            <KpiCard
              icon={<Package size={20} />}
              title="Active Shipments"
              value="6"
              subtitle="Currently processing"
              iconClass="bg-amber-50 text-amber-600"
            />

          </section>

          {/* =================================================
              MAIN GRID
          ================================================= */}

          <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_380px]">

            {/* =================================================
                SME REQUESTS
            ================================================= */}

            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="flex items-center justify-between border-b border-slate-100 p-5">

                <div>

                  <h2 className="text-base font-bold text-slate-900">
                    New SME Requests
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Import requests available for bidding
                  </p>

                </div>

                <Link
                  to="/agent-marketplace"
                  className="flex items-center gap-1 text-xs font-bold text-[#173563] hover:text-blue-700"
                >
                  View all
                  <ChevronRight size={14} />
                </Link>

              </div>

              <div className="divide-y divide-slate-100">

                {demoRequests.map((request) => (
                  <RequestRow
                    key={request.id}
                    request={request}
                    onClick={() => navigate("/agent-marketplace")}
                  />
                ))}

              </div>

            </section>

            {/* =================================================
                QUICK ACTIONS
            ================================================= */}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <h2 className="text-base font-bold text-slate-900">
                Quick Actions
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Frequently used agent tools
              </p>

              <div className="mt-5 space-y-3">

                <QuickAction
                  icon={<Search size={19} />}
                  title="Browse SME Requests"
                  description="Find new import opportunities"
                  onClick={() => navigate("/agent-marketplace")}
                  iconClass="bg-blue-50 text-blue-600"
                />

                <QuickAction
                  icon={<FileText size={19} />}
                  title="View My Bids"
                  description="Track your submitted bids"
                  onClick={() => navigate("/agent-my-bids")}
                  iconClass="bg-violet-50 text-violet-600"
                />

                <QuickAction
                  icon={<Package size={19} />}
                  title="Manage Shipments"
                  description="View active clearing work"
                  onClick={() => navigate("/agent-shipments")}
                  iconClass="bg-amber-50 text-amber-600"
                />

                <QuickAction
                  icon={<User size={19} />}
                  title="My Profile"
                  description="Manage your agent details"
                  onClick={() => navigate("/profile")}
                  iconClass="bg-emerald-50 text-emerald-600"
                />

              </div>

            </section>

          </div>

          {/* =================================================
              BIDS + SHIPMENTS
          ================================================= */}

          <div className="mt-6 grid gap-6 lg:grid-cols-2">

            {/* Recent Bids */}

            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="flex items-center justify-between border-b border-slate-100 p-5">

                <div>

                  <h2 className="text-base font-bold text-slate-900">
                    Recent Bids
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Latest bidding activity
                  </p>

                </div>

                <Link
                  to="/agent-my-bids"
                  className="flex items-center gap-1 text-xs font-bold text-[#173563]"
                >
                  View all
                  <ChevronRight size={14} />
                </Link>

              </div>

              <div className="divide-y divide-slate-100">

                {demoBids.map((bid) => (
                  <BidRow
                    key={bid.id}
                    bid={bid}
                  />
                ))}

              </div>

            </section>

            {/* Active Shipments */}

            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="flex items-center justify-between border-b border-slate-100 p-5">

                <div>

                  <h2 className="text-base font-bold text-slate-900">
                    Active Shipments
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Current clearing assignments
                  </p>

                </div>

                <Link
                  to="/agent-shipments"
                  className="flex items-center gap-1 text-xs font-bold text-[#173563]"
                >
                  View all
                  <ChevronRight size={14} />
                </Link>

              </div>

              <div className="divide-y divide-slate-100">

                {demoShipments.map((shipment) => (
                  <ShipmentRow
                    key={shipment.id}
                    shipment={shipment}
                  />
                ))}

              </div>

            </section>

          </div>

          {/* =================================================
              PROFILE / VERIFICATION
          ================================================= */}

          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-start gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <ShieldCheck size={21} />
                </div>

                <div>

                  <div className="flex flex-wrap items-center gap-2">

                    <h2 className="text-sm font-bold text-slate-900">
                      Agent Verification
                    </h2>

                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-600">
                      VERIFIED
                    </span>

                  </div>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Your clearing agent application has been approved.
                    You can now participate in SME requests and bidding.
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
              >
                View Profile
                <ChevronRight size={14} />
              </button>

            </div>

          </section>

        </main>

      </div>

    </div>
  );
}


/* =========================================================
   SIDEBAR ITEM
========================================================= */

function SidebarItem({
  icon,
  label,
  active = false,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
        active
          ? "bg-[#173563] text-white shadow-md shadow-[#173563]/10"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}


/* =========================================================
   KPI CARD
========================================================= */

function KpiCard({
  icon,
  title,
  value,
  subtitle,
  iconClass,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-start justify-between">

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>

        <TrendingUp
          size={16}
          className="text-emerald-500"
        />

      </div>

      <p className="mt-5 text-2xl font-bold tracking-tight text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs font-semibold text-slate-700">
        {title}
      </p>

      <p className="mt-1 text-[10px] text-slate-400">
        {subtitle}
      </p>

    </div>
  );
}


/* =========================================================
   REQUEST ROW
========================================================= */

function RequestRow({
  request,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-4 p-5 text-left transition hover:bg-slate-50"
    >

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Package size={18} />
      </div>

      <div className="min-w-0 flex-1">

        <div className="flex flex-wrap items-center gap-2">

          <p className="text-sm font-bold text-slate-800">
            {request.product}
          </p>

          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-bold text-blue-600">
            NEW
          </span>

        </div>

        <p className="mt-1 text-xs text-slate-500">
          {request.company} · {request.origin} → {request.destination}
        </p>

        <p className="mt-1 text-[10px] text-slate-400">
          {request.id} · {request.posted}
        </p>

      </div>

      <div className="hidden text-right sm:block">

        <p className="text-xs font-bold text-slate-700">
          {request.value}
        </p>

        <p className="mt-1 text-[10px] text-slate-400">
          Cargo value
        </p>

      </div>

      <ChevronRight
        size={17}
        className="shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-[#173563]"
      />

    </button>
  );
}


/* =========================================================
   QUICK ACTION
========================================================= */

function QuickAction({
  icon,
  title,
  description,
  onClick,
  iconClass,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-xl border border-slate-100 p-3 text-left transition hover:border-slate-200 hover:bg-slate-50"
    >

      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">

        <p className="text-xs font-bold text-slate-800">
          {title}
        </p>

        <p className="mt-1 text-[10px] text-slate-400">
          {description}
        </p>

      </div>

      <ChevronRight
        size={15}
        className="text-slate-300 transition group-hover:translate-x-1"
      />

    </button>
  );
}


/* =========================================================
   BID ROW
========================================================= */

function BidRow({
  bid,
}) {
  const statusStyles = {
    Accepted: "bg-emerald-50 text-emerald-600",
    "Under Review": "bg-amber-50 text-amber-600",
    Submitted: "bg-blue-50 text-blue-600",
  };

  return (
    <div className="flex items-center gap-4 p-5">

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
        <DollarSign size={18} />
      </div>

      <div className="min-w-0 flex-1">

        <p className="text-sm font-bold text-slate-800">
          {bid.company}
        </p>

        <p className="mt-1 text-[10px] text-slate-400">
          {bid.id} · {bid.request}
        </p>

      </div>

      <div className="text-right">

        <p className="text-xs font-bold text-slate-700">
          {bid.amount}
        </p>

        <span
          className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[9px] font-bold ${
            statusStyles[bid.status] ||
            "bg-slate-100 text-slate-500"
          }`}
        >
          {bid.status}
        </span>

      </div>

    </div>
  );
}


/* =========================================================
   SHIPMENT ROW
========================================================= */

function ShipmentRow({
  shipment,
}) {
  return (
    <div className="p-5">

      <div className="flex items-start gap-4">

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
          <Package size={18} />
        </div>

        <div className="min-w-0 flex-1">

          <div className="flex flex-wrap items-center justify-between gap-2">

            <div>

              <p className="text-sm font-bold text-slate-800">
                {shipment.product}
              </p>

              <p className="mt-1 text-[10px] text-slate-400">
                {shipment.id} · {shipment.company}
              </p>

            </div>

            <span className="rounded-full bg-blue-50 px-2 py-1 text-[9px] font-bold text-blue-600">
              {shipment.status}
            </span>

          </div>

          <div className="mt-4">

            <div className="mb-1.5 flex justify-between">

              <span className="text-[10px] font-medium text-slate-400">
                Progress
              </span>

              <span className="text-[10px] font-bold text-slate-600">
                {shipment.progress}%
              </span>

            </div>

            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">

              <div
                className="h-full rounded-full bg-[#173563]"
                style={{
                  width: `${shipment.progress}%`,
                }}
              />

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}


/* =========================================================
   INITIALS
========================================================= */

function getInitials(name) {
  if (!name) return "CA";

  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export default AgentDashboard;