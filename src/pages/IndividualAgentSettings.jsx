import { useEffect, useState } from "react";
import {
  Bell,
  Camera,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import IndividualAgentSidebar from "../components/IndividualAgentSidebar";

function getStoredAgent() {
  try {
    const storedAgent = localStorage.getItem("clearingAgent");

    if (storedAgent) {
      const parsedAgent = JSON.parse(storedAgent);

      return {
        ...parsedAgent,
        name:
          parsedAgent.name ||
          parsedAgent.fullName ||
          parsedAgent.userName ||
          "Individual Agent",
        email: parsedAgent.email || "",
        phone: parsedAgent.phone || "",
        photo:
          parsedAgent.photo ||
          parsedAgent.profilePhoto ||
          parsedAgent.image ||
          "",
      };
    }
  } catch (error) {
    console.error("Failed to load individual agent:", error);
  }

  return {
    name: "Individual Agent",
    email: "",
    phone: "",
    photo: "",
  };
}

function getInitials(name) {
  if (!name) return "IA";

  const words = name.trim().split(/\s+/);

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return (
    words[0].charAt(0) +
    words[words.length - 1].charAt(0)
  ).toUpperCase();
}

function IndividualAgentSettings() {
  const [agent, setAgent] = useState(getStoredAgent);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [shipmentNotifications, setShipmentNotifications] = useState(true);
  const [newRequestNotifications, setNewRequestNotifications] =
    useState(true);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");

  useEffect(() => {
    const savedAgent = getStoredAgent();

    setAgent(savedAgent);
    setName(savedAgent.name || "");
    setEmail(savedAgent.email || "");
    setPhone(savedAgent.phone || "");

    const savedNotifications = localStorage.getItem(
      "individualAgentNotifications"
    );

    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);

        setEmailNotifications(
          parsed.emailNotifications !== false
        );

        setShipmentNotifications(
          parsed.shipmentNotifications !== false
        );

        setNewRequestNotifications(
          parsed.newRequestNotifications !== false
        );
      } catch {
        // Keep default notification settings.
      }
    }
  }, []);

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setProfileMessage("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setProfileMessage("Profile photo must be smaller than 5MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const photo = reader.result;

      const updatedAgent = {
        ...agent,
        name,
        fullName: name,
        email,
        phone,
        photo,
        profilePhoto: photo,
      };

      setAgent(updatedAgent);
      localStorage.setItem(
        "clearingAgent",
        JSON.stringify(updatedAgent)
      );

      window.dispatchEvent(
        new Event("individualAgentProfileUpdated")
      );

      setProfileMessage("Profile photo updated successfully.");
    };

    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (event) => {
    event.preventDefault();

    if (!name.trim()) {
      setProfileMessage("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setProfileMessage("Please enter your email address.");
      return;
    }

    const updatedAgent = {
      ...agent,
      name: name.trim(),
      fullName: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
    };

    setAgent(updatedAgent);

    localStorage.setItem(
      "clearingAgent",
      JSON.stringify(updatedAgent)
    );

    window.dispatchEvent(
      new Event("individualAgentProfileUpdated")
    );

    setProfileMessage("Profile information saved successfully.");

    setTimeout(() => {
      setProfileMessage("");
    }, 3000);
  };

  const handleSaveNotifications = () => {
    const notificationSettings = {
      emailNotifications,
      shipmentNotifications,
      newRequestNotifications,
    };

    localStorage.setItem(
      "individualAgentNotifications",
      JSON.stringify(notificationSettings)
    );

    setNotificationMessage(
      "Notification preferences saved successfully."
    );

    setTimeout(() => {
      setNotificationMessage("");
    }, 3000);
  };

  const handleChangePassword = (event) => {
    event.preventDefault();

    setPasswordMessage("");

    if (!currentPassword) {
      setPasswordMessage("Please enter your current password.");
      return;
    }

    if (!newPassword) {
      setPasswordMessage("Please enter a new password.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage(
        "New password must be at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage("New passwords do not match.");
      return;
    }

    /*
      Frontend demo:
      Password changes are stored locally for this project.
      Replace this section with your Flask API later.
    */
    localStorage.setItem("individualAgentPassword", newPassword);

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setPasswordMessage("Password changed successfully.");

    setTimeout(() => {
      setPasswordMessage("");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-[#173563]">
      {/* =====================================================
          SHARED SIDEBAR
      ===================================================== */}
      <IndividualAgentSidebar />

      {/* =====================================================
          MAIN
      ===================================================== */}
      <main className="min-h-screen pt-[68px] lg:ml-[260px] lg:pt-0">
        {/* =====================================================
            HEADER
        ===================================================== */}
        <header className="sticky top-[68px] z-30 flex h-[70px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:top-0">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
              Individual Agent Workspace
            </p>

            <h1 className="mt-0.5 text-base font-bold text-slate-800">
              Settings
            </h1>
          </div>
        </header>

        {/* =====================================================
            CONTENT
        ===================================================== */}
        <div className="mx-auto max-w-[1100px] px-5 py-7 sm:px-8 lg:py-9">
          {/* PAGE INTRO */}
          <section className="mb-7">
            <p className="text-sm font-semibold text-[#2563EB]">
              Account preferences
            </p>

            <h2 className="mt-1 text-[32px] font-bold tracking-[-0.04em] text-[#14213D] sm:text-[40px]">
              Settings
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-[15px]">
              Manage your individual agent profile, security and
              notification preferences.
            </p>
          </section>

          {/* =====================================================
              PROFILE CARD
          ===================================================== */}
          <section className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,.02)]">
            <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
                  <UserRound size={19} />
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#173563]">
                    Profile Information
                  </h3>

                  <p className="mt-0.5 text-xs text-slate-400">
                    Update your individual agent account details.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="p-5 sm:p-6">
              {/* PROFILE PHOTO */}
              <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative">
                  <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-[#173563] text-xl font-bold text-white shadow-sm">
                    {agent.photo ? (
                      <img
                        src={agent.photo}
                        alt={agent.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      getInitials(name || agent.name)
                    )}
                  </div>

                  <label
                    htmlFor="agent-profile-photo"
                    className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-[#2563EB] text-white shadow-sm transition hover:bg-[#1d4ed8]"
                  >
                    <Camera size={15} />

                    <input
                      id="agent-profile-photo"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    Profile Photo
                  </h4>

                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    Upload a professional photo for your agent
                    profile.
                  </p>

                  <p className="mt-1 text-[11px] text-slate-400">
                    JPG, PNG or WEBP. Maximum 5MB.
                  </p>
                </div>
              </div>

              {/* FORM */}
              <div className="grid gap-5 md:grid-cols-2">
                {/* NAME */}
                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-600">
                    Full Name
                  </label>

                  <div className="relative">
                    <UserRound
                      size={17}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      value={name}
                      onChange={(event) =>
                        setName(event.target.value)
                      }
                      placeholder="Enter your full name"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                {/* EMAIL */}
                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-600">
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      size={17}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      placeholder="Enter your email"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                {/* PHONE */}
                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-600">
                    Phone Number
                  </label>

                  <div className="relative">
                    <Phone
                      size={17}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="tel"
                      value={phone}
                      onChange={(event) =>
                        setPhone(event.target.value)
                      }
                      placeholder="Enter your phone number"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                {/* ROLE */}
                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-600">
                    Account Type
                  </label>

                  <div className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4">
                    <ShieldCheck
                      size={17}
                      className="text-[#2563EB]"
                    />

                    <span className="text-sm font-semibold text-slate-600">
                      Individual Clearing Agent
                    </span>
                  </div>
                </div>
              </div>

              {/* MESSAGE */}
              {profileMessage && (
                <div
                  className={`mt-5 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium ${
                    profileMessage.includes("successfully")
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {profileMessage.includes("successfully") && (
                    <CheckCircle2 size={17} />
                  )}

                  <span>{profileMessage}</span>
                </div>
              )}

              {/* SAVE */}
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#173563] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#10294d]"
                >
                  <Save size={16} />
                  Save Changes
                </button>
              </div>
            </form>
          </section>

          {/* =====================================================
              NOTIFICATIONS
          ===================================================== */}
          <section className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,.02)]">
            <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
                  <Bell size={19} />
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#173563]">
                    Notifications
                  </h3>

                  <p className="mt-0.5 text-xs text-slate-400">
                    Choose which updates you want to receive.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <NotificationToggle
                title="Email Notifications"
                description="Receive important account updates by email."
                enabled={emailNotifications}
                onChange={setEmailNotifications}
              />

              <NotificationToggle
                title="Shipment Updates"
                description="Get notified when your assigned shipments change status."
                enabled={shipmentNotifications}
                onChange={setShipmentNotifications}
              />

              <NotificationToggle
                title="New SME Requests"
                description="Receive notifications when new requests are available."
                enabled={newRequestNotifications}
                onChange={setNewRequestNotifications}
                last
              />

              {notificationMessage && (
                <div className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                  <CheckCircle2 size={17} />
                  <span>{notificationMessage}</span>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveNotifications}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#173563] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#10294d]"
                >
                  <Save size={16} />
                  Save Preferences
                </button>
              </div>
            </div>
          </section>

          {/* =====================================================
              SECURITY
          ===================================================== */}
          <section className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,.02)]">
            <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <LockKeyhole size={19} />
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#173563]">
                    Security
                  </h3>

                  <p className="mt-0.5 text-xs text-slate-400">
                    Keep your individual agent account secure.
                  </p>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleChangePassword}
              className="p-5 sm:p-6"
            >
              <div className="grid gap-5 md:grid-cols-3">
                {/* CURRENT PASSWORD */}
                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-600">
                    Current Password
                  </label>

                  <div className="relative">
                    <input
                      type={
                        showCurrentPassword ? "text" : "password"
                      }
                      value={currentPassword}
                      onChange={(event) =>
                        setCurrentPassword(event.target.value)
                      }
                      placeholder="Current password"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pr-11 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(
                          !showCurrentPassword
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                    >
                      {showCurrentPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  </div>
                </div>

                {/* NEW PASSWORD */}
                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-600">
                    New Password
                  </label>

                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(event) =>
                        setNewPassword(event.target.value)
                      }
                      placeholder="New password"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pr-11 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowNewPassword(!showNewPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                    >
                      {showNewPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  </div>
                </div>

                {/* CONFIRM PASSWORD */}
                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-600">
                    Confirm Password
                  </label>

                  <div className="relative">
                    <input
                      type={
                        showConfirmPassword ? "text" : "password"
                      }
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      placeholder="Confirm password"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pr-11 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {passwordMessage && (
                <div
                  className={`mt-5 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium ${
                    passwordMessage.includes("successfully")
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {passwordMessage.includes("successfully") && (
                    <CheckCircle2 size={17} />
                  )}

                  <span>{passwordMessage}</span>
                </div>
              )}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-slate-400">
                  Use at least 6 characters for your new password.
                </p>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173563] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#10294d]"
                >
                  <LockKeyhole size={16} />
                  Change Password
                </button>
              </div>
            </form>
          </section>

          {/* =====================================================
              ACCOUNT STATUS
          ===================================================== */}
          <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                <ShieldCheck size={20} />
              </div>

              <div>
                <h3 className="text-sm font-bold text-emerald-800">
                  Individual Agent Account
                </h3>

                <p className="mt-1 text-xs leading-5 text-emerald-700">
                  Your account is configured as an independent clearing
                  agent. You can browse SME requests, submit bids and
                  manage assigned shipments.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

/* ============================================================
   NOTIFICATION TOGGLE
============================================================ */
function NotificationToggle({
  title,
  description,
  enabled,
  onChange,
  last = false,
}) {
  return (
    <div
      className={`flex items-center justify-between gap-5 py-4 ${
        !last ? "border-b border-slate-100" : ""
      }`}
    >
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-700">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-400">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled ? "bg-[#2563EB]" : "bg-slate-300"
        }`}
        aria-label={`Toggle ${title}`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

export default IndividualAgentSettings;
