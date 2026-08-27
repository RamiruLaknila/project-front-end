import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  Store,
  UserRound,
} from "lucide-react";

function SMESignUp() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    businessName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const [error, setError] = useState("");

  /* =========================================================
     HANDLE INPUT
  ========================================================= */

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (error) {
      setError("");
    }
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");

    /*
      Required fields:
      - Full name
      - Email
      - Phone
      - Password
      - Confirm password
      - Terms

      Business name is OPTIONAL.
    */

    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!formData.agreeTerms) {
      setError(
        "Please agree to the Terms of Service and Privacy Policy."
      );
      return;
    }

    /* =======================================================
       FRONTEND-ONLY USER DATA
    ======================================================= */

    const smeUser = {
      role: "sme",

      fullName: formData.fullName.trim(),

      // Optional
      businessName: formData.businessName.trim(),

      email: formData.email.trim(),

      phone: formData.phone.trim(),

      profileStatus: "incomplete",

      accountStatus: "active",

      createdAt: new Date().toISOString(),
    };

    /*
      Save the user for the frontend prototype.
    */

    localStorage.setItem(
      "smeUser",
      JSON.stringify(smeUser)
    );

    /*
      Save the signup role.
    */

    localStorage.setItem(
      "signupRole",
      "sme"
    );

    /*
      Mark signup as completed.
    */

    localStorage.setItem(
      "smeSignupComplete",
      "true"
    );

    /*
      Store the email separately so the
      sign-in page can use it if needed.
    */

    localStorage.setItem(
      "smeRegisteredEmail",
      formData.email.trim()
    );

    /*
      IMPORTANT:
      Do NOT automatically log the user in.

      Registration complete → SME Sign In.
    */

    navigate("/signin");
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

      <div className="relative mx-auto w-full max-w-2xl">

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
            MAIN CARD
        =================================================== */}

        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.15)] sm:p-8">

          {/* =================================================
              ICON
          ================================================= */}

          <div className="mb-5 flex justify-center">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#173563] shadow-md shadow-[#173563]/15">

              <Store
                size={23}
                className="text-white"
              />

            </div>

          </div>

          {/* =================================================
              HEADING
          ================================================= */}

          <div className="mb-7 text-center">

            <div className="mb-2 flex justify-center">

              <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600">
                SME Account
              </span>

            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[27px]">
              Create your SME account
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Create your ImportEase account to manage imports,
              calculate costs and connect with clearing agents.
            </p>

          </div>

          {/* =================================================
              PROGRESS
          ================================================= */}

          <div className="mb-8">

            <div className="flex items-start">

              <ProgressStep
                number="1"
                label="Account"
                active
              />

              <div className="mt-4 h-px flex-1 bg-slate-200" />

              <ProgressStep
                number="2"
                label="Profile"
              />

              <div className="mt-4 h-px flex-1 bg-slate-200" />

              <ProgressStep
                number="3"
                label="Dashboard"
              />

            </div>

          </div>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3">

              <p className="text-xs font-medium leading-5 text-red-600">
                {error}
              </p>

            </div>
          )}

          {/* =================================================
              FORM
          ================================================= */}

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* =================================================
                PERSONAL INFORMATION
            ================================================= */}

            <section>

              <div className="mb-4 flex items-center gap-2">

                <UserRound
                  size={17}
                  className="text-[#173563]"
                />

                <div>

                  <h2 className="text-sm font-bold text-slate-900">
                    Personal information
                  </h2>

                  <p className="text-[10px] text-slate-400">
                    Tell us a little about yourself.
                  </p>

                </div>

              </div>

              <InputField
                label="Full name"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />

            </section>

            {/* =================================================
                CONTACT INFORMATION
            ================================================= */}

            <section>

              <div className="mb-4 flex items-center gap-2">

                <Mail
                  size={17}
                  className="text-[#173563]"
                />

                <div>

                  <h2 className="text-sm font-bold text-slate-900">
                    Contact information
                  </h2>

                  <p className="text-[10px] text-slate-400">
                    We'll use these details for your account.
                  </p>

                </div>

              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                <InputField
                  label="Email address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />

                <InputField
                  label="Phone number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+94 77 123 4567"
                  required
                />

              </div>

            </section>

            {/* =================================================
                BUSINESS INFORMATION - OPTIONAL
            ================================================= */}

            <section>

              <div className="mb-4 flex items-center justify-between">

                <div className="flex items-center gap-2">

                  <Store
                    size={17}
                    className="text-[#173563]"
                  />

                  <div>

                    <h2 className="text-sm font-bold text-slate-900">
                      Business information
                    </h2>

                    <p className="text-[10px] text-slate-400">
                      You can provide this later.
                    </p>

                  </div>

                </div>

                <span className="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-semibold text-slate-500">
                  Optional
                </span>

              </div>

              <InputField
                label="Business name"
                name="businessName"
                type="text"
                value={formData.businessName}
                onChange={handleChange}
                placeholder="Enter your business name (optional)"
              />

              <p className="mt-2 text-[10px] leading-5 text-slate-400">
                You don't need to have a registered business to
                create your ImportEase account. You can add or
                update your business information later.
              </p>

            </section>

            {/* =================================================
                SECURITY
            ================================================= */}

            <section>

              <div className="mb-4 flex items-center gap-2">

                <LockKeyhole
                  size={17}
                  className="text-[#173563]"
                />

                <div>

                  <h2 className="text-sm font-bold text-slate-900">
                    Account security
                  </h2>

                  <p className="text-[10px] text-slate-400">
                    Create a secure password.
                  </p>

                </div>

              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                <PasswordField
                  label="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                />

                <PasswordField
                  label="Confirm password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  showPassword={showConfirmPassword}
                  setShowPassword={setShowConfirmPassword}
                />

              </div>

              <p className="mt-2 text-[10px] leading-5 text-slate-400">
                Password must contain at least 6 characters.
              </p>

            </section>

            {/* =================================================
                TERMS
            ================================================= */}

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 transition hover:bg-slate-100/70">

              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#173563] focus:ring-[#173563]"
              />

              <span className="text-[11px] leading-5 text-slate-500">

                I agree to the{" "}

                <span className="font-semibold text-[#173563]">
                  Terms of Service
                </span>

                {" "}and{" "}

                <span className="font-semibold text-[#173563]">
                  Privacy Policy
                </span>

                {" "}of ImportEase.

              </span>

            </label>

            {/* =================================================
                SUBMIT
            ================================================= */}

            <button
              type="submit"
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#173563] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#173563]/15 transition hover:bg-[#10294d] hover:shadow-xl"
            >

              Create SME Account

              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />

            </button>

          </form>

          {/* =================================================
              SECURITY INFORMATION
          ================================================= */}

          <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3">

            <div className="flex items-start gap-3">

              <ShieldCheck
                size={17}
                className="mt-0.5 shrink-0 text-blue-600"
              />

              <div>

                <p className="text-[11px] font-bold text-blue-800">
                  Your information is protected
                </p>

                <p className="mt-0.5 text-[10px] leading-5 text-blue-700">
                  Your information is stored locally for this
                  frontend prototype and is used to personalize
                  your ImportEase experience.
                </p>

              </div>

            </div>

          </div>

          {/* =================================================
              CLEARING AGENT LINK
          ================================================= */}

          <div className="mt-6 border-t border-slate-100 pt-5 text-center">

            <p className="text-sm text-slate-500">

              Are you a clearing agent?{" "}

              <Link
                to="/agent-signup"
                onClick={() => {
                  localStorage.setItem(
                    "signupRole",
                    "clearing-agent"
                  );
                }}
                className="font-semibold text-[#173563] transition hover:text-blue-700"
              >
                Register as a Clearing Agent
              </Link>

            </p>

          </div>

        </div>

        {/* ===================================================
            BACK TO ACCOUNT TYPE
        =================================================== */}

        <div className="mt-5 flex justify-center">

          <Link
            to="/signup"
            className="flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-800"
          >

            <ArrowLeft size={16} />

            Change account type

          </Link>

        </div>

      </div>

    </div>
  );
}


