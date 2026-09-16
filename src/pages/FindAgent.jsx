import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Buildings,
  CalendarBlank,
  CaretDown,
  CheckCircle,
  Clock,
  CurrencyDollar,
  EnvelopeSimple,
  Globe,
  MapPin,
  Package,
  PaperPlaneTilt,
  Phone,
  ShieldCheck,
  Star,
  Trash,
  UserCircle,
  Warning,
  X,
} from "@phosphor-icons/react";

import AppNavbar from "../components/ui/AppNavbar";
import { useAuth } from "../context/AuthContext";
import { api, ApiError } from "../lib/api";

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
  return `${diffDay} day${diffDay === 1 ? "" : "s"} ago`;
}

function formatTimeline(hours) {
  const n = Number(hours);
  if (!n) return "";
  if (n < 24) return `${n} hour${n === 1 ? "" : "s"}`;
  const days = Math.round((n / 24) * 10) / 10;
  return `${n} hours (~${days} day${days === 1 ? "" : "s"})`;
}

const emptyForm = {
  description: "",
  cifValue: "",
  origin: "",
  destination: "",
  estimatedArrival: "",
  mustReleaseBy: "",
  contactPhone: "",
  contactEmail: "",
};

function FindAgent() {
  const { user } = useAuth();

  /* =========================================================
     HS CODE CARRIED OVER FROM THE CALCULATOR (only needed to post a
     NEW request -- existing requests already have their own hsCode).
  ========================================================= */

  const [importData] = useState(() => {
    try {
      const saved = localStorage.getItem("currentImport");
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      return parsed.hsCode ? parsed : null;
    } catch {
      return null;
    }
  });

  const [codeDetail, setCodeDetail] = useState(null);

  useEffect(() => {
    if (!importData?.hsCode) return;
    let active = true;

    (async () => {
      try {
        const detail = await api.get(`/hscodes/${encodeURIComponent(importData.hsCode)}`, { auth: false });
        if (active) setCodeDetail(detail);
      } catch {
        /* Non-critical -- the form still works with the localStorage snapshot. */
      }
    })();

    return () => {
      active = false;
    };
  }, [importData?.hsCode]);

  const hsCodeDescription = codeDetail?.description || importData?.hsCodeTitle || "";
  const hsCodeChapter = codeDetail?.chapterTitle || importData?.hsCodeCategory || "";

  // The calculator's HS code is only a convenience carry-over -- an SME can
  // remove it for this particular request without it coming back (it stays
  // gone until they cancel the form or post it) rather than it being
  // permanently stuck on every new request until they clear localStorage.
  const [hsCodeRemoved, setHsCodeRemoved] = useState(false);
  const effectiveHsCode = hsCodeRemoved ? null : importData?.hsCode || null;

  /* =========================================================
     PAGE MODE: browsing your requests, posting a new one, or
     browsing the agent directory to send a direct request
  ========================================================= */

  const [mode, setMode] = useState("list"); // "list" | "form" | "browse"
  const [targetAgency, setTargetAgency] = useState(null); // {id, companyName} when posting a direct request

  // Deep-linked from a "new_bid" notification -- ?tenderId=... jumps straight
  // to that request, expanded, once the list has loaded.
  const [searchParams] = useSearchParams();
  const linkedTenderId = searchParams.get("tenderId");

  /* =========================================================
     YOUR REQUESTS (all of the SME's own tenders, open + closed)
  ========================================================= */

  const [tenders, setTenders] = useState([]);
  const [tendersLoading, setTendersLoading] = useState(true);
  const [tendersError, setTendersError] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const data = await api.get("/tenders?mine=true");
        if (!active) return;
        setTenders([...data].sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt)));
        setTendersError("");
      } catch (err) {
        if (active) {
          setTendersError(err instanceof ApiError ? err.message : "Could not load your requests.");
        }
      } finally {
        if (active) setTendersLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [reloadKey]);

  useEffect(() => {
    if (!linkedTenderId || tenders.length === 0) return undefined;
    if (!tenders.some((tender) => tender.id === linkedTenderId)) return undefined;

    const timer = setTimeout(() => {
      setMode("list");
      setExpandedId(linkedTenderId);
    }, 0);
    return () => clearTimeout(timer);
  }, [linkedTenderId, tenders]);

  const refreshTenders = () => setReloadKey((key) => key + 1);

  /* =========================================================
     REQUEST FORM
  ========================================================= */

  const [form, setForm] = useState(emptyForm);

  // Prefill contact details from the signed-in profile once it loads, without
  // clobbering anything the user has already typed.
  useEffect(() => {
    if (!user) return;
    const timer = setTimeout(() => {
      setForm((prev) => ({
        ...prev,
        contactPhone: prev.contactPhone || user.phone || "",
        contactEmail: prev.contactEmail || user.email || "",
      }));
    }, 0);
    return () => clearTimeout(timer);
  }, [user]);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState("");

  const openNewRequestForm = () => {
    setTargetAgency(null);
    setHsCodeRemoved(false);
    setPostError("");
    setMode("form");
  };

  const cancelForm = () => {
    setMode("list");
    setTargetAgency(null);
    setHsCodeRemoved(false);
    setPostError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setPostError("");

    const cifNumber = Number(form.cifValue);

    if (!form.description.trim()) {
      setPostError("Please describe what you're importing.");
      return;
    }
    if (!cifNumber || cifNumber <= 0) {
      setPostError("Enter a valid CIF value.");
      return;
    }
    if (!form.origin.trim()) {
      setPostError("Please enter the country of origin.");
      return;
    }
    if (!form.destination.trim()) {
      setPostError("Please enter the destination port.");
      return;
    }
    if (!form.estimatedArrival) {
      setPostError("Please select the estimated arrival date.");
      return;
    }
    if (!form.mustReleaseBy) {
      setPostError("Please select the latest date the shipment must be released by.");
      return;
    }
    if (form.mustReleaseBy < form.estimatedArrival) {
      setPostError("The release deadline can't be earlier than the estimated arrival date.");
      return;
    }
    if (!form.contactPhone.trim()) {
      setPostError("Please enter a contact phone number.");
      return;
    }
    if (!form.contactEmail.trim()) {
      setPostError("Please enter a contact email.");
      return;
    }

    setPosting(true);
    try {
      const shipment = await api.post("/shipments", {
        origin: form.origin.trim(),
        destination: form.destination.trim(),
        hsCode: effectiveHsCode,
        declaredValue: cifNumber,
        description: form.description.trim(),
        estimatedArrival: form.estimatedArrival,
        mustReleaseBy: form.mustReleaseBy,
        contactPhone: form.contactPhone.trim(),
        contactEmail: form.contactEmail.trim(),
      });

      await api.post(
        `/shipments/${shipment.id}/tender`,
        targetAgency ? { targetAgencyId: targetAgency.id } : undefined
      );

      setForm(emptyForm);
      setTargetAgency(null);
      setHsCodeRemoved(false);
      setMode("list");
      refreshTenders();
    } catch (err) {
      setPostError(
        err instanceof ApiError ? err.message : "Could not post your request. Is the backend running?"
      );
    } finally {
      setPosting(false);
    }
  };

  /* =========================================================
     BROWSE AGENTS (direct request)
  ========================================================= */

  const [agencies, setAgencies] = useState([]);
  const [agenciesLoading, setAgenciesLoading] = useState(false);
  const [agenciesError, setAgenciesError] = useState("");

  useEffect(() => {
    if (mode !== "browse") return undefined;
    let active = true;
    const loadingTimer = setTimeout(() => setAgenciesLoading(true), 0);

    (async () => {
      try {
        const data = await api.get("/agencies");
        if (active) {
          setAgencies(data);
          setAgenciesError("");
        }
      } catch (err) {
        if (active) {
          setAgenciesError(err instanceof ApiError ? err.message : "Could not load agents.");
        }
      } finally {
        if (active) setAgenciesLoading(false);
      }
    })();

    return () => {
      active = false;
      clearTimeout(loadingTimer);
    };
  }, [mode]);

  const requestFromAgency = (agency) => {
    setTargetAgency(agency);
    setPostError("");
    setMode("form");
  };

  /* =========================================================
     VIEW AGENT PROFILE (small popup, opened from a bid)
  ========================================================= */

  const [profileAgentId, setProfileAgentId] = useState(null);

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-900">
      <AppNavbar />

      <main className="mx-auto w-full max-w-[820px] px-5 py-8 sm:px-8 lg:py-10">

        <section className="mb-7 text-center">
          <h1 className="text-[35px] font-bold tracking-[-0.04em] text-[#14213D] sm:text-[45px]">
            Find a clearing agent
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-[14px] leading-6 text-slate-500 sm:text-[16px]">
            Post your shipment to the clearing agent board, request a specific
            agent directly, or compare bids from verified agents.
          </p>
        </section>

        {mode !== "form" && (
          <div className="mb-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={openNewRequestForm}
              className="flex items-center gap-2 rounded-xl bg-[#173563] px-5 py-3 text-[14px] font-bold text-white transition hover:bg-[#214777]"
            >
              <PaperPlaneTilt size={16} />
              Post a New Request
            </button>
            <button
              type="button"
              onClick={() => setMode(mode === "browse" ? "list" : "browse")}
              className={`flex items-center gap-2 rounded-xl border px-5 py-3 text-[14px] font-bold transition ${
                mode === "browse"
                  ? "border-[#173563] bg-blue-50 text-[#173563]"
                  : "border-slate-200 bg-white text-[#173563] hover:bg-slate-50"
              }`}
            >
              <Buildings size={16} />
              Browse Agents
            </button>
          </div>
        )}

        {mode === "form" ? (
          <RequestForm
            importData={importData}
            hsCodeDescription={hsCodeDescription}
            hsCodeChapter={hsCodeChapter}
            hsCodeRemoved={hsCodeRemoved}
            onRemoveHsCode={() => setHsCodeRemoved(true)}
            onRestoreHsCode={() => setHsCodeRemoved(false)}
            form={form}
            onChange={handleFormChange}
            onSubmit={handleSubmit}
            onCancel={cancelForm}
            posting={posting}
            postError={postError}
            targetAgency={targetAgency}
            onClearTarget={() => setTargetAgency(null)}
          />
        ) : mode === "browse" ? (
          <BrowseAgents
            agencies={agencies}
            loading={agenciesLoading}
            error={agenciesError}
            onRequest={requestFromAgency}
            onViewProfile={setProfileAgentId}
          />
        ) : (
          <RequestsList
            tenders={tenders}
            loading={tendersLoading}
            error={tendersError}
            expandedId={expandedId}
            onToggle={(id) => setExpandedId((current) => (current === id ? null : id))}
            onAccepted={refreshTenders}
            onDeleted={refreshTenders}
            onViewProfile={setProfileAgentId}
            onPostFirst={openNewRequestForm}
          />
        )}

        <div className="mt-7 flex items-center justify-center gap-2 text-center text-[13px] text-slate-400">
          <ArrowLeft size={15} />
          <Link to="/calculator" className="font-semibold text-[#2563EB] hover:underline">
            Back to Import Calculator
          </Link>
        </div>
      </main>

      {profileAgentId && (
        <AgentProfileModal agentId={profileAgentId} onClose={() => setProfileAgentId(null)} />
      )}
    </div>
  );
}

