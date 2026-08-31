import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";

function SignIn() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [error, setError] = useState("");

  /* =========================================================
     HANDLE INPUT CHANGES
  ========================================================= */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* =========================================================
     HANDLE SIGN IN
  ========================================================= */

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    console.log("SME Sign in data:", formData);

    /*
      Store login information for the frontend flow.
      This is currently frontend/localStorage based.
    */

    localStorage.setItem("loginPortal", "importer");
    localStorage.setItem("isSMESignedIn", "true");

    /*
      Login successful → SME Dashboard
    */

    navigate("/dashboard");
  };

  /* =========================================================
     SOCIAL SIGN IN
  ========================================================= */

  const handleSocialSignIn = (provider) => {
    setError(`${provider} sign-in is not connected yet.`);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F8FAFC] px-4 py-6 sm:py-8">

      {/* =====================================================
          BACKGROUND DECORATION
      ====================================================== */}

      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-100/50 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-slate-200/50 blur-3xl" />

      {/* =====================================================
          MAIN CONTAINER
      ====================================================== */}

      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-lg flex-col justify-center">

        {/* ===================================================
            LOGO
        ==================================================== */}

        <div className="mb-4 flex justify-center sm:mb-5">

          <Link
            to="/"
            className="flex items-center gap-2.5"
          >

            <img
              src="/logo.jpeg"
              alt="ImportEase"
              className="h-14 w-14 object-contain mix-blend-multiply sm:h-16 sm:w-16"
            />

            <span className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[25px]">
              Import
              <span className="text-[#173563]">
                Ease
              </span>
            </span>

          </Link>

        </div>

        {/* ===================================================
            MAIN CARD
        ==================================================== */}

        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.15)] sm:p-8">

          {/* =================================================
              HEADING
          ================================================== */}

          <div className="mb-6 text-center">

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[26px]">
              Welcome back
            </h1>

            <p className="mt-1.5 text-sm text-slate-500">
              Sign in to continue to your ImportEase account
            </p>

          </div>

          {/* =================================================
              SME ACCOUNT INDICATOR
          ================================================== */}

          <div className="mb-5 flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50/70 px-3.5 py-2.5">

            <ShieldCheck
              size={17}
              className="shrink-0 text-[#2563EB]"
            />

            <p className="text-xs font-medium text-slate-600">

              Signing in to{" "}

              <span className="font-semibold text-[#173563]">
                SME Workspace
              </span>

            </p>

          </div>

          {/* =================================================
              ERROR
          ================================================== */}

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          {/* =================================================
              FORM
          ================================================== */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* =================================================
                EMAIL
            ================================================== */}

            <div>

              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Email address
              </label>

              <div className="relative">

                <Mail
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@company.com"
                  autoComplete="email"
                  className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-slate-400 focus:border-[#173563] focus:ring-4 focus:ring-[#173563]/10"
                />

              </div>

            </div>

            {/* =================================================
                PASSWORD
            ================================================== */}

            <div>

              <div className="mb-1.5 flex items-center justify-between">

                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700"
                >
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-sm font-semibold text-[#2563EB] transition-colors hover:text-[#1D4ED8]"
                >
                  Forgot password?
                </Link>

              </div>

              <div className="relative">

                <LockKeyhole
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-11 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-slate-400 focus:border-[#173563] focus:ring-4 focus:ring-[#173563]/10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((current) => !current)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-700"
                >

                  {showPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}

                </button>

              </div>

            </div>

            {/* =================================================
                REMEMBER ME
            ================================================== */}

            <div className="flex items-center justify-between pt-0.5">

              <label className="flex cursor-pointer items-center gap-2">

                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-300 text-[#173563] focus:ring-[#173563]"
                />

                <span className="text-xs text-slate-500">
                  Remember me
                </span>

              </label>

            </div>

            {/* =================================================
                SIGN IN BUTTON
            ================================================== */}

            <button
              type="submit"
              className="w-full rounded-xl bg-[#173563] py-3 text-sm font-semibold text-white shadow-lg shadow-[#173563]/15 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#102547] hover:shadow-xl hover:shadow-[#173563]/20 active:translate-y-0 active:scale-[0.99]"
            >
              Sign In
            </button>

          </form>

          {/* =================================================
              DIVIDER
          ================================================== */}

          <div className="my-6 flex items-center gap-3">

            <div className="h-px flex-1 bg-slate-200" />

            <span className="text-xs font-medium text-slate-400">
              OR CONTINUE WITH
            </span>

            <div className="h-px flex-1 bg-slate-200" />

          </div>

          {/* =================================================
              SOCIAL SIGN IN
          ================================================== */}

          <div className="grid grid-cols-2 gap-3">

            {/* GOOGLE */}

            <button
              type="button"
              onClick={() =>
                handleSocialSignIn("Google")
              }
              className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]"
            >

              <span className="flex h-5 w-5 items-center justify-center rounded-full text-sm font-bold">
                G
              </span>

              Google

            </button>

            {/* MICROSOFT */}

            <button
              type="button"
              onClick={() =>
                handleSocialSignIn("Microsoft")
              }
              className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]"
            >

              <span className="grid h-4 w-4 grid-cols-2 gap-[1px]">

                <span className="bg-[#F25022]" />
                <span className="bg-[#7FBA00]" />
                <span className="bg-[#00A4EF]" />
                <span className="bg-[#FFB900]" />

              </span>

              Microsoft

            </button>

          </div>

          {/* =================================================
              SIGN UP
          ================================================== */}

          <div className="mt-6 border-t border-slate-100 pt-5 text-center">

            <p className="text-sm text-slate-500">

              Don't have an account?{" "}

              <Link
                to="/signup"
                className="font-semibold text-[#173563] transition-colors hover:text-blue-700"
              >
                Create an account
              </Link>

            </p>

          </div>

          <div className="mt-3 text-center">
            <Link
              to="/sme-guest"
              className="text-sm font-semibold text-[#173563] transition-colors hover:text-blue-700"
            >
              Continue as Guest
            </Link>
          </div>

          {/* =================================================
              SECURITY NOTICE
          ================================================== */}

          <div className="mt-5 flex items-center justify-center gap-2 text-center">

            <LockKeyhole
              size={14}
              className="shrink-0 text-slate-400"
            />

            <p className="text-[11px] font-medium text-slate-400">
              Your connection is secure and your account
              information is protected.
            </p>

          </div>

        </div>

        {/* ===================================================
            BACK HOME
        ==================================================== */}

        <div className="mt-4 flex justify-center">

          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-800"
          >

            <ArrowLeft size={16} />

            Back to ImportEase

          </Link>

        </div>

        {/* ===================================================
            FOOTER NAVIGATION
        ==================================================== */}

        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-slate-400">

          <Link
            to="/privacy"
            className="transition-colors hover:text-slate-700"
          >
            Privacy Policy
          </Link>

          <span className="h-1 w-1 rounded-full bg-slate-300" />

          <Link
            to="/terms"
            className="transition-colors hover:text-slate-700"
          >
            Terms of Service
          </Link>

          <span className="h-1 w-1 rounded-full bg-slate-300" />

          <Link
            to="/support"
            className="flex items-center gap-1 transition-colors hover:text-slate-700"
          >

            <HelpCircle size={12} />

            Help / Contact Support

          </Link>

        </div>

        {/* ===================================================
            COPYRIGHT
        ==================================================== */}

        <p className="mt-3 pb-2 text-center text-[10px] text-slate-400">
          © {new Date().getFullYear()} ImportEase. All rights reserved.
        </p>

      </div>

    </div>
  );
}

export default SignIn;
