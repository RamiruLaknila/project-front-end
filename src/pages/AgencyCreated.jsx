import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Clock3,
  FileBadge2,
  ShieldCheck,
} from "lucide-react";

function AgencyCreated() {
  const navigate = useNavigate();

  const application = JSON.parse(
    localStorage.getItem("agencyApplication") || "null"
  );

  const agency = JSON.parse(
    localStorage.getItem("clearingAgency") || "null"
  );

  const agencyName =
    application?.agencyName ||
    agency?.agencyName ||
    "Your Clearing Agency";

  const applicationId =
    application?.id ||
    "AGY-PENDING";

  const submittedDate = application?.submittedAt
    ? new Date(application.submittedAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

  const handleContinue = () => {
    navigate("/agent-pending");
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
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 text-center shadow-[0_20px_60px_-15px_rgba(15,23,42,0.15)] sm:p-8">

          {/* Success icon */}
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2
              size={34}
              className="text-emerald-600"
              strokeWidth={1.8}
            />
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[28px]">
            Application Submitted
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
            Your clearing agency registration has been successfully
            submitted. Our team will review your application and
            license information.
          </p>

          {/* Status */}
          <div className="mx-auto mt-7 flex max-w-md items-center gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-left">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
              <Clock3
                size={22}
                className="text-amber-600"
              />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-amber-700">
                Application Status
              </p>

              <p className="mt-1 text-sm font-bold text-amber-900">
                Pending Review
              </p>

              <p className="mt-1 text-[11px] leading-5 text-amber-700">
                Your account will remain pending until your application
                is approved.
              </p>
            </div>

          </div>

          {/* Application information */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 text-left">

            <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
              <p className="text-xs font-bold text-slate-700">
                Application Information
              </p>
            </div>

            <div className="grid gap-5 p-4 sm:grid-cols-2">

              <InfoItem
                icon={Building2}
                label="Agency"
                value={agencyName}
              />

              <InfoItem
                icon={FileBadge2}
                label="Application ID"
                value={applicationId}
              />

              <InfoItem
                icon={Clock3}
                label="Submitted"
                value={submittedDate}
              />

              <InfoItem
                icon={ShieldCheck}
                label="Status"
                value="Pending Review"
                valueClass="text-amber-600"
              />

            </div>

          </div>

          {/* What happens next */}
          <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-left">

            <div className="flex items-start gap-3">

              <ShieldCheck
                size={18}
                className="mt-0.5 shrink-0 text-blue-600"
              />

              <div>

                <p className="text-xs font-bold text-blue-900">
                  What happens next?
                </p>

                <div className="mt-2 space-y-2">

                  <Step
                    number="1"
                    text="ImportEase reviews your agency information."
                  />

                  <Step
                    number="2"
                    text="Your business and license details are verified."
                  />

                  <Step
                    number="3"
                    text="Once approved, your Agency Admin Dashboard becomes available."
                  />

                </div>

              </div>

            </div>

          </div>

          {/* Continue */}
          <button
            type="button"
            onClick={handleContinue}
            className="mt-7 w-full rounded-xl bg-[#173563] py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#173563]/15 transition-all hover:-translate-y-0.5 hover:bg-[#102547]"
          >
            View Application Status
          </button>

        </div>

        {/* Back */}
        <div className="mt-5 flex justify-center">

          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-800"
          >
            <ArrowLeft size={16} />
            Back to ImportEase
          </Link>

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   INFO ITEM
========================================================= */

function InfoItem({
  icon: Icon,
  label,
  value,
  valueClass = "text-slate-800",
}) {
  return (
    <div className="flex items-start gap-3">

      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
        <Icon size={15} />
      </div>

      <div className="min-w-0">

        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p
          className={`mt-1 break-words text-xs font-bold ${valueClass}`}
        >
          {value}
        </p>

      </div>

    </div>
  );
}

/* =========================================================
   NEXT STEP
========================================================= */

function Step({ number, text }) {
  return (
    <div className="flex items-start gap-2">

      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white">
        {number}
      </div>

      <p className="text-[11px] leading-5 text-blue-800">
        {text}
      </p>

    </div>
  );
}

export default AgencyCreated;