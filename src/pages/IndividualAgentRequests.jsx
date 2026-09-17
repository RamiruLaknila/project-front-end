import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Briefcase,
  CheckCircle,
  CaretRight,
  MapPin,
  Package,
  ArrowsClockwise,
  MagnifyingGlass,
  Warning,
  X,
} from "@phosphor-icons/react";
import IndividualAgentSidebar from "../components/IndividualAgentSidebar";
import { api, ApiError } from "../lib/api";

function timeAgo(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Recently";
  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? "" : "s"} ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} hour${diffHour === 1 ? "" : "s"} ago`;
  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay} day${diffDay === 1 ? "" : "s"} ago`;
}

function IndividualAgentRequests() {
  const navigate = useNavigate();

  const [tenders, setTenders] = useState([]);
  const [myBids, setMyBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const [openTenders, mine] = await Promise.all([
          api.get("/tenders?status=open"),
          api.get("/bids/mine"),
        ]);
        if (!active) return;
        setTenders(openTenders);
        setMyBids(mine);
      } catch (err) {
        if (active) {
          setLoadError(
            err instanceof ApiError ? err.message : "Could not load SME requests. Is the backend running?"
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [reloadKey]);

  const bidTenderIds = useMemo(() => new Set(myBids.map((bid) => bid.tenderId)), [myBids]);

  const filteredTenders = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    if (!search) return tenders;
    return tenders.filter((tender) =>
      [tender.description, tender.origin, tender.port, tender.hsCode]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(search))
    );
  }, [tenders, searchTerm]);

  const handleRefresh = () => {
    setLoading(true);
    setLoadError("");
    setReloadKey((key) => key + 1);
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-[#173563]">
      <IndividualAgentSidebar />

      <div className="min-h-screen">
        <main className="min-h-screen pt-[68px] lg:ml-[260px] lg:pt-0">
          <header className="sticky top-[68px] z-30 flex h-[70px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:top-0">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
                Individual Agent Workspace
              </p>
              <h1 className="mt-0.5 text-base font-bold text-slate-800">SME Requests</h1>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={handleRefresh}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#2563EB]"
                title="Refresh"
              >
                <ArrowsClockwise size={17} />
              </button>

              <button
                type="button"
                onClick={() => navigate("/individual-agent-notifications")}
                className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#2563EB]"
                title="Notifications"
              >
                <Bell size={17} />
              </button>
            </div>
          </header>

          <div className="mx-auto max-w-[1180px] px-5 py-7 sm:px-8 lg:py-9">
            <section className="mb-7">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                  <h2 className="mt-1 text-[35px] font-bold tracking-[-0.04em] text-[#14213D] sm:text-[45px]">
                    SME Import Requests
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-[16px]">
                    Browse import requests from SMEs and submit competitive clearing
                    service bids.
                  </p>
                </div>

                <div className="flex w-fit items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#2563EB] shadow-sm">
                    <CheckCircle size={18} />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-500">
                      Open Requests
                    </p>
                    <p className="text-lg font-bold text-[#173563]">{filteredTenders.length}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,.02)] sm:p-5">
              <div className="relative">
                <MagnifyingGlass
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search by product, HS code, origin or port..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-11 text-sm text-[#173563] outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-50"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            </section>

            <div className="mt-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#173563]">Available Requests</p>
                <p className="mt-0.5 text-xs text-slate-400">
                  Showing {filteredTenders.length} of {tenders.length} requests
                </p>
              </div>
            </div>

            <section className="mt-4 space-y-4">
              {loading ? (
                <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white py-16">
                  <div
                    className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#2563EB]"
                    aria-label="Loading"
                  />
                </div>
              ) : loadError ? (
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center">
                  <Warning size={24} className="text-slate-300" />
                  <p className="text-sm font-semibold text-slate-700">{loadError}</p>
                  <button
                    type="button"
                    onClick={handleRefresh}
                    className="inline-flex h-9 items-center justify-center rounded-xl bg-[#173563] px-4 text-[13px] font-semibold text-white transition hover:bg-[#10294d]"
                  >
                    Try again
                  </button>
                </div>
              ) : filteredTenders.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-[0_2px_10px_rgba(15,23,42,.02)]">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    <MagnifyingGlass size={20} />
                  </div>
                  <h3 className="mt-4 text-sm font-bold text-[#173563]">No requests found</h3>
                  <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-400">
                    Try a different search, or check back later for new SME requests.
                  </p>
                </div>
              ) : (
                filteredTenders.map((tender) => (
                  <RequestCard
                    key={tender.id}
                    tender={tender}
                    alreadyBid={bidTenderIds.has(tender.id)}
                    navigate={navigate}
                  />
                ))
              )}
            </section>

            <footer className="mt-10 border-t border-slate-200 pt-5">
              <div className="flex flex-col gap-2 text-[12px] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                <p>© {new Date().getFullYear()} ImportEase. All rights reserved.</p>
                <p>Individual Agent Workspace</p>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}

function RequestCard({ tender, alreadyBid, navigate }) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)] transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/20 hover:shadow-md sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB] transition group-hover:bg-blue-100">
            <Package size={21} />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold text-[#173563]">
                {tender.description || "Shipment request"}
              </h3>
              {tender.targetAgencyId && (
                <span className="rounded-full bg-purple-50 px-2.5 py-1 text-[11px] font-semibold text-purple-700">
                  Direct Request
                </span>
              )}
              <span className="rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-600">
                Open
              </span>
            </div>
            <p className="mt-1 text-xs font-medium text-slate-400">
              {tender.hsCode ? `HS Code ${tender.hsCode}` : "No HS code provided"} • Posted {timeAgo(tender.postedAt)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 border-t border-slate-100 pt-5 sm:grid-cols-2 lg:grid-cols-4">
        <DetailItem icon={<MapPin size={15} />} label="Destination" value={tender.port || "Not specified"} />
        <DetailItem
          icon={<Briefcase size={15} />}
          label="CIF Value"
          value={`USD ${Number(tender.declaredValue || 0).toLocaleString()}`}
        />
        <DetailItem
          icon={<Package size={15} />}
          label="Origin"
          value={tender.origin || "Not specified"}
        />
        <DetailItem
          icon={<CheckCircle size={15} />}
          label="Must release by"
          value={tender.mustReleaseBy || "Not specified"}
        />
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-end">
        {alreadyBid ? (
          <span className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-600">
            <CheckCircle size={15} />
            Bid Submitted
          </span>
        ) : (
          <button
            type="button"
            onClick={() => navigate("/individual-agent-bids", { state: { request: tender } })}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173563] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#10294d]"
          >
            Submit Bid
            <CaretRight size={15} />
          </button>
        )}
      </div>
    </div>
  );
}

function DetailItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-slate-400">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-medium text-slate-400">{label}</p>
        <p className="mt-0.5 truncate text-xs font-semibold text-[#173563]">{value}</p>
      </div>
    </div>
  );
}

export default IndividualAgentRequests;
