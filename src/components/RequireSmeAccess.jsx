import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Calculator,
  LockKey,
  MagnifyingGlass,
  ShieldCheck,
} from "@phosphor-icons/react";

import { useAuth } from "../context/AuthContext";

/**
 * Gate for SME pages that need a real account (shipments, find agent,
 * documents, profile, etc). Guests reach these routes with zero protection
 * today, so instead of the hard redirect RequireAuth does, this shows a
 * proper "sign in required" screen in place of the page -- guests can only
 * freely use HS Code Search and the Import Calculator.
 */
export default function RequireSmeAccess({ children, pageName = "This page" }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-[#173563]"
          aria-label="Loading"
        />
      </div>
    );
  }

  if (isAuthenticated) {
    return children;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F8FAFC] px-4 py-8 sm:px-6 sm:py-10">
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-100/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-slate-200/50 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        <div className="w-full max-w-[560px]">
          <Link
            to="/sme-guest"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#173563]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to guest tools
          </Link>

          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 text-center shadow-[0_20px_60px_-20px_rgba(15,23,42,0.18)] sm:p-10">
            <div className="mb-6 flex justify-center">
              <Link to="/" className="inline-flex items-center">
                <img
                  src="/logo.png"
                  alt="ImportEase"
                  className="h-14 w-auto object-contain sm:h-16"
                />
              </Link>
            </div>

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#2563EB]">
              <LockKey size={26} />
            </div>

            <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Sign in required
            </h1>

            <p className="mx-auto mt-2 max-w-sm text-[15px] leading-6 text-slate-500">
              {pageName} is only available to signed-in SME accounts. Create a
              free account or sign in to continue.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                to="/signin"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#173563] px-5 text-[15px] font-semibold text-white shadow-lg shadow-[#173563]/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#122b50]"
              >
                Sign In
              </Link>

              <Link
                to="/sme-signup"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-[15px] font-semibold text-[#173563] transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
              >
                Create Free Account
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="mt-8 grid gap-2.5 border-t border-slate-100 pt-6 text-left sm:grid-cols-2">
              <Link
                to="/hs-code-search"
                className="flex items-center gap-2.5 rounded-xl bg-slate-50 px-3.5 py-3 text-[13px] font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                <MagnifyingGlass size={16} className="text-[#2563EB]" />
                Try HS Code Search instead
              </Link>

              <Link
                to="/calculator"
                className="flex items-center gap-2.5 rounded-xl bg-slate-50 px-3.5 py-3 text-[13px] font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                <Calculator size={16} className="text-[#2563EB]" />
                Try Import Calculator instead
              </Link>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-xs font-medium text-slate-400">
              <ShieldCheck className="h-4 w-4 text-slate-400" />
              Secure access with ImportEase
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
