import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Package,
  Clock3,
  DollarSign,
  Eye,
  X,
  CheckCircle2,
  XCircle,
  Hourglass,
} from "lucide-react";

function AgentMyBids() {
  const navigate = useNavigate();

  const [bids] = useState(() => {
    return JSON.parse(localStorage.getItem("agentBids") || "[]");
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedBid, setSelectedBid] = useState(null);

  const filteredBids = useMemo(() => {
    return bids.filter((bid) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        bid.product?.toLowerCase().includes(searchValue) ||
        bid.requestId?.toLowerCase().includes(searchValue) ||
        bid.message?.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" || bid.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bids, search, statusFilter]);

  const pendingCount = bids.filter(
    (bid) => bid.status === "Pending"
  ).length;

  const acceptedCount = bids.filter(
    (bid) => bid.status === "Accepted"
  ).length;

  const rejectedCount = bids.filter(
    (bid) => bid.status === "Rejected"
  ).length;

  const formatCurrency = (value) => {
    return `LKR ${Number(value || 0).toLocaleString()}`;
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Accepted":
        return "bg-green-50 text-green-700";

      case "Rejected":
        return "bg-red-50 text-red-700";

      default:
        return "bg-amber-50 text-amber-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Accepted":
        return <CheckCircle2 size={16} />;

      case "Rejected":
        return <XCircle size={16} />;

      default:
        return <Hourglass size={16} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/agent-admin-dashboard")}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <h1 className="text-xl font-bold text-[#173563]">
                My Bids
              </h1>

              <p className="text-sm text-gray-500">
                Track all bids submitted to SMEs
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/agent-marketplace")}
            className="px-4 py-2 bg-[#2563EB] text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            Browse Marketplace
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-sm text-gray-500">Total Bids</p>

            <p className="text-2xl font-bold text-[#173563] mt-1">
              {bids.length}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-sm text-gray-500">Pending</p>

            <p className="text-2xl font-bold text-amber-600 mt-1">
              {pendingCount}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-sm text-gray-500">Accepted</p>

            <p className="text-2xl font-bold text-green-600 mt-1">
              {acceptedCount}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-sm text-gray-500">Rejected</p>

            <p className="text-2xl font-bold text-red-600 mt-1">
              {rejectedCount}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search
                size={19}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search bids..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Bids */}
        {filteredBids.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <Package
              size={42}
              className="mx-auto text-gray-300 mb-4"
            />

            <h3 className="font-semibold text-gray-700">
              No bids found
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              You haven't submitted any bids matching your filters.
            </p>

            <button
              onClick={() => navigate("/agent-marketplace")}
              className="mt-5 px-5 py-2.5 bg-[#2563EB] text-white rounded-lg text-sm font-medium"
            >
              Find Import Requests
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBids.map((bid) => (
              <div
                key={bid.id}
                className="bg-white border border-gray-200 rounded-xl p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-50 rounded-xl">
                        <Package
                          size={23}
                          className="text-blue-600"
                        />
                      </div>

                      <div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <h2 className="font-bold text-[#173563] text-lg">
                            {bid.product}
                          </h2>

                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                              bid.status
                            )}`}
                          >
                            {getStatusIcon(bid.status)}
                            {bid.status}
                          </span>
                        </div>

                        <p className="text-sm text-gray-500 mt-1">
                          Request: {bid.requestId}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-5">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <DollarSign size={14} />
                          Clearance Fee
                        </div>

                        <p className="font-semibold text-gray-700 mt-1">
                          {formatCurrency(bid.clearanceFee)}
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <Clock3 size={14} />
                          Processing Time
                        </div>

                        <p className="font-semibold text-gray-700 mt-1">
                          {bid.processingTime || "Not specified"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">
                          Submitted
                        </p>

                        <p className="font-semibold text-gray-700 mt-1">
                          {bid.createdAt
                            ? new Date(
                                bid.createdAt
                              ).toLocaleDateString()
                            : "-"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedBid(bid)}
                    className="flex items-center justify-center gap-2 px-5 py-3 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Eye size={17} />
                    View Bid
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Details Modal */}
      {selectedBid && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-5 border-b">
              <div>
                <h2 className="text-xl font-bold text-[#173563]">
                  Bid Details
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
              <div>
                <p className="text-sm text-gray-500">
                  Import Request
                </p>

                <p className="font-semibold text-gray-800 mt-1">
                  {selectedBid.product}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Request ID
                </p>

                <p className="font-semibold text-gray-800 mt-1">
                  {selectedBid.requestId}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-xl p-4">
                  <p className="text-xs text-gray-400">
                    Clearance Fee
                  </p>

                  <p className="font-bold text-[#173563] mt-1">
                    {formatCurrency(selectedBid.clearanceFee)}
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
                  {selectedBid.processingTime || "Not specified"}
                </p>
              </div>

              <div className="border rounded-xl p-4">
                <p className="text-xs text-gray-400">
                  Message to SME
                </p>

                <p className="text-sm text-gray-700 mt-2 leading-6">
                  {selectedBid.message ||
                    "No message was provided."}
                </p>
              </div>

              <div
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium ${getStatusStyle(
                  selectedBid.status
                )}`}
              >
                {getStatusIcon(selectedBid.status)}
                Bid Status: {selectedBid.status}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AgentMyBids;