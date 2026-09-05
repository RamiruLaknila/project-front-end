import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  Building2,
  Check,
  CheckCircle2,
  Copy,
  Mail,
  RefreshCw,
  Send,
  Users,
  UserPlus,
  X,
} from "lucide-react";
import AgentAdminSidebar from "../components/AgentAdminSidebar";

function AgencyInvite() {
  const navigate = useNavigate();

   const [agency, setAgency] = useState(() => {
    try {
      const storedAgency = localStorage.getItem("clearingAgency");
      return storedAgency ? JSON.parse(storedAgency) : null;
    } catch {
      return null;
    }
  });

  const [admin, setAdmin] = useState(() => {
    try {
      const storedAdmin = localStorage.getItem("clearingAgent");
      const parsed = storedAdmin ? JSON.parse(storedAdmin) : null;
      return parsed && parsed.agentType === "agency-admin" ? parsed : null;
    } catch {
      return null;
    }
  });
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [pendingCount, setPendingCount] = useState(0);

  /* =========================================================
     LOAD AGENCY + ADMIN DATA
  ========================================================= */

  const loadData = () => {
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

      if (parsedAdmin.agentType !== "agency-admin") {
        navigate("/agent-signin");
        return;
      }

      setAgency(parsedAgency);
      setAdmin(parsedAdmin);

      /* -------------------------------------------------------
         LOAD PENDING AGENT REQUEST COUNT
      ------------------------------------------------------- */

      const storedPendingRequests = JSON.parse(
        localStorage.getItem("agencyPendingAgents") || "[]"
      );

      const currentAgencyId =
        parsedAgency.id || parsedAgency.code;

      const agencyPendingRequests =
        storedPendingRequests.filter((request) => {
          const requestAgencyId =
            request.agencyId || request.agencyCode;

          return (
            requestAgencyId === currentAgencyId &&
            request.status === "pending"
          );
        });

      setPendingCount(agencyPendingRequests.length);
    } catch (error) {
      console.error(
        "Failed to load agency information:",
        error
      );

      navigate("/agent-signin");
    }
  };

  useEffect(() => {
    loadData();
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
      await navigator.clipboard.writeText(
        agencyCode
      );

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
     DEFAULT INVITATION MESSAGE
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
     COPY INVITATION MESSAGE
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
      const existingInvitations =
        JSON.parse(
          localStorage.getItem(
            "agencyInvitations"
          ) || "[]"
        );

      const currentAgencyId =
        agency?.id || agency?.code;

      /* -------------------------------------------------------
         CHECK DUPLICATE INVITATION
      ------------------------------------------------------- */

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

      /* -------------------------------------------------------
         CREATE INVITATION
      ------------------------------------------------------- */

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
          message.trim() ||
          inviteMessage,

        createdAt:
          new Date().toISOString(),
      };

      existingInvitations.push(invitation);

      localStorage.setItem(
        "agencyInvitations",
        JSON.stringify(existingInvitations)
      );

      /* -------------------------------------------------------
         CLEAR FORM
      ------------------------------------------------------- */

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
     LOADING
  ========================================================= */

  if (!agency || !admin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-900">

      {/* =====================================================
          REUSABLE ADMIN SIDEBAR
      ===================================================== */}

      <AgentAdminSidebar />

      {/* =====================================================
          MAIN AREA
      ===================================================== */}

      <div className="lg:ml-[260px]">

        {/* ===================================================
            HEADER
        =================================================== */}

        <header className="sticky top-0 z-30 flex h-[70px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-xl sm:px-6">

          <div className="flex items-center gap-3">

            <div>

              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
                Agency Workspace
              </p>

              <h1 className="text-base font-bold text-slate-800">
                Invite Agents
              </h1>

            </div>

          </div>

          {/* REFRESH + NOTIFICATIONS */}

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={loadData}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
              title="Refresh"
            >
              <RefreshCw size={18} />
            </button>

            <button
              type="button"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
              title="Notifications"
            >
              <Bell size={18} />

              {pendingCount > 0 && (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
              )}

            </button>

          </div>

        </header>

        {/* ===================================================
            CONTENT
        =================================================== */}

        <main className="px-5 py-7 sm:px-8 lg:px-10">

          <div className="mx-auto max-w-[1180px]">

            {/* BACK */}

            <Link
              to="/agent-admin-dashboard"
              className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#173563]"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>

            {/* PAGE HEADING */}

            <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">

              <div>

                <h2 className="text-[32px] font-bold tracking-[-0.04em] text-[#14213D] sm:text-[42px]">
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

            {/* =================================================
                MAIN GRID
            ================================================= */}

            <div className="grid gap-6 lg:grid-cols-[1.35fr_0.9fr]">

              {/* =================================================
                  INVITE FORM
              ================================================= */}

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

                {/* ERROR */}

                {error && (
                  <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">

                    <X
                      size={17}
                      className="mt-0.5 shrink-0"
                    />

                    <p>{error}</p>

                  </div>
                )}

                {/* SUCCESS */}

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

                {/* FORM */}

                <form
                  onSubmit={handleSendInvitation}
                  className="space-y-5"
                >

                  {/* EMAIL */}

                  <div>

                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Agent email address
                    </label>

                    <input
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
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-50"
                    />

                  </div>

                  {/* PERSONAL MESSAGE */}

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
                        setMessage(
                          event.target.value
                        )
                      }
                      placeholder="Add a short message for the agent..."
                      rows={5}
                      className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-50"
                    />

                  </div>

                  {/* SEND */}

                  <button
                    type="submit"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#173563] px-5 text-sm font-semibold text-white transition hover:bg-[#10294d]"
                  >
                    <Send size={17} />
                    Send Invitation
                  </button>

                </form>

              </section>

              {/* =================================================
                  RIGHT COLUMN
              ================================================= */}

              <div className="space-y-6">

                {/* =================================================
                    AGENCY CODE
                ================================================= */}

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

                {/* =================================================
                    QUICK INVITE MESSAGE
                ================================================= */}

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

            {/* =================================================
                FOOTER
            ================================================= */}

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

export default AgencyInvite;