import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  ShieldCheck,
  UserRound,
  Building2,
  BriefcaseBusiness,
  CheckCircle2,
  Mail,
  LockKeyhole,
} from "lucide-react";

function AgentSignIn() {
  const navigate = useNavigate();

  const [selectedAgentType, setSelectedAgentType] =
    useState("agency-member");

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

  const handleAgentTypeChange = (type) => {
    setSelectedAgentType(type);
    setError("");

    localStorage.setItem("agentType", type);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const email = formData.email.trim();
    const password = formData.password.trim();

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    localStorage.setItem("agentType", selectedAgentType);
    localStorage.setItem("agentAuthenticated", "true");

    localStorage.setItem(
      "clearingAgent",
      JSON.stringify({
        email,
        agentType: selectedAgentType,
        authenticated: true,
      })
    );

    if (rememberMe) {
      localStorage.setItem("rememberAgent", "true");
    } else {
      localStorage.removeItem("rememberAgent");
    }

    if (selectedAgentType === "agency-admin") {
      navigate("/agent-admin-dashboard", {
        replace: true,
      });
      return;
    }

    if (selectedAgentType === "agency-member") {
      navigate("/agent-dashboard", {
        replace: true,
      });
      return;
    }

    if (selectedAgentType === "individual-agent") {
      navigate("/individual-agent-dashboard", {
        replace: true,
      });
      return;
    }

    setError("Please select an account type.");
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
                  src="/logo.jpeg"
                  alt="ImportEase"
                  className="h-14 w-auto object-contain sm:h-16"
                />
              </Link>
            </div>

            {/* HEADING */}

            <div className="mb-7 text-center">

              <h1 className="text-[26px] font-bold tracking-tight text-[#173563] sm:text-[29px]">
                Clearing Agent Sign In
              </h1>

              <p className="mx-auto mt-2 max-w-md text-[15px] leading-6 text-slate-500">
                Choose your account type and sign in to manage your
                clearing activities.
              </p>

            </div>

            {/* ACCOUNT TYPE */}

            <div className="mb-6">

              <div className="mb-3 flex items-center justify-between">

                <label className="block text-[15px] font-semibold text-slate-700">
                  Account Type
                </label>

                <span className="text-xs text-slate-400">
                  Select one
                </span>

              </div>

              {/* THREE SMALLER CARDS */}

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">

                {/* AGENCY ADMIN */}

                <button
                  type="button"
                  onClick={() =>
                    handleAgentTypeChange("agency-admin")
                  }
                  className={`relative rounded-2xl border px-3.5 py-3.5 text-left transition-all duration-200 ${
                    selectedAgentType === "agency-admin"
                      ? "border-[#2563EB] bg-blue-50/70 shadow-sm ring-1 ring-[#2563EB]"
                      : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm"
                  }`}
                >
                  {selectedAgentType === "agency-admin" && (
                    <CheckCircle2
                      className="absolute right-2.5 top-2.5 h-4 w-4 text-[#2563EB]"
                    />
                  )}

                  <div
                    className={`mb-2.5 flex h-9 w-9 items-center justify-center rounded-xl ${
                      selectedAgentType === "agency-admin"
                        ? "bg-[#2563EB] text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <Building2 className="h-[18px] w-[18px]" />
                  </div>

                  <p className="text-[14px] font-bold text-slate-800">
                    Agency Admin
                  </p>

                  <p className="mt-1 text-[12px] leading-5 text-slate-500">
                    Manage your agency
                  </p>
                </button>

                {/* AGENCY MEMBER */}

                <button
                  type="button"
                  onClick={() =>
                    handleAgentTypeChange("agency-member")
                  }
                  className={`relative rounded-2xl border px-3.5 py-3.5 text-left transition-all duration-200 ${
                    selectedAgentType === "agency-member"
                      ? "border-[#2563EB] bg-blue-50/70 shadow-sm ring-1 ring-[#2563EB]"
                      : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm"
                  }`}
                >
                  {selectedAgentType === "agency-member" && (
                    <CheckCircle2
                      className="absolute right-2.5 top-2.5 h-4 w-4 text-[#2563EB]"
                    />
                  )}

                  <div
                    className={`mb-2.5 flex h-9 w-9 items-center justify-center rounded-xl ${
                      selectedAgentType === "agency-member"
                        ? "bg-[#2563EB] text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <BriefcaseBusiness className="h-[18px] w-[18px]" />
                  </div>

                  <p className="text-[14px] font-bold text-slate-800">
                    Agency Member
                  </p>

                  <p className="mt-1 text-[12px] leading-5 text-slate-500">
                    Work under an agency
                  </p>
                </button>

                {/* INDIVIDUAL AGENT */}

                <button
                  type="button"
                  onClick={() =>
                    handleAgentTypeChange("individual-agent")
                  }
                  className={`relative rounded-2xl border px-3.5 py-3.5 text-left transition-all duration-200 ${
                    selectedAgentType === "individual-agent"
                      ? "border-[#2563EB] bg-blue-50/70 shadow-sm ring-1 ring-[#2563EB]"
                      : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm"
                  }`}
                >
                  {selectedAgentType === "individual-agent" && (
                    <CheckCircle2
                      className="absolute right-2.5 top-2.5 h-4 w-4 text-[#2563EB]"
                    />
                  )}

                  <div
                    className={`mb-2.5 flex h-9 w-9 items-center justify-center rounded-xl ${
                      selectedAgentType === "individual-agent"
                        ? "bg-[#2563EB] text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <UserRound className="h-[18px] w-[18px]" />
                  </div>

                  <p className="text-[14px] font-bold text-slate-800">
                    Individual Agent
                  </p>

                  <p className="mt-1 text-[12px] leading-5 text-slate-500">
                    Work independently
                  </p>
                </button>

              </div>
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
                  className="mb-2 block text-[15px] font-semibold text-slate-700"
                >
                  Email Address
                </label>

                <div className="relative">

                  <Mail
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
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-[15px] text-slate-800 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-50"
                  />

                </div>

              </div>

              {/* PASSWORD */}

              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label
                    htmlFor="agent-password"
                    className="block text-[15px] font-semibold text-slate-700"
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

                  <LockKeyhole
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
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-11 text-[15px] text-slate-800 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-50"
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
                      <EyeOff className="h-[18px] w-[18px]" />
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
                className="w-full rounded-xl bg-[#173563] px-4 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-[#173563]/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#122b50] hover:shadow-xl hover:shadow-[#173563]/15 focus:outline-none focus:ring-4 focus:ring-[#173563]/15 active:translate-y-0"
              >
                Continue to Dashboard
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