/* =========================================================
   INPUT FIELD
========================================================= */

function InputField({
  label,
  name,
  type,
  value,
  onChange,
  placeholder,
  required = false,
}) {
  return (
    <div>

      <label
        htmlFor={name}
        className="mb-2 block text-xs font-semibold text-slate-700"
      >

        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}

      </label>

      <div className="relative">

        {type === "email" && (
          <Mail
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
        )}

        {type === "tel" && (
          <Phone
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
        )}

        {type === "text" && name === "fullName" && (
          <UserRound
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
        )}

        {type === "text" && name === "businessName" && (
          <Store
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
        )}

        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full rounded-xl border border-slate-200 bg-white py-3 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-[#173563] focus:ring-4 focus:ring-[#173563]/5 ${
            type === "email" ||
            type === "tel" ||
            name === "fullName" ||
            name === "businessName"
              ? "pl-10"
              : "pl-3"
          }`}
        />

      </div>

    </div>
  );
}


/* =========================================================
   PASSWORD FIELD
========================================================= */

function PasswordField({
  label,
  name,
  value,
  onChange,
  placeholder,
  showPassword,
  setShowPassword,
}) {
  return (
    <div>

      <label
        htmlFor={name}
        className="mb-2 block text-xs font-semibold text-slate-700"
      >

        {label}

        <span className="ml-1 text-red-500">
          *
        </span>

      </label>

      <div className="relative">

        <LockKeyhole
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          id={name}
          name={name}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-11 text-sm text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-[#173563] focus:ring-4 focus:ring-[#173563]/5"
        />

        <button
          type="button"
          onClick={() =>
            setShowPassword((previous) => !previous)
          }
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
          aria-label={
            showPassword
              ? "Hide password"
              : "Show password"
          }
        >

          {showPassword ? (
            <EyeOff size={17} />
          ) : (
            <Eye size={17} />
          )}

        </button>

      </div>

    </div>
  );
}


/* =========================================================
   PROGRESS STEP
========================================================= */

function ProgressStep({
  number,
  label,
  active = false,
}) {
  return (
    <div className="flex shrink-0 flex-col items-center">

      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
          active
            ? "bg-[#173563] text-white"
            : "bg-slate-100 text-slate-400"
        }`}
      >

        {active ? (
          <CheckCircle2 size={15} />
        ) : (
          number
        )}

      </div>

      <span
        className={`mt-1.5 text-[9px] font-semibold ${
          active
            ? "text-[#173563]"
            : "text-slate-400"
        }`}
      >
        {label}
      </span>

    </div>
  );
}

export default SMESignUp;