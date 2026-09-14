import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  CheckCircle,
  UserCircle,
  FileMagnifyingGlass,
  LockKey,
  MagnifyingGlass,
  ShieldCheck,
  UsersFour,
} from "@phosphor-icons/react";

const accountBenefits = [
  "Find and compare clearing agents",
  "Request clearing services",
  "Create and manage shipments",
  "Track your imports",
  "Save import information",
  "Receive notifications",
];

function SMEGuest() {
  useEffect(() => {
    localStorage.setItem("importease_guest", "true");
  }, []);

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-900">
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 sm:px-6 lg:px-10">
          <Link to="/" className="group flex shrink-0 items-center gap-3">
            <div className="flex h-[48px] w-[48px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white">
              <img
                src="/logo.png"
                alt="ImportEase"
                className="h-full w-full object-contain"
              />
            </div>

            <div className="hidden sm:block">
              <div className="text-[19px] font-bold leading-tight tracking-tight text-[#173563] transition-colors group-hover:text-[#2563EB]">
                ImportEase
              </div>
              <div className="mt-0.5 text-[12px] font-medium leading-tight text-slate-500">
                Import smarter. Trade easier.
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1.5 text-[13px] font-semibold text-blue-700 sm:inline-flex">
              <UserCircle size={14} />
              Guest Mode
            </span>

            <Link
              to="/signin"
              className="hidden h-10 items-center justify-center rounded-xl px-4 text-[14px] font-semibold text-[#173563] transition hover:bg-blue-50 sm:inline-flex"
            >
              Sign In
            </Link>

            <Link
              to="/sme-signup"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-[#173563] px-4 text-[14px] font-semibold text-white transition hover:bg-[#10294f]"
            >
              Create Account
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto w-full max-w-[1120px] px-5 pb-14 pt-5 sm:px-8 sm:pt-6 lg:pt-7">
        <section className="mb-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
            <UserCircle size={14} />
            You&apos;re browsing as a guest
          </span>

          <h1 className="mt-3 text-[35px] font-bold tracking-[-0.04em] text-[#14213D] sm:text-[45px]">
            Welcome to ImportEase
          </h1>

          <p className="mt-2 max-w-2xl text-[14px] leading-6 text-slate-500 sm:text-[16px]">
            Explore import tools and learn about the import process before creating your SME account.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link to="/hs-code-search" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#173563] bg-white px-4 text-sm font-semibold text-[#173563] transition hover:bg-slate-50">
              <MagnifyingGlass size={17} />
              HS Code Search
            </Link>
            <Link to="/calculator" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 text-sm font-semibold text-blue-700 transition hover:bg-blue-100">
              <Calculator size={17} />
              Import Calculator
            </Link>
            <Link to="/sme-signup" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
              Create SME Account
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>

        <section className="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-[0_2px_12px_rgba(15,23,42,.025)] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#2563EB]">
              <LockKey size={17} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Guest access is designed for exploration</p>
              <p className="mt-0.5 text-[13px] leading-5 text-slate-500">Create an SME account to access clearing agents, shipments, and personalized import tracking.</p>
            </div>
          </div>
          <Link to="/sme-signup" className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white px-3.5 text-[13px] font-semibold text-[#173563] transition hover:bg-slate-50">
            Create Account
          </Link>
        </section>

        <section className="mb-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">Guest tools</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#173563]">Explore ImportEase</h2>
            </div>
            <p className="max-w-md text-[13px] leading-6 text-slate-500">Start with the tools available to every importer, then create an account when you&apos;re ready to manage your imports.</p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ToolCard icon={<FileMagnifyingGlass size={21} />} title="HS Code Search" description="Find the appropriate HS code for your product." action="Search HS Codes" to="/hs-code-search" />
            <ToolCard icon={<Calculator size={21} />} title="Import Calculator" description="Estimate your import costs, duties and taxes." action="Calculate Costs" to="/calculator" />
            <ToolCard icon={<BookOpen size={21} />} title="Import Guide" description="Learn the basic steps involved in importing goods." />
            <ToolCard icon={<UsersFour size={21} />} title="Clearing Agent Information" description="Learn how clearing agents help SMEs complete the import clearance process." />
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl bg-[#173563] px-6 py-9 text-white sm:px-10 sm:py-11">
          <div className="grid gap-8 lg:grid-cols-[1fr_.9fr] lg:items-center">
            <div>
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-blue-100">
                <ShieldCheck size={21} />
              </div>
              <h2 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">Unlock the Full ImportEase Experience</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100">Set up your SME account to bring your tools, shipment activity, and clearing-agent workflow together in one place.</p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link to="/sme-signup" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-[#173563] transition hover:bg-blue-50">
                  Create SME Account
                  <ArrowRight size={17} />
                </Link>
                <span className="text-sm text-blue-100">Already have an account? <Link to="/signin" className="font-semibold text-white underline decoration-blue-300 underline-offset-4 hover:text-blue-100">Sign In</Link></span>
              </div>
            </div>
            <div className="grid gap-2.5 rounded-2xl border border-white/10 bg-white/[0.06] p-5 sm:grid-cols-2">
              {accountBenefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-2.5 text-sm text-blue-50">
                  <CheckCircle size={17} className="mt-0.5 shrink-0 text-[#93C5FD]" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function ToolCard({ icon, title, description, action, to }) {
  return (
    <article className="flex min-h-[236px] flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,.025)] transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_8px_22px_rgba(15,23,42,.07)]">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">{icon}</div>
      <h3 className="mt-5 text-base font-bold text-[#173563]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
      <div className="mt-auto pt-5">
        {to ? (
          <Link to={to} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563EB] transition hover:text-blue-800">
            {action}
            <ArrowRight size={16} />
          </Link>
        ) : (
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <LockKey size={14} />
            Available with an SME account
          </div>
        )}
      </div>
    </article>
  );
}

export default SMEGuest;
