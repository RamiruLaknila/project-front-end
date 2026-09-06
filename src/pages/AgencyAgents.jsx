import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  Check,
  CheckCircle2,
  Clock3,
  Mail,
  RefreshCw,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import AgentAdminSidebar from "../components/AgentAdminSidebar";

function AgencyAgents() {
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
      const storedAdmin = localStorage.getItem("clearingAgent");
      const parsed = storedAdmin ? JSON.parse(storedAdmin) : null;
      return parsed && parsed.agentType === "agency-admin" ? parsed : null;
    } catch {
      return null;
    }
  });
  const [agents, setAgents] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [processingId, setProcessingId] = useState(null);

  /* =========================================================
     LOAD DATA
  ========================================================= */

  const loadData = () => {
    try {
      const storedAgency = localStorage.getItem("clearingAgency");
      const storedAdmin = localStorage.getItem("clearingAgent");

      if (!storedAgency || !storedAdmin) {
        navigate("/agent-signin");
        return;
      }

      const parsedAgency = JSON.parse(storedAgency);
      const parsedAdmin = JSON.parse(storedAdmin);

      if (parsedAdmin.agentType !== "agency-admin") {
        navigate("/agent-signin");
        return;
      }

      const storedAgents = JSON.parse(
        localStorage.getItem("agencyAgents") || "[]"
      );

      const storedPendingRequests = JSON.parse(
        localStorage.getItem("agencyPendingAgents") || "[]"
      );

      setAgency(parsedAgency);
      setCurrentAdmin(parsedAdmin);
      setAgents(storedAgents);
      setPendingRequests(storedPendingRequests);
    } catch (error) {
      console.error("Failed to load agency agents:", error);
      navigate("/agent-signin");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* =========================================================
     AGENCY ID
  ========================================================= */

  const agencyId = agency?.id || agency?.code;

  /* =========================================================
     FILTER PENDING REQUESTS FOR THIS AGENCY
  ========================================================= */

  const agencyPendingRequests = useMemo(() => {
    return pendingRequests.filter((request) => {
      const requestAgencyId =
        request.agencyId || request.agencyCode;

      return (
        requestAgencyId === agencyId &&
        request.status === "pending"
      );
    });
  }, [pendingRequests, agencyId]);

  /* =========================================================
     FILTER ACTIVE AGENTS
  ========================================================= */

  const agencyAgents = useMemo(() => {
    return agents.filter((agent) => {
      const agentAgencyId =
        agent.agencyId || agent.agencyCode;

      return agentAgencyId === agencyId;
    });
  }, [agents, agencyId]);

  const activeAgents = useMemo(() => {
    return agencyAgents.filter(
      (agent) =>
        agent.status === "approved" ||
        agent.agentStatus === "approved"
    );
  }, [agencyAgents]);

  /* =========================================================
     APPROVE AGENT
  ========================================================= */

  const handleApprove = (requestId) => {
    setProcessingId(requestId);

    try {
      const storedRequests = JSON.parse(
        localStorage.getItem("agencyPendingAgents") || "[]"
      );

      const selectedRequest = storedRequests.find(
        (request) => request.id === requestId
      );

      if (!selectedRequest) {
        return;
      }

      const now = new Date().toISOString();

      /* -------------------------------------------------------
         UPDATE PENDING REQUEST
      ------------------------------------------------------- */

      const updatedRequests = storedRequests.map((request) => {
        if (request.id !== requestId) {
          return request;
        }

        return {
          ...request,
          status: "approved",
          agentStatus: "approved",
          approvedAt: now,
        };
      });

      localStorage.setItem(
        "agencyPendingAgents",
        JSON.stringify(updatedRequests)
      );

      /* -------------------------------------------------------
         ADD / UPDATE AGENCY AGENT
      ------------------------------------------------------- */

      const storedAgents = JSON.parse(
        localStorage.getItem("agencyAgents") || "[]"
      );

      const existingAgentIndex = storedAgents.findIndex(
        (agent) =>
          agent.email?.toLowerCase() ===
          selectedRequest.email?.toLowerCase()
      );

      const approvedAgent = {
        id:
          selectedRequest.id ||
          `agent-${Date.now()}`,

        name:
          selectedRequest.name ||
          "Agent",

        email:
          selectedRequest.email ||
          "",

        agencyId:
          selectedRequest.agencyId ||
          agency?.id,

        agencyName:
          selectedRequest.agencyName ||
          agency?.name ||
          agency?.agencyName,

        agencyCode:
          selectedRequest.agencyCode ||
          agency?.code,

        role: "agent",

        agentType: "agency-member",

        status: "approved",

        agentStatus: "approved",

        requestedAt:
          selectedRequest.requestedAt ||
          now,

        approvedAt: now,
      };

      let updatedAgents;

      if (existingAgentIndex >= 0) {
        updatedAgents = storedAgents.map(
          (agent, index) => {
            if (index !== existingAgentIndex) {
              return agent;
            }

            return {
              ...agent,
              ...approvedAgent,
            };
          }
        );
      } else {
        updatedAgents = [
          ...storedAgents,
          approvedAgent,
        ];
      }

      localStorage.setItem(
        "agencyAgents",
        JSON.stringify(updatedAgents)
      );

      /* -------------------------------------------------------
         UPDATE CURRENT AGENT IF SAME BROWSER
      ------------------------------------------------------- */

      const storedCurrentAgent =
        localStorage.getItem("clearingAgent");

      if (storedCurrentAgent) {
        const currentAgent = JSON.parse(
          storedCurrentAgent
        );

        if (
          currentAgent.email?.toLowerCase() ===
          selectedRequest.email?.toLowerCase()
        ) {
          localStorage.setItem(
            "clearingAgent",
            JSON.stringify({
              ...currentAgent,

              agencyId:
                selectedRequest.agencyId ||
                agency?.id,

              agencyName:
                selectedRequest.agencyName ||
                agency?.name ||
                agency?.agencyName,

              agencyCode:
                selectedRequest.agencyCode ||
                agency?.code,

              role: "agent",

              agentType: "agency-member",

              agentStatus: "approved",

              approvedAt: now,
            })
          );
        }
      }

      /* -------------------------------------------------------
         REFRESH UI
      ------------------------------------------------------- */

      setPendingRequests(updatedRequests);
      setAgents(updatedAgents);
    } catch (error) {
      console.error(
        "Failed to approve agent:",
        error
      );
    } finally {
      setTimeout(() => {
        setProcessingId(null);
      }, 300);
    }
  };

  /* =========================================================
     REJECT AGENT
  ========================================================= */

  const handleReject = (requestId) => {
    setProcessingId(requestId);

    try {
      const storedRequests = JSON.parse(
        localStorage.getItem("agencyPendingAgents") || "[]"
      );

      const selectedRequest = storedRequests.find(
        (request) => request.id === requestId
      );

      if (!selectedRequest) {
        return;
      }

      const now = new Date().toISOString();

      /* -------------------------------------------------------
         UPDATE REQUEST
      ------------------------------------------------------- */

      const updatedRequests = storedRequests.map(
        (request) => {
          if (request.id !== requestId) {
            return request;
          }

          return {
            ...request,
            status: "rejected",
            agentStatus: "rejected",
            rejectedAt: now,
          };
        }
      );

      localStorage.setItem(
        "agencyPendingAgents",
        JSON.stringify(updatedRequests)
      );

      /* -------------------------------------------------------
         UPDATE AGENCY AGENT IF EXISTS
      ------------------------------------------------------- */

      const storedAgents = JSON.parse(
        localStorage.getItem("agencyAgents") || "[]"
      );

      const updatedAgents = storedAgents.map((agent) => {
        if (
          agent.email?.toLowerCase() !==
          selectedRequest.email?.toLowerCase()
        ) {
          return agent;
        }

        return {
          ...agent,
          status: "rejected",
          agentStatus: "rejected",
          rejectedAt: now,
        };
      });

      localStorage.setItem(
        "agencyAgents",
        JSON.stringify(updatedAgents)
      );

      /* -------------------------------------------------------
         UPDATE CURRENT AGENT IF SAME BROWSER
      ------------------------------------------------------- */

      const storedCurrentAgent =
        localStorage.getItem("clearingAgent");

      if (storedCurrentAgent) {
        const currentAgent = JSON.parse(
          storedCurrentAgent
        );

        if (
          currentAgent.email?.toLowerCase() ===
          selectedRequest.email?.toLowerCase()
        ) {
          localStorage.setItem(
            "clearingAgent",
            JSON.stringify({
              ...currentAgent,
              agentStatus: "rejected",
              rejectedAt: now,
            })
          );
        }
      }

      /* -------------------------------------------------------
         REFRESH UI
      ------------------------------------------------------- */

      setPendingRequests(updatedRequests);
      setAgents(updatedAgents);
    } catch (error) {
      console.error(
        "Failed to reject agent:",
        error
      );
    } finally {
      setTimeout(() => {
        setProcessingId(null);
      }, 300);
    }
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (!agency || !currentAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-900">

      {/* =====================================================
          REUSABLE ADMIN SIDEBAR
      ===================================================== */}

      <AgentAdminSidebar />

      {/* =====================================================
          MAIN
      ===================================================== */}

      <div className="pt-[68px] lg:ml-[260px] lg:pt-0">

        {/* =====================================================
            TOP BAR
        ===================================================== */}

        <header className="sticky top-[68px] z-30 flex h-[70px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-xl sm:px-6 lg:top-0">

          <div className="flex items-center gap-3">

            <div>

              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
                Agency Workspace
              </p>

              <h1 className="text-base font-bold text-slate-800">
                Agents
              </h1>

            </div>

          </div>

          {/* REFRESH + NOTIFICATIONS */}

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={loadData}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
              title="Refresh"
            >
              <RefreshCw size={18} />
            </button>

            <button
              type="button"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
              title="Notifications"
            >
              <Bell size={18} />

              {agencyPendingRequests.length > 0 && (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
              )}
            </button>

          </div>

        </header>

        {/* =====================================================
            CONTENT
        ===================================================== */}

        <main className="mx-auto w-full max-w-[1180px] px-5 py-7 sm:px-8 lg:py-9">

          {/* HEADER */}

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

                <h2 className="text-[32px] font-bold tracking-[-0.04em] text-[#14213D] sm:text-[42px]">
                  Manage Agents
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-[15px]">
                  Review membership requests and
                  manage the agents in your agency.
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

          {/* =====================================================
              SUMMARY
          ===================================================== */}

          <section className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">

            <SummaryCard
              icon={Users}
              label="Total Agents"
              value={
                activeAgents.length +
                agencyPendingRequests.length
              }
              iconStyle="bg-blue-50 text-blue-600"
            />

            <SummaryCard
              icon={Clock3}
              label="Pending Requests"
              value={agencyPendingRequests.length}
              iconStyle="bg-amber-50 text-amber-700"
            />

            <SummaryCard
              icon={CheckCircle2}
              label="Active Agents"
              value={activeAgents.length}
              iconStyle="bg-emerald-50 text-emerald-700"
            />

          </section>

          {/* =====================================================
              PENDING REQUESTS
          ===================================================== */}

          <section className="mb-7">

            <div className="mb-4 flex items-center justify-between">

              <div>

                <h2 className="text-base font-bold text-[#14213D]">
                  Pending Requests
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Agents waiting for your approval.
                </p>

              </div>

              <button
                type="button"
                onClick={loadData}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                <RefreshCw size={15} />
                Refresh
              </button>

            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,.02)]">

              {agencyPendingRequests.length === 0 ? (

                <EmptyState
                  icon={CheckCircle2}
                  title="No pending requests"
                  description="New agent membership requests will appear here."
                />

              ) : (

                <div className="divide-y divide-slate-100">

                  {agencyPendingRequests.map(
                    (request) => (

                      <AgentRow
                        key={request.id}
                        agent={request}
                        pending
                        processing={
                          processingId === request.id
                        }
                        onApprove={() =>
                          handleApprove(request.id)
                        }
                        onReject={() =>
                          handleReject(request.id)
                        }
                      />

                    )
                  )}

                </div>

              )}

            </div>

          </section>

          {/* =====================================================
              ACTIVE AGENTS
          ===================================================== */}

          <section>

            <div className="mb-4">

              <h2 className="text-base font-bold text-[#14213D]">
                Active Agents
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Agents approved to work under your agency.
              </p>

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

                    <AgentRow
                      key={agent.id}
                      agent={agent}
                    />

                  ))}

                </div>

              )}

            </div>

          </section>

          {/* FOOTER */}

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

