import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Filter,
  Package,
  MapPin,
  Clock3,
  DollarSign,
  ChevronRight,
  X,
  Send,
  CheckCircle2,
  Building2,
  Users,
  UserPlus,
  ClipboardList,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";

const demoRequests = [
  {
    id: "REQ-1001",
    product: "Electronic Components",
    description: "LED display modules and electronic control boards",
    hsCode: "8531.20",
    origin: "China",
    destination: "Colombo, Sri Lanka",
    shipmentValue: 1250000,
    requestedDate: "2026-08-28",
    urgency: "High",
    status: "Open",
    category: "Electronics",
    createdAt: "2026-08-25T08:00:00.000Z",
  },
  {
    id: "REQ-1002",
    product: "Garment Accessories",
    description: "Buttons, zippers and garment finishing accessories",
    hsCode: "9606.29",
    origin: "India",
    destination: "Colombo, Sri Lanka",
    shipmentValue: 680000,
    requestedDate: "2026-09-02",
    urgency: "Medium",
    status: "Open",
    category: "Textiles",
    createdAt: "2026-08-25T08:00:00.000Z",
  },
  {
    id: "REQ-1003",
    product: "Industrial Machinery Parts",
    description: "Replacement parts for industrial manufacturing equipment",
    hsCode: "8483.90",
    origin: "Japan",
    destination: "Colombo, Sri Lanka",
    shipmentValue: 2450000,
    requestedDate: "2026-09-05",
    urgency: "Medium",
    status: "Open",
    category: "Machinery",
    createdAt: "2026-08-25T08:00:00.000Z",
  },
  {
    id: "REQ-1004",
    product: "Food Packaging Materials",
    description: "Food-grade plastic packaging containers",
    hsCode: "3923.30",
    origin: "Malaysia",
    destination: "Colombo, Sri Lanka",
    shipmentValue: 890000,
    requestedDate: "2026-09-01",
    urgency: "Low",
    status: "Open",
    category: "Packaging",
    createdAt: "2026-08-25T08:00:00.000Z",
  },
];

