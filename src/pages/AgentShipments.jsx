import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Package,
  Search,
} from "lucide-react";
import AgentMemberSidebar from "../components/AgentMemberSidebar";

/* =========================================================
   DEMO SHIPMENTS
========================================================= */

const demoShipments = [
  {
    id: "IMP-1024",
    company: "ABC Trading",
    product: "Electronic Components",
    origin: "China",
    destination: "Colombo",
    date: "2026-08-27",
    status: "In Progress",
    progress: 68,
  },
  {
    id: "IMP-1023",
    company: "Lanka Home Supplies",
    product: "Kitchen Equipment",
    origin: "India",
    destination: "Colombo",
    date: "2026-08-26",
    status: "Pending",
    progress: 0,
  },
  {
    id: "IMP-1022",
    company: "Global Merchants",
    product: "Electronic Goods",
    origin: "Singapore",
    destination: "Colombo",
    date: "2026-08-24",
    status: "In Progress",
    progress: 42,
  },
  {
    id: "IMP-1021",
    company: "Metro Supplies",
    product: "Industrial Equipment",
    origin: "Germany",
    destination: "Colombo",
    date: "2026-08-20",
    status: "Completed",
    progress: 100,
  },
  {
    id: "IMP-1020",
    company: "Island Retailers",
    product: "Textile Products",
    origin: "Vietnam",
    destination: "Colombo",
    date: "2026-08-18",
    status: "In Progress",
    progress: 76,
  },
  {
    id: "IMP-1019",
    company: "Prime Retail",
    product: "Home Appliances",
    origin: "India",
    destination: "Colombo",
    date: "2026-08-15",
    status: "Pending",
    progress: 0,
  },
];

/* =========================================================
   HELPERS
========================================================= */

