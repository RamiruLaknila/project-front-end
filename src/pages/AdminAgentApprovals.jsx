import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  SealCheck,
  Clock,
  ArrowSquareOut,
  FileText,
  EnvelopeSimple,
  Phone,
  MapPin,
  ShieldCheck,
  XCircle,
  Buildings,
} from "@phosphor-icons/react";

import { api, getBlob } from "../lib/api";
import { authErrorMessage } from "../lib/authErrors";

const DOCUMENT_LABELS = {
  license: "Clearing License",
  identity: "Identity Document",
};

const TABS = [
  { key: "independent", label: "Independent Agents" },
  { key: "agencies", label: "Clearing Agencies" },
  { key: "agencyAgents", label: "Agency Agents" },
];

/**
 * Platform-admin review queue for everyone waiting on ImportEase's own
 * sign-off before they can operate on the platform: independent clearing
 * agents, real clearing agencies (the company entity), and agency-member
 * agents (a second gate on top of their own agency admin's approval).
 * Reachable at /admin/agent-approvals; guarded by RequireAuth platformAdmin.
 */
export default function AdminAgentApprovals() {
  const [tab, setTab] = useState("independent");

  const [independentAgents, setIndependentAgents] = useState([]);
  const [documentsByAgent, setDocumentsByAgent] = useState({});
  const [agencies, setAgencies] = useState([]);
  const [agencyAgents, setAgencyAgents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const [independentRows, agencyRows, agencyAgentRows] = await Promise.all([
          api.get("/admin/pending-agents"),
          api.get("/admin/pending-agencies"),
          api.get("/admin/pending-agency-agents"),
        ]);
        if (!active) return;
        setIndependentAgents(independentRows);
        setAgencies(agencyRows);
        setAgencyAgents(agencyAgentRows);

        // Document metadata is cheap (JSON only, no file bytes) -- fine to
        // fetch up front for everyone waiting on platform review who can
        // upload documents (independent agents and agency-member agents
        // alike; the backend doesn't restrict uploads to independents).
        const entries = await Promise.all(
          [...independentRows, ...agencyAgentRows].map(async (agent) => {
            try {
              const docs = await api.get(`/users/${agent.id}/verification-documents`);
              return [agent.id, docs];
            } catch {
              return [agent.id, []];
            }
          })
        );
        if (active) setDocumentsByAgent(Object.fromEntries(entries));
      } catch (err) {
        if (active) {
          setError(authErrorMessage(err, "Could not load pending applications."));
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const viewDocument = async (agentId, doc) => {
    try {
      const blob = await getBlob(`/users/${agentId}/verification-documents/${doc.id}/file`);
      window.open(URL.createObjectURL(blob), "_blank", "noopener");
    } catch (err) {
      setError(authErrorMessage(err, "Could not open that document."));
    }
  };

  const decideIndependent = async (agentId, decision) => {
    setBusyId(agentId);
    setError("");
    try {
      await api.put(`/admin/agents/${agentId}/approve`, { decision });
      setIndependentAgents((current) => current.filter((a) => a.id !== agentId));
    } catch (err) {
      setError(authErrorMessage(err, "Could not update the application."));
    } finally {
      setBusyId(null);
    }
  };

  const decideAgency = async (agencyId, decision) => {
    setBusyId(agencyId);
    setError("");
    try {
      await api.put(`/admin/agencies/${agencyId}/approve`, { decision });
      setAgencies((current) => current.filter((a) => a.id !== agencyId));
    } catch (err) {
      setError(authErrorMessage(err, "Could not update the agency."));
    } finally {
      setBusyId(null);
    }
  };

  const decideAgencyAgent = async (agentId, decision) => {
    setBusyId(agentId);
    setError("");
    try {
      await api.put(`/admin/agency-agents/${agentId}/approve`, { decision });
      setAgencyAgents((current) => current.filter((a) => a.id !== agentId));
    } catch (err) {
      setError(authErrorMessage(err, "Could not update the agent."));
    } finally {
      setBusyId(null);
    }
  };

  const counts = {
    independent: independentAgents.length,
    agencies: agencies.length,
    agencyAgents: agencyAgents.length,
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB] px-4 py-8 sm:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#14213D]">
              Agent &amp; Agency Applications
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Review and approve everyone waiting on ImportEase's sign-off.
            </p>
          </div>
          <Link to="/" className="text-sm font-semibold text-[#173563] hover:underline">
            Home
          </Link>
        </div>

        <div className="mb-5 flex flex-wrap gap-1.5 rounded-xl border border-slate-200 bg-white p-1.5">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold transition ${
                tab === t.key
                  ? "bg-[#173563] text-white"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              }`}
            >
              {t.label}
              {counts[t.key] > 0 && (
                <span
                  className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-bold ${
                    tab === t.key ? "bg-white/20 text-white" : "bg-blue-50 text-[#2563EB]"
                  }`}
                >
                  {counts[t.key]}
                </span>
              )}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-400">
            Loading…
          </div>
        ) : tab === "independent" ? (
          <IndependentAgentsTab
            agents={independentAgents}
            documentsByAgent={documentsByAgent}
            busyId={busyId}
            onViewDocument={viewDocument}
            onDecide={decideIndependent}
          />
        ) : tab === "agencies" ? (
          <AgenciesTab agencies={agencies} busyId={busyId} onDecide={decideAgency} />
        ) : (
          <AgencyAgentsTab
            agents={agencyAgents}
            documentsByAgent={documentsByAgent}
            busyId={busyId}
            onViewDocument={viewDocument}
            onDecide={decideAgencyAgent}
          />
        )}
      </div>
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({ label }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
      <SealCheck className="mx-auto h-10 w-10 text-emerald-500" />
      <p className="mt-3 text-sm font-semibold text-slate-700">{label}</p>
    </div>
  );
}