function AgentMarketplace() {
  const navigate = useNavigate();

  const [agency, setAgency] = useState(null);
  const [currentAgent, setCurrentAgent] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* =========================================================
     LOAD AGENCY & AGENT DATA
  ========================================================= */

  useEffect(() => {
    try {
      const storedAgency = localStorage.getItem("clearingAgency");
      const storedAgent = localStorage.getItem("clearingAgent");

      if (storedAgency) {
        setAgency(JSON.parse(storedAgency));
      }

      if (storedAgent) {
        setCurrentAgent(JSON.parse(storedAgent));
      }
    } catch (error) {
      console.error("Failed to load agency context:", error);
    }
  }, []);

  /* =========================================================
     MARKETPLACE REQUESTS
  ========================================================= */

  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem("marketplaceRequests");

    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        localStorage.setItem(
          "marketplaceRequests",
          JSON.stringify(demoRequests)
        );

        return demoRequests;
      }
    }

    localStorage.setItem(
      "marketplaceRequests",
      JSON.stringify(demoRequests)
    );

    return demoRequests;
  });

  /* =========================================================
     AGENT BIDS
  ========================================================= */

  const [agentBids, setAgentBids] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("agentBids") || "[]"
      );
    } catch {
      return [];
    }
  });

  /* =========================================================
     FILTER STATE
  ========================================================= */

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [urgency, setUrgency] = useState("All");

  /* =========================================================
     MODAL STATE
  ========================================================= */

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showBidModal, setShowBidModal] = useState(false);

  /* =========================================================
     BID FORM
  ========================================================= */

  const [bidForm, setBidForm] = useState({
    clearanceFee: "",
    processingTime: "",
    additionalCharges: "",
    message: "",
  });

  /* =========================================================
     CATEGORIES
  ========================================================= */

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        requests
          .map((req) => req.category)
          .filter(Boolean)
      ),
    ];

    return ["All", ...uniqueCategories];
  }, [requests]);

  /* =========================================================
     FILTERED REQUESTS
  ========================================================= */

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        String(request.product || "")
          .toLowerCase()
          .includes(searchText) ||
        String(request.description || "")
          .toLowerCase()
          .includes(searchText) ||
        String(request.hsCode || "")
          .toLowerCase()
          .includes(searchText) ||
        String(request.origin || "")
          .toLowerCase()
          .includes(searchText);

      const matchesCategory =
        category === "All" ||
        request.category === category;

      const matchesUrgency =
        urgency === "All" ||
        request.urgency === urgency;

      const matchesStatus =
        !request.status ||
        request.status === "Open";

      return (
        matchesSearch &&
        matchesCategory &&
        matchesUrgency &&
        matchesStatus
      );
    });
  }, [requests, search, category, urgency]);

  /* =========================================================
     CHECK IF CURRENT AGENT ALREADY BID
  ========================================================= */

  const hasAgentBid = (requestId) => {
    if (!currentAgent) return false;

    const activeAgentId =
      currentAgent.id ||
      currentAgent.agentId ||
      currentAgent.email;

    return agentBids.some(
      (bid) =>
        bid.requestId === requestId &&
        ((activeAgentId &&
          bid.agentId === activeAgentId) ||
          (!bid.agentId &&
            bid.agentName === currentAgent.name))
    );
  };

  /* =========================================================
     FORMAT CURRENCY
  ========================================================= */

  const formatCurrency = (value) => {
    return `LKR ${Number(value || 0).toLocaleString()}`;
  };

  /* =========================================================
     MODAL & BID HANDLERS
  ========================================================= */

  const openRequest = (request) => {
    setSelectedRequest(request);
  };

  const openBidForm = () => {
    setBidForm({
      clearanceFee: "",
      processingTime: "",
      additionalCharges: "",
      message: "",
    });

    setShowBidModal(true);
  };

  const closeBidModal = () => {
    setShowBidModal(false);
  };

  const submitBid = (event) => {
    event.preventDefault();

    if (!selectedRequest) return;

    if (hasAgentBid(selectedRequest.id)) {
      alert(
        "You have already submitted a bid for this request."
      );

      setShowBidModal(false);
      return;
    }

    const agentId =
      currentAgent?.id ||
      currentAgent?.agentId ||
      currentAgent?.email ||
      `AGENT-${Date.now()}`;

    const agentName =
      currentAgent?.name ||
      currentAgent?.fullName ||
      "Clearing Agent";

    const agencyName =
      agency?.agencyName ||
      agency?.name ||
      currentAgent?.agencyName ||
      currentAgent?.agency ||
      "Clearing Agency";

    const newBid = {
      id: `BID-${Date.now()}`,
      requestId: selectedRequest.id,
      product: selectedRequest.product,
      description: selectedRequest.description,
      hsCode: selectedRequest.hsCode,
      origin: selectedRequest.origin,
      destination: selectedRequest.destination,
      shipmentValue: selectedRequest.shipmentValue,
      agentId,
      agentName,
      agencyName,
      clearanceFee: Number(
        bidForm.clearanceFee || 0
      ),
      processingTime:
        bidForm.processingTime.trim(),
      additionalCharges: Number(
        bidForm.additionalCharges || 0
      ),
      message: bidForm.message.trim(),
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    const updatedBids = [
      ...agentBids,
      newBid,
    ];

    setAgentBids(updatedBids);

    localStorage.setItem(
      "agentBids",
      JSON.stringify(updatedBids)
    );

    const updatedRequests = requests.map(
      (request) => {
        if (request.id === selectedRequest.id) {
          return {
            ...request,
            hasBid: true,
            bidCount:
              Number(request.bidCount || 0) + 1,
            lastBidAt:
              new Date().toISOString(),
          };
        }

        return request;
      }
    );

    setRequests(updatedRequests);

    localStorage.setItem(
      "marketplaceRequests",
      JSON.stringify(updatedRequests)
    );

    localStorage.setItem(
      "lastSubmittedBid",
      JSON.stringify(newBid)
    );

    setShowBidModal(false);
    setSelectedRequest(null);

    alert(
      "Your bid has been submitted successfully."
    );
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

  const getUrgencyClass = (value) => {
    if (value === "High") {
      return "bg-red-50 text-red-600";
    }

    if (value === "Medium") {
      return "bg-amber-50 text-amber-600";
    }

    return "bg-green-50 text-green-600";
  };

  const agentName =
    currentAgent?.name ||
    currentAgent?.fullName ||
    "Clearing Agent";

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-900">

      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}

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

        {/* =================================================
            LOGO
        ================================================= */}

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
              <p className="text-[18px] font-bold tracking-tight text-[#173563]">
                Import
                <span className="text-slate-900">
                  Ease
                </span>
              </p>

              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
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

        {/* =================================================
            NAVIGATION
        ================================================= */}

        <nav className="flex-1 space-y-1.5 p-3">

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
            icon={ClipboardList}
            label="SME Requests"
            active
            to="/agent-marketplace"
            onClick={() =>
              setSidebarOpen(false)
            }
          />

        </nav>

        {/* =================================================
            BOTTOM PROFILE
        ================================================= */}

        <div className="border-t border-slate-100 p-3">

          {/* PROFILE */}

          <div className="mb-3 flex items-center gap-3 rounded-xl px-2 py-2">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#173563] text-xs font-bold text-white">
              {getInitials(agentName)}
            </div>

            <div className="min-w-0">

              <p className="truncate text-sm font-bold text-slate-800">
                {agentName}
              </p>

              <p className="mt-0.5 text-[11px] text-slate-400">
                {currentAgent?.role === "admin"
                  ? "Administrator"
                  : "Agent Member"}
              </p>

            </div>

          </div>

          {/* SETTINGS */}

          <SidebarItem
            icon={Settings}
            label="Settings"
            to="/agent-settings"
            onClick={() =>
              setSidebarOpen(false)
            }
          />

          {/* LOGOUT */}

          <button
            type="button"
            onClick={handleLogout}
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>

      </aside>

      {/* =====================================================
          MAIN AREA
      ===================================================== */}

      <div className="lg:ml-[250px]">

        {/* =================================================
            HEADER
        ================================================= */}

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

            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
              Agency Workspace
            </p>

            <h1 className="text-base font-bold text-slate-800">
              Agent Marketplace
            </h1>

          </div>

          <div className="ml-auto flex items-center gap-3">

            <div className="hidden text-right sm:block">

              <p className="text-sm font-bold text-slate-800">
                {agentName}
              </p>

              <p className="text-[10px] text-slate-400">
                {currentAgent?.role === "admin"
                  ? "Administrator"
                  : "Agent Member"}
              </p>

            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#173563] text-xs font-bold text-white">
              {getInitials(agentName)}
            </div>

          </div>

        </header>

        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <main className="mx-auto w-full max-w-[1180px] px-5 py-7 sm:px-8 lg:py-9">

          {/* PAGE HEADER */}

          <section className="mb-8">

            <Link
              to="/agent-admin-dashboard"
              className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#173563]"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>

            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

              <div>

                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5">
                  <ClipboardList
                    size={14}
                    className="text-blue-600"
                  />

                  <span className="text-xs font-bold uppercase tracking-[0.12em] text-blue-700">
                    SME Requests
                  </span>
                </div>

                <h2 className="text-[32px] font-bold leading-tight tracking-tight text-[#173563] sm:text-[40px]">
                  Agent Marketplace
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-[15px]">
                  Find SME import requests and submit your agency bids.
                </p>

              </div>

            </div>

          </section>

          {/* =================================================
              STAT CARDS
          ================================================= */}

          <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)]">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-[11px] font-semibold text-slate-400">
                    Available Requests
                  </p>

                  <p className="mt-2 text-2xl font-bold tracking-tight text-slate-800">
                    {requests.length}
                  </p>

                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Package
                    size={18}
                    strokeWidth={1.8}
                  />
                </div>

              </div>

            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)]">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-[11px] font-semibold text-slate-400">
                    Filtered Requests
                  </p>

                  <p className="mt-2 text-2xl font-bold tracking-tight text-slate-800">
                    {filteredRequests.length}
                  </p>

                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <Filter
                    size={18}
                    strokeWidth={1.8}
                  />
                </div>

              </div>

            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)]">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-[11px] font-semibold text-slate-400">
                    My Submitted Bids
                  </p>

                  <p className="mt-2 text-2xl font-bold tracking-tight text-slate-800">
                    {
                      agentBids.filter(
                        (bid) =>
                          bid.agentId ===
                            (currentAgent?.id ||
                              currentAgent?.agentId ||
                              currentAgent?.email) ||
                          (!bid.agentId &&
                            bid.agentName ===
                              currentAgent?.name)
                      ).length
                    }
                  </p>

                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2
                    size={18}
                    strokeWidth={1.8}
                  />
                </div>

              </div>

            </div>

          </div>

          {/* =================================================
              SEARCH & FILTERS
          ================================================= */}

          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)]">

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

              <div className="relative">

                <Search
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search products, HS codes..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-50"
                />

              </div>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-[#2563EB] focus:ring-4 focus:ring-blue-50"
              >
                {categories.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </select>

              <select
                value={urgency}
                onChange={(e) =>
                  setUrgency(e.target.value)
                }
                className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-[#2563EB] focus:ring-4 focus:ring-blue-50"
              >
                <option value="All">
                  All Urgency
                </option>

                <option value="High">
                  High
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="Low">
                  Low
                </option>
              </select>

            </div>

          </div>

          {/* =================================================
              MARKETPLACE CARDS
          ================================================= */}

          <div className="space-y-4">

            {filteredRequests.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-[0_2px_10px_rgba(15,23,42,.02)]">

                <Package
                  size={42}
                  className="mx-auto mb-3 text-slate-300"
                />

                <h3 className="text-sm font-bold text-slate-700">
                  No requests found
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  Try changing your search or filters.
                </p>

              </div>
            ) : (
              filteredRequests.map((request) => {
                const alreadyBid =
                  hasAgentBid(request.id);

                return (
                  <div
                    key={request.id}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_2px_10px_rgba(15,23,42,.02)] transition hover:shadow-md"
                  >

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                      <div className="flex-1">

                        <div className="flex items-start gap-4">

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <Package size={21} />
                          </div>

                          <div>

                            <div className="flex flex-wrap items-center gap-3">

                              <h3 className="text-base font-bold text-[#173563]">
                                {request.product}
                              </h3>

                              <span
                                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${getUrgencyClass(
                                  request.urgency
                                )}`}
                              >
                                {request.urgency ||
                                  "Medium"}{" "}
                                Priority
                              </span>

                              {alreadyBid && (
                                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-600">
                                  Bid Submitted
                                </span>
                              )}

                            </div>

                            <p className="mt-1 text-xs text-slate-400">
                              Request ID:{" "}
                              {request.id}
                            </p>

                            <p className="mt-2 text-sm leading-5 text-slate-600">
                              {request.description ||
                                request.product}
                            </p>

                          </div>

                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 md:grid-cols-4">

                          <div>
                            <p className="text-[11px] font-semibold text-slate-400">
                              HS Code
                            </p>

                            <p className="mt-1 text-sm font-semibold text-slate-700">
                              {request.hsCode ||
                                "Not classified"}
                            </p>
                          </div>

                          <div>
                            <p className="text-[11px] font-semibold text-slate-400">
                              Shipment Value
                            </p>

                            <p className="mt-1 text-sm font-semibold text-slate-700">
                              {formatCurrency(
                                request.shipmentValue
                              )}
                            </p>
                          </div>

                          <div>
                            <p className="text-[11px] font-semibold text-slate-400">
                              Origin
                            </p>

                            <p className="mt-1 text-sm font-semibold text-slate-700">
                              {request.origin ||
                                "Not specified"}
                            </p>
                          </div>

                          <div>
                            <p className="text-[11px] font-semibold text-slate-400">
                              Required By
                            </p>

                            <p className="mt-1 text-sm font-semibold text-slate-700">
                              {request.requestedDate ||
                                "Not specified"}
                            </p>
                          </div>

                        </div>

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          openRequest(request)
                        }
                        className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#173563] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#102547]"
                      >
                        View Request
                        <ChevronRight size={16} />
                      </button>

                    </div>

                  </div>
                );
              })
            )}

          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="mt-9 flex items-center justify-center border-t border-slate-200 pt-6 text-center text-xs text-slate-400">
            ImportEase · Clearing Agency Platform
          </div>

        </main>

      </div>

      {/* =====================================================
          REQUEST DETAILS MODAL
      ===================================================== */}

      {selectedRequest && !showBidModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">

            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

              <div>

                <h3 className="text-lg font-bold text-[#173563]">
                  Import Request
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  {selectedRequest.id}
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedRequest(null)
                }
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100"
              >
                <X size={18} />
              </button>

            </div>

            <div className="space-y-6 p-6">

              <div>

                <h4 className="text-base font-bold text-slate-800">
                  {selectedRequest.product}
                </h4>

                <p className="mt-1 text-sm leading-5 text-slate-500">
                  {selectedRequest.description ||
                    selectedRequest.product}
                </p>

              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">

                  <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                    <Package size={15} />
                    HS Code
                  </div>

                  <p className="mt-1 text-sm font-bold text-slate-800">
                    {selectedRequest.hsCode ||
                      "Not classified"}
                  </p>

                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">

                  <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                    <DollarSign size={15} />
                    Shipment Value
                  </div>

                  <p className="mt-1 text-sm font-bold text-slate-800">
                    {formatCurrency(
                      selectedRequest.shipmentValue
                    )}
                  </p>

                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">

                  <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                    <MapPin size={15} />
                    Origin
                  </div>

                  <p className="mt-1 text-sm font-bold text-slate-800">
                    {selectedRequest.origin ||
                      "Not specified"}
                  </p>

                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">

                  <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                    <Clock3 size={15} />
                    Required By
                  </div>

                  <p className="mt-1 text-sm font-bold text-slate-800">
                    {selectedRequest.requestedDate ||
                      "Not specified"}
                  </p>

                </div>

              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">

                <p className="text-xs font-medium text-slate-400">
                  Destination
                </p>

                <p className="mt-1 text-sm font-bold text-slate-800">
                  {selectedRequest.destination ||
                    "Colombo, Sri Lanka"}
                </p>

              </div>

              {hasAgentBid(selectedRequest.id) ? (
                <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">

                  <div className="flex items-start gap-3">

                    <CheckCircle2
                      size={18}
                      className="mt-0.5 text-emerald-600"
                    />

                    <div>

                      <p className="text-sm font-bold text-emerald-800">
                        Bid Already Submitted
                      </p>

                      <p className="mt-1 text-xs text-emerald-600">
                        You have already submitted a bid for this SME request.
                      </p>

                    </div>

                  </div>

                </div>
              ) : (
                <button
                  type="button"
                  onClick={openBidForm}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#173563] py-3 text-sm font-semibold text-white transition hover:bg-[#102547]"
                >
                  <Send size={16} />
                  Submit Bid
                </button>
              )}

            </div>

          </div>

        </div>
      )}

      {/* =====================================================
          BID SUBMISSION MODAL
      ===================================================== */}

      {showBidModal && selectedRequest && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4">

          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl">

            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

              <div>

                <h3 className="text-lg font-bold text-[#173563]">
                  Submit Your Bid
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  {selectedRequest.product}
                </p>

              </div>

              <button
                type="button"
                onClick={closeBidModal}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100"
              >
                <X size={18} />
              </button>

            </div>

            <form
              onSubmit={submitBid}
              className="space-y-5 p-6"
            >

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Clearance Fee (LKR)
                </label>

                <input
                  type="number"
                  required
                  min="0"
                  value={bidForm.clearanceFee}
                  onChange={(e) =>
                    setBidForm({
                      ...bidForm,
                      clearanceFee:
                        e.target.value,
                    })
                  }
                  placeholder="Enter clearance fee"
                  className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-50"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Estimated Processing Time
                </label>

                <input
                  type="text"
                  required
                  value={bidForm.processingTime}
                  onChange={(e) =>
                    setBidForm({
                      ...bidForm,
                      processingTime:
                        e.target.value,
                    })
                  }
                  placeholder="e.g. 3-5 business days"
                  className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-50"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Additional Charges (LKR)
                </label>

                <input
                  type="number"
                  min="0"
                  value={
                    bidForm.additionalCharges
                  }
                  onChange={(e) =>
                    setBidForm({
                      ...bidForm,
                      additionalCharges:
                        e.target.value,
                    })
                  }
                  placeholder="0"
                  className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-50"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Message to SME
                </label>

                <textarea
                  rows="4"
                  value={bidForm.message}
                  onChange={(e) =>
                    setBidForm({
                      ...bidForm,
                      message: e.target.value,
                    })
                  }
                  placeholder="Tell the SME why they should choose your agency..."
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-50"
                />

              </div>

              <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4">

                <div className="flex items-center justify-between">

                  <span className="text-sm font-medium text-blue-700">
                    Total Service Cost
                  </span>

                  <span className="text-base font-bold text-[#173563]">
                    {formatCurrency(
                      Number(
                        bidForm.clearanceFee || 0
                      ) +
                        Number(
                          bidForm.additionalCharges ||
                            0
                        )
                    )}
                  </span>

                </div>

              </div>

              <button
                type="submit"
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#173563] text-sm font-semibold text-white transition hover:bg-[#102547]"
              >
                <Send size={16} />
                Submit Bid
              </button>

            </form>

          </div>

        </div>
      )}

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
      className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
        active
          ? "bg-blue-50 text-[#173563]"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
      }`}
    >
      <Icon
        size={18}
        strokeWidth={1.8}
      />

      <span>{label}</span>
    </Link>
  );
}

/* =========================================================
   GET INITIALS
========================================================= */

function getInitials(name) {
  if (!name) return "AG";

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