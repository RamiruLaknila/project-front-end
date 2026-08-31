import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Lock,
} from "lucide-react";

function IndividualAgentSignup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    agentId: "",
    licenseNumber: "",
    licenseExpiry: "",
    experience: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.agentId.trim()) {
      newErrors.agentId = "Agent ID is required";
    }

    if (!formData.licenseNumber.trim()) {
      newErrors.licenseNumber = "License number is required";
    }

    if (!formData.licenseExpiry) {
      newErrors.licenseExpiry = "License expiry date is required";
    }

    if (!formData.experience) {
      newErrors.experience = "Please select your experience";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const individualAgent = {
      ...formData,
      registrationType: "individual",
      status: "pending",
      verificationStatus: "pending",
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "individualAgent",
      JSON.stringify(individualAgent)
    );

    localStorage.setItem(
      "agentRegistrationType",
      "individual"
    );

    localStorage.setItem(
      "individualAgentStatus",
      "pending"
    );

    navigate("/individual-agent-verification");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F8FAFC] px-4 py-8 sm:py-10">

      {/* Background */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-100/50 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-slate-200/50 blur-3xl" />

      <div className="relative mx-auto w-full max-w-3xl">

        {/* Logo */}
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

        {/* Main Card */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.15)] sm:p-8">

          {/* Header */}
          <div className="mb-8 text-center">

            <div className="mb-4 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#173563] shadow-md shadow-[#173563]/15">
                <BriefcaseBusiness
                  size={23}
                  className="text-white"
                />
              </div>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[27px]">
              Individual Agent Registration
            </h1>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
              Register as an independent clearing agent by providing
              your personal and professional information.
            </p>
          </div>

          {/* Progress */}
          <div className="mb-8">

            <div className="flex items-center justify-between">

              <Step
                number="1"
                label="Personal Details"
                active
              />

              <div className="mx-2 h-px flex-1 bg-slate-200" />

              <Step
                number="2"
                label="License Details"
              />

              <div className="mx-2 h-px flex-1 bg-slate-200" />

              <Step
                number="3"
                label="Verification"
              />

            </div>
          </div>

          <form onSubmit={handleSubmit} autoComplete="off">

            {/* Personal Details */}
            <section>

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <User size={18} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Personal Details
                  </h2>

                  <p className="text-xs text-slate-500">
                    Enter your basic contact information
                  </p>
                </div>

              </div>

              <div className="grid gap-5 sm:grid-cols-2">

                {/* Full Name */}
                <InputField
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  icon={<User size={17} />}
                  error={errors.fullName}
                  required
                />

                {/* Email */}
                <InputField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  icon={<Mail size={17} />}
                  error={errors.email}
                  required
                  autoComplete="off"
                />

                {/* Phone */}
                <InputField
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+94 7X XXX XXXX"
                  icon={<Phone size={17} />}
                  error={errors.phone}
                  required
                />

                {/* Agent ID */}
                <InputField
                  label="Agent ID / Registration ID"
                  name="agentId"
                  value={formData.agentId}
                  onChange={handleChange}
                  placeholder="Enter your agent ID"
                  icon={<CreditCard size={17} />}
                  error={errors.agentId}
                  required
                />

                {/* Password */}
                <InputField
                  label="Create Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  icon={<Lock size={17} />}
                  error={errors.password}
                  required
                  autoComplete="new-password"
                />

                {/* Confirm Password */}
                <InputField
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  icon={<Lock size={17} />}
                  error={errors.confirmPassword}
                  required
                  autoComplete="new-password"
                />

              </div>

              {/* Address */}
              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Business / Residential Address
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <div className="relative">

                  <MapPin
                    size={17}
                    className="absolute left-3 top-3.5 text-slate-400"
                  />

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Enter your address"
                    className={`w-full resize-none rounded-xl border ${
                      errors.address
                        ? "border-red-400"
                        : "border-slate-200"
                    } bg-white py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10`}
                  />

                </div>

                {errors.address && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {errors.address}
                  </p>
                )}
              </div>

            </section>

            {/* Divider */}
            <div className="my-8 border-t border-slate-100" />

            {/* License Details */}
            <section>

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <ShieldCheck size={18} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    License Details
                  </h2>

                  <p className="text-xs text-slate-500">
                    Provide your professional clearing license information
                  </p>
                </div>

              </div>

              <div className="grid gap-5 sm:grid-cols-2">

                {/* License Number */}
                <InputField
                  label="Clearing License Number"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  placeholder="Enter license number"
                  icon={<ShieldCheck size={17} />}
                  error={errors.licenseNumber}
                  required
                />

                {/* Expiry */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    License Expiry Date
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <input
                    type="date"
                    name="licenseExpiry"
                    value={formData.licenseExpiry}
                    onChange={handleChange}
                    className={`w-full rounded-xl border ${
                      errors.licenseExpiry
                        ? "border-red-400"
                        : "border-slate-200"
                    } bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10`}
                  />

                  {errors.licenseExpiry && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.licenseExpiry}
                    </p>
                  )}
                </div>

                {/* Experience */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Clearing Experience
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className={`w-full rounded-xl border ${
                      errors.experience
                        ? "border-red-400"
                        : "border-slate-200"
                    } bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10`}
                  >
                    <option value="">
                      Select experience
                    </option>

                    <option value="less-than-1">
                      Less than 1 year
                    </option>

                    <option value="1-3">
                      1 - 3 years
                    </option>

                    <option value="3-5">
                      3 - 5 years
                    </option>

                    <option value="5-10">
                      5 - 10 years
                    </option>

                    <option value="10-plus">
                      10+ years
                    </option>
                  </select>

                  {errors.experience && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.experience}
                    </p>
                  )}
                </div>

              </div>

            </section>

            {/* Verification Notice */}
            <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50/60 p-4">

              <div className="flex items-start gap-3">

                <ShieldCheck
                  size={19}
                  className="mt-0.5 shrink-0 text-blue-600"
                />

                <div>

                  <h3 className="text-sm font-bold text-blue-900">
                    License verification
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-blue-800">
                    Your professional details will be reviewed before
                    your independent agent account becomes active.
                  </p>

                </div>

              </div>

            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">

              <button
                type="button"
                onClick={() => navigate("/agent-signup")}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                <ArrowLeft size={16} />
                Back
              </button>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#173563] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#173563]/15 transition hover:bg-[#122b50]"
              >
                Continue to Verification
                <ArrowRight size={16} />
              </button>

            </div>

          </form>

        </div>

        {/* Footer */}
        <div className="mt-5 text-center">

          <p className="text-xs text-slate-400">
            Already have an agent account?{" "}

            <Link
              to="/agent-signin"
              className="font-semibold text-[#173563] hover:text-blue-700"
            >
              Sign in
            </Link>
          </p>

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
  type = "text",
  value,
  onChange,
  placeholder,
  icon,
  error,
  required = false,
  autoComplete,
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-semibold text-slate-700">

        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}

      </label>

      <div className="relative">

        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </div>

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full rounded-xl border ${
            error
              ? "border-red-400"
              : "border-slate-200"
          } bg-white py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10`}
        />

      </div>

      {error && (
        <p className="mt-1.5 text-xs text-red-500">
          {error}
        </p>
      )}

    </div>
  );
}


/* =========================================================
   PROGRESS STEP
========================================================= */

function Step({
  number,
  label,
  active = false,
}) {
  return (
    <div className="flex min-w-0 flex-col items-center">

      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
          active
            ? "bg-[#173563] text-white"
            : "bg-slate-100 text-slate-400"
        }`}
      >
        {active ? (
          <CheckCircle2 size={16} />
        ) : (
          number
        )}
      </div>

      <span
        className={`mt-2 hidden text-[10px] font-semibold sm:block ${
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

export default IndividualAgentSignup;