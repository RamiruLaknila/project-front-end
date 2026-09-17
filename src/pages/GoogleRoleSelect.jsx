import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Buildings,
  CheckCircle,
  Storefront,
} from "@phosphor-icons/react";

import { useAuth } from "../context/AuthContext";
import { authErrorMessage } from "../lib/authErrors";

/**
 * Shown right after a brand-new Google sign-in (no `users/{uid}` doc yet).
 * Mirrors SignUp.jsx's two account-type cards, but the SME choice creates
 * the minimal profile immediately (same shape /auth/register would have
 * produced) and the agent choice hands off to the existing multi-step agent
 * signup flow, which detects the signed-in-but-no-profile state itself.
 */
function GoogleRoleSelect() {
  const navigate = useNavigate();
  const { completeGoogleProfile, logout } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSME = async () => {
    setError("");
    setSubmitting(true);
    try {
      await completeGoogleProfile({ role: "importer" });
      navigate("/complete-profile", { replace: true });
    } catch (err) {
      setError(authErrorMessage(err, "Could not set up your account."));
      setSubmitting(false);
    }
  };

  const handleClearingAgent = () => {
    // Agent onboarding needs an agency-choice step before the profile is
    // created, so it's handled by the existing signup pages, not here.
    navigate("/agent-signup");
  };

  const handleCancel = async () => {
    // They backed out of picking a role -- sign the half-created Google
    // session back out rather than leaving them stuck signed in with no
    // profile (which would just 404-loop them back here on next visit).
    await logout();
    navigate("/signin", { replace: true });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F8FAFC] px-4 py-8 font-sans antialiased sm:px-6 sm:py-10 lg:px-8">
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-100/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-slate-200/50 blur-3xl" />

      <div className="relative mx-auto w-full max-w-5xl">
        <div className="mb-7 flex justify-center">
          <Link
            to="/"
            className="group flex items-center gap-2.5 rounded-lg p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173563] focus-visible:ring-offset-2"
          >
            <img
              src="/logo.png"
              alt="ImportEase"
              className="h-11 w-11 object-contain mix-blend-multiply sm:h-12 sm:w-12"
            />
            <span className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[30px]">
              Import
              <span className="text-[#173563]">Ease</span>
            </span>
          </Link>
        </div>

        <div className="mx-auto mb-8 max-w-2xl text-center">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            One last thing -- who are you?
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            We couldn't find an ImportEase account for this Google account.
            Tell us how you'll use ImportEase to finish setting it up.
          </p>
        </div>

        {error && (
          <div className="mx-auto mb-6 max-w-2xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          <button
            type="button"
            onClick={handleSME}
            disabled={submitting}
            className="group flex min-h-[390px] flex-col rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#173563]/30 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173563] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:p-7"
          >
            <div className="flex flex-1 flex-col">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-[#173563] transition-all duration-200 group-hover:border-[#173563] group-hover:bg-[#173563] group-hover:text-white">
                  <Storefront className="h-5 w-5" />
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 transition-all duration-200 group-hover:bg-blue-50">
                  <ArrowRight className="h-4 w-4 text-slate-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[#173563]" />
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-[24px]">
                  SME / Importer
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Register your business to simplify your importing process,
                  manage shipments, calculate costs and connect with clearing
                  agents.
                </p>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-5">
                <p className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-slate-400">
                  With your SME account
                </p>
                <div className="space-y-3">
                  <RoleFeature text="Manage your import shipments" />
                  <RoleFeature text="Search HS codes and estimate costs" />
                  <RoleFeature text="Find and hire clearing agents" />
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
              <span className="text-sm font-semibold text-[#173563]">
                {submitting ? "Setting up..." : "Continue as SME"}
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={handleClearingAgent}
            disabled={submitting}
            className="group flex min-h-[390px] flex-col rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#173563]/30 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173563] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:p-7"
          >
            <div className="flex flex-1 flex-col">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-[#173563] transition-all duration-200 group-hover:border-[#173563] group-hover:bg-[#173563] group-hover:text-white">
                  <Buildings className="h-5 w-5" />
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 transition-all duration-200 group-hover:bg-blue-50">
                  <ArrowRight className="h-4 w-4 text-slate-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[#173563]" />
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-[24px]">
                  Clearing Agent
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Register as a professional clearing agent to work with
                  SMEs, manage requests and grow your business through
                  ImportEase.
                </p>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-5">
                <p className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-slate-400">
                  With your agent account
                </p>
                <div className="space-y-3">
                  <RoleFeature text="Create or join a clearing agency" />
                  <RoleFeature text="Manage your professional credentials" />
                  <RoleFeature text="Receive requests and submit bids" />
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
              <span className="text-sm font-semibold text-[#173563]">
                Continue as Clearing Agent
              </span>
            </div>
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173563] focus-visible:ring-offset-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Not you? Sign out and use a different account
          </button>
        </div>
      </div>
    </div>
  );
}

function RoleFeature({ text }) {
  return (
    <div className="flex items-center gap-2.5">
      <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
      <span className="text-sm font-medium text-slate-600">{text}</span>
    </div>
  );
}

export default GoogleRoleSelect;
