import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import AppNavbar from "../components/ui/AppNavbar";

function Profile() {
  const defaultProfile = {
    fullName: "Business Owner",
    businessName: "My Business",
    email: "business@email.com",
    phone: "+94 77 123 4567",
    businessType: "SME",
    registrationNumber: "",
    address: "Colombo, Sri Lanka",
    photo: "",
  };

  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState(defaultProfile);
  const [originalProfile, setOriginalProfile] =
    useState(defaultProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = () => {
    try {
      const savedProfile = localStorage.getItem("smeProfile");
      const savedUser = localStorage.getItem("user");

      let profileData = {};

      if (savedProfile) {
        try {
          profileData = {
            ...profileData,
            ...JSON.parse(savedProfile),
          };
        } catch (error) {
          console.error(
            "Invalid smeProfile data:",
            error
          );
        }
      }

      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);

          profileData = {
            ...profileData,
            ...userData,
          };
        } catch (error) {
          console.error(
            "Invalid user data:",
            error
          );
        }
      }

      const loadedProfile = {
        ...defaultProfile,
        ...profileData,
      };

      setProfile(loadedProfile);
      setOriginalProfile(loadedProfile);
    } catch (error) {
      console.error(
        "Failed to load profile:",
        error
      );
    }
  };

  const initials =
    profile.businessName
      ?.split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "MB";

  const handleEdit = () => {
    setOriginalProfile({
      ...profile,
    });

    setSaved(false);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setProfile({
      ...originalProfile,
    });

    setIsEditing(false);
    setSaved(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProfile((previousProfile) => ({
      ...previousProfile,
      [name]: value,
    }));

    setSaved(false);
  };

  const handlePhotoClick = () => {
    if (!isEditing) {
      return;
    }

    fileInputRef.current?.click();
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    // Check file size
    if (file.size > 5 * 1024 * 1024) {
      alert("Please select an image smaller than 5MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setProfile((previousProfile) => ({
        ...previousProfile,
        photo: reader.result,
      }));

      setSaved(false);
    };

    reader.onerror = () => {
      alert("Unable to load the selected image.");
    };

    reader.readAsDataURL(file);

    event.target.value = "";
  };

  const handleRemovePhoto = () => {
    setProfile((previousProfile) => ({
      ...previousProfile,
      photo: "",
    }));

    setSaved(false);
  };

  const handleSave = () => {
    const updatedProfile = {
      ...profile,
    };

    try {
      // Save SME profile
      localStorage.setItem(
        "smeProfile",
        JSON.stringify(updatedProfile)
      );

      // Keep user information synchronized
      let existingUser = {};

      try {
        existingUser = JSON.parse(
          localStorage.getItem("user") || "{}"
        );
      } catch {
        existingUser = {};
      }

      const updatedUser = {
        ...existingUser,
        fullName: updatedProfile.fullName,
        businessName: updatedProfile.businessName,
        email: updatedProfile.email,
        phone: updatedProfile.phone,
        businessType: updatedProfile.businessType,
        registrationNumber:
          updatedProfile.registrationNumber,
        address: updatedProfile.address,
        photo: updatedProfile.photo,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      setProfile(updatedProfile);
      setOriginalProfile(updatedProfile);
      setIsEditing(false);
      setSaved(true);

      window.dispatchEvent(
        new Event("profileUpdated")
      );

      setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (error) {
      console.error(
        "Failed to save profile:",
        error
      );

      alert(
        "Unable to save your profile. The image may be too large for browser storage."
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-[#172033]">
      <AppNavbar />

      <main className="mx-auto w-full max-w-[1080px] px-5 pb-16 pt-8 sm:px-8 lg:pt-10">
        {/* Back */}
        <Link
          to="/dashboard"
          className="group mb-8 inline-flex items-center gap-2 text-[15px] font-semibold text-slate-600 transition hover:text-[#173563]"
        >
          <ArrowLeft
            size={18}
            strokeWidth={2}
            className="transition-transform duration-200 group-hover:-translate-x-1"
          />

          Back to Dashboard
        </Link>

        {/* Page Heading */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-[13px] font-bold uppercase tracking-[0.14em] text-blue-600">
              Account
            </p>

            <h1 className="text-[34px] font-bold tracking-[-0.035em] text-[#14233d] sm:text-[38px]">
              My Profile
            </h1>

            <p className="mt-2 text-[16px] leading-7 text-slate-500">
              Manage your personal and business information
            </p>
          </div>

          {/* Edit / Save / Cancel */}
          {!isEditing ? (
            <button
              type="button"
              onClick={handleEdit}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#173563] px-5 text-[15px] font-semibold text-white shadow-[0_8px_20px_rgba(23,53,99,0.14)] transition hover:bg-[#214777] hover:shadow-[0_10px_24px_rgba(23,53,99,0.2)]"
            >
              Edit Profile
              <ArrowRight size={17} />
            </button>
          ) : (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-[15px] font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50"
              >
                <X size={17} />
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#173563] px-5 text-[15px] font-semibold text-white shadow-[0_8px_20px_rgba(23,53,99,0.14)] transition hover:bg-[#214777] hover:shadow-[0_10px_24px_rgba(23,53,99,0.2)]"
              >
                <Save size={17} />
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* Success Message */}
        {saved && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[14px] font-semibold text-emerald-700">
            <CheckCircle2 size={18} />

            Profile updated successfully.
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
              <div className="flex h-[100px] w-[100px] items-center justify-center overflow-hidden rounded-[27px] border border-white/30 bg-white/10 text-[27px] font-bold tracking-wide text-white shadow-[0_12px_35px_rgba(0,0,0,0.18)] backdrop-blur-md">
                {profile.photo ? (
                  <img
                    src={profile.photo}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
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
                    aria-label={
                      profile.photo
                        ? "Change profile photo"
                        : "Upload profile photo"
                    }
                    title={
                      profile.photo
                        ? "Change profile photo"
                        : "Upload profile photo"
                    }
                  >
                    <Camera
                      size={17}
                      strokeWidth={2.2}
                    />
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
              <p className="mb-1 text-[13px] font-semibold uppercase tracking-[0.14em] text-blue-100/75">
                ImportEase Workspace
              </p>

              <h2 className="truncate text-[28px] font-bold tracking-[-0.03em] text-white sm:text-[31px]">
                {profile.businessName || "My Business"}
              </h2>

              <p className="mt-1 text-[16px] font-medium text-blue-100">
                {profile.fullName || "Business Owner"}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-[13px] font-semibold text-white backdrop-blur-sm">
                  {profile.businessType || "SME"}
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3.5 py-1.5 text-[13px] font-medium text-emerald-100 backdrop-blur-sm">
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
                    className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3.5 py-2 text-[13px] font-semibold text-white backdrop-blur-sm transition hover:bg-white/15"
                  >
                    <Camera size={15} />

                    {profile.photo
                      ? "Change photo"
                      : "Upload photo"}
                  </button>

                  {profile.photo && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="inline-flex items-center rounded-lg border border-white/10 bg-transparent px-3.5 py-2 text-[13px] font-medium text-blue-100 transition hover:bg-white/10"
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
              <UserRound size={19} />
            </div>

            <div>
              <h2 className="text-[21px] font-bold tracking-[-0.02em] text-[#172033]">
                Personal Information
              </h2>

              <p className="mt-1.5 text-[15px] text-slate-500">
                Your primary account information
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="mb-2 block text-[14px] font-semibold text-slate-600"
              >
                Full Name
              </label>

              {isEditing ? (
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={profile.fullName}
                  onChange={handleChange}
                  autoComplete="name"
                  className="min-h-[52px] w-full rounded-xl border border-slate-200 bg-white px-4 text-[16px] font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  placeholder="Enter your full name"
                />
              ) : (
                <div className="flex min-h-[52px] items-center rounded-xl border border-slate-200 bg-slate-50/70 px-4 text-[16px] font-medium text-slate-800">
                  {profile.fullName || "Not added"}
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-[14px] font-semibold text-slate-600"
              >
                Email Address
              </label>

              {isEditing ? (
                <div className="relative">
                  <Mail
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={handleChange}
                    autoComplete="email"
                    className="min-h-[52px] w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-[16px] font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    placeholder="Enter your email"
                  />
                </div>
              ) : (
                <div className="flex min-h-[52px] items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-4 text-[16px] font-medium text-slate-800">
                  <Mail
                    size={17}
                    className="shrink-0 text-slate-400"
                  />

                  <span className="truncate">
                    {profile.email || "Not added"}
                  </span>
                </div>
              )}
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-[14px] font-semibold text-slate-600"
              >
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
                    value={profile.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                    className="min-h-[52px] w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-[16px] font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    placeholder="Enter your phone number"
                  />
                </div>
              ) : (
                <div className="flex min-h-[52px] items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-4 text-[16px] font-medium text-slate-800">
                  <Phone
                    size={17}
                    className="shrink-0 text-slate-400"
                  />

                  {profile.phone || "Not added"}
                </div>
              )}
            </div>

            {/* Account Type */}
            <div>
              <label
                htmlFor="businessType"
                className="mb-2 block text-[14px] font-semibold text-slate-600"
              >
                Account Type
              </label>

              {isEditing ? (
                <input
                  id="businessType"
                  name="businessType"
                  type="text"
                  value={profile.businessType}
                  onChange={handleChange}
                  className="min-h-[52px] w-full rounded-xl border border-slate-200 bg-white px-4 text-[16px] font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              ) : (
                <div className="flex min-h-[52px] items-center rounded-xl border border-slate-200 bg-slate-50/70 px-4 text-[16px] font-semibold text-[#173563]">
                  {profile.businessType || "SME"}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Business Information */}
        <section className="mb-6 rounded-[22px] border border-slate-200/80 bg-white p-7 shadow-[0_4px_20px_rgba(15,23,42,0.04)] sm:p-8">
          <div className="mb-7">
            <h2 className="text-[21px] font-bold tracking-[-0.02em] text-[#172033]">
              Business Information
            </h2>

            <p className="mt-1.5 text-[15px] text-slate-500">
              Details used for your import activities
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Business Name */}
            <div>
              <label
                htmlFor="businessName"
                className="mb-2 block text-[14px] font-semibold text-slate-600"
              >
                Business Name
              </label>

              {isEditing ? (
                <input
                  id="businessName"
                  name="businessName"
                  type="text"
                  value={profile.businessName}
                  onChange={handleChange}
                  autoComplete="organization"
                  className="min-h-[52px] w-full rounded-xl border border-slate-200 bg-white px-4 text-[16px] font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  placeholder="Enter business name"
                />
              ) : (
                <div className="flex min-h-[52px] items-center rounded-xl border border-slate-200 bg-slate-50/70 px-4 text-[16px] font-medium text-slate-800">
                  {profile.businessName || "Not added"}
                </div>
              )}
            </div>

            {/* Business Type */}
            <div>
              <label
                htmlFor="businessTypeBusiness"
                className="mb-2 block text-[14px] font-semibold text-slate-600"
              >
                Business Type
              </label>

              {isEditing ? (
                <input
                  id="businessTypeBusiness"
                  name="businessType"
                  type="text"
                  value={profile.businessType}
                  onChange={handleChange}
                  className="min-h-[52px] w-full rounded-xl border border-slate-200 bg-white px-4 text-[16px] font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              ) : (
                <div className="flex min-h-[52px] items-center rounded-xl border border-slate-200 bg-slate-50/70 px-4 text-[16px] font-medium text-slate-800">
                  {profile.businessType || "SME"}
                </div>
              )}
            </div>

            {/* Registration Number */}
            <div>
              <label
                htmlFor="registrationNumber"
                className="mb-2 block text-[14px] font-semibold text-slate-600"
              >
                Registration Number
              </label>

              {isEditing ? (
                <input
                  id="registrationNumber"
                  name="registrationNumber"
                  type="text"
                  value={profile.registrationNumber}
                  onChange={handleChange}
                  className="min-h-[52px] w-full rounded-xl border border-slate-200 bg-white px-4 text-[16px] font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  placeholder="Enter registration number"
                />
              ) : (
                <div
                  className={`flex min-h-[52px] items-center rounded-xl border border-slate-200 bg-slate-50/70 px-4 text-[16px] font-medium ${
                    profile.registrationNumber
                      ? "text-slate-800"
                      : "text-slate-400"
                  }`}
                >
                  {profile.registrationNumber ||
                    "Not added"}
                </div>
              )}
            </div>

            {/* Address */}
            <div>
              <label
                htmlFor="address"
                className="mb-2 block text-[14px] font-semibold text-slate-600"
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
                    id="address"
                    name="address"
                    type="text"
                    value={profile.address}
                    onChange={handleChange}
                    autoComplete="street-address"
                    className="min-h-[52px] w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-[16px] font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    placeholder="Enter business address"
                  />
                </div>
              ) : (
                <div className="flex min-h-[52px] items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-4 text-[16px] font-medium text-slate-800">
                  <MapPin
                    size={17}
                    className="shrink-0 text-slate-400"
                  />

                  <span>
                    {profile.address || "Not added"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="mb-6 rounded-[22px] border border-slate-200/80 bg-white p-7 shadow-[0_4px_20px_rgba(15,23,42,0.04)] sm:p-8">
          <div className="mb-7 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Mail size={19} />
            </div>

            <div>
              <h2 className="text-[21px] font-bold tracking-[-0.02em] text-[#172033]">
                Contact Information
              </h2>

              <p className="mt-1 text-[14px] text-slate-500">
                Your account contact details
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {/* Email */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-5">
              <p className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-slate-400">
                Email Address
              </p>

              {isEditing ? (
                <input
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleChange}
                  autoComplete="email"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[16px] font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  placeholder="Email address"
                />
              ) : (
                <p className="break-all text-[16px] font-semibold text-slate-800">
                  {profile.email || "Not added"}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-5">
              <p className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-slate-400">
                Phone Number
              </p>

              {isEditing ? (
                <input
                  name="phone"
                  type="tel"
                  value={profile.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[16px] font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  placeholder="Phone number"
                />
              ) : (
                <p className="text-[16px] font-semibold text-slate-800">
                  {profile.phone || "Not added"}
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
                  <h2 className="text-[21px] font-bold tracking-[-0.02em] text-[#172033]">
                    Account Security
                  </h2>

                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-[12px] font-bold uppercase tracking-wide text-emerald-700">
                    Active
                  </span>
                </div>

                <p className="mt-2 text-[15px] leading-6 text-slate-500">
                  Your ImportEase account is active and secure.
                </p>
              </div>
            </div>

            <Link
              to="/settings"
              className="inline-flex shrink-0 items-center gap-2 text-[15px] font-semibold text-[#2563eb] transition hover:text-[#173563]"
            >
              Manage security settings
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 pt-7 text-center">
          <p className="text-[14px] font-medium text-slate-400">
            ImportEase · SME Import Platform
          </p>

          <div className="mt-2 flex items-center justify-center gap-2 text-[13px] text-slate-400">
            <CheckCircle2
              size={15}
              className="text-emerald-500"
            />

            Secure workspace
          </div>
        </footer>
      </main>
    </div>
  );
}

export default Profile;