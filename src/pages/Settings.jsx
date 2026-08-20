import { useState } from "react";
import {
  ArrowLeft,
  Bell,
  ChevronRight,
  Lock,
  LogOut,
  ShieldCheck,
  User,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function Settings() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("currentImport");
    localStorage.removeItem("selectedAgent");
    navigate("/signin");
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-900">

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
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
              <p className="text-[17px] font-bold text-[#173B6C]">
                Import<span className="text-slate-900">Ease</span>
              </p>

              <p className="hidden text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-400 sm:block">
                SME Import Platform
              </p>
            </div>
          </Link>

          <Link
            to="/dashboard"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          >
            <ArrowLeft size={15} />
            Dashboard
          </Link>

        </div>
      </header>

      {/* MAIN */}
      <main className="mx-auto max-w-[900px] px-5 py-8 sm:px-7 lg:py-10">

        {/* HEADER */}
        <div className="mb-8">

          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5">
            <ShieldCheck
              size={13}
              className="text-blue-700"
            />

            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
              Account settings
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-[#14213D]">
            Settings
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage your ImportEase account preferences.
          </p>

        </div>

        <div className="space-y-5">

          {/* ACCOUNT */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="text-sm font-bold text-slate-800">
                Account
              </h2>

              <p className="mt-1 text-[10px] text-slate-400">
                Manage your account information
              </p>
            </div>

            <div className="divide-y divide-slate-100">

              <Link
                to="/profile"
                className="flex items-center justify-between px-5 py-4 transition hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                    <User size={17} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-800">
                      Profile
                    </p>

                    <p className="mt-1 text-[10px] text-slate-400">
                      Update your business information
                    </p>
                  </div>

                </div>

                <ChevronRight
                  size={16}
                  className="text-slate-400"
                />
              </Link>

              <button
                type="button"
                className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
                    <Lock size={17} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-800">
                      Password & security
                    </p>

                    <p className="mt-1 text-[10px] text-slate-400">
                      Manage your login security
                    </p>
                  </div>

                </div>

                <ChevronRight
                  size={16}
                  className="text-slate-400"
                />
              </button>

            </div>

          </section>

          {/* NOTIFICATIONS */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-100 px-5 py-4">

              <h2 className="text-sm font-bold text-slate-800">
                Notifications
              </h2>

              <p className="mt-1 text-[10px] text-slate-400">
                Choose how ImportEase keeps you updated
              </p>

            </div>

            <div className="divide-y divide-slate-100">

              <SettingToggle
                icon={Bell}
                title="Notifications"
                description="Receive important shipment and agent updates"
                enabled={notifications}
                onChange={() => setNotifications(!notifications)}
              />

              <SettingToggle
                icon={Bell}
                title="Email updates"
                description="Receive important updates by email"
                enabled={emailUpdates}
                onChange={() => setEmailUpdates(!emailUpdates)}
              />

            </div>

          </section>

          {/* DANGER ZONE */}
          <section className="overflow-hidden rounded-2xl border border-red-100 bg-white shadow-sm">

            <div className="border-b border-red-100 px-5 py-4">

              <h2 className="text-sm font-bold text-red-700">
                Account actions
              </h2>

              <p className="mt-1 text-[10px] text-slate-400">
                Actions related to your account
              </p>

            </div>

            <div className="p-5">

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-bold text-red-700 transition hover:bg-red-100"
              >
                <LogOut size={15} />
                Sign out
              </button>

            </div>

          </section>

        </div>

      </main>
    </div>
  );
}

function SettingToggle({
  icon: Icon,
  title,
  description,
  enabled,
  onChange,
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4">

      <div className="flex items-center gap-3">

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
          <Icon size={17} />
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-800">
            {title}
          </p>

          <p className="mt-1 text-[10px] text-slate-400">
            {description}
          </p>
        </div>

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

export default Settings;