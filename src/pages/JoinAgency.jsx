import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Search,
  ShieldCheck,
  UserRound,
  FileText,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

const demoAgencies = [
  {
    id: "AGY-001",
    name: "ABC Clearing Agency",
    code: "ABC001",
    city: "Colombo",
    status: "Active",
  },
  {
    id: "AGY-002",
    name: "Lanka Customs Solutions",
    code: "LCS002",
    city: "Colombo",
    status: "Active",
  },
  {
    id: "AGY-003",
    name: "Global Trade Clearing",
    code: "GTC003",
    city: "Gampaha",
    status: "Active",
  },
];

function JoinAgency() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedAgency, setSelectedAgency] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "", // Starts empty
    phone: "",
    address: "",
    licenseNumber: "",
    licenseType: "",
    licenseExpiry: "",
    password: "", // Starts empty
    confirmPassword: "", // Starts empty
  });

  const [errors, setErrors] = useState({});

  const filteredAgencies = demoAgencies.filter((agency) => {
    const query = search.toLowerCase().trim();

    if (!query) return true;

    return (
      agency.name.toLowerCase().includes(query) ||
      agency.code.toLowerCase().includes(query) ||
      agency.city.toLowerCase().includes(query)
    );
  });

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

  const selectAgency = (agency) => {
    setSelectedAgency(agency);

    localStorage.setItem(
      "selectedAgency",
      JSON.stringify(agency)
    );

    setErrors({});
  };

  const validateStep = () => {
    const newErrors = {};

    if (step === 1) {
      if (!selectedAgency) {
        newErrors.agency =
          "Please select an agency to continue.";
      }
    }

    if (step === 2) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = "Full name is required.";
      }

      if (!formData.email.trim()) {
        newErrors.email = "Email is required.";
      }

      if (!formData.phone.trim()) {
        newErrors.phone =
          "Phone number is required.";
      }

      if (!formData.address.trim()) {
        newErrors.address =
          "Address is required.";
      }

      if (!formData.password) {
        newErrors.password = "Password is required.";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters.";
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match.";
      }
    }

    if (step === 3) {
      if (!formData.licenseNumber.trim()) {
        newErrors.licenseNumber =
          "License number is required.";
      }

      if (!formData.licenseType) {
        newErrors.licenseType =
          "Please select a license type.";
      }

      if (!formData.licenseExpiry) {
        newErrors.licenseExpiry =
          "License expiry date is required.";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;

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

  const handleSubmit = () => {
    if (!selectedAgency) return;

    const application = {
      id: `JOIN-${Date.now()}`,
      type: "join-agency",
      agencyId: selectedAgency.id,
      agencyName: selectedAgency.name,
      agencyCode: selectedAgency.code,
      applicant: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        // Password excluded from storage payload for safety
      },
      license: {
        number: formData.licenseNumber,
        type: formData.licenseType,
        expiry: formData.licenseExpiry,
      },
      status: "pending",
      submittedAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "agencyJoinApplication",
      JSON.stringify(application)
    );

    localStorage.setItem(
      "agencyJoinStatus",
      "pending"
    );

    navigate("/agent-pending");
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
              <Building2
                size={21}
                className="text-white"
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
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
                icon={Search}
                title="Find Your Agency"
                description="Search for the clearing agency you want to join."
              />

              <div className="relative mt-7">
                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search agency name, code or city..."
                  className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {errors.agency && (
                <p className="mt-2 text-xs text-red-500">
                  {errors.agency}
                </p>
              )}

              <div className="mt-5 space-y-3">
                {filteredAgencies.map((agency) => {
                  const selected = selectedAgency?.id === agency.id;

                  return (
                    <button
                      key={agency.id}
                      type="button"
                      onClick={() => selectAgency(agency)}
                      className={`w-full rounded-2xl border-2 p-4 text-left transition ${
                        selected
                          ? "border-[#173563] bg-blue-50/50"
                          : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <Building2 size={20} />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-slate-900">
                              {agency.name}
                            </h3>
                            <p className="mt-1 text-xs text-slate-500">
                              {agency.code} · {agency.city}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-600">
                            {agency.status}
                          </span>
                          {selected && (
                            <CheckCircle2
                              size={20}
                              className="text-[#173563]"
                            />
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div>
              <SectionHeader
                icon={UserRound}
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
                />

                <InputField
                  label="Phone Number"
                  value={formData.phone}
                  onChange={(value) =>
                    updateField("phone", value)
                  }
                  placeholder="+94 77 123 4567"
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
              </div>

              <SelectedAgencyCard agency={selectedAgency} />
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

                <SelectField
                  label="License Type"
                  value={formData.licenseType}
                  onChange={(value) =>
                    updateField("licenseType", value)
                  }
                  error={errors.licenseType}
                  required
                >
                  <option value="">Select license type</option>
                  <option value="clearing-agent">Clearing Agent License</option>
                  <option value="customs-broker">Customs Broker License</option>
                  <option value="other">Other</option>
                </SelectField>

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
                icon={CheckCircle2}
                title="Review Application"
                description="Check your information before submitting."
              />

              <div className="mt-7 space-y-5">
                <ReviewSection title="Selected Agency">
                  <ReviewRow label="Agency" value={selectedAgency?.name} />
                  <ReviewRow label="Agency Code" value={selectedAgency?.code} />
                  <ReviewRow label="City" value={selectedAgency?.city} />
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
                  <ReviewRow label="License Type" value={formData.licenseType} />
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

          {/* ACTIONS */}
          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <ArrowLeft size={16} />
              Back
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 rounded-xl bg-[#173563] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#10294d]"
            >
              {step === 4 ? "Submit Application" : "Continue"}
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
        {completed ? <CheckCircle2 size={15} /> : number}
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
        className={`w-full rounded-xl border px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
            : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        }`}
      />

      {error && <p className="mt-1.5 text-[11px] text-red-500">{error}</p>}
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
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {error && <p className="mt-1.5 text-[11px] text-red-500">{error}</p>}
    </div>
  );
}

/* =========================================================
   SELECT
========================================================= */

function SelectField({ label, value, onChange, children, error, required = false }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-slate-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full rounded-xl border bg-white px-3.5 py-3 text-sm outline-none transition ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
            : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        }`}
      >
        {children}
      </select>

      {error && <p className="mt-1.5 text-[11px] text-red-500">{error}</p>}
    </div>
  );
}

/* =========================================================
   SELECTED AGENCY
========================================================= */

function SelectedAgencyCard({ agency }) {
  if (!agency) return null;

  return (
    <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-600">
        Selected Agency
      </p>

      <div className="mt-2 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600">
          <Building2 size={18} />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">{agency.name}</p>
          <p className="mt-1 text-xs text-slate-500">{agency.code} · {agency.city}</p>
        </div>
      </div>
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