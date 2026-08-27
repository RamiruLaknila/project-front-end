import { useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  ChevronRight,
  Download,
  FileText,
  FolderOpen,
  MoreHorizontal,
  Package,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import AppNavbar from "../components/ui/AppNavbar";
import BackButton from "../components/ui/BackButton";

function Documents() {
  const [search, setSearch] = useState("");
  const [showUpload, setShowUpload] = useState(false);

  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: "Commercial Invoice",
      type: "Invoice",
      size: "245 KB",
      date: "20 Aug 2026",
      status: "Verified",
    },
    {
      id: 2,
      name: "Packing List",
      type: "Packing List",
      size: "182 KB",
      date: "20 Aug 2026",
      status: "Verified",
    },
    {
      id: 3,
      name: "Bill of Lading",
      type: "Shipping Document",
      size: "328 KB",
      date: "19 Aug 2026",
      status: "Pending review",
    },
  ]);

  /* =========================================================
     FILTER DOCUMENTS
  ========================================================= */

  const filteredDocuments = documents.filter((document) =>
    document.name.toLowerCase().includes(search.toLowerCase())
  );

  /* =========================================================
     DELETE DOCUMENT
  ========================================================= */

  const deleteDocument = (id) => {
    setDocuments((current) =>
      current.filter((document) => document.id !== id)
    );
  };

  /* =========================================================
     TOTAL STORAGE
  ========================================================= */

  const totalStorage = documents.reduce((total, document) => {
    const value = parseFloat(document.size);

    if (document.size.includes("MB")) {
      return total + value * 1024;
    }

    return total + value;
  }, 0);

  const formattedStorage =
    totalStorage >= 1024
      ? `${(totalStorage / 1024).toFixed(1)} MB`
      : `${Math.round(totalStorage)} KB`;

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

        .documents-delay-1 {
          animation-delay: 0.05s;
        }

        .documents-delay-2 {
          animation-delay: 0.1s;
        }

        .documents-delay-3 {
          animation-delay: 0.15s;
        }

        .documents-delay-4 {
          animation-delay: 0.2s;
        }

        .documents-delay-5 {
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

      {/* =====================================================
          SHARED APP NAVBAR
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
          <BackButton current="Documents" />
        </div>

        {/* ===================================================
            PAGE HEADER
        ==================================================== */}

        <section className="fade-up documents-delay-1 mb-8">
          <div className="flex flex-col items-center justify-center text-center">
            {/* BADGE */}

            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5">
              <FolderOpen
                size={13}
                className="text-violet-700"
              />

              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-violet-700">
                Import documents
              </span>
            </div>

            {/* TITLE */}

            <h1 className="text-[28px] font-bold tracking-[-0.04em] text-[#14213D] sm:text-[40px]">
              Documents
            </h1>

            {/* DESCRIPTION */}

            <p className="mx-auto mt-2 max-w-2xl text-[13px] leading-6 text-slate-500 sm:text-sm">
              Keep all documents related to your imports
              organized and accessible in one place.
            </p>

            {/* STATUS */}

            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5">
              <CheckCircle2
                size={14}
                className="text-emerald-600"
              />

              <span className="text-[10px] font-semibold text-emerald-700">
                Secure document storage
              </span>
            </div>
          </div>
        </section>

        {/* ===================================================
            DOCUMENT PROGRESS / CONTEXT BAR
        ==================================================== */}

        <section className="fade-up documents-delay-2 mx-auto mb-7 w-full max-w-[760px] rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-[0_2px_8px_rgba(15,23,42,.02)]">
          <div className="flex items-center">
            {/* STEP 1 */}

            <div className="flex shrink-0 items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#173B6C] text-[11px] font-bold text-white shadow-sm">
                1
              </div>

              <span className="hidden text-[11px] font-semibold text-[#173B6C] sm:block">
                Documents
              </span>
            </div>

            <div className="mx-2 h-px flex-1 bg-slate-200" />

            {/* STEP 2 */}

            <div className="flex shrink-0 items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-400">
                2
              </div>

              <span className="hidden text-[11px] font-medium text-slate-400 sm:block">
                Verification
              </span>
            </div>

            <div className="mx-2 h-px flex-1 bg-slate-200" />

            {/* STEP 3 */}

            <div className="flex shrink-0 items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-400">
                3
              </div>

              <span className="hidden text-[11px] font-medium text-slate-400 sm:block">
                Shipment Ready
              </span>
            </div>
          </div>
        </section>

        {/* ===================================================
            INFO BANNER
        ==================================================== */}

        <div className="fade-up documents-delay-3 mb-6 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3.5">
          <ShieldCheck
            size={16}
            className="mt-0.5 shrink-0 text-blue-600"
          />

          <div>
            <p className="text-[10px] font-bold text-blue-800">
              Keep your import documents organized
            </p>

            <p className="mt-1 text-[11px] leading-5 text-blue-700">
              Upload invoices, packing lists, shipping
              documents, permits and other files required
              for your import.
            </p>
          </div>
        </div>

        {/* ===================================================
            ACTIVE SHIPMENT
        ==================================================== */}

        <section className="fade-up documents-delay-3 mb-5 rounded-2xl border border-slate-200 bg-white shadow-[0_2px_14px_rgba(15,23,42,.025)]">
          <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <Package size={18} />
              </div>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                  Active shipment
                </p>

                <p className="mt-1 text-xs font-bold text-slate-800">
                  IMP-204821
                </p>
              </div>
            </div>

            <Link
              to="/track-shipment"
              className="flex items-center gap-1 text-[10px] font-bold text-blue-700 transition hover:text-blue-800"
            >
              View shipment
              <ChevronRight size={13} />
            </Link>
          </div>
        </section>

        {/* ===================================================
            STATS
        ==================================================== */}

        <div className="fade-up documents-delay-3 mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            icon={<FileText size={16} />}
            label="Total documents"
            value={documents.length}
          />

          <StatCard
            icon={<CheckCircle2 size={16} />}
            label="Verified"
            value={
              documents.filter(
                (doc) => doc.status === "Verified"
              ).length
            }
          />

          <StatCard
            icon={<Upload size={16} />}
            label="Uploaded"
            value={documents.length}
          />

          <StatCard
            icon={<FolderOpen size={16} />}
            label="Storage"
            value={formattedStorage}
          />
        </div>

        {/* ===================================================
            DOCUMENT CARD
        ==================================================== */}

        <section className="fade-up documents-delay-4 scale-in overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_14px_rgba(15,23,42,.025)]">
          {/* CARD HEADER */}

          <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-[#14213D]">
                    Your documents
                  </h2>

                  <div className="hidden rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-semibold text-slate-500 sm:block">
                    {documents.length} files
                  </div>
                </div>

                <p className="mt-1 text-[11px] leading-5 text-slate-500">
                  Documents associated with your import.
                </p>
              </div>

              {/* UPLOAD BUTTON */}

              <button
                type="button"
                onClick={() => setShowUpload(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173B6C] px-4 py-2.5 text-[10px] font-bold text-white shadow-[0_6px_18px_rgba(23,59,108,.12)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#12315B] hover:shadow-[0_10px_24px_rgba(23,59,108,.18)]"
              >
                <Upload size={14} />
                Upload document
              </button>
            </div>

            {/* SEARCH */}

            <div className="relative mt-5">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search documents..."
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 text-[10px] text-slate-700 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-[#173B6C] focus:bg-white focus:ring-4 focus:ring-[#173B6C]/10"
              />
            </div>
          </div>

          {/* =================================================
              DESKTOP TABLE
          ================================================== */}

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead className="border-b border-slate-100 bg-slate-50/70">
                <tr>
                  <th className="px-5 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    Document
                  </th>

                  <th className="px-5 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    Type
                  </th>

                  <th className="px-5 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    Size
                  </th>

                  <th className="px-5 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    Uploaded
                  </th>

                  <th className="px-5 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    Status
                  </th>

                  <th className="px-5 py-3 text-right text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredDocuments.map((document) => (
                  <DocumentRow
                    key={document.id}
                    document={document}
                    onDelete={deleteDocument}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* =================================================
              MOBILE DOCUMENT CARDS
          ================================================== */}

          <div className="divide-y divide-slate-100 md:hidden">
            {filteredDocuments.map((document) => (
              <MobileDocumentCard
                key={document.id}
                document={document}
                onDelete={deleteDocument}
              />
            ))}
          </div>

          {/* =================================================
              EMPTY STATE
          ================================================== */}

          {filteredDocuments.length === 0 && (
            <div className="px-5 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                <FileText size={20} />
              </div>

              <h3 className="mt-4 text-sm font-bold text-slate-700">
                No documents found
              </h3>

              <p className="mt-1 text-[10px] text-slate-400">
                Try another search or upload a new document.
              </p>

              <button
                type="button"
                onClick={() => setShowUpload(true)}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#173B6C] px-4 py-2.5 text-[10px] font-bold text-white transition hover:bg-[#12315B]"
              >
                <Upload size={13} />
                Upload document
              </button>
            </div>
          )}
        </section>

        {/* ===================================================
            UPLOAD AREA
        ==================================================== */}

        <section className="fade-up documents-delay-5 mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <Upload size={18} />
          </div>

          <h3 className="mt-4 text-sm font-bold text-slate-800">
            Need to add another document?
          </h3>

          <p className="mx-auto mt-1 max-w-md text-[10px] leading-5 text-slate-400">
            Upload invoices, packing lists, permits,
            shipping documents, or other files required
            for your import.
          </p>

          <button
            type="button"
            onClick={() => setShowUpload(true)}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-[10px] font-bold text-slate-600 transition hover:bg-slate-50"
          >
            <Plus size={14} />
            Add document
          </button>
        </section>

        {/* ===================================================
            FOOTER SECURITY NOTE
        ==================================================== */}

        <div className="fade-up mt-6 flex items-center justify-center gap-2 text-center text-[10px] text-slate-400">
          <ShieldCheck
            size={13}
            className="text-emerald-600"
          />

          <span>
            Your documents are securely handled by ImportEase.
          </span>
        </div>
      </main>

      {/* =====================================================
          UPLOAD MODAL
      ====================================================== */}

      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onUpload={(document) => {
            setDocuments((current) => [
              ...current,
              {
                ...document,
                id: Date.now(),
              },
            ]);

            setShowUpload(false);
          }}
        />
      )}
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_4px_18px_rgba(15,23,42,0.02)] transition hover:-translate-y-0.5 hover:shadow-[0_7px_22px_rgba(15,23,42,0.04)]">
      <div className="flex items-center justify-between">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
          {icon}
        </div>

        <span className="text-lg font-bold text-slate-800">
          {value}
        </span>
      </div>

      <p className="mt-3 text-[9px] font-medium text-slate-400">
        {label}
      </p>
    </div>
  );
}

