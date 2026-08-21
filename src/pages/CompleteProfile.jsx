import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Check,
  ChevronRight,
  UserRound,
} from "lucide-react";

function CompleteProfile() {
  const navigate = useNavigate();

  const [accountType, setAccountType] = useState("business");

  const [formData, setFormData] = useState({
    phone: "",
    country: "Sri Lanka",

    businessName: "",
    businessRegistrationNumber: "",
    businessType: "",
    businessAddress: "",
    city: "",
  });

  const [error, setError] = useState("");

  const [userName, setUserName] = useState("");

  /* =========================================================
     LOAD EXISTING USER
  ========================================================= */

  useEffect(() => {
    const savedUser = localStorage.getItem("importease_user");

    if (!savedUser) {
      navigate("/signup", { replace: true });
      return;
    }

    try {
      const user = JSON.parse(savedUser);

      setUserName(user.fullName || "");

      if (user.accountType) {
        setAccountType(user.accountType);
      } else {
        setAccountType("business");
      }

      setFormData((prev) => ({
        ...prev,
        phone: user.phone || "",
        country: user.country || "Sri Lanka",

        businessName: user.business?.name || user.businessName || "",
        businessRegistrationNumber:
          user.business?.registrationNumber || "",
        businessType: user.business?.type || "",
        businessAddress: user.business?.address || "",
        city: user.business?.city || "",
      }));
    } catch (error) {
      console.error("Unable to load user:", error);
      navigate("/signup", { replace: true });
    }
  }, [navigate]);

  /* =========================================================
     HANDLE INPUT
  ========================================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  /* =========================================================
     ACCOUNT TYPE
  ========================================================= */

  const handleAccountTypeChange = (type) => {
    setAccountType(type);
    setError("");
  };

  /* =========================================================
     SAVE PROFILE
  ========================================================= */

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const savedUser = localStorage.getItem("importease_user");

    if (!savedUser) {
      navigate("/signup", { replace: true });
      return;
    }

    let user;

    try {
      user = JSON.parse(savedUser);
    } catch (error) {
      console.error("Invalid stored user:", error);
      navigate("/signup", { replace: true });
      return;
    }

    /* =========================================================
       PHONE VALIDATION
    ========================================================= */

    if (!formData.phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    const phoneDigits = formData.phone.replace(/\D/g, "");

    if (phoneDigits.length < 9) {
      setError("Please enter a valid phone number.");
      return;
    }

    /* =========================================================
       BUSINESS VALIDATION
    ========================================================= */

    if (accountType === "business") {
      if (!formData.businessName.trim()) {
        setError("Please enter your business name.");
        return;
      }

      if (!formData.businessType) {
        setError("Please select your business type.");
        return;
      }

      if (!formData.businessAddress.trim()) {
        setError("Please enter your business address.");
        return;
      }

      if (!formData.city.trim()) {
        setError("Please enter your city.");
        return;
      }
    }

    /* =========================================================
       UPDATED USER
    ========================================================= */

    const updatedUser = {
      ...user,

      phone: formData.phone.trim(),
      country: formData.country.trim(),

      accountType,

      profileComplete: true,

      business:
        accountType === "business"
          ? {
              name: formData.businessName.trim(),
              registrationNumber:
                formData.businessRegistrationNumber.trim(),
              type: formData.businessType,
              address: formData.businessAddress.trim(),
              city: formData.city.trim(),
            }
          : {
              name: "",
              registrationNumber: "",
              type: "",
              address: "",
              city: "",
            },
    };

    localStorage.setItem(
      "importease_user",
      JSON.stringify(updatedUser)
    );

    navigate("/dashboard", { replace: true });
  };

  /* =========================================================
     SKIP PROFILE
  ========================================================= */

  const handleSkip = () => {
    const savedUser = localStorage.getItem("importease_user");

    if (!savedUser) {
      navigate("/signup", { replace: true });
      return;
    }

    try {
      const user = JSON.parse(savedUser);

      const updatedUser = {
        ...user,

        accountType,

        profileComplete: false,

        phone: formData.phone.trim(),

        country: formData.country.trim(),

        business:
          accountType === "business"
            ? {
                name: formData.businessName.trim(),
                registrationNumber:
                  formData.businessRegistrationNumber.trim(),
                type: formData.businessType,
                address: formData.businessAddress.trim(),
                city: formData.city.trim(),
              }
            : {
                name: "",
                registrationNumber: "",
                type: "",
                address: "",
                city: "",
              },
      };

      localStorage.setItem(
        "importease_user",
        JSON.stringify(updatedUser)
      );

      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Unable to save profile:", error);
      navigate("/dashboard", { replace: true });
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F4F8FF] px-4 py-8 sm:py-10">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-sky-200/30 blur-3xl" />

      {/* =====================================================
          CONTAINER
      ===================================================== */}

      <div className="relative mx-auto w-full max-w-2xl">

        {/* ===================================================
            LOGO
        =================================================== */}

        <div className="mb-6 flex justify-center">

          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <img
              src="/logo.jpeg"
              alt="ImportEase"
              className="h-16 w-16 rounded-xl object-contain"
            />

            <span className="text-2xl font-bold tracking-tight text-slate-900">
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

        <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-xl shadow-blue-900/5 sm:p-8">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="mb-7 text-center">

            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#173563]">
              <UserRound size={26} />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Complete your profile
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Hi{userName ? ` ${userName}` : ""}! Add a few details to
              personalize your ImportEase experience.
            </p>

          </div>

          {/* =================================================
              OPTIONAL NOTICE
          ================================================= */}

          <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-3">

            <div className="flex items-start gap-3">

              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                <Check size={14} strokeWidth={3} />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  You can complete this later
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-600">
                  This step is optional. You can skip it and complete
                  your profile later from your account.
                </p>
              </div>

            </div>

          </div>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* =================================================
              FORM
          ================================================= */}

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* =================================================
                BASIC INFORMATION
            ================================================= */}

            <div>

              <div className="mb-4">

                <h2 className="text-sm font-bold text-slate-900">
                  Basic information
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  These details help us contact you about your imports.
                </p>

              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                {/* PHONE */}

                <div>

                  <label
                    htmlFor="phone"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Phone number
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+94 77 123 4567"
                    autoComplete="tel"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />

                </div>

                {/* COUNTRY */}

                <div>

                  <label
                    htmlFor="country"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Country
                  </label>

                  <input
                    id="country"
                    name="country"
                    type="text"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Sri Lanka"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />

                </div>

              </div>

            </div>

            {/* =================================================
                ACCOUNT TYPE
            ================================================= */}

            <div>

              <div className="mb-4">

                <h2 className="text-sm font-bold text-slate-900">
                  Tell us about yourself
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  This helps us customize the ImportEase experience.
                </p>

              </div>

              <div className="grid gap-3 sm:grid-cols-2">

                {/* INDIVIDUAL */}

                <button
                  type="button"
                  onClick={() =>
                    handleAccountTypeChange("individual")
                  }
                  className={`relative rounded-2xl border-2 p-4 text-left transition-all ${
                    accountType === "individual"
                      ? "border-blue-600 bg-blue-50 shadow-sm"
                      : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/40"
                  }`}
                >

                  {accountType === "individual" && (
                    <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}

                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      accountType === "individual"
                        ? "bg-blue-600 text-white"
                        : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    <UserRound size={19} />
                  </div>

                  <h3 className="mt-3 text-sm font-semibold text-slate-900">
                    Individual
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    I'm importing for myself or personal use.
                  </p>

                </button>

                {/* BUSINESS */}

                <button
                  type="button"
                  onClick={() =>
                    handleAccountTypeChange("business")
                  }
                  className={`relative rounded-2xl border-2 p-4 text-left transition-all ${
                    accountType === "business"
                      ? "border-blue-600 bg-blue-50 shadow-sm"
                      : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/40"
                  }`}
                >

                  {accountType === "business" && (
                    <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}

                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      accountType === "business"
                        ? "bg-blue-600 text-white"
                        : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    <Building2 size={19} />
                  </div>

                  <h3 className="mt-3 text-sm font-semibold text-slate-900">
                    Business / SME
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    I'm importing for a company or business.
                  </p>

                </button>

              </div>

            </div>

            {/* =================================================
                BUSINESS INFORMATION
            ================================================= */}

            {accountType === "business" && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">

                <div className="mb-4">

                  <h2 className="text-sm font-bold text-slate-900">
                    Business information
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Add your business details to unlock the full
                    SME ImportEase experience.
                  </p>

                </div>

                <div className="space-y-4">

                  {/* BUSINESS NAME */}

                  <div>

                    <label
                      htmlFor="businessName"
                      className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                      Business name
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <input
                      id="businessName"
                      name="businessName"
                      type="text"
                      value={formData.businessName}
                      onChange={handleChange}
                      placeholder="Enter your business name"
                      autoComplete="organization"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />

                  </div>

                  {/* BUSINESS TYPE */}

                  <div>

                    <label
                      htmlFor="businessType"
                      className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                      Business type
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <select
                      id="businessType"
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleChange}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    >

                      <option value="">
                        Select business type
                      </option>

                      <option value="sole-proprietorship">
                        Sole Proprietorship
                      </option>

                      <option value="partnership">
                        Partnership
                      </option>

                      <option value="private-limited">
                        Private Limited Company
                      </option>

                      <option value="public-limited">
                        Public Limited Company
                      </option>

                      <option value="other">
                        Other
                      </option>

                    </select>

                  </div>

                  {/* REGISTRATION NUMBER */}

                  <div>

                    <label
                      htmlFor="businessRegistrationNumber"
                      className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                      Business registration number
                      <span className="ml-1 text-xs font-normal text-slate-400">
                        (optional)
                      </span>
                    </label>

                    <input
                      id="businessRegistrationNumber"
                      name="businessRegistrationNumber"
                      type="text"
                      value={formData.businessRegistrationNumber}
                      onChange={handleChange}
                      placeholder="e.g. PV 12345"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />

                  </div>

                  {/* ADDRESS */}

                  <div>

                    <label
                      htmlFor="businessAddress"
                      className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                      Business address
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <textarea
                      id="businessAddress"
                      name="businessAddress"
                      value={formData.businessAddress}
                      onChange={handleChange}
                      placeholder="Enter your business address"
                      rows={3}
                      className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />

                  </div>

                  {/* CITY */}

                  <div>

                    <label
                      htmlFor="city"
                      className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                      City
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <input
                      id="city"
                      name="city"
                      type="text"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g. Colombo"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />

                  </div>

                </div>

              </div>
            )}

            {/* =================================================
                ACTIONS
            ================================================= */}

            <div className="border-t border-slate-100 pt-5">

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#173563] py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#102547] focus:outline-none focus:ring-4 focus:ring-blue-500/20"
              >
                Save & Continue
                <ChevronRight size={17} />
              </button>

              <button
                type="button"
                onClick={handleSkip}
                className="mt-3 w-full rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
              >
                Skip for now
              </button>

            </div>

          </form>

          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="mt-6 text-center">

            <p className="text-xs leading-5 text-slate-400">
              You can update your profile and business information
              anytime from your account settings.
            </p>

          </div>

        </div>

        {/* ===================================================
            BACK
        =================================================== */}

        <div className="mt-5 flex justify-center">

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-800"
          >
            <ArrowLeft size={16} />
            Back
          </button>

        </div>

      </div>

    </div>
  );
}

export default CompleteProfile;