import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  CheckCircle2,
  CircleUserRound,
  FileSearch,
  LockKeyhole,
  Search,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

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
    <div className="min-h-screen overflow-x-hidden bg-[#F6F8FB] text-slate-900">
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[68px] max-w-[1280px] flex-wrap items-center gap-3 px-5 py-3 sm:px-8">
          <Link to="/" className="flex shrink-0 items-center gap-2.5">
            <img
              src="/logo.jpeg"
              alt="ImportEase"
              className="h-10 w-10 object-contain mix-blend-multiply"
            />
            <div>
              <div className="text-[17px] font-bold tracking-tight text-[#173563]">
                Import<span className="text-slate-900">Ease</span>
              </div>
              <p className="hidden text-[9px] font-semibold uppercase tracking-[0.13em] text-slate-400 sm:block">
                SME Import Platform
              </p>
            </div>
          </Link>

          <nav className="ml-auto hidden items-center gap-1 md:flex">
            <Link to="/" className="rounded-lg px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
              Home
            </Link>
            <Link to="/signin" className="rounded-lg px-3 py-2 text-xs font-semibold text-[#173563] transition hover:bg-blue-50">
              Sign In
            </Link>
            <Link to="/sme-signup" className="rounded-lg bg-[#173563] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#10294f]">
              Create Account
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-2 md:ml-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-700 sm:text-xs">
              <CircleUserRound size={13} />
              Guest Mode
            </span>
            <Link to="/sme-signup" className="rounded-lg bg-[#173563] px-3 py-2 text-xs font-semibold text-white md:hidden">
              Join
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1180px] px-5 py-8 sm:px-8 sm:py-12">
        <section className="relative overflow-hidden rounded-3xl border border-[#dce7f5] bg-white px-6 py-9 shadow-[0_10px_32px_rgba(15,23,42,.05)] sm:px-10 sm:py-12">
          <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-blue-100/70 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-sky-50 blur-3xl" />

          <div className="relative max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
              <CircleUserRound size={14} />
              You&apos;re browsing as a guest
            </span>
            <h1 className="mt-5 text-3xl font-bold tracking-tight text-[#173563] sm:text-4xl">
              Welcome to ImportEase
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Explore import tools and learn about the import process before creating your SME account.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link to="/hs-code-search" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#173563] bg-white px-4 text-sm font-semibold text-[#173563] transition hover:bg-slate-50">
                <Search size={17} />
                HS Code Search
              </Link>
              <Link to="/calculator" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 text-sm font-semibold text-blue-700 transition hover:bg-blue-100">
                <Calculator size={17} />
                Import Calculator
              </Link>
              <Link to="/sme-signup" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
                Create SME Account
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-6 flex flex-col gap-4 rounded-2xl border border-blue-100 bg-blue-50/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#2563EB] shadow-sm">
              <LockKeyhole size={17} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#173563]">Guest access is designed for exploration</p>
              <p className="mt-0.5 text-xs leading-5 text-slate-600">Create an SME account to access clearing agents, shipments, and personalized import tracking.</p>
            </div>
          </div>
          <Link to="/sme-signup" className="inline-flex shrink-0 items-center justify-center rounded-lg bg-white px-3.5 py-2 text-xs font-semibold text-[#173563] ring-1 ring-inset ring-blue-100 transition hover:bg-blue-100">
            Create Account
          </Link>
        </section>

        <section className="mt-12">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">Guest tools</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#173563]">Explore ImportEase</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-slate-500">Start with the tools available to every importer, then create an account when you&apos;re ready to manage your imports.</p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ToolCard icon={<FileSearch size={21} />} title="HS Code Search" description="Find the appropriate HS code for your product." action="Search HS Codes" to="/hs-code-search" />
            <ToolCard icon={<Calculator size={21} />} title="Import Calculator" description="Estimate your import costs, duties and taxes." action="Calculate Costs" to="/calculator" />
            <ToolCard icon={<BookOpen size={21} />} title="Import Guide" description="Learn the basic steps involved in importing goods." />
            <ToolCard icon={<UsersRound size={21} />} title="Clearing Agent Information" description="Learn how clearing agents help SMEs complete the import clearance process." />
          </div>
        </section>

        <section className="mt-12 overflow-hidden rounded-3xl bg-[#173563] px-6 py-9 text-white sm:px-10 sm:py-11">
          <div className="grid gap-8 lg:grid-cols-[1fr_.9fr] lg:items-center">
            <div>
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-blue-100">
                <ShieldCheck size={21} />
              </div>
              <h2 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">Unlock the Full ImportEase Experience</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100">Set up your SME account to bring your tools, shipment activity, and clearing-agent workflow together in one place.</p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link to="/sme-signup" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-[#173563] transition hover:bg-blue-50">
                  Create SME Account
                  <ArrowRight size={17} />
                </Link>
                <span className="text-sm text-blue-100">Already have an account? <Link to="/signin" className="font-semibold text-white underline decoration-blue-300 underline-offset-4 hover:text-blue-100">Sign In</Link></span>
              </div>
            </div>
            <div className="grid gap-2.5 rounded-2xl border border-white/10 bg-white/[0.06] p-5 sm:grid-cols-2">
              {accountBenefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-2.5 text-sm text-blue-50">
                  <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-[#93C5FD]" />
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
            <LockKeyhole size={14} />
            Available with an SME account
          </div>
        )}
      </div>
    </article>
  );
}

export default SMEGuest;
