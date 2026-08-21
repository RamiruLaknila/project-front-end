import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  Copy,
  ShieldCheck,
  Users,
} from "lucide-react";

function AgencyCreated() {
  const navigate = useNavigate();

  const [copied, setCopied] = useState(false);

  /* =========================================================
     LOAD AGENCY
  ========================================================= */

  const getAgency = () => {
    try {
      const stored = localStorage.getItem("clearingAgency");

      if (!stored) {
        return null;
      }

      return JSON.parse(stored);
    } catch (error) {
      console.error("Failed to load agency:", error);
      return null;
    }
  };

  const agency = getAgency();

  /* =========================================================
     COPY AGENCY CODE
  ========================================================= */

  const handleCopy = async () => {
    if (!agency?.agencyCode) {
      return;
    }

    try {
      await navigator.clipboard.writeText(agency.agencyCode);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy agency code:", error);
    }
  };

  /* =========================================================
     CONTINUE
  ========================================================= */

  const handleContinue = () => {
    navigate("/agent-profile");
  };

  /* =========================================================
     AGENCY NOT FOUND
  ========================================================= */

  if (!agency) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4">

        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <Building2 size={22} />
          </div>

          <h1 className="mt-4 text-xl font-bold text-slate-900">
            Agency information not found
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            We couldn't find your agency information. Please
            return to the agency setup process.
          </p>

          <Link
            to="/agency-choice"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#173563] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#102547]"
          >
            Back to Agency Choice
            <ArrowRight size={16} />
          </Link>

        </div>

      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F8FAFC] px-4 py-8 sm:py-10">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-100/50 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-emerald-100/40 blur-3xl" />

      {/* =====================================================
          CONTAINER
      ===================================================== */}

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-xl flex-col justify-center">

        {/* ===================================================
            LOGO
        =================================================== */}

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

        {/* ===================================================
            CARD
        =================================================== */}

        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 text-center shadow-[0_20px_60px_-15px_rgba(15,23,42,0.15)] sm:p-8">

          {/* =================================================
              SUCCESS ICON
          ================================================= */}

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md shadow-emerald-500/20">

              <Check
                size={24}
                strokeWidth={3}
              />

            </div>

          </div>

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="mt-5">

            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5">

              <CheckCircle2
                size={13}
                className="text-emerald-600"
              />

              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700">
                Agency created
              </span>

            </div>

            <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-[28px]">
              Your agency is ready
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Congratulations! Your clearing agency has been
              successfully created on ImportEase.
            </p>

          </div>

          {/* =================================================
              AGENCY INFORMATION
          ================================================= */}

          <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left">

            <div className="flex items-start gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                <Building2 size={18} />

              </div>

              <div className="min-w-0">

                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Agency
                </p>

                <h2 className="mt-1 truncate text-sm font-bold text-slate-900">
                  {agency.name}
                </h2>

                <p className="mt-1 text-[10px] text-slate-500">
                  {agency.city}
                </p>

              </div>

            </div>

          </div>

          {/* =================================================
              AGENCY CODE
          ================================================= */}

          <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50/60 p-5">

            <div className="flex items-center justify-center gap-2">

              <Users
                size={16}
                className="text-blue-600"
              />

              <p className="text-xs font-bold text-blue-800">
                Agent invitation code
              </p>

            </div>

            <div className="mt-4 flex items-center gap-2">

              <div className="flex h-12 min-w-0 flex-1 items-center justify-center rounded-xl border border-blue-200 bg-white px-3">

                <span className="truncate text-lg font-bold tracking-[0.18em] text-[#173563]">
                  {agency.agencyCode}
                </span>

              </div>

              <button
                type="button"
                onClick={handleCopy}
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition ${
                  copied
                    ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                    : "border-blue-200 bg-white text-blue-600 hover:bg-blue-100"
                }`}
                aria-label="Copy agency invitation code"
              >

                {copied ? (
                  <Check size={18} />
                ) : (
                  <Copy size={18} />
                )}

              </button>

            </div>

            <p className="mt-3 text-[10px] leading-5 text-blue-700/70">
              Share this code with clearing agents who need to
              join your agency. Agents using this code will be
              sent for admin approval.
            </p>

            {copied && (
              <p className="mt-2 text-xs font-semibold text-emerald-600">
                Agency code copied!
              </p>
            )}

          </div>

          {/* =================================================
              ADMIN STATUS
          ================================================= */}

          <div className="mt-5 flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-4 text-left">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">

              <ShieldCheck size={17} />

            </div>

            <div>

              <p className="text-xs font-bold text-slate-800">
                You are the Agency Admin
              </p>

              <p className="mt-1 text-[10px] leading-5 text-slate-500">
                You will be able to manage agents, approve
                joining requests, and manage your agency once
                your profile is completed.
              </p>

            </div>

          </div>

          {/* =================================================
              CONTINUE
          ================================================= */}

          <button
            type="button"
            onClick={handleContinue}
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#173563] py-3 text-sm font-semibold text-white shadow-lg shadow-[#173563]/15 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#102547] hover:shadow-xl hover:shadow-[#173563]/20 active:translate-y-0 active:scale-[0.99]"
          >

            Complete Admin Profile

            <ArrowRight size={16} />

          </button>

        </div>

      </div>

    </div>
  );
}

export default AgencyCreated;