import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  CaretDown,
  Moon,
  SignOut,
  List,
  Gear,
  Sun,
  UserCircle,
  X,
} from "@phosphor-icons/react";

import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { api } from "../../lib/api";

function AppNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [photo, setPhoto] = useState("");
  const [hasUnread, setHasUnread] = useState(false);

  // Re-checked on mount (so every page load reflects the current state) and
  // whenever Notifications.jsx marks something read, via the
  // "notificationsUpdated" event -- same cross-component pattern as the
  // profile photo above.
  useEffect(() => {
    if (!user?.id) {
      return;
    }

    let active = true;

    const loadUnread = async () => {
      try {
        const data = await api.get("/notifications?unreadOnly=true");
        if (active) setHasUnread(data.length > 0);
      } catch {
        if (active) setHasUnread(false);
      }
    };

    loadUnread();
    window.addEventListener("notificationsUpdated", loadUnread);

    return () => {
      active = false;
      window.removeEventListener("notificationsUpdated", loadUnread);
    };
  }, [user?.id]);

  // Profile photos have no backend field -- Profile.jsx stores them in
  // localStorage keyed by user id and fires "profilePhotoUpdated" whenever it
  // changes, so the navbar (mounted separately on every page) can pick up the
  // latest one, including a same-page update made on the Profile page itself.
  useEffect(() => {
    const loadPhoto = () => {
      if (!user?.id) {
        setPhoto("");
        return;
      }
      try {
        setPhoto(localStorage.getItem(`profilePhoto:${user.id}`) || "");
      } catch {
        setPhoto("");
      }
    };

    const timer = setTimeout(loadPhoto, 0);
    window.addEventListener("profilePhotoUpdated", loadPhoto);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("profilePhotoUpdated", loadPhoto);
    };
  }, [user?.id]);

  const profile = {
    fullName: user?.name || "User",
    businessName: user?.businessName || "",
    email: user?.email || "",
    photo,
  };

  const handleLogout = async () => {
    setIsProfileOpen(false);
    setIsMenuOpen(false);
    try {
      await logout();
    } finally {
      navigate("/", { replace: true });
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";

    const words = name.trim().split(/\s+/);

    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }

    return (
      words[0].charAt(0) +
      words[words.length - 1].charAt(0)
    ).toUpperCase();
  };

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
  };

  /*
   * Active navigation
   */
  const isActive = (path) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }

    return location.pathname === path;
  };

  /*
   * Desktop navigation class
   */
  const desktopNavClass = (path) => {
    const active = isActive(path);

    return `
      relative flex h-[72px] items-center
      text-[16px] font-semibold
      transition-colors duration-200
      ${
        active
          ? "text-[#173563]"
          : "text-slate-600 hover:text-[#2563EB]"
      }

      after:absolute
      after:bottom-0
      after:left-0
      after:right-0
      after:h-[3px]
      after:rounded-t-full
      after:transition-all
      after:duration-200
      ${
        active
          ? "after:bg-[#2563EB] after:opacity-100"
          : "after:bg-transparent after:opacity-0"
      }
    `;
  };

  /*
   * Mobile navigation class
   */
  const mobileNavClass = (path) => {
    const active = isActive(path);

    return `
      flex items-center
      rounded-xl
      px-4 py-3
      text-[16px] font-semibold
      transition-all duration-200
      ${
        active
          ? "bg-blue-50 text-[#173563] shadow-sm"
          : "text-slate-700 hover:bg-slate-50 hover:text-[#2563EB]"
      }
    `;
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 sm:px-6 lg:px-10">

        {/* =========================================================
            LOGO
        ========================================================== */}
        <Link
          to="/dashboard"
          className="group flex shrink-0 items-center gap-3"
          onClick={() => {
            setIsMenuOpen(false);
            setIsProfileOpen(false);
          }}
        >
          {/* Logo Container */}
          <div className="flex h-[48px] w-[48px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white">
            <img
              src="/logo.png"
              alt="ImportEase"
              className="h-full w-full object-contain"
            />
          </div>

          {/* Brand Name */}
          <div className="hidden sm:block">
            <div className="text-[19px] font-bold leading-tight tracking-tight text-[#173563] transition-colors group-hover:text-[#2563EB]">
              ImportEase
            </div>

            <div className="mt-0.5 text-[12px] font-medium leading-tight text-slate-500">
              Import smarter. Trade easier.
            </div>
          </div>
        </Link>

        {/* =========================================================
            DESKTOP NAVIGATION
        ========================================================== */}
        <div className="hidden items-center gap-7 md:flex lg:gap-8">

          {/* Dashboard */}
          <Link
            to="/dashboard"
            className={desktopNavClass("/dashboard")}
          >
            Dashboard
          </Link>

          {/* HS Code */}
          <Link
            to="/hs-code-search"
            className={desktopNavClass("/hs-code-search")}
          >
            HS Code
          </Link>

          {/* Calculator */}
          <Link
            to="/Calculator"
            className={desktopNavClass("/Calculator")}
          >
            Calculator
          </Link>

          {/* Find Agent */}
          <Link
            to="/find-agent"
            className={desktopNavClass("/find-agent")}
          >
            Find Agent
          </Link>

          {/* Shipments */}
          <Link
            to="/shipments"
            className={desktopNavClass("/shipments")}
          >
            Shipments
          </Link>
        </div>

        {/* =========================================================
            RIGHT SIDE
        ========================================================== */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* =====================================================
              DARK MODE TOGGLE
          ====================================================== */}
          <button
            type="button"
            onClick={toggleDarkMode}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-[#2563EB]"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? (
              <Sun className="h-[19px] w-[19px]" />
            ) : (
              <Moon className="h-[19px] w-[19px]" />
            )}
          </button>

          {/* =====================================================
              NOTIFICATIONS
          ====================================================== */}
          <button
            type="button"
            onClick={() => navigate("/notifications")}
            className={`
              relative flex h-10 w-10 items-center justify-center
              rounded-xl
              transition-all duration-200
              ${
                isActive("/notifications")
                  ? "bg-blue-50 text-[#2563EB]"
                  : "text-slate-600 hover:bg-slate-100 hover:text-[#2563EB]"
              }
            `}
            aria-label="Notifications"
          >
            <Bell className="h-[19px] w-[19px]" />

            {/* Notification Dot -- only shown while there's a real unread notification */}
            {hasUnread && (
              <span className="absolute right-[8px] top-[7px] h-2 w-2 rounded-full bg-[#2563EB] ring-2 ring-white" />
            )}
          </button>

          {/* =====================================================
              PROFILE
          ====================================================== */}
          <div className="relative hidden md:block">

            <button
              type="button"
              onClick={() =>
                setIsProfileOpen((prev) => !prev)
              }
              className={`
                flex items-center gap-3
                rounded-xl
                px-2 py-1.5
                transition-all duration-200
                ${
                  isProfileOpen
                    ? "bg-slate-100"
                    : "hover:bg-slate-50"
                }
              `}
            >

              {/* Profile Photo */}
              {profile?.photo ? (
                <img
                  src={profile.photo}
                  alt={profile.fullName || "Profile"}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-white shadow-sm"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#173563] text-sm font-bold text-white shadow-sm">
                  {getInitials(profile?.fullName)}
                </div>
              )}

              {/* Profile Details */}
              <div className="hidden text-left lg:block">
                <p className="max-w-[150px] truncate text-[15px] font-bold text-slate-800">
                  {profile?.fullName || "User"}
                </p>

                <p className="max-w-[150px] truncate text-[13px] text-slate-500">
                  {profile?.businessName || "SME Account"}
                </p>
              </div>

              <CaretDown
                className={`
                  h-4 w-4
                  text-slate-500
                  transition-transform duration-200
                  ${isProfileOpen ? "rotate-180" : ""}
                `}
              />
            </button>

            {/* =================================================
                PROFILE DROPDOWN
            ================================================== */}
            {isProfileOpen && (
              <>
                {/* Background Click Layer */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsProfileOpen(false)}
                />

                {/* Dropdown */}
                <div className="absolute right-0 top-[58px] z-50 w-[280px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">

                  {/* Profile Header */}
                  <div className="border-b border-slate-100 px-4 py-4">
                    <div className="flex items-center gap-3">

                      {profile?.photo ? (
                        <img
                          src={profile.photo}
                          alt={profile.fullName || "Profile"}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#173563] text-sm font-bold text-white">
                          {getInitials(profile?.fullName)}
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="truncate text-[15px] font-bold text-slate-900">
                          {profile?.fullName || "User"}
                        </p>

                        <p className="truncate text-[13px] text-slate-500">
                          {profile?.email || ""}
                        </p>
                      </div>

                    </div>
                  </div>

                  {/* Dropdown Links */}
                  <div className="p-2">

                    {/* Profile */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileOpen(false);
                        navigate("/profile");
                      }}
                      className={`
                        flex w-full items-center gap-3
                        rounded-xl px-3 py-3
                        text-left text-[15px] font-semibold
                        transition
                        ${
                          isActive("/profile")
                            ? "bg-blue-50 text-[#2563EB]"
                            : "text-slate-700 hover:bg-slate-50 hover:text-[#2563EB]"
                        }
                      `}
                    >
                      <UserCircle className="h-[18px] w-[18px]" />
                      Profile
                    </button>

                    {/* Settings */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileOpen(false);
                        navigate("/settings");
                      }}
                      className={`
                        flex w-full items-center gap-3
                        rounded-xl px-3 py-3
                        text-left text-[15px] font-semibold
                        transition
                        ${
                          isActive("/settings")
                            ? "bg-blue-50 text-[#2563EB]"
                            : "text-slate-700 hover:bg-slate-50 hover:text-[#2563EB]"
                        }
                      `}
                    >
                      <Gear className="h-[18px] w-[18px]" />
                      Settings
                    </button>

                  </div>

                  {/* Logout */}
                  <div className="border-t border-slate-100 p-2">

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[15px] font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      <SignOut className="h-[18px] w-[18px]" />
                      Sign out
                    </button>

                  </div>
                </div>
              </>
            )}
          </div>

          {/* =====================================================
              MOBILE MENU BUTTON
          ====================================================== */}
          <button
            type="button"
            onClick={() =>
              setIsMenuOpen((prev) => !prev)
            }
            className={`
              flex h-10 w-10 items-center justify-center
              rounded-xl
              transition-all duration-200
              ${
                isMenuOpen
                  ? "bg-slate-100 text-[#173563]"
                  : "text-slate-600 hover:bg-slate-100 hover:text-[#2563EB]"
              }
              md:hidden
            `}
            aria-label="Open menu"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <List className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* =========================================================
          MOBILE MENU
      ========================================================== */}
      {isMenuOpen && (
        <div className="border-t border-slate-200 bg-white md:hidden">

          <div className="space-y-1 px-5 py-4">

            {/* Dashboard */}
            <Link
              to="/dashboard"
              onClick={closeMobileMenu}
              className={mobileNavClass("/dashboard")}
            >
              Dashboard
            </Link>

            {/* HS Code */}
            <Link
              to="/hs-code-search"
              onClick={closeMobileMenu}
              className={mobileNavClass("/hs-code-search")}
            >
              HS Code
            </Link>

            {/* Calculator */}
            <Link
              to="/Calculator"
              onClick={closeMobileMenu}
              className={mobileNavClass("/Calculator")}
            >
              Calculator
            </Link>

            {/* Find Agent */}
            <Link
              to="/find-agent"
              onClick={closeMobileMenu}
              className={mobileNavClass("/find-agent")}
            >
              Find Agent
            </Link>

            {/* Shipments */}
            <Link
              to="/shipments"
              onClick={closeMobileMenu}
              className={mobileNavClass("/shipments")}
            >
              Shipments
            </Link>

            {/* Divider */}
            <div className="my-3 border-t border-slate-100" />

            {/* Profile */}
            <Link
              to="/profile"
              onClick={closeMobileMenu}
              className={mobileNavClass("/profile")}
            >
              <UserCircle className="h-5 w-5" />
              Profile
            </Link>

            {/* Settings */}
            <Link
              to="/settings"
              onClick={closeMobileMenu}
              className={mobileNavClass("/settings")}
            >
              <Gear className="h-5 w-5" />
              Settings
            </Link>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-[16px] font-semibold text-red-600 transition hover:bg-red-50"
            >
              <SignOut className="h-5 w-5" />
              Sign out
            </button>

          </div>
        </div>
      )}
    </nav>
  );
}

export default AppNavbar;