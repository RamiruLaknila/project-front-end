import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  FileBadge2,
  KeyRound,
  Users,
} from "lucide-react";

function AgencyChoice() {
  const navigate = useNavigate();

  const [selectedType, setSelectedType] = useState("");
  const [agencyCode, setAgencyCode] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [error, setError] = useState("");

  /* =========================================================
     GET REGISTERED AGENT
  ========================================================= */

  const getAgent = () => {
    try {
      const stored = localStorage.getItem("clearingAgent");

      if (!stored) {
        return null;
      }

      return JSON.parse(stored);
    } catch (error) {
      console.error("Failed to load clearing agent:", error);
      return null;
    }
  };

  /* =========================================================
     SELECT ACCOUNT TYPE
  ========================================================= */

  const handleSelect = (type) => {
    setSelectedType(type);
    setError("");
  };

  /* =========================================================
     CONTINUE
  ========================================================= */

  const handleContinue = () => {
    setError("");

    if (!selectedType) {
      setError("Please choose how you want to use ImportEase.");
      return;
    }

    const agent = getAgent();

    if (!agent) {
      setError(
        "Your agent account could not be found. Please sign up again."
      );
      return;
    }

    /* =======================================================
       CREATE AGENCY
    ======================================================= */

    if (selectedType === "create") {
      localStorage.setItem(
        "clearingAgent",
        JSON.stringify({
          ...agent,
          profileStatus: "incomplete",
          agencyType: "company",
          agencyId: null,
          agencyName: "",
          role: "admin",
          agentStatus: "active",
        })
      );

      navigate("/agency-create");
      return;
    }

    /* =======================================================
       JOIN EXISTING AGENCY
    ======================================================= */

    if (selectedType === "join") {
      if (!agencyCode.trim()) {
        setError("Please enter your agency invitation code.");
        return;
      }

      localStorage.setItem(
        "clearingAgent",
        JSON.stringify({
          ...agent,
          profileStatus: "incomplete",
          agencyType: "company",
          agencyId: agencyCode.trim().toUpperCase(),
          agencyName: "",
          role: "agent",
          agentStatus: "pending",
        })
      );

      navigate("/agent-pending");
      return;
    }

    /* =======================================================
       INDIVIDUAL AGENT
    ======================================================= */

    if (selectedType === "individual") {
      if (!licenseNumber.trim()) {
        setError("Please enter your clearing agent license number.");
        return;
      }

      localStorage.setItem(
        "clearingAgent",
        JSON.stringify({
          ...agent,
          profileStatus: "incomplete",
          agencyType: "individual",
          agencyId: null,
          agencyName: "",
          licenseNumber: licenseNumber.trim().toUpperCase(),
          role: "individual",
          agentStatus: "active",
        })
      );

      navigate("/agent-profile");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F8FAFC] px-4 py-8 sm:py-10">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-100/50 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-slate-200/50 blur-3xl" />

      {/* =====================================================
          MAIN CONTAINER
      ===================================================== */}

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-4xl flex-col justify-center">

        {/* ===================================================
            LOGO
        =================================================== */}

        <div className="mb-8 flex justify-center">

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
              HEADER
          ================================================= */}

          <div className="mx-auto mb-8 max-w-2xl text-center">

            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#173563] shadow-md shadow-[#173563]/15">

              <Building2
                size={23}
                className="text-white"
              />

            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[28px]">
              How will you operate?
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Choose how you want to work with ImportEase as a
              clearing agent.
            </p>

          </div>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="mx-auto mb-6 max-w-2xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          {/* =================================================
              OPTIONS
          ================================================= */}

          <div className="grid gap-4 md:grid-cols-3">

            {/* =================================================
                CREATE AGENCY
            ================================================= */}

            <ChoiceCard
              selected={selectedType === "create"}
              onClick={() => handleSelect("create")}
              icon={Building2}
              title="Create an Agency"
              description="Register your clearing agency and become its administrator."
              badge="Agency Admin"
            />

            {/* =================================================
                JOIN AGENCY
            ================================================= */}

            <ChoiceCard
              selected={selectedType === "join"}
              onClick={() => handleSelect("join")}
              icon={Users}
              title="Join an Agency"
              description="Join an existing clearing agency using an invitation code."
              badge="Agency Agent"
            />

            {/* =================================================
                INDIVIDUAL
            ================================================= */}

            <ChoiceCard
              selected={selectedType === "individual"}
              onClick={() => handleSelect("individual")}
              icon={FileBadge2}
              title="Individual Agent"
              description="Operate independently using your clearing agent license."
              badge="Independent"
            />

          </div>

          {/* =================================================
              EXTRA INPUT
          ================================================= */}

          {selectedType === "join" && (
            <div className="mx-auto mt-6 max-w-xl">

              <label
                htmlFor="agencyCode"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Agency invitation code
              </label>

              <div className="relative">

                <KeyRound
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="agencyCode"
                  type="text"
                  value={agencyCode}
                  onChange={(e) =>
                    setAgencyCode(e.target.value.toUpperCase())
                  }
                  placeholder="Example: IMP-AG-82F4"
                  className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3 text-sm font-medium tracking-wide text-slate-900 outline-none transition placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400 hover:border-slate-400 focus:border-[#173563] focus:ring-2 focus:ring-[#173563]/10"
                />

              </div>

              <p className="mt-2 text-xs text-slate-400">
                Ask your agency administrator for the invitation
                code.
              </p>

            </div>
          )}

          {selectedType === "individual" && (
            <div className="mx-auto mt-6 max-w-xl">

              <label
                htmlFor="licenseNumber"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Clearing agent license number
              </label>

              <div className="relative">

                <FileBadge2
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="licenseNumber"
                  type="text"
                  value={licenseNumber}
                  onChange={(e) =>
                    setLicenseNumber(e.target.value.toUpperCase())
                  }
                  placeholder="Enter your license number"
                  className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3 text-sm font-medium tracking-wide text-slate-900 outline-none transition placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400 hover:border-slate-400 focus:border-[#173563] focus:ring-2 focus:ring-[#173563]/10"
                />

              </div>

              <p className="mt-2 text-xs text-slate-400">
                Your license will later be verified before
                marketplace access.
              </p>

            </div>
          )}

          {/* =================================================
              CONTINUE BUTTON
          ================================================= */}

          <div className="mx-auto mt-8 max-w-xl">

            <button
              type="button"
              onClick={handleContinue}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#173563] py-3 text-sm font-semibold text-white shadow-lg shadow-[#173563]/15 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#102547] hover:shadow-xl hover:shadow-[#173563]/20 active:translate-y-0 active:scale-[0.99]"
            >

              Continue

              <ArrowRight size={16} />

            </button>

          </div>

          {/* =================================================
              SECURITY NOTE
          ================================================= */}

          <div className="mx-auto mt-6 flex max-w-xl items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">

            <CheckCircle2
              size={17}
              className="mt-0.5 shrink-0 text-emerald-600"
            />

            <p className="text-xs leading-5 text-slate-500">
              Your account type determines which features you can
              access. Marketplace and client-management features
              require the appropriate agent or agency status.
            </p>

          </div>

        </div>

        {/* ===================================================
            BACK
        =================================================== */}

        <div className="mt-5 flex justify-center">

          <Link
            to="/agent-signin"
            className="flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-800"
          >

            <ArrowLeft size={16} />

            Back to Agent Sign In

          </Link>

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   CHOICE CARD
========================================================= */

function ChoiceCard({
  selected,
  onClick,
  icon: Icon,
  title,
  description,
  badge,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative rounded-2xl border-2 p-5 text-left transition-all duration-200 ${
        selected
          ? "border-blue-600 bg-blue-50/60 shadow-md shadow-blue-600/10"
          : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/30 hover:shadow-sm"
      }`}
    >

      {/* SELECTED */}

      {selected && (
        <div className="absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">

          <CheckCircle2
            size={14}
            strokeWidth={2.5}
          />

        </div>
      )}

      {/* ICON */}

      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl transition ${
          selected
            ? "bg-blue-600 text-white"
            : "bg-blue-50 text-blue-600"
        }`}
      >

        <Icon
          size={20}
          strokeWidth={1.8}
        />

      </div>

      {/* BADGE */}

      <div className="mt-4">

        <span
          className={`rounded-full px-2 py-1 text-[9px] font-bold uppercase tracking-[0.1em] ${
            selected
              ? "bg-blue-100 text-blue-700"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {badge}
        </span>

      </div>

      {/* TITLE */}

      <h2 className="mt-3 text-sm font-bold text-slate-900">
        {title}
      </h2>

      {/* DESCRIPTION */}

      <p className="mt-2 text-[11px] leading-5 text-slate-500">
        {description}
      </p>

    </button>
  );
}

export default AgencyChoice;