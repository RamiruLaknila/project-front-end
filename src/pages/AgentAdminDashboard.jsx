import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  Building2,
  CheckCircle2,
  Clock3,
  Copy,
  ClipboardList,
  FileText,
  LogOut,
  Menu,
  Package,
  RefreshCw,
  Search,
  Settings,
  UserCheck,
  UserPlus,
  Users,
  X,
  XCircle,
} from "lucide-react";

function AgentAdminDashboard() {
  const navigate = useNavigate();

  const [agency, setAgency] = useState(null);
  const [currentAdmin, setCurrentAdmin] = useState(null);

  const [joinApplication, setJoinApplication] = useState(null);
  const [joinStatus, setJoinStatus] = useState("pending");

  const [copied, setCopied] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  /* =========================================================
     LOAD AGENCY / ADMIN
  ========================================================= */

  const loadAgencyData = () => {
    try {
      const storedAgency = localStorage.getItem("clearingAgency");
      const storedAdmin = localStorage.getItem("clearingAgent");

      if (!storedAgency || !storedAdmin) {
        navigate("/agent-signin");
        return;
      }

      const parsedAgency = JSON.parse(storedAgency);
      const parsedAdmin = JSON.parse(storedAdmin);

      if (parsedAdmin.role !== "admin") {
        navigate("/agent-signin");
        return;
      }

      setAgency(parsedAgency);
      setCurrentAdmin(parsedAdmin);
    } catch (error) {
      console.error("Failed to load agency data:", error);
      navigate("/agent-signin");
    }
  };

  /* =========================================================
     LOAD JOIN APPLICATION
  ========================================================= */

  const loadJoinApplication = () => {
    try {
      const savedApplication = localStorage.getItem(
        "agencyJoinApplication"
      );

      const savedStatus = localStorage.getItem("agencyJoinStatus");

      if (savedApplication) {
        const parsed = JSON.parse(savedApplication);

        setJoinApplication(parsed);

        setJoinStatus(
          savedStatus || parsed.status || "pending"
        );

        return;
      }

      setJoinApplication(null);
      setJoinStatus("pending");
    } catch (error) {
      console.error("Failed to load join application:", error);
    }
  };

  useEffect(() => {
    loadAgencyData();
    loadJoinApplication();
  }, []);

  /* =========================================================
     REFRESH
  ========================================================= */

  const handleRefresh = () => {
    loadAgencyData();
    loadJoinApplication();
  };

  /* =========================================================
     AGENTS
  ========================================================= */

  const totalAgents = useMemo(() => {
    try {
      const storedAgents = JSON.parse(
        localStorage.getItem("agencyAgents") || "[]"
      );

      return storedAgents.filter((agent) => {
        const agentAgencyId =
          agent.agencyId || agent.agencyCode;

        const currentAgencyId =
          agency?.id || agency?.code;

        return (
          !currentAgencyId ||
          agentAgencyId === currentAgencyId
        );
      }).length;
    } catch {
      return 0;
    }
  }, [agency, joinStatus]);

  /* =========================================================
     PENDING COUNT
  ========================================================= */

  const pendingCount =
    joinApplication && joinStatus === "pending" ? 1 : 0;

  /* =========================================================
     APPROVE JOIN REQUEST
  ========================================================= */

  const handleApproveJoin = () => {
    if (!joinApplication || processing) {
      return;
    }

    setProcessing(true);

    try {
      const now = new Date().toISOString();

      const updatedApplication = {
        ...joinApplication,
        status: "approved",
        approvedAt: now,
      };

      localStorage.setItem(
        "agencyJoinApplication",
        JSON.stringify(updatedApplication)
      );

      localStorage.setItem(
        "agencyJoinStatus",
        "approved"
      );

      const existingAgents = JSON.parse(
        localStorage.getItem("agencyAgents") || "[]"
      );

      const applicantName =
        joinApplication.applicant?.fullName ||
        joinApplication.name ||
        "Agent";

      const applicantEmail =
        joinApplication.applicant?.email ||
        joinApplication.email ||
        "";

      const applicantPhone =
        joinApplication.applicant?.phone ||
        joinApplication.phone ||
        "";

      const approvedAgent = {
        id:
          joinApplication.id ||
          `AGENT-${Date.now()}`,

        name: applicantName,

        email: applicantEmail,

        phone: applicantPhone,

        agencyId:
          joinApplication.agencyId ||
          agency?.id ||
          "",

        agencyName:
          joinApplication.agencyName ||
          agency?.name ||
          agency?.agencyName ||
          "",

        agencyCode:
          joinApplication.agencyCode ||
          agency?.code ||
          "",

        licenseNumber:
          joinApplication.license?.number ||
          "",

        role: "agent",

        status: "approved",

        agentStatus: "approved",

        requestedAt:
          joinApplication.requestedAt ||
          now,

        joinedAt: now,

        approvedAt: now,
      };

      const existingIndex = existingAgents.findIndex(
        (agent) =>
          agent.email?.toLowerCase() ===
          applicantEmail?.toLowerCase()
      );

      let updatedAgents;

      if (existingIndex >= 0) {
        updatedAgents = existingAgents.map(
          (agent, index) => {
            if (index !== existingIndex) {
              return agent;
            }

            return {
              ...agent,
              ...approvedAgent,
            };
          }
        );
      } else {
        updatedAgents = [
          ...existingAgents,
          approvedAgent,
        ];
      }

      localStorage.setItem(
        "agencyAgents",
        JSON.stringify(updatedAgents)
      );

      setJoinApplication(updatedApplication);
      setJoinStatus("approved");
    } catch (error) {
      console.error("Failed to approve agent:", error);
    } finally {
      setTimeout(() => {
        setProcessing(false);
      }, 300);
    }
  };

  /* =========================================================
     REJECT JOIN REQUEST
  ========================================================= */

  const handleRejectJoin = () => {
    if (!joinApplication || processing) {
      return;
    }

    setProcessing(true);

    try {
      const now = new Date().toISOString();

      const updatedApplication = {
        ...joinApplication,
        status: "rejected",
        rejectedAt: now,
      };

      localStorage.setItem(
        "agencyJoinApplication",
        JSON.stringify(updatedApplication)
      );

      localStorage.setItem(
        "agencyJoinStatus",
        "rejected"
      );

      setJoinApplication(updatedApplication);
      setJoinStatus("rejected");
    } catch (error) {
      console.error("Failed to reject agent:", error);
    } finally {
      setTimeout(() => {
        setProcessing(false);
      }, 300);
    }
  };

  /* =========================================================
     COPY INVITATION CODE
  ========================================================= */

  const handleCopyCode = async () => {
    const code =
      localStorage.getItem("agencyInviteCode") ||
      "ABC001";

    try {
      await navigator.clipboard.writeText(code);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
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
     LOADING
  ========================================================= */

  if (!agency || !currentAdmin) {
    return null;
  }

  const agencyName =
    agency.agencyName ||
    agency.name ||
    "Your Agency";

  const adminName =
    currentAdmin.name ||
    "Agency Admin";

  const invitationCode =
    localStorage.getItem("agencyInviteCode") ||
    "ABC001";

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-900">

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
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
                <span className="text-slate-900">Ease</span>
              </p>
              <p className="text-[8px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                Agent Platform
              </p>
            </div>
          </Link>

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
                  {agencyName}
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

      {/* MAIN CONTENT */}
      <div className="lg:ml-[250px]">
        {/* TOP BAR */}
        <header className="sticky top-0 z-30 flex h-[70px] items-center border-b border-slate-200 bg-white/95 px-5 backdrop-blur-xl sm:px-8">
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
              Agency Dashboard
            </h1>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <button
              type="button"
              className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50"
            >
              <Bell size={17} />
              {pendingCount > 0 && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
              )}
            </button>

            <div className="hidden h-7 w-px bg-slate-200 sm:block" />

            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#173563] text-[10px] font-bold text-white">
                {getInitials(adminName)}
              </div>

              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-slate-800">
                  {adminName}
                </p>
                <p className="text-[9px] text-slate-400">
                  Administrator
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* PAGE BODY */}
        <main className="mx-auto w-full max-w-[1180px] px-5 py-7 sm:px-8 lg:py-9">
          {/* HEADER */}
          <section className="mb-7">
            <Link
              to="/agent-admin-dashboard"
              className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              <ArrowLeft size={14} />
              Back to Dashboard
            </Link>

            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5">
                  <Building2 size={13} className="text-blue-600" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-700">
                    Overview
                  </span>
                </div>

                <h2 className="text-[28px] font-bold tracking-[-0.04em] text-[#14213D] sm:text-[38px]">
                  Welcome back 👋
                </h2>

                <p className="mt-2 max-w-2xl text-[13px] leading-6 text-slate-500 sm:text-sm">
                  Manage your agency, agents and SME requests from one place.
                </p>
              </div>

              <Link
                to="/agency-invite"
                className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#173563] px-4 py-3 text-xs font-semibold text-white transition hover:bg-[#102547]"
              >
                <UserPlus size={15} />
                Invite Agent
              </Link>
            </div>
          </section>

          {/* SUMMARY CARDS GRID (Matches Agents Page Card Styling) */}
          <section className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard
              icon={Users}
              label="Total Agents"
              value={totalAgents}
              sublabel="Active agents"
              iconStyle="bg-blue-50 text-blue-600"
            />

            <SummaryCard
              icon={Clock3}
              label="Pending Requests"
              value={pendingCount}
              sublabel="Awaiting review"
              iconStyle="bg-amber-50 text-amber-700"
            />

            <SummaryCard
              icon={ClipboardList}
              label="SME Requests"
              value="0"
              sublabel="Marketplace requests"
              iconStyle="bg-purple-50 text-purple-600"
            />

            <SummaryCard
              icon={Package}
              label="Active Shipments"
              value="0"
              sublabel="Current shipments"
              iconStyle="bg-emerald-50 text-emerald-700"
            />
          </section>

          {/* INVITATION CODE */}
          <section className="mb-7">
            <div className="rounded-2xl border border-[#173563] bg-[#173563] p-5 text-white shadow-[0_2px_10px_rgba(15,23,42,.02)]">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div>
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5">
                    <CheckCircle2 size={12} className="text-blue-200" />
                    <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-blue-100">
                      Agency invitation
                    </span>
                  </div>

                  <h3 className="text-xl font-bold tracking-[0.12em]">
                    {invitationCode}
                  </h3>

                  <p className="mt-2 max-w-lg text-[11px] leading-5 text-blue-100">
                    Share this code with agents who want to join your agency.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-bold text-[#173563] transition hover:bg-blue-50"
                >
                  <Copy size={15} />
                  {copied ? "Copied!" : "Copy Code"}
                </button>
              </div>
            </div>
          </section>

          {/* RECENT ACTIVITY */}
          <section className="mb-7">
            <div className="mb-4">
              <h2 className="text-sm font-bold text-[#14213D]">
                Recent Activity
              </h2>
              <p className="mt-1 text-[11px] text-slate-500">
                Agents waiting for your approval and recent agency updates.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,.02)]">
              {joinApplication && joinStatus === "pending" ? (
                <div className="p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <UserCheck size={21} />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-800">
                            {joinApplication.applicant?.fullName ||
                              joinApplication.name ||
                              "Agent"}
                          </h3>
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[9px] font-semibold text-amber-700">
                            <Clock3 size={10} />
                            Pending
                          </span>
                        </div>
                        <p className="mt-1 text-[10px] text-slate-400">
                          Agent application awaiting approval
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        document
                          .getElementById("agent-requests-section")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-[10px] font-semibold text-slate-600 transition hover:bg-slate-50"
                    >
                      Review request
                      <ArrowLeft size={12} className="rotate-180" />
                    </button>
                  </div>
                </div>
              ) : (
                <EmptyState
                  icon={CheckCircle2}
                  title="No recent activity"
                  description="New agent applications and agency updates will appear here."
                />
              )}
            </div>
          </section>

          {/* AGENT REQUESTS */}
          <section id="agent-requests-section" className="mb-7">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-[#14213D]">
                    Agent Requests
                  </h2>
                  {pendingCount > 0 && (
                    <span className="rounded-full bg-amber-50 px-2 py-1 text-[9px] font-semibold text-amber-700">
                      {pendingCount}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[11px] text-slate-500">
                  Review agents requesting to join your agency.
                </p>
              </div>

              <button
                type="button"
                onClick={handleRefresh}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                <RefreshCw size={13} />
                Refresh
              </button>
            </div>

            {joinApplication && joinStatus === "pending" ? (
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,.02)]">
                <div className="p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <UserCheck size={21} />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-800">
                            {joinApplication.applicant?.fullName ||
                              joinApplication.name ||
                              "Agent"}
                          </h3>
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[9px] font-semibold text-amber-700">
                            <Clock3 size={10} />
                            Pending
                          </span>
                        </div>

                        <div className="mt-1 flex flex-wrap items-center gap-3 text-[10px] text-slate-400">
                          <span className="inline-flex items-center gap-1">
                            <Users size={11} />
                            Agent applicant
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <FileText size={11} />
                            License:{" "}
                            <span className="font-semibold text-slate-600">
                              {joinApplication.license?.number || "—"}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* DETAILS */}
                  <div className="mt-5 grid gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-3">
                    <Detail
                      label="Email"
                      value={
                        joinApplication.applicant?.email ||
                        joinApplication.email ||
                        "—"
                      }
                    />
                    <Detail
                      label="License Type"
                      value={joinApplication.license?.type}
                    />
                    <Detail
                      label="Application ID"
                      value={joinApplication.id}
                    />
                  </div>

                  {/* ACTIONS */}
                  <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
                    <button
                      type="button"
                      onClick={handleApproveJoin}
                      disabled={processing}
                      className="flex-1 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <span className="inline-flex items-center justify-center gap-2">
                        <CheckCircle2 size={15} />
                        {processing ? "Updating..." : "Approve Agent"}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={handleRejectJoin}
                      disabled={processing}
                      className="flex-1 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <span className="inline-flex items-center justify-center gap-2">
                        <XCircle size={15} />
                        Reject Agent
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ) : joinApplication && joinStatus === "approved" ? (
              <EmptyState
                icon={CheckCircle2}
                title="Agent approved"
                description="The latest agent request has already been approved."
                type="success"
              />
            ) : joinApplication && joinStatus === "rejected" ? (
              <EmptyState
                icon={XCircle}
                title="Agent request rejected"
                description="The latest agent request was rejected."
                type="danger"
              />
            ) : (
              <EmptyState
                icon={UserPlus}
                title="No pending agent requests"
                description="New agent applications will appear here."
              />
            )}
          </section>

          {/* QUICK ACTIONS */}
          <section>
            <div className="mb-4">
              <h2 className="text-sm font-bold text-[#14213D]">
                Quick Actions
              </h2>
              <p className="mt-1 text-[11px] text-slate-500">
                Access your most commonly used agency tools.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <QuickAction
                icon={UserPlus}
                title="Invite Agent"
                description="Invite a clearing agent"
                onClick={() => navigate("/agency-invite")}
              />

              <QuickAction
                icon={Users}
                title="Manage Agents"
                description="View agency agents"
                onClick={() => navigate("/agency-agents")}
              />

              <QuickAction
                icon={Search}
                title="SME Requests"
                description="Find import requests"
                onClick={() => navigate("/agent-marketplace")}
              />

              <QuickAction
                icon={Package}
                title="Shipments"
                description="View agency shipments"
                onClick={() => navigate("/agent-shipments")}
              />
            </div>
          </section>

          {/* FOOTER */}
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
      <Icon size={17} strokeWidth={1.8} />
      <span>{label}</span>
    </Link>
  );
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
  icon: Icon,
  label,
  value,
  sublabel,
  iconStyle,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold text-slate-400">
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-800">
            {value}
          </p>
          {sublabel && (
            <p className="mt-1 text-[9px] text-slate-400">{sublabel}</p>
          )}
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconStyle}`}
        >
          <Icon size={18} strokeWidth={1.8} />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   DETAIL
========================================================= */

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400">
        {label}
      </p>
      <p className="mt-1 truncate text-xs font-bold text-slate-700">
        {value || "—"}
      </p>
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({
  icon: Icon,
  title,
  description,
  type = "default",
}) {
  const iconClasses =
    type === "success"
      ? "bg-emerald-50 text-emerald-600"
      : type === "danger"
      ? "bg-red-50 text-red-600"
      : "bg-slate-50 text-slate-400";

  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconClasses}`}
      >
        <Icon size={22} />
      </div>

      <h3 className="mt-4 text-sm font-bold text-slate-700">
        {title}
      </h3>

      <p className="mt-1 max-w-sm text-[11px] leading-5 text-slate-400">
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   QUICK ACTION
========================================================= */

function QuickAction({
  icon: Icon,
  title,
  description,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-[0_2px_10px_rgba(15,23,42,.02)] transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Icon size={18} strokeWidth={1.8} />
      </div>

      <h3 className="mt-4 text-sm font-bold text-slate-800">
        {title}
      </h3>

      <p className="mt-1 text-[11px] leading-5 text-slate-500">
        {description}
      </p>
    </button>
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