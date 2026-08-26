import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Clock3,
  BriefcaseBusiness,
  AlertTriangle,
} from "lucide-react";

function AgencyReview() {
  const navigate = useNavigate();

  const [agent, setAgent] = useState(null);
  const [showReject, setShowReject] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    const storedAgent = localStorage.getItem("individualAgent");

    if (storedAgent) {
      try {
        setAgent(JSON.parse(storedAgent));
      } catch {
        setAgent(null);
      }
    }
  }, []);

  const handleApprove = () => {
    if (!agent) return;

    const updatedAgent = {
      ...agent,
      status: "approved",
      verificationStatus: "approved",
      approvedAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "individualAgent",
      JSON.stringify(updatedAgent)
    );

    localStorage.setItem(
      "individualAgentStatus",
      "approved"
    );

    localStorage.setItem(
      "agentAccountStatus",
      "active"
    );

    navigate("/agent-dashboard");
  };

  const handleReject = () => {
    if (!agent) return;

    if (!rejectReason.trim()) {
      return;
    }

    const updatedAgent = {
      ...agent,
      status: "rejected",
      verificationStatus: "rejected",
      rejectionReason: rejectReason,
      rejectedAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "individualAgent",
      JSON.stringify(updatedAgent)
    );

    localStorage.setItem(
      "individualAgentStatus",
      "rejected"
    );

    setShowReject(false);
    setAgent(updatedAgent);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* =====================================================
          TOP NAVIGATION
      ===================================================== */}

      <header className="border-b border-slate-200 bg-white">

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          <Link
            to="/agent-admin-dashboard"
            className="flex items-center gap-3"
          >

            <img
              src="/logo.jpeg"
              alt="ImportEase"
              className="h-10 w-10 object-contain mix-blend-multiply"
            />

            <div>
              <p className="text-lg font-bold tracking-tight text-slate-900">
                Import
                <span className="text-[#173563]">
                  Ease
                </span>
              </p>

              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                Agency Administration
              </p>
            </div>

          </Link>

          <Link
            to="/agent-admin-dashboard"
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

        </div>

      </header>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Header */}

        <div className="mb-8">

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span>Agency Admin</span>
            <span>/</span>
            <span>Agent Review</span>
          </div>

          <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

            <div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Agent Application Review
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Review the applicant's information and verification
                documents before making a decision.
              </p>

            </div>

            {agent && (
              <StatusBadge status={agent.status} />
            )}

          </div>

        </div>

        {!agent ? (
          <EmptyState />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">

            {/* =================================================
                LEFT
            ================================================= */}

            <div className="space-y-6">

              {/* Applicant */}
              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

                <div className="border-b border-slate-100 p-5">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <User size={20} />
                    </div>

                    <div>
                      <h2 className="font-bold text-slate-900">
                        Applicant Information
                      </h2>

                      <p className="text-xs text-slate-500">
                        Personal information submitted by the agent
                      </p>
                    </div>

                  </div>

                </div>

                <div className="grid gap-4 p-5 sm:grid-cols-2">

                  <Detail
                    icon={<User size={16} />}
                    label="Full Name"
                    value={agent.fullName}
                  />

                  <Detail
                    icon={<Mail size={16} />}
                    label="Email Address"
                    value={agent.email}
                  />

                  <Detail
                    icon={<Phone size={16} />}
                    label="Phone Number"
                    value={agent.phone}
                  />

                  <Detail
                    icon={<BriefcaseBusiness size={16} />}
                    label="Agent ID"
                    value={agent.agentId}
                  />

                  <div className="sm:col-span-2">
                    <Detail
                      icon={<MapPin size={16} />}
                      label="Address"
                      value={agent.address}
                    />
                  </div>

                </div>

              </section>

              {/* License */}
              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

                <div className="border-b border-slate-100 p-5">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <ShieldCheck size={20} />
                    </div>

                    <div>
                      <h2 className="font-bold text-slate-900">
                        License Information
                      </h2>

                      <p className="text-xs text-slate-500">
                        Professional clearing agent details
                      </p>
                    </div>

                  </div>

                </div>

                <div className="grid gap-4 p-5 sm:grid-cols-2">

                  <Detail
                    icon={<ShieldCheck size={16} />}
                    label="License Number"
                    value={agent.licenseNumber}
                  />

                  <Detail
                    icon={<Clock3 size={16} />}
                    label="License Expiry"
                    value={agent.licenseExpiry}
                  />

                  <Detail
                    icon={<BriefcaseBusiness size={16} />}
                    label="Experience"
                    value={formatExperience(agent.experience)}
                  />

                  <Detail
                    icon={<CheckCircle2 size={16} />}
                    label="Verification"
                    value="Documents Submitted"
                  />

                </div>

              </section>

              {/* Documents */}
              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

                <div className="border-b border-slate-100 p-5">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                      <FileText size={20} />
                    </div>

                    <div>
                      <h2 className="font-bold text-slate-900">
                        Submitted Documents
                      </h2>

                      <p className="text-xs text-slate-500">
                        Documents attached to this application
                      </p>
                    </div>

                  </div>

                </div>

                <div className="space-y-3 p-5">

                  <DocumentRow
                    title="Clearing License"
                    file={agent.documents?.license}
                  />

                  <DocumentRow
                    title="Identity Document"
                    file={agent.documents?.identity}
                  />

                  <DocumentRow
                    title="Professional Certificate"
                    file={agent.documents?.certificate}
                  />

                </div>

              </section>

            </div>

            {/* =================================================
                RIGHT SIDEBAR
            ================================================= */}

            <aside className="space-y-6">

              {/* Decision card */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                <h2 className="font-bold text-slate-900">
                  Application Decision
                </h2>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Review all submitted information before approving
                  or rejecting this application.
                </p>

                {agent.status === "pending" && (
                  <div className="mt-5 space-y-3">

                    <button
                      type="button"
                      onClick={handleApprove}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/10 transition hover:bg-emerald-700"
                    >
                      <CheckCircle2 size={18} />
                      Approve Agent
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowReject(true)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50"
                    >
                      <XCircle size={18} />
                      Reject Application
                    </button>

                  </div>
                )}

                {agent.status === "approved" && (
                  <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">

                    <div className="flex items-center gap-2 text-emerald-700">

                      <CheckCircle2 size={18} />

                      <span className="text-sm font-bold">
                        Application Approved
                      </span>

                    </div>

                    <p className="mt-2 text-xs leading-5 text-emerald-700">
                      This agent can now access the clearing agent
                      dashboard.
                    </p>

                  </div>
                )}

                {agent.status === "rejected" && (
                  <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">

                    <div className="flex items-center gap-2 text-red-700">

                      <XCircle size={18} />

                      <span className="text-sm font-bold">
                        Application Rejected
                      </span>

                    </div>

                    <p className="mt-2 text-xs leading-5 text-red-700">
                      {agent.rejectionReason}
                    </p>

                  </div>
                )}

              </section>

              {/* Review checklist */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                <h2 className="font-bold text-slate-900">
                  Review Checklist
                </h2>

                <div className="mt-4 space-y-3">

                  <ChecklistItem
                    label="Personal information provided"
                    checked={Boolean(agent.fullName && agent.email)}
                  />

                  <ChecklistItem
                    label="Agent ID provided"
                    checked={Boolean(agent.agentId)}
                  />

                  <ChecklistItem
                    label="Clearing license submitted"
                    checked={Boolean(agent.licenseNumber)}
                  />

                  <ChecklistItem
                    label="Identity document submitted"
                    checked={Boolean(agent.documents?.identity)}
                  />

                  <ChecklistItem
                    label="Professional certificate submitted"
                    checked={Boolean(agent.documents?.certificate)}
                  />

                  <ChecklistItem
                    label="Applicant declaration accepted"
                    checked={Boolean(agent.declarationAccepted)}
                  />

                </div>

              </section>

              {/* Warning */}
              <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">

                <div className="flex items-start gap-3">

                  <AlertTriangle
                    size={18}
                    className="mt-0.5 shrink-0 text-amber-600"
                  />

                  <p className="text-xs leading-5 text-amber-800">
                    Approve the application only after confirming
                    that the submitted license and identity details
                    are valid.
                  </p>

                </div>

              </div>

            </aside>

          </div>
        )}

      </main>

      {/* =====================================================
          REJECT MODAL
      ===================================================== */}

      {showReject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <XCircle size={20} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Reject Application
                </h2>

                <p className="text-xs text-slate-500">
                  Provide a reason for the rejection.
                </p>
              </div>

            </div>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
              placeholder="Enter rejection reason..."
              className="mt-5 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-red-400 focus:ring-4 focus:ring-red-400/10"
            />

            <div className="mt-5 flex gap-3">

              <button
                type="button"
                onClick={() => {
                  setShowReject(false);
                  setRejectReason("");
                }}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleReject}
                disabled={!rejectReason.trim()}
                className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Confirm Rejection
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}


/* =========================================================
   DETAIL
========================================================= */

function Detail({
  icon,
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">

      <div className="flex items-center gap-2 text-slate-400">
        {icon}

        <span className="text-[10px] font-bold uppercase tracking-wide">
          {label}
        </span>
      </div>

      <p className="mt-2 break-words text-sm font-semibold text-slate-800">
        {value || "Not provided"}
      </p>

    </div>
  );
}


/* =========================================================
   DOCUMENT ROW
========================================================= */

function DocumentRow({
  title,
  file,
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50/70 p-4">

      <div className="flex min-w-0 items-center gap-3">

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm">
          <FileText size={17} />
        </div>

        <div className="min-w-0">

          <p className="text-sm font-semibold text-slate-800">
            {title}
          </p>

          <p className="mt-0.5 truncate text-xs text-slate-400">
            {file || "Document not submitted"}
          </p>

        </div>

      </div>

      {file && (
        <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-600">
          SUBMITTED
        </span>
      )}

    </div>
  );
}


/* =========================================================
   CHECKLIST
========================================================= */

function ChecklistItem({
  label,
  checked,
}) {
  return (
    <div className="flex items-center gap-3">

      <div
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
          checked
            ? "bg-emerald-100 text-emerald-600"
            : "bg-slate-100 text-slate-400"
        }`}
      >
        {checked && <CheckCircle2 size={13} />}
      </div>

      <span
        className={`text-xs ${
          checked
            ? "text-slate-600"
            : "text-slate-400"
        }`}
      >
        {label}
      </span>

    </div>
  );
}


/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({ status }) {
  if (status === "approved") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
        <CheckCircle2 size={14} />
        Approved
      </span>
    );
  }

  if (status === "rejected") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700">
        <XCircle size={14} />
        Rejected
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">
      <Clock3 size={14} />
      Pending Review
    </span>
  );
}


/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">

      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <User size={24} />
      </div>

      <h2 className="mt-5 text-lg font-bold text-slate-900">
        No application found
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
        There is currently no individual agent application
        available for review.
      </p>

      <Link
        to="/agent-admin-dashboard"
        className="mt-6 inline-flex items-center rounded-xl bg-[#173563] px-5 py-3 text-sm font-semibold text-white"
      >
        Back to Dashboard
      </Link>

    </div>
  );
}


/* =========================================================
   EXPERIENCE FORMATTER
========================================================= */

function formatExperience(value) {
  const values = {
    "less-than-1": "Less than 1 year",
    "1-3": "1 - 3 years",
    "3-5": "3 - 5 years",
    "5-10": "5 - 10 years",
    "10-plus": "10+ years",
  };

  return values[value] || value || "Not provided";
}

export default AgencyReview;