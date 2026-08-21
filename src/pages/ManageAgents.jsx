import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Clipboard,
  Clock3,
  Mail,
  ShieldCheck,
  User,
  UserCheck,
  UserX,
  X,
} from "lucide-react";

function ManageAgents() {
  const navigate = useNavigate();

  const [agency, setAgency] = useState(null);
  const [agents, setAgents] = useState([]);
  const [copied, setCopied] = useState(false);

  /* =========================================================
     LOAD AGENCY + AGENTS
  ========================================================= */

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      const storedAgency = localStorage.getItem("agency");

      if (storedAgency) {
        setAgency(JSON.parse(storedAgency));
      }

      const storedAgents = localStorage.getItem("agencyAgents");

      if (storedAgents) {
        const parsedAgents = JSON.parse(storedAgents);

        if (Array.isArray(parsedAgents)) {
          setAgents(parsedAgents);
        }
      }
    } catch (error) {
      console.error("Failed to load agency data:", error);
    }
  };

  /* =========================================================
     AGENCY CODE
  ========================================================= */

  const agencyCode = useMemo(() => {
    if (agency?.agencyCode) {
      return agency.agencyCode;
    }

    if (agency?.code) {
      return agency.code;
    }

    return "IE-AG-7K4P9";
  }, [agency]);

  /* =========================================================
     COPY AGENCY CODE
  ========================================================= */

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(agencyCode);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  /* =========================================================
     UPDATE AGENT STATUS
  ========================================================= */

  const updateAgentStatus = (agentId, status) => {
    const updatedAgents = agents.map((agent) =>
      agent.id === agentId
        ? {
            ...agent,
            status,
          }
        : agent
    );

    setAgents(updatedAgents);

    localStorage.setItem(
      "agencyAgents",
      JSON.stringify(updatedAgents)
    );
  };

  /* =========================================================
     APPROVE
  ========================================================= */

  const handleApprove = (agentId) => {
    updateAgentStatus(agentId, "approved");
  };

  /* =========================================================
     REJECT
  ========================================================= */

  const handleReject = (agentId) => {
    updateAgentStatus(agentId, "rejected");
  };

  /* =========================================================
     REMOVE AGENT
  ========================================================= */

  const handleRemove = (agentId) => {
    const updatedAgents = agents.filter(
      (agent) => agent.id !== agentId
    );

    setAgents(updatedAgents);

    localStorage.setItem(
      "agencyAgents",
      JSON.stringify(updatedAgents)
    );
  };

  /* =========================================================
     FILTER AGENTS
  ========================================================= */

  const pendingAgents = agents.filter(
    (agent) => agent.status === "pending"
  );

  const approvedAgents = agents.filter(
    (agent) => agent.status === "approved"
  );

  const rejectedAgents = agents.filter(
    (agent) => agent.status === "rejected"
  );

  /* =========================================================
     AGENT CARD
  ========================================================= */

  const AgentCard = ({ agent, type }) => {
    const initials =
      agent.name
        ?.split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "AG";

    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-200 hover:shadow-sm">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          {/* AGENT INFO */}

          <div className="flex min-w-0 items-center gap-3">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#173563] text-xs font-bold text-white">
              {initials}
            </div>

            <div className="min-w-0">

              <h3 className="truncate text-sm font-bold text-slate-900">
                {agent.name || "Agent"}
              </h3>

              <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                <Mail size={13} />
                <span className="truncate">
                  {agent.email || "No email"}
                </span>
              </div>

              {agent.licenseNumber && (
                <p className="mt-1 text-[10px] text-slate-400">
                  License: {agent.licenseNumber}
                </p>
              )}

            </div>

          </div>

          {/* STATUS + ACTIONS */}

          <div className="flex flex-wrap items-center gap-2">

            {type === "pending" && (
              <>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-700">
                  <Clock3 size={11} />
                  Pending
                </span>

                <button
                  type="button"
                  onClick={() => handleApprove(agent.id)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-emerald-700"
                >
                  <Check size={14} />
                  Approve
                </button>

                <button
                  type="button"
                  onClick={() => handleReject(agent.id)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[11px] font-semibold text-red-600 transition hover:bg-red-100"
                >
                  <X size={14} />
                  Reject
                </button>
              </>
            )}

            {type === "approved" && (
              <>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
                  <CheckCircle2 size={11} />
                  Approved
                </span>

                <button
                  type="button"
                  onClick={() => handleRemove(agent.id)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-[11px] font-semibold text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                  <UserX size={14} />
                  Remove
                </button>
              </>
            )}

            {type === "rejected" && (
              <>
                <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-semibold text-red-600">
                  <UserX size={11} />
                  Rejected
                </span>

                <button
                  type="button"
                  onClick={() => handleApprove(agent.id)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#173563] px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-[#102547]"
                >
                  <UserCheck size={14} />
                  Approve
                </button>
              </>
            )}

          </div>

        </div>

      </div>
    );
  };

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-900">

      {/* HEADER */}

      <header className="border-b border-slate-200 bg-white">

        <div className="mx-auto flex h-[68px] max-w-[1180px] items-center justify-between px-5 sm:px-8">

          <Link
            to="/agent-admin-dashboard"
            className="flex items-center gap-2 text-xs font-semibold text-slate-500 transition hover:text-[#173563]"
          >
            <ArrowLeft size={16} />
            Back to dashboard
          </Link>

          <div className="flex items-center gap-2">

            <img
              src="/logo.jpeg"
              alt="ImportEase"
              className="h-9 w-9 object-contain mix-blend-multiply"
            />

            <div className="hidden sm:block">
              <p className="text-sm font-bold text-[#173563]">
                Import<span className="text-slate-900">Ease</span>
              </p>

              <p className="text-[8px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                Agency Administration
              </p>
            </div>

          </div>

        </div>

      </header>

      {/* MAIN */}

      <main className="mx-auto w-full max-w-[1180px] px-5 py-8 sm:px-8 lg:py-10">

        {/* PAGE HEADER */}

        <section className="mb-8">

          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

            <div>

              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5">

                <ShieldCheck
                  size={13}
                  className="text-blue-600"
                />

                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-700">
                  Agency management
                </span>

              </div>

              <h1 className="text-3xl font-bold tracking-tight text-[#14213D] sm:text-4xl">
                Manage Agents
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Review your agency members, approve new agents, and
                manage access to your clearing workspace.
              </p>

            </div>

            <Link
              to="/agent-admin-dashboard"
              className="inline-flex items-center justify-center rounded-xl bg-[#173563] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#102547]"
            >
              Admin Dashboard
            </Link>

          </div>

        </section>

        {/* =====================================================
            AGENCY CODE
        ===================================================== */}

        <section className="mb-8 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm sm:p-6">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-start gap-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <ShieldCheck size={19} />
              </div>

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400">
                  Agency join code
                </p>

                <h2 className="mt-1 text-base font-bold text-slate-900">
                  Invite your clearing agents
                </h2>

                <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500">
                  Give this code to trusted agents. They can use it
                  during registration to request access to your agency.
                </p>

              </div>

            </div>

            <div className="flex items-center gap-2">

              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">

                <span className="font-mono text-sm font-bold tracking-wider text-[#173563]">
                  {agencyCode}
                </span>

              </div>

              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#173563] px-4 text-xs font-semibold text-white transition hover:bg-[#102547]"
              >
                {copied ? (
                  <>
                    <Check size={15} />
                    Copied
                  </>
                ) : (
                  <>
                    <Clipboard size={15} />
                    Copy
                  </>
                )}
              </button>

            </div>

          </div>

        </section>

        {/* =====================================================
            STATS
        ===================================================== */}

        <section className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">

          <StatCard
            icon={Clock3}
            label="Pending"
            value={pendingAgents.length}
            description="Waiting for approval"
            iconStyle="bg-amber-50 text-amber-700"
          />

          <StatCard
            icon={UserCheck}
            label="Approved"
            value={approvedAgents.length}
            description="Active agency members"
            iconStyle="bg-emerald-50 text-emerald-700"
          />

          <StatCard
            icon={User}
            label="Total agents"
            value={agents.length}
            description="All registered members"
            iconStyle="bg-blue-50 text-blue-600"
          />

        </section>

        {/* =====================================================
            PENDING AGENTS
        ===================================================== */}

        <section className="mb-8">

          <div className="mb-4 flex items-center justify-between">

            <div>

              <h2 className="text-base font-bold text-[#14213D]">
                Pending approval
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Agents waiting to join your agency.
              </p>

            </div>

            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700">
              {pendingAgents.length}
            </span>

          </div>

          {pendingAgents.length > 0 ? (
            <div className="space-y-3">

              {pendingAgents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  type="pending"
                />
              ))}

            </div>
          ) : (
            <EmptyState
              icon={Clock3}
              title="No pending agents"
              description="New agent requests will appear here."
            />
          )}

        </section>

        {/* =====================================================
            APPROVED AGENTS
        ===================================================== */}

        <section className="mb-8">

          <div className="mb-4 flex items-center justify-between">

            <div>

              <h2 className="text-base font-bold text-[#14213D]">
                Approved agents
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Agents who currently have access to your agency.
              </p>

            </div>

            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
              {approvedAgents.length}
            </span>

          </div>

          {approvedAgents.length > 0 ? (
            <div className="space-y-3">

              {approvedAgents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  type="approved"
                />
              ))}

            </div>
          ) : (
            <EmptyState
              icon={UserCheck}
              title="No approved agents"
              description="Approved agency members will appear here."
            />
          )}

        </section>

        {/* =====================================================
            REJECTED AGENTS
        ===================================================== */}

        {rejectedAgents.length > 0 && (
          <section>

            <div className="mb-4">

              <h2 className="text-base font-bold text-[#14213D]">
                Rejected requests
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Agent requests that were rejected.
              </p>

            </div>

            <div className="space-y-3">

              {rejectedAgents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  type="rejected"
                />
              ))}

            </div>

          </section>
        )}

        {/* FOOTER */}

        <div className="mt-10 flex items-center justify-center gap-2 border-t border-slate-200 pt-6 text-center text-[10px] text-slate-400">

          <CheckCircle2 size={12} />

          <span>
            ImportEase · Agency Administration
          </span>

        </div>

      </main>

    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  icon: Icon,
  label,
  value,
  description,
  iconStyle,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">

      <div className="flex items-center justify-between">

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconStyle}`}
        >
          <Icon size={17} />
        </div>

        <span className="text-2xl font-bold text-slate-900">
          {value}
        </span>

      </div>

      <p className="mt-4 text-xs font-bold text-slate-800">
        {label}
      </p>

      <p className="mt-1 text-[10px] text-slate-400">
        {description}
      </p>

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
    <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-10 text-center">

      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
        <Icon size={18} />
      </div>

      <h3 className="mt-3 text-sm font-bold text-slate-700">
        {title}
      </h3>

      <p className="mt-1 text-xs text-slate-400">
        {description}
      </p>

    </div>
  );
}

export default ManageAgents;