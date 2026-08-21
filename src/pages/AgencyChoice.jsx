import { Link } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  Users,
  ShieldCheck,
} from "lucide-react";

function AgencyChoice() {
  return (
    <div className="min-h-screen bg-[#F6F8FB] text-[#173563]">

      {/* HEADER */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center px-6 lg:px-8">

          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <img
              src="/logo.jpeg"
              alt="ImportEase"
              className="h-12 w-12 object-contain mix-blend-multiply"
            />

            <div>
              <div className="text-lg font-bold tracking-tight text-[#173563]">
                ImportEase
              </div>

              <div className="text-xs font-medium text-slate-500">
                Clearing Agency Portal
              </div>
            </div>
          </Link>

        </div>
      </header>


      {/* MAIN */}

      <main className="mx-auto flex min-h-[calc(100vh-80px)] max-w-6xl items-center px-6 py-12 lg:px-8">

        <div className="w-full">

          {/* HEADING */}

          <div className="mx-auto max-w-2xl text-center">

            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
              <ShieldCheck
                size={28}
                className="text-[#2563EB]"
              />
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-[#173563] sm:text-4xl">
              Welcome to ImportEase
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-500 sm:text-lg">
              Get started by creating your clearing agency
              or joining an existing agency.
            </p>

          </div>


          {/* OPTIONS */}

          <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">


            {/* CREATE AGENCY */}

            <Link
              to="/create-agency"
              className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
            >

              <div className="flex items-start justify-between">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
                  <Building2
                    size={28}
                    className="text-[#2563EB]"
                  />
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 transition-colors group-hover:bg-blue-50">

                  <ArrowRight
                    size={19}
                    className="text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-[#2563EB]"
                  />

                </div>

              </div>


              <div className="mt-8">

                <h2 className="text-2xl font-bold text-[#173563]">
                  Register your Agency
                </h2>

                <p className="mt-3 leading-7 text-slate-500">
                  Set up your clearing agency, manage your
                  business profile, and manage your team.
                </p>

              </div>


              <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-[#2563EB]">
                Register your agency
                <ArrowRight size={16} />
              </div>

            </Link>


            {/* JOIN AGENCY */}

            <Link
              to="/join-agency"
              className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
            >

              <div className="flex items-start justify-between">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50">
                  <Users
                    size={28}
                    className="text-indigo-600"
                  />
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 transition-colors group-hover:bg-blue-50">

                  <ArrowRight
                    size={19}
                    className="text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-[#2563EB]"
                  />

                </div>

              </div>


              <div className="mt-8">

                <h2 className="text-2xl font-bold text-[#173563]">
                  Join an Agency
                </h2>

                <p className="mt-3 leading-7 text-slate-500">
                  Already work with a clearing agency?
                  Enter your agency code and request access
                  to its workspace.
                </p>

              </div>


              <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-[#2563EB]">
                Join an existing agency
                <ArrowRight size={16} />
              </div>

            </Link>

          </div>


          <p className="mt-10 text-center text-sm text-slate-400">
            Your agency workspace keeps your team and
            import operations organized in one place.
          </p>

        </div>

      </main>

    </div>
  );
}

export default AgencyChoice;