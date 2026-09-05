import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  ShoppingBag,
  Gavel,
  Package,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";

function SidebarContent({
  agent,
  agencyName,
  closeMobileSidebar,
  handleLogout,
}) {
  const getInitials = (name) => {
    if (!name) return "AM";

    const words = name.trim().split(/\s+/);

    if (words.length === 1) {
      return words[0].slice(0, 2).toUpperCase();
    }

    return (
      words[0].charAt(0) +
      words[words.length - 1].charAt(0)
    ).toUpperCase();
  };

  const agentName =
    agent?.fullName ||
    agent?.name ||
    agent?.userName ||
    "Agency Member";

  const navigationItems = [
    {
      name: "Dashboard",
      path: "/agent-dashboard",
      icon: LayoutDashboard,
    },
    
    {
      name: "Marketplace",
      path: "/agent-marketplace",
      icon: ShoppingBag,
    },
    {
      name: "My Bids",
      path: "/agent-my-bids",
      icon: Gavel,
    },
    {
      name: "Shipments",
      path: "/agent-shipments",
      icon: Package,
    },
  ];

  const bottomItems = [
    {
      name: "Settings",
      path: "/agent-settings",
      icon: Settings,
    },
  ];

  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex h-[76px] shrink-0 items-center border-b border-slate-200 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white">
            <img
              src="/logo.jpeg"
              alt="ImportEase"
              className="h-full w-full object-contain"
            />
          </div>

          <div>
            <p className="text-[17px] font-extrabold tracking-tight text-[#173563]">
              ImportEase
            </p>

            <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
              Clearing Agent
            </p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
          Workspace
        </p>

        <nav className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeMobileSidebar}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold ${
                    isActive
                      ? "bg-[#173563] text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-[#173563]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`h-[18px] w-[18px] shrink-0 ${
                        isActive
                          ? "text-white"
                          : "text-slate-400 group-hover:text-[#173563]"
                      }`}
                    />

                    <span className="flex-1">
                      {item.name}
                    </span>

                    {isActive && (
                      <ChevronRight className="h-4 w-4 shrink-0 text-white/80" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Agent Info + Settings */}
      <div className="mt-auto shrink-0 border-t border-slate-200">
        {/* Agent Info */}
        <div className="px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#173563] text-sm font-bold text-white shadow-sm">
              {agent?.photo ||
              agent?.profilePhoto ||
              agent?.image ? (
                <img
                  src={
                    agent.photo ||
                    agent.profilePhoto ||
                    agent.image
                  }
                  alt={agentName}
                  className="block h-full w-full object-cover"
                />
              ) : (
                getInitials(agentName)
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-800">
                {agentName}
              </p>

              <div className="mt-0.5 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-[#2563EB]" />

                <p className="truncate text-xs font-medium text-slate-500">
                  Agency Member
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="px-4 pb-1">
          <nav className="space-y-1">
            {bottomItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileSidebar}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold ${
                      isActive
                        ? "bg-[#173563] text-white"
                        : "text-slate-500 hover:bg-slate-100 hover:text-[#173563]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`h-[18px] w-[18px] shrink-0 ${
                          isActive
                            ? "text-white"
                            : "text-slate-400 group-hover:text-[#173563]"
                        }`}
                      />

                      <span className="flex-1">
                        {item.name}
                      </span>

                      {isActive && (
                        <ChevronRight className="h-4 w-4 text-white/80" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Logout */}
        <div className="px-4 pb-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-[18px] w-[18px]" />

            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}

const getStoredAgent = () => {
  try {
    const savedAgent = localStorage.getItem("clearingAgent");

    if (savedAgent) {
      return JSON.parse(savedAgent);
    }
  } catch (error) {
    console.error("Error loading agent information:", error);
  }

  return null;
};

const getStoredAgency = () => {
  try {
    const savedAgency = localStorage.getItem("clearingAgency");

    if (savedAgency) {
      return JSON.parse(savedAgency);
    }
  } catch (error) {
    console.error("Error loading agent information:", error);
  }

  return null;
};

function AgentMemberSidebar() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [agent, setAgent] = useState(getStoredAgent);
  const [agency, setAgency] = useState(getStoredAgency);

  useEffect(() => {
    const handleProfileUpdate = () => {
      setAgent(getStoredAgent());
      setAgency(getStoredAgency());
    };

    window.addEventListener(
      "agentProfileUpdated",
      handleProfileUpdate
    );

    window.addEventListener(
      "storage",
      handleProfileUpdate
    );

    return () => {
      window.removeEventListener(
        "agentProfileUpdated",
        handleProfileUpdate
      );

      window.removeEventListener(
        "storage",
        handleProfileUpdate
      );
    };
  }, []);

  const agencyName =
    agency?.agencyName ||
    agency?.name ||
    "Clearing Agency";

  const handleLogout = () => {
    localStorage.removeItem("clearingAgent");
    localStorage.removeItem("agentOnboardingType");
    localStorage.removeItem("agentOnboardingComplete");

    setSidebarOpen(false);

    navigate("/agent-signin");
  };

  const closeMobileSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[270px] border-r border-slate-200 bg-white lg:block">
        <SidebarContent
          agent={agent}
          agencyName={agencyName}
          closeMobileSidebar={closeMobileSidebar}
          handleLogout={handleLogout}
        />
      </aside>

      {/* Mobile Header */}
      <div className="fixed left-0 right-0 top-0 z-30 flex h-[68px] items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-white">
            <img
              src="/logo.jpeg"
              alt="ImportEase"
              className="h-full w-full object-contain"
            />
          </div>

          <div>
            <p className="text-base font-extrabold text-[#173563]">
              ImportEase
            </p>

            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
              Clearing Agent
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 lg:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-[60] w-[280px] bg-white shadow-2xl transition-transform duration-300 lg:hidden ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div className="absolute right-3 top-4 z-10">
          <button
            type="button"
            onClick={closeMobileSidebar}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <SidebarContent
          agent={agent}
          agencyName={agencyName}
          closeMobileSidebar={closeMobileSidebar}
          handleLogout={handleLogout}
        />
      </aside>
    </>
  );
}

export default AgentMemberSidebar;