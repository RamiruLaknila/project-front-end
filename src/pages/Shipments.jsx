import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  Check,
  ChevronRight,
  Clock3,
  FileText,
  MapPin,
  Package,
  RefreshCw,
  ShieldCheck,
  Truck,
  UserRound,
} from "lucide-react";

import AppNavbar from "../components/ui/AppNavbar";

function Shipments() {
  const [shipment, setShipment] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const loadShipment = () => {
    try {
      const storedShipment = localStorage.getItem("currentShipment");

      if (storedShipment) {
        setShipment(JSON.parse(storedShipment));
      } else {
        setShipment(null);
      }

      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to load shipment:", error);
      setShipment(null);
    }
  };

  useEffect(() => {
    loadShipment();

    const handleStorageChange = () => {
      loadShipment();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const product =
    shipment?.product ||
    shipment?.currentImport?.product ||
    shipment?.importDetails?.product ||
    "Import Shipment";

  const hsCode =
    shipment?.hsCode ||
    shipment?.currentImport?.hsCode ||
    shipment?.importDetails?.hsCode ||
    "—";

  const reference =
    shipment?.reference ||
    shipment?.shipmentReference ||
    shipment?.id ||
    "IMP-2026-001";

  const status = shipment?.status || "In Progress";

  const agent =
    shipment?.agent ||
    shipment?.selectedAgent ||
    shipment?.clearingAgent ||
    null;

  const total =
    shipment?.finalSummary?.total ??
    shipment?.total ??
    shipment?.finalTotal ??
    0;

  const timeline = [
    {
      title: "Import request submitted",
      description: "Your import request has been submitted successfully.",
      completed: true,
      date: "Completed",
    },
    {
      title: "Clearing agent selected",
      description: "A clearing agent has been selected for your shipment.",
      completed: true,
      date: "Completed",
    },
    {
      title: "Documents under review",
      description: "Your shipment documents are being reviewed.",
      completed: true,
      date: "Completed",
    },
    {
      title: "Customs clearance",
      description: "Your shipment is currently being processed for customs clearance.",
      completed: false,
      current: true,
      date: "In progress",
    },
    {
      title: "Shipment cleared",
      description: "Your shipment will be marked complete once customs clearance is finished.",
      completed: false,
      date: "Pending",
    },
  ];

  const documents = [
    {
      name: "Commercial Invoice",
      status: "Uploaded",
    },
    {
      name: "Packing List",
      status: "Uploaded",
    },
    {
      name: "Import Documents",
      status: "Under review",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-900">
      <AppNavbar />

      <main className="mx-auto w-full max-w-[1000px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        {/* Breadcrumb */}
        <div className="fade-up mb-6 flex items-center gap-2 text-[12px] font-medium text-slate-400">
          <Link
            to="/dashboard"
            className="transition-colors hover:text-[#173B6C]"
          >
            Dashboard
          </Link>

          <ChevronRight className="h-3.5 w-3.5" />

          <span className="text-[#173B6C]">Shipment Tracking</span>
        </div>

        {/* Header */}
        <section className="fade-up -mt-6 mb-7 text-center">
          <h1 className="text-[32px] font-bold tracking-[-0.04em] text-[#14213D] sm:text-[42px]">
            Track your import
          </h1>

          <p className="mx-auto mt-2 max-w-[650px] text-[13px] leading-6 text-slate-500 sm:text-[15px]">
            Follow your import shipment from agent selection through customs
            clearance and completion.
          </p>

          <button
            type="button"
            onClick={loadShipment}
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[12px] font-bold text-slate-600 shadow-[0_2px_10px_rgba(15,23,42,.02)] transition-all hover:border-[#173B6C] hover:text-[#173B6C]"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh status
          </button>
        </section>

        {/* Shipment Header */}
        <section className="fade-up overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,.025)]">
          <div className="border-b border-slate-100 p-5 sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
                  <Package className="h-5 w-5" />
                </div>

                <div>
                  <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">
                    Current shipment
                  </p>

                  <h2 className="text-[17px] font-bold text-[#173B6C]">
                    {product}
                  </h2>

                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-slate-500">
                    <span>Reference: {reference}</span>

                    <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />

                    <span>HS Code: {hsCode}</span>
                  </div>
                </div>
              </div>

              <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-amber-100 bg-amber-50 px-3 py-1.5 text-[11px] font-bold text-amber-700">
                <Clock3 className="h-3.5 w-3.5" />
                {status}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 divide-x divide-slate-100 sm:grid-cols-4">
            <div className="p-4 sm:p-5">
              <p className="text-[11px] font-semibold text-slate-400">
                Shipment
              </p>
              <p className="mt-1 text-[13px] font-bold text-[#173B6C]">
                {reference}
              </p>
            </div>

            <div className="p-4 sm:p-5">
              <p className="text-[11px] font-semibold text-slate-400">
                HS Code
              </p>
              <p className="mt-1 text-[13px] font-bold text-[#173B6C]">
                {hsCode}
              </p>
            </div>

            <div className="p-4 sm:p-5">
              <p className="text-[11px] font-semibold text-slate-400">
                Status
              </p>
              <p className="mt-1 text-[13px] font-bold text-[#173B6C]">
                {status}
              </p>
            </div>

            <div className="p-4 sm:p-5">
              <p className="text-[11px] font-semibold text-slate-400">
                Last updated
              </p>
              <p className="mt-1 text-[13px] font-bold text-[#173B6C]">
                {lastUpdated.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </section>

        {/* Progress */}
        <section className="fade-up mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,.025)] sm:p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-[17px] font-bold text-[#173B6C]">
                Shipment progress
              </h2>

              <p className="mt-1 text-[12px] text-slate-500">
                Your shipment clearance journey
              </p>
            </div>

            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-[#2563EB]">
              20% complete
            </span>
          </div>

          <div className="space-y-0">
            {timeline.map((item, index) => (
              <TimelineItem
                key={item.title}
                {...item}
                isLast={index === timeline.length - 1}
              />
            ))}
          </div>
        </section>

        {/* Lower Content */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_370px]">
          {/* Left */}
          <div className="space-y-6">
           
                
              

              
           
          </div>

          {/* Right */}
          <div className="space-y-6">
            

            {/* Help */}
           
            
          </div>
        </div>

        {/* Bottom Action */}
        <div className="fade-up mt-8 flex items-center justify-between border-t border-slate-200 pt-5">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[13px] font-bold text-slate-600 transition-all hover:border-[#173B6C] hover:text-[#173B6C]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>

          <div className="hidden items-center gap-1.5 text-[11px] text-slate-400 sm:flex">
            <ShieldCheck className="h-3.5 w-3.5" />
            ImportEase shipment tracking
          </div>
        </div>

        <p className="mt-6 text-center text-[12px] text-slate-400">
          Shipment information is updated based on the latest available
          clearance status.
        </p>
      </main>

      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-up {
          animation: fadeUp 0.45s ease-out both;
        }
      `}</style>
    </div>
  );
}

function TimelineItem({
  title,
  description,
  completed,
  current,
  date,
  isLast,
}) {
  return (
    <div className="flex gap-3.5">
      <div className="flex flex-col items-center">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 ${
            completed
              ? "border-[#173B6C] bg-[#173B6C] text-white"
              : current
              ? "border-[#2563EB] bg-blue-50 text-[#2563EB]"
              : "border-slate-200 bg-white text-slate-300"
          }`}
        >
          {completed ? (
            <Check className="h-4 w-4" />
          ) : current ? (
            <Clock3 className="h-4 w-4" />
          ) : (
            <span className="h-2 w-2 rounded-full bg-current" />
          )}
        </div>

        {!isLast && (
          <div
            className={`my-1 w-px flex-1 min-h-[52px] ${
              completed ? "bg-[#173B6C]" : "bg-slate-200"
            }`}
          />
        )}
      </div>

      <div className={`pb-6 ${isLast ? "pb-0" : ""}`}>
        <div className="flex flex-wrap items-center gap-2">
          <h3
            className={`text-[13px] font-bold ${
              current || completed ? "text-[#173B6C]" : "text-slate-400"
            }`}
          >
            {title}
          </h3>

          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
              completed
                ? "bg-emerald-50 text-emerald-700"
                : current
                ? "bg-blue-50 text-[#2563EB]"
                : "bg-slate-100 text-slate-400"
            }`}
          >
            {date}
          </span>
        </div>

        <p className="mt-1 max-w-[560px] text-[12px] leading-5 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

function DocumentRow({ name, status }) {
  const uploaded = status === "Uploaded";

  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-3.5 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#2563EB] shadow-sm">
          <FileText className="h-4 w-4" />
        </div>

        <div className="min-w-0">
          <p className="truncate text-[12px] font-bold text-[#173B6C]">
            {name}
          </p>

          <p className="mt-0.5 text-[10px] text-slate-400">
            Shipment document
          </p>
        </div>
      </div>

      <span
        className={`ml-3 shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${
          uploaded
            ? "bg-emerald-50 text-emerald-700"
            : "bg-amber-50 text-amber-700"
        }`}
      >
        {status}
      </span>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3.5">
      <span className="text-[11px] font-semibold text-slate-400">
        {label}
      </span>

      <span className="max-w-[190px] truncate text-right text-[12px] font-bold text-[#173B6C]">
        {value}
      </span>
    </div>
  );
}

function formatMoney(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "LKR 0.00";
  }

  return `LKR ${number.toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default Shipments;