import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  BriefcaseBusiness,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

function AgentSignUp() {
  const navigate = useNavigate();

  const handleAgency = () => {
    // Save the selected registration path for the next step.
    localStorage.setItem("agentRegistrationType", "agency");

    navigate("/agency-choice");
  };

  const handleIndividual = () => {
    // Save the selected registration path for the next step.
    localStorage.setItem("agentRegistrationType", "individual");

    // We will build this page next.
    navigate("/individual-agent-signup");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F8FAFC] px-4 py-8 sm:py-10">

      {/* =====================================================
          BACKGROUND DECORATION
      ===================================================== */}

      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-100/50 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-slate-200/50 blur-3xl" />


      {/* =====================================================
          MAIN CONTAINER
      ===================================================== */}

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-2xl flex-col justify-center">


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


        {/* =====================================================
            MAIN CARD
        ===================================================== */}

        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.15)] sm:p-8">


          {/* =====================================================
              ICON
          ===================================================== */}

          <div className="mb-4 flex justify-center">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#173563] shadow-md shadow-[#173563]/15">

              <ShieldCheck
                size={23}
                className="text-white"
              />

            </div>

          </div>


          {/* =====================================================
              HEADING
          ===================================================== */}

          <div className="mb-8 text-center">

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[27px]">
              Create your agent account
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Choose how you will operate on ImportEase.
              You can register as an agency or as an independent
              clearing agent.
            </p>

          </div>


          {/* =====================================================
              ACCOUNT TYPE OPTIONS
          ===================================================== */}

          <div className="grid gap-4 sm:grid-cols-2">


            {/* =================================================
                AGENCY / COMPANY
            ================================================= */}

            <button
              type="button"
              onClick={handleAgency}
              className="group relative rounded-2xl border-2 border-slate-200 bg-white p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-400 hover:bg-blue-50/40 hover:shadow-lg hover:shadow-blue-900/5"
            >

              {/* ICON */}

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-all duration-200 group-hover:bg-blue-600 group-hover:text-white">

                <Building2
                  size={22}
                  strokeWidth={1.8}
                />

              </div>


              {/* TITLE */}

              <h2 className="mt-5 text-base font-bold text-slate-900">
                Agency / Company
              </h2>


              {/* DESCRIPTION */}

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Create a clearing agency, manage your team,
                receive SME requests and participate in the
                marketplace.
              </p>


              {/* FEATURES */}

              <div className="mt-4 space-y-2">

                <Feature text="Create and manage your agency" />

                <Feature text="Invite and manage agents" />

                <Feature text="Submit bids for SME requests" />

              </div>


              {/* ACTION */}

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">

                <span className="text-xs font-semibold text-[#173563]">
                  Create an agency
                </span>

                <ChevronRight
                  size={16}
                  className="text-[#173563] transition-transform duration-200 group-hover:translate-x-1"
                />

              </div>

            </button>


            {/* =================================================
                INDIVIDUAL AGENT
            ================================================= */}

            <button
              type="button"
              onClick={handleIndividual}
              className="group relative rounded-2xl border-2 border-slate-200 bg-white p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-400 hover:bg-blue-50/40 hover:shadow-lg hover:shadow-blue-900/5"
            >

              {/* ICON */}

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition-all duration-200 group-hover:bg-[#173563] group-hover:text-white">

                <BriefcaseBusiness
                  size={22}
                  strokeWidth={1.8}
                />

              </div>


              {/* TITLE */}

              <h2 className="mt-5 text-base font-bold text-slate-900">
                Individual Agent
              </h2>


              {/* DESCRIPTION */}

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Register as an independent clearing agent,
                verify your professional license and work
                directly with SMEs.
              </p>


              {/* FEATURES */}

              <div className="mt-4 space-y-2">

                <Feature text="Register as an independent agent" />

                <Feature text="Verify your clearing license" />

                <Feature text="Submit bids for SME requests" />

              </div>


              {/* ACTION */}

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">

                <span className="text-xs font-semibold text-[#173563]">
                  Register individually
                </span>

                <ChevronRight
                  size={16}
                  className="text-[#173563] transition-transform duration-200 group-hover:translate-x-1"
                />

              </div>

            </button>

          </div>


          {/* =====================================================
              INFORMATION
          ===================================================== */}

          <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3">

            <div className="flex items-start gap-3">

              <ShieldCheck
                size={17}
                className="mt-0.5 shrink-0 text-blue-600"
              />

              <p className="text-[11px] leading-5 text-blue-800">
                Clearing agent accounts may require license
                verification before marketplace and bidding
                features become available.
              </p>

            </div>

          </div>


          {/* =====================================================
              SIGN IN
          ===================================================== */}

          <div className="mt-6 border-t border-slate-100 pt-5 text-center">

            <p className="text-sm text-slate-500">

              Already have a clearing agent account?{" "}

              <Link
                to="/agent-signin"
                className="font-semibold text-[#173563] transition-colors hover:text-blue-700"
              >
                Sign in
              </Link>

            </p>

          </div>

        </div>


        {/* =====================================================
            BACK HOME
        ===================================================== */}

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
   FEATURE ITEM
========================================================= */

function Feature({ text }) {
  return (
    <div className="flex items-center gap-2">

      <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-50">

        <span className="text-[9px] font-bold text-emerald-600">
          ✓
        </span>

      </div>

      <span className="text-[11px] text-slate-500">
        {text}
      </span>

    </div>
  );
}


export default AgentSignUp;