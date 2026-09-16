import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  FileMagnifyingGlass,
  ArrowsClockwise,
  ShieldCheck,
  UploadSimple,
  UserCheck,
} from "@phosphor-icons/react";

import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { landingPathForProfile } from "../lib/authErrors";

function AgentPending() {
  const navigate = useNavigate();
  const { user, refreshProfile, logout } = useAuth();

  const [checking, setChecking] = useState(false);
  const [checkedOnce, setCheckedOnce] = useState(false);

  const isIndependent = user?.role === "clearing_agent" && !!user?.isIndependent;
  // A real (non-independent) agency's own admin has no agency admin above
  // them -- they're waiting on the ImportEase platform to review the
  // agency itself, same as an independent agent waits on their own review.
  const isRealAgencyAdmin =
    user?.role === "clearing_agent" && !!user?.isAgencyAdmin && !user?.isIndependent;
  // A regular member who joined a real agency (not its admin, not independent).
  const isAgencyMember =
    user?.role === "clearing_agent" && !user?.isIndependent && !user?.isAgencyAdmin;
  const awaitingPlatformReview = isIndependent || isRealAgencyAdmin;
  // Individual humans being personally reviewed by ImportEase -- independent
  // agents and agency-member agents alike -- upload verification documents.
  // A real agency admin doesn't: their agency's own license/registration
  // fields (collected at signup) are what gets reviewed for them.
  const needsDocuments = isIndependent || isAgencyMember;
  const [docCount, setDocCount] = useState(null); // null = not loaded yet

  useEffect(() => {
    if (!needsDocuments || !user?.id) return;
    let active = true;
    api
      .get(`/users/${user.id}/verification-documents`)
      .then((docs) => {
        if (active) setDocCount(docs.length);
      })
      .catch(() => {
        if (active) setDocCount(0);
      });
    return () => {
      active = false;
    };
  }, [needsDocuments, user?.id]);

  const hasDocuments = docCount !== null && docCount > 0;

  const agent = user
    ? { fullName: user.name, email: user.email, licenseNumber: user.licenseNumber, agentId: user.agentId }
    : null;

  const handleCheckStatus = async () => {
    setChecking(true);
    try {
      const fresh = await refreshProfile();
      if (fresh?.agentStatus && fresh.agentStatus !== "pending") {
        navigate(landingPathForProfile(fresh), { replace: true });
        return;
      }
      setCheckedOnce(true);
    } catch {
      /* leave the page as-is */
    } finally {
      setChecking(false);
    }
  };

  const handleBackHome = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  // Already approved (e.g. arrived here from a stale link) -> go to the dashboard.
  if (user?.role === "clearing_agent" && user.agentStatus === "approved") {
    return <Navigate to={landingPathForProfile(user)} replace />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F8FAFC] px-4 py-8 sm:py-10">

      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-100/50 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-slate-200/50 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-2xl flex-col justify-center">

        {/* Logo */}
        <div className="mb-7 flex justify-center">
          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <img
              src="/logo.png"
              alt="ImportEase"
              className="h-16 w-16 object-contain mix-blend-multiply sm:h-[72px] sm:w-[72px]"
            />

            <span className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[28px]">
              Import
              <span className="text-[#173563]">
                Ease
              </span>
            </span>
          </Link>
        </div>

        {/* Main card */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.15)] sm:p-8">

          {/* Status icon */}
          <div className="flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 ring-8 ring-amber-50/50">
              <Clock
                size={38}
                className="text-amber-500"
              />
            </div>
          </div>

          {/* Heading */}
          <div className="mt-6 text-center">

            <div className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500" />

              <span className="text-xs font-bold text-amber-700">
                Pending Review
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Application submitted successfully
            </h1>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">
              {isRealAgencyAdmin
                ? "Your clearing agency application has been submitted and is currently waiting for verification."
                : "Your individual clearing agent application has been submitted and is currently waiting for verification."}
            </p>

          </div>

          {/* Applicant information */}
          {agent && (
            <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50/70 p-5">

              <div className="mb-4 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <UserCheck size={19} />
                </div>

                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Applicant Information
                  </h2>

                  <p className="text-xs text-slate-500">
                    Details from your registration
                  </p>
                </div>

              </div>

              <div className="grid gap-3 sm:grid-cols-2">

                <InfoItem
                  label="Full Name"
                  value={agent.fullName || "Not provided"}
                />

                <InfoItem
                  label="Email"
                  value={agent.email || "Not provided"}
                />

                <InfoItem
                  label="Agent ID"
                  value={agent.agentId || "Not provided"}
                />

                <InfoItem
                  label="License Number"
                  value={agent.licenseNumber || "Not provided"}
                />

              </div>

            </div>
          )}

          {/* Timeline */}
          <div className="mt-8">

            <h2 className="mb-5 text-sm font-bold text-slate-900">
              Application Status
            </h2>

            <div className="space-y-0">

              {/* Always completed by the time this page can be reached */}
              <StatusStep
                icon={<CheckCircle size={18} />}
                title="Registration completed"
                description="Your personal and professional information was submitted."
                completed
              />

              {needsDocuments && (
                <StatusStep
                  icon={<FileMagnifyingGlass size={18} />}
                  title="Documents submitted"
                  description={
                    hasDocuments
                      ? "Your license and identity documents have been received."
                      : "Upload your clearing license and identity document to continue."
                  }
                  completed={hasDocuments}
                  active={!hasDocuments}
                />
              )}

              <StatusStep
                icon={<Clock size={18} />}
                title={
                  awaitingPlatformReview
                    ? "Pending platform review"
                    : "Pending agency admin review"
                }
                description={
                  isIndependent
                    ? "An ImportEase platform admin will review your application and documents."
                    : isRealAgencyAdmin
                    ? "An ImportEase platform admin will review your agency's application."
                    : "An ImportEase platform admin will review your documents, then your agency's administrator will approve or reject your request."
                }
                active={!needsDocuments || hasDocuments}
              />

              {/* Future */}
              <StatusStep
                icon={<ShieldCheck size={18} />}
                title="Account approval"
                description="After approval, you can access your clearing agent dashboard."
              />

            </div>

          </div>

          {/* Upload documents CTA -- independent and agency-member agents, until submitted */}
          {needsDocuments && docCount !== null && !hasDocuments && (
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <UploadSimple size={19} className="mt-0.5 shrink-0 text-amber-600" />
                  <div>
                    <h3 className="text-sm font-bold text-amber-900">
                      Documents needed
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-amber-800">
                      Your application can't be reviewed until you upload your
                      clearing license and identity document.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/individual-agent-verification")}
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#173563] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#122b50]"
                >
                  Upload documents
                </button>
              </div>
            </div>
          )}

          {/* Review notice */}
          <div className="mt-7 rounded-2xl border border-blue-100 bg-blue-50/60 p-4">

            <div className="flex items-start gap-3">

              <ShieldCheck
                size={19}
                className="mt-0.5 shrink-0 text-blue-600"
              />

              <div>

                <h3 className="text-sm font-bold text-blue-900">
                  What happens next?
                </h3>

                <p className="mt-1 text-xs leading-5 text-blue-800">
                  {isIndependent
                    ? "Your application will be reviewed by the ImportEase platform team. Once approved, your clearing agent dashboard will become available."
                    : isRealAgencyAdmin
                    ? "Your agency's application will be reviewed by the ImportEase platform team. Once approved, your agency admin dashboard will become available."
                    : "An ImportEase platform admin will review your documents, then your agency's administrator will review your application. Once both approve, your clearing agent dashboard will become available."}
                </p>

              </div>

            </div>

          </div>

          {checkedOnce && (
            <p className="mt-6 text-center text-xs font-medium text-slate-500">
              Still pending — your application hasn't been approved yet.
            </p>
          )}

          {/* Buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">

            <button
              type="button"
              onClick={handleBackHome}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <ArrowLeft size={16} />
              Sign out
            </button>

            <button
              type="button"
              onClick={handleCheckStatus}
              disabled={checking}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#173563] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#173563]/15 transition hover:bg-[#122b50] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <ArrowsClockwise size={16} className={checking ? "animate-spin" : ""} />
              {checking ? "Checking…" : "Check approval status"}
            </button>

          </div>

        </div>

        {/* Footer */}
        <div className="mt-5 text-center">

          <p className="text-xs text-slate-400">
            Your application status will remain pending until
            an administrator completes the review.
          </p>

        </div>

      </div>
    </div>
  );
}


