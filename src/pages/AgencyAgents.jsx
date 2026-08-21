import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Check,
  CheckCircle2,
  Clock3,
  ClipboardList,
  FileText,
  Mail,
  Menu,
  RefreshCw,
  Settings,
  UserPlus,
  Users,
  LogOut,
  X,
} from "lucide-react";

function AgencyAgents() {
  const navigate = useNavigate();

  const [agency, setAgency] = useState(null);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [agents, setAgents] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  /* =========================================================
     LOAD DATA
  ========================================================= */

  const loadData = () => {
    try {
      const storedAgency =
        localStorage.getItem("clearingAgency");

      const storedAdmin =
        localStorage.getItem("clearingAgent");

      if (!storedAgency || !storedAdmin) {
        navigate("/agent-signin");
        return;
      }

      const parsedAgency = JSON.parse(storedAgency);
      const parsedAdmin = JSON.parse(storedAdmin);

      if (parsedAdmin.role !== "admin") {
        navigate("/agent-signin");
        return;
      }

      const storedAgents =
        JSON.parse(
          localStorage.getItem("agencyAgents") || "[]"
        );

      const storedPendingRequests =
        JSON.parse(
          localStorage.getItem("agencyPendingAgents") || "[]"
        );

      setAgency(parsedAgency);
      setCurrentAdmin(parsedAdmin);
      setAgents(storedAgents);
      setPendingRequests(storedPendingRequests);
    } catch (error) {
      console.error(
        "Failed to load agency agents:",
        error
      );

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
        request.agencyId ||
        request.agencyCode;

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
        agent.agencyId ||
        agent.agencyCode;

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
      const storedRequests =
        JSON.parse(
          localStorage.getItem(
            "agencyPendingAgents"
          ) || "[]"
        );

      const selectedRequest =
        storedRequests.find(
          (request) => request.id === requestId
        );

      if (!selectedRequest) {
        return;
      }

      const now = new Date().toISOString();

      /* -------------------------------------------------------
         UPDATE PENDING REQUEST
      ------------------------------------------------------- */

      const updatedRequests =
        storedRequests.map((request) => {
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

      const storedAgents =
        JSON.parse(
          localStorage.getItem("agencyAgents") || "[]"
        );

      const existingAgentIndex =
        storedAgents.findIndex(
          (agent) =>
            agent.email?.toLowerCase() ===
            selectedRequest.email?.toLowerCase()
        );

      const approvedAgent = {
        id:
          selectedRequest.id ||
          `agent-${Date.now()}`,

        name: selectedRequest.name || "Agent",

        email: selectedRequest.email || "",

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
        const currentAgent =
          JSON.parse(storedCurrentAgent);

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
      const storedRequests =
        JSON.parse(
          localStorage.getItem(
            "agencyPendingAgents"
          ) || "[]"
        );

      const selectedRequest =
        storedRequests.find(
          (request) => request.id === requestId
        );

      if (!selectedRequest) {
        return;
      }

      const now = new Date().toISOString();

      /* -------------------------------------------------------
         UPDATE REQUEST
      ------------------------------------------------------- */

      const updatedRequests =
        storedRequests.map((request) => {
          if (request.id !== requestId) {
            return request;
          }

          return {
            ...request,
            status: "rejected",
            agentStatus: "rejected",
            rejectedAt: now,
          };
        });

      localStorage.setItem(
        "agencyPendingAgents",
        JSON.stringify(updatedRequests)
      );

      /* -------------------------------------------------------
         UPDATE AGENCY AGENT IF EXISTS
      ------------------------------------------------------- */

      const storedAgents =
        JSON.parse(
          localStorage.getItem("agencyAgents") || "[]"
        );

      const updatedAgents =
        storedAgents.map((agent) => {
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
        const currentAgent =
          JSON.parse(storedCurrentAgent);

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
     LOGOUT
  ========================================================= */

  const handleLogout = () => {
    localStorage.removeItem("clearingAgent");
    localStorage.removeItem("agentOnboardingType");
    localStorage.removeItem("agentOnboardingComplete");

    navigate("/agent-signin");
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
          MOBILE OVERLAY
      ===================================================== */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[250px] flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        {/* LOGO */}

        <div className="flex h-[70px] items-center border-b border-slate-100 px-5">

          <Link
            to="/agent-admin-dashboard"
            className="flex items-center gap-3"
            onClick={() =>
              setSidebarOpen(false)
            }
          >

            <img
              src="/logo.jpeg"
              alt="ImportEase"
              className="h-9 w-9 object-contain mix-blend-multiply"
            />

            <div>

              <p className="text-[16px] font-bold tracking-tight text-[#173563]">
                Import
                <span className="text-slate-900">
                  Ease
                </span>
              </p>

              <p className="text-[8px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                Agent Platform
              </p>

            </div>

          </Link>

          <button
            type="button"
            onClick={() =>
              setSidebarOpen(false)
            }
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 lg:hidden"
          >
            <X size={18} />
          </button>

        </div>

        {/* AGENCY */}

        <div className="border-b border-slate-100 p-4">

          <div className="rounded-xl bg-slate-50 p-3">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#173563] text-white">
                <Building2 size={17} />
              </div>

              <div className="min-w-0">

                <p className="truncate text-xs font-bold text-slate-800">
                  {agency.agencyName ||
                    agency.name ||
                    "Your Agency"}
                </p>

                <p className="mt-0.5 text-[9px] text-slate-400">
                  Agency Admin
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* NAVIGATION */}

        <nav className="flex-1 space-y-1 p-3">

          <SidebarItem
            icon={Building2}
            label="Dashboard"
            to="/agent-admin-dashboard"
            onClick={() =>
              setSidebarOpen(false)
            }
          />

          <SidebarItem
            icon={Users}
            label="Agents"
            active
            to="/agency-agents"
            onClick={() =>
              setSidebarOpen(false)
            }
          />

          <SidebarItem
            icon={UserPlus}
            label="Invite Agents"
            to="/agency-invite"
            onClick={() =>
              setSidebarOpen(false)
            }
          />

          <SidebarItem
            icon={ClipboardList}
            label="SME Requests"
            to="/agent-marketplace"
            onClick={() =>
              setSidebarOpen(false)
            }
          />

          <SidebarItem
            icon={FileText}
            label="Shipments"
            to="/agent-shipments"
            onClick={() =>
              setSidebarOpen(false)
            }
          />

        </nav>

        {/* BOTTOM */}

        <div className="border-t border-slate-100 p-3">

          <SidebarItem
            icon={Settings}
            label="Settings"
            to="/agent-settings"
            onClick={() =>
              setSidebarOpen(false)
            }
          />

          <button
            type="button"
            onClick={handleLogout}
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
          >
            <LogOut size={17} />
            Logout
          </button>

        </div>

      </aside>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <div className="lg:ml-[250px]">

        {/* TOP BAR */}

        <header className="sticky top-0 z-30 flex h-[70px] items-center border-b border-slate-200 bg-white/95 px-5 backdrop-blur-xl sm:px-8">

          <button
            type="button"
            onClick={() =>
              setSidebarOpen(true)
            }
            className="mr-3 flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <Menu size={19} />
          </button>

          <div>

            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
              Agency workspace
            </p>

            <h1 className="text-sm font-bold text-slate-800">
              Agents
            </h1>

          </div>

          <div className="ml-auto flex items-center gap-3">

            <div className="hidden h-7 w-px bg-slate-200 sm:block" />

            <div className="flex items-center gap-2">

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#173563] text-[10px] font-bold text-white">
                {getInitials(
                  currentAdmin.name || "Admin"
                )}
              </div>

              <div className="hidden sm:block">

                <p className="text-xs font-semibold text-slate-800">
                  {currentAdmin.name ||
                    "Agency Admin"}
                </p>

                <p className="text-[9px] text-slate-400">
                  Administrator
                </p>

              </div>

            </div>

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
              className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              <ArrowLeft size={14} />
              Back to Dashboard
            </Link>

            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

              <div>

                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5">

                  <Users
                    size={13}
                    className="text-blue-600"
                  />

                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-700">
                    Agency members
                  </span>

                </div>

                <h2 className="text-[28px] font-bold tracking-[-0.04em] text-[#14213D] sm:text-[38px]">
                  Manage Agents
                </h2>

                <p className="mt-2 max-w-2xl text-[13px] leading-6 text-slate-500 sm:text-sm">
                  Review membership requests and
                  manage the agents in your agency.
                </p>

              </div>

              <Link
                to="/agency-invite"
                className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#173563] px-4 py-3 text-xs font-semibold text-white transition hover:bg-[#102547]"
              >
                <UserPlus size={15} />
                Invite Agent
              </Link>

            </div>

          </section>

          {/* SUMMARY */}

          <section className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-3">

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

                <h2 className="text-sm font-bold text-[#14213D]">
                  Pending requests
                </h2>

                <p className="mt-1 text-[11px] text-slate-500">
                  Agents waiting for your approval.
                </p>

              </div>

              <button
                type="button"
                onClick={loadData}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] font-semibold text-slate-600 hover:bg-slate-50"
              >
                <RefreshCw size={13} />
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

              <h2 className="text-sm font-bold text-[#14213D]">
                Active agents
              </h2>

              <p className="mt-1 text-[11px] text-slate-500">
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

          <div className="mt-9 flex items-center justify-center border-t border-slate-200 pt-6 text-center text-[10px] text-slate-400">
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

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#173563] text-xs font-bold text-white">
          {getInitials(agent.name)}
        </div>

        <div className="min-w-0">

          <div className="flex flex-wrap items-center gap-2">

            <p className="text-sm font-bold text-slate-800">
              {agent.name || "Agent"}
            </p>

            {pending ? (

              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[9px] font-semibold text-amber-700">
                <Clock3 size={10} />
                Pending
              </span>

            ) : (

              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-semibold text-emerald-700">
                <CheckCircle2 size={10} />
                Active
              </span>

            )}

          </div>

          <div className="mt-1 flex flex-wrap items-center gap-3 text-[10px] text-slate-400">

            <span className="inline-flex items-center gap-1">
              <Mail size={11} />
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
            className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-white px-3 py-2.5 text-[10px] font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={14} />
            Reject
          </button>

          <button
            type="button"
            onClick={onApprove}
            disabled={processing}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2.5 text-[10px] font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Check size={14} />

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

          <p className="text-[10px] font-semibold text-slate-400">
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
            size={18}
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

      <h3 className="mt-4 text-sm font-bold text-slate-700">
        {title}
      </h3>

      <p className="mt-1 max-w-sm text-[11px] leading-5 text-slate-400">
        {description}
      </p>

    </div>
  );
}

/* =========================================================
   SIDEBAR ITEM
========================================================= */

function SidebarItem({
  icon: Icon,
  label,
  to,
  active = false,
  onClick,
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
        active
          ? "bg-blue-50 text-[#173563]"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
      }`}
    >

      <Icon
        size={17}
        strokeWidth={1.8}
      />

      <span>{label}</span>

    </Link>
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