function formatDate(date) {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

function AgentShipments() {
  const navigate = useNavigate();

  const [agent, setAgent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  /* =========================================================
     LOAD AGENCY MEMBER DATA
  ========================================================= */

  useEffect(() => {
    try {
      const storedAgent = localStorage.getItem("clearingAgent");

      if (!storedAgent) {
        navigate("/agent-signin", { replace: true });
        return;
      }

      const parsedAgent = JSON.parse(storedAgent);

      if (parsedAgent.agentType !== "agency-member") {
        navigate("/agent-signin", { replace: true });
        return;
      }

      setAgent(parsedAgent);
    } catch (error) {
      console.error(
        "Failed to load agency member data:",
        error
      );

      navigate("/agent-signin", { replace: true });
    }
  }, [navigate]);

  const agentName = agent?.fullName || "Agency Member";

  /* =========================================================
     SHIPMENT COUNTS
  ========================================================= */

  const totalShipments = demoShipments.length;

  const pendingShipments = demoShipments.filter(
    (shipment) => shipment.status === "Pending"
  ).length;

  const inProgressShipments = demoShipments.filter(
    (shipment) => shipment.status === "In Progress"
  ).length;

  const completedShipments = demoShipments.filter(
    (shipment) => shipment.status === "Completed"
  ).length;

  /* =========================================================
     SEARCH + FILTER
  ========================================================= */

  const filteredShipments = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return demoShipments.filter((shipment) => {
      const matchesStatus =
        statusFilter === "All" ||
        shipment.status === statusFilter;

      const searchableText = [
        shipment.id,
        shipment.company,
        shipment.product,
        shipment.origin,
        shipment.destination,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !search || searchableText.includes(search);

      return matchesStatus && matchesSearch;
    });
  }, [searchTerm, statusFilter]);

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-900">
      {/* =====================================================
          SHARED SIDEBAR
      ===================================================== */}

      <AgentMemberSidebar />

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="min-h-screen lg:ml-[270px]">
        {/* TOP BAR */}

        <header className="sticky top-0 z-30 flex h-[70px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                Agency Member Workspace
              </p>

              <h1 className="text-base font-bold text-slate-800">
                Shipments
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#2563EB]"
            >
              <Bell size={17} />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
            </button>
          </div>
        </header>

        {/* =====================================================
            CONTENT
        ===================================================== */}

        <div className="mx-auto max-w-[1180px] px-5 py-7 sm:px-8 lg:py-9">
          {/* BACK BUTTON */}

          <button
            type="button"
            onClick={() => navigate("/agent-dashboard")}
            className="mb-5 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition hover:text-[#173563]"
          >
            <ArrowLeft size={15} />
            Back to Dashboard
          </button>

          {/* PAGE HEADER */}

          <section className="mb-7">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5">
              <Package
                size={12}
                className="text-blue-600"
              />

              <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-blue-600">
                Agency Member Shipments
              </span>
            </div>

            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <h2 className="text-[32px] font-bold leading-tight tracking-[-0.04em] text-[#14213D] sm:text-[42px]">
                  My Shipments
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-[15px]">
                  View shipments assigned to you and
                  monitor their current progress.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("All");
                }}
                className="inline-flex w-fit items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-[#2563EB] hover:bg-blue-50 hover:text-[#2563EB]"
              >
                <Clock3 size={15} />
                Reset
              </button>
            </div>
          </section>

          {/* SUMMARY CARDS */}

          <section className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard
              icon={Package}
              label="Total Shipments"
              value={totalShipments}
              description="All assigned shipments"
              iconStyle="bg-blue-50 text-blue-600"
            />

            <SummaryCard
              icon={Clock3}
              label="Pending"
              value={pendingShipments}
              description="Awaiting processing"
              iconStyle="bg-amber-50 text-amber-700"
            />

            <SummaryCard
              icon={FileText}
              label="In Progress"
              value={inProgressShipments}
              description="Currently processing"
              iconStyle="bg-violet-50 text-violet-600"
            />

            <SummaryCard
              icon={CheckCircle2}
              label="Completed"
              value={completedShipments}
              description="Successfully completed"
              iconStyle="bg-emerald-50 text-emerald-700"
            />
          </section>

          {/* SEARCH / FILTER */}

          <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)]">
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(event.target.value)
                  }
                  placeholder="Search shipment, company or product..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-50"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-600 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-50"
              >
                <option value="All">
                  All Statuses
                </option>

                <option value="Pending">
                  Pending
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Completed">
                  Completed
                </option>
              </select>
            </div>
          </section>

          {/* SHIPMENT LIST */}

          <section>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#14213D]">
                  Assigned Shipments
                </h2>

                <p className="mt-1 text-[11px] text-slate-500">
                  {filteredShipments.length} shipment
                  {filteredShipments.length !== 1
                    ? "s"
                    : ""}{" "}
                  shown
                </p>
              </div>
            </div>

            {filteredShipments.length > 0 ? (
              <div className="space-y-3">
                {filteredShipments.map((shipment) => (
                  <ShipmentCard
                    key={shipment.id}
                    shipment={shipment}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                searchTerm={searchTerm}
                statusFilter={statusFilter}
              />
            )}
          </section>

          {/* FOOTER */}

          <div className="mt-9 flex items-center justify-center border-t border-slate-200 pt-6 text-center text-[10px] text-slate-400">
            ImportEase · Agency Member Platform
          </div>
        </div>
      </main>
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
  description,
  iconStyle,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)] transition hover:-translate-y-0.5 hover:border-blue-100 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold text-slate-400">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-800">
            {value}
          </p>

          <p className="mt-1 text-[10px] text-slate-400">
            {description}
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
   SHIPMENT CARD
========================================================= */

function ShipmentCard({ shipment }) {
  const statusStyles = {
    Pending: "bg-amber-50 text-amber-700",
    "In Progress": "bg-blue-50 text-blue-700",
    Completed: "bg-emerald-50 text-emerald-700",
  };

  const StatusIcon =
    shipment.status === "Completed"
      ? CheckCircle2
      : Clock3;

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)] transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/30 hover:shadow-md">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        {/* LEFT */}

        <div className="flex min-w-0 items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-100">
            <Package
              size={21}
              strokeWidth={1.8}
            />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-bold text-slate-800">
                {shipment.product}
              </h3>

              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-bold ${
                  statusStyles[shipment.status] ||
                  "bg-slate-100 text-slate-600"
                }`}
              >
                <StatusIcon size={10} />
                {shipment.status}
              </span>
            </div>

            <p className="mt-1 text-[10px] font-semibold text-slate-400">
              {shipment.id}
            </p>

            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[10px] text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <Building2 size={11} />
                {shipment.company}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <FileText size={11} />
                {shipment.origin} →{" "}
                {shipment.destination}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={11} />
                {formatDate(shipment.date)}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT / PROGRESS */}

        <div className="w-full lg:w-[230px]">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[10px] font-medium text-slate-400">
              Progress
            </span>

            <span className="text-[10px] font-bold text-slate-600">
              {shipment.progress}%
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-[#173563] transition-all duration-500"
              style={{
                width: `${shipment.progress}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({
  searchTerm,
  statusFilter,
}) {
  const hasFilter =
    searchTerm || statusFilter !== "All";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,.02)]">
      <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
          <Package size={22} />
        </div>

        <h3 className="mt-4 text-sm font-bold text-slate-700">
          {hasFilter
            ? "No shipments found"
            : "No shipments yet"}
        </h3>

        <p className="mt-1 max-w-sm text-[11px] leading-5 text-slate-400">
          {hasFilter
            ? "Try changing your search or status filter."
            : "Shipments assigned to you will appear here."}
        </p>
      </div>
    </div>
  );
}

export default AgentShipments;