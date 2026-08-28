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
  FileText,
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
        localStorage.setItem("marketplaceRequests", JSON.stringify(demoRequests));
        return demoRequests;
      }
    }
    localStorage.setItem("marketplaceRequests", JSON.stringify(demoRequests));
    return demoRequests;
  });

  /* =========================================================
     AGENT BIDS
  ========================================================= */
  const [agentBids, setAgentBids] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("agentBids") || "[]");
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
      ...new Set(requests.map((req) => req.category).filter(Boolean)),
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
        String(request.product || "").toLowerCase().includes(searchText) ||
        String(request.description || "").toLowerCase().includes(searchText) ||
        String(request.hsCode || "").toLowerCase().includes(searchText) ||
        String(request.origin || "").toLowerCase().includes(searchText);

      const matchesCategory = category === "All" || request.category === category;
      const matchesUrgency = urgency === "All" || request.urgency === urgency;
      const matchesStatus = !request.status || request.status === "Open";

      return matchesSearch && matchesCategory && matchesUrgency && matchesStatus;
    });
  }, [requests, search, category, urgency]);

  /* =========================================================
     CHECK IF CURRENT AGENT ALREADY BID
  ========================================================= */
  const hasAgentBid = (requestId) => {
    if (!currentAgent) return false;
    const activeAgentId = currentAgent.id || currentAgent.agentId || currentAgent.email;
    return agentBids.some(
      (bid) =>
        bid.requestId === requestId &&
        ((activeAgentId && bid.agentId === activeAgentId) ||
          (!bid.agentId && bid.agentName === currentAgent.name))
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
      alert("You have already submitted a bid for this request.");
      setShowBidModal(false);
      return;
    }

    const agentId =
      currentAgent?.id ||
      currentAgent?.agentId ||
      currentAgent?.email ||
      `AGENT-${Date.now()}`;

    const agentName =
      currentAgent?.name || currentAgent?.fullName || "Clearing Agent";

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
      clearanceFee: Number(bidForm.clearanceFee || 0),
      processingTime: bidForm.processingTime.trim(),
      additionalCharges: Number(bidForm.additionalCharges || 0),
      message: bidForm.message.trim(),
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    const updatedBids = [...agentBids, newBid];
    setAgentBids(updatedBids);
    localStorage.setItem("agentBids", JSON.stringify(updatedBids));

    const updatedRequests = requests.map((request) => {
      if (request.id === selectedRequest.id) {
        return {
          ...request,
          hasBid: true,
          bidCount: Number(request.bidCount || 0) + 1,
          lastBidAt: new Date().toISOString(),
        };
      }
      return request;
    });

    setRequests(updatedRequests);
    localStorage.setItem("marketplaceRequests", JSON.stringify(updatedRequests));
    localStorage.setItem("lastSubmittedBid", JSON.stringify(newBid));

    setShowBidModal(false);
    setSelectedRequest(null);
    alert("Your bid has been submitted successfully.");
  };

  /* =========================================================
     LOGOUT
  ========================================================= */
  const handleLogout = () => {
    localStorage.removeItem("clearingAgent");
    localStorage.removeItem("agentOnboardingType");
    localStorage.removeItem("agentOnboardingComplete");

    navigate("/agent-signin");
  };

  const getUrgencyClass = (value) => {
    if (value === "High") return "bg-red-50 text-red-600";
    if (value === "Medium") return "bg-amber-50 text-amber-600";
    return "bg-green-50 text-green-600";
  };

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
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
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
                Import<span className="text-slate-900">Ease</span>
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

        {/* AGENCY INFO BADGE */}
        <div className="border-b border-slate-100 p-4">
          <div className="rounded-xl bg-slate-50 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#173563] text-white">
                <Building2 size={17} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-slate-800">
                  {agency?.agencyName || agency?.name || "Your Agency"}
                </p>
                <p className="mt-0.5 text-[9px] text-slate-400">
                  {currentAdminRoleLabel(currentAgent)}
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
            onClick={() => setSidebarOpen(false)}
          />

          <SidebarItem
            icon={Users}
            label="Agents"
            to="/agency-agents"
            onClick={() => setSidebarOpen(false)}
          />

          <SidebarItem
            icon={UserPlus}
            label="Invite Agents"
            to="/agency-invite"
            onClick={() => setSidebarOpen(false)}
          />

          <SidebarItem
            icon={ClipboardList}
            label="SME Requests"
            active
            to="/agent-marketplace"
            onClick={() => setSidebarOpen(false)}
          />

          <SidebarItem
            icon={FileText}
            label="Shipments"
            to="/agent-shipments"
            onClick={() => setSidebarOpen(false)}
          />
        </nav>

        {/* BOTTOM */}
        <div className="border-t border-slate-100 p-3">
          <SidebarItem
            icon={Settings}
            label="Settings"
            to="/agent-settings"
            onClick={() => setSidebarOpen(false)}
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
          MAIN WRAPPER
      ===================================================== */}
      <div className="lg:ml-[250px]">
        {/* TOP BAR HEADER */}
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
              Agent Marketplace
            </h1>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden h-7 w-px bg-slate-200 sm:block" />

            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#173563] text-[10px] font-bold text-white">
                {getInitials(currentAgent?.name || "Agent")}
              </div>

              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-slate-800">
                  {currentAgent?.name || "Clearing Agent"}
                </p>
                <p className="text-[9px] text-slate-400">
                  {currentAgent?.role === "admin" ? "Administrator" : "Agent Member"}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="mx-auto w-full max-w-[1180px] px-5 py-7 sm:px-8 lg:py-9">

          {/* PAGE HEADER */}
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
                  <ClipboardList size={13} className="text-blue-600" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-700">
                    SME Requests
                  </span>
                </div>

                <h2 className="text-[28px] font-bold tracking-[-0.04em] text-[#14213D] sm:text-[38px]">
                  Agent Marketplace
                </h2>

                <p className="mt-2 max-w-2xl text-[13px] leading-6 text-slate-500 sm:text-sm">
                  Find SME import requests and submit your agency bids.
                </p>
              </div>
            </div>
          </section>

          {/* STAT CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold text-slate-400">Available Requests</p>
                  <p className="text-2xl font-bold tracking-tight text-slate-800 mt-2">
                    {requests.length}
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Package size={18} strokeWidth={1.8} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold text-slate-400">Filtered Requests</p>
                  <p className="text-2xl font-bold tracking-tight text-slate-800 mt-2">
                    {filteredRequests.length}
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <Filter size={18} strokeWidth={1.8} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-[0_2px_10px_rgba(15,23,42,.02)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold text-slate-400">My Submitted Bids</p>
                  <p className="text-2xl font-bold tracking-tight text-slate-800 mt-2">
                    {
                      agentBids.filter(
                        (bid) =>
                          bid.agentId ===
                            (currentAgent?.id ||
                              currentAgent?.agentId ||
                              currentAgent?.email) ||
                          (!bid.agentId && bid.agentName === currentAgent?.name)
                      ).length
                    }
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2 size={18} strokeWidth={1.8} />
                </div>
              </div>
            </div>
          </div>

          {/* SEARCH & FILTERS */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-6 shadow-[0_2px_10px_rgba(15,23,42,.02)]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products, HS codes..."
                  className="w-full pl-10 pr-4 py-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-4 py-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                className="px-4 py-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="All">All Urgency</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          {/* MARKETPLACE CARDS */}
          <div className="space-y-4">
            {filteredRequests.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-[0_2px_10px_rgba(15,23,42,.02)]">
                <Package size={42} className="mx-auto text-slate-300 mb-3" />
                <h3 className="text-sm font-bold text-slate-700">No requests found</h3>
                <p className="text-[11px] text-slate-400 mt-1">
                  Try changing your search or filters.
                </p>
              </div>
            ) : (
              filteredRequests.map((request) => {
                const alreadyBid = hasAgentBid(request.id);

                return (
                  <div
                    key={request.id}
                    className="bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_2px_10px_rgba(15,23,42,.02)] hover:shadow-md transition"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <Package size={22} />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 flex-wrap">
                              <h3 className="font-bold text-[#173563] text-base">
                                {request.product}
                              </h3>
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${getUrgencyClass(
                                  request.urgency
                                )}`}
                              >
                                {request.urgency || "Medium"} Priority
                              </span>
                              {alreadyBid && (
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-600">
                                  Bid Submitted
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 mt-1">
                              Request ID: {request.id}
                            </p>
                            <p className="text-xs text-slate-600 mt-2">
                              {request.description || request.product}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 pt-4 border-t border-slate-100">
                          <div>
                            <p className="text-[10px] font-semibold text-slate-400">HS Code</p>
                            <p className="text-xs font-semibold text-slate-700 mt-0.5">
                              {request.hsCode || "Not classified"}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-semibold text-slate-400">Shipment Value</p>
                            <p className="text-xs font-semibold text-slate-700 mt-0.5">
                              {formatCurrency(request.shipmentValue)}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-semibold text-slate-400">Origin</p>
                            <p className="text-xs font-semibold text-slate-700 mt-0.5">
                              {request.origin || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-semibold text-slate-400">Required By</p>
                            <p className="text-xs font-semibold text-slate-700 mt-0.5">
                              {request.requestedDate || "Not specified"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => openRequest(request)}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#173563] text-white rounded-xl text-xs font-semibold hover:bg-[#102547] transition shrink-0"
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

          {/* FOOTER */}
          <div className="mt-9 flex items-center justify-center border-t border-slate-200 pt-6 text-center text-[10px] text-slate-400">
            ImportEase · Clearing Agency Platform
          </div>
        </main>
      </div>

      {/* REQUEST DETAILS MODAL */}
      {selectedRequest && !showBidModal && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-[#173563]">
                  Import Request
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedRequest.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-base font-bold text-slate-800">
                  {selectedRequest.product}
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-5">
                  {selectedRequest.description || selectedRequest.product}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                    <Package size={15} />
                    HS Code
                  </div>
                  <p className="text-sm font-bold text-slate-800 mt-1">
                    {selectedRequest.hsCode || "Not classified"}
                  </p>
                </div>

                <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                    <DollarSign size={15} />
                    Shipment Value
                  </div>
                  <p className="text-sm font-bold text-slate-800 mt-1">
                    {formatCurrency(selectedRequest.shipmentValue)}
                  </p>
                </div>

                <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                    <MapPin size={15} />
                    Origin
                  </div>
                  <p className="text-sm font-bold text-slate-800 mt-1">
                    {selectedRequest.origin || "Not specified"}
                  </p>
                </div>

                <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                    <Clock3 size={15} />
                    Required By
                  </div>
                  <p className="text-sm font-bold text-slate-800 mt-1">
                    {selectedRequest.requestedDate || "Not specified"}
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="text-xs text-slate-400 font-medium">Destination</p>
                <p className="text-xs font-bold text-slate-800 mt-0.5">
                  {selectedRequest.destination || "Colombo, Sri Lanka"}
                </p>
              </div>

              {hasAgentBid(selectedRequest.id) ? (
                <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-emerald-600 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-emerald-800">
                        Bid Already Submitted
                      </p>
                      <p className="text-xs text-emerald-600 mt-0.5">
                        You have already submitted a bid for this SME request.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={openBidForm}
                  className="w-full flex items-center justify-center gap-2 bg-[#173563] text-white py-3 rounded-xl text-xs font-semibold hover:bg-[#102547] transition"
                >
                  <Send size={15} />
                  Submit Bid
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* BID SUBMISSION MODAL */}
      {showBidModal && selectedRequest && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-[#173563]">
                  Submit Your Bid
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedRequest.product}
                </p>
              </div>
              <button
                onClick={closeBidModal}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={submitBid} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Clearance Fee (LKR)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={bidForm.clearanceFee}
                  onChange={(e) =>
                    setBidForm({ ...bidForm, clearanceFee: e.target.value })
                  }
                  placeholder="Enter clearance fee"
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Estimated Processing Time
                </label>
                <input
                  type="text"
                  required
                  value={bidForm.processingTime}
                  onChange={(e) =>
                    setBidForm({ ...bidForm, processingTime: e.target.value })
                  }
                  placeholder="e.g. 3-5 business days"
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Additional Charges (LKR)
                </label>
                <input
                  type="number"
                  min="0"
                  value={bidForm.additionalCharges}
                  onChange={(e) =>
                    setBidForm({ ...bidForm, additionalCharges: e.target.value })
                  }
                  placeholder="0"
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Message to SME
                </label>
                <textarea
                  rows="4"
                  value={bidForm.message}
                  onChange={(e) =>
                    setBidForm({ ...bidForm, message: e.target.value })
                  }
                  placeholder="Tell the SME why they should choose your agency..."
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="rounded-xl bg-blue-50/70 border border-blue-100 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-blue-700">Total Service Cost</span>
                  <span className="text-sm font-bold text-[#173563]">
                    {formatCurrency(
                      Number(bidForm.clearanceFee || 0) +
                        Number(bidForm.additionalCharges || 0)
                    )}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[#173563] text-white py-3 rounded-xl text-xs font-semibold hover:bg-[#102547] transition"
              >
                <Send size={15} />
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
function SidebarItem({ icon: Icon, label, to, active = false, onClick }) {
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
      <Icon size={17} strokeWidth={1.8} />
      <span>{label}</span>
    </Link>
  );
}

/* =========================================================
   HELPERS
========================================================= */
function getInitials(name) {
  if (!name) return "AG";

  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
}

function currentAdminRoleLabel(agent) {
  if (agent?.role === "admin") {
    return "Agency Admin";
  }
  return "Clearing Agent";
}

export default AgentMarketplace;