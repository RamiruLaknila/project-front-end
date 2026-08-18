import { Search, Package, Users, Calculator } from "lucide-react";
import { Link } from "react-router-dom";

function Home() {
  const services = [
    {
      icon: Search,
      title: "HS Code Search",
      description: "Find the right HS code for your product.",
    },
    {
      icon: Calculator,
      title: "Tariff & Tax",
      description: "Understand duties and taxes before importing.",
    },
    {
      icon: Package,
      title: "Track Shipment",
      description: "Monitor your shipment from one place.",
    },
    {
      icon: Users,
      title: "Find a Clearing Agent",
      description: "Connect with suitable clearing agents.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">

      {/* NAVBAR */}
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold text-white">
              IE
            </div>

            <span className="text-xl font-bold text-slate-900">
              ImportEase
            </span>
          </Link>

          {/* NAVIGATION */}
          <div className="hidden gap-8 md:flex">

            <Link
              to="/"
              className="text-sm font-medium text-blue-600"
            >
              Home
            </Link>

            <a
              href="#services"
              className="text-sm font-medium text-slate-600 hover:text-blue-600"
            >
              HS Search
            </a>

            <a
              href="#services"
              className="text-sm font-medium text-slate-600 hover:text-blue-600"
            >
              Tracking
            </a>

            <a
              href="#services"
              className="text-sm font-medium text-slate-600 hover:text-blue-600"
            >
              Find Agent
            </a>

          </div>

          {/* GET STARTED */}
          <Link
            to="/signup"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Get Started
          </Link>

        </div>
      </nav>


      {/* HERO */}
      <section className="bg-white">

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2">

          {/* LEFT */}
          <div>

            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700">
              <span className="h-2 w-2 rounded-full bg-blue-600"></span>
              Import management for SMEs
            </div>

            <h1 className="max-w-2xl text-5xl font-bold leading-tight tracking-tight text-slate-950">
              Importing made
              <span className="text-blue-600"> simpler.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              ImportEase helps businesses find product information,
              understand tariffs, track shipments and connect with
              clearing agents.
            </p>

            <div className="mt-8 flex gap-4">

              {/* START IMPORT */}
              <Link
                to="/signup"
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
              >
                Start an Import
              </Link>

              {/* EXPLORE SERVICES */}
              <a
                href="#services"
                className="rounded-xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Explore Services
              </a>

            </div>

          </div>


          {/* PRODUCT PREVIEW */}
          <div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">

              <div className="flex items-center justify-between border-b pb-5">

                <div>
                  <p className="text-xs font-medium text-slate-400">
                    IMPORT WORKSPACE
                  </p>

                  <h2 className="mt-1 font-semibold text-slate-900">
                    Import Overview
                  </h2>
                </div>

                <div className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
                  Active
                </div>

              </div>


              {/* SEARCH */}
              <div className="mt-5 flex items-center gap-3 rounded-xl border bg-slate-50 px-4 py-3">

                <Search size={18} className="text-slate-400" />

                <span className="text-sm text-slate-400">
                  Search for a product...
                </span>

              </div>


              {/* STATS */}
              <div className="mt-4 grid grid-cols-2 gap-4">

                <div className="rounded-xl bg-blue-50 p-4">

                  <p className="text-sm text-blue-600">
                    HS Searches
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    24
                  </p>

                </div>

                <div className="rounded-xl bg-sky-50 p-4">

                  <p className="text-sm text-sky-600">
                    Shipments
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    08
                  </p>

                </div>

              </div>


              {/* SHIPMENT */}
              <div className="mt-4 rounded-xl border p-4">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-xs text-slate-400">
                      CURRENT SHIPMENT
                    </p>

                    <p className="mt-1 font-semibold text-slate-900">
                      Electronics
                    </p>

                  </div>

                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs text-green-600">
                    In Transit
                  </span>

                </div>

                <div className="mt-4 h-2 rounded-full bg-slate-100">

                  <div className="h-full w-3/5 rounded-full bg-blue-600"></div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* SERVICES */}
      <section id="services" className="py-20">

        <div className="mx-auto max-w-7xl px-6">

          <div className="max-w-xl">

            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              ImportEase tools
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-950">
              Everything you need to manage an import
            </h2>

            <p className="mt-4 text-slate-600">
              Use the tools you need without jumping between
              different websites and services.
            </p>

          </div>


          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {services.map((service) => {

              const Icon = service.icon;

              return (
                <div
                  key={service.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                >

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon size={21} />
                  </div>

                  <h3 className="mt-5 font-semibold text-slate-900">
                    {service.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {service.description}
                  </p>

                  <div className="mt-5 text-sm font-medium text-blue-600">
                    Explore →
                  </div>

                </div>
              );

            })}

          </div>

        </div>

      </section>


      {/* SIMPLE CTA */}
      <section className="px-6 pb-20">

        <div className="mx-auto max-w-7xl">

          <div className="rounded-3xl bg-blue-600 px-8 py-12 text-center text-white">

            <h2 className="text-3xl font-bold">
              Ready to simplify your next import?
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-blue-100">
              Start by searching for your product and
              understanding what you need before importing.
            </p>

            {/* CTA BUTTON */}
            <Link
              to="/signup"
              className="mt-7 inline-block rounded-xl bg-white px-6 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
            >
              Start an Import
            </Link>

          </div>

        </div>

      </section>


      {/* FOOTER */}
      <footer className="border-t bg-white">

        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-7 md:flex-row md:items-center md:justify-between">

          <Link to="/" className="flex items-center gap-2">

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white">
              IE
            </div>

            <span className="font-semibold">
              ImportEase
            </span>

          </Link>

          <p className="text-sm text-slate-500">
            Simplifying imports for growing businesses.
          </p>

        </div>

      </footer>

    </div>
  );
}

export default Home;

