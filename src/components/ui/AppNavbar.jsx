import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Settings,
  UserRound,
  X,
} from "lucide-react";

function AppNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const getProfileFromStorage = () => {
    try {
      const savedProfile = localStorage.getItem("smeProfile");
      const savedUser = localStorage.getItem("smeUser");

      let profileData = {};
      let userData = {};

      if (savedProfile) {
        profileData = JSON.parse(savedProfile);
      }

      if (savedUser) {
        userData = JSON.parse(savedUser);
      }

      return {
        fullName:
          profileData.fullName ||
          userData.fullName ||
          userData.name ||
          "User",

        businessName:
          profileData.businessName ||
          userData.businessName ||
          "",

        email:
          profileData.email ||
          userData.email ||
          "",

        photo:
          profileData.photo ||
          userData.photo ||
          "",
      };
    } catch (error) {
      console.error("Failed to load navbar profile:", error);

      return {
        fullName: "User",
        businessName: "",
        email: "",
        photo: "",
      };
    }
  };

  // Lazy initializer runs synchronously on first render,
  // so the correct profile is already there on first paint
  // (this is what removes the shaky flash when switching tabs).
  const [profile, setProfile] = useState(getProfileFromStorage);

  const loadProfile = () => {
    setProfile(getProfileFromStorage());
  };

  useEffect(() => {
    const handleProfileUpdated = () => {
      loadProfile();
    };

    window.addEventListener("profileUpdated", handleProfileUpdated);
    window.addEventListener("storage", handleProfileUpdated);

    return () => {
      window.removeEventListener(
        "profileUpdated",
        handleProfileUpdated
      );

      window.removeEventListener(
        "storage",
        handleProfileUpdated
      );
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("smeProfile");

    setIsProfileOpen(false);
    setIsMenuOpen(false);

    navigate("/signin");
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
      text-[15px] font-semibold
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
      text-[15px] font-semibold
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
              src="/logo.jpeg"
              alt="ImportEase"
              className="h-full w-full object-contain"
            />
          </div>

          {/* Brand Name */}
          <div className="hidden sm:block">
            <div className="text-[18px] font-bold leading-tight tracking-tight text-[#173563] transition-colors group-hover:text-[#2563EB]">
              ImportEase
            </div>

            <div className="mt-0.5 text-[11px] font-medium leading-tight text-slate-500">
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

            {/* Notification Dot */}
            <span className="absolute right-[8px] top-[7px] h-2 w-2 rounded-full bg-[#2563EB] ring-2 ring-white" />
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
                <p className="max-w-[150px] truncate text-[14px] font-bold text-slate-800">
                  {profile?.fullName || "User"}
                </p>

                <p className="max-w-[150px] truncate text-[12px] text-slate-500">
                  {profile?.businessName || "SME Account"}
                </p>
              </div>

              <ChevronDown
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
                        <p className="truncate text-[14px] font-bold text-slate-900">
                          {profile?.fullName || "User"}
                        </p>

                        <p className="truncate text-[12px] text-slate-500">
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
                        text-left text-[14px] font-semibold
                        transition
                        ${
                          isActive("/profile")
                            ? "bg-blue-50 text-[#2563EB]"
                            : "text-slate-700 hover:bg-slate-50 hover:text-[#2563EB]"
                        }
                      `}
                    >
                      <UserRound className="h-[18px] w-[18px]" />
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
                        text-left text-[14px] font-semibold
                        transition
                        ${
                          isActive("/settings")
                            ? "bg-blue-50 text-[#2563EB]"
                            : "text-slate-700 hover:bg-slate-50 hover:text-[#2563EB]"
                        }
                      `}
                    >
                      <Settings className="h-[18px] w-[18px]" />
                      Settings
                    </button>

                  </div>

                  {/* Logout */}
                  <div className="border-t border-slate-100 p-2">

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[14px] font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      <LogOut className="h-[18px] w-[18px]" />
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
              <Menu className="h-5 w-5" />
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
              <UserRound className="h-5 w-5" />
              Profile
            </Link>

            {/* Settings */}
            <Link
              to="/settings"
              onClick={closeMobileMenu}
              className={mobileNavClass("/settings")}
            >
              <Settings className="h-5 w-5" />
              Settings
            </Link>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-[15px] font-semibold text-red-600 transition hover:bg-red-50"
            >
              <LogOut className="h-5 w-5" />
              Sign out
            </button>

          </div>
        </div>
      )}
    </nav>
  );
}

export default AppNavbar;