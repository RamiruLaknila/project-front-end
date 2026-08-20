import { useEffect, useRef, useState } from "react";
import {
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

function AppNavbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);

  const navItems = [
    {
      to: "/dashboard",
      label: "Dashboard",
    },
    {
      to: "/hs-code-search",
      label: "HS Code Search",
      mobileLabel: "HS Code",
    },
    {
      to: "/calculator",
      label: "Calculator",
    },
    {
      to: "/find-agent",
      label: "Find Agent",
    },
    {
      to: "/track-shipment",
      label: "Track Shipment",
    },
  ];

  /* =========================================================
     ACTIVE NAV ITEM
  ========================================================= */

  const isActive = (path) => {
    return location.pathname === path;
  };

  /* =========================================================
     CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  ========================================================= */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /* =========================================================
     CLOSE DROPDOWN WHEN PAGE CHANGES
  ========================================================= */

  useEffect(() => {
    setProfileOpen(false);
  }, [location.pathname]);

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = () => {
    setProfileOpen(false);

    // If you have authentication data stored,
    // remove it here.
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    navigate("/signin");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">

      {/* =====================================================
          DESKTOP / MAIN NAVBAR
      ===================================================== */}

      <div className="relative mx-auto flex h-[68px] max-w-[1280px] items-center px-5 sm:px-8">

        {/* =================================================
            LOGO
        ================================================= */}

        <Link
          to="/dashboard"
          className="flex shrink-0 items-center gap-3"
        >
          <img
            src="/logo.jpeg"
            alt="ImportEase"
            className="h-10 w-10 object-contain mix-blend-multiply"
          />

          <div>
            <div className="text-[17px] font-bold tracking-tight text-[#173563]">
              Import<span className="text-slate-900">Ease</span>
            </div>

            <div className="hidden text-[9px] font-semibold uppercase tracking-[0.13em] text-slate-400 sm:block">
              SME Import Platform
            </div>
          </div>
        </Link>

        {/* =================================================
            CENTER NAVIGATION
        ================================================= */}

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">

          {navItems.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              label={item.label}
              active={isActive(item.to)}
            />
          ))}

        </nav>

        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <div className="ml-auto flex items-center gap-3">

          {/* =================================================
              NOTIFICATIONS
          ================================================= */}

          <button
            type="button"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            aria-label="Notifications"
          >
            <Bell size={17} />

            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blue-600 ring-2 ring-white" />
          </button>

          <div className="hidden h-7 w-px bg-slate-200 sm:block" />

          {/* =================================================
              PROFILE DROPDOWN
          ================================================= */}

          <div
            ref={profileRef}
            className="relative"
          >

            {/* PROFILE BUTTON */}

            <button
              type="button"
              onClick={() => setProfileOpen((prev) => !prev)}
              className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition hover:bg-slate-50"
              aria-expanded={profileOpen}
              aria-haspopup="menu"
            >

              {/* Avatar */}

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#173563] text-[10px] font-bold text-white">
                MB
              </div>

              {/* User information */}

              <div className="hidden text-left sm:block">

                <p className="text-xs font-semibold text-slate-800">
                  My Business
                </p>

                <p className="text-[9px] text-slate-400">
                  SME Account
                </p>

              </div>

              {/* Arrow */}

              <ChevronDown
                size={15}
                className={`hidden text-slate-400 transition-transform sm:block ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />

            </button>

            {/* =================================================
                DROPDOWN
            ================================================= */}

            {profileOpen && (
              <div
                className="absolute right-0 top-[calc(100%+10px)] z-[100] w-[230px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_15px_40px_rgba(15,23,42,.12)]"
                role="menu"
              >

                {/* ACCOUNT HEADER */}

                <div className="mb-1 flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-3">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#173563] text-[10px] font-bold text-white">
                    MB
                  </div>

                  <div className="min-w-0">

                    <p className="truncate text-xs font-bold text-slate-800">
                      My Business
                    </p>

                    <p className="truncate text-[10px] text-slate-400">
                      SME Account
                    </p>

                  </div>

                </div>

                {/* PROFILE */}

                <Link
                  to="/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-[#173563]"
                  role="menuitem"
                >

                  <User
                    size={17}
                    strokeWidth={1.8}
                  />

                  <span>
                    Profile
                  </span>

                </Link>

                {/* SETTINGS */}

                <Link
                  to="/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-[#173563]"
                  role="menuitem"
                >

                  <Settings
                    size={17}
                    strokeWidth={1.8}
                  />

                  <span>
                    Settings
                  </span>

                </Link>

                {/* DIVIDER */}

                <div className="my-1.5 h-px bg-slate-100" />

                {/* LOGOUT */}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-red-600 transition hover:bg-red-50"
                  role="menuitem"
                >

                  <LogOut
                    size={17}
                    strokeWidth={1.8}
                  />

                  <span>
                    Logout
                  </span>

                </button>

              </div>
            )}

          </div>

        </div>

      </div>

      {/* =================================================
          MOBILE NAVIGATION
      ================================================= */}

      <div className="border-t border-slate-100 bg-white px-4 py-2 md:hidden">

        <nav className="flex gap-1 overflow-x-auto pb-1">

          {navItems.map((item) => (
            <MobileNavItem
              key={item.to}
              to={item.to}
              label={item.mobileLabel || item.label}
              active={isActive(item.to)}
            />
          ))}

        </nav>

      </div>

    </header>
  );
}


/* =========================================================
   DESKTOP NAV ITEM
========================================================= */

function NavItem({
  to,
  label,
  active,
}) {
  return (
    <Link
      to={to}
      className={`relative rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-200 ${
        active
          ? "bg-blue-50 text-[#173563] shadow-sm"
          : "text-slate-500 hover:bg-slate-100 hover:text-[#173563]"
      }`}
    >

      {label}

      {active && (
        <span className="absolute bottom-0 left-1/2 h-[2px] w-5 -translate-x-1/2 rounded-full bg-[#173563]" />
      )}

    </Link>
  );
}


/* =========================================================
   MOBILE NAV ITEM
========================================================= */

function MobileNavItem({
  to,
  label,
  active,
}) {
  return (
    <Link
      to={to}
      className={`shrink-0 rounded-lg px-3 py-2 text-[11px] font-semibold transition ${
        active
          ? "bg-[#173563] text-white"
          : "text-slate-500 hover:bg-slate-100"
      }`}
    >
      {label}
    </Link>
  );
}


export default AppNavbar;