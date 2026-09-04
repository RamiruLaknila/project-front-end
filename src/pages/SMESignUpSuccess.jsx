import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Mail,
  ShieldCheck,
} from "lucide-react";

function SMESignUpSuccess() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 py-8 sm:px-6 sm:py-10">

      {/* =====================================================
          MAIN CONTAINER
      ===================================================== */}

      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md items-center justify-center">

        {/* ===================================================
            CONTENT
        =================================================== */}

        <div className="w-full">

          {/* LOGO */}

          <div className="mb-8 flex justify-center">
            <Link
              to="/"
              className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173563] focus-visible:ring-offset-2"
            >
              <img
                src="/logo.jpeg"
                alt="ImportEase"
               
                className="h-16 w-16 object-contain mix-blend-multiply sm:h-[72px] sm:w-[72px]"
              />

              <span className="text-2xl font-bold tracking-tight text-slate-900">
                Import
                <span className="text-[#173563]">
                  Ease
                </span>
              </span>
            </Link>
          </div>

          {/* =================================================
              SUCCESS CARD
          ================================================= */}

          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">

            {/* SUCCESS ICON */}

            <div className="flex justify-center">

              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 ring-8 ring-emerald-50/60">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500">
                  <Check
                    className="h-6 w-6 text-white"
                    strokeWidth={3}
                  />
                </div>
              </div>

            </div>

            {/* HEADING */}

            <div className="mt-7 text-center">

              <div className="mb-2 flex justify-center">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
                  Account created
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                You're all set!
              </h1>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
                Your ImportEase SME account has been created
                successfully. You can now sign in and continue
                setting up your profile.
              </p>

            </div>

            {/* =================================================
                NEXT STEP
            ================================================= */}

            <div className="mt-7 rounded-xl border border-slate-200 bg-slate-50 p-4">

              <div className="flex items-start gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200">
                  <Mail className="h-4 w-4 text-[#173563]" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Your account is ready
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Sign in using the email address you
                    registered with to access ImportEase.
                  </p>
                </div>

              </div>

            </div>

            {/* =================================================
                CONTINUE BUTTON
            ================================================= */}

            <Link
              to="/signin"
              className="group mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#173563] px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#10294d] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173563] focus-visible:ring-offset-2"
            >
              Continue to Sign In

              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
              />
            </Link>

            {/* =================================================
                SECURITY NOTE
            ================================================= */}

            <div className="mt-5 flex items-start gap-2.5">

              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />

              <p className="text-[11px] leading-5 text-slate-400">
                Your account information is securely handled
                within ImportEase.
              </p>

            </div>

          </div>

          {/* =================================================
              BACK HOME
          ================================================= */}

          <div className="mt-6 text-center">

            <Link
              to="/"
              className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
            >
              Back to ImportEase
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default SMESignUpSuccess;