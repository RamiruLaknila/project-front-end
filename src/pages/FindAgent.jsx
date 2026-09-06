import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Search,
  SlidersHorizontal,
  MapPin,
  Star,
  ShieldCheck,
  Package,
  Clock3,
  Building2,
  CheckCircle2,
  X,
  Send,
  Sparkles,
  BriefcaseBusiness,
  ChevronDown,
  Laptop,
  Shirt,
  Car,
  Apple,
  Factory,
  Pill,
  Home,
  ShoppingBag,
} from "lucide-react";

import AppNavbar from "../components/ui/AppNavbar";
import BackButton from "../components/ui/BackButton";

function FindAgent() {
  const navigate = useNavigate();

  /* =========================================================
     SEARCH & FILTERS
  ========================================================= */

  const [searchQuery, setSearchQuery] = useState("");

  const [categoryFilter, setCategoryFilter] =
    useState("All Categories");

  const [locationFilter, setLocationFilter] =
    useState("All Locations");

  const [experienceFilter, setExperienceFilter] =
    useState("Any Experience");

  const [ratingFilter, setRatingFilter] =
    useState("Any Rating");

  const [showFilters, setShowFilters] = useState(false);

  /* =========================================================
     REQUEST FORM
  ========================================================= */

  const [productDetails, setProductDetails] = useState("");
  const [origin, setOrigin] = useState("");
  const [declaredValue, setDeclaredValue] = useState("");

  const [selectedAgent, setSelectedAgent] =
    useState(null);

  const [showProfile, setShowProfile] =
    useState(false);

  const [showRequestForm, setShowRequestForm] =
    useState(false);

  /* =========================================================
     INLINE BID REVIEW
  ========================================================= */

  const [showBidReview, setShowBidReview] = useState(false);
  const [bids, setBids] = useState([]);
  const [selectedBid, setSelectedBid] = useState(null);
  const [isAccepting, setIsAccepting] = useState(false);

  const getRequestId = () =>
    localStorage.getItem("currentRequestId") ||
    JSON.parse(localStorage.getItem("shipmentRequest") || "null")?.requestId ||
    JSON.parse(localStorage.getItem("currentMarketplaceRequest") || "null")?.requestId ||
    null;

  const loadBids = () => {
    const requestId = getRequestId();

    try {
      const allBids = JSON.parse(
        localStorage.getItem("agentBids") || "[]"
      );

      const matching = Array.isArray(allBids)
        ? allBids.filter(
            (bid) => bid.requestId === requestId
          )
        : [];

      matching.sort(
        (a, b) =>
          Number(
            a.totalFee ??
              Number(a.clearanceFee || 0) +
                Number(a.additionalCharges || 0)
          ) -
          Number(
            b.totalFee ??
              Number(b.clearanceFee || 0) +
                Number(b.additionalCharges || 0)
          )
      );

      setBids(matching);
    } catch {
      setBids([]);
    }
  };

  const openBidReview = () => {
    loadBids();
    setSelectedBid(null);
    setShowBidReview(true);
  };

  useEffect(() => {
    if (!showBidReview) return undefined;

    loadBids();

    const timer = window.setInterval(
      loadBids,
      1500
    );

    return () =>
      window.clearInterval(timer);
  }, [showBidReview]);

  const handleAcceptBid = () => {
    if (!selectedBid || isAccepting) return;

    setIsAccepting(true);

    try {
      const requestId = getRequestId();

      const shipmentRequest = JSON.parse(
        localStorage.getItem("shipmentRequest") ||
          "null"
      );

      const marketplaceRequest = JSON.parse(
        localStorage.getItem(
          "currentMarketplaceRequest"
        ) || "null"
      );

      const totalFee = Number(
        selectedBid.totalFee ??
          Number(selectedBid.clearanceFee || 0) +
            Number(
              selectedBid.additionalCharges || 0
            )
      );

      const selected = {
        ...selectedBid,
        id:
          selectedBid.agentId ||
          selectedBid.id,

        name:
          selectedBid.agentName ||
          selectedBid.name ||
          "Clearing Agent",

        agentName:
          selectedBid.agentName ||
          selectedBid.name ||
          "Clearing Agent",

        agencyName:
          selectedBid.agencyName ||
          selectedBid.companyName ||
          "Clearing Agency",

        totalFee,

        bidId:
          selectedBid.id ||
          selectedBid.bidId ||
          `BID-${Date.now()}`,

        requestId,

        selectedAt:
          new Date().toISOString(),
      };

      const allBids = JSON.parse(
        localStorage.getItem("agentBids") ||
          "[]"
      );

      localStorage.setItem(
        "agentBids",
        JSON.stringify(
          Array.isArray(allBids)
            ? allBids.map((bid) =>
                bid.requestId === requestId
                  ? {
                      ...bid,
                      status:
                        (bid.id || bid.bidId) ===
                        (selectedBid.id ||
                          selectedBid.bidId)
                          ? "Accepted"
                          : "Rejected",
                    }
                  : bid
              )
            : []
        )
      );

      localStorage.setItem(
        "selectedAgent",
        JSON.stringify(selected)
      );

      const updatedRequest = {
        ...(shipmentRequest || {}),
        id: requestId,
        requestId,
        status: "Agent Selected",
        selectedBidId: selected.bidId,
        selectedAgentId: selected.id,
        selectedAgentName:
          selected.agencyName,
        selectedAt: selected.selectedAt,
      };

      localStorage.setItem(
        "shipmentRequest",
        JSON.stringify(updatedRequest)
      );

      const updatedMarketplace = {
        ...(marketplaceRequest || {}),
        id: requestId,
        requestId,
        status: "Agent Selected",
        hasBid: true,
        selectedBidId: selected.bidId,
        selectedAgentId: selected.id,
        selectedAgentName:
          selected.agencyName,
        selectedAt: selected.selectedAt,
      };

      localStorage.setItem(
        "currentMarketplaceRequest",
        JSON.stringify(updatedMarketplace)
      );

      try {
        const marketplaceRequests =
          JSON.parse(
            localStorage.getItem(
              "marketplaceRequests"
            ) || "[]"
          );

        if (Array.isArray(marketplaceRequests)) {
          localStorage.setItem(
            "marketplaceRequests",
            JSON.stringify(
              marketplaceRequests.map(
                (request) =>
                  request.id === requestId ||
                  request.requestId === requestId
                    ? updatedMarketplace
                    : request
              )
            )
          );
        }
      } catch {
        // Ignore malformed marketplace request data.
      }

      const currentImport = JSON.parse(
        localStorage.getItem("currentImport") ||
          "null"
      );

      localStorage.setItem(
        "currentShipment",
        JSON.stringify({
          id: `SHIP-${Date.now()}`,
          requestId,

          product:
            shipmentRequest?.product ||
            shipmentRequest?.productDetails ||
            "Import shipment",

          origin:
            shipmentRequest?.origin ||
            "Not specified",

          destination:
            shipmentRequest?.destination ||
            "Colombo, Sri Lanka",

          shipmentValue:
            shipmentRequest?.shipmentValue ||
            shipmentRequest?.declaredValue ||
            currentImport?.productValue ||
            0,

          hsCode:
            shipmentRequest?.hsCode ||
            currentImport?.hsCode ||
            "",

          category:
            shipmentRequest?.category ||
            currentImport?.category ||
            "General",

          agent: selected,

          status: "Agent Selected",

          createdAt:
            new Date().toISOString(),
        })
      );

      setShowBidReview(false);
      setSelectedBid(null);

      navigate("/shipment-confirmation");
    } catch (error) {
      console.error(error);

      alert(
        "We could not accept this bid. Please try again."
      );
    } finally {
      setIsAccepting(false);
    }
  };

  /* =========================================================
     CATEGORIES
  ========================================================= */

  const categories = [
    {
      name: "Electronics",
      icon: Laptop,
    },
    {
      name: "Textiles & Apparel",
      icon: Shirt,
    },
    {
      name: "Automotive",
      icon: Car,
    },
    {
      name: "Food & Agriculture",
      icon: Apple,
    },
    {
      name: "Machinery",
      icon: Factory,
    },
    {
      name: "Pharmaceuticals",
      icon: Pill,
    },
    {
      name: "Household Goods",
      icon: Home,
    },
    {
      name: "Other Goods",
      icon: ShoppingBag,
    },
  ];

  /* =========================================================
     AVAILABLE CLEARING AGENTS
  ========================================================= */

  const agents = [
    {
      id: "agent-001",
      agencyName: "LankaClear Logistics",
      agentName: "Kasun Perera",
      location: "Colombo",
      rating: 4.9,
      reviews: 128,
      experience: 8,
      shipments: 420,
      verified: true,
      responseTime:
        "Usually responds within 1 hour",
      categories: [
        "Electronics",
        "Machinery",
        "Automotive",
      ],
      description:
        "Experienced customs clearing team specializing in commercial imports, electronics and industrial shipments.",
    },

    {
      id: "agent-002",
      agencyName: "Prime Customs Solutions",
      agentName: "Nuwan Fernando",
      location: "Colombo",
      rating: 4.8,
      reviews: 96,
      experience: 6,
      shipments: 315,
      verified: true,
      responseTime:
        "Usually responds within 2 hours",
      categories: [
        "Textiles & Apparel",
        "Electronics",
        "Household Goods",
      ],
      description:
        "Professional clearing service focused on SMEs and regular commercial import shipments.",
    },

    {
      id: "agent-003",
      agencyName: "Ceylon Trade Assist",
      agentName: "Dilshan Silva",
      location: "Colombo",
      rating: 4.7,
      reviews: 84,
      experience: 5,
      shipments: 260,
      verified: true,
      responseTime:
        "Usually responds within 3 hours",
      categories: [
        "Food & Agriculture",
        "Pharmaceuticals",
        "Household Goods",
      ],
      description:
        "Customs clearance specialists helping businesses handle food, agricultural and regulated imports.",
    },

    {
      id: "agent-004",
      agencyName: "Island Customs & Freight",
      agentName: "Tharindu Jayasinghe",
      location: "Galle",
      rating: 4.6,
      reviews: 72,
      experience: 9,
      shipments: 510,
      verified: true,
      responseTime:
        "Usually responds within 2 hours",
      categories: [
        "Automotive",
        "Machinery",
        "Other Goods",
      ],
      description:
        "Long-standing customs clearing agency handling heavy equipment, vehicles and commercial cargo.",
    },

    {
      id: "agent-005",
      agencyName: "Metro Import Services",
      agentName: "Ravindu Wijesinghe",
      location: "Negombo",
      rating: 4.5,
      reviews: 61,
      experience: 4,
      shipments: 198,
      verified: true,
      responseTime:
        "Usually responds within 4 hours",
      categories: [
        "Electronics",
        "Textiles & Apparel",
        "Other Goods",
      ],
      description:
        "SME-focused customs clearing service providing straightforward import documentation and clearance.",
    },

    {
      id: "agent-006",
      agencyName: "HarbourLink Clearing",
      agentName: "Sahan Gunawardena",
      location: "Colombo",
      rating: 4.4,
      reviews: 49,
      experience: 7,
      shipments: 340,
      verified: true,
      responseTime:
        "Usually responds within 3 hours",
      categories: [
        "Machinery",
        "Automotive",
        "Electronics",
      ],
      description:
        "Experienced clearing team located close to the Colombo port area.",
    },
  ];

  /* =========================================================
     FILTER AGENTS
  ========================================================= */

  const filteredAgents = useMemo(() => {
    const query =
      searchQuery.trim().toLowerCase();

    const filtered = agents.filter(
      (agent) => {
        const matchesSearch =
          !query ||
          agent.agencyName
            .toLowerCase()
            .includes(query) ||
          agent.agentName
            .toLowerCase()
            .includes(query) ||
          agent.location
            .toLowerCase()
            .includes(query) ||
          agent.categories.some((category) =>
            category
              .toLowerCase()
              .includes(query)
          );

        const matchesCategory =
          categoryFilter ===
            "All Categories" ||
          agent.categories.includes(
            categoryFilter
          );

        const matchesLocation =
          locationFilter ===
            "All Locations" ||
          agent.location === locationFilter;

        const matchesExperience =
          experienceFilter ===
            "Any Experience" ||
          (experienceFilter ===
            "1–3 years" &&
            agent.experience >= 1 &&
            agent.experience <= 3) ||
          (experienceFilter ===
            "4–7 years" &&
            agent.experience >= 4 &&
            agent.experience <= 7) ||
          (experienceFilter ===
            "8+ years" &&
            agent.experience >= 8);

        const matchesRating =
          ratingFilter === "Any Rating" ||
          (ratingFilter ===
            "4.0+ Rating" &&
            agent.rating >= 4.0) ||
          (ratingFilter ===
            "4.5+ Rating" &&
            agent.rating >= 4.5) ||
          (ratingFilter ===
            "4.8+ Rating" &&
            agent.rating >= 4.8);

        return (
          matchesSearch &&
          matchesCategory &&
          matchesLocation &&
          matchesExperience &&
          matchesRating
        );
      }
    );

    return [...filtered].sort(
      (a, b) => b.rating - a.rating
    );
  }, [
    searchQuery,
    categoryFilter,
    locationFilter,
    experienceFilter,
    ratingFilter,
  ]);

  /* =========================================================
     ACTIVE FILTERS
  ========================================================= */

  const hasActiveFilters =
    searchQuery.trim() ||
    categoryFilter !== "All Categories" ||
    locationFilter !== "All Locations" ||
    experienceFilter !== "Any Experience" ||
    ratingFilter !== "Any Rating";

  /* =========================================================
     CLEAR FILTERS
  ========================================================= */

  const clearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("All Categories");
    setLocationFilter("All Locations");
    setExperienceFilter("Any Experience");
    setRatingFilter("Any Rating");
  };

  /* =========================================================
     VIEW PROFILE
  ========================================================= */

  const handleViewProfile = (agent) => {
    setSelectedAgent(agent);
    setShowProfile(true);
  };

  /* =========================================================
     REQUEST QUOTE
  ========================================================= */

  const handleRequestQuote = (agent) => {
    setSelectedAgent(agent);
    setShowRequestForm(true);
  };

  /* =========================================================
     SELECT AGENT
  ========================================================= */

  const handleSelectAgent = (agent) => {
    setSelectedAgent(agent);

    try {
      localStorage.setItem(
        "selectedAgent",
        JSON.stringify(agent)
      );
    } catch {
      // Ignore localStorage errors
    }

    setShowRequestForm(true);
  };

  /* =========================================================
     CREATE SHIPMENT REQUEST
  ========================================================= */

  const createShipmentRequest = (e) => {
    if (e) {
      e.preventDefault();
    }

    const cleanProduct =
      productDetails.trim();

    const cleanOrigin =
      origin.trim();

    const numericValue =
      Number(declaredValue);

    if (!cleanProduct) {
      alert(
        "Please enter what you are importing."
      );
      return;
    }

    if (!cleanOrigin) {
      alert(
        "Please enter the country or city of origin."
      );
      return;
    }

    if (!numericValue || numericValue <= 0) {
      alert(
        "Please enter a valid declared value."
      );
      return;
    }

    let currentImport = null;

    try {
      currentImport = JSON.parse(
        localStorage.getItem(
          "currentImport"
        ) || "null"
      );
    } catch {
      currentImport = null;
    }

    const requestId =
      `REQ-${Date.now()}`;

    const createdAt =
      new Date().toISOString();

    const finalCategory =
      currentImport?.category ||
      (categoryFilter !==
      "All Categories"
        ? categoryFilter
        : "General");

    const shipmentRequest = {
      id: requestId,
      requestId,

      productDetails:
        cleanProduct,

      product:
        cleanProduct,

      origin:
        cleanOrigin,

      declaredValue:
        numericValue,

      shipmentValue:
        numericValue,

      hsCode:
        currentImport?.hsCode || "",

      category:
        finalCategory,

      destination:
        "Colombo, Sri Lanka",

      urgency:
        "Medium",

      status:
        "Open",

      selectedAgentId:
        selectedAgent?.id || null,

      selectedAgentName:
        selectedAgent?.agencyName || null,

      createdAt,
    };

    localStorage.setItem(
      "shipmentRequest",
      JSON.stringify(
        shipmentRequest
      )
    );

    let existingRequests = [];

    try {
      existingRequests =
        JSON.parse(
          localStorage.getItem(
            "marketplaceRequests"
          ) || "[]"
        );

      if (
        !Array.isArray(
          existingRequests
        )
      ) {
        existingRequests = [];
      }
    } catch {
      existingRequests = [];
    }

    const marketplaceRequest = {
      id: requestId,
      requestId,

      product:
        cleanProduct,

      productDetails:
        cleanProduct,

      description:
        cleanProduct,

      hsCode:
        currentImport?.hsCode ||
        "Not classified",

      category:
        finalCategory,

      origin:
        cleanOrigin,

      destination:
        "Colombo, Sri Lanka",

      shipmentValue:
        numericValue,

      declaredValue:
        numericValue,

      requestedDate:
        new Date(
          Date.now() +
            7 *
              24 *
              60 *
              60 *
              1000
        )
          .toISOString()
          .split("T")[0],

      urgency:
        "Medium",

      status:
        "Open",

      hasBid:
        false,

      selectedAgentId:
        selectedAgent?.id || null,

      selectedAgentName:
        selectedAgent?.agencyName ||
        null,

      createdAt,
    };

    const updatedRequests = [
      marketplaceRequest,

      ...existingRequests.filter(
        (request) =>
          request.id !==
          requestId
      ),
    ];

    localStorage.setItem(
      "marketplaceRequests",
      JSON.stringify(
        updatedRequests
      )
    );

    localStorage.setItem(
      "currentMarketplaceRequest",
      JSON.stringify(
        marketplaceRequest
      )
    );

    localStorage.setItem(
      "currentRequestId",
      requestId
    );

    if (selectedAgent) {
      localStorage.setItem(
        "selectedAgent",
        JSON.stringify(
          selectedAgent
        )
      );
    } else {
      localStorage.removeItem(
        "selectedAgent"
      );
    }

    let existingBids = [];

    try {
      existingBids =
        JSON.parse(
          localStorage.getItem(
            "agentBids"
          ) || "[]"
        );

      if (
        !Array.isArray(
          existingBids
        )
      ) {
        existingBids = [];
      }
    } catch {
      existingBids = [];
    }

    const cleanedBids =
      existingBids.filter(
        (bid) =>
          bid.requestId !==
          requestId
      );

    localStorage.setItem(
      "agentBids",
      JSON.stringify(
        cleanedBids
      )
    );

    setShowRequestForm(false);

    window.setTimeout(
      () => openBidReview(),
      250
    );
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-900">

      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.98);
          }

          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-up {
          animation:
            fadeUp 0.5s
            cubic-bezier(0.22, 1, 0.36, 1)
            both;
        }

        .scale-in {
          animation:
            scaleIn 0.35s
            cubic-bezier(0.22, 1, 0.36, 1)
            both;
        }

        .slide-down {
          animation:
            slideDown 0.25s
            cubic-bezier(0.22, 1, 0.36, 1)
            both;
        }

        .agent-delay-1 {
          animation-delay: 0.05s;
        }

        .agent-delay-2 {
          animation-delay: 0.1s;
        }

        .agent-delay-3 {
          animation-delay: 0.15s;
        }

        .agent-delay-4 {
          animation-delay: 0.2s;
        }

        .agent-delay-5 {
          animation-delay: 0.25s;
        }

        @media (prefers-reduced-motion: reduce) {
          .fade-up,
          .scale-in,
          .slide-down {
            animation: none;
          }
        }
      `}</style>

      <AppNavbar />

      <main className="mx-auto w-full max-w-[1000px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">

        <div className="fade-up mb-6">
          <BackButton current="Find Clearing Agent" />
        </div>

        <section className="fade-up -mt-8 mb-7">
          <div className="text-center">
            <h1 className="text-[32px] font-bold tracking-[-0.04em] text-[#14213D] sm:text-[42px]">
              Find a clearing agent
            </h1>

            <p className="mx-auto mt-2 max-w-2xl text-[13px] leading-6 text-slate-500 sm:text-[15px]">
              Search and compare verified clearing
              agents based on experience, ratings,
              location, and import specializations.
            </p>
          </div>
        </section>

        <section className="fade-up agent-delay-1 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,.025)]">

          <div className="p-5 sm:p-6">

            <div className="mb-4 flex items-center justify-between gap-3">

              <div>
                <div className="flex items-center gap-2">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#2563EB]">
                    <Search size={16} />
                  </div>

                  <h2 className="text-[17px] font-bold text-slate-900">
                    Search clearing agents
                  </h2>

                </div>

                <p className="mt-2 text-[13px] text-slate-500">
                  Find an agent that matches your
                  shipment requirements.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowFilters(
                    !showFilters
                  )
                }
                className={`flex shrink-0 items-center gap-2 rounded-xl border px-3.5 py-2.5 text-[12px] font-bold transition ${
                  showFilters
                    ? "border-[#173B6C] bg-[#173B6C] text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <SlidersHorizontal size={16} />
                Filters
              </button>

            </div>

            <div className="relative">

              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(
                    e.target.value
                  )
                }
                placeholder="Search by agency, agent, location or specialization..."
                className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-11 text-[13px] font-medium text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-400 focus:border-[#173B6C] focus:ring-2 focus:ring-[#173B6C]/10"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() =>
                    setSearchQuery("")
                  }
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={16} />
                </button>
              )}

            </div>

          </div>

          {showFilters && (
            <div className="slide-down border-t border-slate-100 bg-slate-50/60 p-5 sm:p-6">

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                <FilterSelect
                  label="Category"
                  value={categoryFilter}
                  onChange={setCategoryFilter}
                  options={[
                    "All Categories",
                    ...categories.map(
                      (category) =>
                        category.name
                    ),
                  ]}
                />

                <FilterSelect
                  label="Location"
                  value={locationFilter}
                  onChange={setLocationFilter}
                  options={[
                    "All Locations",
                    "Colombo",
                    "Galle",
                    "Negombo",
                  ]}
                />

                <FilterSelect
                  label="Experience"
                  value={experienceFilter}
                  onChange={setExperienceFilter}
                  options={[
                    "Any Experience",
                    "1–3 years",
                    "4–7 years",
                    "8+ years",
                  ]}
                />

                <FilterSelect
                  label="Rating"
                  value={ratingFilter}
                  onChange={setRatingFilter}
                  options={[
                    "Any Rating",
                    "4.0+ Rating",
                    "4.5+ Rating",
                    "4.8+ Rating",
                  ]}
                />

              </div>

              {hasActiveFilters && (
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-[12px] font-bold text-[#2563EB] hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}

            </div>
          )}

          <div className="border-t border-slate-100 px-5 py-4 sm:px-6">

            <div className="flex items-center gap-2 overflow-x-auto">

              <span className="shrink-0 text-[12px] font-semibold text-slate-400">
                Popular:
              </span>

              {[
                "Electronics",
                "Textiles & Apparel",
                "Automotive",
                "Machinery",
              ].map((category) => {

                const active =
                  categoryFilter ===
                  category;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() =>
                      setCategoryFilter(
                        active
                          ? "All Categories"
                          : category
                      )
                    }
                    className={`shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-bold transition ${
                      active
                        ? "border-[#173B6C] bg-[#173B6C] text-white"
                        : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}

            </div>

          </div>

        </section>

        <section className="fade-up agent-delay-2 mb-4 mt-7 flex items-end justify-between gap-4">

          <div>

            <h2 className="text-[18px] font-bold text-slate-900">
              Available clearing agents
            </h2>

            <p className="mt-1 text-[13px] text-slate-400">
              {filteredAgents.length}{" "}
              agent
              {filteredAgents.length !== 1
                ? "s"
                : ""}{" "}
              found
            </p>

          </div>

          <div className="hidden items-center gap-2 text-[12px] text-slate-400 sm:flex">

            <ShieldCheck
              size={15}
              className="text-emerald-600"
            />

            Verified agents

          </div>

        </section>

        {filteredAgents.length > 0 ? (

          <section className="grid gap-5 lg:grid-cols-2">

            {filteredAgents.map(
              (agent, index) => (

                <AgentCard
                  key={agent.id}
                  agent={agent}
                  delay={
                    index % 5
                  }
                  selected={
                    selectedAgent?.id ===
                    agent.id
                  }
                  onViewProfile={
                    handleViewProfile
                  }
                  onRequestQuote={
                    handleRequestQuote
                  }
                  onSelectAgent={
                    handleSelectAgent
                  }
                />

              )
            )}

          </section>

        ) : (

          <section className="scale-in rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
              <Search size={22} />
            </div>

            <h3 className="mt-4 text-[17px] font-bold text-[#173B6C]">
              No agents found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-[13px] leading-5 text-slate-400">
              Try changing your search or
              filters to find more clearing
              agents.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 rounded-xl bg-[#173B6C] px-4 py-2.5 text-[12px] font-bold text-white transition hover:bg-[#12315B]"
            >
              Clear filters
            </button>

          </section>

        )}

        {selectedAgent && (

          <section className="fade-up mt-6 overflow-hidden rounded-2xl border border-blue-100 bg-blue-50">

            <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#2563EB] shadow-sm">
                  <CheckCircle2 size={19} />
                </div>

                <div>

                  <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-blue-500">
                    Selected agent
                  </p>

                  <h3 className="mt-0.5 text-[15px] font-bold text-[#173B6C]">
                    {selectedAgent.agencyName}
                  </h3>

                  <p className="mt-0.5 text-[12px] text-slate-500">
                    {selectedAgent.location} ·{" "}
                    {selectedAgent.experience}{" "}
                    years experience
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowRequestForm(true)
                }
                className="flex items-center justify-center gap-2 rounded-xl bg-[#173B6C] px-4 py-3 text-[13px] font-bold text-white transition hover:bg-[#12315B]"
              >
                <Send size={15} />
                Request a Quote
                <ArrowRight size={15} />
              </button>

            </div>

          </section>

        )}

        <section className="fade-up agent-delay-3 mt-6 overflow-hidden rounded-2xl border border-[#173B6C] bg-[#173B6C]">

          <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white">
                <Sparkles size={19} />
              </div>

              <div>

                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-blue-200">
                  Need more options?
                </p>

                <h3 className="mt-1 text-[17px] font-bold text-white">
                  Let clearing agents compete for your shipment
                </h3>

                <p className="mt-1 max-w-xl text-[12px] leading-5 text-blue-100">
                  Post your shipment details and
                  receive bids from qualified
                  clearing agents. Compare their
                  offers before making your
                  decision.
                </p>

              </div>

            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedAgent(null);
                setShowRequestForm(true);
              }}
              className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-[13px] font-bold text-[#173B6C] transition hover:bg-blue-50"
            >
              <Send size={15} />
              Post Shipment Request
            </button>

          </div>

        </section>

        <section className="mt-5 grid gap-4 sm:grid-cols-3">

          <InfoCard
            icon={ShieldCheck}
            title="Verified agents"
            text="Compare verified clearing agents on ImportEase."
          />

          <InfoCard
            icon={Package}
            title="Compare experience"
            text="Review ratings, experience and completed shipments."
          />

          <InfoCard
            icon={Send}
            title="Receive bids"
            text="Post your shipment and compare offers from agents."
          />

        </section>

        <div className="fade-up mt-7 flex flex-col-reverse items-stretch justify-between gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center">

          <Link
            to="/import-calculator"
            className="flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-[13px] font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 sm:justify-start"
          >
            <ArrowLeft size={18} />
            Back to Import Calculator
          </Link>

          <button
            type="button"
            onClick={() => {
              setSelectedAgent(null);
              setShowRequestForm(true);
            }}
            className="group flex items-center justify-center gap-2 rounded-xl bg-[#173B6C] px-6 py-3.5 text-[13px] font-semibold text-white shadow-[0_6px_18px_rgba(23,59,108,.12)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#12315B] hover:shadow-[0_10px_24px_rgba(23,59,108,.18)]"
          >
            Post Shipment Request

            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </button>

        </div>

        <div className="fade-up mt-6 flex items-center justify-center gap-2 text-center text-[12px] text-slate-400">

          <ShieldCheck
            size={15}
            className="text-emerald-600"
          />

          <span>
            Compare agents and choose the
            service that best fits your shipment.
          </span>

        </div>

      </main>

      {/* =====================================================
          INLINE BID REVIEW MODAL
      ====================================================== */}

      {showBidReview && (
        <Modal
          onClose={() =>
            setShowBidReview(false)
          }
          wide
        >
          <div className="p-5 sm:p-6">

            <div className="flex items-start justify-between gap-4">

              <div>

                <h2 className="text-[20px] font-bold text-[#173B6C]">
                  Review bids
                </h2>

                <p className="mt-3 text-[12px] leading-5 text-slate-500">
                  Compare offers from clearing agents and choose the one that best fits your shipment.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowBidReview(false)
                }
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>

            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[10px] font-bold uppercase text-slate-400">
                  Offers received
                </p>

                <p className="mt-1 text-[18px] font-bold text-[#173B6C]">
                  {bids.length}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[10px] font-bold uppercase text-slate-400">
                  Product
                </p>

                <p className="mt-1 truncate text-[12px] font-semibold text-slate-700">
                  {productDetails ||
                    "Your shipment"}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[10px] font-bold uppercase text-slate-400">
                  Destination
                </p>

                <p className="mt-1 text-[12px] font-semibold text-slate-700">
                  Colombo, Sri Lanka
                </p>
              </div>

            </div>

            {bids.length === 0 ? (

              <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#2563EB] shadow-sm">
                  <Clock3 size={22} />
                </div>

                <h3 className="mt-4 text-[16px] font-bold text-[#173B6C]">
                  Waiting for agent bids
                </h3>

                <p className="mx-auto mt-2 max-w-md text-[12px] leading-5 text-slate-500">
                  Your request has been posted. This window checks automatically for new agent bids.
                </p>

                <button
                  type="button"
                  onClick={loadBids}
                  className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[12px] font-bold text-[#173B6C] hover:bg-slate-50"
                >
                  Check for new bids
                </button>

              </div>

            ) : (

              <div className="mt-5 space-y-3">

                {bids.map(
                  (bid, index) => {

                    const total =
                      Number(
                        bid.totalFee ??
                          Number(
                            bid.clearanceFee ||
                              0
                          ) +
                            Number(
                              bid.additionalCharges ||
                                0
                            )
                      );

                    const id =
                      bid.id ||
                      bid.bidId ||
                      `bid-${index}`;

                    const selected =
                      selectedBid &&
                      (
                        selectedBid.id ||
                        selectedBid.bidId
                      ) === id;

                    return (
                      <article
                        key={id}
                        className={`rounded-2xl border p-4 sm:p-5 ${
                          selected
                            ? "border-[#2563EB] bg-blue-50/40 ring-2 ring-[#2563EB]/10"
                            : "border-slate-200 bg-white"
                        }`}
                      >

                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                          <div className="min-w-0 flex-1">

                            <div className="flex items-start gap-3">

                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
                                <Building2 size={18} />
                              </div>

                              <div className="min-w-0">

                                <div className="flex flex-wrap items-center gap-2">

                                  <h3 className="text-[15px] font-bold text-[#173B6C]">
                                    {bid.agencyName ||
                                      bid.companyName ||
                                      bid.name ||
                                      "Clearing Agency"}
                                  </h3>

                                  {(bid.verified ??
                                    true) && (
                                    <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">
                                      <ShieldCheck size={11} />
                                      Verified
                                    </span>
                                  )}

                                </div>

                                <p className="mt-1 text-[12px] text-slate-400">
                                  {bid.agentName ||
                                    bid.name ||
                                    "Clearing Agent"}

                                  {bid.location
                                    ? ` · ${bid.location}`
                                    : ""}
                                </p>

                              </div>

                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">

                              <div className="rounded-lg bg-slate-50 p-2.5">

                                <p className="text-[9px] uppercase text-slate-400">
                                  Clearance fee
                                </p>

                                <p className="mt-0.5 text-[12px] font-bold text-slate-700">
                                  USD{" "}
                                  {Number(
                                    bid.clearanceFee ||
                                      0
                                  ).toLocaleString()}
                                </p>

                              </div>

                              <div className="rounded-lg bg-slate-50 p-2.5">

                                <p className="text-[9px] uppercase text-slate-400">
                                  Additional
                                </p>

                                <p className="mt-0.5 text-[12px] font-bold text-slate-700">
                                  USD{" "}
                                  {Number(
                                    bid.additionalCharges ||
                                      0
                                  ).toLocaleString()}
                                </p>

                              </div>

                              <div className="rounded-lg bg-blue-50 p-2.5">

                                <p className="text-[9px] uppercase text-blue-500">
                                  Total offer
                                </p>

                                <p className="mt-0.5 text-[12px] font-bold text-[#173B6C]">
                                  USD{" "}
                                  {total.toLocaleString()}
                                </p>

                              </div>

                            </div>

                            <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-slate-500">

                              {bid.processingTime && (
                                <span className="flex items-center gap-1.5">
                                  <Clock3
                                    size={13}
                                    className="text-[#2563EB]"
                                  />
                                  {bid.processingTime}
                                </span>
                              )}

                              {bid.rating != null && (
                                <span className="flex items-center gap-1.5">
                                  <Star
                                    size={13}
                                    className="fill-amber-400 text-amber-400"
                                  />
                                  {bid.rating}
                                </span>
                              )}

                            </div>

                            {bid.message && (
                              <p className="mt-3 rounded-xl bg-slate-50 p-3 text-[11px] leading-5 text-slate-500">
                                {bid.message}
                              </p>
                            )}

                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              setSelectedBid(
                                bid
                              )
                            }
                            className={`shrink-0 rounded-xl px-4 py-3 text-[13px] font-bold ${
                              selected
                                ? "bg-[#2563EB] text-white"
                                : "border border-slate-200 bg-white text-[#173B6C] hover:bg-slate-50"
                            }`}
                          >
                            {selected
                              ? "Selected"
                              : "Choose This Agent"}
                          </button>

                        </div>

                      </article>
                    );
                  }
                )}

              </div>

            )}

            <div className="mt-5 flex flex-col-reverse gap-2 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">

              <button
                type="button"
                onClick={() =>
                  setShowBidReview(false)
                }
                className="rounded-xl border border-slate-200 px-4 py-3 text-[12px] font-bold text-slate-600 hover:bg-slate-50"
              >
                Back to Find Agents
              </button>

              {selectedBid && (
                <button
                  type="button"
                  onClick={handleAcceptBid}
                  disabled={isAccepting}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#173B6C] px-5 py-3 text-[12px] font-bold text-white hover:bg-[#12315B] disabled:opacity-60"
                >
                  <CheckCircle2 size={15} />

                  {isAccepting
                    ? "Accepting bid..."
                    : "Accept Bid & Continue"}
                </button>
              )}

            </div>

          </div>
        </Modal>
      )}

      {/* =====================================================
          PROFILE MODAL
      ====================================================== */}

      {showProfile &&
        selectedAgent && (

          <Modal
            onClose={() =>
              setShowProfile(false)
            }
          >

            <div className="p-5 sm:p-6">

              <div className="flex items-start justify-between gap-4">

                <div className="flex gap-3">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
                    <Building2 size={20} />
                  </div>

                  <div>

                    <div className="flex flex-wrap items-center gap-2">

                      <h2 className="text-[18px] font-bold text-[#173B6C]">
                        {selectedAgent.agencyName}
                      </h2>

                      {selectedAgent.verified && (
                        <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">
                          <ShieldCheck size={11} />
                          Verified
                        </span>
                      )}

                    </div>

                    <p className="mt-1 text-[13px] text-slate-400">
                      {selectedAgent.agentName}
                    </p>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowProfile(false)
                  }
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
                >
                  <X size={18} />
                </button>

              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">

                <StatBox
                  icon={Star}
                  value={selectedAgent.rating}
                  label={`${selectedAgent.reviews} reviews`}
                />

                <StatBox
                  icon={BriefcaseBusiness}
                  value={`${selectedAgent.experience} yrs`}
                  label="Experience"
                />

                <StatBox
                  icon={Package}
                  value={selectedAgent.shipments}
                  label="Shipments"
                />

                <StatBox
                  icon={MapPin}
                  value={selectedAgent.location}
                  label="Location"
                />

              </div>

              <div className="mt-5">

                <h3 className="text-[14px] font-bold text-slate-800">
                  About this agent
                </h3>

                <p className="mt-2 text-[13px] leading-5 text-slate-500">
                  {selectedAgent.description}
                </p>

              </div>

              <div className="mt-5">

                <h3 className="text-[14px] font-bold text-slate-800">
                  Import specializations
                </h3>

                <div className="mt-2 flex flex-wrap gap-2">

                  {selectedAgent.categories.map(
                    (category) => (
                      <span
                        key={category}
                        className="rounded-full bg-blue-50 px-2.5 py-1 text-[12px] font-semibold text-[#2563EB]"
                      >
                        {category}
                      </span>
                    )
                  )}

                </div>

              </div>

              <div className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 p-3">

                <Clock3
                  size={16}
                  className="text-emerald-600"
                />

                <p className="text-[13px] font-semibold text-emerald-700">
                  {selectedAgent.responseTime}
                </p>

              </div>

              <div className="mt-5 flex flex-col gap-2 sm:flex-row">

                <button
                  type="button"
                  onClick={() => {
                    setShowProfile(false);
                    setShowRequestForm(true);
                  }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#173B6C] px-4 py-3 text-[13px] font-bold text-white transition hover:bg-[#12315B]"
                >
                  <Send size={15} />
                  Request a Quote
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setShowProfile(false)
                  }
                  className="rounded-xl border border-slate-200 px-5 py-3 text-[13px] font-bold text-slate-600 hover:bg-slate-50"
                >
                  Close
                </button>

              </div>

            </div>

          </Modal>
        )}

      {/* =====================================================
          REQUEST MODAL
      ====================================================== */}

      {showRequestForm && (

        <Modal
          onClose={() =>
            setShowRequestForm(false)
          }
        >

          <form
            onSubmit={createShipmentRequest}
            className="p-5 sm:p-6"
          >

            <div className="flex items-start justify-between gap-4">

              <div>

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-[#2563EB]">

                  {selectedAgent ? (
                    <Send size={18} />
                  ) : (
                    <Package size={18} />
                  )}

                </div>

                <h2 className="mt-4 text-[19px] font-bold text-[#173B6C]">

                  {selectedAgent
                    ? "Request a quote"
                    : "Post your shipment request"}

                </h2>

                <p className="mt-1 max-w-lg text-[12px] leading-5 text-slate-400">

                  {selectedAgent
                    ? `Send your shipment details to ${selectedAgent.agencyName}.`
                    : "Provide your shipment details and let clearing agents send you bids."}

                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowRequestForm(false)
                }
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>

            </div>

            {selectedAgent && (

              <div className="mt-5 flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 p-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#2563EB]">
                  <Building2 size={17} />
                </div>

                <div>

                  <p className="text-[14px] font-bold text-[#173B6C]">
                    {selectedAgent.agencyName}
                  </p>

                  <p className="mt-0.5 text-[12px] text-slate-400">
                    {selectedAgent.location} ·{" "}
                    {selectedAgent.experience}{" "}
                    years experience
                  </p>

                </div>

                <CheckCircle2
                  size={17}
                  className="ml-auto text-emerald-500"
                />

              </div>

            )}

            <div className="mt-5 space-y-4">

              <FormField
                label="What are you importing?"
                required
              >

                <textarea
                  value={productDetails}
                  onChange={(e) =>
                    setProductDetails(
                      e.target.value
                    )
                  }
                  rows={3}
                  placeholder="e.g. 50 laptops and computer accessories"
                  className="w-full resize-none rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-[13px] font-medium text-slate-800 outline-none transition focus:border-[#173B6C] focus:ring-2 focus:ring-[#173B6C]/10"
                />

              </FormField>

              <FormField
                label="Country or city of origin"
                required
              >

                <input
                  type="text"
                  value={origin}
                  onChange={(e) =>
                    setOrigin(
                      e.target.value
                    )
                  }
                  placeholder="e.g. China"
                  className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-[13px] font-medium text-slate-800 outline-none transition focus:border-[#173B6C] focus:ring-2 focus:ring-[#173B6C]/10"
                />

              </FormField>

              <FormField
                label="Declared value"
                required
              >

                <div className="relative">

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={declaredValue}
                    onChange={(e) =>
                      setDeclaredValue(
                        e.target.value
                      )
                    }
                    placeholder="e.g. 15000"
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 pr-16 text-[13px] font-medium text-slate-800 outline-none transition focus:border-[#173B6C] focus:ring-2 focus:ring-[#173B6C]/10"
                  />

                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400">
                    USD
                  </span>

                </div>

              </FormField>

            </div>

            <div className="mt-5 flex gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3">

              <ShieldCheck
                size={16}
                className="mt-0.5 shrink-0 text-[#2563EB]"
              />

              <p className="text-[11px] leading-5 text-slate-500">

                {selectedAgent
                  ? "The selected agent will receive these shipment details to prepare a quote."
                  : "Your request will be shared with clearing agents so they can review it and submit bids."}

              </p>

            </div>

            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() =>
                  setShowRequestForm(false)
                }
                className="rounded-xl border border-slate-200 px-5 py-3 text-[13px] font-bold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#173B6C] px-5 py-3 text-[13px] font-bold text-white transition hover:bg-[#12315B]"
              >

                <Send size={15} />

                {selectedAgent
                  ? "Send Quote Request"
                  : "Find Agents & Get Bids"}

              </button>

            </div>

          </form>

        </Modal>

      )}

    </div>
  );
}

/* =========================================================
   FILTER SELECT
========================================================= */

function FilterSelect({
  label,
  value,
  onChange,
  options,
}) {
  return (
    <div>

      <label className="mb-1.5 block text-[12px] font-bold text-slate-600">
        {label}
      </label>

      <div className="relative">

        <select
          value={value}
          onChange={(e) =>
            onChange(
              e.target.value
            )
          }
          className="h-10 w-full appearance-none rounded-xl border border-slate-300 bg-white px-3 pr-8 text-[12px] font-semibold text-slate-700 outline-none transition focus:border-[#173B6C] focus:ring-2 focus:ring-[#173B6C]/10"
        >

          {options.map(
            (option) => (
              <option
                key={option}
                value={option}
              >
                {option}
              </option>
            )
          )}

        </select>

        <ChevronDown
          size={15}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

      </div>

    </div>
  );
}

/* =========================================================
   AGENT CARD
========================================================= */

function AgentCard({
  agent,
  delay,
  selected,
  onViewProfile,
  onRequestQuote,
  onSelectAgent,
}) {
  return (
    <article
      className={`fade-up agent-delay-${Math.min(
        delay + 1,
        5
      )} rounded-2xl border bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,.025)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(15,23,42,.06)] ${
        selected
          ? "border-[#2563EB] ring-2 ring-[#2563EB]/10"
          : "border-slate-200 hover:border-slate-300"
      }`}
    >

      {/* HEADER */}

      <div className="flex items-start justify-between gap-3">

        <div className="flex min-w-0 gap-3">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
            <Building2 size={20} />
          </div>

          <div className="min-w-0">

            <div className="flex flex-wrap items-center gap-1.5">

              {/* INCREASED AGENCY NAME */}
              <h3 className="truncate text-[16px] font-bold text-[#173B6C]">
                {agent.agencyName}
              </h3>

              {agent.verified && (
                <ShieldCheck
                  size={16}
                  className="shrink-0 text-emerald-500"
                />
              )}

            </div>

            {/* INCREASED AGENT NAME */}
            <p className="mt-1 text-[12px] text-slate-400">
              {agent.agentName}
            </p>

          </div>

        </div>

        <div className="flex shrink-0 items-center gap-1 rounded-lg bg-amber-50 px-2 py-1">

          <Star
            size={14}
            className="fill-amber-400 text-amber-400"
          />

          <span className="text-[12px] font-bold text-amber-700">
            {agent.rating}
          </span>

        </div>

      </div>

      {/* VERIFIED */}

      <div className="mt-3 flex items-center gap-2">

        {agent.verified && (
          <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-700">

            <CheckCircle2 size={12} />

            Verified agent

          </span>
        )}

        <span className="text-[12px] text-slate-400">
          {agent.reviews} reviews
        </span>

      </div>

      {/* DETAILS */}

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">

        <AgentInfo
          icon={MapPin}
          label="Location"
          value={agent.location}
        />

        <AgentInfo
          icon={BriefcaseBusiness}
          label="Experience"
          value={`${agent.experience} years`}
        />

        <AgentInfo
          icon={Package}
          label="Completed"
          value={`${agent.shipments} shipments`}
        />

        <AgentInfo
          icon={Clock3}
          label="Response"
          value={agent.responseTime.replace(
            "Usually responds within ",
            ""
          )}
        />

      </div>

      {/* DESCRIPTION */}

      <p className="mt-4 text-[13px] leading-5 text-slate-500">
        {agent.description}
      </p>

      {/* SPECIALIZATIONS */}

      <div className="mt-3">

        <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-400">
          Specializations
        </p>

        <div className="flex flex-wrap gap-1.5">

          {agent.categories.map(
            (category) => (
              <span
                key={category}
                className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-500"
              >
                {category}
              </span>
            )
          )}

        </div>

      </div>

      {/* ACTIONS */}

      <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">

        <button
          type="button"
          onClick={() =>
            onViewProfile(agent)
          }
          className="rounded-xl border border-slate-200 px-3 py-2.5 text-[13px] font-bold text-[#173B6C] transition hover:border-slate-300 hover:bg-slate-50"
        >
          View Profile
        </button>

        <button
          type="button"
          onClick={() =>
            onSelectAgent(agent)
          }
          className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-[13px] font-bold transition ${
            selected
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "bg-[#173B6C] text-white hover:bg-[#12315B]"
          }`}
        >

          {selected ? (
            <>
              <CheckCircle2 size={15} />
              Selected
            </>
          ) : (
            <>
              Request Quote
              <ArrowRight size={15} />
            </>
          )}

        </button>

      </div>

    </article>
  );
}

/* =========================================================
   AGENT INFO
========================================================= */

function AgentInfo({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-2.5 py-2">

      <Icon
        size={15}
        className="shrink-0 text-[#2563EB]"
      />

      <div className="min-w-0">

        <p className="text-[10px] uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-0.5 truncate text-[12px] font-semibold text-slate-600">
          {value}
        </p>

      </div>

    </div>
  );
}

/* =========================================================
   INFO CARD
========================================================= */

function InfoCard({
  icon: Icon,
  title,
  text,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,.02)]">

      <div className="flex gap-3">

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#2563EB]">
          <Icon size={17} />
        </div>

        <div>

          <h3 className="text-[13px] font-bold text-slate-800">
            {title}
          </h3>

          <p className="mt-1 text-[10px] leading-4 text-slate-400">
            {text}
          </p>

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   STAT BOX
========================================================= */

function StatBox({
  icon: Icon,
  value,
  label,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">

      <Icon
        size={16}
        className="mx-auto text-[#2563EB]"
      />

      <p className="mt-1.5 text-[14px] font-bold text-[#173B6C]">
        {value}
      </p>

      <p className="mt-0.5 text-[10px] text-slate-400">
        {label}
      </p>

    </div>
  );
}

/* =========================================================
   FORM FIELD
========================================================= */

function FormField({
  label,
  required,
  children,
}) {
  return (
    <div>

      <label className="mb-1.5 block text-[12px] font-bold text-slate-700">

        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}

      </label>

      {children}

    </div>
  );
}

/* =========================================================
   MODAL
========================================================= */

function Modal({
  children,
  onClose,
  wide = false,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">

      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      <div
        className={`relative z-10 max-h-[92vh] w-full overflow-y-auto rounded-2xl bg-white shadow-2xl ${
          wide
            ? "max-w-5xl"
            : "max-w-xl"
        }`}
      >
        {children}
      </div>

    </div>
  );
}

export default FindAgent;