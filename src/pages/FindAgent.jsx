import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Package,
  Globe2,
  DollarSign,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  Laptop,
  Shirt,
  Car,
  Apple,
  Factory,
  Pill,
  Home,
  ShoppingBag,
  X,
} from "lucide-react";

import AppNavbar from "../components/ui/AppNavbar";
import BackButton from "../components/ui/BackButton";

function FindAgent() {
  const navigate = useNavigate();

  const [productDetails, setProductDetails] = useState("");
  const [origin, setOrigin] = useState("");
  const [declaredValue, setDeclaredValue] = useState("");

  // Category browser
  const [showCategories, setShowCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  /* =========================================================
     CATEGORIES
  ========================================================= */

  const categories = [
    {
      id: "electronics",
      name: "Electronics",
      description: "Computers, phones, devices",
      icon: Laptop,
      examples: "Laptops, phones, accessories",
    },
    {
      id: "textiles",
      name: "Textiles & Apparel",
      description: "Clothing and fabrics",
      icon: Shirt,
      examples: "Clothing, fabric, garments",
    },
    {
      id: "automotive",
      name: "Automotive",
      description: "Vehicles and parts",
      icon: Car,
      examples: "Spare parts, vehicles, tyres",
    },
    {
      id: "food",
      name: "Food & Agriculture",
      description: "Food and agricultural goods",
      icon: Apple,
      examples: "Food, fruits, grains",
    },
    {
      id: "machinery",
      name: "Machinery",
      description: "Industrial equipment",
      icon: Factory,
      examples: "Machines, equipment, tools",
    },
    {
      id: "pharmaceuticals",
      name: "Pharmaceuticals",
      description: "Medical and pharmaceutical goods",
      icon: Pill,
      examples: "Medical supplies, medicines",
    },
    {
      id: "household",
      name: "Household Goods",
      description: "Home and kitchen products",
      icon: Home,
      examples: "Furniture, kitchen items",
    },
    {
      id: "other",
      name: "Other Goods",
      description: "Other imported products",
      icon: ShoppingBag,
      examples: "General merchandise",
    },
  ];

  /* =========================================================
     CATEGORY SELECT
  ========================================================= */

  const handleCategorySelect = (category) => {
    setSelectedCategory(category.name);

    // Automatically put a useful starting value into product field
    if (!productDetails.trim()) {
      setProductDetails(`${category.name} - `);
    }

    setShowCategories(false);
  };

  /* =========================================================
     SUBMIT SHIPMENT REQUEST
  ========================================================= */

  const handleSubmit = (e) => {
    if (e) {
      e.preventDefault();
    }

    /* =======================================================
       VALIDATION
    ======================================================= */

    const cleanProduct = productDetails.trim();
    const cleanOrigin = origin.trim();
    const numericValue = Number(declaredValue);

    if (!cleanProduct) {
      alert("Please enter what you are importing.");
      return;
    }

    if (!cleanOrigin) {
      alert("Please enter the country or city of origin.");
      return;
    }

    if (!numericValue || numericValue <= 0) {
      alert("Please enter a valid declared value.");
      return;
    }

    /* =======================================================
       GET CURRENT IMPORT
    ======================================================= */

    let currentImport = null;

    try {
      currentImport = JSON.parse(
        localStorage.getItem("currentImport") || "null"
      );
    } catch {
      currentImport = null;
    }

    /* =======================================================
       CREATE UNIQUE REQUEST ID
    ======================================================= */

    const requestId = `REQ-${Date.now()}`;
    const createdAt = new Date().toISOString();

    const finalCategory =
      selectedCategory ||
      currentImport?.category ||
      "General";

    /* =======================================================
       CREATE SME SHIPMENT REQUEST
    ======================================================= */

    const shipmentRequest = {
      id: requestId,
      requestId,

      productDetails: cleanProduct,
      product: cleanProduct,

      origin: cleanOrigin,

      declaredValue: numericValue,
      shipmentValue: numericValue,

      hsCode: currentImport?.hsCode || "",

      category: finalCategory,

      destination: "Colombo, Sri Lanka",

      urgency: "Medium",
      status: "Open",

      createdAt,
    };

    /* =======================================================
       SAVE SME REQUEST
    ======================================================= */

    localStorage.setItem(
      "shipmentRequest",
      JSON.stringify(shipmentRequest)
    );

    /* =======================================================
       GET EXISTING MARKETPLACE REQUESTS
    ======================================================= */

    let existingRequests = [];

    try {
      existingRequests = JSON.parse(
        localStorage.getItem("marketplaceRequests") || "[]"
      );

      if (!Array.isArray(existingRequests)) {
        existingRequests = [];
      }
    } catch {
      existingRequests = [];
    }

    /* =======================================================
       CREATE MARKETPLACE REQUEST
    ======================================================= */

    const marketplaceRequest = {
      id: requestId,
      requestId,

      product: cleanProduct,
      productDetails: cleanProduct,
      description: cleanProduct,

      hsCode: currentImport?.hsCode || "Not classified",

      category: finalCategory,

      origin: cleanOrigin,
      destination: "Colombo, Sri Lanka",

      shipmentValue: numericValue,
      declaredValue: numericValue,

      requestedDate: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .split("T")[0],

      urgency: "Medium",
      status: "Open",

      hasBid: false,

      createdAt,
    };

    /* =======================================================
       ADD REQUEST TO MARKETPLACE
    ======================================================= */

    const updatedRequests = [
      marketplaceRequest,
      ...existingRequests.filter(
        (request) => request.id !== requestId
      ),
    ];

    localStorage.setItem(
      "marketplaceRequests",
      JSON.stringify(updatedRequests)
    );

    /* =======================================================
       SAVE CURRENT MARKETPLACE REQUEST
    ======================================================= */

    localStorage.setItem(
      "currentMarketplaceRequest",
      JSON.stringify(marketplaceRequest)
    );

    /* =======================================================
       SAVE CURRENT REQUEST ID
    ======================================================= */

    localStorage.setItem(
      "currentRequestId",
      requestId
    );

    /* =======================================================
       REMOVE BIDS FROM OLD REQUEST
    ======================================================= */

    let existingBids = [];

    try {
      existingBids = JSON.parse(
        localStorage.getItem("agentBids") || "[]"
      );

      if (!Array.isArray(existingBids)) {
        existingBids = [];
      }
    } catch {
      existingBids = [];
    }

    const cleanedBids = existingBids.filter(
      (bid) => bid.requestId !== requestId
    );

    localStorage.setItem(
      "agentBids",
      JSON.stringify(cleanedBids)
    );

    /* =======================================================
       NAVIGATE TO REVIEW BIDS
    ======================================================= */

    navigate("/review-bids");
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-900">

      {/* =====================================================
          ANIMATIONS
      ====================================================== */}

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

        @keyframes categoryOpen {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulseSoft {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(23, 59, 108, 0);
          }

          50% {
            box-shadow: 0 0 0 6px rgba(23, 59, 108, 0.05);
          }
        }

        .fade-up {
          animation:
            fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1)
            both;
        }

        .scale-in {
          animation:
            scaleIn 0.35s cubic-bezier(0.22, 1, 0.36, 1)
            both;
        }

        .slide-down {
          animation:
            slideDown 0.25s cubic-bezier(0.22, 1, 0.36, 1)
            both;
        }

        .category-open {
          animation:
            categoryOpen 0.25s cubic-bezier(0.22, 1, 0.36, 1)
            both;
        }

        .pulse-soft {
          animation:
            pulseSoft 2.5s ease-in-out infinite;
        }

        .calculator-delay-1 {
          animation-delay: 0.05s;
        }

        .calculator-delay-2 {
          animation-delay: 0.1s;
        }

        .calculator-delay-3 {
          animation-delay: 0.15s;
        }

        .calculator-delay-4 {
          animation-delay: 0.2s;
        }

        .calculator-delay-5 {
          animation-delay: 0.25s;
        }

        @media (prefers-reduced-motion: reduce) {
          .fade-up,
          .scale-in,
          .slide-down,
          .category-open,
          .pulse-soft {
            animation: none;
          }
        }
      `}</style>

      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <AppNavbar />

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <main className="mx-auto w-full max-w-[1000px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">

        {/* ===================================================
            BACK BUTTON
        ==================================================== */}

        <div className="fade-up mb-6">
          <BackButton current="Find Agent" />
        </div>

        {/* ===================================================
            PAGE HEADER
        ==================================================== */}

        <section className="fade-up calculator-delay-1 mb-8">

          <div className="flex flex-col items-center justify-center text-center">

            {/* BADGE */}

            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5">

              <Sparkles
                size={13}
                className="text-blue-600"
                strokeWidth={2}
              />

              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-700">
                Shipment request
              </span>

            </div>

            {/* TITLE */}

            <h1 className="text-[28px] font-bold tracking-[-0.04em] text-[#14213D] sm:text-[40px]">
              Find a Clearing Agent
            </h1>

            {/* DESCRIPTION */}

            <p className="mx-auto mt-2 max-w-2xl text-[13px] leading-6 text-slate-500 sm:text-sm">
              Tell us about your shipment and receive
              competitive bids from licensed customs agents
              within hours.
            </p>

            {/* STATUS */}

            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5">

              <CheckCircle2
                size={14}
                className="text-emerald-600"
              />

              <span className="text-[10px] font-semibold text-emerald-700">
                Free to post
              </span>

            </div>

          </div>

        </section>

        {/* ===================================================
            PROGRESS BAR
        ==================================================== */}

        <section className="fade-up calculator-delay-2 mx-auto mb-7 w-full max-w-[760px] rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-[0_2px_8px_rgba(15,23,42,.02)]">

          <div className="flex items-center">

            {/* STEP 1 */}

            <div className="flex shrink-0 items-center gap-2">

              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#173B6C] text-[11px] font-bold text-white shadow-sm">
                1
              </div>

              <span className="hidden text-[11px] font-semibold text-[#173B6C] sm:block">
                Describe Shipment
              </span>

            </div>

            <div className="mx-2 h-px flex-1 bg-slate-200" />

            {/* STEP 2 */}

            <div className="flex shrink-0 items-center gap-2">

              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-400">
                2
              </div>

              <span className="hidden text-[11px] font-medium text-slate-400 sm:block">
                Review Bids
              </span>

            </div>

            <div className="mx-2 h-px flex-1 bg-slate-200" />

            {/* STEP 3 */}

            <div className="flex shrink-0 items-center gap-2">

              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-400">
                3
              </div>

              <span className="hidden text-[11px] font-medium text-slate-400 sm:block">
                Accept & Clear
              </span>

            </div>

          </div>

        </section>

        {/* ===================================================
            INFO BANNER
        ==================================================== */}

        <div className="fade-up calculator-delay-3 mb-6 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3.5">

          <ShieldCheck
            size={16}
            className="mt-0.5 shrink-0 text-blue-600"
          />

          <div>

            <p className="text-[10px] font-bold text-blue-800">
              Connect with clearing agents
            </p>

            <p className="mt-1 text-[11px] leading-5 text-blue-700">
              Provide accurate shipment details so
              clearing agents can understand your
              requirements and send a suitable bid.
            </p>

          </div>

        </div>

        {/* ===================================================
            FORM CARD
        ==================================================== */}

        <section className="fade-up calculator-delay-4 scale-in rounded-2xl border border-slate-200 bg-white shadow-[0_2px_14px_rgba(15,23,42,.025)]">

          {/* =================================================
              CARD HEADER
          ================================================== */}

          <div className="border-b border-slate-100 px-5 py-5 sm:px-6">

            <div className="flex items-start justify-between gap-4">

              <div>

                <div className="flex items-center gap-2">

                  <h2 className="text-sm font-bold text-[#14213D]">
                    Shipment details
                  </h2>

                  <div className="hidden rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-semibold text-slate-500 sm:block">
                    Step 1 of 3
                  </div>

                </div>

                <p className="mt-1 text-[11px] leading-5 text-slate-500">
                  Give agents enough detail to send you
                  an accurate bid.
                </p>

              </div>

              <div className="pulse-soft hidden h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 sm:flex">

                <Package
                  size={16}
                  strokeWidth={1.8}
                />

              </div>

            </div>

          </div>

          {/* =================================================
              FORM
          ================================================== */}

          <form
            onSubmit={handleSubmit}
            className="p-5 sm:p-6"
          >

            {/* =================================================
                CATEGORY BROWSER
            ================================================== */}

            <div className="slide-down calculator-delay-1 mb-6">

              <div className="rounded-xl border border-slate-200 bg-slate-50/70">

                {/* CATEGORY DROPDOWN HEADER */}

                <button
                  type="button"
                  onClick={() =>
                    setShowCategories(!showCategories)
                  }
                  className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition hover:bg-slate-100/70"
                >

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <Package size={17} />
                    </div>

                    <div>

                      <div className="flex items-center gap-2">

                        <span className="text-xs font-bold text-[#14213D]">
                          Browse by Category
                        </span>

                        <span className="rounded-full bg-white px-2 py-0.5 text-[9px] font-semibold text-slate-400">
                          Optional
                        </span>

                      </div>

                      <p className="mt-0.5 text-[10px] text-slate-400">
                        Choose a category to describe your shipment faster
                      </p>

                    </div>

                  </div>

                  <ChevronDown
                    size={17}
                    className={`shrink-0 text-slate-400 transition-transform duration-200 ${
                      showCategories
                        ? "rotate-180"
                        : ""
                    }`}
                  />

                </button>

                {/* CATEGORY LIST */}

                {showCategories && (

                  <div className="category-open border-t border-slate-200 p-3">

                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">

                      {categories.map((category) => {

                        const Icon = category.icon;

                        const isSelected =
                          selectedCategory ===
                          category.name;

                        return (
                          <button
                            key={category.id}
                            type="button"
                            onClick={() =>
                              handleCategorySelect(category)
                            }
                            className={`group rounded-xl border p-3 text-left transition-all duration-200 ${
                              isSelected
                                ? "border-[#173B6C] bg-blue-50 shadow-sm"
                                : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-sm"
                            }`}
                          >

                            <div className="flex items-start justify-between">

                              <div
                                className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                                  isSelected
                                    ? "bg-[#173B6C] text-white"
                                    : "bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600"
                                }`}
                              >
                                <Icon size={15} />
                              </div>

                              {isSelected && (
                                <CheckCircle2
                                  size={15}
                                  className="text-[#173B6C]"
                                />
                              )}

                            </div>

                            <p className="mt-2 text-[11px] font-bold text-[#14213D]">
                              {category.name}
                            </p>

                            <p className="mt-0.5 text-[9px] leading-4 text-slate-400">
                              {category.description}
                            </p>

                            <p className="mt-1 text-[9px] leading-4 text-slate-400">
                              {category.examples}
                            </p>

                          </button>
                        );
                      })}

                    </div>

                  </div>
                )}

              </div>

              {/* SELECTED CATEGORY */}

              {selectedCategory && (

                <div className="mt-2 flex items-center justify-between rounded-lg border border-blue-100 bg-blue-50 px-3 py-2">

                  <div className="flex items-center gap-2">

                    <CheckCircle2
                      size={13}
                      className="text-blue-600"
                    />

                    <span className="text-[10px] font-semibold text-blue-700">
                      Selected category:
                    </span>

                    <span className="text-[10px] font-bold text-blue-800">
                      {selectedCategory}
                    </span>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedCategory("")
                    }
                    className="rounded-md p-1 text-blue-500 transition hover:bg-blue-100 hover:text-blue-700"
                    aria-label="Clear selected category"
                  >
                    <X size={13} />
                  </button>

                </div>

              )}

            </div>

            {/* =================================================
                PRODUCT
            ================================================== */}

            <div className="slide-down calculator-delay-2 mb-5">

              <label
                htmlFor="productDetails"
                className="mb-1 flex items-center gap-1.5 text-[10px] font-bold text-[#14213D]"
              >

                <Package size={13} />

                What are you importing?

              </label>

              <p className="mb-2 text-[10px] text-slate-400">
                Product name and quantity
              </p>

              <input
                id="productDetails"
                type="text"
                value={productDetails}
                onChange={(e) =>
                  setProductDetails(e.target.value)
                }
                placeholder="e.g. Laptop computers - 50 units"
                aria-label="What are you importing"
                className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-xs hover:border-slate-400 focus:border-[#173B6C] focus:ring-4 focus:ring-[#173B6C]/10"
                required
              />

            </div>

            {/* =================================================
                ORIGIN
            ================================================== */}

            <div className="slide-down calculator-delay-3 mb-5">

              <label
                htmlFor="origin"
                className="mb-1 flex items-center gap-1.5 text-[10px] font-bold text-[#14213D]"
              >

                <Globe2 size={13} />

                Where is it coming from?

              </label>

              <p className="mb-2 text-[10px] text-slate-400">
                Country or city of origin
              </p>

              <input
                id="origin"
                type="text"
                value={origin}
                onChange={(e) =>
                  setOrigin(e.target.value)
                }
                placeholder="e.g. Shenzhen, China"
                aria-label="Where is it coming from"
                className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-xs hover:border-slate-400 focus:border-[#173B6C] focus:ring-4 focus:ring-[#173B6C]/10"
                required
              />

            </div>

            {/* =================================================
                DECLARED VALUE
            ================================================== */}

            <div className="slide-down calculator-delay-4">

              <label
                htmlFor="declaredValue"
                className="mb-1 flex items-center gap-1.5 text-[10px] font-bold text-[#14213D]"
              >

                <DollarSign size={13} />

                Declared value (USD)

              </label>

              <p className="mb-2 text-[10px] text-slate-400">
                The value stated on the commercial invoice
              </p>

              <div className="relative">

                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                  $
                </span>

                <input
                  id="declaredValue"
                  type="number"
                  min="1"
                  step="0.01"
                  value={declaredValue}
                  onChange={(e) =>
                    setDeclaredValue(e.target.value)
                  }
                  placeholder="e.g. 42500"
                  aria-label="Declared value in USD"
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-8 pr-4 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-xs hover:border-slate-400 focus:border-[#173B6C] focus:ring-4 focus:ring-[#173B6C]/10"
                  required
                />

              </div>

            </div>

          </form>

        </section>

        {/* ===================================================
            BOTTOM NAVIGATION
        ==================================================== */}

        <div className="fade-up calculator-delay-5 mt-7 flex flex-col-reverse items-stretch justify-between gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center">

          {/* BACK */}

          <Link
            to="/import-calculator"
            className="flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 sm:justify-start"
          >

            <ArrowLeft size={16} />

            Back to Import Calculator

          </Link>

          {/* CONTINUE */}

          <button
            type="button"
            onClick={handleSubmit}
            className="group flex items-center justify-center gap-2 rounded-xl bg-[#173B6C] px-6 py-3 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(23,59,108,.12)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#12315B] hover:shadow-[0_10px_24px_rgba(23,59,108,.18)]"
          >

            Continue to Review Bids

            <ArrowRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            />

          </button>

        </div>

        {/* ===================================================
            FOOTER NOTE
        ==================================================== */}

        <div className="fade-up mt-6 flex items-center justify-center gap-2 text-center text-[10px] text-slate-400">

          <ShieldCheck
            size={13}
            className="text-emerald-600"
          />

          <span>
            Your shipment details are only shared with agents
            you choose to work with.
          </span>

        </div>

      </main>

    </div>
  );
}

export default FindAgent;