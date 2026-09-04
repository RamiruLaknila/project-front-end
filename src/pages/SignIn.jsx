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
      GOOGLE SIGN IN CONNECTOR
  ========================================================= */

  const handleGoogleSignIn = () => {
    /* 
      Integrate your actual OAuth/Firebase/Backend endpoint here:
      e.g., window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
    */
    setError("Google sign-in is not connected yet.");
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
              GOOGLE SIGN IN
          ================================================== */}

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-400 active:scale-[0.99]"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign in with Google</span>
          </button>

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