import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
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
      businessName: formData.businessName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      profileStatus: "incomplete",
      accountStatus: "active",
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("smeUser", JSON.stringify(smeUser));
    localStorage.setItem("signupRole", "sme");
    localStorage.setItem("smeSignupComplete", "true");
    localStorage.setItem("smeRegisteredEmail", formData.email.trim());

    navigate("/sme-signup-success");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F8FAFC] px-4 py-10 sm:py-14">

      {/* =====================================================
          BACKGROUND DECORATION
      ===================================================== */}

      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-100/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-slate-200/50 blur-3xl" />

      {/* =====================================================
          MAIN CONTAINER
      ===================================================== */}

      <div className="relative mx-auto w-full max-w-xl">

        {/* ===================================================
            LOGO
        =================================================== */}

        <div className="mb-8 flex justify-center">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/logo.jpeg"
              alt="ImportEase"
              className="h-16 w-16 object-contain mix-blend-multiply sm:h-[72px] sm:w-[72px]"
            />
            <span className="text-3xl font-bold tracking-tight text-slate-900">
              Import
              <span className="text-[#173563]">Ease</span>
            </span>
          </Link>
        </div>

        {/* ===================================================
            MAIN CARD
        =================================================== */}

        <div className="rounded-3xl border border-slate-200/90 bg-white p-8 shadow-2xl sm:p-10">

          {/* =================================================
              HEADING
          ================================================= */}

          <div className="mb-8 text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Create an account
            </h1>
            <p className="mt-2 text-base text-slate-500">
              Enter your information below to create your account
            </p>
          </div>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3.5">
              <p className="text-sm font-medium leading-5 text-red-600">
                {error}
              </p>
            </div>
          )}

          {/* =================================================
              FORM
          ================================================= */}

          <form onSubmit={handleSubmit} className="space-y-7">

            {/* =================================================
                PERSONAL INFORMATION
            ================================================= */}

            <section>
              <div className="mb-4 flex items-center gap-2.5">
                <UserRound size={19} className="text-[#173563]" />
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Personal information
                  </h2>
                </div>
              </div>

              <InputField
                label="Full Name"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder=""
                required
              />
            </section>

            {/* =================================================
                CONTACT INFORMATION
            ================================================= */}

            <section>
              <div className="mb-4 flex items-center gap-2.5">
                <Mail size={19} className="text-[#173563]" />
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Contact information
                  </h2>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-1">
                <InputField
                  label="Email address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder=""
                  required
                />

                <InputField
                  label="Phone number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder=""
                  required
                />
              </div>
            </section>

            {/* =================================================
                SECURITY
            ================================================= */}

            <section>
              <div className="mb-4 flex items-center gap-2.5">
                <LockKeyhole size={19} className="text-[#173563]" />
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Account security
                  </h2>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-1">
                <PasswordField
                  label="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder=""
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  helperText="Password must contain at least 6 characters."
                />

                <PasswordField
                  label="Confirm password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder=""
                  showPassword={showConfirmPassword}
                  setShowPassword={setShowConfirmPassword}
                />
              </div>
            </section>

            {/* =================================================
                TERMS
            ================================================= */}

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-slate-100/70">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-[#173563] focus:ring-[#173563]"
              />
              <span className="text-xs leading-5 text-slate-600">
                I agree to the{" "}
                <span className="font-semibold text-[#173563]">
                  Terms of Service
                </span>{" "}
                and{" "}
                <span className="font-semibold text-[#173563]">
                  Privacy Policy
                </span>{" "}
                of ImportEase.
              </span>
            </label>

            {/* =================================================
                SUBMIT
            ================================================= */}

            <button
              type="submit"
              className="group flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#173563] px-6 py-4 text-base font-bold text-white shadow-lg shadow-[#173563]/20 transition hover:bg-[#10294d] hover:shadow-xl"
            >
              Create SME Account
              <ArrowRight
                size={19}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>

          </form>

          {/* =================================================
              ALREADY HAVE AN ACCOUNT
          ================================================= */}

          <div className="mt-7 border-t border-slate-100 pt-6 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="font-semibold text-[#173563] transition hover:text-blue-700"
              >
                Sign in
              </Link>
            </p>
          </div>

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
  placeholder = "",
  subtext,
  required = false,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-slate-800"
      >
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <div className="relative">
        {type === "email" && (
          <Mail
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
        )}
        {type === "tel" && (
          <Phone
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
        )}
        {type === "text" && name === "fullName" && (
          <UserRound
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
        )}
        {type === "text" && name === "businessName" && (
          <Store
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
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
          autoComplete="off"
          className={`w-full rounded-xl border border-slate-300 bg-white py-3.5 pr-4 text-base text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#173563] focus:ring-2 focus:ring-[#173563]/20 ${
            type === "email" ||
            type === "tel" ||
            name === "fullName" ||
            name === "businessName"
              ? "pl-11"
              : "pl-4"
          }`}
        />
      </div>

      {subtext && (
        <p className="mt-1.5 text-xs leading-5 text-slate-500">
          {subtext}
        </p>
      )}
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
  placeholder = "",
  showPassword,
  setShowPassword,
  helperText,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-slate-800"
      >
        {label}
        <span className="ml-1 text-red-500">*</span>
      </label>

      <div className="relative">
        <LockKeyhole
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          id={name}
          name={name}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          autoComplete="new-password"
          className="w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-11 pr-12 text-base text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#173563] focus:ring-2 focus:ring-[#173563]/20"
        />

        <button
          type="button"
          onClick={() => setShowPassword((previous) => !previous)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
        </button>
      </div>

      {helperText && (
        <p className="mt-1.5 text-xs leading-5 text-slate-400">
          {helperText}
        </p>
      )}
    </div>
  );
}

export default SMESignUp;