/* =========================================================
   INFO ITEM
========================================================= */

function InfoItem({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">

      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-semibold text-slate-800">
        {value}
      </p>

    </div>
  );
}


/* =========================================================
   STATUS STEP
========================================================= */

function StatusStep({
  icon,
  title,
  description,
  completed = false,
  active = false,
}) {
  return (
    <div className="flex gap-4">

      {/* Timeline */}
      <div className="flex flex-col items-center">

        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
            completed
              ? "bg-emerald-100 text-emerald-600"
              : active
                ? "bg-amber-100 text-amber-600"
                : "bg-slate-100 text-slate-400"
          }`}
        >
          {icon}
        </div>

        <div className="h-full w-px bg-slate-200" />

      </div>

      {/* Content */}
      <div className="pb-6">

        <div className="flex flex-wrap items-center gap-2">

          <h3
            className={`text-sm font-bold ${
              active
                ? "text-amber-700"
                : completed
                  ? "text-slate-900"
                  : "text-slate-400"
            }`}
          >
            {title}
          </h3>

          {completed && (
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
              COMPLETED
            </span>
          )}

          {active && (
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-600">
              CURRENT
            </span>
          )}

        </div>

        <p
          className={`mt-1 text-xs leading-5 ${
            active || completed
              ? "text-slate-500"
              : "text-slate-400"
          }`}
        >
          {description}
        </p>

      </div>

    </div>
  );
}

export default AgentPending;