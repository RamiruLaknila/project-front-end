import { useState } from "react";
import {
  ArrowLeft,
  Bell,
  ChevronRight,
  Lock,
  LogOut,
  Moon,
  ShieldCheck,
  Sun,
  User,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function Settings() {
  const navigate = useNavigate();

  const { darkMode, toggleDarkMode } = useTheme();

  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("currentImport");
    localStorage.removeItem("selectedAgent");

    navigate("/signin");
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-900 dark:bg-[#0B1120] dark:text-slate-100">
      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl dark:border-slate-800 dark:bg-[#0F172A]/95">
        <div className="mx-auto flex h-[68px] max-w-[1180px] items-center justify-between px-5 sm:px-7">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white dark:bg-slate-900">
              <img
                src="/logo.jpeg"
                alt="ImportEase"
                className="h-full w-full object-contain"
              />
            </div>

            <div>
              <p className="text-[17px] font-bold text-[#173B6C] dark:text-blue-400">
                Import<span className="text-slate-900 dark:text-white">Ease</span>
              </p>

              <p className="hidden text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-400 sm:block">
                SME Import Platform
              </p>
            </div>
          </Link>

          <Link
            to="/dashboard"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <ArrowLeft size={15} />
            Dashboard
          </Link>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="mx-auto max-w-[900px] px-5 py-8 sm:px-7 lg:py-10">
        {/* HEADER */}

        <div className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 dark:border-blue-900/50 dark:bg-blue-950/40">
            <ShieldCheck size={13} className="text-blue-700 dark:text-blue-400" />

            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
              Account settings
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-[#14213D] dark:text-white">
            Settings
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Manage your ImportEase account preferences.
          </p>
        </div>

        <div className="space-y-5">
          {/* =================================================
              ACCOUNT
          ================================================== */}

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#111827]">
            <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Account
              </h2>

              <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">
                Manage your account information
              </p>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              <Link
                to="/profile"
                className="flex items-center justify-between px-5 py-4 transition hover:bg-slate-50 dark:hover:bg-slate-800/60"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400">
                    <User size={17} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                      Profile
                    </p>

                    <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">
                      Update your business information
                    </p>
                  </div>
                </div>

                <ChevronRight
                  size={16}
                  className="text-slate-400 dark:text-slate-600"
                />
              </Link>

              <button
                type="button"
                className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800/60"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-400">
                    <Lock size={17} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                      Password & security
                    </p>

                    <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">
                      Manage your login security
                    </p>
                  </div>
                </div>

                <ChevronRight
                  size={16}
                  className="text-slate-400 dark:text-slate-600"
                />
              </button>
            </div>
          </section>

          {/* =================================================
              APPEARANCE
          ================================================== */}

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#111827]">
            <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Appearance
              </h2>

              <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">
                Customize how ImportEase looks on your device
              </p>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              <SettingToggle
                icon={darkMode ? Moon : Sun}
                title="Dark mode"
                description={
                  darkMode
                    ? "ImportEase is using the dark theme"
                    : "Use a darker theme that's easier on the eyes"
                }
                enabled={darkMode}
                onChange={toggleDarkMode}
              />
            </div>
          </section>

          {/* =================================================
              NOTIFICATIONS
          ================================================== */}

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#111827]">
            <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Notifications
              </h2>

              <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">
                Choose how ImportEase keeps you updated
              </p>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
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

          {/* =================================================
              ACCOUNT ACTIONS
          ================================================== */}

          <section className="overflow-hidden rounded-2xl border border-red-100 bg-white shadow-sm dark:border-red-950/60 dark:bg-[#111827]">
            <div className="border-b border-red-100 px-5 py-4 dark:border-red-950/60">
              <h2 className="text-sm font-bold text-red-700 dark:text-red-400">
                Account actions
              </h2>

              <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">
                Actions related to your account
              </p>
            </div>

            <div className="p-5">
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-bold text-red-700 transition hover:bg-red-100 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/60"
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
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
            enabled
              ? "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400"
              : "bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
          }`}
        >
          <Icon size={17} />
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">
            {title}
          </p>

          <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onChange}
        aria-label={`Toggle ${title}`}
        aria-pressed={enabled}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled
            ? "bg-[#2563EB]"
            : "bg-slate-300 dark:bg-slate-600"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

export default Settings;