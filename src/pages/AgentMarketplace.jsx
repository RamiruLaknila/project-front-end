import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  DollarSign,
  Eye,
  FileText,
  Filter,
  LogOut,
  Menu,
  Package,
  Search,
  Send,
  Settings,
  Ship,
  Users,
  X,
} from "lucide-react";

function AgentMarketplace() {
  const navigate = useNavigate();

  const [agency, setAgency] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [requests, setRequests] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  /* =========================================================
     LOAD AGENCY
  ========================================================= */

  useEffect(() => {
    try {
      const storedAgency =
        localStorage.getItem("clearingAgency");

      const storedAdmin =
        localStorage.getItem("clearingAgent");

      if (!storedAgency || !storedAdmin) {
        navigate("/agent-signin");
        return;
      }

      const parsedAgency = JSON.parse(storedAgency);
      const parsedAdmin = JSON.parse(storedAdmin);

      if (parsedAdmin.role !== "admin") {
        navigate("/agent-signin");
        return;
      }

      setAgency(parsedAgency);
      setAdmin(parsedAdmin);

      loadRequests(
        parsedAgency.id || parsedAgency.code
      );
    } catch (error) {
      console.error(
        "Failed to load agency marketplace:",
        error
      );

      navigate("/agent-signin");
    }
  }, [navigate]);

  /* =========================================================
     LOAD REQUESTS
  ========================================================= */

  const loadRequests = (agencyId) => {
    try {
      const stored =
        localStorage.getItem("smeRequests");

      if (stored) {
        const parsed = JSON.parse(stored);

        const agencyRequests = parsed.filter(
          (request) =>
            !request.agencyId ||
            request.agencyId === agencyId
        );

        setRequests(agencyRequests);
        return;
      }

      /*
       * Demo data so the marketplace is visible
       * while the frontend is being developed.
       */

      const demoRequests = [
        {
          id: "REQ-1001",
          smeName: "Lanka Solar Solutions",
          product: "Solar Panels",
          hsCode: "8541.43",
          origin: "China",
          declaredValue: 12500,
          currency: "USD",
          quantity: 500,
          requiredDate: "2026-08-28",
          status: "new",
          createdAt: "2026-08-20T09:30:00",
          description:
            "Import of residential solar panels for local distribution.",
        },
        {
          id: "REQ-1002",
          smeName: "TechWorld Lanka",
          product: "Laptop Computers",
          hsCode: "8471.30",
          origin: "Singapore",
          declaredValue: 18400,
          currency: "USD",
          quantity: 80,
          requiredDate: "2026-09-02",
          status: "pending",
          createdAt: "2026-08-19T11:15:00",
          description:
            "Commercial laptop shipment requiring customs clearance.",
        },
        {
          id: "REQ-1003",
          smeName: "Ceylon Apparel",
          product: "Cotton T-Shirts",
          hsCode: "6109.10",
          origin: "India",
          declaredValue: 9200,
          currency: "USD",
          quantity: 2500,
          requiredDate: "2026-08-30",
          status: "in-progress",
          createdAt: "2026-08-18T14:20:00",
          description:
            "Bulk apparel import for retail distribution.",
        },
        {
          id: "REQ-1004",
          smeName: "AutoParts Lanka",
          product: "Motor Vehicle Parts",
          hsCode: "8708.99",
          origin: "Japan",
          declaredValue: 15600,
          currency: "USD",
          quantity: 320,
          requiredDate: "2026-09-05",
          status: "completed",
          createdAt: "2026-08-15T10:10:00",
          description:
            "Automotive spare parts shipment.",
        },
      ];

      setRequests(demoRequests);
    } catch (error) {
      console.error(
        "Failed to load requests:",
        error
      );
    }
  };

  /* =========================================================
     FILTER REQUESTS
  ========================================================= */

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const searchValue =
        search.trim().toLowerCase();

      const matchesSearch =
        !searchValue ||
        request.id
          ?.toLowerCase()
          .includes(searchValue) ||
        request.smeName
          ?.toLowerCase()
          .includes(searchValue) ||
        request.product
          ?.toLowerCase()
          .includes(searchValue) ||
        request.origin
          ?.toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "all" ||
        request.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [requests, search, statusFilter]);

  /* =========================================================
     STATS
  ========================================================= */

  const stats = useMemo(() => {
    return {
      total: requests.length,

      newRequests: requests.filter(
        (request) => request.status === "new"
      ).length,

      pending: requests.filter(
        (request) => request.status === "pending"
      ).length,

      inProgress: requests.filter(
        (request) =>
          request.status === "in-progress"
      ).length,

      completed: requests.filter(
        (request) =>
          request.status === "completed"
      ).length,
    };
  }, [requests]);

  /* =========================================================
     VIEW REQUEST
  ========================================================= */

  const handleViewRequest = (request) => {
    localStorage.setItem(
      "selectedSMERequest",
      JSON.stringify(request)
    );

    navigate("/agent-request-details");
  };

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = () => {
    localStorage.removeItem("clearingAgent");
    localStorage.removeItem(
      "agentOnboardingType"
    );
    localStorage.removeItem(
      "agentOnboardingComplete"
    );

    navigate("/agent-signin");
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (!agency || !admin) {
    return null;
  }

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
            onClick={() =>
              setSidebarOpen(false)
            }
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
            onClick={() =>
              setSidebarOpen(false)
            }
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
                  {agency.agencyName ||
                    agency.name ||
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
            icon={Users}
            label="Invite Agents"
            to="/agency-invite"
            onClick={() =>
              setSidebarOpen(false)
            }
          />

          <SidebarItem
            icon={ClipboardList}
            label="SME Requests"
            active
            to="/agent-marketplace"
            onClick={() =>
              setSidebarOpen(false)
            }
          />

          <SidebarItem
            icon={Ship}
            label="Shipments"
            to="/agent-shipments"
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
            onClick={() =>
              setSidebarOpen(true)
            }
            className="mr-3 flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <Menu size={19} />
          </button>

          <div>

            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
              Agency workspace
            </p>

            <h1 className="text-sm font-bold text-slate-800">
              SME Requests
            </h1>

          </div>

          <div className="ml-auto flex items-center gap-3">

            <div className="hidden h-7 w-px bg-slate-200 sm:block" />

            <div className="flex items-center gap-2">

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#173563] text-[10px] font-bold text-white">
                {getInitials(
                  admin.name || "Admin"
                )}
              </div>

              <div className="hidden sm:block">

                <p className="text-xs font-semibold text-slate-800">
                  {admin.name ||
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

          {/* HEADER */}

          <section className="mb-7">

            <Link
              to="/agent-admin-dashboard"
              className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              <ArrowLeft size={14} />
              Back to Dashboard
            </Link>

            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

              <div>

                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5">

                  <ClipboardList
                    size={13}
                    className="text-blue-600"
                  />

                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-700">
                    Import marketplace
                  </span>

                </div>

                <h2 className="text-[28px] font-bold tracking-[-0.04em] text-[#14213D] sm:text-[38px]">
                  SME Requests
                </h2>

                <p className="mt-2 max-w-2xl text-[13px] leading-6 text-slate-500 sm:text-sm">
                  Review import clearance requests
                  from SMEs and manage the requests
                  assigned to your agency.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  loadRequests(
                    agency.id ||
                      agency.code
                  )
                }
                className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Refresh Requests
              </button>

            </div>

          </section>

          {/* =================================================
              SUMMARY
          ================================================= */}

          <section className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">

            <SummaryCard
              icon={ClipboardList}
              label="New Requests"
              value={stats.newRequests}
              iconStyle="bg-blue-50 text-blue-600"
            />

            <SummaryCard
              icon={Clock3}
              label="Pending"
              value={stats.pending}
              iconStyle="bg-amber-50 text-amber-700"
            />

            <SummaryCard
              icon={Ship}
              label="In Progress"
              value={stats.inProgress}
              iconStyle="bg-violet-50 text-violet-700"
            />

            <SummaryCard
              icon={CheckCircle2}
              label="Completed"
              value={stats.completed}
              iconStyle="bg-emerald-50 text-emerald-700"
            />

          </section>

          {/* =================================================
              SEARCH / FILTER
          ================================================= */}

          <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-4">

            <div className="flex flex-col gap-3 md:flex-row">

              <div className="relative flex-1">

                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search SME, product, request ID or origin..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#173563] focus:bg-white focus:ring-2 focus:ring-[#173563]/10"
                />

              </div>

              <div className="flex items-center gap-2">

                <Filter
                  size={15}
                  className="text-slate-400"
                />

                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(
                      event.target.value
                    )
                  }
                  className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none focus:border-[#173563]"
                >
                  <option value="all">
                    All Requests
                  </option>
                  <option value="new">
                    New
                  </option>
                  <option value="pending">
                    Pending
                  </option>
                  <option value="in-progress">
                    In Progress
                  </option>
                  <option value="completed">
                    Completed
                  </option>
                </select>

              </div>

            </div>

          </section>

          {/* =================================================
              REQUEST LIST
          ================================================= */}

          <section>

            <div className="mb-4 flex items-center justify-between">

              <div>

                <h2 className="text-sm font-bold text-[#14213D]">
                  Import requests
                </h2>

                <p className="mt-1 text-[11px] text-slate-500">
                  {filteredRequests.length} request
                  {filteredRequests.length !== 1
                    ? "s"
                    : ""}{" "}
                  available
                </p>

              </div>

            </div>

            <div className="space-y-3">

              {filteredRequests.length === 0 ? (

                <EmptyState
                  icon={ClipboardList}
                  title="No requests found"
                  description="There are no SME requests matching your current filters."
                />

              ) : (

                filteredRequests.map(
                  (request) => (
                    <RequestCard
                      key={request.id}
                      request={request}
                      onView={() =>
                        handleViewRequest(
                          request
                        )
                      }
                    />
                  )
                )

              )}

            </div>

          </section>

          {/* FOOTER */}

          <div className="mt-9 flex items-center justify-center border-t border-slate-200 pt-6 text-center text-[10px] text-slate-400">
            ImportEase · Clearing Agency Platform
          </div>

        </main>

      </div>

    </div>
  );
}

