import { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Building2,
  Check,
  CheckCircle2,
  Clipboard,
  Copy,
  Mail,
  Menu,
  Send,
  Settings,
  Users,
  UserPlus,
  LogOut,
  X,
} from "lucide-react";

function AgencyInvite() {
  const navigate = useNavigate();

  const [agency, setAgency] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
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
      setAdmin(parsedAdmin);
    } catch (error) {
      console.error("Failed to load agency information:", error);
      navigate("/agent-signin");
    }
  }, [navigate]);

  const agencyCode = agency?.code || agency?.id || "AG-000000";

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(agencyCode);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy agency code:", error);
    }
  };

  const inviteMessage =
    `You are invited to join ${
      agency?.agencyName ||
      agency?.name ||
      "our clearing agency"
    } on ImportEase.\n\n` +
    `Use agency code: ${agencyCode}\n\n` +
    `Create or sign in to your ImportEase agent account, select "Join an Existing Agency", and enter this code to request access.`;

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(inviteMessage);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy invitation:", error);
    }
  };

  const handleSendInvitation = (event) => {
    event.preventDefault();

    setError("");
    setSent(false);

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Please enter the agent's email address.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const existingInvitations = JSON.parse(
        localStorage.getItem("agencyInvitations") || "[]"
      );

      const currentAgencyId = agency?.id || agency?.code;

      const alreadyInvited = existingInvitations.some(
        (invitation) =>
          invitation.email?.toLowerCase() ===
            trimmedEmail.toLowerCase() &&
          invitation.agencyId === currentAgencyId
      );

      if (alreadyInvited) {
        setError("An invitation has already been sent to this email.");
        return;
      }

      const invitation = {
        id: `invite-${Date.now()}`,
        email: trimmedEmail,
        agencyId: currentAgencyId,
        agencyCode,
        agencyName:
          agency?.agencyName ||
          agency?.name ||
          "Clearing Agency",
        invitedBy: admin?.name || "Agency Administrator",
        status: "sent",
        message: message.trim() || inviteMessage,
        createdAt: new Date().toISOString(),
      };

      existingInvitations.push(invitation);

      localStorage.setItem(
        "agencyInvitations",
        JSON.stringify(existingInvitations)
      );

      setEmail("");
      setMessage("");
      setSent(true);
    } catch (error) {
      console.error("Failed to send invitation:", error);
      setError("Unable to send the invitation. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("clearingAgent");
    localStorage.removeItem("agentOnboardingType");
    localStorage.removeItem("agentOnboardingComplete");

    navigate("/agent-signin");
  };

  if (!agency || !admin) {
    return null;
  }

  const adminName = admin.name || "Agency Admin";

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-900">

      {/* Mobile Overlay */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[250px] flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >

        {/* Logo */}

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

              <p className="text-[18px] font-bold tracking-tight text-[#173563]">
                Import
                <span className="text-slate-900">Ease</span>
              </p>

              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
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

        {/* Navigation */}

        <nav className="flex-1 space-y-1.5 p-3">

          <SidebarItem
            icon={Building2}
            label="Dashboard"
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
            active
            onClick={() => setSidebarOpen(false)}
          />

          <SidebarItem
            icon={Clipboard}
            label="SME Requests"
            to="/agent-marketplace"
            onClick={() => setSidebarOpen(false)}
          />

        </nav>

        {/* Bottom Profile */}

        <div className="border-t border-slate-100 p-3">

          <div className="mb-3 flex items-center gap-3 rounded-xl px-2 py-2">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#173563] text-xs font-bold text-white">
              {getInitials(adminName)}
            </div>

            <div className="min-w-0">

              <p className="truncate text-sm font-bold text-slate-800">
                {adminName}
              </p>

              <p className="mt-0.5 text-[11px] text-slate-400">
                Administrator
              </p>

            </div>

          </div>

          <SidebarItem
            icon={Settings}
            label="Settings"
            to="/agent-settings"
            onClick={() => setSidebarOpen(false)}
          />

          <button
            type="button"
            onClick={handleLogout}
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>

      </aside>

      {/* Main Area */}

      <div className="lg:ml-[250px]">

        {/* Header */}

        <header className="sticky top-0 z-30 flex h-[70px] items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur sm:px-8">

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 lg:hidden"
            >
              <Menu size={19} />
            </button>

            <div>

              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                Agent Workspace
              </p>

              <h1 className="text-base font-bold text-slate-800">
                Invite Agents
              </h1>

            </div>

          </div>

          <div className="flex items-center gap-3">

            <div className="hidden text-right sm:block">

              <p className="text-sm font-bold text-slate-800">
                {adminName}
              </p>

              <p className="text-[10px] text-slate-400">
                Administrator
              </p>

            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#173563] text-xs font-bold text-white">
              {getInitials(adminName)}
            </div>

          </div>

        </header>

        {/* Content */}

        <main className="px-5 py-7 sm:px-8 lg:px-10">

          <div className="mx-auto max-w-[1180px]">

            {/* Back */}

            <Link
              to="/agent-admin-dashboard"
              className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#173563]"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>

            {/* Page Heading */}

            <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">

              <div>

                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#2563EB]">

                  <UserPlus size={14} />

                  Agent onboarding

                </div>

                <h2 className="text-[32px] font-bold leading-tight tracking-tight text-[#173563] sm:text-[40px]">
                  Invite Agents
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-[15px]">
                  Invite clearing agents to join your agency and collaborate
                  on SME import requests.
                </p>

              </div>

              <Link
                to="/agency-agents"
                className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              >
                <Users size={17} />
                Manage Agents
              </Link>

            </div>

            {/* Main Grid */}

            <div className="grid gap-6 lg:grid-cols-[1.35fr_0.9fr]">

              {/* Invite Form */}

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="mb-6">

                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
                    <Mail size={19} />
                  </div>

                  <h3 className="text-base font-bold text-slate-800">
                    Send an invitation
                  </h3>

                  <p className="mt-1 text-sm leading-5 text-slate-500">
                    Send an invitation to an agent's email address.
                  </p>

                </div>

                {error && (
                  <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">

                    <X size={17} className="mt-0.5 shrink-0" />

                    <p>{error}</p>

                  </div>
                )}

                {sent && (
                  <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">

                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0 text-emerald-600"
                    />

                    <div>

                      <p className="text-sm font-semibold text-emerald-800">
                        Invitation sent successfully
                      </p>

                      <p className="mt-1 text-xs leading-5 text-emerald-700">
                        The invitation has been saved and is ready for the
                        agent to use.
                      </p>

                    </div>

                  </div>
                )}

                <form
                  onSubmit={handleSendInvitation}
                  className="space-y-5"
                >

                  <div>

                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Agent email address
                    </label>

                    <input
                      type="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        setError("");
                        setSent(false);
                      }}
                      placeholder="agent@example.com"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-50"
                    />

                  </div>

                  <div>

                    <div className="mb-2 flex items-center justify-between">

                      <label className="text-sm font-semibold text-slate-700">
                        Personal message
                      </label>

                      <span className="text-xs text-slate-400">
                        Optional
                      </span>

                    </div>

                    <textarea
                      value={message}
                      onChange={(event) =>
                        setMessage(event.target.value)
                      }
                      placeholder="Add a short message for the agent..."
                      rows={5}
                      className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-50"
                    />

                  </div>

                  <button
                    type="submit"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#173563] px-5 text-sm font-semibold text-white transition hover:bg-[#10294d]"
                  >
                    <Send size={17} />
                    Send Invitation
                  </button>

                </form>

              </section>

              {/* Right Column */}

              <div className="space-y-6">

                {/* Agency Code */}

                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                  <div className="mb-5 flex items-start justify-between gap-4">

                    <div>

                      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                        Your Agency
                      </p>

                      <h3 className="mt-1 text-base font-bold text-slate-800">
                        {agency?.agencyName ||
                          agency?.name ||
                          "Clearing Agency"}
                      </h3>

                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
                      <Building2 size={18} />
                    </div>

                  </div>

                  <p className="mb-4 text-sm leading-5 text-slate-500">
                    Agents can use this code when joining your agency.
                  </p>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400">
                      Agency Code
                    </p>

                    <div className="flex items-center justify-between gap-3">

                      <p className="font-mono text-lg font-bold tracking-wider text-[#173563]">
                        {agencyCode}
                      </p>

                      <button
                        type="button"
                        onClick={handleCopyCode}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
                      >

                        {copied ? (
                          <>
                            <Check size={14} />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy size={14} />
                            Copy
                          </>
                        )}

                      </button>

                    </div>

                  </div>

                  <div className="mt-4 rounded-xl bg-blue-50 p-4">

                    <p className="text-sm leading-5 text-blue-800">
                      Share this agency code with trusted agents. They can
                      enter it during onboarding to request access.
                    </p>

                  </div>

                </section>

                {/* Quick Invite Message */}

                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                  <div className="mb-4">

                    <h3 className="text-base font-bold text-slate-800">
                      Quick invite message
                    </h3>

                    <p className="mt-1 text-sm leading-5 text-slate-500">
                      Copy this message and send it through your preferred
                      communication channel.
                    </p>

                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                    <p className="whitespace-pre-line text-sm leading-6 text-slate-600">
                      {inviteMessage}
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={handleCopyMessage}
                    className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >

                    {copied ? (
                      <>
                        <Check size={16} />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        Copy Message
                      </>
                    )}

                  </button>

                </section>

              </div>

            </div>

            {/* Footer */}

            <div className="mt-8 border-t border-slate-200 pt-5">

              <p className="text-xs leading-5 text-slate-400">
                Only invite agents you trust to work under your agency.
                Agency administrators are responsible for managing agent
                access.
              </p>

            </div>

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
      className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
        active
          ? "bg-blue-50 text-[#173563]"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
      }`}
    >
      <Icon size={18} strokeWidth={1.8} />
      <span>{label}</span>
    </Link>
  );
}

/* =========================================================
   GET INITIALS
========================================================= */

function getInitials(name) {
  if (!name) return "AD";

  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${
    words[words.length - 1][0]
  }`.toUpperCase();
}

export default AgencyInvite;