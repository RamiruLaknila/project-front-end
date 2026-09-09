import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  Clock3,
  Copy,
  RefreshCw,
  Search,
  UserCheck,
  UserPlus,
  Users,
  X,
  XCircle,
} from "lucide-react";

import AgentAdminSidebar from "../components/AgentAdminSidebar";

function AgentAdminDashboard() {
  const navigate = useNavigate();

   const [agency, setAgency] = useState(() => {
    try {
      const storedAgency = localStorage.getItem("clearingAgency");
      return storedAgency ? JSON.parse(storedAgency) : null;
    } catch {
      return null;
    }
  });

  const [currentAdmin, setCurrentAdmin] = useState(() => {
    try {
      const storedAgent = localStorage.getItem("clearingAgent");
      const parsed = storedAgent ? JSON.parse(storedAgent) : null;
      return parsed && parsed.agentType === "agency-admin" ? parsed : null;
    } catch {
      return null;
    }
  });
  const [joinApplication, setJoinApplication] = useState(null);
  const [joinStatus, setJoinStatus] = useState("pending");
  const [copied, setCopied] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadAgencyData();
    loadJoinApplication();
  }, []);

  /* ============================================================
     LOAD AGENCY DATA
  ============================================================ */

  const loadAgencyData = () => {
    const storedAgency = localStorage.getItem("clearingAgency");
    const storedAgent = localStorage.getItem("clearingAgent");

    if (!storedAgent) {
      navigate("/agent-signin");
      return;
    }

    try {
      const parsedAgent = JSON.parse(storedAgent);

      if (parsedAgent.agentType !== "agency-admin") {
        navigate("/agent-signin");
        return;
      }

      if (!storedAgency) {
        navigate("/agency-choice");
        return;
      }

      const parsedAgency = JSON.parse(storedAgency);

      setAgency(parsedAgency);
      setCurrentAdmin(parsedAgent);
    } catch (error) {
      console.error("Failed to load agency data:", error);
      navigate("/agent-signin");
    }
  };

  /* ============================================================
     LOAD JOIN APPLICATION
  ============================================================ */

  const loadJoinApplication = () => {
    try {
      const storedApplication = localStorage.getItem(
        "agencyJoinApplication"
      );

      const storedStatus =
        localStorage.getItem("agencyJoinStatus") || "pending";

      if (storedApplication) {
        setJoinApplication(JSON.parse(storedApplication));
      } else {
        setJoinApplication(null);
      }

      setJoinStatus(storedStatus);
    } catch (error) {
      console.error("Failed to load join application:", error);
    }
  };

  /* ============================================================
     REFRESH
  ============================================================ */

  const handleRefresh = () => {
    loadAgencyData();
    loadJoinApplication();
  };

  /* ============================================================
     TOTAL AGENTS
  ============================================================ */

  const totalAgents = useMemo(() => {
    if (!agency) {
      return 0;
    }

    try {
      const storedAgents =
        JSON.parse(localStorage.getItem("agencyAgents")) || [];

      const agencyId = agency.id || agency.code;

      return storedAgents.filter(
        (agent) =>
          (agent.agencyId || agent.agencyCode) === agencyId
      ).length;
    } catch {
      return 0;
    }
  }, [agency]);

  /* ============================================================
     PENDING REQUEST COUNT
  ============================================================ */

  const pendingCount =
    joinApplication && joinStatus === "pending" ? 1 : 0;

  /* ============================================================
     APPROVE JOIN REQUEST
  ============================================================ */

  const handleApproveJoin = () => {
    if (!joinApplication || !agency || processing) {
      return;
    }

    setProcessing(true);

    try {
      const approvedApplication = {
        ...joinApplication,
        status: "approved",
        approvedAt: new Date().toISOString(),
      };

      localStorage.setItem(
        "agencyJoinApplication",
        JSON.stringify(approvedApplication)
      );

      localStorage.setItem(
        "agencyJoinStatus",
        "approved"
      );

      const existingAgents =
        JSON.parse(localStorage.getItem("agencyAgents")) || [];

      const newAgent = {
        id:
          joinApplication.id ||
          `agent-${Date.now()}`,

        name:
          joinApplication.name ||
          joinApplication.fullName ||
          "Agency Agent",

        email:
          joinApplication.email || "",

        phone:
          joinApplication.phone || "",

        agencyId:
          agency.id ||
          agency.code ||
          "",

        agencyName:
          agency.agencyName ||
          agency.name ||
          "Your Agency",

        agencyCode:
          agency.code ||
          agency.agencyCode ||
          "",

        licenseNumber:
          joinApplication.licenseNumber || "",

        role: "agent",

        status: "active",

        agentStatus: "approved",

        requestedAt:
          joinApplication.requestedAt ||
          new Date().toISOString(),

        joinedAt:
          new Date().toISOString(),

        approvedAt:
          new Date().toISOString(),
      };

      const filteredAgents = existingAgents.filter(
        (agent) =>
          agent.email?.toLowerCase() !==
          newAgent.email?.toLowerCase()
      );

      localStorage.setItem(
        "agencyAgents",
        JSON.stringify([
          ...filteredAgents,
          newAgent,
        ])
      );

      setJoinStatus("approved");
      setJoinApplication(approvedApplication);
    } catch (error) {
      console.error("Failed to approve agent:", error);
    } finally {
      setProcessing(false);
    }
  };

  /* ============================================================
     REJECT JOIN REQUEST
  ============================================================ */

  const handleRejectJoin = () => {
    if (!joinApplication || processing) {
      return;
    }

    setProcessing(true);

    try {
      const rejectedApplication = {
        ...joinApplication,
        status: "rejected",
        rejectedAt: new Date().toISOString(),
      };

      localStorage.setItem(
        "agencyJoinApplication",
        JSON.stringify(rejectedApplication)
      );

      localStorage.setItem(
        "agencyJoinStatus",
        "rejected"
      );

      setJoinStatus("rejected");
      setJoinApplication(rejectedApplication);
    } catch (error) {
      console.error("Failed to reject agent:", error);
    } finally {
      setProcessing(false);
    }
  };

  /* ============================================================
     COPY INVITATION CODE
  ============================================================ */

  const handleCopyCode = async () => {
    const invitationCode =
      localStorage.getItem("agencyInviteCode") ||
      "ABC001";

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

  if (!agency || !currentAdmin) {
    return null;
  }

  const invitationCode =
    localStorage.getItem("agencyInviteCode") ||
    agency.code ||
    agency.agencyCode ||
    "ABC001";

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

              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
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
              onClick={handleRefresh}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
              title="Refresh"
            >
              <RefreshCw size={18} />
            </button>

            <button
              type="button"
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

              <h2 className="text-[32px] font-bold tracking-[-0.04em] text-[#14213D] sm:text-[42px]">
                Welcome back
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-[15px]">
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

          {/* =====================================================
              SUMMARY CARDS
          ===================================================== */}

          <div className="grid gap-4 sm:grid-cols-3">

            <SummaryCard
              icon={Users}
              label="Total Agents"
              value={totalAgents}
              description="Active agency agents"
            />

            <SummaryCard
              icon={Clock3}
              label="Pending Requests"
              value={pendingCount}
              description="Waiting for approval"
            />

            <SummaryCard
              icon={UserCheck}
              label="SME Requests"
              value="0"
              description="New requests"
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
                    <CheckCircle2 size={20} />
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
                  onClick={handleRefresh}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
                >
                  <RefreshCw size={16} />
                </button>

              </div>

              <div className="space-y-4">

                <ActivityItem
                  icon={Users}
                  title="Agency workspace active"
                  description="Your agency dashboard is ready."
                />

                <ActivityItem
                  icon={Search}
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

                {pendingCount > 0 && (
                  <span className="rounded-full bg-amber-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-amber-700">
                    Pending
                  </span>
                )}

              </div>

              {joinApplication ? (

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                    <div className="flex items-start gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#173563] text-sm font-bold text-white">
                        {getInitials(
                          joinApplication.name ||
                          joinApplication.fullName
                        )}
                      </div>

                      <div>

                        <h4 className="text-base font-bold text-slate-900">
                          {joinApplication.name ||
                            joinApplication.fullName ||
                            "Agent"}
                        </h4>

                        <p className="mt-1 text-xs text-slate-500">
                          {joinApplication.email ||
                            "No email provided"}
                        </p>

                        {joinApplication.phone && (
                          <p className="mt-1 text-xs text-slate-500">
                            {joinApplication.phone}
                          </p>
                        )}

                      </div>

                    </div>

                    <div>

                      {joinStatus === "pending" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-700">
                          <Clock3 size={12} />
                          Pending
                        </span>
                      )}

                      {joinStatus === "approved" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                          <CheckCircle2 size={12} />
                          Approved
                        </span>
                      )}

                      {joinStatus === "rejected" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-red-600">
                          <XCircle size={12} />
                          Rejected
                        </span>
                      )}

                    </div>

                  </div>

                  {joinStatus === "pending" && (
                    <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">

                      <button
                        type="button"
                        onClick={handleRejectJoin}
                        disabled={processing}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <X size={16} />
                        Reject
                      </button>

                      <button
                        type="button"
                        onClick={handleApproveJoin}
                        disabled={processing}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173563] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#10294d] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <CheckCircle2 size={16} />
                        Approve
                      </button>

                    </div>
                  )}

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

          <p className="mt-1 text-[11px] text-slate-400">
            {description}
          </p>

        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

          <Icon
            size={19}
            strokeWidth={1.8}
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
          strokeWidth={1.8}
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
          strokeWidth={1.8}
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
          strokeWidth={1.8}
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
