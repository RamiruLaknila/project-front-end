import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  ChevronRight,
  FileBadge2,
  UserRound,
  Users,
} from "lucide-react";

function AgencyChoice() {
  const navigate = useNavigate();

  const [selectedType, setSelectedType] = useState("");
  const [error, setError] = useState("");

  const handleContinue = () => {
    setError("");

    if (!selectedType) {
      setError("Please choose how you want to use ImportEase.");
      return;
    }

    /*
     * Save the selected onboarding path.
     * This is frontend-only for now.
     * Later this will be handled by the backend/Firebase.
     */
    localStorage.setItem(
      "agentOnboardingType",
      selectedType
    );

    if (selectedType === "create-agency") {
      navigate("/agency-create");
      return;
    }

    if (selectedType === "join-agency") {
      navigate("/agency-join");
      return;
    }

    if (selectedType === "individual") {
      navigate("/individual-agent-profile");
    }
  };

  const options = [
    {
      id: "create-agency",
      icon: Building2,
      title: "Create a Clearing Agency",
      description:
        "Register your clearing company and become the Agency Admin.",
      badge: "For agency owners",
      iconStyle: "bg-blue-50 text-blue-700",
    },
    {
      id: "join-agency",
      icon: Users,
      title: "Join an Existing Agency",
      description:
        "Have an invitation or agency code? Join your existing clearing agency.",
      badge: "For agency agents",
      iconStyle: "bg-emerald-50 text-emerald-700",
    },
    {
      id: "individual",
      icon: UserRound,
      title: "Register as an Individual Agent",
      description:
        "Operate independently as a licensed clearing agent without an agency.",
      badge: "Independent agent",
      iconStyle: "bg-violet-50 text-violet-700",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F8FAFC] px-4 py-8 sm:py-10">

      {/* =====================================================
          BACKGROUND DECORATION
      ===================================================== */}

      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-100/50 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-slate-200/50 blur-3xl" />

      {/* =====================================================
          MAIN CONTAINER
      ===================================================== */}

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-2xl flex-col justify-center">

        {/* =====================================================
            LOGO
        ===================================================== */}

        <div className="mb-7 flex justify-center">

          <Link
            to="/"
            className="flex items-center gap-3"
          >

            <img
              src="/logo.jpeg"
              alt="ImportEase"
              className="h-16 w-16 object-contain mix-blend-multiply sm:h-[72px] sm:w-[72px]"
            />

            <span className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[26px]">
              Import
              <span className="text-[#173563]">
                Ease
              </span>
            </span>

          </Link>

        </div>


        {/* =====================================================
            MAIN CARD
        ===================================================== */}

        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.15)] sm:p-8">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="mb-7 text-center">

            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#173563] shadow-md shadow-[#173563]/15">

              <FileBadge2
                size={23}
                className="text-white"
              />

            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[27px]">
              Set up your agent account
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Choose how you want to operate on ImportEase.
              You can manage an agency, join an existing one,
              or work independently.
            </p>

          </div>


          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">

              <span className="mt-0.5">!</span>

              <span>{error}</span>

            </div>
          )}


          {/* =================================================
              OPTIONS
          ================================================= */}

          <div className="space-y-3">

            {options.map((option) => {

              const Icon = option.icon;

              const isSelected =
                selectedType === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    setSelectedType(option.id);
                    setError("");
                  }}
                  className={`group relative flex w-full items-start gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-200 sm:p-5 ${
                    isSelected
                      ? "border-[#173563] bg-blue-50/60 shadow-md shadow-blue-900/5"
                      : "border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50"
                  }`}
                >

                  {/* ICON */}

                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition ${
                      isSelected
                        ? "bg-[#173563] text-white"
                        : option.iconStyle
                    }`}
                  >
                    <Icon
                      size={20}
                      strokeWidth={1.8}
                    />
                  </div>


                  {/* CONTENT */}

                  <div className="min-w-0 flex-1">

                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">

                      <h2 className="text-sm font-bold text-slate-900 sm:text-[15px]">
                        {option.title}
                      </h2>

                      <span
                        className={`w-fit rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                          isSelected
                            ? "bg-blue-100 text-blue-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {option.badge}
                      </span>

                    </div>

                    <p className="mt-1.5 max-w-xl text-xs leading-5 text-slate-500 sm:text-[13px]">
                      {option.description}
                    </p>

                  </div>


                  {/* SELECTION */}

                  <div className="shrink-0 pt-1">

                    {isSelected ? (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#173563] text-white">

                        <CheckCircle2
                          size={20}
                          strokeWidth={2.2}
                        />

                      </div>
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-slate-300 transition group-hover:border-blue-400" />
                    )}

                  </div>

                </button>
              );
            })}

          </div>


          {/* =================================================
              CONTINUE
          ================================================= */}

          <button
            type="button"
            onClick={handleContinue}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#173563] py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#173563]/15 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#102547] hover:shadow-xl hover:shadow-[#173563]/20 active:translate-y-0 active:scale-[0.99]"
          >
            Continue

            <ChevronRight
              size={17}
            />
          </button>


          {/* =================================================
              INFORMATION
          ================================================= */}

          <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3">

            <div className="flex items-start gap-2.5">

              <FileBadge2
                size={16}
                className="mt-0.5 shrink-0 text-blue-600"
              />

              <p className="text-[11px] leading-5 text-blue-700">

                <span className="font-semibold">
                  Don't worry.
                </span>{" "}

                You can complete your business and license
                information during the next step.

              </p>

            </div>

          </div>

        </div>


        {/* =====================================================
            BACK
        ===================================================== */}

        <div className="mt-5 flex justify-center">

          <button
            type="button"
            onClick={() => navigate("/agent-signin")}
            className="flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-800"
          >
            <ArrowLeft size={16} />

            Back to Agent Sign In

          </button>

        </div>

      </div>

    </div>
  );
}

export default AgencyChoice;