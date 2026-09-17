import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  CheckCircle,
  EnvelopeSimple,
  MapPin,
  Phone,
  FloppyDisk,
  ShieldCheck,
  UserCircle,
  Warning,
  X,
} from "@phosphor-icons/react";
import AppNavbar from "../components/ui/AppNavbar";
import { useAuth } from "../context/AuthContext";
import { api, ApiError } from "../lib/api";

// Must match the <select> values CompleteProfile.jsx writes to businessCategory,
// so a value saved there displays with the same label here.
const BUSINESS_TYPE_OPTIONS = [
  { value: "sole-proprietorship", label: "Sole Proprietorship" },
  { value: "partnership", label: "Partnership" },
  { value: "private-limited", label: "Private Limited Company" },
  { value: "public-limited", label: "Public Limited Company" },
  { value: "other", label: "Other" },
];

function businessTypeLabel(value) {
  return BUSINESS_TYPE_OPTIONS.find((option) => option.value === value)?.label || "";
}

function initialsOf(name) {
  return (
    name
      ?.split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U"
  );
}

function Profile() {
  const { user, refreshProfile } = useAuth();
  const fileInputRef = useRef(null);

  const [accountType, setAccountType] = useState("business");
  const [formData, setFormData] = useState({
    phone: "",
    businessName: "",
    businessCategory: "",
    businessRegNumber: "",
    businessAddress: "",
  });
  const [original, setOriginal] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saved, setSaved] = useState(false);

  const [photo, setPhoto] = useState("");

  // Sync the editable draft whenever the real profile (GET /auth/me, via
  // AuthContext) loads or changes -- same pattern as CompleteProfile.jsx.
  useEffect(() => {
    if (!user) return;

    const timer = setTimeout(() => {
      if (user.isRegisteredBusiness === false) {
        setAccountType("individual");
      } else if (user.isRegisteredBusiness || user.businessName) {
        setAccountType("business");
      }

      setFormData({
        phone: user.phone || "",
        businessName: user.businessName || "",
        businessCategory: user.businessCategory || "",
        businessRegNumber: user.businessRegNumber || "",
        businessAddress: user.businessAddress || "",
      });
    }, 0);

    return () => clearTimeout(timer);
  }, [user]);

  // The photo has no backend field (Firestore user docs don't store one), so
  // it stays a per-browser convenience, scoped to this user's id so it never
  // leaks into a different account signed in on the same machine.
  useEffect(() => {
    if (!user?.id) return;

    const timer = setTimeout(() => {
      try {
        const stored = localStorage.getItem(`profilePhoto:${user.id}`);
        if (stored) setPhoto(stored);
      } catch {
        /* ignore */
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [user?.id]);

  const initials = initialsOf(
    accountType === "business" && formData.businessName ? formData.businessName : user?.name
  );

  const handleEdit = () => {
    setOriginal({ accountType, formData });
    setSaveError("");
    setSaved(false);
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (original) {
      setAccountType(original.accountType);
      setFormData(original.formData);
    }
    setIsEditing(false);
    setSaveError("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    setSaved(false);
  };

  const handleAccountTypeChange = (type) => {
    setAccountType(type);
    setSaved(false);
  };

  const handlePhotoClick = () => {
    if (!isEditing) return;
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Please select an image smaller than 5MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const dataUrl = reader.result;
      setPhoto(dataUrl);
      try {
        localStorage.setItem(`profilePhoto:${user.id}`, dataUrl);
        window.dispatchEvent(new Event("profilePhotoUpdated"));
      } catch {
        alert("Unable to save the photo -- it may be too large for browser storage.");
      }
    };

    reader.onerror = () => {
      alert("Unable to load the selected image.");
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handleRemovePhoto = () => {
    setPhoto("");
    try {
      localStorage.removeItem(`profilePhoto:${user.id}`);
      window.dispatchEvent(new Event("profilePhotoUpdated"));
    } catch {
      /* ignore */
    }
  };

  const buildPayload = () => {
    const isBusiness = accountType === "business";
    const payload = {
      phone: formData.phone.trim() || null,
      isRegisteredBusiness: isBusiness,
    };

    if (isBusiness) {
      payload.businessName = formData.businessName.trim() || null;
      payload.businessRegNumber = formData.businessRegNumber.trim() || null;
      payload.businessCategory = formData.businessCategory || null;
      payload.businessAddress = formData.businessAddress.trim() || null;
    }

    return payload;
  };

  const handleSave = async () => {
    if (!user?.id) return;

    setSaving(true);
    setSaveError("");

    try {
      await api.put(`/users/${user.id}/profile`, buildPayload());
      await refreshProfile();
      setIsEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      setSaveError(
        error instanceof ApiError ? error.message : "Could not save your profile. Is the backend running?"
      );
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f6f8fb] text-[#172033]">
        <AppNavbar />
        <div className="mx-auto flex max-w-[1080px] flex-col items-center gap-4 px-5 py-24 text-center">
          <Warning size={28} className="text-slate-400" />
          <p className="text-[16px] font-medium text-slate-500">Could not load your profile.</p>
          <button
            type="button"
            onClick={() => refreshProfile()}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#173563] px-5 text-[15px] font-semibold text-white shadow-sm transition hover:bg-[#214777]"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-[#172033]">
      <AppNavbar />

      <main className="mx-auto w-full max-w-[1080px] px-5 pb-16 pt-8 sm:px-8 lg:pt-10">
        {/* Back */}
        <Link
          to="/dashboard"
          className="group mb-8 inline-flex items-center gap-2 text-[16px] font-semibold text-slate-600 transition hover:text-[#173563]"
        >
          <ArrowLeft
            size={18}
            className="transition-transform duration-200 group-hover:-translate-x-1"
          />

          Back to Dashboard
        </Link>

        {/* Page Heading */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-[14px] font-bold uppercase tracking-[0.14em] text-blue-600">
              Account
            </p>

            <h1 className="text-[35px] font-bold tracking-[-0.04em] text-[#14213D] sm:text-[45px]">
              My Profile
            </h1>

            <p className="mt-2 max-w-2xl text-[14px] leading-6 text-slate-500 sm:text-[16px]">
              Manage your personal and business information
            </p>
          </div>

          {/* Edit / Save / Cancel */}
          {!isEditing ? (
            <button
              type="button"
              onClick={handleEdit}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#173563] px-5 text-[16px] font-semibold text-white shadow-[0_8px_20px_rgba(23,53,99,0.14)] transition hover:bg-[#214777] hover:shadow-[0_10px_24px_rgba(23,53,99,0.2)]"
            >
              Edit Profile
              <ArrowRight size={17} />
            </button>
          ) : (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-[16px] font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <X size={17} />
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#173563] px-5 text-[16px] font-semibold text-white shadow-[0_8px_20px_rgba(23,53,99,0.14)] transition hover:bg-[#214777] hover:shadow-[0_10px_24px_rgba(23,53,99,0.2)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FloppyDisk size={17} />
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          )}
        </div>

        {/* Success / Error Message */}
        {saved && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[15px] font-semibold text-emerald-700">
            <CheckCircle size={18} />
            Profile updated successfully.
          </div>
        )}

        {saveError && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[15px] font-semibold text-red-600">
            <Warning size={18} />
            {saveError}
          </div>
        )}

        {/* Profile Header */}
        <section className="relative mb-7 overflow-hidden rounded-[26px] bg-gradient-to-br from-[#10294d] via-[#173f78] to-[#2563eb] px-7 py-8 shadow-[0_18px_45px_rgba(23,53,99,0.17)] sm:px-10 sm:py-9">
          {/* Decorative elements */}
          <div className="pointer-events-none absolute -right-28 -top-32 h-[360px] w-[360px] rounded-full border-[55px] border-white/[0.035]" />

          <div className="pointer-events-none absolute -bottom-36 -right-10 h-[300px] w-[300px] rounded-full bg-blue-300/10 blur-3xl" />

          <div className="pointer-events-none absolute left-[42%] top-[-90px] h-[220px] w-[220px] rounded-full bg-cyan-300/[0.07] blur-3xl" />

          <div className="relative z-10 flex flex-col gap-7 sm:flex-row sm:items-center">
            {/* Profile Photo */}
            <div className="relative shrink-0">
              <div className="flex h-[100px] w-[100px] items-center justify-center overflow-hidden rounded-[27px] border border-white/30 bg-white/10 text-[29px] font-bold tracking-wide text-white shadow-[0_12px_35px_rgba(0,0,0,0.18)] backdrop-blur-md">
                {photo ? (
                  <img src={photo} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  initials
                )}
              </div>

              {/* Camera Button */}
              {isEditing && (
                <>
                  <button
                    type="button"
                    onClick={handlePhotoClick}
                    className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-[#173f78] bg-white text-[#173563] shadow-lg transition duration-200 hover:scale-105 hover:bg-slate-50"
                    aria-label={photo ? "Change profile photo" : "Upload profile photo"}
                    title={photo ? "Change profile photo" : "Upload profile photo"}
                  >
                    <Camera size={17} />
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </>
              )}
            </div>

            {/* Profile Details */}
            <div className="min-w-0">
              <p className="mb-1 text-[14px] font-semibold uppercase tracking-[0.14em] text-blue-100/75">
                ImportEase Workspace
              </p>

              <h2 className="truncate text-[30px] font-bold tracking-[-0.03em] text-white sm:text-[33px]">
                {accountType === "business" && formData.businessName
                  ? formData.businessName
                  : user.name || "My Account"}
              </h2>

              <p className="mt-1 text-[17px] font-medium text-blue-100">{user.name || ""}</p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-[14px] font-semibold text-white backdrop-blur-sm">
                  {accountType === "business" ? "Business / SME" : "Individual"}
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3.5 py-1.5 text-[14px] font-medium text-emerald-100 backdrop-blur-sm">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  Active account
                </span>
              </div>

              {/* Photo Controls */}
              {isEditing && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePhotoClick}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3.5 py-2 text-[14px] font-semibold text-white backdrop-blur-sm transition hover:bg-white/15"
                  >
                    <Camera size={15} />
                    {photo ? "Change photo" : "Upload photo"}
                  </button>

                  {photo && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="inline-flex items-center rounded-lg border border-white/10 bg-transparent px-3.5 py-2 text-[14px] font-medium text-blue-100 transition hover:bg-white/10"
                    >
                      Remove photo
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Personal Information */}
        <section className="mb-6 rounded-[22px] border border-slate-200/80 bg-white p-7 shadow-[0_4px_20px_rgba(15,23,42,0.04)] sm:p-8">
          <div className="mb-7 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <UserCircle size={19} />
            </div>

            <div>
              <h2 className="text-[23px] font-bold tracking-[-0.02em] text-[#172033]">
                Personal Information
              </h2>

              <p className="mt-1.5 text-[16px] text-slate-500">Your primary account information</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Full Name -- read-only: the backend has no endpoint to rename an account */}
            <div>
              <label className="mb-2 block text-[15px] font-semibold text-slate-600">Full Name</label>
              <div className="flex min-h-[52px] items-center rounded-xl border border-slate-200 bg-slate-50/70 px-4 text-[17px] font-medium text-slate-800">
                {user.name || "Not added"}
              </div>
              <p className="mt-1.5 text-[13px] text-slate-400">This can't be changed here.</p>
            </div>

            {/* Email -- read-only: tied to Firebase sign-in */}
            <div>
              <label className="mb-2 block text-[15px] font-semibold text-slate-600">
                Email Address
              </label>
              <div className="flex min-h-[52px] items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-4 text-[17px] font-medium text-slate-800">
                <EnvelopeSimple size={17} className="shrink-0 text-slate-400" />
                <span className="truncate">{user.email || "Not added"}</span>
              </div>
              <p className="mt-1.5 text-[13px] text-slate-400">This can't be changed here.</p>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="mb-2 block text-[15px] font-semibold text-slate-600">
                Phone Number
              </label>

              {isEditing ? (
                <div className="relative">
                  <Phone
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                    className="min-h-[52px] w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-[17px] font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    placeholder="Enter your phone number"
                  />
                </div>
              ) : (
                <div className="flex min-h-[52px] items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-4 text-[17px] font-medium text-slate-800">
                  <Phone size={17} className="shrink-0 text-slate-400" />
                  {formData.phone || "Not added"}
                </div>
              )}
            </div>

            {/* Account Type */}
            <div>
              <label className="mb-2 block text-[15px] font-semibold text-slate-600">
                Account Type
              </label>

              {isEditing ? (
                <div className="flex min-h-[52px] items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleAccountTypeChange("individual")}
                    className={`h-[44px] flex-1 rounded-xl border text-[15px] font-semibold transition ${
                      accountType === "individual"
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    Individual
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAccountTypeChange("business")}
                    className={`h-[44px] flex-1 rounded-xl border text-[15px] font-semibold transition ${
                      accountType === "business"
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    Business / SME
                  </button>
                </div>
              ) : (
                <div className="flex min-h-[52px] items-center rounded-xl border border-slate-200 bg-slate-50/70 px-4 text-[17px] font-semibold text-[#173563]">
                  {accountType === "business" ? "Business / SME" : "Individual"}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Business Information */}
        <section className="mb-6 rounded-[22px] border border-slate-200/80 bg-white p-7 shadow-[0_4px_20px_rgba(15,23,42,0.04)] sm:p-8">
          <div className="mb-7">
            <h2 className="text-[23px] font-bold tracking-[-0.02em] text-[#172033]">
              Business Information
            </h2>

            <p className="mt-1.5 text-[16px] text-slate-500">
              Details used for your import activities
            </p>
          </div>

          {accountType === "business" ? (
            <div className="grid gap-6 md:grid-cols-2">
              {/* Business Name */}
              <div>
                <label
                  htmlFor="businessName"
                  className="mb-2 block text-[15px] font-semibold text-slate-600"
                >
                  Business Name
                </label>

                {isEditing ? (
                  <input
                    id="businessName"
                    name="businessName"
                    type="text"
                    value={formData.businessName}
                    onChange={handleChange}
                    autoComplete="organization"
                    className="min-h-[52px] w-full rounded-xl border border-slate-200 bg-white px-4 text-[17px] font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    placeholder="Enter business name"
                  />
                ) : (
                  <div className="flex min-h-[52px] items-center rounded-xl border border-slate-200 bg-slate-50/70 px-4 text-[17px] font-medium text-slate-800">
                    {formData.businessName || "Not added"}
                  </div>
                )}
              </div>

              {/* Business Type */}
              <div>
                <label
                  htmlFor="businessCategory"
                  className="mb-2 block text-[15px] font-semibold text-slate-600"
                >
                  Business Type
                </label>

                {isEditing ? (
                  <select
                    id="businessCategory"
                    name="businessCategory"
                    value={formData.businessCategory}
                    onChange={handleChange}
                    className="min-h-[52px] w-full rounded-xl border border-slate-200 bg-white px-4 text-[17px] font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  >
                    <option value="">Select business type</option>
                    {BUSINESS_TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="flex min-h-[52px] items-center rounded-xl border border-slate-200 bg-slate-50/70 px-4 text-[17px] font-medium text-slate-800">
                    {businessTypeLabel(formData.businessCategory) || "Not added"}
                  </div>
                )}
              </div>

              {/* Registration Number */}
              <div>
                <label
                  htmlFor="businessRegNumber"
                  className="mb-2 block text-[15px] font-semibold text-slate-600"
                >
                  Registration Number
                </label>

                {isEditing ? (
                  <input
                    id="businessRegNumber"
                    name="businessRegNumber"
                    type="text"
                    value={formData.businessRegNumber}
                    onChange={handleChange}
                    className="min-h-[52px] w-full rounded-xl border border-slate-200 bg-white px-4 text-[17px] font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    placeholder="Enter registration number"
                  />
                ) : (
                  <div
                    className={`flex min-h-[52px] items-center rounded-xl border border-slate-200 bg-slate-50/70 px-4 text-[17px] font-medium ${
                      formData.businessRegNumber ? "text-slate-800" : "text-slate-400"
                    }`}
                  >
                    {formData.businessRegNumber || "Not added"}
                  </div>
                )}
              </div>

              {/* Address */}
              <div>
                <label
                  htmlFor="businessAddress"
                  className="mb-2 block text-[15px] font-semibold text-slate-600"
                >
                  Business Address
                </label>

                {isEditing ? (
                  <div className="relative">
                    <MapPin
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="businessAddress"
                      name="businessAddress"
                      type="text"
                      value={formData.businessAddress}
                      onChange={handleChange}
                      autoComplete="street-address"
                      className="min-h-[52px] w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-[17px] font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      placeholder="Enter business address"
                    />
                  </div>
                ) : (
                  <div className="flex min-h-[52px] items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-4 text-[17px] font-medium text-slate-800">
                    <MapPin size={17} className="shrink-0 text-slate-400" />
                    <span>{formData.businessAddress || "Not added"}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-5 py-6 text-center text-[15px] text-slate-500">
              You're registered as an individual importer, so no business details are needed.
              {isEditing && (
                <button
                  type="button"
                  onClick={() => handleAccountTypeChange("business")}
                  className="mt-3 block w-full text-[15px] font-semibold text-blue-600 hover:text-blue-700"
                >
                  Add business details instead
                </button>
              )}
            </div>
          )}
        </section>

        {/* Contact Information */}
        <section className="mb-6 rounded-[22px] border border-slate-200/80 bg-white p-7 shadow-[0_4px_20px_rgba(15,23,42,0.04)] sm:p-8">
          <div className="mb-7 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <EnvelopeSimple size={19} />
            </div>

            <div>
              <h2 className="text-[23px] font-bold tracking-[-0.02em] text-[#172033]">
                Contact Information
              </h2>

              <p className="mt-1 text-[15px] text-slate-500">Your account contact details</p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {/* Email */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-5">
              <p className="mb-2 text-[14px] font-semibold uppercase tracking-wide text-slate-400">
                Email Address
              </p>
              <p className="break-all text-[17px] font-semibold text-slate-800">
                {user.email || "Not added"}
              </p>
            </div>

            {/* Phone */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-5">
              <p className="mb-2 text-[14px] font-semibold uppercase tracking-wide text-slate-400">
                Phone Number
              </p>

              {isEditing ? (
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[17px] font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  placeholder="Phone number"
                />
              ) : (
                <p className="text-[17px] font-semibold text-slate-800">
                  {formData.phone || "Not added"}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Account Security */}
        <section className="mb-10 rounded-[22px] border border-slate-200/80 bg-white p-7 shadow-[0_4px_20px_rgba(15,23,42,0.04)] sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <ShieldCheck size={21} />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-[23px] font-bold tracking-[-0.02em] text-[#172033]">
                    Account Security
                  </h2>

                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-[13px] font-bold uppercase tracking-wide text-emerald-700">
                    Active
                  </span>
                </div>

                <p className="mt-2 text-[16px] leading-6 text-slate-500">
                  Your ImportEase account is active and secure.
                </p>
              </div>
            </div>

            <Link
              to="/settings"
              className="inline-flex shrink-0 items-center gap-2 text-[16px] font-semibold text-[#2563eb] transition hover:text-[#173563]"
            >
              Manage security settings
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 pt-7 text-center">
          <p className="text-[15px] font-medium text-slate-400">ImportEase · SME Import Platform</p>

          <div className="mt-2 flex items-center justify-center gap-2 text-[14px] text-slate-400">
            <CheckCircle size={15} className="text-emerald-500" />
            Secure workspace
          </div>
        </footer>
      </main>
    </div>
  );
}

export default Profile;
