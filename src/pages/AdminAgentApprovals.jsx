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
} from "@phosphor-icons/react";

import { api, getBlob } from "../lib/api";
import { authErrorMessage } from "../lib/authErrors";

const DOCUMENT_LABELS = {
  license: "Clearing License",
  identity: "Identity Document",
};

/**
 * Platform-admin review queue for independent clearing-agent applications.
 * Reachable at /admin/agent-approvals; guarded by RequireAuth platformAdmin.
 */
export default function AdminAgentApprovals() {
  const [agents, setAgents] = useState([]);
  const [documentsByAgent, setDocumentsByAgent] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const rows = await api.get("/admin/pending-agents");
        if (!active) return;
        setAgents(rows);

        // Document metadata is cheap (JSON only, no file bytes) -- fine to
        // fetch for every pending agent up front.
        const entries = await Promise.all(
          rows.map(async (agent) => {
            try {
              const docs = await api.get(
                `/users/${agent.id}/verification-documents`
              );
              return [agent.id, docs];
            } catch {
              return [agent.id, []];
            }
          })
        );
        if (active) setDocumentsByAgent(Object.fromEntries(entries));
      } catch (err) {
        if (active) {
          setError(authErrorMessage(err, "Could not load pending agents."));
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
      const blob = await getBlob(
        `/users/${agentId}/verification-documents/${doc.id}/file`
      );
      window.open(URL.createObjectURL(blob), "_blank", "noopener");
    } catch (err) {
      setError(authErrorMessage(err, "Could not open that document."));
    }
  };

  const decide = async (agentId, decision) => {
    setBusyId(agentId);
    setError("");
    try {
      await api.put(`/admin/agents/${agentId}/approve`, { decision });
      setAgents((current) => current.filter((a) => a.id !== agentId));
    } catch (err) {
      setError(authErrorMessage(err, "Could not update the application."));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB] px-4 py-8 sm:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#14213D]">
              Independent Agent Applications
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Approve or reject clearing agents who registered independently.
            </p>
          </div>
          <Link
            to="/"
            className="text-sm font-semibold text-[#173563] hover:underline"
          >
            Home
          </Link>
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
        ) : agents.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <SealCheck className="mx-auto h-10 w-10 text-emerald-500" />
            <p className="mt-3 text-sm font-semibold text-slate-700">
              No pending applications
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {agents.map((agent) => (
              <li
                key={agent.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-slate-900">
                        {agent.name || "Unnamed agent"}
                      </h2>
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
                      <span className="flex items-center gap-1.5">
                        Experience: {agent.experience || "—"}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin size={13} className="text-slate-400" />
                        {agent.address || "—"}
                      </span>
                    </div>

                    {/* Uploaded verification documents */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(documentsByAgent[agent.id] || []).length === 0 ? (
                        <span className="text-xs italic text-slate-400">
                          No documents uploaded yet
                        </span>
                      ) : (
                        documentsByAgent[agent.id].map((doc) => (
                          <button
                            key={doc.id}
                            type="button"
                            onClick={() => viewDocument(agent.id, doc)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                          >
                            <FileText size={13} />
                            {DOCUMENT_LABELS[doc.documentType] || doc.documentType}
                            <ArrowSquareOut size={12} />
                          </button>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={busyId === agent.id}
                      onClick={() => decide(agent.id, "approved")}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                    >
                      <SealCheck size={15} /> Approve
                    </button>
                    <button
                      type="button"
                      disabled={busyId === agent.id}
                      onClick={() => decide(agent.id, "rejected")}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                    >
                      <XCircle size={15} /> Reject
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
