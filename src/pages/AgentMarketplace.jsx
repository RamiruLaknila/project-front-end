import { useEffect, useMemo, useState } from "react";
import {
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
  RefreshCw,
  Bell,
} from "lucide-react";
import AgentMemberSidebar from "../components/AgentMemberSidebar";

function AgentMarketplace() {
  const [agency, setAgency] = useState(null);
  const [currentAgent, setCurrentAgent] = useState(null);

  const [requests, setRequests] = useState([]);
  const [agentBids, setAgentBids] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All Categories");
  const [selectedUrgency, setSelectedUrgency] =
    useState("All Urgency");

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showBidModal, setShowBidModal] = useState(false);

  const [bidForm, setBidForm] = useState({
    amount: "",
    deliveryTime: "",
    message: "",
  });

  useEffect(() => {
    loadAgencyData();
  }, []);

  const loadAgencyData = () => {
    try {
      const savedAgency = localStorage.getItem("clearingAgency");
      const savedAgent = localStorage.getItem("clearingAgent");
      const savedRequests = localStorage.getItem("agentRequests");
      const savedBids = localStorage.getItem("agentBids");

      if (savedAgency) {
        setAgency(JSON.parse(savedAgency));
      }

      if (savedAgent) {
        setCurrentAgent(JSON.parse(savedAgent));
      }

      if (savedRequests) {
        setRequests(JSON.parse(savedRequests));
      }

      if (savedBids) {
        setAgentBids(JSON.parse(savedBids));
      }
    } catch (error) {
      console.error("Error loading marketplace data:", error);
    }
  };

  const demoRequests = [
    {
      id: "REQ-1001",
      product: "Solar Panels",
      category: "Electronics",
      hsCode: "8541.43",
      origin: "China",
      destination: "Colombo Port",
      quantity: "500 Units",
      estimatedValue: 28500,
      urgency: "High",
      postedTime: "2 hours ago",
      description:
        "Import of high-efficiency solar panels for a commercial solar installation project.",
      requiredDate: "Within 10 days",
      status: "Open",
    },
    {
      id: "REQ-1002",
      product: "Cotton T-Shirts",
      category: "Textiles",
      hsCode: "6109.10",
      origin: "India",
      destination: "Colombo Port",
      quantity: "2,000 Units",
      estimatedValue: 12400,
      urgency: "Medium",
      postedTime: "5 hours ago",
      description:
        "Cotton t-shirts for retail distribution across multiple stores in Sri Lanka.",
      requiredDate: "Within 20 days",
      status: "Open",
    },
    {
      id: "REQ-1003",
      product: "Industrial Machinery",
      category: "Machinery",
      hsCode: "8479.89",
      origin: "Germany",
      destination: "Colombo Port",
      quantity: "3 Units",
      estimatedValue: 68500,
      urgency: "Low",
      postedTime: "1 day ago",
      description:
        "Industrial machinery required for a manufacturing facility expansion.",
      requiredDate: "Within 30 days",
      status: "Open",
    },
    {
      id: "REQ-1004",
      product: "LED Lighting Equipment",
      category: "Electronics",
      hsCode: "9405.40",
      origin: "China",
      destination: "Hambantota Port",
      quantity: "1,500 Units",
      estimatedValue: 19200,
      urgency: "High",
      postedTime: "1 day ago",
      description:
        "Commercial LED lighting equipment for a new building development project.",
      requiredDate: "Within 7 days",
      status: "Open",
    },
    {
      id: "REQ-1005",
      product: "Food Processing Equipment",
      category: "Machinery",
      hsCode: "8438.80",
      origin: "Italy",
      destination: "Colombo Port",
      quantity: "5 Units",
      estimatedValue: 43500,
      urgency: "Medium",
      postedTime: "2 days ago",
      description:
        "Food processing equipment for a growing food manufacturing business.",
      requiredDate: "Within 15 days",
      status: "Open",
    },
  ];

  const marketplaceRequests =
    requests.length > 0 ? requests : demoRequests;

  const categories = [
    "All Categories",
    "Electronics",
    "Textiles",
    "Machinery",
    "Automotive",
    "Agriculture",
    "Consumer Goods",
  ];

  const urgencyOptions = [
    "All Urgency",
    "High",
    "Medium",
    "Low",
  ];

  const filteredRequests = useMemo(() => {
    return marketplaceRequests.filter((request) => {
      const matchesSearch =
        request.product
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        request.category
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        request.hsCode
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        request.origin
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All Categories" ||
        request.category === selectedCategory;

      const matchesUrgency =
        selectedUrgency === "All Urgency" ||
        request.urgency === selectedUrgency;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesUrgency
      );
    });
  }, [
    marketplaceRequests,
    searchTerm,
    selectedCategory,
    selectedUrgency,
  ]);

  const hasAgentBid = (requestId) => {
    return agentBids.some(
      (bid) =>
        bid.requestId === requestId &&
        bid.agentId === currentAgent?.id
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const handleRefresh = () => {
    loadAgencyData();
  };

  const openRequest = (request) => {
    setSelectedRequest(request);
  };

  const openBidForm = (request) => {
    setSelectedRequest(request);

    setBidForm({
      amount: "",
      deliveryTime: "",
      message: "",
    });

    setShowBidModal(true);
  };

  const closeBidModal = () => {
    setShowBidModal(false);

    setBidForm({
      amount: "",
      deliveryTime: "",
      message: "",
    });
  };

  const submitBid = (event) => {
    event.preventDefault();

    if (!selectedRequest || !currentAgent) {
      return;
    }

    if (!bidForm.amount || !bidForm.deliveryTime) {
      return;
    }

    const newBid = {
      id: `BID-${Date.now()}`,
      requestId: selectedRequest.id,
      agentId:
        currentAgent.id || currentAgent.email,
      agentName:
        currentAgent.fullName ||
        currentAgent.name ||
        currentAgent.userName ||
        "Agency Member",
      agencyId:
        agency?.id ||
        agency?.agencyCode ||
        "agency",
      agencyName:
        agency?.agencyName ||
        agency?.name ||
        "Clearing Agency",
      amount: Number(bidForm.amount),
      deliveryTime: bidForm.deliveryTime,
      message: bidForm.message,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    const updatedBids = [...agentBids, newBid];

    setAgentBids(updatedBids);
    localStorage.setItem(
      "agentBids",
      JSON.stringify(updatedBids)
    );

    closeBidModal();
  };

  const getUrgencyClass = (urgency) => {
    switch (urgency) {
      case "High":
        return "bg-red-50 text-red-600 border-red-100";
      case "Medium":
        return "bg-amber-50 text-amber-600 border-amber-100";
      case "Low":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      default:
        return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f8fb]">
      <AgentMemberSidebar />

      <main className="min-h-screen lg:ml-[270px]">
        {/* TOP BAR - MATCHED WITH AGENT DASHBOARD */}
        <header className="sticky top-0 z-30 flex h-[70px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                Agency Member Workspace
              </p>

              <h1 className="text-base font-bold text-slate-800">
                Agent Marketplace
              </h1>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
              aria-label="Refresh marketplace"
            >
              <RefreshCw size={17} />
            </button>

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

        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
              <div>
                <h2 className="text-[32px] font-bold tracking-[-0.04em] text-[#14213D] sm:text-[42px]">
                  Find New Import Requests
                </h2>

                <p className="mt-1 max-w-2xl text-sm text-slate-500">
                  Browse import requests from SMEs and submit competitive bids
                  for customs clearance services.
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3">
                <Package
                  size={18}
                  className="text-[#2563EB]"
                />

                <div>
                  <p className="text-xs text-slate-400">
                    Available Requests
                  </p>

                  <p className="text-lg font-bold text-slate-800">
                    {filteredRequests.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Open Requests
                  </p>

                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {marketplaceRequests.length}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
                  <Package size={21} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Your Bids
                  </p>

                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {agentBids.filter(
                      (bid) =>
                        bid.agentId ===
                        (currentAgent?.id ||
                          currentAgent?.email)
                    ).length}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Send size={20} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Agency
                  </p>

                  <p className="mt-2 truncate text-base font-bold text-slate-900">
                    {agency?.agencyName ||
                      agency?.name ||
                      "Clearing Agency"}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2 size={20} />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex flex-col gap-4 lg:flex-row">
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
                  placeholder="Search products, HS codes, categories..."
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative">
                  <Filter
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <select
                    value={selectedCategory}
                    onChange={(event) =>
                      setSelectedCategory(event.target.value)
                    }
                    className="h-12 min-w-[190px] appearance-none rounded-xl border border-slate-200 bg-slate-50 px-10 pr-8 text-sm font-medium text-slate-600 outline-none focus:border-[#2563EB] focus:bg-white"
                  >
                    {categories.map((category) => (
                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <select
                  value={selectedUrgency}
                  onChange={(event) =>
                    setSelectedUrgency(event.target.value)
                  }
                  className="h-12 min-w-[160px] rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-600 outline-none focus:border-[#2563EB] focus:bg-white"
                >
                  {urgencyOptions.map((urgency) => (
                    <option
                      key={urgency}
                      value={urgency}
                    >
                      {urgency}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {filteredRequests.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <Package size={25} />
                </div>

                <h3 className="mt-4 text-lg font-bold text-slate-800">
                  No requests found
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Try changing your search or filter options.
                </p>
              </div>
            ) : (
              filteredRequests.map((request) => (
                <div
                  key={request.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm sm:p-6"
                >
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getUrgencyClass(
                            request.urgency
                          )}`}
                        >
                          {request.urgency} Priority
                        </span>

                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                          {request.category}
                        </span>

                        <span className="text-xs font-medium text-slate-400">
                          {request.id}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-col gap-1">
                        <h3 className="text-lg font-bold text-slate-900">
                          {request.product}
                        </h3>

                        <p className="text-sm text-slate-500">
                          HS Code:{" "}
                          <span className="font-medium text-slate-700">
                            {request.hsCode}
                          </span>
                        </p>
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                            <MapPin size={15} />
                          </div>

                          <div>
                            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                              Route
                            </p>

                            <p className="text-xs font-semibold text-slate-700">
                              {request.origin} →{" "}
                              {request.destination}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                            <Package size={15} />
                          </div>

                          <div>
                            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                              Quantity
                            </p>

                            <p className="text-xs font-semibold text-slate-700">
                              {request.quantity}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                            <DollarSign size={15} />
                          </div>

                          <div>
                            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                              Cargo Value
                            </p>

                            <p className="text-xs font-semibold text-slate-700">
                              {formatCurrency(
                                request.estimatedValue
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                            <Clock3 size={15} />
                          </div>

                          <div>
                            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                              Required
                            </p>

                            <p className="text-xs font-semibold text-slate-700">
                              {request.requiredDate}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col gap-2 sm:flex-row xl:flex-col">
                      <button
                        type="button"
                        onClick={() => openRequest(request)}
                        className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        View Details
                        <ChevronRight size={16} />
                      </button>

                      {hasAgentBid(request.id) ? (
                        <button
                          type="button"
                          disabled
                          className="flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-50 px-5 text-sm font-semibold text-emerald-600"
                        >
                          <CheckCircle2 size={17} />
                          Bid Submitted
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => openBidForm(request)}
                          className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#173563] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#10294d]"
                        >
                          Submit Bid
                          <Send size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#2563EB] shadow-sm">
                <Send size={18} />
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#173563]">
                  How bidding works
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Review SME import requirements, submit your best clearance
                  fee and delivery timeline, then wait for the SME to compare
                  bids and select an agent.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {selectedRequest && !showBidModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <p className="text-xs font-medium text-slate-400">
                  {selectedRequest.id}
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  {selectedRequest.product}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={19} />
              </button>
            </div>

            <div className="space-y-5 px-6 py-6">
              <div className="flex flex-wrap gap-2">
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${getUrgencyClass(
                    selectedRequest.urgency
                  )}`}
                >
                  {selectedRequest.urgency} Priority
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                  {selectedRequest.category}
                </span>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Description
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {selectedRequest.description}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">
                    HS Code
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-800">
                    {selectedRequest.hsCode}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">
                    Cargo Value
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-800">
                    {formatCurrency(
                      selectedRequest.estimatedValue
                    )}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">
                    Origin
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-800">
                    {selectedRequest.origin}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">
                    Destination
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-800">
                    {selectedRequest.destination}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">
                    Quantity
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-800">
                    {selectedRequest.quantity}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">
                    Required Date
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-800">
                    {selectedRequest.requiredDate}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedRequest(null)}
                  className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Close
                </button>

                {hasAgentBid(selectedRequest.id) ? (
                  <button
                    type="button"
                    disabled
                    className="flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-50 px-5 text-sm font-semibold text-emerald-600"
                  >
                    <CheckCircle2 size={17} />
                    Bid Already Submitted
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      openBidForm(selectedRequest)
                    }
                    className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#173563] px-5 text-sm font-semibold text-white hover:bg-[#10294d]"
                  >
                    Submit Bid
                    <Send size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showBidModal && selectedRequest && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <p className="text-xs font-medium text-slate-400">
                  Submit Your Bid
                </p>

                <h2 className="mt-1 text-lg font-bold text-slate-900">
                  {selectedRequest.product}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeBidModal}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={19} />
              </button>
            </div>

            <form
              onSubmit={submitBid}
              className="space-y-5 p-6"
            >
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Your Clearance Fee (USD)
                </label>

                <div className="relative">
                  <DollarSign
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={bidForm.amount}
                    onChange={(event) =>
                      setBidForm({
                        ...bidForm,
                        amount: event.target.value,
                      })
                    }
                    placeholder="Enter your bid amount"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Estimated Delivery Time
                </label>

                <input
                  type="text"
                  value={bidForm.deliveryTime}
                  onChange={(event) =>
                    setBidForm({
                      ...bidForm,
                      deliveryTime: event.target.value,
                    })
                  }
                  placeholder="e.g. 7 days"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Message to SME
                </label>

                <textarea
                  rows={4}
                  value={bidForm.message}
                  onChange={(event) =>
                    setBidForm({
                      ...bidForm,
                      message: event.target.value,
                    })
                  }
                  placeholder="Explain why the SME should choose your agency..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="rounded-xl bg-blue-50 p-4">
                <p className="text-xs leading-5 text-slate-600">
                  Your bid will be sent to the SME for review. Make sure your
                  price and delivery estimate are accurate before submitting.
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeBidModal}
                  className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#173563] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#10294d]"
                >
                  Submit Bid
                  <Send size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AgentMarketplace;