/* =========================================================
   REQUEST CARD
========================================================= */

function RequestCard({ request, onView }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)] transition hover:border-slate-300">

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        {/* LEFT */}

        <div className="min-w-0 flex-1">

          <div className="flex flex-wrap items-center gap-2">

            <span className="rounded-lg bg-slate-100 px-2 py-1 font-mono text-[9px] font-bold text-slate-500">
              {request.id}
            </span>

            <StatusBadge
              status={request.status}
            />

          </div>

          <div className="mt-3 flex items-start gap-3">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#173563]">
              <Package size={19} />
            </div>

            <div className="min-w-0">

              <h3 className="text-sm font-bold text-slate-800">
                {request.product ||
                  "Import Request"}
              </h3>

              <p className="mt-1 text-[11px] text-slate-500">
                {request.smeName ||
                  "SME Customer"}
              </p>

            </div>

          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">

            <InfoItem
              icon={FileText}
              label="HS Code"
              value={
                request.hsCode ||
                "Not assigned"
              }
            />

            <InfoItem
              icon={Building2}
              label="Origin"
              value={
                request.origin ||
                "Unknown"
              }
            />

            <InfoItem
              icon={DollarSign}
              label="Declared Value"
              value={formatCurrency(
                request.declaredValue,
                request.currency
              )}
            />

            <InfoItem
              icon={CalendarDays}
              label="Required By"
              value={formatDate(
                request.requiredDate
              )}
            />

          </div>

          {request.description && (
            <p className="mt-4 max-w-3xl text-[11px] leading-5 text-slate-400">
              {request.description}
            </p>
          )}

        </div>

        {/* RIGHT */}

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col">

          <button
            type="button"
            onClick={onView}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <Eye size={15} />
            View Request
          </button>

          {request.status === "new" && (
            <button
              type="button"
              onClick={onView}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173563] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#102547]"
            >
              <Send size={15} />
              Submit Bid
            </button>
          )}

          {request.status === "pending" && (
            <button
              type="button"
              onClick={onView}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173563] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#102547]"
            >
              <Eye size={15} />
              Review
            </button>
          )}

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({ status }) {
  const styles = {
    new: {
      label: "New",
      className:
        "bg-blue-50 text-blue-700",
      icon: ClipboardList,
    },

    pending: {
      label: "Pending",
      className:
        "bg-amber-50 text-amber-700",
      icon: Clock3,
    },

    "in-progress": {
      label: "In Progress",
      className:
        "bg-violet-50 text-violet-700",
      icon: Ship,
    },

    completed: {
      label: "Completed",
      className:
        "bg-emerald-50 text-emerald-700",
      icon: CheckCircle2,
    },
  };

  const config =
    styles[status] || styles.pending;

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[9px] font-semibold ${config.className}`}
    >
      <Icon size={10} />
      {config.label}
    </span>
  );
}

/* =========================================================
   INFO ITEM
========================================================= */

function InfoItem({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div>

      <div className="flex items-center gap-1 text-[9px] font-semibold text-slate-400">
        <Icon size={10} />
        {label}
      </div>

      <p className="mt-1 truncate text-[11px] font-semibold text-slate-700">
        {value}
      </p>

    </div>
  );
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
  icon: Icon,
  label,
  value,
  iconStyle,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)]">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-[10px] font-semibold text-slate-400">
            {label}
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

    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center">

      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
        <Icon size={22} />
      </div>

      <h3 className="mt-4 text-sm font-bold text-slate-700">
        {title}
      </h3>

      <p className="mx-auto mt-1 max-w-sm text-[11px] leading-5 text-slate-400">
        {description}
      </p>

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
   DATE
========================================================= */

function formatDate(date) {
  if (!date) {
    return "Not set";
  }

  try {
    return new Date(date).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  } catch {
    return "Not set";
  }
}

/* =========================================================
   CURRENCY
========================================================= */

function formatCurrency(
  value,
  currency = "USD"
) {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return "Not set";
  }

  try {
    return new Intl.NumberFormat(
      "en-US",
      {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }
    ).format(Number(value));
  } catch {
    return `${currency} ${value}`;
  }
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

export default AgentMarketplace;