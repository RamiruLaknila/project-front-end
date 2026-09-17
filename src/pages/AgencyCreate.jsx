import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Buildings,
  CheckCircle,
  Eye,
  EyeSlash,
  FileText,
  UserCircle,
  ShieldCheck,
} from "@phosphor-icons/react";

import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { authErrorMessage } from "../lib/authErrors";

function AgencyCreate() {
  const navigate = useNavigate();
  const { registerAgency, completeGoogleAgency, firebaseUser, user } = useAuth();
  // Signed in via Google but no backend profile yet -- finishing a Google
  // signup here, so no new account/password needs to be created.
  const isGoogleFlow = !!firebaseUser && !user;

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // firebaseUser/user are already resolved by the time this page mounts (no
  // reload happens between the Google popup and reaching here), so the
  // Google-flow prefill can be a lazy initial value instead of an effect.
  const [formData, setFormData] = useState(() => ({
    agencyName: "",
    businessRegistrationNumber: "",
    agencyAddress: "",
    city: "",
    phone: "",
    email: "",

    licenseNumber: "",
    licenseExpiry: "",

    ownerName: isGoogleFlow ? firebaseUser.displayName || "" : "",
    ownerEmail: isGoogleFlow ? firebaseUser.email || "" : "",
    ownerPhone: "",
    ownerNic: "",

    password: "",
    confirmPassword: "",
  }));

  const [errors, setErrors] = useState({});

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const updateField = (field, value) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: "",
    }));
  };

  const updateDigitsField = (field, value, maxLength) => {
    const digits = value.replace(/\D/g, "").slice(0, maxLength);
    updateField(field, digits);
  };

  const validateStep = () => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.agencyName.trim()) {
        newErrors.agencyName = "Agency name is required";
      }

      if (!formData.businessRegistrationNumber.trim()) {
        newErrors.businessRegistrationNumber =
          "Business registration number is required";
      }

      if (!formData.agencyAddress.trim()) {
        newErrors.agencyAddress = "Agency address is required";
      }

      if (!formData.city.trim()) {
        newErrors.city = "City is required";
      }

      if (formData.phone.length !== 10) {
        newErrors.phone = "Phone number must be 10 digits";
      }

      if (!formData.email.trim()) {
        newErrors.email = "Agency email is required";
      }
    }

    if (step === 2) {
      if (!formData.licenseNumber.trim()) {
        newErrors.licenseNumber = "License number is required";
      }

      if (!formData.licenseExpiry) {
        newErrors.licenseExpiry = "License expiry date is required";
      } else if (formData.licenseExpiry < new Date().toISOString().slice(0, 10)) {
        newErrors.licenseExpiry = "This license has expired. Please provide a valid license.";
      }
    }

    if (step === 3) {
      if (!formData.ownerName.trim()) {
        newErrors.ownerName = "Owner name is required";
      }

      if (!formData.ownerEmail.trim()) {
        newErrors.ownerEmail = "Owner email is required";
      }

      if (formData.ownerPhone.length !== 10) {
        newErrors.ownerPhone = "Phone number must be 10 digits";
      }

      if (!formData.ownerNic.trim()) {
        newErrors.ownerNic = "NIC / ID number is required";
      }

      if (!isGoogleFlow) {
        if (!formData.password) {
          newErrors.password = "Password is required";
        } else if (formData.password.length < 8) {
          newErrors.password = "Password must be at least 8 characters";
        }

        if (!formData.confirmPassword) {
          newErrors.confirmPassword = "Please confirm your password";
        } else if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = "Passwords do not match";
        }
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (submitting) return;
    if (!validateStep()) return;

    if (step < 3) {
      setStep((previous) => previous + 1);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    handleSubmit();
  };

  const handleSubmit = async () => {
    setFormError("");
    setSubmitting(true);
    try {
      // 1. Create the agency + its admin account. Sign-in email is the owner's.
      const { agency } = isGoogleFlow
        ? await completeGoogleAgency({ companyName: formData.agencyName })
        : await registerAgency({
            companyName: formData.agencyName,
            email: formData.ownerEmail,
            password: formData.password,
          });

      // 2. Complete the agency profile -- this moves it from "incomplete" to
      //    "pending", awaiting a platform admin's review (agents can only
      //    bid once profileStatus is "active", set on approval).
      const address = [formData.agencyAddress.trim(), formData.city.trim()]
        .filter(Boolean)
        .join(", ");
      try {
        await api.put(`/agencies/${agency.id}/profile`, {
          licenseNumber: formData.licenseNumber.trim(),
          businessAddress: address,
          businessPhone: formData.phone.trim(),
          businessRegNumber: formData.businessRegistrationNumber.trim(),
        });
      } catch {
        /* profile can be finished later from agency settings */
      }

      navigate("/agent-pending", { replace: true });
    } catch (err) {
      setFormError(authErrorMessage(err, "Could not create the agency."));
      if (/email/i.test(err?.message || "")) setStep(3);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((previous) => previous - 1);
      return;
    }

    navigate("/agency-choice");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 py-8 sm:py-10">
      <div className="mx-auto w-full max-w-3xl">

        {/* Header */}
        <div className="mb-6">
          <button
            type="button"
            onClick={handleBack}
            className="mb-5 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800"
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
              <h1 className="text-2xl font-bold text-slate-900">
                Register Your Clearing Agency
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Complete your agency registration application.
              </p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">

            <StepIndicator
              number="1"
              title="Agency Details"
              active={step === 1}
              completed={step > 1}
            />

            <div className="mx-2 h-px flex-1 bg-slate-200" />

            <StepIndicator
              number="2"
              title="License Details"
              active={step === 2}
              completed={step > 2}
            />

            <div className="mx-2 h-px flex-1 bg-slate-200" />

            <StepIndicator
              number="3"
              title="Owner Details"
              active={step === 3}
              completed={false}
            />
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          {/* STEP 1 */}
          {step === 1 && (
            <div>
              <SectionHeader
                icon={Buildings}
                title="Agency Details"
                description="Enter the basic information about your clearing agency."
              />

              <div className="mt-7 grid gap-5 sm:grid-cols-2">

                <InputField
                  label="Agency Name"
                  value={formData.agencyName}
                  onChange={(value) =>
                    updateField("agencyName", value)
                  }
                  placeholder="ABC Clearing Agency"
                  error={errors.agencyName}
                  required
                />

                <InputField
                  label="Business Registration Number"
                  value={formData.businessRegistrationNumber}
                  onChange={(value) =>
                    updateField(
                      "businessRegistrationNumber",
                      value
                    )
                  }
                  placeholder="BR-123456"
                  error={errors.businessRegistrationNumber}
                  required
                />

                <div className="sm:col-span-2">
                  <InputField
                    label="Agency Address"
                    value={formData.agencyAddress}
                    onChange={(value) =>
                      updateField("agencyAddress", value)
                    }
                    placeholder="Full business address"
                    error={errors.agencyAddress}
                    required
                  />
                </div>

                <InputField
                  label="City"
                  value={formData.city}
                  onChange={(value) =>
                    updateField("city", value)
                  }
                  placeholder="Colombo"
                  error={errors.city}
                  required
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

                <InputField
                  label="Agency Email"
                  type="email"
                  value={formData.email}
                  onChange={(value) =>
                    updateField("email", value)
                  }
                  placeholder="agency@example.com"
                  error={errors.email}
                  required
                />
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div>
              <SectionHeader
                icon={FileText}
                title="License Details"
                description="Provide your clearing agency license information."
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
                <div className="flex gap-3">
                  <ShieldCheck
                    size={18}
                    className="mt-0.5 shrink-0 text-blue-600"
                  />

                  <p className="text-xs leading-5 text-blue-800">
                    Your license information may be reviewed before
                    the agency is approved.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div>
              <SectionHeader
                icon={UserCircle}
                title="Owner Details"
                description="Tell us about the person responsible for this agency."
              />

              <div className="mt-7 grid gap-5 sm:grid-cols-2">

                <InputField
                  label="Owner Full Name"
                  value={formData.ownerName}
                  onChange={(value) =>
                    updateField("ownerName", value)
                  }
                  placeholder="John Perera"
                  error={errors.ownerName}
                  required
                />

                <InputField
                  label="Owner Email"
                  type="email"
                  value={formData.ownerEmail}
                  onChange={(value) =>
                    updateField("ownerEmail", value)
                  }
                  placeholder="owner@example.com"
                  error={errors.ownerEmail}
                  required
                  disabled={isGoogleFlow}
                />

                <InputField
                  label="Owner Phone"
                  type="tel"
                  value={formData.ownerPhone}
                  onChange={(value) =>
                    updateDigitsField("ownerPhone", value, 10)
                  }
                  placeholder="0771234567"
                  error={errors.ownerPhone}
                  required
                />

                <InputField
                  label="NIC / ID Number"
                  value={formData.ownerNic}
                  onChange={(value) =>
                    updateDigitsField("ownerNic", value, 12)
                  }
                  placeholder="Enter NIC / ID number"
                  error={errors.ownerNic}
                  required
                />

                {/* Password fields (email/password signup only -- a
                    Google account has no password to set here) */}
                {!isGoogleFlow && (
                  <>
                    <PasswordField
                      label="Create Password"
                      value={formData.password}
                      onChange={(value) =>
                        updateField("password", value)
                      }
                      placeholder="Create a password"
                      error={errors.password}
                      showPassword={showPassword}
                      setShowPassword={setShowPassword}
                      required
                    />

                    <PasswordField
                      label="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={(value) =>
                        updateField("confirmPassword", value)
                      }
                      placeholder="Re-enter your password"
                      error={errors.confirmPassword}
                      showPassword={showConfirmPassword}
                      setShowPassword={setShowConfirmPassword}
                      required
                    />
                  </>
                )}
              </div>

              {/* Password Information */}
              {!isGoogleFlow && (
                <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
                  <div className="flex gap-3">
                    <ShieldCheck
                      size={18}
                      className="mt-0.5 shrink-0 text-blue-600"
                    />

                    <p className="text-xs leading-5 text-blue-800">
                      Your password must be at least 8 characters long.
                      Keep it secure because you will use it to sign in
                      to your clearing agency account.
                    </p>
                  </div>
                </div>
              )}

              {/* Review Information */}
              <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
                <div className="flex gap-3">
                  <CheckCircle
                    size={18}
                    className="mt-0.5 shrink-0 text-emerald-600"
                  />

                  <p className="text-xs leading-5 text-emerald-800">
                    After completing this step, you will review your
                    application before submitting it for approval.
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

          {/* Actions */}
          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">

            <button
              type="button"
              onClick={handleBack}
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60"
            >
              <ArrowLeft size={16} />
              Back
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-xl bg-[#173563] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#10294d] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Creating agency…"
                : step === 3
                ? "Create Agency"
                : "Continue"}

              <ArrowRight size={16} />
            </button>
          </div>

        </div>

        {/* Security note */}
        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck size={14} />
          Your information is securely stored for application review.
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   STEP INDICATOR
========================================================= */

function StepIndicator({
  number,
  title,
  active,
  completed,
}) {
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
        {completed ? (
          <CheckCircle size={15} />
        ) : (
          number
        )}
      </div>

      <span
        className={`hidden text-xs font-semibold sm:block ${
          active
            ? "text-slate-900"
            : "text-slate-400"
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

function SectionHeader({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Icon size={19} />
      </div>

      <div>
        <h2 className="text-lg font-bold text-slate-900">
          {title}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>
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
  error,
  required = false,
  disabled = false,
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-slate-700">
        {label}

        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full rounded-xl border px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-red-100"
            : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
        }`}
      />

      {error && (
        <p className="mt-1.5 text-[12px] text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

/* =========================================================
   PASSWORD INPUT
========================================================= */

function PasswordField({
  label,
  value,
  onChange,
  placeholder,
  error,
  showPassword,
  setShowPassword,
  required = false,
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-slate-700">
        {label}

        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          placeholder={placeholder}
          autoComplete="new-password"
          name="new-password"
          className={`w-full rounded-xl border px-3.5 py-3 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-100"
              : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
          }`}
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
            <EyeSlash size={18} />
          ) : (
            <Eye size={18} />
          )}
        </button>
      </div>

      {error && (
        <p className="mt-1.5 text-[12px] text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

export default AgencyCreate;