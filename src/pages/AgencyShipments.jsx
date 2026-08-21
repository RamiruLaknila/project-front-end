import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  LogOut,
  Menu,
  Package,
  Search,
  Settings,
  ShieldCheck,
  Truck,
  Users,
  UserPlus,
  X,
} from "lucide-react";

const demoShipments = [
  {
    id: "IMP-1024",
    sme: "ABC Trading (Pvt) Ltd",
    product: "Solar Panels",
    agent: "Kasun Perera",
    status: "In Progress",
    updated: "Today, 10:30 AM",
  },
  {
    id: "IMP-1025",
    sme: "Lanka Tech Imports",
    product: "Laptop Computers",
    agent: "Nimal Silva",
    status: "Documents Pending",
    updated: "Today, 9:15 AM",
  },
  {
    id: "IMP-1026",
    sme: "Ceylon Apparel",
    product: "Cotton T-Shirts",
    agent: "Kasun Perera",
    status: "In Transit",
    updated: "Yesterday, 4:20 PM",
  },
  {
    id: "IMP-1027",
    sme: "Green Energy Solutions",
    product: "Power Converters",
    agent: "Amal Fernando",
    status: "Completed",
    updated: "Yesterday, 11:40 AM",
  },
];

const statusStyles = {
  "In Progress": "bg-blue-50 text-blue-700",
  "Documents Pending": "bg-amber-50 text-amber-700",
  "In Transit": "bg-indigo-50 text-indigo-700",
  Completed: "bg-emerald-50 text-emerald-700",
};