function AgentRow({
  agent,
  pending = false,
  processing = false,
  onApprove,
  onReject,
}) {
  return (
    <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">

      <div className="flex min-w-0 items-center gap-3">

        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#173563] text-sm font-bold text-white">
          {agent.photo ||
          agent.profilePhoto ||
          agent.image ? (
            <img
              src={
                agent.photo ||
                agent.profilePhoto ||
                agent.image
              }
              alt={agent.name || "Agent"}
              className="h-full w-full object-cover"
            />
          ) : (
            getInitials(agent.name)
          )}
        </div>

        <div className="min-w-0">

          <div className="flex flex-wrap items-center gap-2">

            <p className="text-base font-bold text-slate-800">
              {agent.name || "Agent"}
            </p>

            {pending ? (

              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-700">
                <Clock3 size={11} />
                Pending
              </span>

            ) : (

              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
                <CheckCircle2 size={11} />
                Active
              </span>

            )}

          </div>

          <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-slate-400">

            <span className="inline-flex items-center gap-1.5">
              <Mail size={12} />
              {agent.email || "No email"}
            </span>

            {agent.requestedAt && (
              <span>
                Requested{" "}
                {formatDate(agent.requestedAt)}
              </span>
            )}

          </div>

        </div>

      </div>

      {pending && (

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

            {processing
              ? "Updating..."
              : "Approve"}

          </button>

        </div>

      )}

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
  iconStyle,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)]">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-xs font-semibold text-slate-400">
            {label}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-800">
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

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">

      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
        <Icon size={22} />
      </div>

      <h3 className="mt-4 text-base font-bold text-slate-700">
        {title}
      </h3>

      <p className="mt-1 max-w-sm text-sm leading-5 text-slate-400">
        {description}
      </p>

    </div>
  );
}

/* =========================================================
   DATE
========================================================= */

function formatDate(date) {
  try {
    return new Date(date).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  } catch {
    return "";
  }
}

/* =========================================================
   INITIALS
========================================================= */

function getInitials(name) {
  if (!name) {
    return "AG";
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

export default AgencyAgents;
