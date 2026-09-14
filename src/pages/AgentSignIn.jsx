import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  EyeSlash,
  ShieldCheck,
  EnvelopeSimple,
  LockKey,
} from "@phosphor-icons/react";

import { useAuth } from "../context/AuthContext";
import { authErrorMessage, landingPathForProfile } from "../lib/authErrors";

function AgentSignIn() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const email = formData.email.trim();
    const password = formData.password.trim();

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setSubmitting(true);
    try {
      const profile = await login(email, password, rememberMe);

      if (profile?.role !== "clearing_agent") {
        setError(
          "This is not a clearing-agent account. Use the SME sign in instead."
        );
        return;
      }

      // The clearing-agent dashboards/sidebars read their agent (and, for
      // admins, agency) details from localStorage rather than this auth
      // context. Nothing else in the app ever wrote that key for a real
      // sign-in, so those pages found it missing and bounced straight back
      // to /agent-signin. Populate it here from the real profile so the
      // destination dashboard actually renders instead of redirecting away.
      const agentType = profile.isIndependent
        ? "individual-agent"
        : profile.isAgencyAdmin
        ? "agency-admin"
        : "agency-member";

      localStorage.setItem(
        "clearingAgent",
        JSON.stringify({
          fullName: profile.name || "",
          name: profile.name || "",
          email: profile.email || "",
          agentType,
        })
      );

      if (agentType !== "individual-agent" && !localStorage.getItem("clearingAgency")) {
        localStorage.setItem(
          "clearingAgency",
          JSON.stringify({
            id: profile.agencyId || "",
            code: profile.agencyId || "",
            agencyName: profile.agencyName || profile.businessName || "Your Agency",
            name: profile.agencyName || profile.businessName || "Your Agency",
          })
        );
      }

      // The backend profile tied to this email/password decides the destination.
      navigate(landingPathForProfile(profile), { replace: true });
    } catch (err) {
      setError(authErrorMessage(err, "Could not sign you in."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F8FAFC] px-4 py-8 sm:px-6 sm:py-10">

      {/* BACKGROUND DECORATION */}

      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-100/40 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-slate-200/50 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">

        {/* MAIN CONTAINER - WIDER */}

        <div className="w-full max-w-[600px]">

          {/* BACK TO HOME */}

          <Link
            to="/"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#173563]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          {/* MAIN CARD */}

          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.18)] sm:p-8">

            {/* LOGO */}

            <div className="mb-6 flex justify-center">
              <Link
                to="/"
                className="inline-flex items-center"
              >
                <img
                  src="/logo.png"
                  alt="ImportEase"
                  className="h-14 w-auto object-contain sm:h-16"
                />
              </Link>
            </div>

            {/* HEADING */}

            <div className="mb-7 text-center">

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Clearing Agent Sign In
              </h1>

              <p className="mx-auto mt-2 max-w-md text-[16px] leading-6 text-slate-500">
                Sign in to manage your clearing activities.
              </p>

            </div>

            {/* ERROR */}

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            {/* SIGN IN FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
              autoComplete="off"
            >

              {/* EMAIL */}

              <div>

                <label
                  htmlFor="agent-email"
                  className="mb-2 block text-[16px] font-semibold text-slate-700"
                >
                  Email Address
                </label>

                <div className="relative">

                  <EnvelopeSimple
                    className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="agent-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    autoComplete="off"
                    autoCapitalize="none"
                    spellCheck="false"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-[16px] text-slate-800 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-50"
                  />

                </div>

              </div>

              {/* PASSWORD */}

              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label
                    htmlFor="agent-password"
                    className="block text-[16px] font-semibold text-slate-700"
                  >
                    Password
                  </label>

                  <Link
                    to="/agent-forgot-password"
                    className="text-xs font-semibold text-[#2563EB] transition hover:text-[#1D4ED8] hover:underline"
                  >
                    Forgot password?
                  </Link>

                </div>

                <div className="relative">

                  <LockKey
                    className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="agent-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="new-password"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-11 text-[16px] text-slate-800 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-50"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeSlash className="h-[18px] w-[18px]" />
                    ) : (
                      <Eye className="h-[18px] w-[18px]" />
                    )}
                  </button>

                </div>

              </div>

              {/* REMEMBER ME */}

              <div className="flex items-center">

                <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600">

                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) =>
                      setRememberMe(e.target.checked)
                    }
                    className="h-4 w-4 rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]"
                  />

                  Remember me

                </label>

              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-[#173563] px-4 py-3.5 text-[16px] font-semibold text-white shadow-lg shadow-[#173563]/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#122b50] hover:shadow-xl hover:shadow-[#173563]/15 focus:outline-none focus:ring-4 focus:ring-[#173563]/15 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Signing in…" : "Sign In"}
              </button>

            </form>

            {/* SIGN UP */}

            <div className="mt-7 border-t border-slate-100 pt-6 text-center">

              <p className="text-sm text-slate-500">

                Don't have a clearing agent account?{" "}

                <Link
                  to="/agent-signup"
                  className="font-semibold text-[#2563EB] transition hover:text-[#1D4ED8] hover:underline"
                >
                  Sign up
                </Link>

              </p>

            </div>

            {/* SECURITY */}

            <div className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-xs font-medium text-slate-400">

              <ShieldCheck className="h-4 w-4 text-slate-400" />

              Secure access with ImportEase

            </div>

          </div>

          {/* FOOTER */}

          <div className="mt-5 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} ImportEase. All rights reserved.
          </div>

          <div className="mt-2 flex justify-center gap-4 text-xs">

            <Link
              to="/privacy"
              className="text-slate-400 transition hover:text-slate-600"
            >
              Privacy
            </Link>

            <Link
              to="/terms"
              className="text-slate-400 transition hover:text-slate-600"
            >
              Terms
            </Link>

            <Link
              to="/support"
              className="text-slate-400 transition hover:text-slate-600"
            >
              Support
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AgentSignIn;