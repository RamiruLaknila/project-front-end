import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  BriefcaseBusiness,
  Check,
  ArrowLeft,
} from "lucide-react";

function SignUp() {
  const [userType, setUserType] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    businessName: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!userType) {
      setError("Please choose your account type.");
      return;
    }

    if (
      !formData.fullName ||
      !formData.businessName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!formData.terms) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    console.log("Registration data:", {
      ...formData,
      userType,
    });

    alert(
      `Account ready to be created as ${
        userType === "sme" ? "SME / Importer" : "Clearing Agent"
      }`
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F8FAFC] px-4 py-8 sm:py-10">

      {/* ===================== BACKGROUND DECORATION ===================== */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-100/50 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-slate-200/50 blur-3xl" />

      {/* ===================== MAIN CONTAINER ===================== */}
      <div className="relative mx-auto w-full max-w-lg">

        {/* ===================== LOGO ===================== */}
        <div className="mb-7 flex justify-center">
          <Link
            to="/"
            className="group flex items-center gap-3"
          >
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

        {/* ===================== MAIN CARD ===================== */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.15)] sm:p-7">

          {/* ===================== HEADING ===================== */}
          <div className="mb-7 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[26px]">
              Create your account
            </h1>

            <p className="mt-1.5 text-sm text-slate-500">
              Choose how you'll use ImportEase
            </p>
          </div>

          {/* ===================== ACCOUNT TYPE ===================== */}
          <div className="mb-6">
            <p className="mb-2.5 text-sm font-semibold text-slate-700">
              Account type
            </p>

            <div className="grid gap-3 sm:grid-cols-2">

              {/* ================= SME / IMPORTER ================= */}
              <button
                type="button"
                onClick={() => {
                  setUserType("sme");
                  setError("");
                }}
                className={`relative rounded-xl border-2 px-3.5 py-3 text-left transition-all duration-200 ${
                  userType === "sme"
                    ? "border-[#173563] bg-[#F3F7FC] shadow-[0_8px_20px_-10px_rgba(23,53,99,0.35)]"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                }`}
              >

                {/* SELECTED CHECK */}
                {userType === "sme" && (
                  <div className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#173563] text-white shadow-sm">
                    <Check size={11} strokeWidth={3} />
                  </div>
                )}

                {/* ICON */}
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 ${
                    userType === "sme"
                      ? "bg-[#173563] text-white"
                      : "bg-blue-50 text-[#173563]"
                  }`}
                >
                  <Building2 size={16} strokeWidth={2} />
                </div>

                <h3 className="mt-2 text-xs font-semibold text-slate-900">
                  SME / Importer
                </h3>

                <p className="mt-1 text-[10px] leading-3.5 text-slate-500">
                  Manage imports, tariffs, shipments and clearing agents.
                </p>
              </button>

              {/* ================= CLEARING AGENT ================= */}
              <button
                type="button"
                onClick={() => {
                  setUserType("agent");
                  setError("");
                }}
                className={`relative rounded-xl border-2 px-3.5 py-3 text-left transition-all duration-200 ${
                  userType === "agent"
                    ? "border-[#173563] bg-[#F3F7FC] shadow-[0_8px_20px_-10px_rgba(23,53,99,0.35)]"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                }`}
              >

                {/* SELECTED CHECK */}
                {userType === "agent" && (
                  <div className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#173563] text-white shadow-sm">
                    <Check size={11} strokeWidth={3} />
                  </div>
                )}

                {/* ICON */}
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 ${
                    userType === "agent"
                      ? "bg-[#173563] text-white"
                      : "bg-blue-50 text-[#173563]"
                  }`}
                >
                  <BriefcaseBusiness size={16} strokeWidth={2} />
                </div>

                <h3 className="mt-2 text-xs font-semibold text-slate-900">
                  Clearing Agent
                </h3>

                <p className="mt-1 text-[10px] leading-3.5 text-slate-500">
                  Receive requests, submit bids and manage SME clients.
                </p>
              </button>

            </div>
          </div>

          {/* ===================== ERROR ===================== */}
          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          {/* ===================== FORM ===================== */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* FULL NAME */}
            <div>
              <label
                htmlFor="fullName"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Full name
              </label>

              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-slate-400 focus:border-[#173563] focus:ring-2 focus:ring-[#173563]/10"
              />
            </div>

            {/* BUSINESS NAME */}
            <div>
              <label
                htmlFor="businessName"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Business name
              </label>

              <input
                id="businessName"
                name="businessName"
                type="text"
                value={formData.businessName}
                onChange={handleChange}
                placeholder="Enter your business name"
                className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-slate-400 focus:border-[#173563] focus:ring-2 focus:ring-[#173563]/10"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@company.com"
                className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-slate-400 focus:border-[#173563] focus:ring-2 focus:ring-[#173563]/10"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-slate-400 focus:border-[#173563] focus:ring-2 focus:ring-[#173563]/10"
              />
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Confirm password
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-slate-400 focus:border-[#173563] focus:ring-2 focus:ring-[#173563]/10"
              />
            </div>

            {/* TERMS */}
            <div className="flex items-start gap-3 pt-1">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={formData.terms}
                onChange={handleChange}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-[#173563] focus:ring-[#173563]"
              />

              <label
                htmlFor="terms"
                className="text-xs leading-5 text-slate-500"
              >
                I agree to the{" "}
                <a
                  href="#"
                  className="font-medium text-[#173563] hover:underline"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="font-medium text-[#173563] hover:underline"
                >
                  Privacy Policy
                </a>
                .
              </label>
            </div>

            {/* ===================== CREATE ACCOUNT ===================== */}
            <button
              type="submit"
              className="w-full rounded-xl bg-[#173563] py-3 text-sm font-semibold text-white shadow-lg shadow-[#173563]/15 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#102547] hover:shadow-xl hover:shadow-[#173563]/20 active:translate-y-0 active:scale-[0.99]"
            >
              Create Account
            </button>
          </form>

          {/* ===================== SIGN IN ===================== */}
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

        {/* ===================== BACK HOME ===================== */}
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

export default SignUp;