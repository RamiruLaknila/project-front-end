import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  UserPlus,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

function AgencyChoice() {
  const navigate = useNavigate();

  const handleCreateAgency = () => {
    localStorage.setItem("agencyRegistrationAction", "create");
    navigate("/agency-create");
  };

  const handleJoinAgency = () => {
    localStorage.setItem("agencyRegistrationAction", "join");
    navigate("/join-agency");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F8FAFC] px-4 py-8 sm:py-10">

      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-100/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-slate-200/50 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-2xl flex-col justify-center">

        {/* Logo */}
        <div className="mb-7 flex justify-center">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/logo.jpeg"
              alt="ImportEase"
              className="h-16 w-16 object-contain mix-blend-multiply sm:h-[72px] sm:w-[72px]"
            />

            <span className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[26px]">
              Import
              <span className="text-[#173563]">Ease</span>
            </span>
          </Link>
        </div>

        {/* Main card */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.15)] sm:p-8">

          {/* Icon */}
          <div className="mb-4 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#173563] shadow-md shadow-[#173563]/15">
              <Building2
                size={23}
                className="text-white"
              />
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[27px]">
              Agency / Company
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Choose how you want to operate with a clearing agency on
              ImportEase.
            </p>
          </div>

          {/* Options */}
          <div className="grid gap-4 sm:grid-cols-2">

            {/* Create Agency */}
            <button
              type="button"
              onClick={handleCreateAgency}
              className="group rounded-2xl border-2 border-slate-200 bg-white p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-400 hover:bg-blue-50/40 hover:shadow-lg hover:shadow-blue-900/5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-all duration-200 group-hover:bg-blue-600 group-hover:text-white">
                <Building2
                  size={22}
                  strokeWidth={1.8}
                />
              </div>

              <h2 className="mt-5 text-base font-bold text-slate-900">
                Register a Clearing Agency
              </h2>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Register your own clearing agency and become the agency
                administrator.
              </p>

              <div className="mt-4 space-y-2">
                <Feature text="Register your agency" />
                <Feature text="Manage clearing agents" />
                <Feature text="Receive SME requests" />
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-xs font-semibold text-[#173563]">
                  Create agency
                </span>

                <ChevronRight
                  size={16}
                  className="text-[#173563] transition-transform duration-200 group-hover:translate-x-1"
                />
              </div>
            </button>

            {/* Join Agency */}
            <button
              type="button"
              onClick={handleJoinAgency}
              className="group rounded-2xl border-2 border-slate-200 bg-white p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-400 hover:bg-blue-50/40 hover:shadow-lg hover:shadow-blue-900/5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition-all duration-200 group-hover:bg-[#173563] group-hover:text-white">
                <UserPlus
                  size={22}
                  strokeWidth={1.8}
                />
              </div>

              <h2 className="mt-5 text-base font-bold text-slate-900">
                Join an Existing Agency
              </h2>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Join a registered clearing agency as an agent and work
                under its administration.
              </p>

              <div className="mt-4 space-y-2">
                <Feature text="Find your agency" />
                <Feature text="Submit your agent details" />
                <Feature text="Wait for admin approval" />
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-xs font-semibold text-[#173563]">
                  Join agency
                </span>

                <ChevronRight
                  size={16}
                  className="text-[#173563] transition-transform duration-200 group-hover:translate-x-1"
                />
              </div>
            </button>
          </div>

          {/* Information */}
          <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3">
            <div className="flex items-start gap-3">
              <ShieldCheck
                size={17}
                className="mt-0.5 shrink-0 text-blue-600"
              />

              <p className="text-[11px] leading-5 text-blue-800">
                Agency registration may require business and clearing
                license verification before your account becomes active.
              </p>
            </div>
          </div>

          {/* Back */}
          <div className="mt-6 border-t border-slate-100 pt-5 text-center">
            <button
              type="button"
              onClick={() => navigate("/agent-signup")}
              className="inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-800"
            >
              <ArrowLeft size={16} />
              Back to account type
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 flex justify-center">
          <Link
            to="/"
            className="text-sm text-slate-500 transition-colors hover:text-slate-800"
          >
            Back to ImportEase
          </Link>
        </div>
      </div>
    </div>
  );
}

function Feature({ text }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-50">
        <CheckCircle2
          size={11}
          className="text-emerald-600"
        />
      </div>

      <span className="text-[11px] text-slate-500">
        {text}
      </span>
    </div>
  );
}

export default AgencyChoice;