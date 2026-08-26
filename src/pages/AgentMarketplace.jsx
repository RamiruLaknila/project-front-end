import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";

const demoRequests = [
  {
    id: "REQ-1001",
    product: "Electronic Components",
    description:
      "LED display modules and electronic control boards",
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
    description:
      "Buttons, zippers and garment finishing accessories",
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
    description:
      "Replacement parts for industrial manufacturing equipment",
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
    description:
      "Food-grade plastic packaging containers",
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

  /* =========================================================
     CURRENT AGENT
  ========================================================= */

  const currentAgent = useMemo(() => {
    return JSON.parse(
      localStorage.getItem("clearingAgent") || "{}"
    );
  }, []);

  /* =========================================================
     MARKETPLACE REQUESTS
  ========================================================= */

  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem(
      "marketplaceRequests"
    );

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

  const [selectedRequest, setSelectedRequest] =
    useState(null);

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
          .map((request) => request.category)
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

      /*
       * Only show open marketplace requests.
       */
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
  }, [
    requests,
    search,
    category,
    urgency,
  ]);

  /* =========================================================
     CHECK IF CURRENT AGENT ALREADY BID
  ========================================================= */

  const hasAgentBid = (requestId) => {
    return agentBids.some(
      (bid) =>
        bid.requestId === requestId &&
        (
          bid.agentId === currentAgent.id ||
          (
            !bid.agentId &&
            bid.agentName === currentAgent.name
          )
        )
    );
  };

  /* =========================================================
     FORMAT CURRENCY
  ========================================================= */

  const formatCurrency = (value) => {
    return `LKR ${Number(value || 0).toLocaleString()}`;
  };

  /* =========================================================
     OPEN REQUEST
  ========================================================= */

  const openRequest = (request) => {
    setSelectedRequest(request);
  };

  /* =========================================================
     OPEN BID FORM
  ========================================================= */

  const openBidForm = () => {
    setBidForm({
      clearanceFee: "",
      processingTime: "",
      additionalCharges: "",
      message: "",
    });

    setShowBidModal(true);
  };

  /* =========================================================
     CLOSE BID MODAL
  ========================================================= */

  const closeBidModal = () => {
    setShowBidModal(false);
  };

  /* =========================================================
     SUBMIT BID
  ========================================================= */

  const submitBid = (event) => {
    event.preventDefault();

    if (!selectedRequest) {
      return;
    }

    /*
     * Prevent the same agent from submitting
     * multiple bids for the same request.
     */

    if (hasAgentBid(selectedRequest.id)) {
      alert(
        "You have already submitted a bid for this request."
      );

      setShowBidModal(false);

      return;
    }

    /*
     * Make sure the agent has a basic identity.
     */

    const agentId =
      currentAgent.id ||
      currentAgent.agentId ||
      currentAgent.email ||
      `AGENT-${Date.now()}`;

    const agentName =
      currentAgent.name ||
      currentAgent.fullName ||
      "Clearing Agent";

    const agencyName =
      currentAgent.agencyName ||
      currentAgent.agency ||
      currentAgent.companyName ||
      "Clearing Agency";

    /*
     * Create the bid.
     */

    const newBid = {
      id: `BID-${Date.now()}`,

      requestId: selectedRequest.id,

      product: selectedRequest.product,

      description: selectedRequest.description,

      hsCode: selectedRequest.hsCode,

      origin: selectedRequest.origin,

      destination: selectedRequest.destination,

      shipmentValue: selectedRequest.shipmentValue,

      /*
       * Agent identity
       */

      agentId,

      agentName,

      agencyName,

      /*
       * Bid information
       */

      clearanceFee: Number(
        bidForm.clearanceFee || 0
      ),

      processingTime:
        bidForm.processingTime.trim(),

      additionalCharges: Number(
        bidForm.additionalCharges || 0
      ),

      message:
        bidForm.message.trim(),

      status: "Pending",

      createdAt:
        new Date().toISOString(),
    };

    /*
     * Add bid to existing bids.
     */

    const updatedBids = [
      ...agentBids,
      newBid,
    ];

    setAgentBids(updatedBids);

    localStorage.setItem(
      "agentBids",
      JSON.stringify(updatedBids)
    );

    /*
     * Update marketplace request.
     */

    const updatedRequests = requests.map(
      (request) => {
        if (
          request.id === selectedRequest.id
        ) {
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

    /*
     * Save the last submitted bid.
     */

    localStorage.setItem(
      "lastSubmittedBid",
      JSON.stringify(newBid)
    );

    /*
     * Close modals.
     */

    setShowBidModal(false);

    setSelectedRequest(null);

    /*
     * Notify user.
     */

    alert(
      "Your bid has been submitted successfully."
    );
  };

  /* =========================================================
     URGENCY STYLE
  ========================================================= */

  const getUrgencyClass = (value) => {
    if (value === "High") {
      return "bg-red-50 text-red-600";
    }

    if (value === "Medium") {
      return "bg-amber-50 text-amber-600";
    }

    return "bg-green-50 text-green-600";
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="min-h-screen bg-[#F6F8FB]">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="bg-white border-b border-gray-200">

        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          <div className="flex items-center gap-4">

            <button
              onClick={() =>
                navigate(
                  "/agent-admin-dashboard"
                )
              }
              className="p-2 rounded-lg hover:bg-gray-100 transition"
            >
              <ArrowLeft size={20} />
            </button>

            <div>

              <h1 className="text-xl font-bold text-[#173563]">
                Agent Marketplace
              </h1>

              <p className="text-sm text-gray-500">
                Find SME import requests and submit your bids
              </p>

            </div>

          </div>

          <button
            onClick={() =>
              navigate(
                "/agent-admin-dashboard"
              )
            }
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50"
          >
            Dashboard
          </button>

        </div>

      </header>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* ===================================================
            STATS
        ==================================================== */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

          {/* AVAILABLE */}

          <div className="bg-white rounded-xl border border-gray-200 p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  Available Requests
                </p>

                <p className="text-2xl font-bold text-[#173563] mt-1">
                  {requests.length}
                </p>

              </div>

              <div className="p-3 bg-blue-50 rounded-xl">
                <Package
                  className="text-blue-600"
                  size={22}
                />
              </div>

            </div>

          </div>

          {/* FILTERED */}

          <div className="bg-white rounded-xl border border-gray-200 p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  Filtered Requests
                </p>

                <p className="text-2xl font-bold text-[#173563] mt-1">
                  {filteredRequests.length}
                </p>

              </div>

              <div className="p-3 bg-purple-50 rounded-xl">
                <Filter
                  className="text-purple-600"
                  size={22}
                />
              </div>

            </div>

          </div>

          {/* BIDS */}

          <div className="bg-white rounded-xl border border-gray-200 p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  My Submitted Bids
                </p>

                <p className="text-2xl font-bold text-[#173563] mt-1">
                  {agentBids.filter(
                    (bid) =>
                      bid.agentId ===
                        (
                          currentAgent.id ||
                          currentAgent.agentId ||
                          currentAgent.email
                        ) ||
                      (
                        !bid.agentId &&
                        bid.agentName ===
                          currentAgent.name
                      )
                  ).length}
                </p>

              </div>

              <div className="p-3 bg-green-50 rounded-xl">
                <CheckCircle2
                  className="text-green-600"
                  size={22}
                />
              </div>

            </div>

          </div>

        </div>

        {/* ===================================================
            SEARCH / FILTERS
        ==================================================== */}

        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* SEARCH */}

            <div className="relative">

              <Search
                size={19}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search products, HS codes..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* CATEGORY */}

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="px-4 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            >

              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}

            </select>

            {/* URGENCY */}

            <select
              value={urgency}
              onChange={(e) =>
                setUrgency(e.target.value)
              }
              className="px-4 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
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

        {/* ===================================================
            MARKETPLACE
        ==================================================== */}

        <div className="space-y-4">

          {filteredRequests.length === 0 ? (

            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">

              <Package
                size={42}
                className="mx-auto text-gray-300 mb-3"
              />

              <h3 className="font-semibold text-gray-700">
                No requests found
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Try changing your search or filters.
              </p>

            </div>

          ) : (

            filteredRequests.map(
              (request) => {

                const alreadyBid =
                  hasAgentBid(request.id);

                return (

                  <div
                    key={request.id}
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-sm transition"
                  >

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                      {/* REQUEST */}

                      <div className="flex-1">

                        <div className="flex items-start gap-4">

                          <div className="p-3 bg-blue-50 rounded-xl">

                            <Package
                              size={24}
                              className="text-blue-600"
                            />

                          </div>

                          <div>

                            <div className="flex items-center gap-3 flex-wrap">

                              <h2 className="font-bold text-[#173563] text-lg">
                                {request.product}
                              </h2>

                              <span
                                className={`px-2.5 py-1 rounded-full text-xs font-medium ${getUrgencyClass(
                                  request.urgency
                                )}`}
                              >
                                {request.urgency ||
                                  "Medium"}{" "}
                                Priority
                              </span>

                              {alreadyBid && (

                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
                                  Bid Submitted
                                </span>

                              )}

                            </div>

                            <p className="text-sm text-gray-500 mt-1">
                              Request ID:{" "}
                              {request.id}
                            </p>

                            <p className="text-sm text-gray-600 mt-3">
                              {request.description ||
                                request.product}
                            </p>

                          </div>

                        </div>

                        {/* DETAILS */}

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">

                          <div>

                            <p className="text-xs text-gray-400">
                              HS Code
                            </p>

                            <p className="text-sm font-semibold text-gray-700 mt-1">
                              {request.hsCode ||
                                "Not classified"}
                            </p>

                          </div>

                          <div>

                            <p className="text-xs text-gray-400">
                              Shipment Value
                            </p>

                            <p className="text-sm font-semibold text-gray-700 mt-1">
                              {formatCurrency(
                                request.shipmentValue
                              )}
                            </p>

                          </div>

                          <div>

                            <p className="text-xs text-gray-400">
                              Origin
                            </p>

                            <p className="text-sm font-semibold text-gray-700 mt-1">
                              {request.origin ||
                                "Not specified"}
                            </p>

                          </div>

                          <div>

                            <p className="text-xs text-gray-400">
                              Required By
                            </p>

                            <p className="text-sm font-semibold text-gray-700 mt-1">
                              {request.requestedDate ||
                                "Not specified"}
                            </p>

                          </div>

                        </div>

                      </div>

                      {/* ACTION */}

                      <button
                        onClick={() =>
                          openRequest(request)
                        }
                        className="flex items-center justify-center gap-2 px-5 py-3 bg-[#2563EB] text-white rounded-lg font-medium hover:bg-blue-700 transition"
                      >

                        View Request

                        <ChevronRight
                          size={18}
                        />

                      </button>

                    </div>

                  </div>

                );
              }
            )

          )}

        </div>

      </main>

      {/* =====================================================
          REQUEST DETAILS MODAL
      ====================================================== */}

      {selectedRequest &&
        !showBidModal && (

          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">

            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

              {/* HEADER */}

              <div className="flex items-center justify-between px-6 py-5 border-b">

                <div>

                  <h2 className="text-xl font-bold text-[#173563]">
                    Import Request
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    {selectedRequest.id}
                  </p>

                </div>

                <button
                  onClick={() =>
                    setSelectedRequest(null)
                  }
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>

              </div>

              {/* CONTENT */}

              <div className="p-6 space-y-6">

                <div>

                  <h3 className="text-lg font-bold text-gray-800">
                    {selectedRequest.product}
                  </h3>

                  <p className="text-gray-500 mt-2">
                    {selectedRequest.description ||
                      selectedRequest.product}
                  </p>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {/* HS */}

                  <div className="border rounded-xl p-4">

                    <div className="flex items-center gap-2 text-gray-500 text-sm">

                      <Package size={17} />

                      HS Code

                    </div>

                    <p className="font-semibold mt-2">
                      {selectedRequest.hsCode ||
                        "Not classified"}
                    </p>

                  </div>

                  {/* VALUE */}

                  <div className="border rounded-xl p-4">

                    <div className="flex items-center gap-2 text-gray-500 text-sm">

                      <DollarSign size={17} />

                      Shipment Value

                    </div>

                    <p className="font-semibold mt-2">
                      {formatCurrency(
                        selectedRequest.shipmentValue
                      )}
                    </p>

                  </div>

                  {/* ORIGIN */}

                  <div className="border rounded-xl p-4">

                    <div className="flex items-center gap-2 text-gray-500 text-sm">

                      <MapPin size={17} />

                      Origin

                    </div>

                    <p className="font-semibold mt-2">
                      {selectedRequest.origin ||
                        "Not specified"}
                    </p>

                  </div>

                  {/* DATE */}

                  <div className="border rounded-xl p-4">

                    <div className="flex items-center gap-2 text-gray-500 text-sm">

                      <Clock3 size={17} />

                      Required By

                    </div>

                    <p className="font-semibold mt-2">
                      {selectedRequest.requestedDate ||
                        "Not specified"}
                    </p>

                  </div>

                </div>

                {/* DESTINATION */}

                <div className="bg-gray-50 rounded-xl p-4">

                  <p className="text-sm text-gray-500">
                    Destination
                  </p>

                  <p className="font-semibold text-gray-800 mt-1">
                    {selectedRequest.destination ||
                      "Colombo, Sri Lanka"}
                  </p>

                </div>

                {/* BID STATUS */}

                {hasAgentBid(
                  selectedRequest.id
                ) ? (

                  <div className="rounded-xl bg-green-50 border border-green-100 p-4">

                    <div className="flex items-start gap-3">

                      <CheckCircle2
                        size={20}
                        className="text-green-600 mt-0.5"
                      />

                      <div>

                        <p className="font-semibold text-green-700">
                          Bid Already Submitted
                        </p>

                        <p className="text-sm text-green-600 mt-1">
                          You have already submitted a
                          bid for this SME request.
                        </p>

                      </div>

                    </div>

                  </div>

                ) : (

                  <button
                    onClick={openBidForm}
                    className="w-full flex items-center justify-center gap-2 bg-[#2563EB] text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
                  >

                    <Send size={18} />

                    Submit Bid

                  </button>

                )}

              </div>

            </div>

          </div>

        )}

      {/* =====================================================
          BID MODAL
      ====================================================== */}

      {showBidModal &&
        selectedRequest && (

          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-[60]">

            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

              {/* HEADER */}

              <div className="flex items-center justify-between px-6 py-5 border-b">

                <div>

                  <h2 className="text-xl font-bold text-[#173563]">
                    Submit Your Bid
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    {selectedRequest.product}
                  </p>

                </div>

                <button
                  onClick={closeBidModal}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>

              </div>

              {/* FORM */}

              <form
                onSubmit={submitBid}
                className="p-6 space-y-4"
              >

                {/* CLEARANCE FEE */}

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clearance Fee (LKR)
                  </label>

                  <input
                    type="number"
                    required
                    min="0"
                    value={
                      bidForm.clearanceFee
                    }
                    onChange={(e) =>
                      setBidForm({
                        ...bidForm,
                        clearanceFee:
                          e.target.value,
                      })
                    }
                    placeholder="Enter your clearance fee"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>

                {/* PROCESSING TIME */}

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Processing Time
                  </label>

                  <input
                    type="text"
                    required
                    value={
                      bidForm.processingTime
                    }
                    onChange={(e) =>
                      setBidForm({
                        ...bidForm,
                        processingTime:
                          e.target.value,
                      })
                    }
                    placeholder="e.g. 3-5 business days"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>

                {/* ADDITIONAL */}

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>

                {/* MESSAGE */}

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message to SME
                  </label>

                  <textarea
                    rows="4"
                    value={
                      bidForm.message
                    }
                    onChange={(e) =>
                      setBidForm({
                        ...bidForm,
                        message:
                          e.target.value,
                      })
                    }
                    placeholder="Tell the SME why they should choose your agency..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />

                </div>

                {/* SUMMARY */}

                <div className="rounded-xl bg-blue-50 p-4">

                  <div className="flex items-center justify-between">

                    <span className="text-sm text-blue-700">
                      Total Service Cost
                    </span>

                    <span className="font-bold text-[#173563]">

                      {formatCurrency(
                        Number(
                          bidForm.clearanceFee ||
                            0
                        ) +
                          Number(
                            bidForm.additionalCharges ||
                              0
                          )
                      )}

                    </span>

                  </div>

                </div>

                {/* SUBMIT */}

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-[#2563EB] text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
                >

                  <Send size={18} />

                  Submit Bid

                </button>

              </form>

            </div>

          </div>

        )}

    </div>
  );
}

export default AgentMarketplace;