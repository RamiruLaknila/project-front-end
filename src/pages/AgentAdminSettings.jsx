import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  Building2,
  Check,
  CheckCircle2,
  Copy,
  KeyRound,
  RefreshCw,
  ShieldCheck,
  User,
  Users,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  AlertTriangle,
  Camera,
  Upload,
  Trash2,
} from "lucide-react";

import AgentAdminSidebar from "../components/AgentAdminSidebar";

function AgentAdminSettings() {
  const [agency, setAgency] = useState(null);
  const [admin, setAdmin] = useState(null);

  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const [notifications, setNotifications] = useState({
    smeRequests: true,
    agentRequests: true,
    bids: true,
    shipments: true,
    system: true,
  });

  const [agencyForm, setAgencyForm] = useState({
    agencyName: "",
    registrationNumber: "",
    licenseNumber: "",
    email: "",
    phone: "",
    address: "",
  });

  const [adminForm, setAdminForm] = useState({
    name: "",
    email: "",
    phone: "",
    photo: "",
  });

  const [inviteCode, setInviteCode] = useState("");

  /* ============================================================
     LOAD DATA
  ============================================================ */

  useEffect(() => {
    const storedAgency = localStorage.getItem("clearingAgency");
    const storedAdmin = localStorage.getItem("clearingAgent");

    if (storedAgency) {
      try {
        const parsedAgency = JSON.parse(storedAgency);

        setAgency(parsedAgency);

        setAgencyForm({
          agencyName:
            parsedAgency.agencyName ||
            parsedAgency.name ||
            "",

          registrationNumber:
            parsedAgency.registrationNumber ||
            parsedAgency.businessRegistrationNumber ||
            "",

          licenseNumber:
            parsedAgency.licenseNumber ||
            parsedAgency.license ||
            "",

          email:
            parsedAgency.email ||
            parsedAgency.agencyEmail ||
            "",

          phone:
            parsedAgency.phone ||
            parsedAgency.agencyPhone ||
            "",

          address: parsedAgency.address || "",
        });

        const storedInviteCode =
          localStorage.getItem("agencyInviteCode");

        const generatedCode =
          "IMP-" +
          Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase();

        setInviteCode(
          parsedAgency.inviteCode ||
            parsedAgency.agencyCode ||
            storedInviteCode ||
            generatedCode
        );
      } catch (error) {
        console.error(
          "Unable to load agency information:",
          error
        );
      }
    } else {
      const storedInviteCode =
        localStorage.getItem("agencyInviteCode");

      const generatedCode =
        "IMP-" +
        Math.random()
          .toString(36)
          .substring(2, 8)
          .toUpperCase();

      setInviteCode(
        storedInviteCode || generatedCode
      );
    }

    if (storedAdmin) {
      try {
        const parsedAdmin = JSON.parse(storedAdmin);

        setAdmin(parsedAdmin);

        setAdminForm({
          name:
            parsedAdmin.name ||
            parsedAdmin.fullName ||
            "",

          email: parsedAdmin.email || "",

          phone: parsedAdmin.phone || "",

          photo:
            parsedAdmin.photo ||
            parsedAdmin.profilePhoto ||
            parsedAdmin.avatar ||
            "",
        });
      } catch (error) {
        console.error(
          "Unable to load administrator information:",
          error
        );
      }
    }

    const storedNotifications =
      localStorage.getItem(
        "agentAdminNotificationPreferences"
      );

    if (storedNotifications) {
      try {
        const parsedNotifications =
          JSON.parse(storedNotifications);

        setNotifications({
          smeRequests:
            parsedNotifications.smeRequests ?? true,

          agentRequests:
            parsedNotifications.agentRequests ?? true,

          bids:
            parsedNotifications.bids ?? true,

          shipments:
            parsedNotifications.shipments ?? true,

          system:
            parsedNotifications.system ?? true,
        });
      } catch (error) {
        console.error(
          "Unable to load notification preferences:",
          error
        );
      }
    }
  }, []);

  /* ============================================================
     COPY INVITE CODE
  ============================================================ */

  const handleCopyCode = async () => {
    if (!inviteCode) return;

    try {
      await navigator.clipboard.writeText(inviteCode);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(
        "Unable to copy invite code:",
        error
      );
    }
  };

  /* ============================================================
     REGENERATE INVITE CODE
  ============================================================ */

  const handleRegenerateCode = () => {
    const newCode =
      "IMP-" +
      Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();

    setInviteCode(newCode);

    localStorage.setItem(
      "agencyInviteCode",
      newCode
    );

    const storedAgency =
      localStorage.getItem("clearingAgency");

    if (storedAgency) {
      try {
        const parsedAgency =
          JSON.parse(storedAgency);

        const updatedAgency = {
          ...parsedAgency,
          inviteCode: newCode,
          agencyCode: newCode,
        };

        localStorage.setItem(
          "clearingAgency",
          JSON.stringify(updatedAgency)
        );

        setAgency(updatedAgency);
      } catch (error) {
        console.error(
          "Unable to update invite code:",
          error
        );
      }
    }
  };

  /* ============================================================
     FORM CHANGES
  ============================================================ */

  const handleAgencyChange = (field, value) => {
    setAgencyForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleAdminChange = (field, value) => {
    setAdminForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  /* ============================================================
     ADMIN PHOTO UPLOAD
  ============================================================ */

  const handleAdminPhotoUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Please select an image smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const imageData = reader.result;

      setAdminForm((previous) => ({
        ...previous,
        photo: imageData,
      }));
    };

    reader.onerror = () => {
      alert("Unable to upload the selected image.");
    };

    reader.readAsDataURL(file);
  };

  /* ============================================================
     REMOVE ADMIN PHOTO
  ============================================================ */

  const handleRemoveAdminPhoto = () => {
    setAdminForm((previous) => ({
      ...previous,
      photo: "",
    }));
  };

  /* ============================================================
     NOTIFICATION CHANGES
  ============================================================ */

  const handleNotificationChange = (field) => {
    setNotifications((previous) => {
      const updated = {
        ...previous,
        [field]: !previous[field],
      };

      localStorage.setItem(
        "agentAdminNotificationPreferences",
        JSON.stringify(updated)
      );

      return updated;
    });
  };

  /* ============================================================
     SAVE CHANGES
  ============================================================ */

  const handleSaveChanges = () => {
    const storedAgency =
      localStorage.getItem("clearingAgency");

    const storedAdmin =
      localStorage.getItem("clearingAgent");

    if (storedAgency) {
      try {
        const parsedAgency =
          JSON.parse(storedAgency);

        const updatedAgency = {
          ...parsedAgency,

          agencyName:
            agencyForm.agencyName,

          name:
            agencyForm.agencyName,

          registrationNumber:
            agencyForm.registrationNumber,

          businessRegistrationNumber:
            agencyForm.registrationNumber,

          licenseNumber:
            agencyForm.licenseNumber,

          email:
            agencyForm.email,

          agencyEmail:
            agencyForm.email,

          phone:
            agencyForm.phone,

          agencyPhone:
            agencyForm.phone,

          address:
            agencyForm.address,

          inviteCode,
          agencyCode: inviteCode,
        };

        localStorage.setItem(
          "clearingAgency",
          JSON.stringify(updatedAgency)
        );

        setAgency(updatedAgency);
      } catch (error) {
        console.error(
          "Unable to save agency:",
          error
        );
      }
    }

    if (storedAdmin) {
      try {
        const parsedAdmin =
          JSON.parse(storedAdmin);

        const updatedAdmin = {
          ...parsedAdmin,

          name:
            adminForm.name,

          fullName:
            adminForm.name,

          email:
            adminForm.email,

          phone:
            adminForm.phone,

          photo:
            adminForm.photo,

          profilePhoto:
            adminForm.photo,
        };

        localStorage.setItem(
          "clearingAgent",
          JSON.stringify(updatedAdmin)
        );

        setAdmin(updatedAdmin);

        /*
         * Tell the reusable admin sidebar that
         * administrator information changed.
         */
        window.dispatchEvent(
          new Event("adminProfileUpdated")
        );
      } catch (error) {
        console.error(
          "Unable to save administrator:",
          error
        );
      }
    }

    localStorage.setItem(
      "agentAdminNotificationPreferences",
      JSON.stringify(notifications)
    );

    localStorage.setItem(
      "agencyInviteCode",
      inviteCode
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-900">

      {/* =====================================================
          SHARED ADMIN SIDEBAR
      ====================================================== */}

      <AgentAdminSidebar />

      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="min-h-screen lg:ml-[260px]">

        {/* HEADER */}

        <header className="sticky top-0 z-30 flex h-[70px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">

          <div className="flex items-center gap-3">

            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
                Agency Workspace
              </p>

              <h1 className="text-base font-bold text-slate-800">
                Administrator Settings
              </h1>
            </div>

          </div>

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
              title="Refresh"
            >
              <RefreshCw
                size={18}
                strokeWidth={1.8}
              />
            </button>

            <button
              type="button"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
              title="Notifications"
            >
              <Bell
                size={18}
                strokeWidth={1.8}
              />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-500" />
            </button>

          </div>

        </header>

        {/* =====================================================
            CONTENT
        ====================================================== */}

        <div className="mx-auto max-w-[1180px] px-5 py-7 sm:px-8 lg:py-9">

          {/* BACK */}

          <Link
            to="/agent-admin-dashboard"
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#173563]"
          >
            <ArrowLeft
              size={16}
              strokeWidth={1.8}
            />

            Agency Dashboard
          </Link>

          {/* PAGE HEADER */}

          <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <h2 className="text-[32px] font-bold tracking-[-0.04em] text-[#14213D] sm:text-[42px]">
                Settings
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-[15px]">
                Manage your agency information,
                administrator profile, member access,
                notifications and security preferences.
              </p>

            </div>

            <button
              type="button"
              onClick={handleSaveChanges}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173563] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#10294d]"
            >
              {saved ? (
                <>
                  <CheckCircle2
                    size={17}
                    strokeWidth={1.8}
                  />

                  Saved
                </>
              ) : (
                <>
                  <Check
                    size={17}
                    strokeWidth={1.8}
                  />

                  Save Changes
                </>
              )}
            </button>

          </div>

          {/* =====================================================
              AGENCY INFORMATION
          ====================================================== */}

          <section className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,.02)]">

            <SectionHeader
              icon={Building2}
              title="Agency Information"
              description="Update the official information associated with your clearing agency."
            />

            <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-6">

              <FormField
                label="Agency Name"
                value={agencyForm.agencyName}
                placeholder="Enter agency name"
                onChange={(value) =>
                  handleAgencyChange(
                    "agencyName",
                    value
                  )
                }
              />

              <FormField
                label="Business Registration Number"
                value={
                  agencyForm.registrationNumber
                }
                placeholder="Enter registration number"
                onChange={(value) =>
                  handleAgencyChange(
                    "registrationNumber",
                    value
                  )
                }
              />

              <FormField
                label="Clearing Agent License Number"
                value={agencyForm.licenseNumber}
                placeholder="Enter license number"
                onChange={(value) =>
                  handleAgencyChange(
                    "licenseNumber",
                    value
                  )
                }
              />

              <FormField
                label="Agency Email"
                icon={Mail}
                type="email"
                value={agencyForm.email}
                placeholder="agency@example.com"
                onChange={(value) =>
                  handleAgencyChange(
                    "email",
                    value
                  )
                }
              />

              <FormField
                label="Agency Phone"
                icon={Phone}
                type="tel"
                value={agencyForm.phone}
                placeholder="+94 XX XXX XXXX"
                onChange={(value) =>
                  handleAgencyChange(
                    "phone",
                    value
                  )
                }
              />

              <FormField
                label="Agency Address"
                icon={MapPin}
                value={agencyForm.address}
                placeholder="Enter agency address"
                onChange={(value) =>
                  handleAgencyChange(
                    "address",
                    value
                  )
                }
              />

            </div>

            <div className="mx-5 mb-5 flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 sm:mx-6 sm:mb-6">

              <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" />

              <div>

                <p className="text-sm font-semibold text-emerald-800">
                  Agency Active
                </p>

                <p className="mt-0.5 text-xs text-emerald-700">
                  Your agency is currently active on ImportEase.
                </p>

              </div>

            </div>

          </section>

          {/* =====================================================
              ADMINISTRATOR PROFILE
          ====================================================== */}

          <section className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,.02)]">

            <SectionHeader
              icon={User}
              title="Administrator Profile"
              description="Manage the profile of the person responsible for this agency."
            />

            <div className="p-5 sm:p-6">

              {/* ADMIN PHOTO */}

              <div className="mb-7 rounded-2xl border border-slate-200 bg-slate-50 p-5">

                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

                  {/* PHOTO PREVIEW */}

                  <div className="relative shrink-0">

                    {adminForm.photo ? (
                      <img
                        src={adminForm.photo}
                        alt={
                          adminForm.name ||
                          "Administrator"
                        }
                        className="h-24 w-24 rounded-2xl object-cover ring-4 ring-white shadow-sm"
                      />
                    ) : (
                      <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-[#173563] text-2xl font-bold text-white ring-4 ring-white shadow-sm">
                        {getInitials(
                          adminForm.name ||
                            "Administrator"
                        )}
                      </div>
                    )}

                    {adminForm.photo && (
                      <button
                        type="button"
                        onClick={handleRemoveAdminPhoto}
                        className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border border-red-100 bg-white text-red-500 shadow-sm transition hover:bg-red-50"
                        title="Remove photo"
                      >
                        <Trash2
                          size={14}
                          strokeWidth={2}
                        />
                      </button>
                    )}

                  </div>

                  {/* PHOTO INFORMATION */}

                  <div className="min-w-0 flex-1">

                    <div className="flex items-center gap-2">

                      <Camera
                        size={17}
                        strokeWidth={1.8}
                        className="text-[#173563]"
                      />

                      <h3 className="text-sm font-bold text-slate-900">
                        Administrator Photo
                      </h3>

                    </div>

                    <p className="mt-1 max-w-xl text-sm leading-5 text-slate-500">
                      Upload a profile photo so agency members
                      can easily identify the administrator.
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-3">

                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#173563] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#10294d]">

                        <Upload
                          size={16}
                          strokeWidth={1.8}
                        />

                        {adminForm.photo
                          ? "Change Photo"
                          : "Upload Photo"}

                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={
                            handleAdminPhotoUpload
                          }
                        />

                      </label>

                      {adminForm.photo && (
                        <button
                          type="button"
                          onClick={
                            handleRemoveAdminPhoto
                          }
                          className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                        >

                          <Trash2
                            size={16}
                            strokeWidth={1.8}
                          />

                          Remove

                        </button>
                      )}

                    </div>

                    <p className="mt-2 text-xs text-slate-400">
                      JPG, JPEG, PNG or other image formats • Maximum 5 MB
                    </p>

                  </div>

                </div>

              </div>

              {/* ADMIN FORM */}

              <div className="grid gap-6 sm:grid-cols-2">

                <FormField
                  label="Administrator Name"
                  value={adminForm.name}
                  placeholder="Enter your name"
                  onChange={(value) =>
                    handleAdminChange(
                      "name",
                      value
                    )
                  }
                />

                <FormField
                  label="Email Address"
                  type="email"
                  value={adminForm.email}
                  placeholder="Enter your email"
                  onChange={(value) =>
                    handleAdminChange(
                      "email",
                      value
                    )
                  }
                />

                <FormField
                  label="Phone Number"
                  type="tel"
                  value={adminForm.phone}
                  placeholder="+94 XX XXX XXXX"
                  onChange={(value) =>
                    handleAdminChange(
                      "phone",
                      value
                    )
                  }
                />

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Role
                  </label>

                  <div className="flex h-11 items-center rounded-xl border border-slate-200 bg-slate-50 px-3.5">

                    <span className="text-sm font-medium text-slate-600">
                      Agency Administrator
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </section>

          {/* =====================================================
              AGENCY MANAGEMENT
          ====================================================== */}

          <section className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,.02)]">

            <SectionHeader
              icon={Users}
              title="Agency Management"
              description="Manage how agents join and access your agency."
            />

            <div className="p-5 sm:p-6">

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                  <div>

                    <div className="mb-2 flex items-center gap-2">

                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                        <Users
                          size={18}
                          strokeWidth={1.8}
                        />

                      </div>

                      <h3 className="text-lg font-bold text-slate-900">
                        Agency Invitation Code
                      </h3>

                    </div>

                    <p className="text-sm leading-6 text-slate-500">
                      Share this code with clearing agents
                      who want to join your agency.
                    </p>

                  </div>

                  <div className="flex items-center gap-2">

                    <div className="rounded-xl border border-slate-200 bg-white px-5 py-3">

                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Invite Code
                      </p>

                      <p className="mt-1 text-xl font-bold tracking-[0.2em] text-[#173563]">
                        {inviteCode || "IMP-------"}
                      </p>

                    </div>

                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="flex h-[70px] w-[48px] items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-[#173563]"
                      title="Copy invitation code"
                    >
                      {copied ? (
                        <CheckCircle2
                          size={20}
                          strokeWidth={1.8}
                        />
                      ) : (
                        <Copy
                          size={20}
                          strokeWidth={1.8}
                        />
                      )}
                    </button>

                  </div>

                </div>

                <div className="mt-5 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">

                  <p className="text-sm text-slate-500">
                    Regenerating the code creates a new
                    code for future agent registrations.
                  </p>

                  <button
                    type="button"
                    onClick={handleRegenerateCode}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#2563EB] transition hover:text-blue-700"
                  >
                    <RefreshCw
                      size={16}
                      strokeWidth={1.8}
                    />

                    Regenerate Code
                  </button>

                </div>

              </div>

              <Link
                to="/agency-agents"
                className="mt-5 flex items-center justify-between rounded-xl border border-slate-200 px-4 py-4 transition hover:border-blue-200 hover:bg-blue-50/40"
              >

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                    <Users
                      size={19}
                      strokeWidth={1.8}
                    />

                  </div>

                  <div>

                    <p className="text-sm font-bold text-slate-800">
                      Manage Agency Agents
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Approve, reject and manage agency members.
                    </p>

                  </div>

                </div>

                <ChevronRight
                  size={18}
                  strokeWidth={1.8}
                  className="text-slate-400"
                />

              </Link>

            </div>

          </section>

          {/* =====================================================
              NOTIFICATIONS
          ====================================================== */}

          <section className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,.02)]">

            <SectionHeader
              icon={Bell}
              title="Notifications"
              description="Choose which agency activities you want to be notified about."
            />

            <div className="divide-y divide-slate-100">

              <NotificationRow
                title="New SME Requests"
                description="Receive notifications when SMEs send new requests to your agency."
                enabled={notifications.smeRequests}
                onChange={() =>
                  handleNotificationChange(
                    "smeRequests"
                  )
                }
              />

              <NotificationRow
                title="Agent Join Requests"
                description="Receive notifications when an agent requests to join your agency."
                enabled={notifications.agentRequests}
                onChange={() =>
                  handleNotificationChange(
                    "agentRequests"
                  )
                }
              />

              <NotificationRow
                title="Bid Activity"
                description="Receive updates about bids and quotation activity."
                enabled={notifications.bids}
                onChange={() =>
                  handleNotificationChange(
                    "bids"
                  )
                }
              />

              <NotificationRow
                title="Shipment Updates"
                description="Receive important updates related to active shipments."
                enabled={notifications.shipments}
                onChange={() =>
                  handleNotificationChange(
                    "shipments"
                  )
                }
              />

              <NotificationRow
                title="System Notifications"
                description="Receive important ImportEase system and account notifications."
                enabled={notifications.system}
                onChange={() =>
                  handleNotificationChange(
                    "system"
                  )
                }
              />

            </div>

          </section>

          {/* =====================================================
              SECURITY
          ====================================================== */}

          <section className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,.02)]">

            <SectionHeader
              icon={ShieldCheck}
              title="Security"
              description="Manage your administrator account security."
            />

            <div className="p-5 sm:p-6">

              <button
                type="button"
                onClick={() =>
                  alert(
                    "Password change will be connected to the backend later."
                  )
                }
                className="flex w-full items-center justify-between rounded-xl border border-slate-200 p-4 text-left transition hover:border-blue-200 hover:bg-blue-50/40"
              >

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">

                    <KeyRound
                      size={18}
                      strokeWidth={1.8}
                    />

                  </div>

                  <div>

                    <p className="text-sm font-bold text-slate-800">
                      Change Password
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Update your administrator account password.
                    </p>

                  </div>

                </div>

                <ChevronRight
                  size={18}
                  strokeWidth={1.8}
                  className="text-slate-400"
                />

              </button>

              <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 p-4">

                <div className="flex gap-3">

                  <ShieldCheck
                    size={19}
                    strokeWidth={1.8}
                    className="mt-0.5 shrink-0 text-emerald-600"
                  />

                  <div>

                    <p className="text-sm font-bold text-emerald-800">
                      Your account is protected
                    </p>

                    <p className="mt-1 text-sm leading-5 text-emerald-700">
                      Security features such as password
                      management and session control will
                      be connected to the backend when
                      authentication is implemented.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </section>

          {/* =====================================================
              DANGER ZONE
          ====================================================== */}

          <section className="mb-8 rounded-2xl border border-red-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,.02)]">

            <div className="border-b border-red-100 px-5 py-5 sm:px-6">

              <div className="flex items-start gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">

                  <AlertTriangle
                    size={20}
                    strokeWidth={1.8}
                  />

                </div>

                <div>

                  <h3 className="text-base font-bold text-red-700">
                    Danger Zone
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Actions in this section can affect your agency access.
                  </p>

                </div>

              </div>

            </div>

            <div className="p-5 sm:p-6">

              <div className="flex flex-col gap-4 rounded-xl border border-red-100 bg-red-50/50 p-4 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <p className="text-sm font-bold text-slate-800">
                    Sign out of administrator account
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    End your current administrator session.
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem(
                      "clearingAgent"
                    );
                    localStorage.removeItem(
                      "agentType"
                    );
                    localStorage.removeItem(
                      "agentAuthenticated"
                    );
                    localStorage.removeItem(
                      "agentOnboardingType"
                    );
                    localStorage.removeItem(
                      "agentOnboardingComplete"
                    );

                    window.location.href =
                      "/agent-signin";
                  }}
                  className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >

                  <span>Sign Out</span>

                </button>

              </div>

            </div>

          </section>

          {/* =====================================================
              BOTTOM SAVE
          ====================================================== */}

          <div className="flex justify-end border-t border-slate-200 pt-6">

            <button
              type="button"
              onClick={handleSaveChanges}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173563] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#10294d]"
            >

              {saved ? (
                <>
                  <CheckCircle2
                    size={17}
                    strokeWidth={1.8}
                  />

                  Changes Saved
                </>
              ) : (
                <>
                  <Check
                    size={17}
                    strokeWidth={1.8}
                  />

                  Save Changes
                </>
              )}

            </button>

          </div>

          {/* FOOTER */}

          <footer className="mt-10 border-t border-slate-200 pt-5 text-center text-xs text-slate-400">
            ImportEase Agent Platform
          </footer>

        </div>

      </main>

    </div>
  );
}

