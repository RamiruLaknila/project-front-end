import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Buildings,
  CheckCircle,
  MagnifyingGlass,
  ShieldCheck,
  UserCircle,
  FileText,
  Lock,
  Eye,
  EyeSlash,
} from "@phosphor-icons/react";

import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { authErrorMessage } from "../lib/authErrors";

function JoinAgency() {
  const navigate = useNavigate();
  const { register, completeGoogleProfile, firebaseUser, user } = useAuth();
  // Signed in via Google but no backend profile yet -- finishing a Google
  // signup here, so no new account/password needs to be created.
  const isGoogleFlow = !!firebaseUser && !user;

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [checkingCode, setCheckingCode] = useState(false);
  const [formError, setFormError] = useState("");

  // firebaseUser/user are already resolved by the time this page mounts (no
  // reload happens between the Google popup and reaching here), so the
  // Google-flow prefill can be a lazy initial value instead of an effect.
  const [formData, setFormData] = useState(() => ({
    agencyCode: "",
    fullName: isGoogleFlow ? firebaseUser.displayName || "" : "",
    email: isGoogleFlow ? firebaseUser.email || "" : "",
    phone: "",
    address: "",
    licenseNumber: "",
    licenseExpiry: "",
    password: "",
    confirmPassword: "",
  }));

  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: "",
    }));

    setFormError("");
  };

  const updateDigitsField = (field, value, maxLength) => {
    updateField(field, value.replace(/\D/g, "").slice(0, maxLength));
  };

  const validateStep = () => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.agencyCode.trim()) {
        newErrors.agencyCode =
          "Enter the agency code your agency administrator gave you.";
      }
    }

    if (step === 2) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = "Full name is required.";
      }

      if (!isGoogleFlow && !formData.email.trim()) {
        newErrors.email = "Email is required.";
      }

      if (formData.phone.length !== 10) {
        newErrors.phone = "Phone number must be 10 digits.";
      }

      if (!formData.address.trim()) {
        newErrors.address =
          "Address is required.";
      }

      if (!isGoogleFlow) {
        if (!formData.password) {
          newErrors.password = "Password is required.";
        } else if (formData.password.length < 6) {
          newErrors.password = "Password must be at least 6 characters.";
        }

        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = "Passwords do not match.";
        }
      }
    }

    if (step === 3) {
      if (!formData.licenseNumber.trim()) {
        newErrors.licenseNumber =
          "License number is required.";
      }

      if (!formData.licenseExpiry) {
        newErrors.licenseExpiry =
          "License expiry date is required.";
      } else if (formData.licenseExpiry < new Date().toISOString().slice(0, 10)) {
        newErrors.licenseExpiry =
          "This license has expired. Please provide a valid license.";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (submitting || checkingCode) return;
    if (!validateStep()) return;

    if (step === 1) {
      setCheckingCode(true);
      try {
        await api.get(
          `/agencies/by-code/${encodeURIComponent(formData.agencyCode.trim())}`,
          { auth: false }
        );
      } catch (err) {
        setErrors((previous) => ({
          ...previous,
          agencyCode:
            err?.status === 404
              ? "That agency code doesn't match any registered agency. Double-check it and try again."
              : authErrorMessage(err, "Could not verify that code. Try again."),
        }));
        setCheckingCode(false);
        return;
      }
      setCheckingCode(false);
    }

    if (step < 4) {
      setStep((previous) => previous + 1);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    handleSubmit();
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((previous) => previous - 1);
      setErrors({});
      return;
    }

    navigate("/agency-choice");
  };

  const handleSubmit = async () => {
    setFormError("");
    setSubmitting(true);
    try {
      // Registering with an agency code creates the account as a PENDING member
      // of that agency (agentStatus "pending") -- the agency admin approves it.
      if (isGoogleFlow) {
        // Matches register()'s own behavior for a joining agent: license
        // details are collected above but not stored on the user doc --
        // the agency admin reviews/approves this agent directly.
        await completeGoogleProfile({
          role: "clearing_agent",
          agencyCode: formData.agencyCode,
          phone: formData.phone,
        });
      } else {
        await register({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: "clearing_agent",
          agencyCode: formData.agencyCode,
          phone: formData.phone,
        });
      }

      navigate("/agent-pending", { replace: true });
    } catch (err) {
      // e.g. "Invalid agency code" (400) or "email already exists".
      setFormError(authErrorMessage(err, "Could not submit your request."));
      // Send them back to step 1 if the code was the problem.
      if (/agency code/i.test(err?.message || "")) setStep(1);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 py-8 sm:py-10">
      <div className="mx-auto w-full max-w-4xl">

        {/* HEADER */}
        <div className="mb-6">
          <button
            type="button"
            onClick={handleBack}
            className="mb-5 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-800"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#173563]">
              <Buildings
                size={21}
                className="text-white"
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Join an Existing Agency
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Submit a request to join a registered clearing agency.
              </p>
            </div>
          </div>
        </div>

        {/* PROGRESS */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <StepIndicator
              number="1"
              title="Find Agency"
              active={step === 1}
              completed={step > 1}
            />
            <div className="mx-2 h-px flex-1 bg-slate-200" />
            <StepIndicator
              number="2"
              title="Personal & Security"
              active={step === 2}
              completed={step > 2}
            />
            <div className="mx-2 h-px flex-1 bg-slate-200" />
            <StepIndicator
              number="3"
              title="License"
              active={step === 3}
              completed={step > 3}
            />
            <div className="mx-2 h-px flex-1 bg-slate-200" />
            <StepIndicator
              number="4"
              title="Review"
              active={step === 4}
              completed={false}
            />
          </div>
        </div>

        {/* MAIN CARD */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          {/* STEP 1 */}
          {step === 1 && (
            <div>
              <SectionHeader
                icon={MagnifyingGlass}
                title="Enter Your Agency Code"
                description="Your agency administrator has a unique code (e.g. AG-7X3K9P). Enter it to request to join."
              />

              <div className="relative mt-7">
                <Buildings
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={formData.agencyCode}
                  onChange={(event) =>
                    updateField(
                      "agencyCode",
                      event.target.value.toUpperCase()
                    )
                  }
                  placeholder="AG-XXXXXX"
                  autoComplete="off"
                  className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm uppercase tracking-wider outline-none transition placeholder:text-slate-400 placeholder:normal-case focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {errors.agencyCode && (
                <p className="mt-2 text-xs text-red-500">
                  {errors.agencyCode}
                </p>
              )}

              <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck
                    size={18}
                    className="mt-0.5 shrink-0 text-blue-600"
                  />
                  <p className="text-xs leading-5 text-blue-800">
                    The code is checked before you continue. Don't have one? Ask your
                    agency admin, or{" "}
                    <button
                      type="button"
                      onClick={() => navigate("/agency-create")}
                      className="font-semibold underline"
                    >
                      create a new agency
                    </button>{" "}
                    instead.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div>
              <SectionHeader
                icon={UserCircle}
                title="Personal Details & Security"
                description="Enter your personal credentials and set up an account password."
              />

              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <InputField
                  label="Full Name"
                  value={formData.fullName}
                  onChange={(value) =>
                    updateField("fullName", value)
                  }
                  placeholder="John Perera"
                  error={errors.fullName}
                  required
                />

                <InputField
                  label="Email Address"
                  type="email"
                  autoComplete="off"
                  value={formData.email}
                  onChange={(value) =>
                    updateField("email", value)
                  }
                  placeholder="john@example.com"
                  error={errors.email}
                  required
                  disabled={isGoogleFlow}
                />

                <InputField
                  label="Phone Number"
                  type="tel"
                  value={formData.phone}
                  onChange={(value) =>
                    updateDigitsField("phone", value, 10)
                  }
                  placeholder="0771234567"
                  error={errors.phone}
                  required
                />

                <div className="sm:col-span-2">
                  <InputField
                    label="Address"
                    value={formData.address}
                    onChange={(value) =>
                      updateField("address", value)
                    }
                    placeholder="Enter your address"
                    error={errors.address}
                    required
                  />
                </div>

                {!isGoogleFlow && (
                  <>
                    <PasswordField
                      label="Password"
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={(value) =>
                        updateField("password", value)
                      }
                      placeholder="Create a password"
                      error={errors.password}
                      required
                    />

                    <PasswordField
                      label="Confirm Password"
                      autoComplete="new-password"
                      value={formData.confirmPassword}
                      onChange={(value) =>
                        updateField("confirmPassword", value)
                      }
                      placeholder="Confirm your password"
                      error={errors.confirmPassword}
                      required
                    />
                  </>
                )}
              </div>

              <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
                <p className="text-[12px] font-semibold uppercase tracking-wide text-blue-600">
                  Joining agency
                </p>
                <p className="mt-1 text-sm font-bold text-slate-900">
                  Code {formData.agencyCode || "—"}
                </p>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div>
              <SectionHeader
                icon={FileText}
                title="License Details"
                description="Provide your clearing agent license information."
              />

              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <InputField
                  label="License Number"
                  value={formData.licenseNumber}
                  onChange={(value) =>
                    updateField("licenseNumber", value)
                  }
                  placeholder="CL-123456"
                  error={errors.licenseNumber}
                  required
                />

                <InputField
                  label="License Expiry Date"
                  type="date"
                  value={formData.licenseExpiry}
                  onChange={(value) =>
                    updateField("licenseExpiry", value)
                  }
                  error={errors.licenseExpiry}
                  required
                />
              </div>

              <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck
                    size={18}
                    className="mt-0.5 shrink-0 text-blue-600"
                  />
                  <p className="text-xs leading-5 text-blue-800">
                    Your agency administrator will review your license information before approving your request.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div>
              <SectionHeader
                icon={CheckCircle}
                title="Review Application"
                description="Check your information before submitting."
              />

              <div className="mt-7 space-y-5">
                <ReviewSection title="Agency">
                  <ReviewRow label="Agency Code" value={formData.agencyCode} />
                </ReviewSection>

                <ReviewSection title="Personal & Account Details">
                  <ReviewRow label="Full Name" value={formData.fullName} />
                  <ReviewRow label="Email" value={formData.email} />
                  <ReviewRow label="Phone" value={formData.phone} />
                  <ReviewRow label="Address" value={formData.address} />
                  <ReviewRow label="Password" value="••••••••••••" />
                </ReviewSection>

                <ReviewSection title="License Details">
                  <ReviewRow label="License Number" value={formData.licenseNumber} />
                  <ReviewRow label="License Expiry" value={formData.licenseExpiry} />
                </ReviewSection>

                <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
                  <p className="text-xs leading-5 text-amber-800">
                    By submitting this application, your information will be sent to the selected agency administrator for review.
                  </p>
                </div>
              </div>
            </div>
          )}

          {formError && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {formError}
            </div>
          )}

          {/* ACTIONS */}
          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={handleBack}
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
            >
              <ArrowLeft size={16} />
              Back
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={submitting || checkingCode}
              className="inline-flex items-center gap-2 rounded-xl bg-[#173563] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#10294d] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {checkingCode
                ? "Checking code…"
                : submitting
                ? "Submitting…"
                : step === 4
                ? "Submit Application"
                : "Continue"}
              <ArrowRight size={16} />
            </button>
          </div>

        </div>

        {/* FOOTER */}
        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck size={14} />
          ImportEase Clearing Agent Registration
        </div>

      </div>
    </div>
  );
}

/* =========================================================
   STEP INDICATOR
========================================================= */

function StepIndicator({ number, title, active, completed }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
          completed
            ? "bg-emerald-500 text-white"
            : active
            ? "bg-[#173563] text-white"
            : "bg-slate-100 text-slate-400"
        }`}
      >
        {completed ? <CheckCircle size={15} /> : number}
      </div>

      <span
        className={`hidden text-xs font-semibold sm:block ${
          active ? "text-slate-900" : "text-slate-400"
        }`}
      >
        {title}
      </span>
    </div>
  );
}

/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({ icon: Icon, title, description }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Icon size={19} />
      </div>
      <div>
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
    </div>
  );
}

/* =========================================================
   INPUT
========================================================= */

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete = "on",
  error,
  required = false,
  disabled = false,
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-slate-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <input
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full rounded-xl border px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
            : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        }`}
      />

      {error && <p className="mt-1.5 text-[12px] text-red-500">{error}</p>}
    </div>
  );
}

/* =========================================================
   PASSWORD FIELD WITH TOGGLE
========================================================= */

function PasswordField({
  label,
  value,
  onChange,
  placeholder,
  autoComplete = "off",
  error,
  required = false,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-slate-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
          <Lock size={16} />
        </span>

        <input
          type={showPassword ? "text" : "password"}
          autoComplete={autoComplete}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-xl border py-3 pl-10 pr-10 text-sm outline-none transition placeholder:text-slate-400 ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
              : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          }`}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600"
        >
          {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {error && <p className="mt-1.5 text-[12px] text-red-500">{error}</p>}
    </div>
  );
}

/* =========================================================
   REVIEW SECTION
========================================================= */

function ReviewSection({ title, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-5">
      <h3 className="text-sm font-bold text-slate-900">{title}</h3>
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );
}

/* =========================================================
   REVIEW ROW
========================================================= */

function ReviewRow({ label, value }) {
  return (
    <div className="flex flex-col gap-1 border-b border-slate-100 pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-sm font-semibold text-slate-900 sm:text-right">
        {value || "—"}
      </span>
    </div>
  );
}

export default JoinAgency;