import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
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

  const filteredDocuments = documents.filter((document) =>
    document.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const deleteDocument = (id) => {
    setDocuments((current) =>
      current.filter((document) => document.id !== id)
    );
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-900">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">

        <div className="mx-auto flex h-[68px] max-w-[1280px] items-center justify-between px-5 sm:px-8">

          <Link
            to="/dashboard"
            className="flex items-center gap-3"
          >
            <img
              src="/logo.jpeg"
              alt="ImportEase"
              className="h-11 w-11 object-contain mix-blend-multiply"
            />

            <div>
              <div className="text-[18px] font-bold tracking-tight text-[#173563]">
                Import<span className="text-slate-900">Ease</span>
              </div>

              <div className="hidden text-[9px] font-semibold uppercase tracking-[0.13em] text-slate-400 sm:block">
                SME Import Platform
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-3">

            <button
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
              aria-label="Notifications"
            >
              <Bell size={17} />

              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blue-600 ring-2 ring-white" />
            </button>

            <div className="hidden h-7 w-px bg-slate-200 sm:block" />

            <div className="flex items-center gap-2.5">

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#173563] text-[10px] font-bold text-white">
                MB
              </div>

              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-slate-800">
                  My Business
                </p>

                <p className="text-[9px] text-slate-400">
                  SME Account
                </p>
              </div>

            </div>

          </div>

        </div>

      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mx-auto max-w-[1120px] px-5 py-8 sm:px-8 lg:py-10">

        {/* Breadcrumb */}

        <div className="mb-7 flex items-center gap-2 text-xs text-slate-400">

          <Link
            to="/dashboard"
            className="hover:text-slate-700"
          >
            Dashboard
          </Link>

          <ChevronRight size={13} />

          <span className="font-medium text-slate-600">
            Documents
          </span>

        </div>

        {/* =====================================================
            HEADER
        ===================================================== */}

        <section className="mb-7">

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

            <div>

              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5">

                <FolderOpen
                  size={13}
                  className="text-violet-700"
                />

                <span className="text-[10px] font-bold uppercase tracking-wider text-violet-700">
                  Import documents
                </span>

              </div>

              <h1 className="text-2xl font-bold tracking-tight text-[#14213D] sm:text-3xl">
                Documents
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                Keep all documents related to your imports organized
                and accessible in one place.
              </p>

            </div>

            <button
              onClick={() => setShowUpload(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173563] px-5 py-3 text-xs font-bold text-white shadow-lg shadow-blue-900/10 transition hover:-translate-y-0.5 hover:bg-[#102A4D]"
            >
              <Upload size={15} />
              Upload document
            </button>

          </div>

        </section>

        {/* =====================================================
            SHIPMENT BAR
        ===================================================== */}

        <section className="mb-5 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_5px_25px_rgba(15,23,42,0.03)] sm:flex-row sm:items-center sm:justify-between">

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
            className="flex items-center gap-1 text-[10px] font-bold text-blue-700 hover:text-blue-800"
          >
            View shipment
            <ChevronRight size={13} />
          </Link>

        </section>

        {/* =====================================================
            STATS
        ===================================================== */}

        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">

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
            value="2.4 MB"
          />

        </div>

        {/* =====================================================
            DOCUMENT LIST
        ===================================================== */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_5px_25px_rgba(15,23,42,0.03)]">

          {/* Toolbar */}

          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h2 className="text-sm font-bold text-slate-800">
                Your documents
              </h2>

              <p className="mt-1 text-[9px] text-slate-400">
                Documents associated with your import
              </p>

            </div>

            <div className="relative w-full sm:w-64">

              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search documents..."
                className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-[10px] outline-none transition focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />

            </div>

          </div>

          {/* Desktop table */}

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

          {/* Mobile cards */}

          <div className="divide-y divide-slate-100 md:hidden">

            {filteredDocuments.map((document) => (

              <MobileDocumentCard
                key={document.id}
                document={document}
                onDelete={deleteDocument}
              />

            ))}

          </div>

          {/* Empty */}

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

            </div>
          )}

        </section>

        {/* =====================================================
            UPLOAD AREA
        ===================================================== */}

        <section className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center">

          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <Upload size={18} />
          </div>

          <h3 className="mt-4 text-sm font-bold text-slate-800">
            Need to add another document?
          </h3>

          <p className="mx-auto mt-1 max-w-md text-[10px] leading-5 text-slate-400">
            Upload invoices, packing lists, permits, shipping documents,
            or other files required for your import.
          </p>

          <button
            onClick={() => setShowUpload(true)}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-[10px] font-bold text-slate-600 hover:bg-slate-50"
          >
            <Plus size={14} />
            Add document
          </button>

        </section>

        {/* Security */}

        <div className="mt-7 flex items-center justify-center gap-2 text-[9px] text-slate-400">

          <ShieldCheck
            size={13}
            className="text-emerald-600"
          />

          Your documents are securely stored with ImportEase.

        </div>

      </main>

      {/* =====================================================
          UPLOAD MODAL
      ===================================================== */}

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

function StatCard({
  icon,
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_4px_18px_rgba(15,23,42,0.02)]">

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
   DESKTOP ROW
========================================================= */

function DocumentRow({
  document,
  onDelete,
}) {
  return (
    <tr className="group transition hover:bg-slate-50/60">

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

      <td className="px-5 py-4 text-[9px] text-slate-500">
        {document.type}
      </td>

      <td className="px-5 py-4 text-[9px] text-slate-500">
        {document.size}
      </td>

      <td className="px-5 py-4 text-[9px] text-slate-500">
        {document.date}
      </td>

      <td className="px-5 py-4">

        <StatusBadge status={document.status} />

      </td>

      <td className="px-5 py-4">

        <div className="flex justify-end gap-1">

          <button
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            title="Download"
          >
            <Download size={13} />
          </button>

          <button
            onClick={() => onDelete(document.id)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600"
            title="Delete"
          >
            <Trash2 size={13} />
          </button>

          <button
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
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
   MOBILE DOCUMENT
========================================================= */

function MobileDocumentCard({
  document,
  onDelete,
}) {
  return (
    <div className="p-5">

      <div className="flex items-start gap-3">

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

            <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-[9px] font-bold text-slate-600">
              <Download size={12} />
              Download
            </button>

            <button
              onClick={() => onDelete(document.id)}
              className="flex items-center gap-1.5 rounded-lg border border-red-100 px-3 py-2 text-[9px] font-bold text-red-600"
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
   STATUS
========================================================= */

function StatusBadge({
  status,
}) {
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

function UploadModal({
  onClose,
  onUpload,
}) {
  const [file, setFile] = useState(null);
  const [type, setType] = useState("Other Document");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!file) return;

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
      date: new Date().toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      ),
      status: "Pending review",
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 px-5 backdrop-blur-sm">

      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

        {/* Header */}

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
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
          >
            <X size={16} />
          </button>

        </div>

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="p-5"
        >

          <label className="block">

            <span className="mb-2 block text-[10px] font-semibold text-slate-600">
              Document type
            </span>

            <select
              value={type}
              onChange={(e) =>
                setType(e.target.value)
              }
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-[10px] text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            >
              <option>Commercial Invoice</option>
              <option>Packing List</option>
              <option>Bill of Lading</option>
              <option>Import Permit</option>
              <option>Certificate of Origin</option>
              <option>Other Document</option>
            </select>

          </label>

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
                {file
                  ? file.name
                  : "Choose a document"}
              </p>

              <p className="mt-1 text-[9px] text-slate-400">
                PDF, JPG, PNG up to 10 MB
              </p>

              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) =>
                  setFile(
                    e.target.files?.[0] || null
                  )
                }
                className="hidden"
              />

            </div>

          </label>

          <div className="mt-5 flex gap-2">

            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 py-3 text-[10px] font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!file}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#173563] py-3 text-[10px] font-bold text-white hover:bg-[#102A4D] disabled:cursor-not-allowed disabled:opacity-50"
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