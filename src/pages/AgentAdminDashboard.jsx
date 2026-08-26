import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  Bell,
  Building2,
  CheckCircle2,
  Clock3,
  Copy,
  FileText,
  LayoutDashboard,
  LogOut,
  Package,
  Search,
  Settings,
  ShieldCheck,
  UserCheck,
  UserPlus,
  Users,
  XCircle,
} from "lucide-react";

function AgentAdminDashboard() {
  const navigate = useNavigate();

  const [joinApplication, setJoinApplication] =
    useState(null);

  const [joinStatus, setJoinStatus] =
    useState("pending");

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadJoinApplication();
  }, []);

  const loadJoinApplication = () => {
    const savedApplication =
      localStorage.getItem(
        "agencyJoinApplication"
      );

    const savedStatus =
      localStorage.getItem(
        "agencyJoinStatus"
      );

    if (savedApplication) {
      const parsed = JSON.parse(
        savedApplication
      );

      setJoinApplication(parsed);

      setJoinStatus(
        savedStatus ||
          parsed.status ||
          "pending"
      );

      return;
    }

    setJoinApplication(null);
    setJoinStatus("pending");
  };

  const handleApproveJoin = () => {
    if (!joinApplication) return;

    const updatedApplication = {
      ...joinApplication,
      status: "approved",
      approvedAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "agencyJoinApplication",
      JSON.stringify(updatedApplication)
    );

    localStorage.setItem(
      "agencyJoinStatus",
      "approved"
    );

    /*
      Store the approved agent separately.
      This gives the frontend a simple list
      that can later be used by Manage Agents.
    */

    const existingAgents = JSON.parse(
      localStorage.getItem(
        "agencyAgents"
      ) || "[]"
    );

    const approvedAgent = {
      id: `AGENT-${Date.now()}`,
      name:
        joinApplication.applicant
          ?.fullName || "Agent",
      email:
        joinApplication.applicant
          ?.email || "",
      phone:
        joinApplication.applicant
          ?.phone || "",
      agencyId:
        joinApplication.agencyId || "",
      agencyName:
        joinApplication.agencyName || "",
      licenseNumber:
        joinApplication.license?.number || "",
      status: "active",
      joinedAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "agencyAgents",
      JSON.stringify([
        ...existingAgents,
        approvedAgent,
      ])
    );

    setJoinApplication(updatedApplication);
    setJoinStatus("approved");
  };

  const handleRejectJoin = () => {
    if (!joinApplication) return;

    const updatedApplication = {
      ...joinApplication,
      status: "rejected",
      rejectedAt: new Date().toISOString(),
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
  };

  const handleCopyCode = async () => {
    const code =
      localStorage.getItem(
        "agencyInviteCode"
      ) || "ABC001";

    try {
      await navigator.clipboard.writeText(code);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(
        "Failed to copy:",
        error
      );
    }
  };

  const handleLogout = () => {
    navigate("/agent-signin");
  };

  const totalAgents = JSON.parse(
    localStorage.getItem(
      "agencyAgents"
    ) || "[]"
  ).length;

  const pendingCount =
    joinApplication &&
    joinStatus === "pending"
      ? 1
      : 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white lg:block">

        {/* LOGO */}

        <div className="flex h-20 items-center border-b border-slate-100 px-6">

          <img
            src="/logo.jpeg"
            alt="ImportEase"
            className="h-11 w-11 object-contain mix-blend-multiply"
          />

          <div className="ml-3">

            <p className="text-lg font-bold text-slate-900">
              Import<span className="text-[#173563]">Ease</span>
            </p>

            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Agency Admin
            </p>

          </div>

        </div>

        {/* NAVIGATION */}

        <nav className="p-4">

          <SidebarItem
            icon={LayoutDashboard}
            label="Dashboard"
            active
            onClick={() =>
              navigate(
                "/agent-admin-dashboard"
              )
            }
          />

          <SidebarItem
            icon={Users}
            label="Agents"
            onClick={() =>
              navigate("/agency-agents")
            }
          />

          <SidebarItem
            icon={UserPlus}
            label="Invite Agents"
            onClick={() =>
              navigate("/agency-invite")
            }
          />

          <SidebarItem
            icon={Package}
            label="Shipments"
            onClick={() =>
              navigate("/agency-shipments")
            }
          />

          <SidebarItem
            icon={FileText}
            label="SME Requests"
            onClick={() =>
              navigate(
                "/agent-marketplace"
              )
            }
          />

          <div className="my-4 border-t border-slate-100" />

          <SidebarItem
            icon={Settings}
            label="Settings"
            onClick={() =>
              navigate("/settings")
            }
          />

        </nav>

        {/* LOGOUT */}

        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-100 p-4">

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={17} />
            Sign Out
          </button>

        </div>

      </aside>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="lg:pl-64">

        {/* TOP BAR */}

        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">

          <div className="flex h-20 items-center justify-between px-5 sm:px-8">

            <div>

              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Agency Management
              </p>

              <h1 className="mt-1 text-xl font-bold text-slate-900">
                Agency Dashboard
              </h1>

            </div>

            <div className="flex items-center gap-3">

              <button
                type="button"
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50"
              >
                <Bell size={18} />

                {pendingCount > 0 && (
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
                )}
              </button>

              <div className="hidden h-10 items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 sm:flex">

                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#173563] text-xs font-bold text-white">
                  AD
                </div>

                <div>

                  <p className="text-xs font-bold text-slate-800">
                    Agency Admin
                  </p>

                  <p className="text-[10px] text-slate-400">
                    Administrator
                  </p>

                </div>

              </div>

            </div>

          </div>

        </header>

        {/* CONTENT */}

        <div className="p-5 sm:p-8">

          {/* WELCOME */}

          <div className="mb-7">

            <h2 className="text-2xl font-bold text-slate-900">
              Welcome back 👋
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage your agency, agents and SME
              requests from one place.
            </p>

          </div>

          {/* =================================================
              STATS
          ================================================= */}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <StatCard
              icon={Users}
              title="Total Agents"
              value={totalAgents}
              description="Active agents"
            />

            <StatCard
              icon={Clock3}
              title="Pending Requests"
              value={pendingCount}
              description="Awaiting review"
            />

            <StatCard
              icon={FileText}
              title="SME Requests"
              value="0"
              description="Marketplace requests"
            />

            <StatCard
              icon={Package}
              title="Active Shipments"
              value="0"
              description="Current shipments"
            />

          </div>

          {/* =================================================
              AGENCY CODE
          ================================================= */}

          <div className="mt-6 rounded-2xl bg-[#173563] p-6 text-white shadow-lg">

            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

              <div>

                <p className="text-xs font-semibold uppercase tracking-wide text-blue-200">
                  Agency Invitation Code
                </p>

                <h3 className="mt-2 text-2xl font-bold tracking-wider">
                  {localStorage.getItem(
                    "agencyInviteCode"
                  ) || "ABC001"}
                </h3>

                <p className="mt-2 text-xs text-blue-200">
                  Share this code with agents who
                  want to join your agency.
                </p>

              </div>

              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-[#173563] transition hover:bg-blue-50"
              >
                <Copy size={16} />

                {copied
                  ? "Copied!"
                  : "Copy Code"}
              </button>

            </div>

          </div>

          {/* =================================================
              PENDING REQUEST
          ================================================= */}

          <div className="mt-7">

            <div className="mb-4 flex items-center justify-between">

              <div>

                <h2 className="text-lg font-bold text-slate-900">
                  Agent Requests
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Review agents requesting to join
                  your agency.
                </p>

              </div>

              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                {pendingCount} Pending
              </span>

            </div>

            {joinApplication &&
            joinStatus === "pending" ? (

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <UserCheck size={22} />
                    </div>

                    <div>

                      <h3 className="text-sm font-bold text-slate-900">
                        {joinApplication
                          .applicant
                          ?.fullName ||
                          "Agent"}
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        {joinApplication
                          .applicant
                          ?.email ||
                          "No email"}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        License:{" "}
                        <span className="font-semibold text-slate-700">
                          {joinApplication
                            .license
                            ?.number ||
                            "—"}
                        </span>
                      </p>

                    </div>

                  </div>

                  <span className="w-fit rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold text-amber-700">
                    Pending Review
                  </span>

                </div>

                {/* DETAILS */}

                <div className="mt-5 grid gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-3">

                  <Detail
                    label="Agency"
                    value={
                      joinApplication.agencyName
                    }
                  />

                  <Detail
                    label="License Type"
                    value={
                      joinApplication
                        .license
                        ?.type
                    }
                  />

                  <Detail
                    label="Application ID"
                    value={
                      joinApplication.id
                    }
                  />

                </div>

                {/* ACTIONS */}

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">

                  <button
                    type="button"
                    onClick={handleApproveJoin}
                    className="flex-1 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
                  >
                    <span className="inline-flex items-center justify-center gap-2">
                      <CheckCircle2 size={17} />
                      Approve Agent
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRejectJoin}
                    className="flex-1 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100"
                  >
                    <span className="inline-flex items-center justify-center gap-2">
                      <XCircle size={17} />
                      Reject Agent
                    </span>
                  </button>

                </div>

              </div>

            ) : joinApplication &&
              joinStatus === "approved" ? (

              <EmptyState
                icon={CheckCircle2}
                title="Agent approved"
                description="The latest agent request has already been approved."
                type="success"
              />

            ) : joinApplication &&
              joinStatus === "rejected" ? (

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

          </div>

          {/* =================================================
              QUICK ACTIONS
          ================================================= */}

          <div className="mt-7">

            <h2 className="text-lg font-bold text-slate-900">
              Quick Actions
            </h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

              <QuickAction
                icon={UserPlus}
                title="Invite Agent"
                description="Invite a clearing agent"
                onClick={() =>
                  navigate(
                    "/agency-invite"
                  )
                }
              />

              <QuickAction
                icon={Users}
                title="Manage Agents"
                description="View agency agents"
                onClick={() =>
                  navigate(
                    "/agency-agents"
                  )
                }
              />

              <QuickAction
                icon={Search}
                title="SME Requests"
                description="Find import requests"
                onClick={() =>
                  navigate(
                    "/agent-marketplace"
                  )
                }
              />

              <QuickAction
                icon={Package}
                title="Shipments"
                description="View agency shipments"
                onClick={() =>
                  navigate(
                    "/agency-shipments"
                  )
                }
              />

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

/* =========================================================
   SIDEBAR ITEM
========================================================= */

function SidebarItem({
  icon: Icon,
  label,
  active = false,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
        active
          ? "bg-blue-50 text-[#173563]"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <Icon size={17} />
      {label}
    </button>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  icon: Icon,
  title,
  value,
  description,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">

      <div className="flex items-center justify-between">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Icon size={19} />
        </div>

        <Activity
          size={16}
          className="text-slate-300"
        />

      </div>

      <p className="mt-5 text-xs font-semibold text-slate-500">
        {title}
      </p>

      <p className="mt-1 text-2xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-[11px] text-slate-400">
        {description}
      </p>

    </div>
  );
}

/* =========================================================
   DETAIL
========================================================= */

function Detail({
  label,
  value,
}) {
  return (
    <div>

      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
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
      : "bg-slate-100 text-slate-400";

  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">

      <div
        className={`mx-auto flex h-12 w-12 items-center justify-center rounded-xl ${iconClasses}`}
      >
        <Icon size={22} />
      </div>

      <h3 className="mt-4 text-sm font-bold text-slate-700">
        {title}
      </h3>

      <p className="mt-1 text-xs text-slate-400">
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
      className="rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
    >

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Icon size={18} />
      </div>

      <h3 className="mt-4 text-sm font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>

    </button>
  );
}

export default AgentAdminDashboard;