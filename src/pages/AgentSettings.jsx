import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  RefreshCw,
  Save,
  Settings as SettingsIcon,
  ShieldCheck,
  User,
  Users,
  Upload,
  ImagePlus,
} from "lucide-react";
import AgentMemberSidebar from "../components/AgentMemberSidebar";

function AgentSettings() {
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [agent, setAgent] = useState(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [requestNotifications, setRequestNotifications] = useState(true);
  const [bidNotifications, setBidNotifications] = useState(true);
  const [shipmentNotifications, setShipmentNotifications] = useState(true);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const storedAgent = localStorage.getItem("clearingAgent");

    if (!storedAgent) {
      navigate("/agent-signin");
      return;
    }

    try {
      const parsedAgent = JSON.parse(storedAgent);

      if (parsedAgent.agentType !== "agency-member") {
        navigate("/agent-signin");
        return;
      }

      setAgent(parsedAgent);

      setFullName(
        parsedAgent.fullName ||
          parsedAgent.name ||
          parsedAgent.userName ||
          ""
      );

      setEmail(parsedAgent.email || "");
      setPhone(parsedAgent.phone || "");

      setProfilePhoto(
        parsedAgent.photo ||
          parsedAgent.profilePhoto ||
          parsedAgent.image ||
          ""
      );

      const savedNotifications = localStorage.getItem(
        "agentNotificationPreferences"
      );

      if (savedNotifications) {
        try {
          const preferences = JSON.parse(savedNotifications);

          setEmailNotifications(
            preferences.emailNotifications ?? true
          );

          setRequestNotifications(
            preferences.requestNotifications ?? true
          );

          setBidNotifications(
            preferences.bidNotifications ?? true
          );

          setShipmentNotifications(
            preferences.shipmentNotifications ?? true
          );
        } catch {
          // Ignore invalid notification settings.
        }
      }
    } catch {
      navigate("/agent-signin");
    }
  }, [navigate]);

  const agentName =
    fullName ||
    agent?.fullName ||
    agent?.name ||
    agent?.userName ||
    "Agency Member";

  const agencyName =
    agent?.agencyName ||
    agent?.agency?.name ||
    "Your Agency";

  const getInitials = (name) => {
    if (!name) return "AM";

    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Please choose an image smaller than 5MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const imageData = reader.result;

      setProfilePhoto(imageData);

      try {
        const storedAgent = localStorage.getItem("clearingAgent");

        if (storedAgent) {
          const parsedAgent = JSON.parse(storedAgent);

          const updatedAgent = {
            ...parsedAgent,
            photo: imageData,
            profilePhoto: imageData,
            image: imageData,
          };

          localStorage.setItem(
            "clearingAgent",
            JSON.stringify(updatedAgent)
          );

          setAgent(updatedAgent);

          window.dispatchEvent(
            new Event("agentProfileUpdated")
          );
        }
      } catch (error) {
        console.error("Error saving profile photo:", error);
      }
    };

    reader.readAsDataURL(file);

    event.target.value = "";
  };

  const handleRemovePhoto = () => {
    setProfilePhoto("");

    try {
      const storedAgent = localStorage.getItem("clearingAgent");

      if (storedAgent) {
        const parsedAgent = JSON.parse(storedAgent);

        const updatedAgent = {
          ...parsedAgent,
          photo: "",
          profilePhoto: "",
          image: "",
        };

        localStorage.setItem(
          "clearingAgent",
          JSON.stringify(updatedAgent)
        );

        setAgent(updatedAgent);

        window.dispatchEvent(
          new Event("agentProfileUpdated")
        );
      }
    } catch (error) {
      console.error("Error removing profile photo:", error);
    }
  };

  const handleSaveProfile = () => {
    setSaving(true);
    setSaved(false);

    try {
      const storedAgent = localStorage.getItem("clearingAgent");

      if (storedAgent) {
        const parsedAgent = JSON.parse(storedAgent);

        const updatedAgent = {
          ...parsedAgent,
          fullName,
          name: fullName,
          email,
          phone,
          photo: profilePhoto,
          profilePhoto: profilePhoto,
          image: profilePhoto,
        };

        localStorage.setItem(
          "clearingAgent",
          JSON.stringify(updatedAgent)
        );

        setAgent(updatedAgent);

        window.dispatchEvent(
          new Event("agentProfileUpdated")
        );
      }

      setTimeout(() => {
        setSaving(false);
        setSaved(true);

        setTimeout(() => {
          setSaved(false);
        }, 2500);
      }, 600);
    } catch {
      setSaving(false);
    }
  };

  const handleSaveNotifications = () => {
    setSaving(true);
    setSaved(false);

    const preferences = {
      emailNotifications,
      requestNotifications,
      bidNotifications,
      shipmentNotifications,
    };

    localStorage.setItem(
      "agentNotificationPreferences",
      JSON.stringify(preferences)
    );

    setTimeout(() => {
      setSaving(false);
      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2500);
    }, 600);
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return;
    }

    if (newPassword !== confirmPassword) {
      return;
    }

    setSaving(true);
    setSaved(false);

    setTimeout(() => {
      setSaving(false);
      setSaved(true);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        setSaved(false);
      }, 2500);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-900">
      {/* Shared Agent Member Sidebar */}
      <AgentMemberSidebar />

      {/* Main */}
      <main className="min-h-screen pt-[68px] lg:ml-[270px] lg:pt-0">
        {/* Header */}
        <header className="sticky top-[68px] z-30 flex h-[70px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:top-0">
          <div className="flex min-w-0 items-center gap-3">
            <div className="min-w-0">
              <p className="hidden text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 sm:block">
                Agency Member Workspace
              </p>

              <h1 className="text-base font-bold text-slate-800 sm:text-[17px]">
                Settings
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#2563EB]"
              title="Refresh"
            >
              <RefreshCw size={17} />
            </button>

            <button
              type="button"
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#2563EB]"
              title="Notifications"
            >
              <Bell size={17} />

              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#2563EB]" />
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="mx-auto max-w-[1180px] px-5 py-7 sm:px-8 lg:py-9">
          {/* Page Heading */}
          <div className="mb-8">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#2563EB]">
              <SettingsIcon size={17} strokeWidth={1.9} />
              <span>Account Settings</span>
            </div>

            <h2 className="text-[32px] font-bold tracking-[-0.04em] text-[#14213D] sm:text-[42px]">
              Settings
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-[15px]">
              Manage your agency member profile, notification preferences,
              and account security.
            </p>
          </div>

          {/* Saved Message */}
          {saved && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              <CheckCircle2 size={18} />
              <span>Your changes have been saved successfully.</span>
            </div>
          )}

          {/* Account Overview */}
          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)] sm:p-6">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  Account Information
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Update the information associated with your agency member
                  account.
                </p>
              </div>

              <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB] sm:flex">
                <User size={19} strokeWidth={1.8} />
              </div>
            </div>

            {/* Profile Photo */}
            <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#173563] text-2xl font-bold text-white shadow-sm">
                  {profilePhoto ? (
                    <img
                      src={profilePhoto}
                      alt={agentName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    getInitials(agentName)
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-slate-800">
                    Profile Photo
                  </h4>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Upload a professional photo for your agency member
                    account. This photo will also appear in the sidebar.
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <label
                      htmlFor="agentProfilePhoto"
                      className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#173563] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#10294d]"
                    >
                      <Upload size={15} />
                      {profilePhoto ? "Change Photo" : "Upload Photo"}
                    </label>

                    <input
                      id="agentProfilePhoto"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />

                    {profilePhoto && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                      >
                        Remove Photo
                      </button>
                    )}
                  </div>

                  <p className="mt-2 text-[11px] text-slate-400">
                    JPG, PNG, WEBP • Maximum 5MB
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Full Name
                </label>

                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-50"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-50"
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Phone Number
                </label>

                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-50"
                />
              </div>

              {/* Agency */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Agency
                </label>

                <div className="flex h-11 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5">
                  <Building2
                    size={17}
                    className="text-slate-400"
                    strokeWidth={1.8}
                  />

                  <span className="truncate text-sm font-medium text-slate-600">
                    {agencyName}
                  </span>

                  <span className="ml-auto rounded-lg bg-blue-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-[#2563EB]">
                    Member
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173563] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#10294d] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={17} />

                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </section>

          {/* Agency Information */}
          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)] sm:p-6">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  Agency Information
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Information about the agency you are currently working with.
                </p>
              </div>

              <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB] sm:flex">
                <Building2 size={19} strokeWidth={1.8} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <InfoCard
                label="Agency Name"
                value={agencyName}
              />

              <InfoCard
                label="Account Type"
                value="Agency Member"
              />

              <InfoCard
                label="Access Level"
                value="Member Access"
              />
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
              <ShieldCheck
                size={19}
                className="mt-0.5 shrink-0 text-[#2563EB]"
                strokeWidth={1.8}
              />

              <div>
                <p className="text-sm font-bold text-slate-800">
                  Agency-managed account
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Your agency membership and organization-level permissions
                  are managed by the agency administrator.
                </p>
              </div>
            </div>
          </section>

          {/* Notification Settings */}
          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)] sm:p-6">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  Notification Preferences
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Choose which updates you want to receive while working on
                  SME requests and shipments.
                </p>
              </div>

              <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB] sm:flex">
                <Bell size={19} strokeWidth={1.8} />
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              <NotificationRow
                title="Email Notifications"
                description="Receive important account and platform updates by email."
                checked={emailNotifications}
                onChange={() =>
                  setEmailNotifications(!emailNotifications)
                }
              />

              <NotificationRow
                title="New SME Requests"
                description="Get notified when new import requests become available."
                checked={requestNotifications}
                onChange={() =>
                  setRequestNotifications(!requestNotifications)
                }
              />

              <NotificationRow
                title="Bid Updates"
                description="Receive updates when your submitted bids change status."
                checked={bidNotifications}
                onChange={() =>
                  setBidNotifications(!bidNotifications)
                }
              />

              <NotificationRow
                title="Shipment Updates"
                description="Receive important updates about your active shipments."
                checked={shipmentNotifications}
                onChange={() =>
                  setShipmentNotifications(!shipmentNotifications)
                }
              />
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleSaveNotifications}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173563] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#10294d] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={17} />

                {saving ? "Saving..." : "Save Preferences"}
              </button>
            </div>
          </section>

          {/* Security */}
          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)] sm:p-6">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  Security
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Keep your agency member account secure by updating your
                  password regularly.
                </p>
              </div>

              <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB] sm:flex">
                <ShieldCheck size={19} strokeWidth={1.8} />
              </div>
            </div>

            <div className="grid gap-5">
              <PasswordInput
                id="currentPassword"
                label="Current Password"
                value={currentPassword}
                onChange={setCurrentPassword}
                showPassword={showCurrentPassword}
                onToggle={() =>
                  setShowCurrentPassword(!showCurrentPassword)
                }
              />

              <div className="grid gap-5 md:grid-cols-2">
                <PasswordInput
                  id="newPassword"
                  label="New Password"
                  value={newPassword}
                  onChange={setNewPassword}
                  showPassword={showNewPassword}
                  onToggle={() =>
                    setShowNewPassword(!showNewPassword)
                  }
                />

                <PasswordInput
                  id="confirmPassword"
                  label="Confirm New Password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  showPassword={showConfirmPassword}
                  onToggle={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                />
              </div>
            </div>

            {newPassword &&
              confirmPassword &&
              newPassword !== confirmPassword && (
                <p className="mt-3 text-xs font-semibold text-red-500">
                  New passwords do not match.
                </p>
              )}

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleChangePassword}
                disabled={
                  saving ||
                  !currentPassword ||
                  !newPassword ||
                  !confirmPassword ||
                  newPassword !== confirmPassword
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-[#2563EB] hover:bg-blue-50 hover:text-[#2563EB] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShieldCheck size={17} />

                {saving ? "Updating..." : "Update Password"}
              </button>
            </div>
          </section>

          {/* Account Role */}
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)] sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
                  <Users size={20} strokeWidth={1.8} />
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    Agency Member Account
                  </h3>

                  <p className="mt-1 max-w-xl text-sm leading-5 text-slate-500">
                    You are signed in as a member of {agencyName}. Agency
                    membership permissions are controlled by your
                    administrator.
                  </p>
                </div>
              </div>

              <div className="shrink-0">
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Active
                </span>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="border-t border-slate-200 pt-6 text-center">
            <p className="text-xs text-slate-400">
              ImportEase Agent Platform
            </p>

            <p className="mt-1 text-[11px] text-slate-400">
              Manage your agency work securely and efficiently.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---------------------------------------------
   Info Card
--------------------------------------------- */

function InfoCard({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">
        {label}
      </p>

      <p className="mt-2 truncate text-sm font-bold text-slate-800">
        {value}
      </p>
    </div>
  );
}

/* ---------------------------------------------
   Notification Row
--------------------------------------------- */

function NotificationRow({
  title,
  description,
  checked,
  onChange,
}) {
  return (
    <div className="flex items-center justify-between gap-5 py-4">
      <div className="min-w-0">
        <p className="text-sm font-bold text-slate-800">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-[#2563EB]" : "bg-slate-200"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

/* ---------------------------------------------
   Password Input
--------------------------------------------- */

function PasswordInput({
  id,
  label,
  value,
  onChange,
  showPassword,
  onToggle,
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter password"
          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 pr-11 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-50"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"
          aria-label={
            showPassword ? "Hide password" : "Show password"
          }
        >
          {showPassword ? (
            <EyeOff size={17} />
          ) : (
            <Eye size={17} />
          )}
        </button>
      </div>
    </div>
  );
}

export default AgentSettings;