/* =========================================================
   INDEPENDENT AGENTS TAB
========================================================= */

function IndependentAgentsTab({ agents, documentsByAgent, busyId, onViewDocument, onDecide }) {
  if (agents.length === 0) {
    return <EmptyState label="No pending independent agent applications" />;
  }

  return (
    <ul className="space-y-4">
      {agents.map((agent) => (
        <li key={agent.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">{agent.name || "Unnamed agent"}</h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700">
                  <Clock size={11} /> Pending
                </span>
              </div>
              <div className="mt-2 grid gap-1.5 text-xs text-slate-600 sm:grid-cols-2">
                <span className="flex items-center gap-1.5">
                  <EnvelopeSimple size={13} className="text-slate-400" />
                  {agent.email || "—"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone size={13} className="text-slate-400" />
                  {agent.phone || "—"}
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-slate-400" />
                  License: {agent.licenseNumber || "—"}
                  {agent.licenseExpiry ? ` (exp ${agent.licenseExpiry})` : ""}
                </span>
                <span className="flex items-center gap-1.5">
                  <SealCheck size={13} className="text-slate-400" />
                  Agent ID: {agent.agentId || "—"}
                </span>
                <span className="flex items-center gap-1.5">Experience: {agent.experience || "—"}</span>
                <span className="flex items-center gap-1.5">
                  <MapPin size={13} className="text-slate-400" />
                  {agent.address || "—"}
                </span>
              </div>

              <DocumentChips
                documents={documentsByAgent[agent.id]}
                agentId={agent.id}
                onViewDocument={onViewDocument}
              />
            </div>

            <DecisionButtons id={agent.id} busyId={busyId} onDecide={onDecide} />
          </div>
        </li>
      ))}
    </ul>
  );
}

/* =========================================================
   DOCUMENT CHIPS
========================================================= */

function DocumentChips({ documents, agentId, onViewDocument }) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {(documents || []).length === 0 ? (
        <span className="text-xs italic text-slate-400">No documents uploaded yet</span>
      ) : (
        documents.map((doc) => (
          <button
            key={doc.id}
            type="button"
            onClick={() => onViewDocument(agentId, doc)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
          >
            <FileText size={13} />
            {DOCUMENT_LABELS[doc.documentType] || doc.documentType}
            <ArrowSquareOut size={12} />
          </button>
        ))
      )}
    </div>
  );
}

/* =========================================================
   CLEARING AGENCIES TAB
========================================================= */

function AgenciesTab({ agencies, busyId, onDecide }) {
  if (agencies.length === 0) {
    return <EmptyState label="No pending agency applications" />;
  }

  return (
    <ul className="space-y-4">
      {agencies.map((agency) => (
        <li key={agency.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Buildings size={16} className="text-slate-400" />
                <h2 className="text-base font-bold text-slate-900">
                  {agency.companyName || "Unnamed agency"}
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700">
                  <Clock size={11} /> Pending
                </span>
              </div>
              <div className="mt-2 grid gap-1.5 text-xs text-slate-600 sm:grid-cols-2">
                <span className="flex items-center gap-1.5">
                  <EnvelopeSimple size={13} className="text-slate-400" />
                  {agency.email || "—"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone size={13} className="text-slate-400" />
                  {agency.businessPhone || "—"}
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-slate-400" />
                  License: {agency.licenseNumber || "—"}
                </span>
                <span className="flex items-center gap-1.5">
                  <SealCheck size={13} className="text-slate-400" />
                  Business Reg. No: {agency.businessRegNumber || "—"}
                </span>
                <span className="flex items-center gap-1.5 sm:col-span-2">
                  <MapPin size={13} className="text-slate-400" />
                  {agency.businessAddress || "—"}
                </span>
              </div>
            </div>

            <DecisionButtons id={agency.id} busyId={busyId} onDecide={onDecide} />
          </div>
        </li>
      ))}
    </ul>
  );
}

/* =========================================================
   AGENCY-MEMBER AGENTS TAB
========================================================= */

function AgencyAgentsTab({ agents, documentsByAgent, busyId, onViewDocument, onDecide }) {
  if (agents.length === 0) {
    return <EmptyState label="No pending agency-agent applications" />;
  }

  return (
    <ul className="space-y-4">
      {agents.map((agent) => (
        <li key={agent.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">{agent.name || "Unnamed agent"}</h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700">
                  <Clock size={11} /> Pending platform review
                </span>
                {agent.agentStatus && (
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                      agent.agentStatus === "approved"
                        ? "bg-emerald-50 text-emerald-700"
                        : agent.agentStatus === "rejected"
                          ? "bg-red-50 text-red-600"
                          : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    Agency admin: {agent.agentStatus}
                  </span>
                )}
              </div>
              <div className="mt-2 grid gap-1.5 text-xs text-slate-600 sm:grid-cols-2">
                <span className="flex items-center gap-1.5">
                  <Buildings size={13} className="text-slate-400" />
                  {agent.agencyName || "—"}
                </span>
                <span className="flex items-center gap-1.5">
                  <EnvelopeSimple size={13} className="text-slate-400" />
                  {agent.email || "—"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone size={13} className="text-slate-400" />
                  {agent.phone || "—"}
                </span>
              </div>

              <DocumentChips
                documents={documentsByAgent[agent.id]}
                agentId={agent.id}
                onViewDocument={onViewDocument}
              />
            </div>

            <DecisionButtons id={agent.id} busyId={busyId} onDecide={onDecide} />
          </div>
        </li>
      ))}
    </ul>
  );
}

/* =========================================================
   DECISION BUTTONS
========================================================= */

function DecisionButtons({ id, busyId, onDecide }) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        disabled={busyId === id}
        onClick={() => onDecide(id, "approved")}
        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
      >
        <SealCheck size={15} /> Approve
      </button>
      <button
        type="button"
        disabled={busyId === id}
        onClick={() => onDecide(id, "rejected")}
        className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
      >
        <XCircle size={15} /> Reject
      </button>
    </div>
  );
}
