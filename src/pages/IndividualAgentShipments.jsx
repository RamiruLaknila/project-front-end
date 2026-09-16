import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  CaretDown,
  CaretRight,
  CheckCircle,
  Clock,
  FileText,
  Package,
  ArrowsClockwise,
  MagnifyingGlass,
  Truck,
  Warning,
} from "@phosphor-icons/react";
import IndividualAgentSidebar from "../components/IndividualAgentSidebar";
import { api, ApiError } from "../lib/api";
import { STAGE_LABELS, STAGE_ORDER, isFinalStage, nextStage, stageIndex } from "../lib/shipmentStages";

function statusOf(shipment) {
  if (shipment.currentStage === "cargo_released") return "Completed";
  if (shipment.currentStage === "assigned") return "Pending";
  return "In Progress";
}

function IndividualAgentShipments() {
  const navigate = useNavigate();
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [expandedId, setExpandedId] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const data = await api.get("/shipments");
        if (!active) return;
        setShipments([...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        setError("");
      } catch (err) {
        if (active) {
          setError(err instanceof ApiError ? err.message : "Could not load shipments. Is the backend running?");
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [reloadKey]);

  const refresh = () => setReloadKey((key) => key + 1);

  const filteredShipments = useMemo(() => {
    return shipments.filter((shipment) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        !search ||
        shipment.description?.toLowerCase().includes(search) ||
        shipment.reference?.toLowerCase().includes(search) ||
        shipment.importerName?.toLowerCase().includes(search) ||
        shipment.destination?.toLowerCase().includes(search);

      const matchesStatus = statusFilter === "All" || statusOf(shipment) === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [shipments, searchTerm, statusFilter]);

  const activeShipments = shipments.filter((s) => s.currentStage !== "cargo_released").length;
  const completedShipments = shipments.filter((s) => s.currentStage === "cargo_released").length;
  const totalValue = shipments.reduce((sum, s) => sum + Number(s.feeLkr || 0), 0);

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-[#173563]">
      <IndividualAgentSidebar />

      <main className="min-h-screen pt-[68px] lg:ml-[260px] lg:pt-0">
        <header className="sticky top-[68px] z-30 flex h-[70px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:top-0">
          <div className="flex items-center">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
                Individual Agent Workspace
              </p>
              <h2 className="mt-0.5 text-base font-bold text-slate-800">My Shipments</h2>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              title="Refresh"
              onClick={refresh}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#2563EB]"
            >
              <ArrowsClockwise size={17} />
            </button>

            <button
              type="button"
              onClick={() => navigate("/individual-agent-notifications")}
              title="Notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#2563EB]"
            >
              <Bell size={17} />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#2563EB]" />
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-[1180px] px-5 py-7 sm:px-8 lg:py-9">
          <section className="mb-7">
            <h1 className="mt-1 text-[35px] font-bold tracking-[-0.04em] text-[#14213D] sm:text-[45px]">
              My Shipments
            </h1>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <p className="mt-2 max-w-2xl text-[14px] leading-6 text-slate-500 sm:text-[16px]">
                Manage shipments assigned to you as an independent clearing
                agent.
              </p>

              <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2.5">
                <Truck size={17} className="text-[#2563EB]" />
                <span className="text-sm font-semibold text-[#173563]">{activeShipments} Active</span>
              </div>
            </div>
          </section>

          <section className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <ShipmentStat icon={<Package size={19} />} label="Assigned Shipments" value={shipments.length} iconClass="bg-blue-50 text-[#2563EB]" />
            <ShipmentStat icon={<Clock size={19} />} label="Active Shipments" value={activeShipments} iconClass="bg-amber-50 text-amber-600" />
            <ShipmentStat icon={<CheckCircle size={19} />} label="Completed" value={completedShipments} iconClass="bg-emerald-50 text-emerald-600" />
            <ShipmentStat icon={<FileText size={19} />} label="Total Fee Value" value={`LKR ${totalValue.toLocaleString()}`} iconClass="bg-violet-50 text-violet-600" />
          </section>

          <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,.02)]">
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative flex-1">
                <MagnifyingGlass size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
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
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </section>

          {loading ? (
            <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#2563EB]" aria-label="Loading" />
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center text-[14px] font-semibold text-red-600">
              {error}
            </div>
          ) : filteredShipments.length > 0 ? (
            <section className="space-y-4">
              {filteredShipments.map((shipment) => (
                <ShipmentCard
                  key={shipment.id}
                  shipment={shipment}
                  expanded={expandedId === shipment.id}
                  onToggle={() => setExpandedId((current) => (current === shipment.id ? null : shipment.id))}
                  onAdvanced={refresh}
                />
              ))}
            </section>
          ) : (
            <section className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-[0_2px_10px_rgba(15,23,42,.02)]">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50">
                <Truck size={25} className="text-slate-400" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-[#173563]">No shipments found</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Accepted bids will appear here when an SME assigns a shipment
                to you.
              </p>
              <Link
                to="/individual-agent-bids"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#173563] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#10294d]"
              >
                View My Bids
                <CaretRight size={16} />
              </Link>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

/* ============================================================
   SHIPMENT CARD (collapsible, with a stage-advance control)
============================================================ */
function ShipmentCard({ shipment, expanded, onToggle, onAdvanced }) {
  const [advancing, setAdvancing] = useState(false);
  const [advanceError, setAdvanceError] = useState("");

  const currentIndex = stageIndex(shipment.currentStage);
  const upcoming = nextStage(shipment.currentStage);
  const final = isFinalStage(shipment.currentStage);
  const status = statusOf(shipment);

  const handleAdvance = async () => {
    if (!upcoming || advancing) return;
    setAdvancing(true);
    setAdvanceError("");
    try {
      await api.put(`/shipments/${shipment.id}/status`, { newStage: upcoming });
      onAdvanced();
    } catch (err) {
      setAdvanceError(err instanceof ApiError ? err.message : "Could not update this shipment's stage.");
    } finally {
      setAdvancing(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)] transition hover:-translate-y-0.5 hover:border-blue-100 hover:shadow-md sm:p-6">
      <button type="button" onClick={onToggle} className="flex w-full flex-col gap-5 text-left xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
            <Package size={21} />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold text-[#173563]">{shipment.description || "Shipment"}</h3>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-semibold ${
                  status === "Completed"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : status === "Pending"
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-blue-50 text-blue-700 border-blue-200"
                }`}
              >
                {status === "Completed" ? <CheckCircle size={14} /> : status === "Pending" ? <Clock size={14} /> : <Truck size={14} />}
                {status}
              </span>
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
              <span>{shipment.reference || shipment.id}</span>
              <span>•</span>
              <span>{shipment.importerName || "Importer"}</span>
              <span>•</span>
              <span>{shipment.hsCode ? `HS Code ${shipment.hsCode}` : "No HS code provided"}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm sm:grid-cols-4 xl:min-w-[540px]">
          <ShipmentDetail label="Destination" value={shipment.destination || "-"} />
          <ShipmentDetail label="Fee" value={`LKR ${Number(shipment.feeLkr || 0).toLocaleString()}`} highlight />
          <ShipmentDetail label="Timeline" value={shipment.clearanceTimelineHours ? `${shipment.clearanceTimelineHours}h` : "-"} />
          <ShipmentDetail label="Stage" value={STAGE_LABELS[shipment.currentStage]} />
        </div>

        <CaretDown size={18} className={`hidden shrink-0 text-slate-400 transition-transform xl:block ${expanded ? "rotate-180" : ""}`} />
      </button>

      <div className="mt-5 border-t border-slate-100 pt-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Shipment Progress</span>
          <span className="text-xs font-semibold text-[#2563EB]">
            {currentIndex + 1}/{STAGE_ORDER.length} · {STAGE_LABELS[shipment.currentStage]}
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-emerald-600 transition-all"
            style={{ width: `${((currentIndex + 1) / STAGE_ORDER.length) * 100}%` }}
          />
        </div>
      </div>

      {expanded && (
        <div className="mt-5 border-t border-slate-100 pt-4">
          <div className="flex flex-wrap items-center gap-2">
            {STAGE_ORDER.map((stage, index) => (
              <span key={stage} className="flex items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1.5 text-[11px] font-bold ${
                    index < currentIndex || (index === currentIndex && final)
                      ? "bg-emerald-50 text-emerald-700"
                      : index === currentIndex
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {STAGE_LABELS[stage]}
                </span>
                {index < STAGE_ORDER.length - 1 && <CaretRight size={12} className="text-slate-300" />}
              </span>
            ))}
          </div>

          {advanceError && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-600">
              <Warning size={15} />
              {advanceError}
            </div>
          )}

          <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-4">
            {final ? (
              <p className="text-[13px] font-semibold text-emerald-700">
                This shipment has completed clearance -- cargo has been released.
              </p>
            ) : (
              <>
                <p className="text-[13px] text-slate-600">
                  Next stage: <span className="font-bold text-slate-800">{STAGE_LABELS[upcoming]}</span>
                </p>
                <button
                  type="button"
                  onClick={handleAdvance}
                  disabled={advancing}
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#173563] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#10294d] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <CheckCircle size={15} />
                  {advancing ? "Updating..." : `Mark as ${STAGE_LABELS[upcoming]}`}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   SHIPMENT STAT
============================================================ */
function ShipmentStat({ icon, label, value, iconClass }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)] transition hover:-translate-y-0.5 hover:border-blue-100 hover:shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}>{icon}</div>
      </div>
      <p className="text-2xl font-bold tracking-tight text-[#173563]">{value}</p>
      <p className="mt-1 text-xs font-medium text-slate-400">{label}</p>
    </div>
  );
}

/* ============================================================
   SHIPMENT DETAIL
============================================================ */
function ShipmentDetail({ label, value, highlight = false }) {
  return (
    <div>
      <p className="text-[12px] font-medium text-slate-400">{label}</p>
      <p className={`mt-1 font-semibold ${highlight ? "text-[#173563]" : "text-slate-700"}`}>{value}</p>
    </div>
  );
}

export default IndividualAgentShipments;
