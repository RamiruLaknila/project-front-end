import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  CheckCircle,
  CaretRight,
  CurrencyDollar,
  FileText,
  Package,
  ArrowsClockwise,
  MagnifyingGlass,
  TrendUp,
  User,
} from "@phosphor-icons/react";
import AgentMemberSidebar from "../components/AgentMemberSidebar";
import { api } from "../lib/api";

function timeAgo(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? "" : "s"} ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} hour${diffHour === 1 ? "" : "s"} ago`;
  const diffDay = Math.floor(diffHour / 24);
  return diffDay === 1 ? "Yesterday" : `${diffDay} days ago`;
}

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

  const [openTenders, setOpenTenders] = useState([]);
  const [myBids, setMyBids] = useState([]);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const [tenders, bids] = await Promise.all([
          api.get("/tenders?status=open"),
          api.get("/bids/mine"),
        ]);
        if (!active) return;
        setOpenTenders(tenders);
        setMyBids(bids);
      } catch {
        /* Dashboard widgets just stay empty -- Marketplace/My Bids show the real error. */
      }
    })();

    return () => {
      active = false;
    };
  }, [reloadKey]);

  const recentTenders = useMemo(
    () =>
      [...openTenders]
        .sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt))
        .slice(0, 3),
    [openTenders]
  );

  const recentBids = useMemo(
    () =>
      [...myBids]
        .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
        .slice(0, 3),
    [myBids]
  );

  const activeBidsCount = myBids.filter((bid) => bid.status === "pending").length;
  const wonBidsCount = myBids.filter((bid) => bid.status === "accepted").length;

  const handleRefresh = () => {
    setRefreshing(true);
    setReloadKey((key) => key + 1);

    window.setTimeout(() => {
      setRefreshing(false);
    }, 700);
  };

  const goToMarketplace = () => {
    navigate("/agent-marketplace");
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
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
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
              <ArrowsClockwise
                size={17}
                className={refreshing ? "animate-spin" : ""}
              />
            </button>

            <button
              type="button"
              onClick={() => navigate("/agent-notifications")}
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

                <h2 className="text-[35px] font-bold tracking-[-0.04em] text-[#14213D] sm:text-[45px]">
                  Welcome back, {firstName}
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-[16px]">
                  Manage SME import requests, submit competitive bids and
                  track your assigned clearing work from your agency
                  workspace.
                </p>
              </div>

              <button
                type="button"
                onClick={goToMarketplace}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173563] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#10294d]"
              >
                <MagnifyingGlass size={17} />
                Browse Requests
              </button>
            </div>
          </section>

          <section className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard
              icon={MagnifyingGlass}
              label="Open SME Requests"
              value={String(openTenders.length)}
              iconStyle="bg-blue-50 text-blue-600"
            />

            <SummaryCard
              icon={FileText}
              label="Active Bids"
              value={String(activeBidsCount)}
              iconStyle="bg-violet-50 text-violet-600"
            />

            <SummaryCard
              icon={CheckCircle}
              label="Won Requests"
              value={String(wonBidsCount)}
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
                  to="/agent-marketplace"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#173563] hover:text-blue-700"
                >
                  View all
                  <CaretRight size={15} />
                </Link>
              </div>

              <div className="divide-y divide-slate-100">
                {recentTenders.length === 0 ? (
                  <p className="px-5 py-8 text-center text-sm text-slate-400">No open requests right now.</p>
                ) : (
                  recentTenders.map((tender) => (
                    <RequestRow key={tender.id} tender={tender} onClick={goToMarketplace} />
                  ))
                )}
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
                  icon={MagnifyingGlass}
                  title="Browse SME Requests"
                  description="Find new import opportunities"
                  onClick={goToMarketplace}
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
                  <CaretRight size={15} />
                </Link>
              </div>

              <div className="divide-y divide-slate-100">
                {recentBids.length === 0 ? (
                  <p className="px-5 py-8 text-center text-sm text-slate-400">No bids submitted yet.</p>
                ) : (
                  recentBids.map((bid) => <BidRow key={bid.id} bid={bid} />)
                )}
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
                  <CaretRight size={15} />
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

          <div className="mt-9 flex items-center justify-center border-t border-slate-200 pt-6 text-center text-[11px] text-slate-400">
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
          <p className="text-[11px] font-semibold text-slate-400">
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
          />
        </div>
      </div>
    </div>
  );
}

function RequestRow({ tender, onClick }) {
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
          <p className="truncate text-sm font-bold text-slate-800">
            {tender.description || "Shipment request"}
          </p>

          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600">
            OPEN
          </span>
        </div>

        <p className="mt-1 text-xs text-slate-500">
          {tender.hsCode ? `HS Code ${tender.hsCode}` : "No HS code provided"} · {tender.origin || "-"} → {tender.port || "-"}
        </p>

        <p className="mt-1 text-[11px] text-slate-400">Posted {timeAgo(tender.postedAt)}</p>
      </div>

      <div className="hidden text-right sm:block">
        <p className="text-xs font-bold text-slate-700">
          USD {Number(tender.declaredValue || 0).toLocaleString()}
        </p>

        <p className="mt-1 text-[11px] text-slate-400">CIF value</p>
      </div>

      <CaretRight
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
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold text-slate-800">
          {title}
        </p>

        <p className="mt-0.5 text-[11px] text-slate-400">
          {description}
        </p>
      </div>

      <CaretRight
        size={15}
        className="text-slate-300 transition group-hover:translate-x-1"
      />
    </button>
  );
}

function BidRow({ bid }) {
  const statusStyles = {
    accepted: "bg-emerald-50 text-emerald-700",
    pending: "bg-amber-50 text-amber-700",
    rejected: "bg-red-50 text-red-600",
  };
  const statusLabel = {
    accepted: "Accepted",
    pending: "Under Review",
    rejected: "Rejected",
  };

  return (
    <div className="flex items-center gap-4 p-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
        <CurrencyDollar size={19} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-slate-800">Tender {bid.tenderId}</p>

        <p className="mt-1 text-[11px] text-slate-400">{bid.clearanceTimelineHours} hours clearance</p>
      </div>

      <div className="text-right">
        <p className="text-xs font-bold text-slate-700">Rs. {Number(bid.feeLkr || 0).toLocaleString()}</p>

        <span
          className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
            statusStyles[bid.status] || "bg-slate-100 text-slate-500"
          }`}
        >
          {statusLabel[bid.status] || bid.status}
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

              <p className="mt-1 text-[11px] text-slate-400">
                {shipment.id} · {shipment.company}
              </p>
            </div>

            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
              {shipment.status}
            </span>
          </div>

          <div className="mt-4">
            <div className="mb-1.5 flex justify-between">
              <span className="text-[11px] font-medium text-slate-400">
                Progress
              </span>

              <span className="text-[11px] font-bold text-slate-600">
                {shipment.progress}%
              </span>
            </div>

            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-emerald-600"
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