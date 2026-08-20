import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  Building2,
  Check,
  ChevronRight,
  Edit3,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  User,
} from "lucide-react";

function Profile() {
  const navigate = useNavigate();

  const savedUser = JSON.parse(
    localStorage.getItem("currentUser") || "null"
  );

  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState(
    savedUser || {
      businessName: "My Business",
      initials: "MB",
      email: "business@example.com",
      phone: "+94 77 123 4567",
      address: "Colombo, Sri Lanka",
      businessType: "SME",
      registrationNumber: "Not added",
    }
  );

  const handleChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    const updatedProfile = {
      ...profile,
      initials:
        profile.businessName
          ?.split(" ")
          .filter(Boolean)
          .slice(0, 2)
          .map((word) => word[0])
          .join("")
          .toUpperCase() || "MB",
    };

    localStorage.setItem(
      "currentUser",
      JSON.stringify(updatedProfile)
    );

    setProfile(updatedProfile);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-900">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">

        <div className="mx-auto flex h-[68px] max-w-[1180px] items-center justify-between px-5 sm:px-7">

          <Link
            to="/dashboard"
            className="flex items-center gap-3"
          >

            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white">
              <img
                src="/logo.jpeg"
                alt="ImportEase"
                className="h-full w-full object-contain"
              />
            </div>

            <div>

              <p className="text-[17px] font-bold tracking-[-0.035em] text-[#173B6C]">
                Import<span className="text-[#173563]">Ease</span>
              </p>

              <p className="hidden text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-400 sm:block">
                SME Import Platform
              </p>

            </div>

          </Link>

          <div className="flex items-center gap-3">

            <button
              type="button"
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
            >
              <Bell size={18} />

              <span className="absolute right-[7px] top-[6px] h-1.5 w-1.5 rounded-full bg-blue-600 ring-2 ring-white" />
            </button>

            <div className="hidden h-7 w-px bg-slate-200 sm:block" />

            <Link
              to="/profile"
              className="flex items-center gap-2.5 rounded-lg bg-slate-50 px-2 py-1.5"
            >

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#173B6C] text-[10px] font-bold text-white">
                {profile.initials}
              </div>

              <div className="hidden text-left sm:block">

                <p className="text-[12px] font-semibold text-slate-800">
                  {profile.businessName}
                </p>

                <p className="text-[10px] text-slate-400">
                  SME Account
                </p>

              </div>

            </Link>

          </div>

        </div>

      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mx-auto max-w-[1000px] px-5 py-8 sm:px-7 lg:py-10">

        {/* BACK */}

        <button
          onClick={() => navigate("/dashboard")}
          className="mb-6 flex items-center gap-2 text-[11px] font-semibold text-slate-500 transition hover:text-slate-800"
        >
          <ArrowLeft size={14} />
          Back to dashboard
        </button>

        {/* PAGE HEADER */}

        <section className="mb-7">

          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5">

            <User
              size={13}
              className="text-blue-700"
            />

            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
              Account profile
            </span>

          </div>

          <h1 className="text-3xl font-bold tracking-tight text-[#14213D]">
            My Profile
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
            Manage your business information and account details.
          </p>

        </section>

        {/* PROFILE HEADER CARD */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.03)]">

          <div className="h-24 bg-gradient-to-r from-[#173B6C] to-[#2563EB]" />

          <div className="px-5 pb-6 sm:px-7">

            <div className="-mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

              <div className="flex items-end gap-4">

                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-[#173B6C] text-xl font-bold text-white shadow-lg">
                  {profile.initials}
                </div>

                <div className="pb-1">

                  <h2 className="text-lg font-bold text-slate-900">
                    {profile.businessName}
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    {profile.businessType} Account
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={() => {
                  if (isEditing) {
                    handleSave();
                  } else {
                    setIsEditing(true);
                  }
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173B6C] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#12315B]"
              >
                {isEditing ? (
                  <>
                    <Save size={14} />
                    Save changes
                  </>
                ) : (
                  <>
                    <Edit3 size={14} />
                    Edit profile
                  </>
                )}
              </button>

            </div>

          </div>

        </section>

        {/* BUSINESS INFORMATION */}

        <section className="mt-5 rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.025)]">

          <div className="border-b border-slate-100 px-5 py-4 sm:px-7">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                <Building2 size={17} />
              </div>

              <div>

                <h2 className="text-sm font-bold text-slate-800">
                  Business information
                </h2>

                <p className="text-[10px] text-slate-400">
                  Information used for your import activities
                </p>

              </div>

            </div>

          </div>

          <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-7">

            <ProfileField
              label="Business name"
              value={profile.businessName}
              editing={isEditing}
              onChange={(value) =>
                handleChange("businessName", value)
              }
            />

            <ProfileField
              label="Business type"
              value={profile.businessType}
              editing={isEditing}
              onChange={(value) =>
                handleChange("businessType", value)
              }
            />

            <ProfileField
              label="Registration number"
              value={profile.registrationNumber}
              editing={isEditing}
              onChange={(value) =>
                handleChange("registrationNumber", value)
              }
            />

            <ProfileField
              label="Business address"
              value={profile.address}
              editing={isEditing}
              onChange={(value) =>
                handleChange("address", value)
              }
            />

          </div>

        </section>

        {/* CONTACT INFORMATION */}

        <section className="mt-5 rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.025)]">

          <div className="border-b border-slate-100 px-5 py-4 sm:px-7">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                <User size={17} />
              </div>

              <div>

                <h2 className="text-sm font-bold text-slate-800">
                  Contact information
                </h2>

                <p className="text-[10px] text-slate-400">
                  Your primary business contact details
                </p>

              </div>

            </div>

          </div>

          <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-7">

            <ProfileField
              label="Email address"
              value={profile.email}
              editing={isEditing}
              icon={Mail}
              onChange={(value) =>
                handleChange("email", value)
              }
            />

            <ProfileField
              label="Phone number"
              value={profile.phone}
              editing={isEditing}
              icon={Phone}
              onChange={(value) =>
                handleChange("phone", value)
              }
            />

          </div>

        </section>

        {/* ACCOUNT STATUS */}

        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.025)] sm:p-7">

          <div className="flex items-start gap-4">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <ShieldCheck size={19} />
            </div>

            <div className="flex-1">

              <div className="flex flex-wrap items-center gap-2">

                <h2 className="text-sm font-bold text-slate-800">
                  Account security
                </h2>

                <span className="rounded-full bg-emerald-50 px-2 py-1 text-[8px] font-bold text-emerald-700">
                  ACTIVE
                </span>

              </div>

              <p className="mt-1 text-[11px] leading-5 text-slate-400">
                Your ImportEase business account is active and ready
                to manage imports and shipments.
              </p>

              <Link
                to="/settings"
                className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-bold text-blue-700 hover:underline"
              >
                Security & account settings
                <ChevronRight size={12} />
              </Link>

            </div>

          </div>

        </section>

        {/* FOOTER */}

        <footer className="mt-8 flex flex-col gap-3 border-t border-slate-200/80 pt-5 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-[10px] text-slate-400">
            ImportEase · SME Import Platform
          </p>

          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">

            <Check
              size={11}
              className="text-emerald-500"
            />

            Secure workspace

          </div>

        </footer>

      </main>

    </div>
  );
}

/* =========================================================
   PROFILE FIELD
========================================================= */

function ProfileField({
  label,
  value,
  editing,
  onChange,
  icon: Icon,
}) {
  return (
    <div>

      <label className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
        {label}
      </label>

      <div className="relative mt-2">

        {Icon && (
          <Icon
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
        )}

        {editing ? (
          <input
            value={value || ""}
            onChange={(event) =>
              onChange(event.target.value)
            }
            className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-xs font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50 ${
              Icon ? "pl-10" : ""
            }`}
          />
        ) : (
          <div
            className={`rounded-xl bg-slate-50 px-3 py-3 text-xs font-semibold text-slate-700 ${
              Icon ? "pl-10" : ""
            }`}
          >
            {value || "Not added"}
          </div>
        )}

      </div>

    </div>
  );
}

export default Profile;