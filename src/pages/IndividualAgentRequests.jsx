import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  FileText,
  Filter,
  MapPin,
  Package,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import IndividualAgentSidebar from "../components/IndividualAgentSidebar";

function IndividualAgentRequests() {
  const navigate = useNavigate();

  const [agent, setAgent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const savedAgent = localStorage.getItem("clearingAgent");

    if (savedAgent) {
      try {
        setAgent(JSON.parse(savedAgent));
      } catch {
        setAgent(null);
      }
    }
  }, []);

  const displayName =
    agent?.fullName ||
    agent?.name ||
    localStorage.getItem("agentName") ||
    "Individual Agent";

  const demoRequests = [
    {
      id: "REQ-1001",
      product: "Solar Panels",
      category: "Electronics",
      description:
        "Import clearance required for solar panels and related equipment.",
      destination: "Colombo Port",
      origin: "China",
      value: "USD 12,500",
      quantity: "200 Units",
      posted: "Today",
      status: "Open",
      deadline: "Sep 10, 2026",
    },
    {
      id: "REQ-1002",
      product: "Cotton T-Shirts",
      category: "Textiles",
      description:
        "Clearance assistance required for a commercial shipment of cotton T-shirts.",
      destination: "Colombo Port",
      origin: "India",
      value: "USD 8,200",
      quantity: "5,000 Pieces",
      posted: "Today",
      status: "Open",
      deadline: "Sep 11, 2026",
    },
    {
      id: "REQ-1003",
      product: "Industrial Machinery",
      category: "Machinery",
      description:
        "Commercial machinery shipment requiring customs clearance and documentation support.",
      destination: "Hambantota Port",
      origin: "Japan",
      value: "USD 25,000",
      quantity: "4 Units",
      posted: "Yesterday",
      status: "Open",
      deadline: "Sep 12, 2026",
    },
    {
      id: "REQ-1004",
      product: "LED Lighting Equipment",
      category: "Electronics",
      description:
        "SME looking for a clearing agent for a commercial LED lighting shipment.",
      destination: "Colombo Port",
      origin: "China",
      value: "USD 6,800",
      quantity: "1,200 Units",
      posted: "Yesterday",
      status: "Open",
      deadline: "Sep 13, 2026",
    },
    {
      id: "REQ-1005",
      product: "Kitchen Appliances",
      category: "Consumer Goods",
      description:
        "Import clearance needed for various household kitchen appliances.",
      destination: "Colombo Port",
      origin: "Malaysia",
      value: "USD 9,400",
      quantity: "350 Units",
      posted: "2 days ago",
      status: "Open",
      deadline: "Sep 14, 2026",
    },
    {
      id: "REQ-1006",
      product: "Automotive Spare Parts",
      category: "Automotive",
      description:
        "Clearance service requested for a shipment of automotive spare parts.",
      destination: "Colombo Port",
      origin: "Thailand",
      value: "USD 15,600",
      quantity: "800 Pieces",
      posted: "2 days ago",
      status: "Open",
      deadline: "Sep 15, 2026",
    },
  ];

  const [requests, setRequests] = useState(demoRequests);

  useEffect(() => {
    const savedRequests = localStorage.getItem("smeRequests");

    if (savedRequests) {
      try {
        const parsedRequests = JSON.parse(savedRequests);

        if (Array.isArray(parsedRequests) && parsedRequests.length > 0) {
          setRequests(parsedRequests);
        }
      } catch {
        setRequests(demoRequests);
      }
    }
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        requests.map((request) => request.category).filter(Boolean)
      ),
    ];

    return ["All", ...uniqueCategories];
  }, [requests]);

  const statuses = ["All", "Open", "Closed"];

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const search = searchTerm.toLowerCase().trim();

      const matchesSearch =
        !search ||
        request.product?.toLowerCase().includes(search) ||
        request.category?.toLowerCase().includes(search) ||
        request.destination?.toLowerCase().includes(search) ||
        request.origin?.toLowerCase().includes(search) ||
        request.id?.toLowerCase().includes(search);

      const matchesCategory =
        selectedCategory === "All" ||
        request.category === selectedCategory;

      const matchesStatus =
        selectedStatus === "All" ||
        request.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [requests, searchTerm, selectedCategory, selectedStatus]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedStatus("All");
  };

  const hasActiveFilters =
    searchTerm ||
    selectedCategory !== "All" ||
    selectedStatus !== "All";

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-[#173563]">
      <IndividualAgentSidebar />

      <div className="min-h-screen">
        {/* =====================================================
            MAIN
        ===================================================== */}
        <main className="min-h-screen lg:ml-[260px]">
          {/* =====================================================
              HEADER
          ===================================================== */}
          <header className="sticky top-0 z-30 flex h-[70px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
            <div className="flex items-center">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                  Individual Agent Workspace
                </p>

                <h1 className="mt-0.5 text-base font-bold text-slate-800">
                  SME Requests
                </h1>
              </div>
            </div>

            {/* Header Actions */}
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#2563EB]"
                title="Refresh"
              >
                <RefreshCw size={17} />
              </button>

              <button
                type="button"
                className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#2563EB]"
                title="Notifications"
              >
                <Bell size={17} />

                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
              </button>
            </div>
          </header>

          {/* =====================================================
              CONTENT
          ===================================================== */}
          <div className="mx-auto max-w-[1180px] px-5 py-7 sm:px-8 lg:py-9">
            {/* Page heading */}
            <section className="mb-7">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                  

                  <h2 className="mt-1 text-[32px] font-bold tracking-[-0.04em] text-[#14213D] sm:text-[42px]">
                    SME Import Requests
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-[15px]">
                    Browse import requests from SMEs and submit competitive
                    clearing service bids.
                  </p>
                </div>

                <div className="flex w-fit items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#2563EB] shadow-sm">
                    <CheckCircle2 size={18} />
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-500">
                      Open Requests
                    </p>

                    <p className="text-lg font-bold text-[#173563]">
                      {
                        requests.filter(
                          (request) => request.status === "Open"
                        ).length
                      }
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* =====================================================
                SEARCH / FILTER
            ===================================================== */}
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,.02)] sm:p-5">
              <div className="flex flex-col gap-3 lg:flex-row">
                {/* Search */}
                <div className="relative flex-1">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) =>
                      setSearchTerm(event.target.value)
                    }
                    placeholder="Search by product, category, port or request ID..."
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-11 text-sm text-[#173563] outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-50"
                  />

                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>

                {/* Filter */}
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition ${
                    showFilters || hasActiveFilters
                      ? "border-blue-200 bg-blue-50 text-[#2563EB]"
                      : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-[#2563EB]"
                  }`}
                >
                  <Filter size={17} />
                  Filters
                </button>
              </div>

              {/* Filters */}
              {showFilters && (
                <div className="mt-4 border-t border-slate-100 pt-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-slate-500">
                        Category
                      </label>

                      <select
                        value={selectedCategory}
                        onChange={(event) =>
                          setSelectedCategory(event.target.value)
                        }
                        className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-[#173563] outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-50"
                      >
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-semibold text-slate-500">
                        Status
                      </label>

                      <select
                        value={selectedStatus}
                        onChange={(event) =>
                          setSelectedStatus(event.target.value)
                        }
                        className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-[#173563] outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-50"
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="mt-4 text-xs font-semibold text-[#2563EB] hover:underline"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              )}
            </section>

            {/* =====================================================
                RESULT SUMMARY
            ===================================================== */}
            <div className="mt-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#173563]">
                  Available Requests
                </p>

                <p className="mt-0.5 text-xs text-slate-400">
                  Showing {filteredRequests.length} of {requests.length}{" "}
                  requests
                </p>
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs font-semibold text-[#2563EB] hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>

            {/* =====================================================
                REQUEST CARDS
            ===================================================== */}
            <section className="mt-4 space-y-4">
              {filteredRequests.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  navigate={navigate}
                />
              ))}

              {filteredRequests.length === 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-[0_2px_10px_rgba(15,23,42,.02)]">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    <Search size={20} />
                  </div>

                  <h3 className="mt-4 text-sm font-bold text-[#173563]">
                    No requests found
                  </h3>

                  <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-400">
                    Try changing your search or removing some filters to see
                    more SME import requests.
                  </p>

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-4 rounded-xl bg-[#173563] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#10294d]"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </section>

            {/* Footer */}
            <footer className="mt-10 border-t border-slate-200 pt-5">
              <div className="flex flex-col gap-2 text-[11px] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                <p>
                  © {new Date().getFullYear()} ImportEase. All rights
                  reserved.
                </p>

                <p>Individual Agent Workspace</p>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ============================================================
   REQUEST CARD
============================================================ */
function RequestCard({ request, navigate }) {
  const isOpen = request.status === "Open";

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)] transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/20 hover:shadow-md sm:p-6">
      {/* Top */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB] transition group-hover:bg-blue-100">
            <Package size={21} />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold text-[#173563]">
                {request.product}
              </h3>

              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                  isOpen
                    ? "bg-green-50 text-green-600"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {request.status || "Open"}
              </span>
            </div>

            <p className="mt-1 text-xs font-medium text-slate-400">
              {request.id} • Posted {request.posted || "Recently"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-500">
            {request.category}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="mt-5 max-w-4xl text-sm leading-6 text-slate-500">
        {request.description}
      </p>

      {/* Details */}
      <div className="mt-5 grid gap-3 border-t border-slate-100 pt-5 sm:grid-cols-2 lg:grid-cols-4">
        <DetailItem
          icon={<MapPin size={15} />}
          label="Destination"
          value={request.destination || "Not specified"}
        />

        <DetailItem
          icon={<Package size={15} />}
          label="Quantity"
          value={request.quantity || "Not specified"}
        />

        <DetailItem
          icon={<BriefcaseBusiness size={15} />}
          label="Import Value"
          value={request.value || "Not specified"}
        />

        <DetailItem
          icon={<FileText size={15} />}
          label="Bid Deadline"
          value={request.deadline || "Not specified"}
        />
      </div>

      {/* Bottom */}
      <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs text-slate-400">
          Origin:{" "}
          <span className="font-semibold text-slate-500">
            {request.origin || "Not specified"}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() =>
              navigate("/individual-agent-bids", {
                state: {
                  request,
                  action: "submit-bid",
                },
              })
            }
            disabled={!isOpen}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
              isOpen
                ? "bg-[#173563] text-white hover:bg-[#10294d]"
                : "cursor-not-allowed bg-slate-100 text-slate-400"
            }`}
          >
            {isOpen ? "Submit Bid" : "Closed"}
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   DETAIL ITEM
============================================================ */
function DetailItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-slate-400">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-medium text-slate-400">{label}</p>

        <p className="mt-0.5 truncate text-xs font-semibold text-[#173563]">
          {value}
        </p>
      </div>
    </div>
  );
}

export default IndividualAgentRequests;