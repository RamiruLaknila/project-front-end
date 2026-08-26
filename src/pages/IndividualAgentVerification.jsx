import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Upload,
  FileText,
  UserCheck,
  AlertCircle,
} from "lucide-react";

function IndividualAgentVerification() {
  const navigate = useNavigate();

  const [documents, setDocuments] = useState({
    license: null,
    identity: null,
    certificate: null,
  });

  const [errors, setErrors] = useState({});

  const [declaration, setDeclaration] = useState(false);

  const handleFileChange = (e, documentType) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setDocuments((prev) => ({
      ...prev,
      [documentType]: file,
    }));

    setErrors((prev) => ({
      ...prev,
      [documentType]: "",
    }));
  };

  const removeFile = (documentType) => {
    setDocuments((prev) => ({
      ...prev,
      [documentType]: null,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!documents.license) {
      newErrors.license =
        "Please upload your clearing license.";
    }

    if (!documents.identity) {
      newErrors.identity =
        "Please upload an identity document.";
    }

    if (!documents.certificate) {
      newErrors.certificate =
        "Please upload your professional certificate.";
    }

    if (!declaration) {
      newErrors.declaration =
        "You must confirm the declaration before submitting.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const existingAgent = JSON.parse(
      localStorage.getItem("individualAgent") || "{}"
    );

    const verificationData = {
      ...existingAgent,

      verificationStatus: "pending",

      documents: {
        license: documents.license
          ? documents.license.name
          : null,

        identity: documents.identity
          ? documents.identity.name
          : null,

        certificate: documents.certificate
          ? documents.certificate.name
          : null,
      },

      declarationAccepted: true,

      submittedAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "individualAgent",
      JSON.stringify(verificationData)
    );

    localStorage.setItem(
      "individualAgentStatus",
      "pending"
    );

    localStorage.setItem(
      "agentOnboardingComplete",
      "true"
    );

    navigate("/agent-pending");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F8FAFC] px-4 py-8 sm:py-10">

      {/* Background decoration */}
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

        {/* Main card */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.15)] sm:p-8">

          {/* Header */}
          <div className="mb-8 text-center">

            <div className="mb-4 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#173563] shadow-md shadow-[#173563]/15">
                <ShieldCheck
                  size={23}
                  className="text-white"
                />
              </div>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[27px]">
              Verification
            </h1>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
              Upload the required documents so your clearing
              agent registration can be reviewed.
            </p>

          </div>

          {/* Progress */}
          <div className="mb-8">

            <div className="flex items-center justify-between">

              <ProgressStep
                number="1"
                label="Personal Details"
                completed
              />

              <div className="mx-2 h-px flex-1 bg-[#173563]" />

              <ProgressStep
                number="2"
                label="License Details"
                completed
              />

              <div className="mx-2 h-px flex-1 bg-[#173563]" />

              <ProgressStep
                number="3"
                label="Verification"
                active
              />

            </div>

          </div>

          {/* Information box */}
          <div className="mb-7 rounded-2xl border border-blue-100 bg-blue-50/60 p-4">

            <div className="flex items-start gap-3">

              <ShieldCheck
                size={19}
                className="mt-0.5 shrink-0 text-blue-600"
              />

              <div>

                <h3 className="text-sm font-bold text-blue-900">
                  Document verification
                </h3>

                <p className="mt-1 text-xs leading-5 text-blue-800">
                  Upload clear copies of your documents. Your
                  application will remain pending until an
                  administrator completes the review.
                </p>

              </div>

            </div>

          </div>

          <form onSubmit={handleSubmit}>

            {/* Documents */}
            <div className="space-y-5">

              <DocumentUpload
                title="Clearing License"
                description="Upload a clear copy of your valid clearing license."
                documentType="license"
                file={documents.license}
                error={errors.license}
                onChange={handleFileChange}
                onRemove={removeFile}
                required
              />

              <DocumentUpload
                title="Identity Document"
                description="Upload your NIC, passport or other accepted identity document."
                documentType="identity"
                file={documents.identity}
                error={errors.identity}
                onChange={handleFileChange}
                onRemove={removeFile}
                required
              />

              <DocumentUpload
                title="Professional Certificate"
                description="Upload your professional qualification or relevant certificate."
                documentType="certificate"
                file={documents.certificate}
                error={errors.certificate}
                onChange={handleFileChange}
                onRemove={removeFile}
                required
              />

            </div>

            {/* Declaration */}
            <div className="mt-8">

              <div
                className={`rounded-2xl border p-4 ${
                  errors.declaration
                    ? "border-red-300 bg-red-50/50"
                    : "border-slate-200 bg-slate-50/60"
                }`}
              >

                <label className="flex cursor-pointer items-start gap-3">

                  <input
                    type="checkbox"
                    checked={declaration}
                    onChange={(e) => {
                      setDeclaration(e.target.checked);

                      setErrors((prev) => ({
                        ...prev,
                        declaration: "",
                      }));
                    }}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-[#173563] focus:ring-[#173563]"
                  />

                  <span className="text-xs leading-5 text-slate-600">
                    I confirm that the information and documents
                    provided in this application are accurate and
                    belong to me. I understand that ImportEase may
                    review these details before approving my
                    clearing agent account.
                  </span>

                </label>

              </div>

              {errors.declaration && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle size={13} />
                  {errors.declaration}
                </p>
              )}

            </div>

            {/* Submission notice */}
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">

              <AlertCircle
                size={17}
                className="mt-0.5 shrink-0 text-amber-600"
              />

              <p className="text-xs leading-5 text-amber-800">
                After submission, your application will be marked
                as <strong>Pending Review</strong>. Marketplace
                and bidding features will become available only
                after approval.
              </p>

            </div>

            {/* Buttons */}
            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">

              <button
                type="button"
                onClick={() =>
                  navigate("/individual-agent-signup")
                }
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                <ArrowLeft size={16} />
                Back
              </button>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#173563] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#173563]/15 transition hover:bg-[#122b50]"
              >
                Submit Application
                <CheckCircle2 size={17} />
              </button>

            </div>

          </form>

        </div>

        {/* Footer */}
        <div className="mt-5 text-center">

          <p className="text-xs text-slate-400">
            Need to sign in instead?{" "}

            <Link
              to="/agent-signin"
              className="font-semibold text-[#173563] hover:text-blue-700"
            >
              Agent Sign In
            </Link>
          </p>

        </div>

      </div>
    </div>
  );
}


