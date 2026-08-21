import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Clock3,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

function AgentPending() {
  const navigate = useNavigate();

  const [agent, setAgent] = useState(null);
  const [checking, setChecking] = useState(false);

  /* =========================================================
     LOAD AGENT
  ========================================================= */

  const loadAgent = () => {
    try {
      const storedAgent =
        localStorage.getItem("clearingAgent");

      if (!storedAgent) {
        navigate("/agent-signin");
        return;
      }

      const parsedAgent = JSON.parse(storedAgent);

      setAgent(parsedAgent);

      /*
       * Support both:
       *
       * agentStatus
       * status
       *
       * This keeps the flow compatible with
       * the Agency Admin dashboard.
       */

      const status =
        parsedAgent.agentStatus ||
        parsedAgent.status ||
        "pending";

      /*
       * If approved, go to the existing
       * Agent Dashboard.
       */

      if (status === "approved") {
        setTimeout(() => {
          navigate("/agent-dashboard", {
            replace: true,
          });
        }, 500);
      }
    } catch (error) {
      console.error(
        "Failed to load agent:",
        error
      );

      navigate("/agent-signin");
    }
  };

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    loadAgent();
  }, []);

  /* =========================================================
     CHECK APPROVAL
  ========================================================= */

  const handleRefresh = () => {
    setChecking(true);

    setTimeout(() => {
      loadAgent();
      setChecking(false);
    }, 500);
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (!agent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">

        <div className="text-center">

          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#173563]" />

          <p className="mt-3 text-sm text-slate-500">
            Loading...
          </p>

        </div>

      </div>
    );
  }

  /* =========================================================
     STATUS
  ========================================================= */

  const status =
    agent.agentStatus ||
    agent.status ||
    "pending";

  /* =========================================================
     APPROVED
  ========================================================= */

  if (status === "approved") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4">

        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">

            <CheckCircle2 size={28} />

          </div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            You're approved!
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Your agency administrator approved your
            membership. You can now access the agent
            workspace.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/agent-dashboard")
            }
            className="mt-6 w-full rounded-xl bg-[#173563] py-3 text-sm font-semibold text-white transition hover:bg-[#102547]"
          >
            Open Agent Dashboard
          </button>

        </div>

      </div>
    );
  }

  /* =========================================================
     REJECTED
  ========================================================= */

  if (status === "rejected") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4">

        <div className="w-full max-w-md rounded-3xl border border-red-200 bg-white p-8 text-center shadow-xl">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">

            <ShieldCheck size={28} />

          </div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Request not approved
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Your agency administrator did not approve
            this membership request.
          </p>

          {agent.rejectionReason && (
            <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4 text-left">

              <p className="text-[10px] font-bold uppercase tracking-wider text-red-400">
                Reason
              </p>

              <p className="mt-1 text-sm text-red-700">
                {agent.rejectionReason}
              </p>

            </div>
          )}

          <Link
            to="/join-agency"
            className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[#173563] py-3 text-sm font-semibold text-white transition hover:bg-[#102547]"
          >
            Try Another Agency
          </Link>

        </div>

      </div>
    );
  }

  /* =========================================================
     PENDING
  ========================================================= */

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F8FAFC] px-4 py-8">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-100/50 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-slate-200/50 blur-3xl" />

      {/* =====================================================
          CONTAINER
      ===================================================== */}

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-lg flex-col justify-center">

        {/* =====================================================
            LOGO
        ===================================================== */}

        <div className="mb-7 flex justify-center">

          <Link
            to="/"
            className="flex items-center gap-3"
          >

            <img
              src="/logo.jpeg"
              alt="ImportEase"
              className="h-16 w-16 object-contain mix-blend-multiply"
            />

            <span className="text-2xl font-bold tracking-tight text-slate-900">

              Import

              <span className="text-[#173563]">
                Ease
              </span>

            </span>

          </Link>

        </div>

        {/* =====================================================
            CARD
        ===================================================== */}

        <div className="rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-[0_20px_60px_-15px_rgba(15,23,42,0.15)] sm:p-8">

          {/* =================================================
              ICON
          ================================================= */}

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">

            <Clock3 size={28} />

          </div>

          {/* =================================================
              STATUS
          ================================================= */}

          <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.14em] text-amber-600">
            Pending approval
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            Your request is pending
          </h1>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">

            Your request to join{" "}

            <span className="font-semibold text-slate-700">
              {agent.agencyName ||
                "the agency"}
            </span>{" "}

            has been submitted successfully.

          </p>

          {/* =================================================
              AGENCY
          ================================================= */}

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#173563] shadow-sm">

                <Building2 size={19} />

              </div>

              <div className="min-w-0">

                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
                  Agency
                </p>

                <p className="mt-0.5 truncate text-sm font-bold text-slate-800">
                  {agent.agencyName ||
                    "Clearing Agency"}
                </p>

                {agent.agencyCode && (
                  <p className="mt-1 font-mono text-[10px] font-semibold text-slate-400">
                    {agent.agencyCode}
                  </p>
                )}

              </div>

            </div>

          </div>

          {/* =================================================
              MESSAGE
          ================================================= */}

          <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-left">

            <div className="flex items-start gap-2">

              <ShieldCheck
                size={16}
                className="mt-0.5 shrink-0 text-blue-600"
              />

              <p className="text-xs leading-5 text-blue-700">

                Your agency administrator needs to
                approve your request before you can
                access marketplace and agency features.

              </p>

            </div>

          </div>

          {/* =================================================
              REQUEST DATE
          ================================================= */}

          {agent.requestedAt && (
            <p className="mt-4 text-[10px] text-slate-400">

              Request submitted{" "}

              {new Date(
                agent.requestedAt
              ).toLocaleDateString()}

            </p>
          )}

          {/* =================================================
              REFRESH
          ================================================= */}

          <button
            type="button"
            onClick={handleRefresh}
            disabled={checking}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >

            <RefreshCw
              size={16}
              className={
                checking
                  ? "animate-spin"
                  : ""
              }
            />

            {checking
              ? "Checking..."
              : "Check Approval Status"}

          </button>

          {/* =================================================
              BACK
          ================================================= */}

          <Link
            to="/agent-signin"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800"
          >

            <ArrowLeft size={15} />

            Back to Agent Sign In

          </Link>

        </div>

      </div>

    </div>
  );
}

export default AgentPending;