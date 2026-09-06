import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Package,
  Clock3,
  DollarSign,
  Building2,
  MessageSquare,
  CheckCircle2,
  X,
  MapPin,
  ShieldCheck,
} from "lucide-react";

function AgentBids() {
  const navigate = useNavigate();

  const [bids] = useState(() => {
    return JSON.parse(localStorage.getItem("agentBids") || "[]");
  });

  const [search, setSearch] = useState("");
  const [selectedBid, setSelectedBid] = useState(null);

  const currentImport = JSON.parse(
    localStorage.getItem("currentImport") || "null"
  );

  const shipments = JSON.parse(
    localStorage.getItem("shipments") || "[]"
  );

  const filteredBids = useMemo(() => {
    let result = [...bids];

    if (currentImport?.id) {
      const matching = result.filter(
        (bid) =>
          bid.requestId === currentImport.id ||
          bid.importId === currentImport.id
      );

      if (matching.length > 0) {
        result = matching;
      }
    }

    if (search.trim()) {
      const value = search.toLowerCase();

      result = result.filter(
        (bid) =>
          bid.product?.toLowerCase().includes(value) ||
          bid.agentName?.toLowerCase().includes(value) ||
          bid.requestId?.toLowerCase().includes(value) ||
          bid.message?.toLowerCase().includes(value)
      );
    }

    return result;
  }, [bids, currentImport, search]);

  const formatCurrency = (value) => {
    return `LKR ${Number(value || 0).toLocaleString()}`;
  };

  const selectAgent = (bid) => {
    const selectedAgent = {
      id: bid.agentId || bid.id,
      name: bid.agentName || "Clearing Agent",
      agencyName: bid.agencyName || "Clearing Agency",
      clearanceFee: Number(bid.clearanceFee || 0),
      additionalCharges: Number(bid.additionalCharges || 0),
      processingTime: bid.processingTime || "",
      message: bid.message || "",
      bidId: bid.id,
      requestId: bid.requestId,
      selectedAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "selectedAgent",
      JSON.stringify(selectedAgent)
    );

    localStorage.setItem(
      "selectedBid",
      JSON.stringify(bid)
    );

    setSelectedBid(null);

    navigate("/shipment-confirmation");
  };

  const totalBidAmount = (bid) => {
    return (
      Number(bid.clearanceFee || 0) +
      Number(bid.additionalCharges || 0)
    );
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <h1 className="text-xl font-bold text-[#173563]">
                Clearing Agent Bids
              </h1>

              <p className="text-sm text-gray-500">
                Compare offers and choose the best clearing agent
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/find-agent")}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50"
          >
            Find Agents
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Import Summary */}
        {currentImport && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                <Package
                  size={24}
                  className="text-blue-600"
                />
              </div>

              <div className="flex-1">
                <p className="text-sm text-gray-500">
                  Current Import
                </p>

                <h2 className="text-lg font-bold text-[#173563] mt-1">
                  {currentImport.product ||
                    currentImport.productName ||
                    "Import Shipment"}
                </h2>

                <div className="flex flex-wrap gap-5 mt-3 text-sm text-gray-500">
                  {currentImport.hsCode && (
                    <span>
                      HS Code:{" "}
                      <strong className="text-gray-700">
                        {currentImport.hsCode}
                      </strong>
                    </span>
                  )}

                  {currentImport.productValue && (
                    <span>
                      Product Value:{" "}
                      <strong className="text-gray-700">
                        {formatCurrency(
                          currentImport.productValue
                        )}
                      </strong>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
          <div className="relative">
            <Search
              size={19}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search agencies, agents or bids..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Bid Count */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-[#173563]">
              Available Bids
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {filteredBids.length} agent
              {filteredBids.length !== 1 ? "s" : ""} submitted
              a bid
            </p>
          </div>
        </div>

        {/* Empty State */}
        {filteredBids.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <Package
              size={45}
              className="mx-auto text-gray-300 mb-4"
            />

            <h3 className="font-semibold text-gray-700 text-lg">
              No agent bids yet
            </h3>

            <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
              Clearing agents haven't submitted bids for this
              import yet. Check again later or browse available
              agents.
            </p>

            <button
              onClick={() => navigate("/find-agent")}
              className="mt-5 px-5 py-2.5 bg-[#2563EB] text-white rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              Find Clearing Agents
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredBids.map((bid) => (
              <div
                key={bid.id}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-sm transition"
              >
                <div className="flex flex-col xl:flex-row gap-6">
                  {/* Agent */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                        <Building2
                          size={23}
                          className="text-blue-600"
                        />
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-[#173563]">
                          {bid.agencyName ||
                            bid.agentName ||
                            "Clearing Agency"}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                          Agent:{" "}
                          {bid.agentName ||
                            "Clearing Agent"}
                        </p>

                        <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-2">
                          <MapPin size={15} />
                          Sri Lanka
                        </div>
                      </div>
                    </div>

                    {/* Bid Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                      <div className="border border-gray-100 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <DollarSign size={15} />
                          Clearance Fee
                        </div>

                        <p className="text-lg font-bold text-gray-800 mt-2">
                          {formatCurrency(
                            bid.clearanceFee
                          )}
                        </p>
                      </div>

                      <div className="border border-gray-100 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <DollarSign size={15} />
                          Additional Charges
                        </div>

                        <p className="text-lg font-bold text-gray-800 mt-2">
                          {formatCurrency(
                            bid.additionalCharges
                          )}
                        </p>
                      </div>

                      <div className="border border-gray-100 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Clock3 size={15} />
                          Processing Time
                        </div>

                        <p className="text-lg font-bold text-gray-800 mt-2">
                          {bid.processingTime ||
                            "Not specified"}
                        </p>
                      </div>
                    </div>

                    {/* Message */}
                    {bid.message && (
                      <div className="mt-5 bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <MessageSquare size={16} />
                          Message from agent
                        </div>

                        <p className="text-sm text-gray-600 mt-2 leading-6">
                          {bid.message}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action */}
                  <div className="xl:w-56 flex flex-wrap items-center xl:flex-col xl:items-stretch justify-between gap-3">
                    <div className="bg-blue-50 rounded-xl p-4">
                      <p className="text-xs text-blue-600">
                        Total Service Cost
                      </p>

                      <p className="text-xl font-bold text-[#173563] mt-1">
                        {formatCurrency(
                          totalBidAmount(bid)
                        )}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        setSelectedBid(bid)
                      }
                      className="flex items-center justify-center gap-2 px-5 py-3 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      View Details
                    </button>

                    <button
                      onClick={() => selectAgent(bid)}
                      className="flex items-center justify-center gap-2 px-5 py-3 bg-[#2563EB] text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
                    >
                      <CheckCircle2 size={18} />
                      Select Agent
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Security Note */}
        <div className="mt-8 flex items-start gap-3 bg-white border border-gray-200 rounded-xl p-5">
          <ShieldCheck
            size={21}
            className="text-green-600 mt-0.5"
          />

          <div>
            <p className="font-semibold text-gray-700 text-sm">
              Choose carefully
            </p>

            <p className="text-sm text-gray-500 mt-1">
              Compare the service fee, processing time and
              agent message before selecting your clearing
              agent.
            </p>
          </div>
        </div>
      </main>

      {/* Details Modal */}
      {selectedBid && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b">
              <div>
                <h2 className="text-xl font-bold text-[#173563]">
                  Agent Bid Details
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {selectedBid.id}
                </p>
              </div>

              <button
                onClick={() => setSelectedBid(null)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Building2
                    size={23}
                    className="text-blue-600"
                  />
                </div>

                <div>
                  <h3 className="font-bold text-gray-800">
                    {selectedBid.agencyName ||
                      "Clearing Agency"}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {selectedBid.agentName ||
                      "Clearing Agent"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="border rounded-xl p-4">
                  <p className="text-xs text-gray-400">
                    Clearance Fee
                  </p>

                  <p className="font-bold text-[#173563] mt-1">
                    {formatCurrency(
                      selectedBid.clearanceFee
                    )}
                  </p>
                </div>

                <div className="border rounded-xl p-4">
                  <p className="text-xs text-gray-400">
                    Additional Charges
                  </p>

                  <p className="font-bold text-[#173563] mt-1">
                    {formatCurrency(
                      selectedBid.additionalCharges
                    )}
                  </p>
                </div>
              </div>

              <div className="border rounded-xl p-4">
                <p className="text-xs text-gray-400">
                  Processing Time
                </p>

                <p className="font-semibold text-gray-800 mt-1">
                  {selectedBid.processingTime ||
                    "Not specified"}
                </p>
              </div>

              <div className="border rounded-xl p-4">
                <p className="text-xs text-gray-400">
                  Agent Message
                </p>

                <p className="text-sm text-gray-700 mt-2 leading-6">
                  {selectedBid.message ||
                    "No message provided."}
                </p>
              </div>

              <button
                onClick={() => selectAgent(selectedBid)}
                className="w-full flex items-center justify-center gap-2 bg-[#2563EB] text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
              >
                <CheckCircle2 size={18} />
                Select This Agent
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AgentBids;
