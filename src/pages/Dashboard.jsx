import {
  Search,
  Calculator,
  Users,
  PackagePlus,
  Bell,
  ChevronRight,
  ArrowUpRight,
  Package,
  Clock3,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="min-h-screen bg-[#F7F9FC] text-slate-900">

      {/* =====================================================
          TOP NAVBAR
      ===================================================== */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[68px] max-w-[1400px] items-center justify-between px-5 sm:px-8">

          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#183A6B] text-sm font-bold text-white shadow-sm">
              IE
            </div>

            <div>
              <div className="text-[18px] font-bold tracking-tight text-[#183A6B]">
                Import<span className="text-blue-600">Ease</span>
              </div>
              <div className="hidden text-[10px] font-medium uppercase tracking-wider text-slate-400 sm:block">
                SME Import Assistant
              </div>
            </div>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-3 sm:gap-5">

            {/* Notification */}
            <button
              className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              aria-label="Notifications"
            >
              <Bell size={19} strokeWidth={1.8} />

              <span className="absolute right-[9px] top-[8px] h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
            </button>

            {/* Divider */}
            <div className="hidden h-8 w-px bg-slate-200 sm:block" />

            {/* Business profile */}
            <button className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-slate-50">

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#183A6B] text-xs font-bold text-white">
                MB
              </div>

              <div className="hidden text-left sm:block">
                <p className="text-sm font-semibold text-slate-800">
                  My Business
                </p>
                <p className="text-[11px] text-slate-400">
                  SME Account
                </p>
              </div>

              <ChevronRight
                size={15}
                className="hidden rotate-90 text-slate-400 sm:block"
              />
            </button>
          </div>
        </div>
      </header>


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}
      <main className="mx-auto max-w-[1120px] px-5 py-10 sm:px-8 lg:py-14">

        {/* ===================================================
            WELCOME SECTION
        =================================================== */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white px-6 py-8 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:px-10 sm:py-10">

          {/* Decorative background */}
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-blue-50 blur-3xl" />

          <div className="relative">

            <div className="mb-3 inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-blue-700">
              SME Import Portal
            </div>

            <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">

              <div>
                <h1 className="max-w-2xl text-3xl font-bold tracking-tight text-[#14213D] sm:text-4xl">
                  Welcome back, My Business
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                  Manage your imports, find the right HS code, calculate
                  costs, and connect with trusted clearing agents.
                </p>
              </div>

              {/* Primary CTA */}
              <Link
                to="/new-import"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#183A6B] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/10 transition duration-200 hover:-translate-y-0.5 hover:bg-[#12315B] hover:shadow-xl lg:w-auto"
              >
                <PackagePlus size={18} />

                Start New Import

                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>

            </div>
          </div>
        </section>


        {/* ===================================================
            QUICK ACTIONS
        =================================================== */}
        <section className="mt-10">

          <div className="mb-5">
            <h2 className="text-lg font-bold text-[#14213D]">
              What would you like to do?
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Choose a tool to get started.
            </p>
          </div>


          <div className="grid gap-4 md:grid-cols-3">

            {/* HS CODE */}
            <Link
              to="/hs-code-search"
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_4px_20px_rgba(15,23,42,0.03)] transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
            >
              <div className="flex items-start justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700 transition group-hover:bg-blue-100">
                  <Search size={21} />
                </div>

                <ArrowUpRight
                  size={18}
                  className="text-slate-300 transition group-hover:text-blue-600"
                />
              </div>

              <h3 className="mt-5 text-base font-bold text-slate-800">
                HS Code Search
              </h3>

              <p className="mt-2 text-sm leading-5 text-slate-500">
                Find the correct HS code and understand applicable tariff
                information.
              </p>

              <div className="mt-5 flex items-center gap-1 text-xs font-semibold text-blue-700">
                Search HS codes
                <ChevronRight size={14} />
              </div>
            </Link>


            {/* CALCULATOR */}
            <Link
              to="/calculator"
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_4px_20px_rgba(15,23,42,0.03)] transition-all duration-200 hover:-translate-y-1 hover:border-amber-200 hover:shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
            >
              <div className="flex items-start justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700 transition group-hover:bg-amber-100">
                  <Calculator size={21} />
                </div>

                <ArrowUpRight
                  size={18}
                  className="text-slate-300 transition group-hover:text-amber-600"
                />
              </div>

              <h3 className="mt-5 text-base font-bold text-slate-800">
                Import Calculator
              </h3>

              <p className="mt-2 text-sm leading-5 text-slate-500">
                Estimate duties, taxes, and other import-related costs before
                you order.
              </p>

              <div className="mt-5 flex items-center gap-1 text-xs font-semibold text-amber-700">
                Calculate costs
                <ChevronRight size={14} />
              </div>
            </Link>


            {/* AGENT */}
            <Link
              to="/find-agent"
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_4px_20px_rgba(15,23,42,0.03)] transition-all duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
            >
              <div className="flex items-start justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 transition group-hover:bg-emerald-100">
                  <Users size={21} />
                </div>

                <ArrowUpRight
                  size={18}
                  className="text-slate-300 transition group-hover:text-emerald-600"
                />
              </div>

              <h3 className="mt-5 text-base font-bold text-slate-800">
                Find Clearing Agent
              </h3>

              <p className="mt-2 text-sm leading-5 text-slate-500">
                Connect with clearing agents and compare suitable offers for
                your shipment.
              </p>

              <div className="mt-5 flex items-center gap-1 text-xs font-semibold text-emerald-700">
                Find an agent
                <ChevronRight size={14} />
              </div>
            </Link>

          </div>
        </section>


        {/* ===================================================
            YOUR IMPORTS
        =================================================== */}
        <section className="mt-12">

          <div className="mb-5 flex items-end justify-between">

            <div>
              <h2 className="text-lg font-bold text-[#14213D]">
                Your Imports
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Track your recent import activity.
              </p>
            </div>

            <Link
              to="/shipments"
              className="hidden items-center gap-1 text-sm font-semibold text-blue-700 hover:text-blue-800 sm:flex"
            >
              View all
              <ChevronRight size={16} />
            </Link>

          </div>


          {/* Empty state */}
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-[0_4px_20px_rgba(15,23,42,0.02)]">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <Package size={25} strokeWidth={1.7} />
            </div>

            <h3 className="mt-5 text-base font-bold text-slate-800">
              No active imports yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Start your first import to track shipments, documents,
              clearance progress, and agent activity in one place.
            </p>

            <Link
              to="/new-import"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <PackagePlus size={17} />
              Start your first import
            </Link>

          </div>
        </section>


        {/* ===================================================
            SIMPLE HELP SECTION
        =================================================== */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2">

          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <Clock3 size={19} />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800">
                Need help with an import?
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Start an import and we'll guide you through the process.
              </p>
            </div>
          </div>


          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
              <FileText size={19} />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800">
                Keep your documents organized
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Your import documents will be available in one place.
              </p>
            </div>
          </div>

        </section>

      </main>


      {/* =====================================================
          MOBILE BOTTOM SPACE
      ===================================================== */}
      <div className="h-8" />

    </div>
  );
}

export default Dashboard;