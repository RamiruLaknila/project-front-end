import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  FileText,
  Package,
  RefreshCw,
  Search,
  Users,
} from "lucide-react";
import AgentMemberSidebar from "../components/AgentMemberSidebar";

function AgentRequests() {
  const navigate = useNavigate();

  const [agent, setAgent] = useState(null);
  const [requests, setRequests] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  /* =========================================================
     LOAD AGENCY MEMBER DATA
  ========================================================= */

  useEffect(() => {
    try {
      const storedAgent = localStorage.getItem("clearingAgent");

      if (!storedAgent) {
        navigate("/agent-signin", { replace: true });
        return;
      }

      const parsedAgent = JSON.parse(storedAgent);

      if (parsedAgent.agentType !== "agency-member") {
        navigate("/agent-signin", { replace: true });
        return;
      }

      setAgent(parsedAgent);
    } catch (error) {
      console.error("Failed to load agency member data:", error);

      navigate("/agent-signin", {
        replace: true,
      });
    }
  }, [navigate]);

  const agentName = agent?.fullName || "Agency Member";

  /* =========================================================
     LOAD SME REQUESTS
  ========================================================= */

  const loadRequests = () => {
    setLoading(true);

    try {
      const storedRequests = JSON.parse(
        localStorage.getItem("smeRequests") || "[]"
      );

      if (Array.isArray(storedRequests) && storedRequests.length > 0) {
        setRequests(storedRequests);
      } else {
        setRequests(getDemoRequests());
      }
    } catch (error) {
      console.error("Failed to load SME requests:", error);
      setRequests(getDemoRequests());
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 250);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  /* =========================================================
     NAVIGATION
  ========================================================= */

  const goToDashboard = () => {
    navigate("/agent-dashboard");
  };

  /* =========================================================
     CATEGORIES & FILTERING
  ========================================================= */

  const categories = useMemo(() => {
    const values = requests
      .map(
        (request) =>
          request.category ||
          request.productCategory ||
          request.industry
      )
      .filter(Boolean);

    return ["All", ...new Set(values)];
  }, [requests]);

  const filteredRequests = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return requests.filter((request) => {
      const product =
        request.productName ||
        request.product ||
        request.name ||
        "";

      const category =
        request.category ||
        request.productCategory ||
        request.industry ||
        "";

      const hsCode = request.hsCode || request.hs_code || "";

      const origin =
        request.origin ||
        request.originCountry ||
        request.countryOfOrigin ||
        "";

      const destination =
        request.destination ||
        request.destinationCountry ||
        "Colombo";

      const status = request.status || "New";

      const searchableText = [
        product,
        category,
        hsCode,
        origin,
        destination,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !search || searchableText.includes(search);

      const matchesCategory =
        categoryFilter === "All" ||
        category === categoryFilter;

      const matchesStatus =
        statusFilter === "All" ||
        status.toLowerCase() === statusFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [
    requests,
    searchTerm,
    categoryFilter,
    statusFilter,
  ]);

  const openRequestsCount = requests.filter(
    (request) => {
      const status = String(
        request.status || "New"
      ).toLowerCase();

      return status === "new" || status === "open";
    }
  ).length;

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-900">
      <AgentMemberSidebar />

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="min-h-screen lg:ml-[270px]">
        {/* ===================================================
            HEADER
        =================================================== */}

        <header className="sticky top-0 z-30 flex h-[70px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                Agency Member Workspace
              </p>

              <h1 className="text-base font-bold text-slate-800">
                SME Requests
              </h1>
            </div>
          </div>

          {/* HEADER ACTIONS */}

          <div className="ml-auto flex items-center gap-2">
            {/* REFRESH */}

            <button
              type="button"
              onClick={loadRequests}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
              aria-label="Refresh requests"
            >
              <RefreshCw
                size={17}
                className={
                  loading ? "animate-spin" : ""
                }
              />
            </button>

            {/* NOTIFICATIONS */}

            <button
              type="button"
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
              aria-label="Notifications"
            >
              <Bell size={17} />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
            </button>
          </div>
        </header>

        {/* ===================================================
            CONTENT
        =================================================== */}

        <div className="mx-auto max-w-[1180px] px-5 py-7 sm:px-8 lg:py-9">
          {/* BACK TO DASHBOARD */}

          <button
            type="button"
            onClick={goToDashboard}
            className="mb-5 inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 transition hover:text-[#173563]"
          >
            ← Back to Dashboard
          </button>

          {/* =================================================
              PAGE HEADER
          ================================================= */}

          <section className="mb-7">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <div className="mb-2 flex items-center gap-2">
              
                </div>

                <h2 className="text-[32px] font-bold tracking-[-0.04em] text-[#14213D] sm:text-[42px]">
                  Find Import Requests
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-[15px]">
                  Browse import requests from SMEs and find
                  opportunities that match your clearing
                  services.
                </p>
              </div>

              <button
                type="button"
                onClick={loadRequests}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 shadow-sm transition hover:bg-slate-50"
              >
                <RefreshCw
                  size={17}
                  className={
                    loading ? "animate-spin" : ""
                  }
                />
                Refresh
              </button>
            </div>
          </section>

          {/* =================================================
              SUMMARY CARDS
          ================================================= */}

          <section className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SummaryCard
              icon={FileText}
              label="Available Requests"
              value={requests.length}
              iconStyle="bg-blue-50 text-blue-600"
            />

            <SummaryCard
              icon={CheckCircle2}
              label="Open Requests"
              value={openRequestsCount}
              iconStyle="bg-emerald-50 text-emerald-600"
            />
          </section>

          {/* =================================================
              SEARCH & FILTERS
          ================================================= */}

          <section className="mb-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)]">
            <div className="flex flex-col gap-3 lg:flex-row">
              {/* SEARCH */}

              <div className="relative flex-1">
                <Search
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                  placeholder="Search product, HS code, origin..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-50"
                />
              </div>

              {/* CATEGORY */}

              <div className="relative lg:w-[220px]">
                <select
                  value={categoryFilter}
                  onChange={(e) =>
                    setCategoryFilter(e.target.value)
                  }
                  className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 pr-9 text-sm font-semibold text-slate-600 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-50"
                >
                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category === "All"
                        ? "All Categories"
                        : category}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>

              {/* STATUS */}

              <div className="relative lg:w-[190px]">
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value)
                  }
                  className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 pr-9 text-sm font-semibold text-slate-600 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-50"
                >
                  <option value="All">
                    All Statuses
                  </option>

                  <option value="New">
                    New / Open
                  </option>

                  <option value="Closed">
                    Closed
                  </option>
                </select>

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>
          </section>

          {/* =================================================
              RESULTS HEADER
          ================================================= */}

          <section className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#14213D]">
                Available Import Requests
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {filteredRequests.length} request
                {filteredRequests.length === 1
                  ? ""
                  : "s"}{" "}
                found
              </p>
            </div>

            {(searchTerm ||
              categoryFilter !== "All" ||
              statusFilter !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setCategoryFilter("All");
                  setStatusFilter("All");
                }}
                className="text-xs font-bold text-blue-600 transition hover:text-blue-700"
              >
                Clear Filters
              </button>
            )}
          </section>

          {/* =================================================
              REQUEST LIST
          ================================================= */}

          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-[0_2px_10px_rgba(15,23,42,.02)]">
              <RefreshCw
                size={25}
                className="mx-auto animate-spin text-blue-600"
              />

              <p className="mt-4 text-sm font-semibold text-slate-600">
                Loading requests...
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Please wait while we load the latest
                SME requests.
              </p>
            </div>
          ) : filteredRequests.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredRequests.map(
                (request, index) => (
                  <RequestCard
                    key={
                      request.id ||
                      `req-${index}`
                    }
                    request={request}
                    onView={() => {
                      localStorage.setItem(
                        "selectedSMERequest",
                        JSON.stringify(request)
                      );

                      navigate(
                        "/agent-request-details"
                      );
                    }}
                  />
                )
              )}
            </div>
          ) : (
            <EmptyRequests
              hasFilters={
                !!searchTerm ||
                categoryFilter !== "All" ||
                statusFilter !== "All"
              }
              onClear={() => {
                setSearchTerm("");
                setCategoryFilter("All");
                setStatusFilter("All");
              }}
            />
          )}

          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="mt-9 flex items-center justify-center border-t border-slate-200 pt-6 text-center text-[10px] text-slate-400">
            ImportEase · Agency Member Platform
          </div>
        </div>
      </main>
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
            size={19}
            strokeWidth={1.8}
          />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   REQUEST CARD
