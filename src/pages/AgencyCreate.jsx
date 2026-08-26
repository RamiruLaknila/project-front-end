import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  FileText,
  UserRound,
  ShieldCheck,
} from "lucide-react";

function AgencyCreate() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    agencyName: "",
    businessRegistrationNumber: "",
    agencyAddress: "",
    city: "",
    phone: "",
    email: "",

    licenseNumber: "",
    licenseType: "",
    licenseExpiry: "",

    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
    ownerNic: "",
  });

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

      if (!formData.phone.trim()) {
        newErrors.phone = "Agency phone number is required";
      }

      if (!formData.email.trim()) {
        newErrors.email = "Agency email is required";
      }
    }

    if (step === 2) {
      if (!formData.licenseNumber.trim()) {
        newErrors.licenseNumber = "License number is required";
      }

      if (!formData.licenseType) {
        newErrors.licenseType = "Please select a license type";
      }

      if (!formData.licenseExpiry) {
        newErrors.licenseExpiry = "License expiry date is required";
      }
    }

    if (step === 3) {
      if (!formData.ownerName.trim()) {
        newErrors.ownerName = "Owner name is required";
      }

      if (!formData.ownerEmail.trim()) {
        newErrors.ownerEmail = "Owner email is required";
      }

      if (!formData.ownerPhone.trim()) {
        newErrors.ownerPhone = "Owner phone number is required";
      }

      if (!formData.ownerNic.trim()) {
        newErrors.ownerNic = "NIC / ID number is required";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;

    if (step < 3) {
      setStep((previous) => previous + 1);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    localStorage.setItem(
      "agencyRegistrationDraft",
      JSON.stringify(formData)
    );

    navigate("/agency-review");
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
              <Building2
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
                icon={Building2}
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
                  value={formData.phone}
                  onChange={(value) =>
                    updateField("phone", value)
                  }
                  placeholder="+94 77 123 4567"
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
                  <option value="clearing-agent">
                    Clearing Agent License
                  </option>
                  <option value="customs-broker">
                    Customs Broker License
                  </option>
                  <option value="other">
                    Other
                  </option>
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
                icon={UserRound}
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
                />

                <InputField
                  label="Owner Phone"
                  value={formData.ownerPhone}
                  onChange={(value) =>
                    updateField("ownerPhone", value)
                  }
                  placeholder="+94 77 123 4567"
                  error={errors.ownerPhone}
                  required
                />

                <InputField
                  label="NIC / ID Number"
                  value={formData.ownerNic}
                  onChange={(value) =>
                    updateField("ownerNic", value)
                  }
                  placeholder="Enter NIC / ID number"
                  error={errors.ownerNic}
                  required
                />
              </div>

              <div className="mt-6 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
                <div className="flex gap-3">
                  <CheckCircle2
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

          {/* Actions */}
          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">

            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              <ArrowLeft size={16} />

              Back
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 rounded-xl bg-[#173563] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#10294d]"
            >
              {step === 3 ? "Review Application" : "Continue"}

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
          <CheckCircle2 size={15} />
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
        className={`w-full rounded-xl border px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-red-100"
            : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
        }`}
      />

      {error && (
        <p className="mt-1.5 text-[11px] text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

/* =========================================================
   SELECT
========================================================= */

function SelectField({
  label,
  value,
  onChange,
  children,
  error,
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

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className={`w-full rounded-xl border bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition focus:ring-2 ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-red-100"
            : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
        }`}
      >
        {children}
      </select>

      {error && (
        <p className="mt-1.5 text-[11px] text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

export default AgencyCreate;