/* =========================================================
   DESKTOP DOCUMENT ROW
========================================================= */

function DocumentRow({ document, onDelete }) {
  return (
    <tr className="group transition hover:bg-slate-50/60">
      {/* DOCUMENT */}

      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600">
            <FileText size={16} />
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-800">
              {document.name}
            </p>

            <p className="mt-0.5 text-[8px] text-slate-400">
              PDF document
            </p>
          </div>
        </div>
      </td>

      {/* TYPE */}

      <td className="px-5 py-4 text-[9px] text-slate-500">
        {document.type}
      </td>

      {/* SIZE */}

      <td className="px-5 py-4 text-[9px] text-slate-500">
        {document.size}
      </td>

      {/* DATE */}

      <td className="px-5 py-4 text-[9px] text-slate-500">
        {document.date}
      </td>

      {/* STATUS */}

      <td className="px-5 py-4">
        <StatusBadge status={document.status} />
      </td>

      {/* ACTIONS */}

      <td className="px-5 py-4">
        <div className="flex justify-end gap-1">
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            title="Download"
          >
            <Download size={13} />
          </button>

          <button
            type="button"
            onClick={() => onDelete(document.id)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
            title="Delete"
          >
            <Trash2 size={13} />
          </button>

          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            title="More"
          >
            <MoreHorizontal size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}

/* =========================================================
   MOBILE DOCUMENT CARD
========================================================= */

function MobileDocumentCard({ document, onDelete }) {
  return (
    <div className="p-5">
      <div className="flex items-start gap-3">
        {/* ICON */}

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
          <FileText size={17} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="truncate text-xs font-bold text-slate-800">
                {document.name}
              </p>

              <p className="mt-1 text-[9px] text-slate-400">
                {document.type} • {document.size}
              </p>
            </div>

            <StatusBadge status={document.status} />
          </div>

          <p className="mt-3 text-[9px] text-slate-400">
            Uploaded {document.date}
          </p>

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-[9px] font-bold text-slate-600 transition hover:bg-slate-50"
            >
              <Download size={12} />
              Download
            </button>

            <button
              type="button"
              onClick={() => onDelete(document.id)}
              className="flex items-center gap-1.5 rounded-lg border border-red-100 px-3 py-2 text-[9px] font-bold text-red-600 transition hover:bg-red-50"
            >
              <Trash2 size={12} />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({ status }) {
  const verified = status === "Verified";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[8px] font-bold ${
        verified
          ? "bg-emerald-50 text-emerald-700"
          : "bg-amber-50 text-amber-700"
      }`}
    >
      {verified ? (
        <CheckCircle2 size={10} />
      ) : (
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
      )}

      {status}
    </span>
  );
}

/* =========================================================
   UPLOAD MODAL
========================================================= */

function UploadModal({ onClose, onUpload }) {
  const [file, setFile] = useState(null);
  const [type, setType] = useState("Other Document");

  /* =======================================================
     SUBMIT UPLOAD
  ======================================================= */

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!file) {
      return;
    }

    onUpload({
      name: file.name,

      type,

      size:
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.max(
              1,
              Math.round(file.size / 1024)
            )} KB`,

      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),

      status: "Pending review",
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 px-5 backdrop-blur-sm">
      <div className="scale-in w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* MODAL HEADER */}

        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-sm font-bold text-slate-800">
              Upload document
            </h2>

            <p className="mt-1 text-[9px] text-slate-400">
              Add a document to this import
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close upload dialog"
          >
            <X size={16} />
          </button>
        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="p-5"
        >
          {/* DOCUMENT TYPE */}

          <label className="block">
            <span className="mb-2 block text-[10px] font-semibold text-slate-600">
              Document type
            </span>

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-[10px] text-slate-700 outline-none transition focus:border-[#173B6C] focus:ring-2 focus:ring-blue-100"
            >
              <option>Commercial Invoice</option>
              <option>Packing List</option>
              <option>Bill of Lading</option>
              <option>Import Permit</option>
              <option>Certificate of Origin</option>
              <option>Other Document</option>
            </select>
          </label>

          {/* FILE */}

          <label className="mt-4 block cursor-pointer">
            <span className="mb-2 block text-[10px] font-semibold text-slate-600">
              Select file
            </span>

            <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-7 text-center transition hover:border-blue-300 hover:bg-blue-50/30">
              <Upload
                size={22}
                className="mx-auto text-slate-400"
              />

              <p className="mt-3 text-xs font-semibold text-slate-600">
                {file ? file.name : "Choose a document"}
              </p>

              <p className="mt-1 text-[9px] text-slate-400">
                PDF, JPG, PNG up to 10 MB
              </p>

              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) =>
                  setFile(e.target.files?.[0] || null)
                }
                className="hidden"
              />
            </div>
          </label>

          {/* ACTIONS */}

          <div className="mt-5 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 py-3 text-[10px] font-bold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!file}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#173B6C] py-3 text-[10px] font-bold text-white transition hover:bg-[#102A4D] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Upload size={13} />
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Documents;