/* =========================================================
   YOUR REQUESTS LIST
========================================================= */

function RequestsList({ tenders, loading, error, expandedId, onToggle, onAccepted, onDeleted, onViewProfile, onPostFirst }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#2563EB]" aria-label="Loading" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center text-[14px] font-semibold text-red-600">
        {error}
      </div>
    );
  }

  if (tenders.length === 0) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-[0_2px_12px_rgba(15,23,42,.025)]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-300">
          <Package size={22} />
        </div>
        <h3 className="mt-4 text-[16px] font-bold text-[#173563]">No requests yet</h3>
        <p className="mx-auto mt-2 max-w-md text-[13px] leading-5 text-slate-500">
          Post your shipment to the clearing agent board, or browse agents to
          send a direct request.
        </p>
        <button
          type="button"
          onClick={onPostFirst}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#173563] px-5 py-2.5 text-[14px] font-bold text-white transition hover:bg-[#214777]"
        >
          Post a New Request
        </button>
      </section>
    );
  }

  return (
    <div className="space-y-4">
      {tenders.map((tender) => (
        <TenderCard
          key={tender.id}
          tender={tender}
          expanded={expandedId === tender.id}
          onToggle={() => onToggle(tender.id)}
          onAccepted={onAccepted}
          onDeleted={onDeleted}
          onViewProfile={onViewProfile}
        />
      ))}
    </div>
  );
}

