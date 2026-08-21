import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  FileText,
  Globe2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";

function AgencyCreate() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    agencyName: "",
    registrationNumber: "",
    licenseNumber: "",
    contactEmail: "",
    phone: "",
    address: "",
    city: "",
    website: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const {
      agencyName,
      registrationNumber,
      licenseNumber,
      contactEmail,
      phone,
      address,
      city,
    } = formData;

    if (
      !agencyName.trim() ||
      !registrationNumber.trim() ||
      !licenseNumber.trim() ||
      !contactEmail.trim() ||
      !phone.trim() ||
      !address.trim() ||
      !city.trim()
    ) {
      setError("Please complete all required agency details.");
      return;
    }

    /*
     * =========================================================
     * FRONTEND DEMO AGENCY
     * =========================================================
     *
     * This will later be replaced with the real backend/Firebase.
     */

    const agency = {
      id: `AG-${Date.now()}`,
      agencyName: agencyName.trim(),
      registrationNumber: registrationNumber.trim(),
      licenseNumber: licenseNumber.trim(),
      contactEmail: contactEmail.trim(),
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim(),
      website: formData.website.trim(),

      role: "admin",
      status: "active",

      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "clearingAgency",
      JSON.stringify(agency)
    );

    /*
     * Update the current clearing-agent account.
     */

    const storedAgent =
      localStorage.getItem("clearingAgent");

    let agent = {};

    try {
      agent = storedAgent
        ? JSON.parse(storedAgent)
        : {};
    } catch {
      agent = {};
    }

    const updatedAgent = {
      ...agent,

      agencyId: agency.id,
      agencyName: agency.agencyName,

      role: "admin",

      agentStatus: "active",

      profileStatus: "complete",
    };

    localStorage.setItem(
      "clearingAgent",
      JSON.stringify(updatedAgent)
    );

    /*
     * Mark onboarding as completed.
     */

    localStorage.setItem(
      "agentOnboardingComplete",
      "true"
    );

    /*
     * Go to the future Agency Admin Dashboard.
     */

    navigate("/agent-admin-dashboard");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F8FAFC] px-4 py-8 sm:py-10">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-100/50 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-slate-200/50 blur-3xl" />


      {/* =====================================================
          CONTAINER
      ===================================================== */}

      <div className="relative mx-auto w-full max-w-2xl">

        {/* =====================================================
            LOGO
        ===================================================== */}

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


        {/* =====================================================
            MAIN CARD
        ===================================================== */}

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

            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">

              <div>

                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[27px]">
                  Create your clearing agency
                </h1>

                <p className="mt-1.5 text-sm leading-6 text-slate-500">
                  Register your agency and become its administrator.
                </p>

              </div>

              <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5">

                <ShieldCheck
                  size={13}
                  className="text-emerald-600"
                />

                <span className="text-[10px] font-semibold text-emerald-700">
                  Agency Admin
                </span>

              </div>

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

            <div>

              <label
                htmlFor="agencyName"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Agency / Company name
                <span className="ml-1 text-red-500">*</span>
              </label>

              <div className="relative">

                <Building2
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="agencyName"
                  name="agencyName"
                  type="text"
                  value={formData.agencyName}
                  onChange={handleChange}
                  placeholder="Enter your registered agency name"
                  className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[#173563] focus:ring-2 focus:ring-[#173563]/10"
                />

              </div>

            </div>


            {/* =================================================
                REGISTRATION + LICENSE
            ================================================= */}

            <div className="grid gap-5 sm:grid-cols-2">

              {/* REGISTRATION */}

              <div>

                <label
                  htmlFor="registrationNumber"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Business registration number
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <div className="relative">

                  <FileText
                    size={17}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="registrationNumber"
                    name="registrationNumber"
                    type="text"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    placeholder="e.g. BR-123456"
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[#173563] focus:ring-2 focus:ring-[#173563]/10"
                  />

                </div>

              </div>


              {/* LICENSE */}

              <div>

                <label
                  htmlFor="licenseNumber"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Clearing license number
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <div className="relative">

                  <FileText
                    size={17}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="licenseNumber"
                    name="licenseNumber"
                    type="text"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    placeholder="Enter license number"
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[#173563] focus:ring-2 focus:ring-[#173563]/10"
                  />

                </div>

              </div>

            </div>


            {/* =================================================
                EMAIL + PHONE
            ================================================= */}

            <div className="grid gap-5 sm:grid-cols-2">

              {/* EMAIL */}

              <div>

                <label
                  htmlFor="contactEmail"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Agency email
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <div className="relative">

                  <Mail
                    size={17}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    placeholder="agency@company.com"
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[#173563] focus:ring-2 focus:ring-[#173563]/10"
                  />

                </div>

              </div>


              {/* PHONE */}

              <div>

                <label
                  htmlFor="phone"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Contact phone
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <div className="relative">

                  <Phone
                    size={17}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+94 77 123 4567"
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[#173563] focus:ring-2 focus:ring-[#173563]/10"
                  />

                </div>

              </div>

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
                <span className="ml-1 text-red-500">*</span>
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
                  placeholder="Enter your registered business address"
                  className="w-full resize-none rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[#173563] focus:ring-2 focus:ring-[#173563]/10"
                />

              </div>

            </div>


            {/* =================================================
                CITY + WEBSITE
            ================================================= */}

            <div className="grid gap-5 sm:grid-cols-2">

              {/* CITY */}

              <div>

                <label
                  htmlFor="city"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  City
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <div className="relative">

                  <MapPin
                    size={17}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Colombo"
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[#173563] focus:ring-2 focus:ring-[#173563]/10"
                  />

                </div>

              </div>


              {/* WEBSITE */}

              <div>

                <label
                  htmlFor="website"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Website
                  <span className="ml-1 text-[10px] font-normal text-slate-400">
                    Optional
                  </span>
                </label>

                <div className="relative">

                  <Globe2
                    size={17}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="website"
                    name="website"
                    type="url"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://yourcompany.com"
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[#173563] focus:ring-2 focus:ring-[#173563]/10"
                  />

                </div>

              </div>

            </div>


            {/* =================================================
                ADMIN NOTICE
            ================================================= */}

            <div className="rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3">

              <div className="flex items-start gap-3">

                <CheckCircle2
                  size={17}
                  className="mt-0.5 shrink-0 text-blue-600"
                />

                <div>

                  <p className="text-xs font-semibold text-blue-800">
                    You will become the Agency Admin
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-blue-700">
                    As the agency owner, you will be able to
                    manage agents, review join requests, and
                    send invitation codes to your team.
                  </p>

                </div>

              </div>

            </div>


            {/* =================================================
                SUBMIT
            ================================================= */}

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#173563] py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#173563]/15 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#102547] hover:shadow-xl hover:shadow-[#173563]/20 active:translate-y-0 active:scale-[0.99]"
            >
              Create Agency

              <Building2 size={17} />

            </button>

          </form>

        </div>


        {/* =====================================================
            BACK
        ===================================================== */}

        <div className="mt-5 flex justify-center">

          <button
            type="button"
            onClick={() => navigate("/agency-choice")}
            className="flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-800"
          >
            <ArrowLeft size={16} />

            Back to Agency Choice

          </button>

        </div>

      </div>

    </div>
  );
}

export default AgencyCreate;