function AgencyShipments() {
  const navigate = useNavigate();

  const [agency, setAgency] = useState(null);
  const [agent, setAgent] = useState(null);
  const [shipments, setShipments] = useState([]);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* =========================================================
     LOAD AGENCY + ADMIN + SHIPMENTS
  ========================================================= */

  useEffect(() => {
    try {
      const storedAgency = localStorage.getItem("clearingAgency");
      const storedAgent = localStorage.getItem("clearingAgent");

      const storedShipments = localStorage.getItem(
        "agencyShipments"
      );

      if (storedAgency) {
        setAgency(JSON.parse(storedAgency));
      }

      if (storedAgent) {
        setAgent(JSON.parse(storedAgent));
      }

      if (storedShipments) {
        const parsedShipments = JSON.parse(storedShipments);

        if (Array.isArray(parsedShipments) && parsedShipments.length > 0) {
          setShipments(parsedShipments);
        } else {
          setShipments(demoShipments);
        }
      } else {
        setShipments(demoShipments);
      }
    } catch (error) {
      console.error(
        "Failed to load shipment information:",
        error
      );

      setShipments(demoShipments);
    }
  }, []);

  /* =========================================================
     PROTECT ADMIN AREA
  ========================================================= */

  useEffect(() => {
    const storedAgent =
      localStorage.getItem("clearingAgent");

    const storedAgency =
      localStorage.getItem("clearingAgency");

    if (!storedAgent || !storedAgency) {
      navigate("/agent-signin");
      return;
    }

    try {
      const currentAgent = JSON.parse(storedAgent);

      if (currentAgent.role !== "admin") {
        navigate("/agent-signin");
      }
    } catch {
      navigate("/agent-signin");
    }
  }, [navigate]);

  /* =========================================================
     FILTER SHIPMENTS
  ========================================================= */

  const filteredShipments = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return shipments;
    }

    return shipments.filter((shipment) => {
      return (
        String(shipment.id || "")
          .toLowerCase()
          .includes(query) ||
        String(shipment.sme || "")
          .toLowerCase()
          .includes(query) ||
        String(shipment.product || "")
          .toLowerCase()
          .includes(query) ||
        String(shipment.agent || "")
          .toLowerCase()
          .includes(query) ||
        String(shipment.status || "")
          .toLowerCase()
          .includes(query)
      );
    });
  }, [shipments, search]);

  /* =========================================================
     STATS
  ========================================================= */

  const activeCount = useMemo(() => {
    return shipments.filter(
      (shipment) =>
        shipment.status !== "Completed"
    ).length;
  }, [shipments]);

  const completedCount = useMemo(() => {
    return shipments.filter(
      (shipment) =>
        shipment.status === "Completed"
    ).length;
  }, [shipments]);

  const pendingCount = useMemo(() => {
    return shipments.filter(
      (shipment) =>
        shipment.status === "Documents Pending"
    ).length;
  }, [shipments]);

  const inTransitCount = useMemo(() => {
    return shipments.filter(
      (shipment) =>
        shipment.status === "In Transit"
    ).length;
  }, [shipments]);

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = () => {
    localStorage.removeItem("clearingAgent");
    localStorage.removeItem("agentOnboardingType");
    localStorage.removeItem("agentOnboardingComplete");

    navigate("/agent-signin");
  };

  /* =========================================================
     SIDEBAR
  ========================================================= */

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-900">

      {/* MOBILE OVERLAY */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[250px] flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        {/* LOGO */}

        <div className="flex h-[70px] items-center border-b border-slate-100 px-5">

          <Link
            to="/agent-admin-dashboard"
            className="flex items-center gap-3"
            onClick={() => setSidebarOpen(false)}
          >
            <img
              src="/logo.jpeg"
              alt="ImportEase"
              className="h-9 w-9 object-contain mix-blend-multiply"
            />

            <div>
              <p className="text-[16px] font-bold tracking-tight text-[#173563]">
                Import
                <span className="text-slate-900">
                  Ease
                </span>
              </p>

              <p className="text-[8px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                Agent Platform
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 lg:hidden"
          >
            <X size={18} />
          </button>

        </div>

        {/* AGENCY */}

        <div className="border-b border-slate-100 p-4">

          <div className="rounded-xl bg-slate-50 p-3">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#173563] text-white">
                <Building2 size={17} />
              </div>

              <div className="min-w-0">

                <p className="truncate text-xs font-bold text-slate-800">
                  {agency?.agencyName ||
                    "Your Agency"}
                </p>

                <p className="mt-0.5 text-[9px] text-slate-400">
                  Agency Admin
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* NAVIGATION */}

        <nav className="flex-1 space-y-1 p-3">

          <SidebarItem
            icon={Building2}
            label="Dashboard"
            to="/agent-admin-dashboard"
            onClick={() =>
              setSidebarOpen(false)
            }
          />

          <SidebarItem
            icon={Users}
            label="Agents"
            to="/agency-agents"
            onClick={() =>
              setSidebarOpen(false)
            }
          />

          <SidebarItem
            icon={UserPlus}
            label="Invite Agents"
            to="/agency-invite"
            onClick={() =>
              setSidebarOpen(false)
            }
          />

          <SidebarItem
            icon={FileText}
            label="SME Requests"
            to="/agent-marketplace"
            onClick={() =>
              setSidebarOpen(false)
            }
          />

          <SidebarItem
            icon={Truck}
            label="Shipments"
            to="/agent-shipments"
            active
            onClick={() =>
              setSidebarOpen(false)
            }
          />

        </nav>

        {/* BOTTOM */}

        <div className="border-t border-slate-100 p-3">

          <SidebarItem
            icon={Settings}
            label="Settings"
            to="/agent-settings"
            onClick={() =>
              setSidebarOpen(false)
            }
          />

          <button
            type="button"
            onClick={handleLogout}
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
          >
            <LogOut size={17} />
            Logout
          </button>

        </div>

      </aside>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <div className="lg:ml-[250px]">

        {/* TOP BAR */}

        <header className="sticky top-0 z-30 flex h-[70px] items-center border-b border-slate-200 bg-white/95 px-5 backdrop-blur-xl sm:px-8">

          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="mr-3 flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <Menu size={19} />
          </button>

          <div>

            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
              Agency workspace
            </p>

            <h1 className="text-sm font-bold text-slate-800">
              Shipments
            </h1>

          </div>

          <div className="ml-auto flex items-center gap-3">

            {/* NOTIFICATION */}

            <button
              type="button"
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100"
            >
              <Bell size={17} />

              {pendingCount > 0 && (
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blue-600 ring-2 ring-white" />
              )}
            </button>

            <div className="hidden h-7 w-px bg-slate-200 sm:block" />

            {/* ADMIN */}

            <div className="flex items-center gap-2">

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#173563] text-[10px] font-bold text-white">
                {getInitials(
                  agent?.name || "Admin"
                )}
              </div>

              <div className="hidden sm:block">

                <p className="text-xs font-semibold text-slate-800">
                  {agent?.name ||
                    "Agency Admin"}
                </p>

                <p className="text-[9px] text-slate-400">
                  Administrator
                </p>

              </div>

            </div>

          </div>

        </header>

        {/* =====================================================
            CONTENT
        ===================================================== */}

        <main className="mx-auto w-full max-w-[1180px] px-5 py-7 sm:px-8 lg:py-9">

          {/* PAGE HEADER */}

          <section className="mb-7">

            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

              <div>

                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5">

                  <Truck
                    size={13}
                    className="text-blue-600"
                  />

                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-700">
                    Shipment management
                  </span>

                </div>

                <h2 className="text-[28px] font-bold tracking-[-0.04em] text-[#14213D] sm:text-[38px]">
                  Agency shipments
                </h2>

                <p className="mt-2 max-w-2xl text-[13px] leading-6 text-slate-500 sm:text-sm">
                  Monitor and manage shipments currently
                  handled by agents in your agency.
                </p>

              </div>

              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5">

                <CheckCircle2
                  size={14}
                  className="text-emerald-600"
                />

                <span className="text-[10px] font-semibold text-emerald-700">
                  Agency active
                </span>

              </div>

            </div>

          </section>

          {/* =====================================================
              STATS
          ===================================================== */}

          <section className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">

            <ShipmentStat
              title="Active Shipments"
              value={activeCount}
              description="Currently in progress"
              icon={Truck}
              iconStyle="bg-blue-50 text-blue-600"
            />

            <ShipmentStat
              title="Documents Pending"
              value={pendingCount}
              description="Require attention"
              icon={Clock3}
              iconStyle="bg-amber-50 text-amber-700"
            />

            <ShipmentStat
              title="In Transit"
              value={inTransitCount}
              description="Currently moving"
              icon={Package}
              iconStyle="bg-indigo-50 text-indigo-600"
            />

            <ShipmentStat
              title="Completed"
              value={completedCount}
              description="Successfully completed"
              icon={CheckCircle2}
              iconStyle="bg-emerald-50 text-emerald-700"
            />

          </section>

          {/* =====================================================
              SEARCH
          ===================================================== */}

          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)] sm:p-6">

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              <div>

                <h2 className="text-sm font-bold text-[#14213D]">
                  Find a shipment
                </h2>

                <p className="mt-1 text-[11px] text-slate-500">
                  Search by shipment, SME, product,
                  agent, or status.
                </p>

              </div>

              <div className="relative w-full md:max-w-md">

                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search shipments..."
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-50"
                />

              </div>

            </div>

          </section>

          {/* =====================================================
              SHIPMENT TABLE
          ===================================================== */}

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,.02)]">

            {/* SECTION HEADER */}

            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">

              <div>

                <div className="flex items-center gap-2">

                  <h2 className="text-sm font-bold text-[#14213D]">
                    All shipments
                  </h2>

                  <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-600">
                    {filteredShipments.length}
                  </span>

                </div>

                <p className="mt-1 text-[11px] text-slate-500">
                  Shipments handled by your agency agents.
                </p>

              </div>

              <div className="hidden items-center gap-1 text-[10px] font-semibold text-[#173B6C] sm:flex">
                Agency shipments
                <ChevronRight size={12} />
              </div>

            </div>

            {/* DESKTOP */}

            <div className="hidden overflow-x-auto md:block">

              <table className="w-full">

                <thead>

                  <tr className="border-b border-slate-100 bg-slate-50/70">

                    <th className="px-6 py-4 text-left text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                      Shipment
                    </th>

                    <th className="px-6 py-4 text-left text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                      SME
                    </th>

                    <th className="px-6 py-4 text-left text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                      Product
                    </th>

                    <th className="px-6 py-4 text-left text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                      Assigned Agent
                    </th>

                    <th className="px-6 py-4 text-left text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                      Updated
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredShipments.map((shipment) => (

                    <tr
                      key={shipment.id}
                      className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50"
                    >

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                            <Package size={16} />
                          </div>

                          <span className="text-xs font-bold text-[#173563]">
                            {shipment.id}
                          </span>

                        </div>

                      </td>

                      <td className="px-6 py-4 text-xs text-slate-600">
                        {shipment.sme}
                      </td>

                      <td className="px-6 py-4 text-xs text-slate-600">
                        {shipment.product}
                      </td>

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-2">

                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-[8px] font-bold text-slate-600">
                            {getInitials(
                              shipment.agent
                            )}
                          </div>

                          <span className="text-xs font-semibold text-slate-700">
                            {shipment.agent}
                          </span>

                        </div>

                      </td>

                      <td className="px-6 py-4">

                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-semibold ${
                            statusStyles[
                              shipment.status
                            ] ||
                            "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {shipment.status}
                        </span>

                      </td>

                      <td className="px-6 py-4 text-[10px] text-slate-400">
                        {shipment.updated}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

            {/* MOBILE */}

            <div className="divide-y divide-slate-100 md:hidden">

              {filteredShipments.map((shipment) => (

                <div
                  key={shipment.id}
                  className="p-5"
                >

                  <div className="flex items-start justify-between gap-3">

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <Package size={16} />
                      </div>

                      <div>

                        <p className="text-xs font-bold text-slate-800">
                          {shipment.id}
                        </p>

                        <p className="mt-1 text-[9px] text-slate-400">
                          {shipment.updated}
                        </p>

                      </div>

                    </div>

                    <span
                      className={`rounded-full px-2.5 py-1 text-[8px] font-semibold ${
                        statusStyles[
                          shipment.status
                        ] ||
                        "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {shipment.status}
                    </span>

                  </div>

                  <div className="mt-4 space-y-2">

                    <MobileInfo
                      label="SME"
                      value={shipment.sme}
                    />

                    <MobileInfo
                      label="Product"
                      value={shipment.product}
                    />

                    <MobileInfo
                      label="Agent"
                      value={shipment.agent}
                    />

                  </div>

                </div>

              ))}

            </div>

            {/* EMPTY */}

            {filteredShipments.length === 0 && (

              <div className="px-6 py-14 text-center">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">

                  <Package size={22} />

                </div>

                <h3 className="mt-3 text-sm font-bold text-slate-700">
                  No shipments found
                </h3>

                <p className="mx-auto mt-1 max-w-sm text-[11px] leading-5 text-slate-400">
                  No shipments match your current
                  search.
                </p>

              </div>

            )}

          </section>

          {/* =====================================================
              FOOTER
          ===================================================== */}

          <div className="mt-9 flex items-center justify-center border-t border-slate-200 pt-6 text-center text-[10px] text-slate-400">
            ImportEase · Clearing Agency Platform
          </div>

        </main>

      </div>

    </div>
  );
}

/* =========================================================
   SIDEBAR ITEM
========================================================= */

function SidebarItem({
  icon: Icon,
  label,
  to,
  active = false,
  onClick,
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
        active
          ? "bg-blue-50 text-[#173563]"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
      }`}
    >
      <Icon
        size={17}
        strokeWidth={1.8}
      />

      <span>{label}</span>
    </Link>
  );
}

/* =========================================================
   SHIPMENT STAT
========================================================= */

function ShipmentStat({
  title,
  value,
  description,
  icon: Icon,
  iconStyle,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)]">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-[10px] font-semibold text-slate-400">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-800">
            {value}
          </p>

        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconStyle}`}
        >
          <Icon
            size={18}
            strokeWidth={1.8}
          />
        </div>

      </div>

      <p className="mt-3 text-[10px] text-slate-400">
        {description}
      </p>

    </div>
  );
}

/* =========================================================
   MOBILE INFO
========================================================= */

function MobileInfo({ label, value }) {
  return (
    <p className="flex gap-2 text-[11px]">

      <span className="w-16 shrink-0 text-slate-400">
        {label}
      </span>

      <span className="font-semibold text-slate-700">
        {value}
      </span>

    </p>
  );
}

/* =========================================================
   INITIALS
========================================================= */

function getInitials(name) {
  if (!name) {
    return "AD";
  }

  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 1) {
    return words[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return `${words[0][0]}${
    words[words.length - 1][0]
  }`.toUpperCase();
}

export default AgencyShipments;