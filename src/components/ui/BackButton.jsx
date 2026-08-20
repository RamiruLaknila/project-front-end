import { ArrowLeft, ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

function BackButton({ current }) {
  const location = useLocation();

  // Dashboard does not need a back button
  if (location.pathname === "/dashboard") {
    return null;
  }

  return (
    <div className="mb-6 flex items-center gap-2">

      {/* Back to Dashboard */}

      <Link
        to="/dashboard"
        className="group inline-flex items-center gap-1.5 rounded-lg py-1 text-xs font-medium text-slate-400 transition-all duration-200 hover:text-[#173563]"
      >
        <ArrowLeft
          size={14}
          strokeWidth={1.8}
          className="transition-transform duration-200 group-hover:-translate-x-0.5"
        />

        <span>Dashboard</span>
      </Link>

      {/* Separator */}

      <ChevronRight
        size={13}
        className="text-slate-300"
      />

      {/* Current page */}

      <span className="text-xs font-semibold text-slate-600">
        {current}
      </span>

    </div>
  );
}

export default BackButton;