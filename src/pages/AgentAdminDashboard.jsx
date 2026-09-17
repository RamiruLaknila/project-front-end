import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  Check,
  CheckCircle,
  Clock,
  Copy,
  ArrowsClockwise,
  EnvelopeSimple,
  MagnifyingGlass,
  UserCheck,
  UserPlus,
  Users,
  Warning,
  X,
} from "@phosphor-icons/react";

import AgentAdminSidebar from "../components/AgentAdminSidebar";
import { useAuth } from "../context/AuthContext";
import { api, ApiError } from "../lib/api";
import { authErrorMessage, landingPathForProfile } from "../lib/authErrors";

function AgentAdminDashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const agencyId = user?.agencyId;
  // A real (multi-agent) agency admin -- an independent solo agent is also
  // flagged isAgencyAdmin, but this dashboard isn't for them.
  const isRealAgencyAdmin = !!user?.isAgencyAdmin && !user?.isIndependent;

  const [agency, setAgency] = useState(null);
  const [agents, setAgents] = useState([]);
  const [openTenders, setOpenTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [copied, setCopied] = useState(false);
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
        const [agencyData, agentsData, tendersData] = await Promise.all([
          api.get(`/agencies/${agencyId}`),
          api.get(`/agencies/${agencyId}/agents`),
          api.get("/tenders?status=open"),
        ]);
        if (active) {
          setAgency(agencyData);
          setAgents(agentsData);
          setOpenTenders(tendersData);
          setLoadError("");
        }
      } catch (err) {
        if (active) {
          setLoadError(authErrorMessage(err, "Could not load your agency's data."));
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
  const totalAgents = activeAgents.length + pendingAgents.length;
  const smeRequestCount = useMemo(
    () => openTenders.filter((tender) => tender.targetAgencyId === agencyId).length,
    [openTenders, agencyId]
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

  const invitationCode = agency?.agencyCode || "AG-000000";

  /* ============================================================
     COPY INVITATION CODE
  ============================================================ */

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(invitationCode);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(
        "Failed to copy invitation code:",
        error
      );
    }
  };

  /* ============================================================
     WAIT UNTIL DATA LOADS
  ============================================================ */

  if (authLoading || !user || !isRealAgencyAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-900">

      {/* =====================================================
          ADMIN SIDEBAR
      ===================================================== */}

      <AgentAdminSidebar />

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="min-h-screen pt-[68px] lg:ml-[260px] lg:pt-0">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <header className="sticky top-[68px] z-30 flex h-[70px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:top-0">

          <div className="flex items-center gap-3">

            <div>

              <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-slate-400">
                Agency Workspace
              </p>

              <h1 className="text-base font-bold text-slate-800">
                Agency Dashboard
              </h1>

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
            >
              <Bell size={18} />

              

            </button>

          </div>

        </header>

        {/* =====================================================
            PAGE CONTENT
        ===================================================== */}

        <div className="mx-auto max-w-[1180px] px-5 py-7 sm:px-8 lg:py-9">

          

          {/* INTRO */}

          <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <h2 className="text-[35px] font-bold tracking-[-0.04em] text-[#14213D] sm:text-[45px]">
                Welcome back
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-[16px]">
                Manage your clearing agency, agents and SME
                requests from one place.
              </p>

            </div>

            <Link
              to="/agency-invite"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173563] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#10294d]"
            >
              <UserPlus size={17} />
              Invite Agent
            </Link>

          </div>

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

          {/* =====================================================
              SUMMARY CARDS
          ===================================================== */}

          <div className="grid gap-4 sm:grid-cols-3">

            <SummaryCard
              icon={Users}
              label="Total Agents"
              value={loading ? "—" : totalAgents}
              description="Active agency agents"
            />

            <SummaryCard
              icon={Clock}
              label="Pending Requests"
              value={loading ? "—" : pendingAgents.length}
              description="Waiting for approval"
            />

            <SummaryCard
              icon={UserCheck}
              label="SME Requests"
              value={loading ? "—" : smeRequestCount}
              description="Direct requests to your agency"
            />

          </div>

          {/* =====================================================
              INVITATION CODE
          ===================================================== */}

          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)] sm:p-6">

            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

              <div>

                <div className="mb-2 flex items-center gap-2">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <UserPlus size={18} />
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900">
                    Agency Invitation Code
                  </h3>

                </div>

                <p className="text-sm leading-6 text-slate-500">
                  Share this code with clearing agents who want
                  to join your agency.
                </p>

              </div>

              <div className="flex items-center gap-2">

                <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-3">

                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Invite Code
                  </p>

                  <p className="mt-1 text-xl font-bold tracking-[0.2em] text-[#173563]">
                    {invitationCode}
                  </p>

                </div>

                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="flex h-[70px] w-[48px] items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-[#173563]"
                  title="Copy invitation code"
                >
                  {copied ? (
                    <CheckCircle size={20} />
                  ) : (
                    <Copy size={20} />
                  )}
                </button>

              </div>

            </div>

          </section>

          {/* =====================================================
              RECENT ACTIVITY + REQUESTS
          ===================================================== */}

          <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1.25fr]">

            {/* RECENT ACTIVITY */}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)] sm:p-6">

              <div className="mb-5 flex items-center justify-between">

                <div>

                  <h3 className="text-base font-bold text-slate-900">
                    Recent Activity
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Latest agency updates
                  </p>

                </div>

                <button
                  type="button"
                  onClick={refresh}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
                >
                  <ArrowsClockwise size={16} />
                </button>

              </div>

              <div className="space-y-4">

                <ActivityItem
                  icon={Users}
                  title="Agency workspace active"
                  description="Your agency dashboard is ready."
                />

                <ActivityItem
                  icon={MagnifyingGlass}
                  title="SME marketplace"
                  description="Check new SME requests from the marketplace."
                />

              </div>

            </section>

            {/* AGENT REQUESTS */}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)] sm:p-6">

              <div className="mb-5 flex items-center justify-between">

                <div>

                  <h3 className="text-base font-bold text-slate-900">
                    Agent Requests
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Review agents requesting to join your agency.
                  </p>

                </div>

                {pendingAgents.length > 0 && (
                  <span className="rounded-full bg-amber-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-amber-700">
                    {pendingAgents.length} Pending
                  </span>
                )}

              </div>

              {loading ? (

                <div className="flex items-center justify-center py-10">
                  <div
                    className="h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-[#2563EB]"
                    aria-label="Loading"
                  />
                </div>

              ) : pendingAgents.length > 0 ? (

                <div className="space-y-3">
                  {pendingAgents.map((agent) => {
                    const platformApproved = agent.platformStatus === "approved";
                    const platformRejected = agent.platformStatus === "rejected";

                    return (
                      <div
                        key={agent.id}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                          <div className="flex items-start gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#173563] text-sm font-bold text-white">
                              {getInitials(agent.name)}
                            </div>

                            <div>
                              <h4 className="text-base font-bold text-slate-900">
                                {agent.name || "Agent"}
                              </h4>

                              <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                                <EnvelopeSimple size={12} />
                                {agent.email || "No email provided"}
                              </p>

                              {!platformApproved && !platformRejected && (
                                <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                                  Awaiting ImportEase review
                                </span>
                              )}

                              {platformRejected && (
                                <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-600">
                                  Rejected by ImportEase
                                </span>
                              )}
                            </div>

                          </div>

                          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-amber-700">
                            <Clock size={12} />
                            Pending
                          </span>

                        </div>

                        {platformApproved ? (
                          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">

                            <button
                              type="button"
                              onClick={() => decide(agent.id, "rejected")}
                              disabled={processingId === agent.id}
                              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <X size={16} />
                              Reject
                            </button>

                            <button
                              type="button"
                              onClick={() => decide(agent.id, "approved")}
                              disabled={processingId === agent.id}
                              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173563] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#10294d] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Check size={16} />
                              {processingId === agent.id ? "Updating…" : "Approve"}
                            </button>

                          </div>
                        ) : (
                          <p className="mt-3 text-right text-xs italic leading-5 text-slate-400">
                            {platformRejected
                              ? "This applicant was rejected by ImportEase -- you can't approve them."
                              : "You can approve this agent once ImportEase completes their platform review."}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

              ) : (

                <EmptyState
                  icon={Users}
                  title="No agent requests"
                  description="New agent join requests will appear here."
                />

              )}

            </section>

          </div>

          {/* FOOTER */}

          <footer className="mt-10 border-t border-slate-200 pt-5 text-center text-xs text-slate-400">
            ImportEase Agent Platform
          </footer>

        </div>

      </main>

    </div>
  );
}

/* ============================================================
   SUMMARY CARD
============================================================ */

function SummaryCard({
  icon: Icon,
  label,
  value,
  description,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)]">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-xs font-semibold text-slate-400">
            {label}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </p>

          <p className="mt-1 text-[12px] text-slate-400">
            {description}
          </p>

        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

          <Icon
            size={19}
          />

        </div>

      </div>

    </div>
  );
}

/* ============================================================
   ACTIVITY ITEM
============================================================ */

function ActivityItem({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="flex items-start gap-3">

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">

        <Icon
          size={16}
        />

      </div>

      <div className="min-w-0">

        <p className="text-sm font-semibold text-slate-800">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>

      </div>

    </div>
  );
}

/* ============================================================
   EMPTY STATE
============================================================ */

function EmptyState({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center">

      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">

        <Icon
          size={20}
        />

      </div>

      <h4 className="mt-3 text-base font-bold text-slate-800">
        {title}
      </h4>

      <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
        {description}
      </p>

    </div>
  );
}

/* ============================================================
   QUICK ACTION
============================================================ */

function QuickAction({
  icon: Icon,
  title,
  description,
  to,
}) {
  return (
    <Link
      to={to}
      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)] transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
    >

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-[#173563] group-hover:text-white">

        <Icon
          size={19}
        />

      </div>

      <h4 className="mt-4 text-base font-bold text-slate-900">
        {title}
      </h4>

      <p className="mt-1 text-sm leading-6 text-slate-500">
        {description}
      </p>

    </Link>
  );
}

/* ============================================================
   GET INITIALS
============================================================ */

function getInitials(name) {
  if (!name) {
    return "AD";
  }

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

export default AgentAdminDashboard;
