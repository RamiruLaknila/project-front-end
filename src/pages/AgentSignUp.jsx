import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  BriefcaseBusiness,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

function AgentSignUp() {
  const navigate = useNavigate();

  const handleAgency = () => {
    localStorage.setItem("agentRegistrationType", "agency");
    navigate("/agency-choice");
  };

  const handleIndividual = () => {
    localStorage.setItem("agentRegistrationType", "individual");
    navigate("/individual-agent-signup");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F8FAFC] px-4 py-8 font-sans antialiased sm:px-6 sm:py-10 lg:px-8">
      {/* BACKGROUND DECORATION */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-100/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-slate-200/50 blur-3xl" />

      <div className="relative mx-auto w-full max-w-5xl">
        {/* LOGO */}
        <div className="mb-7 flex justify-center">
          <Link
            to="/"
            className="group flex items-center gap-2.5 rounded-lg p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173563] focus-visible:ring-offset-2"
          >
            <img
              src="/logo.jpeg"
              alt="ImportEase"
              className="h-11 w-11 object-contain mix-blend-multiply sm:h-12 sm:w-12"
            />

            <span className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[28px]">
              Import
              <span className="text-[#173563]">Ease</span>
            </span>
          </Link>
        </div>

        {/* PAGE INTRO */}
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <div className="mb-3 flex justify-center">
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Create your agent account
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Choose how you will operate on ImportEase. You can register as an
            agency or as an independent clearing agent.
          </p>
        </div>

        {/* ACCOUNT TYPE CARDS */}
        <div className="grid gap-5 md:grid-cols-2">
          {/* AGENCY CARD */}
          <button
            type="button"
            onClick={handleAgency}
            className="group flex min-h-[390px] flex-col rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#173563]/30 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173563] focus-visible:ring-offset-2 sm:p-7"
          >
            <div className="flex flex-1 flex-col">
              {/* ICON + ARROW */}
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-[#173563] transition-all duration-200 group-hover:border-[#173563] group-hover:bg-[#173563] group-hover:text-white">
                  <Building2 className="h-5 w-5" />
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 transition-all duration-200 group-hover:bg-blue-50">
                  <ArrowRight className="h-4 w-4 text-slate-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[#173563]" />
                </div>
              </div>

              {/* TITLE */}
              <div className="mt-6">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-[22px]">
                  Agency / Company
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Create a clearing agency, manage your team, receive SME
                  requests and participate in the marketplace.
                </p>
              </div>

              {/* FEATURES */}
              <div className="mt-6 border-t border-slate-100 pt-5">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  With an agency account
                </p>

                <div className="space-y-3">
                  <RoleFeature text="Create and manage your agency" />
                  <RoleFeature text="Invite and manage agents" />
                  <RoleFeature text="Submit bids for SME requests" />
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
              <span className="text-sm font-semibold text-[#173563]">
                Create an agency
              </span>
            </div>
          </button>

          {/* INDIVIDUAL AGENT CARD */}
          <button
            type="button"
            onClick={handleIndividual}
            className="group flex min-h-[390px] flex-col rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#173563]/30 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173563] focus-visible:ring-offset-2 sm:p-7"
          >
            <div className="flex flex-1 flex-col">
              {/* ICON + ARROW */}
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-[#173563] transition-all duration-200 group-hover:border-[#173563] group-hover:bg-[#173563] group-hover:text-white">
                  <BriefcaseBusiness className="h-5 w-5" />
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 transition-all duration-200 group-hover:bg-blue-50">
                  <ArrowRight className="h-4 w-4 text-slate-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[#173563]" />
                </div>
              </div>

              {/* TITLE */}
              <div className="mt-6">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-[22px]">
                  Individual Agent
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Register as an independent clearing agent, verify your
                  professional license and work directly with SMEs.
                </p>
              </div>

              {/* FEATURES */}
              <div className="mt-6 border-t border-slate-100 pt-5">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  With an individual account
                </p>

                <div className="space-y-3">
                  <RoleFeature text="Register as an independent agent" />
                  <RoleFeature text="Verify your clearing license" />
                  <RoleFeature text="Submit bids for SME requests" />
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
              <span className="text-sm font-semibold text-[#173563]">
                Register individually
              </span>
            </div>
          </button>
        </div>

       

        {/* SIGN IN */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            Already have a clearing agent account?{" "}
            <Link
              to="/agent-signin"
              className="font-semibold text-[#173563] underline decoration-[#173563]/30 underline-offset-4 transition-colors hover:text-blue-700 hover:decoration-blue-700"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* BACK HOME */}
        <div className="mt-3 flex justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173563] focus-visible:ring-offset-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to ImportEase
          </Link>
        </div>
      </div>
    </div>
  );
}

/* FEATURE ITEM */
function RoleFeature({ text }) {
  return (
    <div className="flex items-center gap-2.5">
      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
      <span className="text-sm font-medium text-slate-600">{text}</span>
    </div>
  );
}

export default AgentSignUp;