========================================================= */

function RequestCard({
  request,
  onView,
}) {
  const productName =
    request.productName ||
    request.product ||
    request.name ||
    "Import Request";

  const category =
    request.category ||
    request.productCategory ||
    request.industry ||
    "General";

  const origin =
    request.origin ||
    request.originCountry ||
    request.countryOfOrigin ||
    "—";

  const destination =
    request.destination ||
    request.destinationCountry ||
    "Colombo";

  const hsCode =
    request.hsCode ||
    request.hs_code ||
    "Not specified";

  const value =
    request.value ||
    request.productValue ||
    request.estimatedValue ||
    "Not specified";

  const service =
    request.requiredService ||
    request.service ||
    "Customs Clearance";

  const status =
    request.status || "New";

  const postedDate =
    request.posted ||
    request.createdAt ||
    request.postedAt ||
    "Recently";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)] transition hover:border-blue-200 hover:shadow-md sm:p-6">
      {/* CARD TOP */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Package
              size={20}
              strokeWidth={1.8}
            />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-bold text-slate-800">
                {productName}
              </h3>

              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-bold text-blue-600">
                {category}
              </span>
            </div>

            <p className="mt-1 text-xs text-slate-400">
              {request.company
                ? `${request.company} · `
                : ""}
              {request.id || "Request"}
            </p>
          </div>
        </div>

        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-bold text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {status}
        </span>
      </div>

      {/* ROUTE */}

      <div className="mt-5 flex flex-col gap-3 rounded-xl bg-slate-50 p-4 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400">
            Origin
          </p>

          <p className="mt-1 truncate text-xs font-bold text-slate-700">
            {origin}
          </p>
        </div>

        <div className="hidden text-slate-300 sm:block">
          →
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400">
            Destination
          </p>

          <p className="mt-1 truncate text-xs font-bold text-slate-700">
            {destination}
          </p>
        </div>
      </div>

      {/* DETAILS GRID */}

      <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-4 md:grid-cols-4">
        <RequestDetail
          label="HS Code"
          value={hsCode}
        />

        <RequestDetail
          label="Estimated Value"
          value={value}
        />

        <RequestDetail
          label="Required Service"
          value={service}
        />

        <RequestDetail
          label="Posted"
          value={postedDate}
        />
      </div>

      {/* CARD FOOTER */}

      <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[10px] text-slate-400">
          Posted {postedDate}
        </p>

        <button
          type="button"
          onClick={onView}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#173563] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#102547]"
        >
          View Request
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   REQUEST DETAIL
========================================================= */

function RequestDetail({
  label,
  value,
}) {
  return (
    <div className="min-w-0">
      <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400">
        {label}
      </p>

      <p className="mt-1 truncate text-xs font-bold text-slate-700">
        {value || "—"}
      </p>
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyRequests({
  hasFilters,
  onClear,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-[0_2px_10px_rgba(15,23,42,.02)]">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
        <FileText size={24} />
      </div>

      <h3 className="mt-4 text-base font-bold text-slate-700">
        {hasFilters
          ? "No matching requests"
          : "No SME requests yet"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-slate-400">
        {hasFilters
          ? "Try changing your search terms or filters to find more import requests."
          : "New SME import requests will appear here when they become available."}
      </p>

      {hasFilters && (
        <button
          type="button"
          onClick={onClear}
          className="mt-5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}

/* =========================================================
   DEMO REQUESTS
========================================================= */

function getDemoRequests() {
  return [
    {
      id: "SME-2048",
      company: "ABC Trading",
      productName: "Electronic Components",
      category: "Electronics",
      origin: "China",
      destination: "Colombo",
      hsCode: "8517.62",
      value: "LKR 2,450,000",
      posted: "2 hours ago",
      requiredService: "Customs Clearance",
      status: "New",
    },
    {
      id: "SME-2047",
      company: "Lanka Home Supplies",
      productName: "Kitchen Equipment",
      category: "Appliances",
      origin: "India",
      destination: "Colombo",
      hsCode: "8419.81",
      value: "LKR 1,820,000",
      posted: "5 hours ago",
      requiredService: "Import Duty Clearance",
      status: "New",
    },
    {
      id: "SME-2046",
      company: "Island Retailers",
      productName: "Textile Products",
      category: "Textiles",
      origin: "Vietnam",
      destination: "Colombo",
      hsCode: "6109.10",
      value: "LKR 3,100,000",
      posted: "Yesterday",
      requiredService: "Full Clearing & Delivery",
      status: "New",
    },
  ];
}

export default AgentRequests;