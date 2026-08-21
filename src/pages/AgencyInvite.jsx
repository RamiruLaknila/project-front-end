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

  /* =========================================================
     LOAD AGENCY
  ========================================================= */

  useEffect(() => {
    try {
      const storedAgency =
        localStorage.getItem("clearingAgency");

      const storedAdmin =
        localStorage.getItem("clearingAgent");

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
      console.error(
        "Failed to load agency information:",
        error
      );

      navigate("/agent-signin");
    }
  }, [navigate]);

  /* =========================================================
     AGENCY CODE
  ========================================================= */

  const agencyCode =
    agency?.code ||
    agency?.id ||
    "AG-000000";

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
     INVITE MESSAGE
  ========================================================= */

  const inviteMessage =
    `You are invited to join ${
      agency?.agencyName ||
      agency?.name ||
      "our clearing agency"
    } on ImportEase.\n\n` +
    `Use agency code: ${agencyCode}\n\n` +
    `Create or sign in to your ImportEase agent account, select "Join an Existing Agency", and enter this code to request access.`;

  /* =========================================================
     COPY INVITE MESSAGE
  ========================================================= */

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(
        inviteMessage
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(
        "Failed to copy invitation:",
        error
      );
    }
  };

  /* =========================================================
     SEND INVITATION
  ========================================================= */

  const handleSendInvitation = (event) => {
    event.preventDefault();

    setError("");
    setSent(false);

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError(
        "Please enter the agent's email address."
      );
      return;
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(trimmedEmail)) {
      setError(
        "Please enter a valid email address."
      );
      return;
    }

    try {
      const existingInvitations = JSON.parse(
        localStorage.getItem(
          "agencyInvitations"
        ) || "[]"
      );

      const currentAgencyId =
        agency?.id || agency?.code;

      const alreadyInvited =
        existingInvitations.some(
          (invitation) =>
            invitation.email?.toLowerCase() ===
              trimmedEmail.toLowerCase() &&
            invitation.agencyId ===
              currentAgencyId
        );

      if (alreadyInvited) {
        setError(
          "An invitation has already been sent to this email."
        );
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

        invitedBy:
          admin?.name ||
          "Agency Administrator",

        status: "sent",

        message:
          message.trim() || inviteMessage,

        createdAt:
          new Date().toISOString(),
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
      console.error(
        "Failed to send invitation:",
        error
      );

      setError(
        "Unable to send the invitation. Please try again."
      );
    }
  };

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = () => {
    localStorage.removeItem("clearingAgent");
    localStorage.removeItem(
      "agentOnboardingType"
    );
    localStorage.removeItem(
      "agentOnboardingComplete"
    );

    navigate("/agent-signin");
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (!agency || !admin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-900">

      {/* =====================================================
          MOBILE OVERLAY
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
            onClick={() =>
              setSidebarOpen(false)
            }
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

          <button
            type="button"
            onClick={() =>
              setSidebarOpen(false)
            }
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
                  {agency.agencyName ||
                    agency.name ||
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
            to="/agent-admin-dashboard"
            onClick={() =>
              setSidebarOpen(false)
            }
          />

          <SidebarItem
            icon={Users}
            label="Agents"
            to="/agency-agents"
            onClick={() =>
              setSidebarOpen(false)
            }
          />

          <SidebarItem
            icon={UserPlus}
            label="Invite Agents"
            active
            to="/agency-invite"
            onClick={() =>
              setSidebarOpen(false)
            }
          />

          <SidebarItem
            icon={Clipboard}
            label="SME Requests"
            to="/agent-marketplace"
            onClick={() =>
              setSidebarOpen(false)
            }
          />

          <SidebarItem
            icon={Clipboard}
            label="Shipments"
            to="/agent-shipments"
            onClick={() =>
              setSidebarOpen(false)
            }
          />

        </nav>

        {/* BOTTOM */}

        <div className="border-t border-slate-100 p-3">

          <SidebarItem
            icon={Settings}
            label="Settings"
            to="/agent-settings"
            onClick={() =>
              setSidebarOpen(false)
            }
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
          MAIN
      ===================================================== */}

      <div className="lg:ml-[250px]">

        {/* TOP BAR */}

        <header className="sticky top-0 z-30 flex h-[70px] items-center border-b border-slate-200 bg-white/95 px-5 backdrop-blur-xl sm:px-8">

          <button
            type="button"
            onClick={() =>
              setSidebarOpen(true)
            }
            className="mr-3 flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <Menu size={19} />
          </button>

          <div>

            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
              Agency workspace
            </p>

            <h1 className="text-sm font-bold text-slate-800">
              Invite Agents
            </h1>

          </div>

          <div className="ml-auto flex items-center gap-3">

            <div className="hidden h-7 w-px bg-slate-200 sm:block" />

            <div className="flex items-center gap-2">

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#173563] text-[10px] font-bold text-white">
                {getInitials(
                  admin.name || "Admin"
                )}
              </div>

              <div className="hidden sm:block">

                <p className="text-xs font-semibold text-slate-800">
                  {admin.name ||
                    "Agency Admin"}
                </p>

                <p className="text-[9px] text-slate-400">
                  Administrator
                </p>

              </div>

            </div>

          </div>

        </header>

        {/* =====================================================
            CONTENT
        ===================================================== */}

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

                  <UserPlus
                    size={13}
                    className="text-blue-600"
                  />

                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-700">
                    Agent onboarding
                  </span>

                </div>

                <h2 className="text-[28px] font-bold tracking-[-0.04em] text-[#14213D] sm:text-[38px]">
                  Invite Agents
                </h2>

                <p className="mt-2 max-w-2xl text-[13px] leading-6 text-slate-500 sm:text-sm">
                  Invite clearing agents to join your
                  agency and manage them from your
                  agency workspace.
                </p>

              </div>

              <Link
                to="/agency-agents"
                className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <Users size={15} />
                Manage Agents
              </Link>

            </div>

          </section>

          {/* =====================================================
              GRID
          ===================================================== */}

          <section className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">

            {/* =================================================
                EMAIL INVITE
            ================================================= */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)] sm:p-6">

              <div className="mb-6 flex items-start gap-3">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Mail size={19} />
                </div>

                <div>

                  <h2 className="text-sm font-bold text-slate-800">
                    Send an invitation
                  </h2>

                  <p className="mt-1 text-[11px] leading-5 text-slate-500">
                    Send an invitation to a clearing
                    agent using their email address.
                  </p>

                </div>

              </div>

              {/* ERROR */}

              {error && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600">
                  {error}
                </div>
              )}

              {/* SUCCESS */}

              {sent && (
                <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">

                  <CheckCircle2
                    size={17}
                    className="mt-0.5 shrink-0 text-emerald-600"
                  />

                  <div>

                    <p className="text-xs font-semibold text-emerald-800">
                      Invitation recorded
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-emerald-700">
                      The invitation has been saved.
                      Share the agency code with the
                      agent so they can request access.
                    </p>

                  </div>

                </div>
              )}

              <form
                onSubmit={handleSendInvitation}
                className="space-y-5"
              >

                {/* EMAIL */}

                <div>

                  <label
                    htmlFor="agentEmail"
                    className="mb-1.5 block text-xs font-semibold text-slate-700"
                  >
                    Agent email
                  </label>

                  <div className="relative">

                    <Mail
                      size={16}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="agentEmail"
                      type="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(
                          event.target.value
                        );
                        setError("");
                        setSent(false);
                      }}
                      placeholder="agent@example.com"
                      className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#173563] focus:ring-2 focus:ring-[#173563]/10"
                    />

                  </div>

                </div>

                {/* MESSAGE */}

                <div>

                  <label
                    htmlFor="message"
                    className="mb-1.5 block text-xs font-semibold text-slate-700"
                  >
                    Personal message

                    <span className="ml-1 font-normal text-slate-400">
                      Optional
                    </span>

                  </label>

                  <textarea
                    id="message"
                    value={message}
                    onChange={(event) => {
                      setMessage(
                        event.target.value
                      );
                      setSent(false);
                    }}
                    rows={5}
                    placeholder="Add a short message for the agent..."
                    className="w-full resize-none rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#173563] focus:ring-2 focus:ring-[#173563]/10"
                  />

                </div>

                {/* SEND */}

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#173563] py-3 text-sm font-semibold text-white shadow-lg shadow-[#173563]/10 transition hover:bg-[#102547]"
                >
                  <Send size={16} />
                  Send Invitation
                </button>

              </form>

            </div>

            {/* =================================================
                RIGHT SIDE
            ================================================= */}

            <div className="space-y-5">

              {/* AGENCY CODE */}

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)] sm:p-6">

                <div className="flex items-start gap-3">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Building2 size={19} />
                  </div>

                  <div>

                    <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                      Your agency
                    </p>

                    <h2 className="mt-1 text-sm font-bold text-slate-800">
                      {agency.agencyName ||
                        agency.name ||
                        "Your Agency"}
                    </h2>

                    <p className="mt-1 text-[11px] text-slate-500">
                      Share this code with trusted
                      clearing agents.
                    </p>

                  </div>

                </div>

                <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">

                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Agency code
                  </p>

                  <div className="mt-2 flex items-center justify-between gap-3">

                    <p className="font-mono text-lg font-bold tracking-wider text-[#173563]">
                      {agencyCode}
                    </p>

                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#173563] px-3 text-[10px] font-semibold text-white hover:bg-[#102547]"
                    >

                      {copied ? (
                        <Check size={14} />
                      ) : (
                        <Copy size={14} />
                      )}

                      {copied
                        ? "Copied"
                        : "Copy"}

                    </button>

                  </div>

                </div>

                <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">

                  <p className="text-[11px] leading-5 text-blue-700">

                    Agents can enter this code from

                    <span className="font-semibold">
                      {" "}
                      Join an Existing Agency
                    </span>

                    {" "}during onboarding.

                  </p>

                </div>

              </div>

              {/* =================================================
                  SHARE MESSAGE
              ================================================= */}

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)] sm:p-6">

                <div className="flex items-start gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    <Clipboard size={17} />
                  </div>

                  <div className="min-w-0">

                    <h2 className="text-sm font-bold text-slate-800">
                      Quick invite message
                    </h2>

                    <p className="mt-1 text-[10px] text-slate-400">
                      Copy and send this through your
                      preferred communication channel.
                    </p>

                  </div>

                </div>

                <div className="mt-4 rounded-xl bg-slate-50 p-4">

                  <p className="whitespace-pre-line text-[11px] leading-5 text-slate-600">
                    {inviteMessage}
                  </p>

                </div>

                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-50"
                >

                  {copied ? (
                    <Check size={14} />
                  ) : (
                    <Copy size={14} />
                  )}

                  {copied
                    ? "Copied"
                    : "Copy Invite Message"}

                </button>

              </div>

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
      <Icon
        size={17}
        strokeWidth={1.8}
      />

      <span>{label}</span>
    </Link>
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
    return words[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return `${words[0][0]}${
    words[words.length - 1][0]
  }`.toUpperCase();
}

export default AgencyInvite;