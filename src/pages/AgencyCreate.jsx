import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  FileText,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";

function AgencyCreate() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    agencyName: "",
    registrationNumber: "",
    licenseNumber: "",
    phone: "",
    email: "",
    address: "",
    city: "",
  });

  const [error, setError] = useState("");

  /* =========================================================
     HANDLE INPUT
  ========================================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================================================
     GENERATE AGENCY CODE
  ========================================================= */

  const generateAgencyCode = () => {
    const randomPart = Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase();

    return `IMP-AG-${randomPart}`;
  };

  /* =========================================================
     GET AGENT
  ========================================================= */

  const getAgent = () => {
    try {
      const stored = localStorage.getItem("clearingAgent");

      if (!stored) {
        return null;
      }

      return JSON.parse(stored);
    } catch (error) {
      console.error("Failed to load agent:", error);
      return null;
    }
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const {
      agencyName,
      registrationNumber,
      licenseNumber,
      phone,
      email,
      address,
      city,
    } = formData;

    if (
      !agencyName.trim() ||
      !registrationNumber.trim() ||
      !licenseNumber.trim() ||
      !phone.trim() ||
      !email.trim() ||
      !address.trim() ||
      !city.trim()
    ) {
      setError("Please complete all required agency details.");
      return;
    }

    const agent = getAgent();

    if (!agent) {
      setError(
        "Your agent account could not be found. Please sign in again."
      );
      return;
    }

    /* =======================================================
       CREATE AGENCY
    ======================================================= */

    const agencyCode = generateAgencyCode();

    const agency = {
      id: `agency-${Date.now()}`,
      agencyCode,

      name: agencyName.trim(),
      registrationNumber: registrationNumber.trim(),
      licenseNumber: licenseNumber.trim(),

      phone: phone.trim(),
      email: email.trim(),

      address: address.trim(),
      city: city.trim(),

      createdAt: new Date().toISOString(),

      admin: {
        name: agent.name,
        email: agent.email,
      },

      members: [
        {
          name: agent.name,
          email: agent.email,
          role: "admin",
          status: "active",
        },
      ],
    };

    /* =======================================================
       SAVE AGENCY
    ======================================================= */

    localStorage.setItem(
      "clearingAgency",
      JSON.stringify(agency)
    );

    /* =======================================================
       UPDATE AGENT
    ======================================================= */

    const updatedAgent = {
      ...agent,

      profileStatus: "incomplete",

      agencyId: agency.id,
      agencyName: agency.name,

      agencyType: "company",

      role: "admin",

      agentStatus: "active",
    };

    localStorage.setItem(
      "clearingAgent",
      JSON.stringify(updatedAgent)
    );

    /* =======================================================
       AGENCY CREATED
    ======================================================= */

    localStorage.setItem(
      "agencyCreated",
      "true"
    );

    /* =======================================================
       NEXT STEP
    ======================================================= */

    navigate("/agency-created");
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

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-2xl flex-col justify-center">

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
            CARD
        =================================================== */}

        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.15)] sm:p-8">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="mb-7">

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#173563] shadow-md shadow-[#173563]/15">

              <Building2
                size={23}
                className="text-white"
              />

            </div>

            <div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[28px]">
                Create your agency
              </h1>

              <p className="mt-1.5 max-w-xl text-sm leading-6 text-slate-500">
                Register your clearing agency to become the
                agency administrator on ImportEase.
              </p>

            </div>

          </div>

          {/* =================================================
              INFO
          ================================================= */}

          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">

            <ShieldCheck
              size={19}
              className="mt-0.5 shrink-0 text-blue-600"
            />

            <div>

              <p className="text-xs font-bold text-blue-800">
                You will become the Agency Admin
              </p>

              <p className="mt-1 text-[11px] leading-5 text-blue-700/80">
                After creating the agency, you can invite your
                clearing agents and manage their access.
              </p>

            </div>

          </div>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          {/* =================================================
              FORM
          ================================================= */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* =================================================
                AGENCY NAME
            ================================================= */}

            <InputField
              id="agencyName"
              name="agencyName"
              label="Agency / Company name"
              placeholder="Enter your agency name"
              value={formData.agencyName}
              onChange={handleChange}
              icon={Building2}
            />

            {/* =================================================
                REGISTRATION NUMBER
            ================================================= */}

            <InputField
              id="registrationNumber"
              name="registrationNumber"
              label="Business registration number"
              placeholder="Enter company registration number"
              value={formData.registrationNumber}
              onChange={handleChange}
              icon={FileText}
            />

            {/* =================================================
                LICENSE NUMBER
            ================================================= */}

            <InputField
              id="licenseNumber"
              name="licenseNumber"
              label="Clearing agent license number"
              placeholder="Enter agency license number"
              value={formData.licenseNumber}
              onChange={handleChange}
              icon={ShieldCheck}
            />

            {/* =================================================
                PHONE + EMAIL
            ================================================= */}

            <div className="grid gap-5 sm:grid-cols-2">

              <InputField
                id="phone"
                name="phone"
                label="Agency phone number"
                placeholder="+94 7X XXX XXXX"
                value={formData.phone}
                onChange={handleChange}
                icon={Phone}
              />

              <InputField
                id="email"
                name="email"
                type="email"
                label="Agency email"
                placeholder="agency@company.com"
                value={formData.email}
                onChange={handleChange}
                icon={FileText}
              />

            </div>

            {/* =================================================
                ADDRESS
            ================================================= */}

            <div>

              <label
                htmlFor="address"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Agency address
              </label>

              <div className="relative">

                <MapPin
                  size={17}
                  className="pointer-events-none absolute left-3 top-3.5 text-slate-400"
                />

                <textarea
                  id="address"
                  name="address"
                  rows={3}
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your registered agency address"
                  className="w-full resize-none rounded-xl border border-slate-300 bg-white px-10 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[#173563] focus:ring-2 focus:ring-[#173563]/10"
                />

              </div>

            </div>

            {/* =================================================
                CITY
            ================================================= */}

            <InputField
              id="city"
              name="city"
              label="City"
              placeholder="Colombo"
              value={formData.city}
              onChange={handleChange}
              icon={MapPin}
            />

            {/* =================================================
                SUBMIT
            ================================================= */}

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#173563] py-3 text-sm font-semibold text-white shadow-lg shadow-[#173563]/15 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#102547] hover:shadow-xl hover:shadow-[#173563]/20 active:translate-y-0 active:scale-[0.99]"
            >
              Create Agency

              <ArrowRight size={16} />
            </button>

          </form>

          {/* =================================================
              FOOTNOTE
          ================================================= */}

          <div className="mt-6 flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">

            <CheckCircle2
              size={17}
              className="mt-0.5 shrink-0 text-emerald-600"
            />

            <p className="text-xs leading-5 text-slate-500">
              Your agency information can be updated later from
              the agency administration area.
            </p>

          </div>

        </div>

        {/* ===================================================
            BACK
        =================================================== */}

        <div className="mt-5 flex justify-center">

          <Link
            to="/agency-choice"
            className="flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-800"
          >
            <ArrowLeft size={16} />
            Back to Agency Choice
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
  id,
  name,
  label,
  placeholder,
  value,
  onChange,
  icon: Icon,
  type = "text",
}) {
  return (
    <div>

      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-slate-700"
      >
        {label}
      </label>

      <div className="relative">

        <Icon
          size={17}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[#173563] focus:ring-2 focus:ring-[#173563]/10"
        />

      </div>

    </div>
  );
}

export default AgencyCreate;