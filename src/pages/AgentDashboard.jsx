import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* =========================================================
     LOAD AGENT DATA
  ========================================================= */

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

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = () => {
    localStorage.removeItem("agentLoggedIn");
    navigate("/agent-signin");
  };

  /* =========================================================
     SME REQUESTS
  ========================================================= */

  const goToAgentRequests = () => {
    setSidebarOpen(false);
    navigate("/agent-requests");
  };

  /* =========================================================
     SHIPMENTS
  ========================================================= */

  const goToAgentShipments = () => {
    setSidebarOpen(false);
    navigate("/agent-shipments");
  };

  /* =========================================================
     MY BIDS
  ========================================================= */

  const goToMyBids = () => {
    setSidebarOpen(false);
    navigate("/agent-my-bids");
  };

  /* =========================================================
     PROFILE
  ========================================================= */

  const goToProfile = () => {
    setSidebarOpen(false);
    navigate("/profile");
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-900">
      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[250px] flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* LOGO */}

        <div className="flex h-[70px] items-center border-b border-slate-100 px-5">
          <Link
            to="/agent-dashboard"
            className="flex items-center gap-3"
            onClick={() => setSidebarOpen(false)}
          >
            <img
              src="/logo.jpeg"
              alt="ImportEase"
              className="h-9 w-9 object-contain mix-blend-multiply"
            />

            <div>
              <p className="text-[16px] font-bold tracking-tight text-[#173563]">
                Import
                <span className="text-slate-900">Ease</span>
              </p>

              <p className="text-[8px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                Agent Platform
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* AGENT MINI PROFILE */}

        <div className="border-b border-slate-100 p-4">
          <div className="rounded-xl bg-slate-50 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#173563] text-xs font-bold text-white">
                {getInitials(agentName)}
              </div>

              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-slate-800">
                  {agentName}
                </p>

                <div className="mt-0.5 flex items-center gap-1">
                  <CheckCircle2
                    size={11}
                    className="text-emerald-500"
                  />

                  <span className="text-[9px] font-semibold text-emerald-600">
                    Verified Agent
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}

        <nav className="flex-1 space-y-1 p-3">
          <SidebarItem
            icon={TrendingUp}
            label="Dashboard"
            active
            to="/agent-dashboard"
            onClick={() => setSidebarOpen(false)}
          />

          <SidebarItem
            icon={Search}
            label="SME Requests"
            to="/agent-requests"
            onClick={goToAgentRequests}
          />

          <SidebarItem
            icon={ClipboardList}
            label="My Bids"
            to="/agent-my-bids"
            onClick={goToMyBids}
          />

          {/* FIXED SHIPMENTS NAVIGATION */}
          <SidebarItem
            icon={Package}
            label="Shipments"
            to="/agent-shipments"
            onClick={() => setSidebarOpen(false)}
          />

          <div className="my-3 border-t border-slate-100" />

          <SidebarItem
            icon={User}
            label="My Profile"
            to="/profile"
            onClick={goToProfile}
          />
        </nav>

        {/* BOTTOM */}

        <div className="border-t border-slate-100 p-3">
          <SidebarItem
            icon={Settings}
            label="Settings"
            to="/settings"
            onClick={() => setSidebarOpen(false)}
          />

          <button
            type="button"
            onClick={handleLogout}
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </aside>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <div className="lg:ml-[250px]">
        {/* TOP BAR */}

        <header className="sticky top-0 z-30 flex h-[70px] items-center border-b border-slate-200 bg-white/95 px-5 backdrop-blur-xl sm:px-8">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="mr-3 flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <Menu size={19} />
          </button>

          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
              Agent Workspace
            </p>

            <h1 className="text-sm font-bold text-slate-800">
              Dashboard
            </h1>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <button
              type="button"
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
            >
              <Bell size={17} />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
            </button>

            <div className="hidden h-7 w-px bg-slate-200 sm:block" />

            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#173563] text-[10px] font-bold text-white">
                {getInitials(agentName)}
              </div>

              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-slate-800">
                  {agentName}
                </p>

                <p className="text-[9px] text-slate-400">
                  Individual Agent
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* =====================================================
            CONTENT
        ===================================================== */}

        <main className="mx-auto w-full max-w-[1180px] px-5 py-7 sm:px-8 lg:py-9">
          {/* HEADER / WELCOME */}

          <section className="mb-7">
            <div className="relative overflow-hidden rounded-2xl bg-[#173563] p-6 text-white shadow-lg sm:p-7">
              <div className="relative z-10">
                <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                  <div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5">
                      <CheckCircle2 size={13} />

                      <span className="text-[10px] font-bold uppercase tracking-[0.14em]">
                        Account Approved
                      </span>
                    </div>

                    <h2 className="text-[28px] font-bold tracking-[-0.04em] text-white sm:text-[36px]">
                      Welcome back, {firstName}
                    </h2>

                    <p className="mt-2 max-w-xl text-[13px] leading-6 text-blue-100 sm:text-sm">
                      Find new SME import requests, submit competitive bids
                      and manage your active clearing work from one place.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={goToAgentRequests}
                    className="inline-flex w-fit items-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-semibold text-[#173563] shadow-md transition hover:bg-blue-50"
                  >
                    <Search size={15} />
                    Browse Requests
                  </button>
                </div>
              </div>

              <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/5" />

              <div className="pointer-events-none absolute -bottom-24 right-24 h-48 w-48 rounded-full bg-blue-400/10" />
            </div>
          </section>

          {/* SUMMARY CARDS */}

          <section className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard
              icon={Search}
              label="New SME Requests"
              value="12"
              iconStyle="bg-blue-50 text-blue-600"
            />

            <SummaryCard
              icon={FileText}
              label="Active Bids"
              value="8"
              iconStyle="bg-violet-50 text-violet-600"
            />

            <SummaryCard
              icon={CheckCircle2}
              label="Won Requests"
              value="24"
              iconStyle="bg-emerald-50 text-emerald-600"
            />

            <SummaryCard
              icon={Package}
              label="Active Shipments"
              value="6"
              iconStyle="bg-amber-50 text-amber-600"
            />
          </section>

          {/* MAIN GRID */}

          <div className="mb-7 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
            {/* SME REQUESTS */}

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,.02)]">
              <div className="flex items-center justify-between border-b border-slate-100 p-5">
                <div>
                  <h2 className="text-sm font-bold text-[#14213D]">
                    New SME Requests
                  </h2>

                  <p className="mt-1 text-[11px] text-slate-500">
                    Import requests available for bidding.
                  </p>
                </div>

                <Link
                  to="/agent-requests"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#173563] hover:text-blue-700"
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
                    onClick={goToAgentRequests}
                  />
                ))}
              </div>
            </section>

            {/* QUICK ACTIONS */}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)]">
              <h2 className="text-sm font-bold text-[#14213D]">
                Quick Actions
              </h2>

              <p className="mt-1 text-[11px] text-slate-500">
                Frequently used agent tools.
              </p>

              <div className="mt-5 space-y-2.5">
                <QuickAction
                  icon={Search}
                  title="Browse SME Requests"
                  description="Find new import opportunities"
                  onClick={goToAgentRequests}
                  iconStyle="bg-blue-50 text-blue-600"
                />

                <QuickAction
                  icon={FileText}
                  title="View My Bids"
                  description="Track your submitted bids"
                  onClick={goToMyBids}
                  iconStyle="bg-violet-50 text-violet-600"
                />

                <QuickAction
                  icon={Package}
                  title="Manage Shipments"
                  description="View active clearing work"
                  onClick={goToAgentShipments}
                  iconStyle="bg-amber-50 text-amber-600"
                />

                <QuickAction
                  icon={User}
                  title="My Profile"
                  description="Manage your agent details"
                  onClick={goToProfile}
                  iconStyle="bg-emerald-50 text-emerald-600"
                />
              </div>
            </section>
          </div>

          {/* BIDS + SHIPMENTS */}

          <div className="mb-7 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* RECENT BIDS */}

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,.02)]">
              <div className="flex items-center justify-between border-b border-slate-100 p-5">
                <div>
                  <h2 className="text-sm font-bold text-[#14213D]">
                    Recent Bids
                  </h2>

                  <p className="mt-1 text-[11px] text-slate-500">
                    Latest bidding activity.
                  </p>
                </div>

                <Link
                  to="/agent-my-bids"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#173563] hover:text-blue-700"
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

            {/* ACTIVE SHIPMENTS */}

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,.02)]">
              <div className="flex items-center justify-between border-b border-slate-100 p-5">
                <div>
                  <h2 className="text-sm font-bold text-[#14213D]">
                    Active Shipments
                  </h2>

                  <p className="mt-1 text-[11px] text-slate-500">
                    Current clearing assignments.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={goToAgentShipments}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#173563] hover:text-blue-700"
                >
                  View all
                  <ChevronRight size={14} />
                </button>
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

          {/* VERIFICATION BANNER */}

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <ShieldCheck size={21} />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-sm font-bold text-slate-900">
                      Agent Verification
                    </h2>

                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-600">
                      VERIFIED
                    </span>
                  </div>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Your clearing agent application has been approved. You
                    can now participate in SME requests and bidding.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={goToProfile}
                className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                View Profile
                <ChevronRight size={14} />
              </button>
            </div>
          </section>

          {/* FOOTER */}

          <div className="mt-9 flex items-center justify-center border-t border-slate-200 pt-6 text-center text-[10px] text-slate-400">
            ImportEase · Individual Agent Platform
          </div>
        </main>
      </div>
    </div>
  );
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
  icon: Icon,
  label,
  value,
  iconStyle,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-semibold text-slate-400">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-800">
            {value}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconStyle}`}
        >
          <Icon
            size={18}
            strokeWidth={1.8}
          />
        </div>
      </div>
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
          {request.company} · {request.origin} →{" "}
          {request.destination}
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
  icon: Icon,
  title,
  description,
  onClick,
  iconStyle,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-xl border border-slate-100 p-3 text-left transition hover:border-slate-200 hover:bg-slate-50"
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconStyle}`}
      >
        <Icon
          size={17}
          strokeWidth={1.8}
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold text-slate-800">
          {title}
        </p>

        <p className="mt-0.5 text-[10px] text-slate-400">
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

function BidRow({ bid }) {
  const statusStyles = {
    Accepted: "bg-emerald-50 text-emerald-700",
    "Under Review": "bg-amber-50 text-amber-700",
    Submitted: "bg-blue-50 text-blue-700",
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
          className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[9px] font-semibold ${
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

function ShipmentRow({ shipment }) {
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

            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-semibold text-blue-700">
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
   SIDEBAR ITEM
========================================================= */

function SidebarItem({
  icon: Icon,
  label,
  to,
  active = false,
  onClick,
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
        active
          ? "bg-blue-50 text-[#173563]"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
      }`}
    >
      <Icon
        size={17}
        strokeWidth={1.8}
      />

      <span>{label}</span>
    </Link>
  );
}

/* =========================================================
   INITIALS
========================================================= */

function getInitials(name) {
  if (!name) return "CA";

  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 1) {
    return words[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return `${words[0][0]}${
    words[words.length - 1][0]
  }`.toUpperCase();
}

export default AgentDashboard;