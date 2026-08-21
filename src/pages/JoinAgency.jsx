import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  KeyRound,
  Search,
  ShieldCheck,
} from "lucide-react";

function JoinAgency() {
  const navigate = useNavigate();

  const [agencyCode, setAgencyCode] = useState("");
  const [agency, setAgency] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* =========================================================
     FIND AGENCY
  ========================================================= */

  const handleFindAgency = () => {
    setError("");
    setAgency(null);

    const code = agencyCode.trim().toUpperCase();

    if (!code) {
      setError("Please enter your agency code.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      try {
        const storedAgency =
          localStorage.getItem("clearingAgency");

        if (!storedAgency) {
          setError(
            "Agency not found. Please check the code and try again."
          );
          setLoading(false);
          return;
        }

        const parsedAgency = JSON.parse(storedAgency);

        /*
         * Support both:
         * agency.name
         * agency.agencyName
         */
        const storedCode = (
          parsedAgency.code ||
          parsedAgency.id ||
          ""
        )
          .toString()
          .toUpperCase();

        if (!storedCode || storedCode !== code) {
          setError(
            "Invalid agency code. Please check the code provided by your administrator."
          );
          setLoading(false);
          return;
        }

        setAgency(parsedAgency);
        setLoading(false);
      } catch (error) {
        console.error("Failed to find agency:", error);

        setError(
          "Something went wrong while finding the agency."
        );

        setLoading(false);
      }
    }, 500);
  };

  /* =========================================================
     JOIN AGENCY
  ========================================================= */

  const handleJoinAgency = () => {
    if (!agency) {
      return;
    }

    try {
      const storedAgent =
        localStorage.getItem("clearingAgent");

      if (!storedAgent) {
        setError(
          "Agent account not found. Please create an agent account first."
        );
        return;
      }

      const agent = JSON.parse(storedAgent);

      const agencyId =
        agency.id ||
        agency.code;

      const agencyName =
        agency.name ||
        agency.agencyName ||
        "Clearing Agency";

      const agencyCodeValue =
        agency.code ||
        agency.id ||
        agencyCode;

      /* =====================================================
         UPDATE CURRENT AGENT
      ===================================================== */

      const updatedAgent = {
        ...agent,

        agencyId,

        agencyName,

        agencyCode: agencyCodeValue,

        role: "agent",

        agentStatus: "pending",

        profileStatus:
          agent.profileStatus || "incomplete",
      };

      localStorage.setItem(
        "clearingAgent",
        JSON.stringify(updatedAgent)
      );

      /* =====================================================
         ADD AGENT TO AGENCY AGENTS
      ===================================================== */

      const existingAgents = JSON.parse(
        localStorage.getItem("agencyAgents") || "[]"
      );

      const alreadyExists = existingAgents.some(
        (item) =>
          item.email?.toLowerCase() ===
            agent.email?.toLowerCase() &&
          item.agencyId === agencyId
      );

      if (!alreadyExists) {
        const newAgent = {
          id: `agent-${Date.now()}`,

          name: agent.name || "Agent",

          email: agent.email || "",

          agencyId,

          agencyName,

          agencyCode: agencyCodeValue,

          role: "agent",

          status: "pending",

          agentStatus: "pending",

          requestedAt:
            new Date().toISOString(),
        };

        existingAgents.push(newAgent);

        localStorage.setItem(
          "agencyAgents",
          JSON.stringify(existingAgents)
        );
      } else {
        /*
         * If the agent already exists,
         * make sure the status is still pending.
         */
        const updatedAgents =
          existingAgents.map((item) => {
            if (
              item.email?.toLowerCase() ===
                agent.email?.toLowerCase() &&
              item.agencyId === agencyId
            ) {
              return {
                ...item,

                name:
                  agent.name ||
                  item.name ||
                  "Agent",

                agencyName,

                agencyCode:
                  agencyCodeValue,

                status: "pending",

                agentStatus: "pending",

                requestedAt:
                  item.requestedAt ||
                  new Date().toISOString(),
              };
            }

            return item;
          });

        localStorage.setItem(
          "agencyAgents",
          JSON.stringify(updatedAgents)
        );
      }

      /* =====================================================
         ADD TO PENDING REQUESTS
      ===================================================== */

      const existingRequests = JSON.parse(
        localStorage.getItem(
          "agencyPendingAgents"
        ) || "[]"
      );

      const alreadyRequested =
        existingRequests.some(
          (request) =>
            request.email?.toLowerCase() ===
              agent.email?.toLowerCase() &&
            request.agencyId === agencyId
        );

      if (!alreadyRequested) {
        existingRequests.push({
          id: `request-${Date.now()}`,

          name: agent.name || "Agent",

          email: agent.email || "",

          agencyId,

          agencyName,

          agencyCode: agencyCodeValue,

          status: "pending",

          agentStatus: "pending",

          requestedAt:
            new Date().toISOString(),
        });

        localStorage.setItem(
          "agencyPendingAgents",
          JSON.stringify(existingRequests)
        );
      }

      /* =====================================================
         SAVE CURRENT AGENCY
      ===================================================== */

      const updatedAgency = {
        ...agency,
      };

      localStorage.setItem(
        "clearingAgency",
        JSON.stringify(updatedAgency)
      );

      /* =====================================================
         GO TO PENDING APPROVAL
      ===================================================== */

      navigate("/agent-pending-approval");
    } catch (error) {
      console.error(
        "Failed to join agency:",
        error
      );

      setError(
        "Unable to submit your agency request."
      );
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F6F8FB] px-4 py-8 sm:py-10">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-100/50 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-slate-200/50 blur-3xl" />

      {/* =====================================================
          CONTAINER
      ===================================================== */}

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-lg flex-col justify-center">

        {/* =====================================================
            LOGO
        ===================================================== */}

        <div className="mb-7 flex justify-center">

          <Link
            to="/"
            className="flex items-center gap-3"
          >

            <img
              src="/logo.jpeg"
              alt="ImportEase"
              className="h-16 w-16 object-contain mix-blend-multiply sm:h-[72px] sm:w-[72px]"
            />

            <span className="text-2xl font-bold tracking-tight text-slate-900">
              Import
              <span className="text-[#173563]">
                Ease
              </span>
            </span>

          </Link>

        </div>

        {/* =====================================================
            CARD
        ===================================================== */}

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.12)] sm:p-8">

          {/* =================================================
              ICON
          ================================================= */}

          <div className="mb-5 flex justify-center">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#173563]">

              <Building2
                size={26}
                strokeWidth={1.8}
              />

            </div>

          </div>

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="mb-7 text-center">

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Join an Agency
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Enter the agency code provided by your
              clearing agency administrator.
            </p>

          </div>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {!agency ? (

            /* =================================================
               SEARCH AGENCY
            ================================================= */

            <div className="space-y-5">

              <div>

                <label
                  htmlFor="agencyCode"
                  className="mb-1.5 block text-sm font-semibold text-slate-700"
                >
                  Agency code
                </label>

                <div className="relative">

                  <KeyRound
                    size={17}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="agencyCode"
                    type="text"
                    value={agencyCode}
                    onChange={(e) => {
                      setAgencyCode(
                        e.target.value.toUpperCase()
                      );

                      setError("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleFindAgency();
                      }
                    }}
                    placeholder="e.g. IMP-4821"
                    className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3 text-sm font-semibold tracking-wider text-slate-900 outline-none transition placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400 focus:border-[#173563] focus:ring-2 focus:ring-[#173563]/10"
                  />

                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Ask your agency administrator for this code.
                </p>

              </div>

              <button
                type="button"
                onClick={handleFindAgency}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#173563] py-3 text-sm font-semibold text-white shadow-lg shadow-[#173563]/15 transition hover:bg-[#102547] disabled:cursor-not-allowed disabled:opacity-60"
              >

                <Search size={17} />

                {loading
                  ? "Finding agency..."
                  : "Find Agency"}

              </button>

            </div>

          ) : (

            /* =================================================
               AGENCY FOUND
            ================================================= */

            <div className="space-y-5">

              {/* AGENCY CARD */}

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">

                <div className="flex items-start gap-3">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#173563] shadow-sm">

                    <Building2 size={20} />

                  </div>

                  <div className="min-w-0">

                    <div className="flex items-center gap-2">

                      <h2 className="truncate text-sm font-bold text-slate-900">
                        {agency.name ||
                          agency.agencyName ||
                          "Clearing Agency"}
                      </h2>

                      <CheckCircle2
                        size={16}
                        className="shrink-0 text-emerald-600"
                      />

                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                      Agency code:{" "}

                      <span className="font-semibold text-slate-700">
                        {agency.code ||
                          agency.id ||
                          agencyCode}
                      </span>
                    </p>

                    {(agency.location ||
                      agency.city) && (
                      <p className="mt-1 text-xs text-slate-500">
                        {agency.location ||
                          agency.city}
                      </p>
                    )}

                  </div>

                </div>

              </div>

              {/* INFO */}

              <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">

                <div className="flex items-start gap-3">

                  <ShieldCheck
                    size={18}
                    className="mt-0.5 shrink-0 text-blue-600"
                  />

                  <div>

                    <p className="text-xs font-semibold text-blue-900">
                      Approval required
                    </p>

                    <p className="mt-1 text-xs leading-5 text-blue-700">
                      Your request will be sent to the
                      agency administrator. You will get
                      access after they approve your
                      membership.
                    </p>

                  </div>

                </div>

              </div>

              {/* JOIN */}

              <button
                type="button"
                onClick={handleJoinAgency}
                className="w-full rounded-xl bg-[#173563] py-3 text-sm font-semibold text-white shadow-lg shadow-[#173563]/15 transition hover:-translate-y-0.5 hover:bg-[#102547]"
              >
                Request to Join Agency
              </button>

              {/* CHANGE CODE */}

              <button
                type="button"
                onClick={() => {
                  setAgency(null);
                  setError("");
                }}
                className="w-full rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Use a Different Code
              </button>

            </div>
          )}

          {/* =================================================
              INDIVIDUAL AGENT
          ================================================= */}

          <div className="mt-7 border-t border-slate-100 pt-6 text-center">

            <p className="text-sm text-slate-500">
              Working independently?
            </p>

            <button
              type="button"
              onClick={() => {
                localStorage.setItem(
                  "agentMembershipType",
                  "individual"
                );

                navigate("/agent-profile");
              }}
              className="mt-1 text-sm font-semibold text-[#173563] hover:text-blue-700"
            >
              Continue as an independent agent
            </button>

          </div>

        </div>

        {/* =====================================================
            BACK
        ===================================================== */}

        <div className="mt-5 flex justify-center">

          <Link
            to="/agent-signin"
            className="flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-800"
          >

            <ArrowLeft size={16} />

            Back to Agent Sign In

          </Link>

        </div>

      </div>

    </div>
  );
}

export default JoinAgency;