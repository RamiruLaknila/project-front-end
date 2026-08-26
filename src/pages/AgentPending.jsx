import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileCheck2,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

function AgentPending() {
  const navigate = useNavigate();

  const [agent, setAgent] = useState(null);

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

  const handleBackHome = () => {
    navigate("/");
  };

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
              src="/logo.jpeg"
              alt="ImportEase"
              className="h-16 w-16 object-contain mix-blend-multiply sm:h-[72px] sm:w-[72px]"
            />

            <span className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[26px]">
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
              <Clock3
                size={38}
                className="text-amber-500"
                strokeWidth={1.8}
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

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[28px]">
              Application submitted successfully
            </h1>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">
              Your individual clearing agent application has been
              submitted and is currently waiting for verification.
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

              {/* Completed */}
              <StatusStep
                icon={<CheckCircle2 size={18} />}
                title="Registration completed"
                description="Your personal and professional information was submitted."
                completed
              />

              {/* Completed */}
              <StatusStep
                icon={<FileCheck2 size={18} />}
                title="Documents submitted"
                description="Your license and verification documents have been received."
                completed
              />

              {/* Current */}
              <StatusStep
                icon={<Clock3 size={18} />}
                title="Pending administrator review"
                description="An administrator will review your application and documents."
                active
              />

              {/* Future */}
              <StatusStep
                icon={<ShieldCheck size={18} />}
                title="Account approval"
                description="After approval, you can access your clearing agent dashboard."
              />

            </div>

          </div>

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
                  Your application will be reviewed by the
                  ImportEase administration team. Once approved,
                  your clearing agent dashboard will become
                  available.
                </p>

              </div>

            </div>

          </div>

          {/* Buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">

            <button
              type="button"
              onClick={handleBackHome}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <ArrowLeft size={16} />
              Back to ImportEase
            </button>

            <Link
              to="/agent-signin"
              className="flex flex-1 items-center justify-center rounded-xl bg-[#173563] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#173563]/15 transition hover:bg-[#122b50]"
            >
              Go to Agent Sign In
            </Link>

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

      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
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
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-600">
              COMPLETED
            </span>
          )}

          {active && (
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-bold text-amber-600">
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