/* =========================================================
   DOCUMENT UPLOAD
========================================================= */

function DocumentUpload({
  title,
  description,
  documentType,
  file,
  error,
  onChange,
  onRemove,
  required = false,
}) {
  return (
    <div>

      <div
        className={`rounded-2xl border p-5 transition ${
          error
            ? "border-red-300 bg-red-50/30"
            : file
              ? "border-emerald-200 bg-emerald-50/20"
              : "border-slate-200 bg-white"
        }`}
      >

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          {/* Left */}
          <div className="flex items-start gap-3">

            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                file
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {file ? (
                <CheckCircle2 size={20} />
              ) : (
                <FileText size={20} />
              )}
            </div>

            <div>

              <h3 className="text-sm font-bold text-slate-900">

                {title}

                {required && (
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                )}

              </h3>

              <p className="mt-1 max-w-md text-xs leading-5 text-slate-500">
                {description}
              </p>

              {file && (
                <p className="mt-2 text-xs font-semibold text-emerald-600">
                  {file.name}
                </p>
              )}

            </div>

          </div>

          {/* Right */}
          <div className="shrink-0">

            {file ? (
              <button
                type="button"
                onClick={() => onRemove(documentType)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Change File
              </button>
            ) : (
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#173563] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#122b50]">

                <Upload size={15} />

                Upload

                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) =>
                    onChange(e, documentType)
                  }
                />

              </label>
            )}

          </div>

        </div>

        {/* File info */}
        {!file && (
          <div className="mt-4 border-t border-slate-100 pt-3">

            <p className="text-[10px] text-slate-400">
              Accepted formats: PDF, JPG, JPEG, PNG
            </p>

          </div>
        )}

      </div>

      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
          <AlertCircle size={13} />
          {error}
        </p>
      )}

    </div>
  );
}


/* =========================================================
   PROGRESS STEP
========================================================= */

function ProgressStep({
  number,
  label,
  completed = false,
  active = false,
}) {
  return (
    <div className="flex min-w-0 flex-col items-center">

      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
          completed || active
            ? "bg-[#173563] text-white"
            : "bg-slate-100 text-slate-400"
        }`}
      >
        {completed ? (
          <CheckCircle2 size={16} />
        ) : (
          number
        )}
      </div>

      <span
        className={`mt-2 hidden text-[10px] font-semibold sm:block ${
          active || completed
            ? "text-[#173563]"
            : "text-slate-400"
        }`}
      >
        {label}
      </span>

    </div>
  );
}

export default IndividualAgentVerification;