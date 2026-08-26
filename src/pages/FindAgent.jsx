import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Package,
  Globe2,
  DollarSign,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import AppNavbar from "../components/ui/AppNavbar";
import BackButton from "../components/ui/BackButton";

function FindAgent() {
  const navigate = useNavigate();

  const [productDetails, setProductDetails] = useState("");
  const [origin, setOrigin] = useState("");
  const [declaredValue, setDeclaredValue] = useState("");

  /* =========================================================
     SUBMIT SHIPMENT REQUEST
  ========================================================= */

  const handleSubmit = (e) => {
    e.preventDefault();

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
       
       This contains information created earlier in the SME
       import flow, such as HS code and category.
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

      category: currentImport?.category || "General",

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
       
       This is what Clearing Agents will see inside:
       
       Agent Dashboard
       ↓
       Agent Marketplace
       ↓
       View Request
       ↓
       Submit Bid
    ======================================================= */

    const marketplaceRequest = {
      id: requestId,

      requestId,

      product: cleanProduct,

      productDetails: cleanProduct,

      description: cleanProduct,

      hsCode: currentImport?.hsCode || "Not classified",

      category: currentImport?.category || "General",

      origin: cleanOrigin,

      destination: "Colombo, Sri Lanka",

      shipmentValue: numericValue,

      declaredValue: numericValue,

      /*
       * For the prototype, agents are given a required-by
       * date seven days from today.
       */

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
       
       Put the newest request at the top.
       Also prevent duplicate request IDs.
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
       IMPORTANT:
       REMOVE BIDS FROM AN OLD REQUEST
       
       Without this, the SME could create a new shipment
       and accidentally see bids belonging to an older
       shipment.
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

    /*
     * Keep bids belonging to other requests.
     * The new request starts with zero bids.
     */

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
            transform: translateY(12px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.96);
          }

          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .fade-up {
          animation: fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .scale-in {
          animation: scaleIn 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @media (prefers-reduced-motion: reduce) {
          .fade-up,
          .scale-in {
            animation: none;
          }
        }
      `}</style>

      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <AppNavbar />

      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="mx-auto w-full max-w-[720px] px-5 py-8 sm:px-8 lg:py-10">

        {/* ===================================================
            BACK BUTTON
        ==================================================== */}

        <div className="mb-6">
          <BackButton current="Find Agent" />
        </div>

        {/* ===================================================
            PAGE HEADER
        ==================================================== */}

        <section className="fade-up mb-8 text-center">

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

          <h1 className="text-[28px] font-bold tracking-[-0.04em] text-[#14213D] sm:text-[32px]">
            Find a Clearing Agent
          </h1>

          <p className="mx-auto mt-2 max-w-md text-[13px] leading-6 text-slate-500 sm:text-sm">
            Tell us about your shipment and receive competitive
            bids from licensed customs agents within hours.
          </p>

        </section>

        {/* ===================================================
            PROGRESS
        ==================================================== */}

        <section className="fade-up mb-7 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,.02)] sm:p-5">

          <div className="flex items-center">

            {/* STEP 1 */}

            <div className="flex shrink-0 items-center gap-2">

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#173B6C] text-xs font-bold text-white shadow-sm">
                1
              </div>

              <span className="hidden text-xs font-semibold text-[#173B6C] sm:block">
                Describe Shipment
              </span>

            </div>

            <div className="mx-2 h-px flex-1 bg-slate-200" />

            {/* STEP 2 */}

            <div className="flex shrink-0 items-center gap-2">

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-400">
                2
              </div>

              <span className="hidden text-xs font-medium text-slate-400 sm:block">
                Review Bids
              </span>

            </div>

            <div className="mx-2 h-px flex-1 bg-slate-200" />

            {/* STEP 3 */}

            <div className="flex shrink-0 items-center gap-2">

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-400">
                3
              </div>

              <span className="hidden text-xs font-medium text-slate-400 sm:block">
                Accept & Clear
              </span>

            </div>

          </div>

        </section>

        {/* ===================================================
            FORM CARD
        ==================================================== */}

        <section className="fade-up scale-in rounded-2xl border border-slate-200 bg-white shadow-[0_2px_14px_rgba(15,23,42,.025)]">

          {/* CARD HEADER */}

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
                  Give agents enough detail to send you an
                  accurate bid.
                </p>

              </div>

              <div className="hidden h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 sm:flex">

                <Package
                  size={15}
                  strokeWidth={1.8}
                />

              </div>

            </div>

          </div>

          {/* FORM BODY */}

          <form
            onSubmit={handleSubmit}
            className="p-5 sm:p-6"
          >

            {/* =================================================
                PRODUCT
            ================================================== */}

            <div className="mb-5">

              <label className="mb-1 flex items-center gap-1.5 text-xs font-bold text-[#14213D]">

                <Package size={13} />

                What are you importing?

              </label>

              <p className="mb-2 text-[10px] text-slate-400">
                Product name and quantity
              </p>

              <input
                type="text"
                value={productDetails}
                onChange={(e) =>
                  setProductDetails(e.target.value)
                }
                placeholder="e.g. Laptop computers - 50 units"
                aria-label="What are you importing"
                className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-400 focus:border-[#173B6C] focus:ring-4 focus:ring-[#173B6C]/10"
                required
              />

            </div>

            {/* =================================================
                ORIGIN
            ================================================== */}

            <div className="mb-5">

              <label className="mb-1 flex items-center gap-1.5 text-xs font-bold text-[#14213D]">

                <Globe2 size={13} />

                Where is it coming from?

              </label>

              <p className="mb-2 text-[10px] text-slate-400">
                Country or city of origin
              </p>

              <input
                type="text"
                value={origin}
                onChange={(e) =>
                  setOrigin(e.target.value)
                }
                placeholder="e.g. Shenzhen, China"
                aria-label="Where is it coming from"
                className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-400 focus:border-[#173B6C] focus:ring-4 focus:ring-[#173B6C]/10"
                required
              />

            </div>

            {/* =================================================
                DECLARED VALUE
            ================================================== */}

            <div className="mb-6">

              <label className="mb-1 flex items-center gap-1.5 text-xs font-bold text-[#14213D]">

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
                  type="number"
                  min="1"
                  step="0.01"
                  value={declaredValue}
                  onChange={(e) =>
                    setDeclaredValue(e.target.value)
                  }
                  placeholder="e.g. 42500"
                  aria-label="Declared value in USD"
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-8 pr-4 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-400 focus:border-[#173B6C] focus:ring-4 focus:ring-[#173B6C]/10"
                  required
                />

              </div>

            </div>

            {/* =================================================
                SUBMIT
            ================================================== */}

            <button
              type="submit"
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#173B6C] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(23,59,108,.16)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#12315B] hover:shadow-[0_10px_24px_rgba(23,59,108,.22)]"
            >

              Get Agent Bids

              <ArrowRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />

            </button>

            <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[10px] text-slate-400">

              <CheckCircle2
                size={12}
                className="text-emerald-500"
              />

              Free to post - No obligation to accept

            </p>

          </form>

        </section>

        {/* ===================================================
            FOOTER INFO
        ==================================================== */}

        <div className="mt-6 flex items-center justify-center gap-2 text-center text-[10px] text-slate-400">

          <ShieldCheck size={12} />

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