/* =========================================================
   ONE REQUEST (collapsible: summary + its own live bid feed)
========================================================= */

function TenderCard({ tender, expanded, onToggle, onAccepted, onDeleted, onViewProfile }) {
  const [liveTender, setLiveTender] = useState(tender);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [acceptingId, setAcceptingId] = useState(null);
  const [acceptError, setAcceptError] = useState("");
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectError, setRejectError] = useState("");
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    if (!expanded) return undefined;
    let active = true;
    let intervalId;

    const load = async () => {
      try {
        const [tenderData, bidsData] = await Promise.all([
          api.get(`/tenders/${tender.id}`),
          api.get(`/tenders/${tender.id}/bids`),
        ]);
        if (!active) return;
        setLiveTender(tenderData);
        setBids(bidsData);
        setError("");
        if (tenderData.status !== "open" && intervalId) {
          clearInterval(intervalId);
        }
      } catch (err) {
        if (active) setError(err instanceof ApiError ? err.message : "Could not load bids.");
      } finally {
        if (active) setLoading(false);
      }
    };

    const loadingTimer = setTimeout(() => setLoading(true), 0);
    load();
    intervalId = setInterval(load, 4000);

    return () => {
      active = false;
      clearTimeout(loadingTimer);
      clearInterval(intervalId);
    };
  }, [expanded, tender.id]);

  const handleAccept = async (bidId) => {
    if (acceptingId) return;
    setAcceptingId(bidId);
    setAcceptError("");
    try {
      await api.post(`/tenders/${tender.id}/bids/${bidId}/accept`);
      const [tenderData, bidsData] = await Promise.all([
        api.get(`/tenders/${tender.id}`),
        api.get(`/tenders/${tender.id}/bids`),
      ]);
      setLiveTender(tenderData);
      setBids(bidsData);
      onAccepted();
    } catch (err) {
      setAcceptError(err instanceof ApiError ? err.message : "Could not accept this bid.");
    } finally {
      setAcceptingId(null);
    }
  };

  const handleReject = async (bidId) => {
    if (rejectingId) return;
    setRejectingId(bidId);
    setRejectError("");
    try {
      await api.post(`/tenders/${tender.id}/bids/${bidId}/reject`);
      const [tenderData, bidsData] = await Promise.all([
        api.get(`/tenders/${tender.id}`),
        api.get(`/tenders/${tender.id}/bids`),
      ]);
      setLiveTender(tenderData);
      setBids(bidsData);
      onAccepted();
    } catch (err) {
      setRejectError(err instanceof ApiError ? err.message : "Could not reject this bid.");
    } finally {
      setRejectingId(null);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError("");
    try {
      await api.del(`/tenders/${tender.id}`);
      onDeleted();
    } catch (err) {
      setDeleteError(err instanceof ApiError ? err.message : "Could not withdraw this request.");
      setDeleting(false);
    }
  };

  const pendingBids = bids.filter((bid) => bid.status === "pending");
  const otherBids = bids.filter((bid) => bid.status !== "pending");
  const sortedBids = [...pendingBids, ...otherBids];

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,.025)]">
      <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <button
          type="button"
          onClick={onToggle}
          className="flex min-w-0 flex-1 flex-col gap-3 text-left sm:flex-row sm:items-center sm:gap-4"
        >
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-[16px] font-bold text-[#173563]">
                {tender.description || "Shipment request"}
              </h2>
              {tender.targetAgencyName && (
                <span className="rounded-full bg-purple-50 px-2 py-0.5 text-[11px] font-bold text-purple-700">
                  Direct request to {tender.targetAgencyName}
                </span>
              )}
            </div>
            <p className="mt-1 text-[13px] text-slate-400">
              {tender.hsCode ? `HS Code ${tender.hsCode}` : "No HS code provided"} · Posted {timeAgo(tender.postedAt)}
            </p>
          </div>
        </button>

        <div className="flex shrink-0 items-center gap-2">
          {tender.status === "open" && !confirmingDelete && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setConfirmingDelete(true);
              }}
              title="Withdraw request"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
            >
              <Trash size={15} />
            </button>
          )}
          <button type="button" onClick={onToggle} className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-bold ${
                tender.status === "open" ? "bg-blue-50 text-[#2563EB]" : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {tender.status === "open" ? <Clock size={13} /> : <CheckCircle size={13} />}
              {tender.status === "open" ? "Open for bids" : "Closed"}
            </span>
            <CaretDown
              size={16}
              className={`text-slate-400 transition-transform ${expanded ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </div>

      {confirmingDelete && (
        <div className="flex flex-col gap-3 border-t border-red-100 bg-red-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-[13px] font-bold text-red-700">Withdraw this request?</p>
            {deleteError ? (
              <p className="mt-0.5 text-[12px] text-red-600">{deleteError}</p>
            ) : (
              <p className="mt-0.5 text-[12px] text-red-600">
                This removes it from the clearing agent board permanently -- it can't be undone.
              </p>
            )}
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              disabled={deleting}
              className="rounded-lg border border-red-200 bg-white px-3 py-2 text-[12px] font-bold text-red-700 transition hover:bg-red-100 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-lg bg-red-600 px-3 py-2 text-[12px] font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {deleting ? "Withdrawing..." : "Yes, Withdraw"}
            </button>
          </div>
        </div>
      )}

      {expanded && (
        <div className="border-t border-slate-100">
          <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4 sm:p-6">
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-[10px] font-bold uppercase text-slate-400">Origin</p>
              <p className="mt-1 text-[13px] font-semibold text-slate-700">{liveTender?.origin || "-"}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-[10px] font-bold uppercase text-slate-400">Destination</p>
              <p className="mt-1 text-[13px] font-semibold text-slate-700">{liveTender?.port || "-"}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-[10px] font-bold uppercase text-slate-400">CIF Value</p>
              <p className="mt-1 text-[13px] font-semibold text-slate-700">
                USD {Number(liveTender?.declaredValue || 0).toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-[10px] font-bold uppercase text-slate-400">Must release by</p>
              <p className="mt-1 text-[13px] font-semibold text-slate-700">{liveTender?.mustReleaseBy || "-"}</p>
            </div>
          </div>

          {(acceptError || rejectError) && (
            <div className="mx-5 mb-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] font-semibold text-red-600 sm:mx-6">
              <Warning size={17} />
              {acceptError || rejectError}
            </div>
          )}

          <div className="border-t border-slate-100 p-5 sm:p-6">
            <h3 className="text-[15px] font-bold text-slate-900">
              Bids {bids.length > 0 ? `(${bids.length})` : ""}
            </h3>

            {loading ? (
              <div className="flex items-center justify-center py-10">
                <div className="h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-[#2563EB]" aria-label="Loading" />
              </div>
            ) : error ? (
              <p className="mt-4 text-[13px] font-semibold text-red-600">{error}</p>
            ) : sortedBids.length === 0 ? (
              <p className="mt-3 text-[13px] leading-5 text-slate-500">
                No bids yet -- this list checks for new ones automatically.
              </p>
            ) : (
              <div className="mt-3 divide-y divide-slate-100">
                {sortedBids.map((bid) => (
                  <div key={bid.id} className="py-4 first:pt-0">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
                            <Buildings size={18} />
                          </div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-[15px] font-bold text-[#173563]">
                                {bid.agencyName || "Clearing Agency"}
                              </h4>
                              {bid.status !== "pending" && (
                                <span
                                  className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                                    bid.status === "accepted"
                                      ? "bg-emerald-50 text-emerald-700"
                                      : "bg-slate-100 text-slate-500"
                                  }`}
                                >
                                  {bid.status === "accepted" ? "Accepted" : "Not selected"}
                                </span>
                              )}
                            </div>
                            <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[13px] text-slate-400">
                              <span>
                                {bid.agentName || "Clearing Agent"} · {timeAgo(bid.submittedAt)}
                              </span>
                              <button
                                type="button"
                                onClick={() => onViewProfile(bid.agentId)}
                                className="inline-flex items-center gap-1 font-semibold text-[#2563EB] hover:underline"
                              >
                                <UserCircle size={13} />
                                View Profile
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-2">
                          <div className="rounded-lg bg-blue-50 p-2.5">
                            <p className="text-[10px] uppercase text-blue-500">Clearance fee</p>
                            <p className="mt-0.5 text-[13px] font-bold text-[#173563]">
                              Rs. {Number(bid.feeLkr || 0).toLocaleString()}
                            </p>
                          </div>
                          <div className="rounded-lg bg-slate-50 p-2.5">
                            <p className="text-[10px] uppercase text-slate-400">Clearance time</p>
                            <p className="mt-0.5 text-[13px] font-bold text-slate-700">
                              {formatTimeline(bid.clearanceTimelineHours)}
                            </p>
                          </div>
                        </div>

                        {bid.notes && (
                          <p className="mt-3 rounded-xl bg-slate-50 p-3 text-[12px] leading-5 text-slate-500">
                            {bid.notes}
                          </p>
                        )}
                      </div>

                      {liveTender?.status === "open" && bid.status === "pending" && (
                        <div className="flex shrink-0 items-center gap-2">
                          {liveTender?.targetAgencyId && (
                            <button
                              type="button"
                              onClick={() => handleReject(bid.id)}
                              disabled={rejectingId === bid.id || acceptingId === bid.id}
                              className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-[14px] font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              <X size={15} />
                              {rejectingId === bid.id ? "Rejecting..." : "Reject"}
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleAccept(bid.id)}
                            disabled={acceptingId === bid.id || rejectingId === bid.id}
                            className="flex items-center justify-center gap-2 rounded-xl bg-[#173563] px-4 py-3 text-[14px] font-bold text-white transition hover:bg-[#214777] disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <CheckCircle size={15} />
                            {acceptingId === bid.id ? "Accepting..." : "Accept Bid"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

/* =========================================================
   BROWSE AGENTS (direct request)
========================================================= */

function BrowseAgents({ agencies, loading, error, onRequest, onViewProfile }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#2563EB]" aria-label="Loading" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center text-[14px] font-semibold text-red-600">
        {error}
      </div>
    );
  }

  if (agencies.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center text-[13px] text-slate-500 shadow-[0_2px_12px_rgba(15,23,42,.025)]">
        No verified agents are available yet.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {agencies.map((agency) => (
        <div
          key={agency.id}
          className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,.025)]"
        >
          <div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
              <Buildings size={20} />
            </div>
            <h3 className="mt-3 text-[16px] font-bold text-[#173563]">{agency.companyName}</h3>
            <p className="mt-1 text-[12px] font-semibold uppercase tracking-wide text-slate-400">
              {agency.isIndependent ? "Independent Agent" : "Clearing Agency"}
            </p>
            {agency.businessAddress && (
              <p className="mt-2 flex items-start gap-1.5 text-[13px] text-slate-500">
                <MapPin size={14} className="mt-0.5 shrink-0" />
                {agency.businessAddress}
              </p>
            )}
          </div>
          <div className="mt-4 flex flex-col gap-2">
            {agency.isIndependent && agency.adminUid && (
              <button
                type="button"
                onClick={() => onViewProfile(agency.adminUid)}
                className="flex items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-slate-200 px-4 py-2 text-[12.5px] font-bold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#2563EB]"
              >
                View Profile
              </button>
            )}
            <button
              type="button"
              onClick={() => onRequest(agency)}
              className="flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#173563] px-4 py-2 text-[12.5px] font-bold text-white transition hover:bg-[#214777]"
            >
              <PaperPlaneTilt size={13} />
              Send Direct Request
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* =========================================================
   AGENT PROFILE MODAL (small popup, opened from a bid)
========================================================= */

function AgentProfileModal({ agentId, onClose }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await api.get(`/agents/${agentId}/profile`);
        if (active) setProfile(data);
      } catch (err) {
        if (active) setError(err instanceof ApiError ? err.message : "Could not load this agent's profile.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [agentId]);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h3 className="text-[15px] font-bold text-[#173563]">Agent Profile</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-[#2563EB]" aria-label="Loading" />
            </div>
          ) : error ? (
            <p className="text-[13px] font-semibold text-red-600">{error}</p>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#173563] text-[15px] font-bold text-white">
                  {(profile?.name || "A").charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-bold text-slate-900">{profile?.name || "Clearing Agent"}</p>
                  <p className="truncate text-[13px] text-slate-500">
                    {profile?.agencyName || "Independent Agent"}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="flex items-center gap-1 text-[10px] font-bold uppercase text-slate-400">
                    <Star size={11} /> Rating
                  </p>
                  <p className="mt-1 text-[14px] font-bold text-slate-700">
                    {profile?.averageRating ? `${profile.averageRating} / 5` : "No ratings yet"}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Completed Jobs</p>
                  <p className="mt-1 text-[14px] font-bold text-slate-700">{profile?.completedJobs ?? 0}</p>
                </div>
              </div>

              {profile?.experience && (
                <p className="mt-4 text-[13px] text-slate-500">
                  <span className="font-semibold text-slate-700">Experience:</span> {profile.experience}
                </p>
              )}

              {profile?.businessAddress && (
                <p className="mt-4 flex items-start gap-1.5 text-[13px] text-slate-500">
                  <MapPin size={14} className="mt-0.5 shrink-0" />
                  {profile.businessAddress}
                </p>
              )}

              <div className="mt-4 flex gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3">
                <ShieldCheck size={15} className="mt-0.5 shrink-0 text-[#2563EB]" />
                <p className="text-[11px] leading-5 text-slate-500">
                  Contact details are only shared once you accept this agent's bid.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   REQUEST FORM
========================================================= */

function RequestForm({
  importData,
  hsCodeDescription,
  hsCodeChapter,
  hsCodeRemoved,
  onRemoveHsCode,
  onRestoreHsCode,
  form,
  onChange,
  onSubmit,
  onCancel,
  posting,
  postError,
  targetAgency,
  onClearTarget,
}) {
  const errorRef = useRef(null);

  // A validation or server error can land above fields the SME has already
  // scrolled past on this long form -- without this, "nothing happens" is a
  // reasonable (wrong) conclusion to draw when the error is just off-screen.
  useEffect(() => {
    if (postError && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [postError]);

  return (
    <form
      onSubmit={onSubmit}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,.025)]"
    >
      {/* HS CODE SUMMARY (optional -- a request can be posted without one, and
          any HS code carried over from the calculator can be removed here) */}
      {importData?.hsCode && !hsCodeRemoved ? (
        <div className="flex items-start gap-3 border-b border-slate-100 bg-slate-50/60 p-5 sm:p-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
            <Package size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-bold uppercase tracking-wide text-slate-400">
              HS Code {importData.hsCode}
            </p>
            <p className="mt-0.5 truncate text-[15px] font-bold text-slate-800">
              {hsCodeDescription || "Selected product"}
            </p>
            {hsCodeChapter && <p className="mt-0.5 text-[13px] text-slate-400">{hsCodeChapter}</p>}
          </div>
          <button
            type="button"
            onClick={onRemoveHsCode}
            className="shrink-0 text-[12px] font-bold text-slate-500 underline hover:text-slate-700"
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="flex items-start gap-3 border-b border-slate-100 bg-slate-50/60 p-5 sm:p-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <Warning size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-bold text-slate-800">No HS code selected</p>
            <p className="mt-0.5 text-[13px] text-slate-500">
              You can still post this request with the details below, or{" "}
              <Link to="/hs-code-search" className="font-semibold text-[#2563EB] hover:underline">
                search for one
              </Link>{" "}
              first so agents know exactly what they're clearing.
            </p>
          </div>
          {importData?.hsCode && hsCodeRemoved && (
            <button
              type="button"
              onClick={onRestoreHsCode}
              className="shrink-0 text-[12px] font-bold text-[#2563EB] underline hover:text-[#173563]"
            >
              Undo
            </button>
          )}
        </div>
      )}

      <div className="space-y-5 p-5 sm:p-6">
        {targetAgency && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-purple-200 bg-purple-50 px-4 py-3">
            <p className="text-[13px] font-semibold text-purple-700">
              Sending directly to <span className="font-bold">{targetAgency.companyName}</span> -- not the open board.
            </p>
            <button
              type="button"
              onClick={onClearTarget}
              className="shrink-0 text-[12px] font-bold text-purple-700 underline hover:text-purple-900"
            >
              Undo
            </button>
          </div>
        )}

        {postError && (
          <div
            ref={errorRef}
            className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-600"
          >
            <Warning size={16} />
            {postError}
          </div>
        )}

        <FormField label="Product description" required>
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            rows={3}
            placeholder="e.g. 50 laptops and computer accessories"
            className="w-full resize-none rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-[14px] font-medium text-slate-800 outline-none transition focus:border-[#173563] focus:ring-2 focus:ring-[#173563]/10"
          />
        </FormField>

        <FormField label="CIF value (USD)" required icon={CurrencyDollar}>
          <input
            type="number"
            min="0"
            step="0.01"
            name="cifValue"
            value={form.cifValue}
            onChange={onChange}
            placeholder="e.g. 15000"
            className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-3.5 text-[14px] font-medium text-slate-800 outline-none transition focus:border-[#173563] focus:ring-2 focus:ring-[#173563]/10"
          />
        </FormField>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Country of origin" required icon={Globe}>
            <input
              type="text"
              name="origin"
              value={form.origin}
              onChange={onChange}
              placeholder="e.g. China"
              className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-3.5 text-[14px] font-medium text-slate-800 outline-none transition focus:border-[#173563] focus:ring-2 focus:ring-[#173563]/10"
            />
          </FormField>

          <FormField label="Destination port" required icon={MapPin}>
            <input
              type="text"
              name="destination"
              value={form.destination}
              onChange={onChange}
              placeholder="e.g. Colombo Port"
              className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-3.5 text-[14px] font-medium text-slate-800 outline-none transition focus:border-[#173563] focus:ring-2 focus:ring-[#173563]/10"
            />
          </FormField>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Estimated arrival date" required icon={CalendarBlank}>
            <input
              type="date"
              name="estimatedArrival"
              value={form.estimatedArrival}
              onChange={onChange}
              className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-3.5 text-[14px] font-medium text-slate-800 outline-none transition focus:border-[#173563] focus:ring-2 focus:ring-[#173563]/10"
            />
          </FormField>

          <FormField label="Must be released by" required icon={CalendarBlank}>
            <input
              type="date"
              name="mustReleaseBy"
              value={form.mustReleaseBy}
              onChange={onChange}
              className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-3.5 text-[14px] font-medium text-slate-800 outline-none transition focus:border-[#173563] focus:ring-2 focus:ring-[#173563]/10"
            />
          </FormField>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Contact phone" required icon={Phone}>
            <input
              type="tel"
              name="contactPhone"
              value={form.contactPhone}
              onChange={onChange}
              placeholder="+94 77 123 4567"
              className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-3.5 text-[14px] font-medium text-slate-800 outline-none transition focus:border-[#173563] focus:ring-2 focus:ring-[#173563]/10"
            />
          </FormField>

          <FormField label="Contact email" required icon={EnvelopeSimple}>
            <input
              type="email"
              name="contactEmail"
              value={form.contactEmail}
              onChange={onChange}
              placeholder="you@business.com"
              className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-3.5 text-[14px] font-medium text-slate-800 outline-none transition focus:border-[#173563] focus:ring-2 focus:ring-[#173563]/10"
            />
          </FormField>
        </div>

        <div className="flex gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3">
          <ShieldCheck size={16} className="mt-0.5 shrink-0 text-[#2563EB]" />
          <p className="text-[12px] leading-5 text-slate-500">
            Your contact details are only shared with the agent you accept a
            bid from -- not with every agent browsing the board.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-[14px] font-bold text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={posting}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#173563] text-[15px] font-bold text-white shadow-sm transition hover:bg-[#214777] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <PaperPlaneTilt size={17} />
            {posting ? "Posting request..." : targetAgency ? "Send Direct Request" : "Post to Clearing Agent Board"}
          </button>
        </div>
      </div>
    </form>
  );
}

function FormField({ label, required, icon: Icon, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-bold text-slate-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            size={17}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
        )}
        {children}
      </div>
    </div>
  );
}

export default FindAgent;
