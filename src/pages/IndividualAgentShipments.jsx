import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  Package,
  RefreshCw,
  Search,
  Truck,
} from "lucide-react";
import IndividualAgentSidebar from "../components/IndividualAgentSidebar";

function IndividualAgentShipments() {
  const [agentName, setAgentName] = useState("Individual Agent");
  const [shipments, setShipments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const savedAgent = localStorage.getItem("clearingAgent");

    if (savedAgent) {
      try {
        const parsedAgent = JSON.parse(savedAgent);

        setAgentName(
          parsedAgent.fullName ||
            parsedAgent.name ||
            parsedAgent.agentName ||
            "Individual Agent"
        );
      } catch {
        setAgentName(savedAgent || "Individual Agent");
      }
    }

    const savedBids = localStorage.getItem("individualAgentBids");

    if (savedBids) {
      try {
        const parsedBids = JSON.parse(savedBids);

        const acceptedBids = parsedBids
          .filter((bid) => bid.status === "Accepted")
          .map((bid, index) => ({
            id: `SHP-${String(index + 1).padStart(4, "0")}`,
            bidId: bid.id,
            requestId: bid.requestId,
            product: bid.product,
            category: bid.category,
            destination: bid.destination,
            requestValue: bid.requestValue,
            bidAmount: bid.bidAmount,
            estimatedDays: bid.estimatedDays,
            status: bid.shipmentStatus || "In Progress",
            submittedAt: bid.submittedAt,
          }));

        setShipments(acceptedBids);
      } catch {
        setShipments([]);
      }
    }
  }, []);

  const filteredShipments = useMemo(() => {
    return shipments.filter((shipment) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        shipment.product?.toLowerCase().includes(search) ||
        shipment.id?.toLowerCase().includes(search) ||
        shipment.requestId?.toLowerCase().includes(search) ||
        shipment.destination?.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "All" || shipment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [shipments, searchTerm, statusFilter]);

  const activeShipments = shipments.filter(
    (shipment) =>
      shipment.status === "In Progress" ||
      shipment.status === "Pending"
  ).length;

  const completedShipments = shipments.filter(
    (shipment) => shipment.status === "Completed"
  ).length;

  const totalValue = shipments.reduce(
    (sum, shipment) => sum + Number(shipment.bidAmount || 0),
    0
  );

  const getStatusStyle = (status) => {
    if (status === "Completed") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }

    if (status === "In Progress") {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }

    if (status === "Pending") {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }

    return "bg-slate-50 text-slate-600 border-slate-200";
  };

  const getStatusIcon = (status) => {
    if (status === "Completed") {
      return <CheckCircle2 size={14} />;
    }

    if (status === "In Progress") {
      return <Truck size={14} />;
    }

    return <Clock3 size={14} />;
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-[#173563]">
      {/* =====================================================
          SHARED SIDEBAR
      ===================================================== */}
      <IndividualAgentSidebar />

      {/* =====================================================
          MAIN
      ===================================================== */}
      <main className="min-h-screen lg:ml-[260px]">
        {/* =====================================================
            TOP HEADER
        ===================================================== */}
        <header className="sticky top-0 z-30 flex h-[70px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                Individual Agent Workspace
              </p>

              <h2 className="mt-0.5 text-base font-bold text-slate-800">
                My Shipments
              </h2>
            </div>
          </div>

          {/* Header Actions */}
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              title="Refresh"
              onClick={() => window.location.reload()}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#2563EB]"
            >
              <RefreshCw size={17} />
            </button>

            <button
              type="button"
              title="Notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#2563EB]"
            >
              <Bell size={17} />

              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#2563EB]" />
            </button>
          </div>
        </header>

        {/* =====================================================
            CONTENT
        ===================================================== */}
        <div className="mx-auto max-w-[1180px] px-5 py-7 sm:px-8 lg:py-9">
          {/* TITLE */}
          <section className="mb-7">
            <p className="text-sm font-semibold text-[#2563EB]">
              Manage your shipments
            </p>

            <h1 className="mt-1 text-[32px] font-bold tracking-[-0.04em] text-[#14213D] sm:text-[42px]">
              My Shipments
            </h1>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-[15px]">
                Manage shipments assigned to you as an independent clearing
                agent.
              </p>

              <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2.5">
                <Truck size={17} className="text-[#2563EB]" />

                <span className="text-sm font-semibold text-[#173563]">
                  {activeShipments} Active
                </span>
              </div>
            </div>
          </section>

          {/* =====================================================
              STATS
          ===================================================== */}
          <section className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <ShipmentStat
              icon={<Package size={19} />}
              label="Assigned Shipments"
              value={shipments.length}
              iconClass="bg-blue-50 text-[#2563EB]"
            />

            <ShipmentStat
              icon={<Clock3 size={19} />}
              label="Active Shipments"
              value={activeShipments}
              iconClass="bg-amber-50 text-amber-600"
            />

            <ShipmentStat
              icon={<CheckCircle2 size={19} />}
              label="Completed"
              value={completedShipments}
              iconClass="bg-emerald-50 text-emerald-600"
            />

            <ShipmentStat
              icon={<FileText size={19} />}
              label="Total Bid Value"
              value={`LKR ${totalValue.toLocaleString()}`}
              iconClass="bg-violet-50 text-violet-600"
            />
          </section>

          {/* =====================================================
              FILTERS
          ===================================================== */}
          <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,.02)]">
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative flex-1">
                <Search
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search shipments..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-600 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
              >
                <option value="All">All Status</option>
                <option value="In Progress">In Progress</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </section>

          {/* =====================================================
              SHIPMENT LIST
          ===================================================== */}
          {filteredShipments.length > 0 ? (
            <section className="space-y-4">
              {filteredShipments.map((shipment) => (
                <div
                  key={shipment.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)] transition hover:-translate-y-0.5 hover:border-blue-100 hover:shadow-md sm:p-6"
                >
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                    {/* LEFT */}
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
                        <Package size={21} />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-bold text-[#173563]">
                            {shipment.product}
                          </h3>

                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getStatusStyle(
                              shipment.status
                            )}`}
                          >
                            {getStatusIcon(shipment.status)}
                            {shipment.status}
                          </span>
                        </div>

                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                          <span>{shipment.id}</span>

                          <span>•</span>

                          <span>Request {shipment.requestId}</span>

                          <span>•</span>

                          <span>{shipment.category}</span>
                        </div>
                      </div>
                    </div>

                    {/* DETAILS */}
                    <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm sm:grid-cols-4 xl:min-w-[540px]">
                      <ShipmentDetail
                        label="Destination"
                        value={shipment.destination}
                      />

                      <ShipmentDetail
                        label="Bid Amount"
                        value={`LKR ${Number(
                          shipment.bidAmount || 0
                        ).toLocaleString()}`}
                        highlight
                      />

                      <ShipmentDetail
                        label="Estimated Time"
                        value={`${shipment.estimatedDays} days`}
                      />

                      <ShipmentDetail
                        label="Assigned"
                        value={shipment.submittedAt || "Recently"}
                      />
                    </div>

                    {/* ACTION */}
                    <button
                      type="button"
                      onClick={() =>
                        alert(
                          `Shipment ${shipment.id} selected. Detailed shipment tracking can be added next.`
                        )
                      }
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#173563] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#10294d]"
                    >
                      View Shipment
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  {/* PROGRESS */}
                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-500">
                        Shipment Progress
                      </span>

                      <span className="text-xs font-semibold text-[#2563EB]">
                        {shipment.status === "Completed"
                          ? "100%"
                          : shipment.status === "Pending"
                          ? "10%"
                          : "50%"}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-[#2563EB] transition-all"
                        style={{
                          width:
                            shipment.status === "Completed"
                              ? "100%"
                              : shipment.status === "Pending"
                              ? "10%"
                              : "50%",
                        }}
                      />
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Assigned</span>
                      <span>Clearance</span>
                      <span>Completed</span>
                    </div>
                  </div>
                </div>
              ))}
            </section>
          ) : (
            /* =====================================================
               EMPTY STATE
            ===================================================== */
            <section className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-[0_2px_10px_rgba(15,23,42,.02)]">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50">
                <Truck size={25} className="text-slate-400" />
              </div>

              <h3 className="mt-5 text-lg font-bold text-[#173563]">
                No shipments found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Accepted bids will appear here when an SME assigns a shipment
                to you.
              </p>

              <Link
                to="/individual-agent-bids"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#173563] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#10294d]"
              >
                View My Bids
                <ChevronRight size={16} />
              </Link>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

/* ============================================================
   SHIPMENT STAT
============================================================ */
function ShipmentStat({
  icon,
  label,
  value,
  iconClass,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)] transition hover:-translate-y-0.5 hover:border-blue-100 hover:shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>
      </div>

      <p className="text-2xl font-bold tracking-tight text-[#173563]">
        {value}
      </p>

      <p className="mt-1 text-xs font-medium text-slate-400">
        {label}
      </p>
    </div>
  );
}

/* ============================================================
   SHIPMENT DETAIL
============================================================ */
function ShipmentDetail({
  label,
  value,
  highlight = false,
}) {
  return (
    <div>
      <p className="text-[11px] font-medium text-slate-400">
        {label}
      </p>

      <p
        className={`mt-1 font-semibold ${
          highlight ? "text-[#173563]" : "text-slate-700"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export default IndividualAgentShipments;