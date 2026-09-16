import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  Check,
  CheckCircle,
  Clock,
  EnvelopeSimple,
  ArrowsClockwise,
  UserPlus,
  Users,
  Warning,
  X,
} from "@phosphor-icons/react";
import AgentAdminSidebar from "../components/AgentAdminSidebar";
import { useAuth } from "../context/AuthContext";
import { api, ApiError } from "../lib/api";
import { authErrorMessage, landingPathForProfile } from "../lib/authErrors";

function AgencyAgents() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const agencyId = user?.agencyId;
  // A real (multi-agent) agency admin -- an independent solo agent is also
  // flagged isAgencyAdmin, but this page isn't for them.
  const isRealAgencyAdmin = !!user?.isAgencyAdmin && !user?.isIndependent;

  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  // Anyone who lands here but isn't a genuine agency admin gets sent to
  // wherever their own profile actually belongs.
  useEffect(() => {
    if (authLoading || !user || isRealAgencyAdmin) return undefined;
    const timer = setTimeout(() => {
      navigate(landingPathForProfile(user), { replace: true });
    }, 0);
    return () => clearTimeout(timer);
  }, [authLoading, user, isRealAgencyAdmin, navigate]);

  useEffect(() => {
    if (!agencyId || !isRealAgencyAdmin) return undefined;
    let active = true;

    (async () => {
      try {
        const data = await api.get(`/agencies/${agencyId}/agents`);
        if (active) {
          setAgents(data);
          setLoadError("");
        }
      } catch (err) {
        if (active) {
          setLoadError(authErrorMessage(err, "Could not load your agents."));
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [agencyId, isRealAgencyAdmin, reloadKey]);

  const pendingAgents = useMemo(
    () => agents.filter((agent) => agent.agentStatus === "pending"),
    [agents]
  );
  const activeAgents = useMemo(
    () => agents.filter((agent) => agent.agentStatus === "approved"),
    [agents]
  );

  const refresh = () => setReloadKey((key) => key + 1);

  const decide = async (agentId, decision) => {
    setProcessingId(agentId);
    setActionError("");
    try {
      await api.put(`/agencies/${agencyId}/agents/${agentId}/approve`, { decision });
      refresh();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Could not update this agent.");
    } finally {
      setProcessingId(null);
    }
  };

  if (authLoading || !user || !isRealAgencyAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-900">
      <AgentAdminSidebar />

      <div className="pt-[68px] lg:ml-[260px] lg:pt-0">
        <header className="sticky top-[68px] z-30 flex h-[70px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-xl sm:px-6 lg:top-0">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-slate-400">
                Agency Workspace
              </p>
              <h1 className="text-base font-bold text-slate-800">Agents</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={refresh}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
              title="Refresh"
            >
              <ArrowsClockwise size={18} />
            </button>

            <button
              type="button"
              onClick={() => navigate("/agent-admin-notifications")}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
              title="Notifications"
            >
              <Bell size={18} />
              {pendingAgents.length > 0 && (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
              )}
            </button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1180px] px-5 py-7 sm:px-8 lg:py-9">
          <section className="mb-7">
            <Link
              to="/agent-admin-dashboard"
              className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-800"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>

            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <h2 className="text-[35px] font-bold tracking-[-0.04em] text-[#14213D] sm:text-[45px]">
                  Manage Agents
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-[16px]">
                  Review membership requests and manage the agents in your agency.
                </p>
              </div>

              <Link
                to="/agency-invite"
                className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#173563] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#102547]"
              >
                <UserPlus size={17} />
                Invite Agent
              </Link>
            </div>
          </section>

          {loadError && (
            <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              <Warning size={17} />
              {loadError}
            </div>
          )}

          {actionError && (
            <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              <Warning size={17} />
              {actionError}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-16">
              <div
                className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#2563EB]"
                aria-label="Loading"
              />
            </div>
          ) : (
            <>
              <section className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <SummaryCard
                  icon={Users}
                  label="Total Agents"
                  value={activeAgents.length + pendingAgents.length}
                  iconStyle="bg-blue-50 text-blue-600"
                />
                <SummaryCard
                  icon={Clock}
                  label="Pending Requests"
                  value={pendingAgents.length}
                  iconStyle="bg-amber-50 text-amber-700"
                />
                <SummaryCard
                  icon={CheckCircle}
                  label="Active Agents"
                  value={activeAgents.length}
                  iconStyle="bg-emerald-50 text-emerald-700"
                />
              </section>

              <section className="mb-7">
                <div className="mb-4">
                  <h2 className="text-base font-bold text-[#14213D]">Pending Requests</h2>
                  <p className="mt-1 text-sm text-slate-500">Agents waiting for your approval.</p>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,.02)]">
                  {pendingAgents.length === 0 ? (
                    <EmptyState
                      icon={CheckCircle}
                      title="No pending requests"
                      description="New agent membership requests will appear here."
                    />
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {pendingAgents.map((agent) => (
                        <AgentRow
                          key={agent.id}
                          agent={agent}
                          pending
                          processing={processingId === agent.id}
                          onApprove={() => decide(agent.id, "approved")}
                          onReject={() => decide(agent.id, "rejected")}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </section>

              <section>
                <div className="mb-4">
                  <h2 className="text-base font-bold text-[#14213D]">Active Agents</h2>
                  <p className="mt-1 text-sm text-slate-500">Agents approved to work under your agency.</p>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,.02)]">
                  {activeAgents.length === 0 ? (
                    <EmptyState
                      icon={Users}
                      title="No active agents"
                      description="Approved agents will appear here."
                    />
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {activeAgents.map((agent) => (
                        <AgentRow key={agent.id} agent={agent} />
                      ))}
                    </div>
                  )}
                </div>
              </section>
            </>
          )}

          <div className="mt-10 flex items-center justify-center border-t border-slate-200 pt-6 text-center text-xs text-slate-400">
            ImportEase · Clearing Agency Platform
          </div>
        </main>
      </div>
    </div>
  );
}

/* =========================================================
   AGENT ROW
========================================================= */

function AgentRow({ agent, pending = false, processing = false, onApprove, onReject }) {
  const platformApproved = agent.platformStatus === "approved";
  const platformRejected = agent.platformStatus === "rejected";

  return (
    <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#173563] text-sm font-bold text-white">
          {getInitials(agent.name)}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-base font-bold text-slate-800">{agent.name || "Agent"}</p>

            {pending ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
                <Clock size={11} />
                Pending
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                <CheckCircle size={11} />
                Active
              </span>
            )}

            {pending && !platformApproved && !platformRejected && (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                Awaiting ImportEase review
              </span>
            )}

            {pending && platformRejected && (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-600">
                Rejected by ImportEase
              </span>
            )}
          </div>

          <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <EnvelopeSimple size={12} />
              {agent.email || "No email"}
            </span>
            {agent.createdAt && <span>Joined {formatDate(agent.createdAt)}</span>}
          </div>
        </div>
      </div>

      {pending &&
        (platformApproved ? (
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={onReject}
              disabled={processing}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X size={15} />
              Reject
            </button>
            <button
              type="button"
              onClick={onApprove}
              disabled={processing}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Check size={15} />
              {processing ? "Updating..." : "Approve"}
            </button>
          </div>
        ) : (
          <p className="shrink-0 max-w-[220px] text-right text-xs italic leading-5 text-slate-400">
            {platformRejected
              ? "This applicant was rejected by ImportEase -- you can't approve them."
              : "You can approve this agent once ImportEase completes their platform review."}
          </p>
        ))}
    </div>
  );
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({ icon: Icon, label, value, iconStyle }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-800">{value}</p>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconStyle}`}>
          <Icon size={19} />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
        <Icon size={22} />
      </div>
      <h3 className="mt-4 text-base font-bold text-slate-700">{title}</h3>
      <p className="mt-1 max-w-sm text-sm leading-5 text-slate-400">{description}</p>
    </div>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function formatDate(date) {
  try {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

function getInitials(name) {
  if (!name) return "AG";
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
}

export default AgencyAgents;
