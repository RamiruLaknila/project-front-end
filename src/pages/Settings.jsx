import { useState } from "react";
import {
  ArrowLeft,
  Bell,
  CaretRight,
  Lock,
  SignOut,
  Moon,
  Sun,
  User,
} from "@phosphor-icons/react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { authErrorMessage } from "../lib/authErrors";
import AppNavbar from "../components/ui/AppNavbar";

function Settings() {
  const navigate = useNavigate();

  const { darkMode, toggleDarkMode } = useTheme();
  const { user, resetPassword } = useAuth();

  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [pwStatus, setPwStatus] = useState("idle"); // idle | sending | sent | error
  const [pwError, setPwError] = useState("");

  const handleChangePassword = async () => {
    if (!user?.email || pwStatus === "sending") return;
    setPwStatus("sending");
    setPwError("");
    try {
      await resetPassword(user.email);
      setPwStatus("sent");
    } catch (err) {
      setPwError(authErrorMessage(err, "Could not send the reset email."));
      setPwStatus("error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("currentImport");
    localStorage.removeItem("selectedAgent");

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-900 dark:bg-[#0B1120] dark:text-slate-100">
      <AppNavbar />

      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="mx-auto w-full max-w-[1080px] px-5 pb-16 pt-8 sm:px-8 lg:pt-10">
        {/* Back */}
        <Link
          to="/dashboard"
          className="group mb-8 inline-flex items-center gap-2 text-[16px] font-semibold text-slate-600 transition hover:text-[#173563] dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft
            size={18}
            className="transition-transform duration-200 group-hover:-translate-x-1"
          />

          Back to Dashboard
        </Link>

        {/* Page Heading */}
        <div className="mb-8">
          <p className="mb-2 text-[14px] font-bold uppercase tracking-[0.14em] text-blue-600 dark:text-blue-400">
            Account
          </p>

          <h1 className="text-[35px] font-bold tracking-[-0.04em] text-[#14213D] sm:text-[45px] dark:text-white">
            Settings
          </h1>

          <p className="mt-2 max-w-2xl text-[14px] leading-6 text-slate-500 sm:text-[16px] dark:text-slate-400">
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

              <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
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

                    <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                      Update your business information
                    </p>
                  </div>
                </div>

                <CaretRight
                  size={16}
                  className="text-slate-400 dark:text-slate-600"
                />
              </Link>

              <div>
                <button
                  type="button"
                  onClick={handleChangePassword}
                  disabled={pwStatus === "sending"}
                  className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-slate-800/60"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-400">
                      <Lock size={17} />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                        Password & security
                      </p>

                      <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                        {pwStatus === "sending"
                          ? "Sending reset link…"
                          : "Send a password reset link to your email"}
                      </p>
                    </div>
                  </div>

                  <CaretRight
                    size={16}
                    className="text-slate-400 dark:text-slate-600"
                  />
                </button>

                {pwStatus === "sent" && (
                  <p className="px-5 pb-4 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                    Reset link sent to {user?.email}. Check your inbox.
                  </p>
                )}

                {pwStatus === "error" && (
                  <p className="px-5 pb-4 text-[11px] font-medium text-red-500">
                    {pwError}
                  </p>
                )}
              </div>
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

              <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
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

              <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
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

              <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                Actions related to your account
              </p>
            </div>

            <div className="p-5">
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-bold text-red-700 transition hover:bg-red-100 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/60"
              >
                <SignOut size={15} />
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

          <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
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