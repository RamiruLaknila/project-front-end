import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Store,
  UserRound,
} from "lucide-react";

function SignUp() {
  const navigate = useNavigate();

  const handleSME = () => {
    // Remember that this user selected the SME registration.
    localStorage.setItem("signupRole", "sme");

    // Keep your existing SME registration flow.
    navigate("/sme-signup");
  };

  const handleClearingAgent = () => {
    // Remember that this user selected the clearing-agent flow.
    localStorage.setItem("signupRole", "clearing-agent");

    // Go directly to the clearing-agent registration.
    navigate("/agent-signup");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F8FAFC] px-4 py-8 sm:py-10">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-100/50 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-slate-200/50 blur-3xl" />

      {/* =====================================================
          MAIN CONTAINER
      ===================================================== */}

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-3xl flex-col justify-center">

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

        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.15)] sm:p-9">

          {/* =================================================
              ICON
          ================================================= */}

          <div className="mb-5 flex justify-center">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#173563] shadow-md shadow-[#173563]/15">
              <ShieldCheck
                size={23}
                className="text-white"
              />
            </div>

          </div>

          {/* =================================================
              HEADING
          ================================================= */}

          <div className="mb-8 text-center">

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[28px]">
              Create your ImportEase account
            </h1>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
              Choose the type of account you want to create.
              This will take you to the appropriate registration process.
            </p>

          </div>

          {/* =================================================
              ROLE SELECTION
          ================================================= */}

          <div className="grid gap-5 md:grid-cols-2">

            {/* =================================================
                SME
            ================================================= */}

            <button
              type="button"
              onClick={handleSME}
              className="group rounded-2xl border-2 border-slate-200 bg-white p-6 text-left transition-all duration-200 hover:-translate-y-1 hover:border-blue-400 hover:bg-blue-50/30 hover:shadow-xl hover:shadow-blue-900/5"
            >

              {/* Icon */}

              <div className="flex items-center justify-between">

                <div className="flex h-13 w-13 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-all duration-200 group-hover:bg-blue-600 group-hover:text-white">
                  <Store
                    size={24}
                    strokeWidth={1.8}
                  />
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition group-hover:bg-blue-100 group-hover:text-blue-600">
                  <ArrowRight size={17} />
                </div>

              </div>

              {/* Title */}

              <h2 className="mt-6 text-lg font-bold text-slate-900">
                SME / Importer
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Register your business to manage imports, calculate
                import costs and find professional clearing agents.
              </p>

              {/* Features */}

              <div className="mt-5 space-y-2.5">

                <RoleFeature text="Manage your import shipments" />

                <RoleFeature text="Search HS codes and calculate costs" />

                <RoleFeature text="Find and hire clearing agents" />

              </div>

              {/* Action */}

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">

                <span className="text-xs font-bold text-[#173563]">
                  Continue as SME
                </span>

                <span className="text-[10px] font-medium text-slate-400">
                  Business account
                </span>

              </div>

            </button>

            {/* =================================================
                CLEARING AGENT
            ================================================= */}

            <button
              type="button"
              onClick={handleClearingAgent}
              className="group rounded-2xl border-2 border-slate-200 bg-white p-6 text-left transition-all duration-200 hover:-translate-y-1 hover:border-[#173563] hover:bg-slate-50 hover:shadow-xl hover:shadow-slate-900/5"
            >

              {/* Icon */}

              <div className="flex items-center justify-between">

                <div className="flex h-13 w-13 items-center justify-center rounded-xl bg-slate-100 text-[#173563] transition-all duration-200 group-hover:bg-[#173563] group-hover:text-white">
                  <Building2
                    size={24}
                    strokeWidth={1.8}
                  />
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition group-hover:bg-slate-200 group-hover:text-[#173563]">
                  <ArrowRight size={17} />
                </div>

              </div>

              {/* Title */}

              <h2 className="mt-6 text-lg font-bold text-slate-900">
                Clearing Agent
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Register as a professional clearing agent and work
                with SMEs through the ImportEase marketplace.
              </p>

              {/* Features */}

              <div className="mt-5 space-y-2.5">

                <RoleFeature text="Create or join a clearing agency" />

                <RoleFeature text="Verify your clearing license" />

                <RoleFeature text="Receive SME requests and submit bids" />

              </div>

              {/* Action */}

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">

                <span className="text-xs font-bold text-[#173563]">
                  Continue as Clearing Agent
                </span>

                <span className="text-[10px] font-medium text-slate-400">
                  Professional account
                </span>

              </div>

            </button>

          </div>

          {/* =================================================
              INFORMATION
          ================================================= */}

          <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3">

            <div className="flex items-start gap-3">

              <ShieldCheck
                size={17}
                className="mt-0.5 shrink-0 text-blue-600"
              />

              <p className="text-[11px] leading-5 text-blue-800">
                Your account type determines which dashboard,
                registration process and features will be available
                to you on ImportEase.
              </p>

            </div>

          </div>

          {/* =================================================
              SIGN IN
          ================================================= */}

          <div className="mt-6 border-t border-slate-100 pt-5 text-center">

            <p className="text-sm text-slate-500">

              Already have an account?{" "}

              <Link
                to="/signin"
                className="font-semibold text-[#173563] transition-colors hover:text-blue-700"
              >
                Sign in
              </Link>

            </p>

          </div>

        </div>

        {/* ===================================================
            BACK HOME
        =================================================== */}

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
   FEATURE
========================================================= */

function RoleFeature({ text }) {
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

export default SignUp;