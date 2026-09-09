import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  CheckCircle2,
  ChevronRight,
  DollarSign,
  FileText,
  Package,
  RefreshCw,
  Search,
  TrendingUp,
  User,
} from "lucide-react";
import AgentMemberSidebar from "../components/AgentMemberSidebar";

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
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    try {
      const storedAgent = localStorage.getItem("clearingAgent");

      if (!storedAgent) {
        navigate("/agent-signin", {
          replace: true,
        });

        return;
      }

      const parsedAgent = JSON.parse(storedAgent);

      if (parsedAgent.agentType !== "agency-member") {
        navigate("/agent-signin", {
          replace: true,
        });

        return;
      }

      setAgent(parsedAgent);
    } catch (error) {
      console.error("Failed to load agency member data:", error);

      navigate("/agent-signin", {
        replace: true,
      });
    }
  }, [navigate]);

  const agentName = agent?.fullName || "Agency Member";

  const firstName = useMemo(() => {
    return agentName.split(" ")[0];
  }, [agentName]);

  const handleRefresh = () => {
    setRefreshing(true);

    window.setTimeout(() => {
      setRefreshing(false);
    }, 700);
  };

  const goToAgentRequests = () => {
    navigate("/agent-requests");
  };

  const goToAgentShipments = () => {
    navigate("/agent-shipments");
  };

  const goToMyBids = () => {
    navigate("/agent-my-bids");
  };

  const goToProfile = () => {
    navigate("/profile");
  };

  const goToSettings = () => {
    navigate("/settings");
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-900">
      <AgentMemberSidebar />

<main className="min-h-screen pt-[68px] lg:ml-[260px] lg:pt-0 border-l border-slate-200 lg:border-l-0">        <header className="sticky top-0 z-30 flex h-[70px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                Agency Member Workspace
              </p>

              <h1 className="text-base font-bold text-slate-800">
                Dashboard
              </h1>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
              aria-label="Refresh dashboard"
            >
              <RefreshCw
                size={17}
                className={refreshing ? "animate-spin" : ""}
              />
            </button>

            <button
              type="button"
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
              aria-label="Notifications"
            >
              <Bell size={17} />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-[1180px] px-5 py-7 sm:px-8 lg:py-9">
          <section className="mb-7">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  
                 
                </div>

                <h2 className="text-[32px] font-bold tracking-[-0.04em] text-[#14213D] sm:text-[42px]">
                  Welcome back, {firstName}
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-[15px]">
                  Manage SME import requests, submit competitive bids and
                  track your assigned clearing work from your agency
                  workspace.
                </p>
              </div>

              <button
                type="button"
                onClick={goToAgentRequests}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173563] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#10294d]"
              >
                <Search size={17} />
                Browse Requests
              </button>
            </div>
          </section>

          <section className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

          <div className="mb-7 grid grid-cols-1 gap-5 xl:grid-cols-[1fr_350px]">
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,.02)]">
              <div className="flex items-center justify-between border-b border-slate-100 p-5">
                <div>
                  <h2 className="text-base font-bold text-[#14213D]">
                    New SME Requests
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Import requests available for bidding.
                  </p>
                </div>

                <Link
                  to="/agent-requests"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#173563] hover:text-blue-700"
                >
                  View all
                  <ChevronRight size={15} />
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

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)]">
              <h2 className="text-base font-bold text-[#14213D]">
                Quick Actions
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Frequently used agency member tools.
              </p>

              <div className="mt-5 space-y-2">
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

          <div className="mb-7 grid grid-cols-1 gap-5 lg:grid-cols-2">
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,.02)]">
              <div className="flex items-center justify-between border-b border-slate-100 p-5">
                <div>
                  <h2 className="text-base font-bold text-[#14213D]">
                    Recent Bids
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Latest bidding activity.
                  </p>
                </div>

                <Link
                  to="/agent-my-bids"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#173563] hover:text-blue-700"
                >
                  View all
                  <ChevronRight size={15} />
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

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,.02)]">
              <div className="flex items-center justify-between border-b border-slate-100 p-5">
                <div>
                  <h2 className="text-base font-bold text-[#14213D]">
                    Active Shipments
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Current clearing assignments.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={goToAgentShipments}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#173563] hover:text-blue-700"
                >
                  View all
                  <ChevronRight size={15} />
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

          <div className="mt-9 flex items-center justify-center border-t border-slate-200 pt-6 text-center text-[10px] text-slate-400">
            ImportEase · Agency Member Platform
          </div>
        </div>
      </main>
    </div>
  );
}

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
            size={19}
            strokeWidth={1.8}
          />
        </div>
      </div>
    </div>
  );
}

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
        <Package size={19} />
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

function BidRow({ bid }) {
  const statusStyles = {
    Accepted: "bg-emerald-50 text-emerald-700",
    "Under Review": "bg-amber-50 text-amber-700",
    Submitted: "bg-blue-50 text-blue-700",
  };

  return (
    <div className="flex items-center gap-4 p-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
        <DollarSign size={19} />
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
            statusStyles[bid.status] || "bg-slate-100 text-slate-500"
          }`}
        >
          {bid.status}
        </span>
      </div>
    </div>
  );
}

function ShipmentRow({ shipment }) {
  return (
    <div className="p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
          <Package size={19} />
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

export default AgentDashboard;