/* ============================================================
   INITIALS
============================================================ */

function getInitials(name) {
  if (!name) {
    return "AD";
  }

  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 1) {
    return words[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return `${words[0][0]}${
    words[words.length - 1][0]
  }`.toUpperCase();
}

/* ============================================================
   SECTION HEADER
============================================================ */

function SectionHeader({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="border-b border-slate-100 px-5 py-5 sm:px-6">

      <div className="flex items-start gap-3">

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

          <Icon
            size={19}
            strokeWidth={1.8}
          />

        </div>

        <div>

          <h3 className="text-base font-bold text-slate-900">
            {title}
          </h3>

          <p className="mt-1 text-sm leading-5 text-slate-500">
            {description}
          </p>

        </div>

      </div>

    </div>
  );
}

/* ============================================================
   FORM FIELD
============================================================ */

function FormField({
  label,
  icon: Icon,
  type = "text",
  value,
  placeholder,
  onChange,
}) {
  return (
    <div>

      <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">

        {Icon && (
          <Icon
            size={15}
            strokeWidth={1.8}
          />
        )}

        {label}

      </label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-50"
      />

    </div>
  );
}

/* ============================================================
   NOTIFICATION ROW
============================================================ */

function NotificationRow({
  title,
  description,
  enabled,
  onChange,
}) {
  return (
    <div className="flex items-center justify-between gap-5 px-5 py-5 sm:px-6">

      <div className="min-w-0">

        <p className="text-sm font-semibold text-slate-800">
          {title}
        </p>

        <p className="mt-1 max-w-2xl text-sm leading-5 text-slate-500">
          {description}
        </p>

      </div>

      <button
        type="button"
        onClick={onChange}
        aria-label={`Toggle ${title}`}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled
            ? "bg-[#2563EB]"
            : "bg-slate-300"
        }`}
      >

        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
            enabled
              ? "left-6"
              : "left-1"
          }`}
        />

      </button>

    </div>
  );
}

export default AgentAdminSettings;