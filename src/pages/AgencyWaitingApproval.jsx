import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  CheckCircle2,
  Clock3,
  LogOut,
  RefreshCw,
  ShieldCheck,
  XCircle,
} from "lucide-react";

function AgencyWaitingApproval() {
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [status, setStatus] = useState("pending");
  const [checking, setChecking] = useState(false);

  /* =========================================================
     LOAD APPLICATION
  ========================================================= */

  const loadApplication = () => {
    try {
      const savedApplication = localStorage.getItem(
        "agencyJoinApplication"
      );

      const savedStatus =
        localStorage.getItem("agencyJoinStatus");

      if (!savedApplication) {
        navigate("/agent-signin");
        return;
      }

      const parsedApplication =
        JSON.parse(savedApplication);

      const currentStatus =
        savedStatus ||
        parsedApplication.status ||
        "pending";

      setApplication(parsedApplication);
      setStatus(currentStatus);

      /* =====================================================
         APPROVED
      ===================================================== */

      if (currentStatus === "approved") {
        navigate("/agent-dashboard");
        return;
      }
    } catch (error) {
      console.error(
        "Failed to load agency application:",
        error
      );

      navigate("/agent-signin");
    }
  };

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    loadApplication();
  }, []);

  /* =========================================================
     REFRESH STATUS
  ========================================================= */

  const handleRefresh = () => {
    setChecking(true);

    setTimeout(() => {
      loadApplication();

      setTimeout(() => {
        setChecking(false);
      }, 300);
    }, 300);
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

  if (!application) {
    return null;
  }

  /* =========================================================
     APPLICATION DATA
  ========================================================= */

  const applicantName =
    application.applicant?.fullName ||
    application.name ||
    "Agent";

  const applicantEmail =
    application.applicant?.email ||
    application.email ||
    "—";

  const agencyName =
    application.agencyName ||
    application.agency?.name ||
    "Your Agency";

  const applicationId =
    application.id ||
    "Pending Application";

  const requestedAt =
    application.requestedAt ||
    application.createdAt;

  const formattedDate = requestedAt
    ? new Date(requestedAt).toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      )
    : "Recently";

  /* =========================================================
     REJECTED STATE
  ========================================================= */

  if (status === "rejected") {
    return (
      <div className="min-h-screen bg-[#F6F8FB] text-slate-900">

        {/* ===================================================
            HEADER
        =================================================== */}

        <header className="flex h-[70px] items-center border-b border-slate-200 bg-white px-5 sm:px-8">

          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-3"
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

          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="ml-auto inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
          >
            <LogOut size={15} />
            Sign Out
          </button>

        </header>

        {/* ===================================================
            CONTENT
        =================================================== */}

        <main className="flex min-h-[calc(100vh-70px)] items-center justify-center px-5 py-10">

          <div className="w-full max-w-[560px]">

            {/* BADGE */}

            <div className="mb-4 flex justify-center">

              <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5">

                <XCircle
                  size={12}
                  className="text-red-600"
                />

                <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-red-600">
                  Request Rejected
                </span>

              </div>

            </div>

            {/* CARD */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-[0_2px_10px_rgba(15,23,42,.03)] sm:p-8">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <XCircle size={27} />
              </div>

              <h1 className="mt-5 text-[26px] font-bold tracking-[-0.04em] text-[#14213D]">
                Request not approved
              </h1>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Your request to join{" "}
                <span className="font-semibold text-slate-700">
                  {agencyName}
                </span>{" "}
                was not approved by the agency
                administrator.
              </p>

              {/* DETAILS */}

              <div className="mt-6 rounded-xl bg-slate-50 p-4 text-left">

                <DetailRow
                  label="Applicant"
                  value={applicantName}
                />

                <DetailRow
                  label="Email"
                  value={applicantEmail}
                />

                <DetailRow
                  label="Application ID"
                  value={applicationId}
                />

              </div>

              <button
                type="button"
                onClick={() => navigate("/agent-signin")}
                className="mt-6 w-full rounded-xl bg-[#173563] px-4 py-3 text-xs font-bold text-white transition hover:bg-[#102547]"
              >
                Return to Sign In
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Sign Out
              </button>

            </div>

            <p className="mt-6 text-center text-[10px] text-slate-400">
              ImportEase · Clearing Agency Platform
            </p>

          </div>

        </main>

      </div>
    );
  }

  /* =========================================================
     PENDING STATE
  ========================================================= */

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-900">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="flex h-[70px] items-center border-b border-slate-200 bg-white px-5 sm:px-8">

        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center gap-3"
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

        </button>

        <div className="ml-auto flex items-center gap-3">

          <div className="hidden text-right sm:block">

            <p className="text-xs font-semibold text-slate-800">
              {applicantName}
            </p>

            <p className="text-[9px] text-slate-400">
              Agency Member
            </p>

          </div>

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#173563] text-[10px] font-bold text-white">
            {getInitials(applicantName)}
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="ml-1 flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-50 hover:text-red-600"
            title="Sign out"
          >
            <LogOut size={16} />
          </button>

        </div>

      </header>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <main className="flex min-h-[calc(100vh-70px)] items-center justify-center px-5 py-10">

        <div className="w-full max-w-[620px]">

          {/* TOP BADGE */}

          <div className="mb-4 flex justify-center">

            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5">

              <ShieldCheck
                size={12}
                className="text-blue-600"
              />

              <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-blue-600">
                Agency Membership
              </span>

            </div>

          </div>

          {/* MAIN CARD */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_2px_10px_rgba(15,23,42,.03)] sm:p-8">

            {/* STATUS ICON */}

            <div className="flex justify-center">

              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">

                <Clock3
                  size={30}
                  strokeWidth={1.8}
                />

                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-amber-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                </span>

              </div>

            </div>

            {/* TITLE */}

            <div className="mt-5 text-center">

              <h1 className="text-[28px] font-bold leading-tight tracking-[-0.04em] text-[#14213D] sm:text-[32px]">
                Waiting for Approval
              </h1>

              <p className="mx-auto mt-2 max-w-lg text-[13px] leading-6 text-slate-500 sm:text-sm">
                Your request to join{" "}
                <span className="font-semibold text-slate-700">
                  {agencyName}
                </span>{" "}
                has been submitted successfully.
              </p>

            </div>

            {/* STATUS */}

            <div className="mt-7 rounded-xl border border-amber-100 bg-amber-50/60 p-4">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <Clock3 size={19} />
                </div>

                <div>

                  <p className="text-xs font-bold text-amber-800">
                    Pending Approval
                  </p>

                  <p className="mt-0.5 text-[10px] leading-5 text-amber-700/80">
                    The agency administrator needs to
                    review your request.
                  </p>

                </div>

              </div>

            </div>

            {/* APPLICATION DETAILS */}

            <div className="mt-5 rounded-xl bg-slate-50 p-4">

              <div className="mb-4 flex items-center gap-2">

                <Building2
                  size={15}
                  className="text-slate-500"
                />

                <p className="text-xs font-bold text-slate-700">
                  Application Details
                </p>

              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                <DetailRow
                  label="Agency"
                  value={agencyName}
                />

                <DetailRow
                  label="Applicant"
                  value={applicantName}
                />

                <DetailRow
                  label="Email"
                  value={applicantEmail}
                />

                <DetailRow
                  label="Application ID"
                  value={applicationId}
                />

                <DetailRow
                  label="Submitted"
                  value={formattedDate}
                />

                <DetailRow
                  label="Status"
                  value="Pending approval"
                  valueClass="text-amber-700"
                />

              </div>

            </div>

            {/* INFORMATION */}

            <div className="mt-5 flex gap-3 rounded-xl border border-blue-100 bg-blue-50/60 p-4">

              <ShieldCheck
                size={17}
                className="mt-0.5 shrink-0 text-blue-600"
              />

              <p className="text-[10px] leading-5 text-blue-700">
                You will get access to the agent workspace
                once the agency administrator approves
                your membership request.
              </p>

            </div>

            {/* REFRESH */}

            <button
              type="button"
              onClick={handleRefresh}
              disabled={checking}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#173563] px-4 py-3 text-xs font-bold text-white transition hover:bg-[#102547] disabled:cursor-not-allowed disabled:opacity-60"
            >

              <RefreshCw
                size={15}
                className={
                  checking
                    ? "animate-spin"
                    : ""
                }
              />

              {checking
                ? "Checking Status..."
                : "Refresh Approval Status"}

            </button>

            {/* SIGN OUT */}

            <button
              type="button"
              onClick={handleLogout}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
            >

              <LogOut size={14} />

              Sign Out

            </button>

          </div>

          {/* FOOTER */}

          <p className="mt-6 text-center text-[10px] text-slate-400">
            ImportEase · Clearing Agency Platform
          </p>

        </div>

      </main>

    </div>
  );
}

/* =========================================================
   DETAIL ROW
========================================================= */

function DetailRow({
  label,
  value,
  valueClass = "text-slate-700",
}) {
  return (
    <div className="min-w-0">

      <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400">
        {label}
      </p>

      <p
        className={`mt-1 truncate text-xs font-bold ${valueClass}`}
      >
        {value || "—"}
      </p>

    </div>
  );
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

export default AgencyWaitingApproval;