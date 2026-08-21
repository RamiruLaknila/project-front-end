import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  Building2,
  ChevronRight,
  ClipboardList,
  Copy,
  FileText,
  LogOut,
  Menu,
  Settings,
CheckCircle2,

  ShieldCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";

function AgentAdminDashboard() {
  const navigate = useNavigate();

  const [agency, setAgency] = useState(null);
  const [agent, setAgent] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  /* =========================================================
     LOAD AGENCY
  ========================================================= */

  useEffect(() => {
    try {
      const storedAgency =
        localStorage.getItem("clearingAgency");

      const storedAgent =
        localStorage.getItem("clearingAgent");

      if (storedAgency) {
        setAgency(JSON.parse(storedAgency));
      }

      if (storedAgent) {
        setAgent(JSON.parse(storedAgent));
      }
    } catch (error) {
      console.error(
        "Failed to load agency information:",
        error
      );
    }
  }, []);

  /* =========================================================
     PROTECT ADMIN DASHBOARD
  ========================================================= */

  useEffect(() => {
    const storedAgent =
      localStorage.getItem("clearingAgent");

    const storedAgency =
      localStorage.getItem("clearingAgency");

    if (!storedAgent || !storedAgency) {
      navigate("/agent-signin");
      return;
    }

    try {
      const currentAgent = JSON.parse(storedAgent);

      if (currentAgent.role !== "admin") {
        navigate("/agent-signin");
      }
    } catch {
      navigate("/agent-signin");
    }
  }, [navigate]);

  /* =========================================================
     AGENCY ID
  ========================================================= */

  const agencyCode = useMemo(() => {
    if (!agency?.id) {
      return "AG-000000";
    }

    return agency.id;
  }, [agency]);

  /* =========================================================
     COPY AGENCY CODE
  ========================================================= */

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(agencyCode);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(
        "Failed to copy agency code:",
        error
      );
    }
  };

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = () => {
    localStorage.removeItem("clearingAgent");
    localStorage.removeItem("agentOnboardingType");
    localStorage.removeItem("agentOnboardingComplete");

    navigate("/agent-signin");
  };

  /* =========================================================
     DASHBOARD STATS
  ========================================================= */

  const stats = [
    {
      title: "Total Agents",
      value: "1",
      description: "Currently registered",
      icon: Users,
      iconStyle: "bg-blue-50 text-blue-600",
    },
    {
      title: "Pending Requests",
      value: "0",
      description: "Agents waiting for approval",
      icon: UserPlus,
      iconStyle: "bg-amber-50 text-amber-700",
    },
    {
      title: "SME Requests",
      value: "0",
      description: "New marketplace requests",
      icon: ClipboardList,
      iconStyle: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Active Shipments",
      value: "0",
      description: "Currently in progress",
      icon: FileText,
      iconStyle: "bg-indigo-50 text-indigo-600",
    },
  ];

  /* =========================================================
     QUICK ACTIONS
  ========================================================= */

  const quickActions = [
    {
      title: "Invite an Agent",
      description:
        "Invite another clearing agent to your agency.",
      icon: UserPlus,
      to: "/agency-invite",
      iconStyle: "bg-blue-50 text-blue-600",
    },
    {
      title: "Manage Agents",
      description:
        "View and manage your agency members.",
      icon: Users,
      to: "/agency-agents",
      iconStyle: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "SME Requests",
      description:
        "Review import requests from SMEs.",
      icon: ClipboardList,
      to: "/agent-marketplace",
      iconStyle: "bg-violet-50 text-violet-700",
    },
    {
      title: "Shipments",
      description:
        "Manage your agency shipments.",
      icon: FileText,
      to: "/agent-shipments",
      iconStyle: "bg-indigo-50 text-indigo-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-900">

      {/* =====================================================
          MOBILE SIDEBAR OVERLAY
      ===================================================== */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}


      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[250px] flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        {/* LOGO */}

        <div className="flex h-[70px] items-center border-b border-slate-100 px-5">

          <Link
            to="/agent-admin-dashboard"
            className="flex items-center gap-3"
            onClick={() => setSidebarOpen(false)}
          >

            <img
              src="/logo.jpeg"
              alt="ImportEase"
              className="h-9 w-9 object-contain mix-blend-multiply"
            />

            <div>

              <p className="text-[16px] font-bold tracking-tight text-[#173563]">
                Import
                <span className="text-slate-900">
                  Ease
                </span>
              </p>

              <p className="text-[8px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                Agent Platform
              </p>

            </div>

          </Link>

          {/* MOBILE CLOSE */}

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 lg:hidden"
          >
            <X size={18} />
          </button>

        </div>


        {/* AGENCY */}

        <div className="border-b border-slate-100 p-4">

          <div className="rounded-xl bg-slate-50 p-3">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#173563] text-white">
                <Building2 size={17} />
              </div>

              <div className="min-w-0">

                <p className="truncate text-xs font-bold text-slate-800">
                  {agency?.agencyName ||
                    "Your Agency"}
                </p>

                <p className="mt-0.5 text-[9px] text-slate-400">
                  Agency Admin
                </p>

              </div>

            </div>

          </div>

        </div>


        {/* NAVIGATION */}

        <nav className="flex-1 space-y-1 p-3">

          <SidebarItem
            icon={Building2}
            label="Dashboard"
            active
            to="/agent-admin-dashboard"
            onClick={() => setSidebarOpen(false)}
          />

          <SidebarItem
            icon={Users}
            label="Agents"
            to="/agency-agents"
            onClick={() => setSidebarOpen(false)}
          />

          <SidebarItem
            icon={UserPlus}
            label="Invite Agents"
            to="/agency-invite"
            onClick={() => setSidebarOpen(false)}
          />

          <SidebarItem
            icon={ClipboardList}
            label="SME Requests"
            to="/agent-marketplace"
            onClick={() => setSidebarOpen(false)}
          />

          <SidebarItem
            icon={FileText}
            label="Shipments"
            to="/agent-shipments"
            onClick={() => setSidebarOpen(false)}
          />

        </nav>


        {/* BOTTOM */}

        <div className="border-t border-slate-100 p-3">

          <SidebarItem
            icon={Settings}
            label="Settings"
            to="/agent-settings"
            onClick={() => setSidebarOpen(false)}
          />

          <button
            type="button"
            onClick={handleLogout}
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
          >

            <LogOut size={17} />

            Logout

          </button>

        </div>

      </aside>


      {/* =====================================================
          MAIN AREA
      ===================================================== */}

      <div className="lg:ml-[250px]">

        {/* =================================================
            TOP BAR
        ================================================= */}

        <header className="sticky top-0 z-30 flex h-[70px] items-center border-b border-slate-200 bg-white/95 px-5 backdrop-blur-xl sm:px-8">

          {/* MOBILE MENU */}

          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="mr-3 flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <Menu size={19} />
          </button>

          <div>

            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
              Agency workspace
            </p>

            <h1 className="text-sm font-bold text-slate-800">
              Admin Dashboard
            </h1>

          </div>


          <div className="ml-auto flex items-center gap-3">

            {/* NOTIFICATION */}

            <button
              type="button"
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100"
            >

              <Bell size={17} />

              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blue-600 ring-2 ring-white" />

            </button>


            <div className="hidden h-7 w-px bg-slate-200 sm:block" />


            {/* ADMIN */}

            <div className="flex items-center gap-2">

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#173563] text-[10px] font-bold text-white">
                {getInitials(agent?.name || "Admin")}
              </div>

              <div className="hidden sm:block">

                <p className="text-xs font-semibold text-slate-800">
                  {agent?.name || "Agency Admin"}
                </p>

                <p className="text-[9px] text-slate-400">
                  Administrator
                </p>

              </div>

            </div>

          </div>

        </header>


        {/* =================================================
            CONTENT
        ================================================= */}

        <main className="mx-auto w-full max-w-[1180px] px-5 py-7 sm:px-8 lg:py-9">

          {/* =================================================
              HEADER
          ================================================= */}

          <section className="mb-7">

            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

              <div>

                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5">

                  <ShieldCheck
                    size={13}
                    className="text-blue-600"
                  />

                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-700">
                    Agency administrator
                  </span>

                </div>

                <h2 className="text-[28px] font-bold tracking-[-0.04em] text-[#14213D] sm:text-[38px]">
                  Welcome,{" "}
                  {agent?.name || "Admin"}.
                </h2>

                <p className="mt-2 max-w-2xl text-[13px] leading-6 text-slate-500 sm:text-sm">
                  Manage your clearing agency, agents,
                  SME requests, and shipments from one
                  workspace.
                </p>

              </div>


              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5">

                <CheckCircle2
                  size={14}
                  className="text-emerald-600"
                />

                <span className="text-[10px] font-semibold text-emerald-700">
                  Agency active
                </span>

              </div>

            </div>

          </section>


          {/* =================================================
              AGENCY CODE CARD
          ================================================= */}

          <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,.02)]">

            <div className="flex flex-col gap-5 p-5 sm:p-6 md:flex-row md:items-center md:justify-between">

              <div className="flex min-w-0 items-start gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                  <ShieldCheck
                    size={19}
                    strokeWidth={1.8}
                  />

                </div>

                <div>

                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Agency invitation code
                  </p>

                  <h3 className="mt-1 text-sm font-bold text-slate-800">
                    Invite your clearing agents
                  </h3>

                  <p className="mt-1 max-w-lg text-[11px] leading-5 text-slate-500">
                    Share this code with agents you trust.
                    They can use it to request access to
                    your agency.
                  </p>

                </div>

              </div>


              <div className="flex items-center gap-2">

                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-2.5">

                  <p className="font-mono text-sm font-bold tracking-wider text-[#173563]">
                    {agencyCode}
                  </p>

                </div>

                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="flex h-10 items-center gap-2 rounded-xl bg-[#173563] px-3 text-xs font-semibold text-white transition hover:bg-[#102547]"
                >

                  <Copy size={14} />

                  <span className="hidden sm:inline">
                    {copied ? "Copied" : "Copy"}
                  </span>

                </button>

              </div>

            </div>

          </section>


          {/* =================================================
              STATS
          ================================================= */}

          <section className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">

            {stats.map((stat) => {

              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)]"
                >

                  <div className="flex items-start justify-between">

                    <div>

                      <p className="text-[10px] font-semibold text-slate-400">
                        {stat.title}
                      </p>

                      <p className="mt-2 text-2xl font-bold tracking-tight text-slate-800">
                        {stat.value}
                      </p>

                    </div>

                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconStyle}`}
                    >

                      <Icon
                        size={18}
                        strokeWidth={1.8}
                      />

                    </div>

                  </div>

                  <p className="mt-3 text-[10px] text-slate-400">
                    {stat.description}
                  </p>

                </div>
              );
            })}

          </section>


          {/* =================================================
              QUICK ACTIONS
          ================================================= */}

          <section>

            <div className="mb-4">

              <h2 className="text-sm font-bold text-[#14213D]">
                Quick actions
              </h2>

              <p className="mt-1 text-[11px] text-slate-500">
                Manage your agency from these shortcuts.
              </p>

            </div>


            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">

              {quickActions.map((action) => {

                const Icon = action.icon;

                return (
                  <Link
                    key={action.title}
                    to={action.to}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)] transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_10px_28px_rgba(15,23,42,.06)]"
                  >

                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${action.iconStyle} transition group-hover:scale-105`}
                    >

                      <Icon
                        size={18}
                        strokeWidth={1.8}
                      />

                    </div>

                    <h3 className="mt-3 text-[13px] font-bold text-slate-800 group-hover:text-[#173B6C]">
                      {action.title}
                    </h3>

                    <p className="mt-1.5 text-[11px] leading-5 text-slate-500">
                      {action.description}
                    </p>

                    <div className="mt-3 flex items-center gap-1">

                      <span className="text-[10px] font-semibold text-[#173B6C]">
                        Open
                      </span>

                      <ChevronRight
                        size={12}
                        className="text-[#173B6C] transition-transform group-hover:translate-x-0.5"
                      />

                    </div>

                  </Link>
                );
              })}

            </div>

          </section>


          {/* =================================================
              AGENCY INFORMATION
          ================================================= */}

          <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">

            <div className="mb-5 flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">

                <Building2 size={18} />

              </div>

              <div>

                <h2 className="text-sm font-bold text-slate-800">
                  Agency information
                </h2>

                <p className="text-[10px] text-slate-400">
                  Your registered agency details
                </p>

              </div>

            </div>


            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

              <InfoItem
                label="Agency name"
                value={agency?.agencyName}
              />

              <InfoItem
                label="Registration number"
                value={agency?.registrationNumber}
              />

              <InfoItem
                label="License number"
                value={agency?.licenseNumber}
              />

              <InfoItem
                label="Agency email"
                value={agency?.contactEmail}
              />

              <InfoItem
                label="Phone"
                value={agency?.phone}
              />

              <InfoItem
                label="Location"
                value={`${agency?.city || ""}${
                  agency?.address
                    ? ` · ${agency.address}`
                    : ""
                }`}
              />

            </div>

          </section>


          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="mt-9 flex items-center justify-center border-t border-slate-200 pt-6 text-center text-[10px] text-slate-400">

            ImportEase · Clearing Agency Platform

          </div>

        </main>

      </div>

    </div>
  );
}


/* =========================================================
   SIDEBAR ITEM
========================================================= */

function SidebarItem({
  icon: Icon,
  label,
  to,
  active = false,
  onClick,
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
        active
          ? "bg-blue-50 text-[#173563]"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
      }`}
    >

      <Icon
        size={17}
        strokeWidth={1.8}
      />

      <span>{label}</span>

    </Link>
  );
}


/* =========================================================
   INFO ITEM
========================================================= */

function InfoItem({
  label,
  value,
}) {
  return (
    <div className="rounded-xl bg-slate-50 px-4 py-3">

      <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 truncate text-xs font-semibold text-slate-700">
        {value || "Not provided"}
      </p>

    </div>
  );
}


/* =========================================================
   INITIALS
========================================================= */

function getInitials(name) {
  if (!name) {
    return "AD";
  }

  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
}


export default AgentAdminDashboard;