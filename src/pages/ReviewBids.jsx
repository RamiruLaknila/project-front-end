import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Building2,
  CheckCircle2,
  Clock3,
  DollarSign,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  MessageSquare,
  Package,
  Search,
  Settings,
  ShieldCheck,
  UserCheck,
  UserRound,
  X,
  XCircle,
} from "lucide-react";

function ReviewBids() {
  const navigate = useNavigate();
  const location = useLocation();

  const [request, setRequest] = useState(null);
  const [bids, setBids] = useState([]);
  const [selectedBid, setSelectedBid] = useState(null);
  const [isAccepting, setIsAccepting] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // =========================================================
  // NAVBAR STATE
  // =========================================================

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // =========================================================
  // LOAD REQUEST
  // =========================================================

  const loadRequest = () => {
    try {
      const currentRequestId =
        localStorage.getItem("currentRequestId");

      const savedRequest = JSON.parse(
        localStorage.getItem("shipmentRequest") || "null"
      );

      const marketplaceRequest = JSON.parse(
        localStorage.getItem("currentMarketplaceRequest") || "null"
      );

      let currentRequest = savedRequest;

      /*
       * Prefer the current marketplace request when the IDs match.
       */

      if (
        marketplaceRequest &&
        marketplaceRequest.id === currentRequestId
      ) {
        currentRequest = {
          ...savedRequest,
          ...marketplaceRequest,
        };
      }

      if (currentRequest) {
        setRequest(currentRequest);
      }
    } catch (error) {
      console.error("Failed to load shipment request:", error);
      setRequest(null);
    }
  };

  // =========================================================
  // LOAD BIDS
  // =========================================================

  const loadBids = () => {
    try {
      const currentRequestId =
        localStorage.getItem("currentRequestId");

      const savedBids = JSON.parse(
        localStorage.getItem("agentBids") || "[]"
      );

      if (!Array.isArray(savedBids)) {
        setBids([]);
        return;
      }

      /*
       * Only show bids belonging to THIS shipment request.
       */

      const requestBids = savedBids.filter(
        (bid) => bid.requestId === currentRequestId
      );

      setBids(requestBids);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to load bids:", error);
      setBids([]);
    }
  };

  // =========================================================
  // NOTIFICATIONS
  // =========================================================

  const loadNotifications = () => {
    try {
      const savedNotifications = JSON.parse(
        localStorage.getItem("smeNotifications") || "[]"
      );

      if (!Array.isArray(savedNotifications)) {
        setNotifications([]);
        return;
      }

      setNotifications(savedNotifications);
    } catch (error) {
      console.error("Failed to load notifications:", error);
      setNotifications([]);
    }
  };

  const unreadNotifications = notifications.filter(
    (notification) => !notification.read
  );

  const handleNotificationClick = (notification) => {
    try {
      /*
       * If this notification belongs to a specific shipment request,
       * make that request the active request before opening Review Bids.
       */

      if (notification.requestId) {
        localStorage.setItem(
          "currentRequestId",
          notification.requestId
        );

        const marketplaceRequests = JSON.parse(
          localStorage.getItem("marketplaceRequests") || "[]"
        );

        if (Array.isArray(marketplaceRequests)) {
          const matchingRequest = marketplaceRequests.find(
            (item) => item.id === notification.requestId
          );

          if (matchingRequest) {
            localStorage.setItem(
              "currentMarketplaceRequest",
              JSON.stringify(matchingRequest)
            );
          }
        }

        const shipmentRequest = JSON.parse(
          localStorage.getItem("shipmentRequest") || "null"
        );

        if (
          shipmentRequest &&
          shipmentRequest.id === notification.requestId
        ) {
          localStorage.setItem(
            "shipmentRequest",
            JSON.stringify(shipmentRequest)
          );
        }
      }

      /*
       * Mark this notification as read.
       */

      const updatedNotifications = notifications.map((item) =>
        item.id === notification.id
          ? {
              ...item,
              read: true,
            }
          : item
      );

      localStorage.setItem(
        "smeNotifications",
        JSON.stringify(updatedNotifications)
      );

      setNotifications(updatedNotifications);
      setNotificationOpen(false);

      /*
       * Open the Review Bids page.
       *
       * If already on this page, reload the request/bids state.
       */

      if (location.pathname === "/review-bids") {
        loadRequest();
        loadBids();
      } else {
        navigate("/review-bids");
      }
    } catch (error) {
      console.error(
        "Failed to open notification:",
        error
      );
    }
  };

  const markAllNotificationsRead = () => {
    const updatedNotifications = notifications.map(
      (notification) => ({
        ...notification,
        read: true,
      })
    );

    localStorage.setItem(
      "smeNotifications",
      JSON.stringify(updatedNotifications)
    );

    setNotifications(updatedNotifications);
  };

  // =========================================================
  // INITIAL LOAD + AUTO REFRESH
  // =========================================================

  useEffect(() => {
    loadRequest();
    loadBids();
    loadNotifications();

    /*
     * Refresh every 2 seconds.
     *
     * This is useful because your prototype uses localStorage
     * instead of a real backend.
     */

    const interval = setInterval(() => {
      loadRequest();
      loadBids();
      loadNotifications();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // =========================================================
  // FORMAT CURRENCY
  // =========================================================

  const formatCurrency = (value) => {
    const amount = Number(value || 0);

    return `LKR ${amount.toLocaleString("en-LK")}`;
  };

  // =========================================================
  // CALCULATE TOTAL
  // =========================================================

  const getTotal = (bid) => {
    return (
      Number(bid?.clearanceFee || 0) +
      Number(bid?.additionalCharges || 0)
    );
  };

  // =========================================================
  // SORT BIDS
  // Lowest total fee first.
  // =========================================================

  const sortedBids = useMemo(() => {
    return [...bids].sort(
      (a, b) => getTotal(a) - getTotal(b)
    );
  }, [bids]);

  // =========================================================
  // ACCEPT BID
  // =========================================================

  const handleAcceptBid = () => {
    if (!selectedBid || !request) {
      return;
    }

    setIsAccepting(true);

    try {
      // =====================================================
      // GET EXISTING BIDS
      // =====================================================

      const existingBids = JSON.parse(
        localStorage.getItem("agentBids") || "[]"
      );

      // =====================================================
      // UPDATE SELECTED BID
      // =====================================================

      const updatedBids = existingBids.map((bid) => {
        if (bid.id === selectedBid.id) {
          return {
            ...bid,
            status: "Accepted",
            acceptedAt: new Date().toISOString(),
          };
        }

        /*
         * Other bids for this request become rejected.
         */

        if (bid.requestId === request.id) {
          return {
            ...bid,
            status: "Rejected",
          };
        }

        return bid;
      });

      localStorage.setItem(
        "agentBids",
        JSON.stringify(updatedBids)
      );

      // =====================================================
      // CREATE SELECTED AGENT
      // =====================================================

      const selectedAgent = {
        id:
          selectedBid.agentId ||
          selectedBid.id,

        name:
          selectedBid.agentName ||
          "Clearing Agent",

        agencyName:
          selectedBid.agencyName ||
          selectedBid.agentName ||
          "Clearing Agency",

        clearanceFee:
          Number(selectedBid.clearanceFee || 0),

        additionalCharges:
          Number(selectedBid.additionalCharges || 0),

        totalFee:
          getTotal(selectedBid),

        processingTime:
          selectedBid.processingTime ||
          "Not specified",

        message:
          selectedBid.message || "",

        bidId:
          selectedBid.id,

        requestId:
          request.id,

        selectedAt:
          new Date().toISOString(),
      };

      // =====================================================
      // SAVE SELECTED AGENT
      // =====================================================

      localStorage.setItem(
        "selectedAgent",
        JSON.stringify(selectedAgent)
      );

      // =====================================================
      // UPDATE SHIPMENT REQUEST
      // =====================================================

      const updatedRequest = {
        ...request,

        status: "Agent Selected",

        selectedBidId:
          selectedBid.id,

        selectedAgentId:
          selectedAgent.id,

        selectedAgentName:
          selectedAgent.name,

        selectedAt:
          new Date().toISOString(),
      };

      localStorage.setItem(
        "shipmentRequest",
        JSON.stringify(updatedRequest)
      );

      localStorage.setItem(
        "currentMarketplaceRequest",
        JSON.stringify({
          ...updatedRequest,
        })
      );

      // =====================================================
      // SAVE CURRENT SHIPMENT
      // ShipmentConfirmation can use this directly.
      // =====================================================

      const currentShipment = {
        id:
          `SHP-${Date.now()}`,

        requestId:
          request.id,

        product:
          request.product ||
          request.productDetails ||
          "Import Shipment",

        origin:
          request.origin || "",

        destination:
          request.destination ||
          "Colombo, Sri Lanka",

        shipmentValue:
          Number(
            request.shipmentValue ||
              request.declaredValue ||
              0
          ),

        hsCode:
          request.hsCode ||
          "Not classified",

        category:
          request.category ||
          "General",

        agent:
          selectedAgent,

        status:
          "Agent Selected",

        createdAt:
          new Date().toISOString(),
      };

      localStorage.setItem(
        "currentShipment",
        JSON.stringify(currentShipment)
      );

      // =====================================================
      // UPDATE MARKETPLACE REQUEST
      // =====================================================

      let marketplaceRequests = [];

      try {
        marketplaceRequests = JSON.parse(
          localStorage.getItem(
            "marketplaceRequests"
          ) || "[]"
        );

        if (!Array.isArray(marketplaceRequests)) {
          marketplaceRequests = [];
        }
      } catch {
        marketplaceRequests = [];
      }

      const updatedMarketplaceRequests =
        marketplaceRequests.map((item) => {
          if (item.id === request.id) {
            return {
              ...item,
              status: "Agent Selected",
              selectedBidId:
                selectedBid.id,
              selectedAgentName:
                selectedAgent.name,
            };
          }

          return item;
        });

      localStorage.setItem(
        "marketplaceRequests",
        JSON.stringify(
          updatedMarketplaceRequests
        )
      );

      // =====================================================
      // MARK RELATED NOTIFICATIONS AS READ
      // =====================================================

      try {
        const savedNotifications =
          JSON.parse(
            localStorage.getItem(
              "smeNotifications"
            ) || "[]"
          );

        if (Array.isArray(savedNotifications)) {
          const updatedNotifications =
            savedNotifications.map(
              (notification) => {
                if (
                  notification.requestId ===
                  request.id
                ) {
                  return {
                    ...notification,
                    read: true,
                  };
                }

                return notification;
              }
            );

          localStorage.setItem(
            "smeNotifications",
            JSON.stringify(
              updatedNotifications
            )
          );

          setNotifications(
            updatedNotifications
          );
        }
      } catch (error) {
        console.error(
          "Failed to update notifications:",
          error
        );
      }

      // =====================================================
      // CLOSE MODAL
      // =====================================================

      setSelectedBid(null);

      /*
       * Give localStorage a moment to finish updating
       * before navigation.
       */

      setTimeout(() => {
        navigate("/shipment-confirmation");
      }, 400);
    } catch (error) {
      console.error(
        "Failed to accept bid:",
        error
      );

      alert(
        "Something went wrong while accepting this bid. Please try again."
      );

      setIsAccepting(false);
    }
  };

  // =========================================================
  // NAVIGATION
  // =========================================================

  const handleNavigation = (path) => {
    setMobileMenuOpen(false);
    setNotificationOpen(false);
    navigate(path);
  };

  // =========================================================
  // REQUEST NOT FOUND
  // =========================================================

  if (!request) {
    return (
      <div className="min-h-screen bg-[#F6F8FB] text-slate-900">
        {/* =====================================================
            SME NAVBAR
        ====================================================== */}

        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

            {/* LOGO */}
            <button
              onClick={() =>
                handleNavigation("/dashboard")
              }
              className="flex items-center gap-2"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#173B6C] text-white">
                <Package size={19} />
              </div>

              <span className="text-lg font-bold text-[#173563]">
                ImportEase
              </span>
            </button>

            {/* DESKTOP NAV */}
            <nav className="hidden items-center gap-1 lg:flex">
              <button
                onClick={() =>
                  handleNavigation("/dashboard")
                }
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Dashboard
              </button>

              <button
                onClick={() =>
                  handleNavigation("/hs-code-search")
                }
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                HS Code Search
              </button>

              <button
                onClick={() =>
                  handleNavigation("/import-calculator")
                }
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Calculator
              </button>

              <button
                onClick={() =>
                  handleNavigation("/find-agent")
                }
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Find Agent
              </button>

              <button
                onClick={() =>
                  handleNavigation("/shipments")
                }
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Shipments
              </button>
            </nav>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-2">

              {/* NOTIFICATIONS */}
              <button
                onClick={() => {
                  setNotificationOpen(
                    !notificationOpen
                  );
                  setMobileMenuOpen(false);
                }}
                className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100"
                aria-label="Notifications"
              >
                <Bell size={19} />

                {unreadNotifications.length >
                  0 && (
                  <span className="absolute right-1.5 top-1.5 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                    {unreadNotifications.length >
                    9
                      ? "9+"
                      : unreadNotifications.length}
                  </span>
                )}
              </button>

              {/* PROFILE */}
              <button
                onClick={() =>
                  handleNavigation("/profile")
                }
                className="hidden h-10 items-center gap-2 rounded-xl px-2 text-slate-600 hover:bg-slate-100 sm:flex"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <UserRound size={17} />
                </div>

                <span className="hidden text-sm font-medium md:block">
                  Profile
                </span>
              </button>

              {/* MOBILE MENU */}
              <button
                onClick={() => {
                  setMobileMenuOpen(
                    !mobileMenuOpen
                  );
                  setNotificationOpen(false);
                }}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden"
                aria-label="Menu"
              >
                {mobileMenuOpen ? (
                  <X size={21} />
                ) : (
                  <Menu size={21} />
                )}
              </button>
            </div>
          </div>

          {/* NOTIFICATION DROPDOWN */}
          {notificationOpen && (
            <div className="absolute right-4 top-[68px] z-50 w-[calc(100%-2rem)] max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl sm:right-6 sm:w-96">

              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <div>
                  <h3 className="text-sm font-bold text-[#173563]">
                    Notifications
                  </h3>

                  <p className="text-[11px] text-slate-400">
                    {unreadNotifications.length} unread
                  </p>
                </div>

                {unreadNotifications.length >
                  0 && (
                  <button
                    onClick={
                      markAllNotificationsRead
                    }
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-[380px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-5 py-10 text-center">
                    <Bell
                      size={25}
                      className="mx-auto text-slate-300"
                    />

                    <p className="mt-3 text-sm font-semibold text-slate-600">
                      No notifications
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      New agent bids will appear here.
                    </p>
                  </div>
                ) : (
                  notifications.map(
                    (notification) => (
                      <button
                        key={
                          notification.id
                        }
                        onClick={() =>
                          handleNotificationClick(
                            notification
                          )
                        }
                        className={`flex w-full gap-3 border-b border-slate-100 px-4 py-4 text-left transition hover:bg-slate-50 ${
                          !notification.read
                            ? "bg-blue-50/50"
                            : "bg-white"
                        }`}
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                          <Bell size={16} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs font-bold text-[#173563]">
                              {notification.title ||
                                "New Notification"}
                            </p>

                            {!notification.read && (
                              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                            )}
                          </div>

                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            {notification.message ||
                              "You have a new update."}
                          </p>

                          {notification.createdAt && (
                            <p className="mt-1 text-[10px] text-slate-400">
                              {new Date(
                                notification.createdAt
                              ).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </button>
                    )
                  )
                )}
              </div>

              <div className="border-t border-slate-100 p-3">
                <button
                  onClick={() =>
                    handleNavigation(
                      "/notifications"
                    )
                  }
                  className="w-full rounded-xl bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  View all notifications
                </button>
              </div>
            </div>
          )}

          {/* MOBILE NAV */}
          {mobileMenuOpen && (
            <div className="border-t border-slate-100 bg-white lg:hidden">
              <nav className="mx-auto max-w-7xl space-y-1 px-4 py-3 sm:px-6">

                <button
                  onClick={() =>
                    handleNavigation(
                      "/dashboard"
                    )
                  }
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  <LayoutDashboard
                    size={18}
                  />
                  Dashboard
                </button>

                <button
                  onClick={() =>
                    handleNavigation(
                      "/hs-code-search"
                    )
                  }
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  <Search size={18} />
                  HS Code Search
                </button>

                <button
                  onClick={() =>
                    handleNavigation(
                      "/import-calculator"
                    )
                  }
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  <DollarSign size={18} />
                  Import Calculator
                </button>

                <button
                  onClick={() =>
                    handleNavigation(
                      "/find-agent"
                    )
                  }
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  <UserCheck size={18} />
                  Find Agent
                </button>

                <button
                  onClick={() =>
                    handleNavigation(
                      "/shipments"
                    )
                  }
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  <Package size={18} />
                  My Shipments
                </button>

                <button
                  onClick={() =>
                    handleNavigation(
                      "/profile"
                    )
                  }
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  <UserRound size={18} />
                  Profile
                </button>

                <button
                  onClick={() =>
                    handleNavigation(
                      "/settings"
                    )
                  }
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  <Settings size={18} />
                  Settings
                </button>

                <div className="my-2 border-t border-slate-100" />

                <button
                  onClick={() =>
                    handleNavigation(
                      "/signin"
                    )
                  }
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-red-500 hover:bg-red-50"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </nav>
            </div>
          )}
        </header>

        {/* REQUEST NOT FOUND CONTENT */}
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10 sm:px-6">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">

            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <XCircle
                size={28}
                className="text-red-500"
              />
            </div>

            <h1 className="text-xl font-bold text-[#173563]">
              Shipment request not found
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              We couldn't find the shipment request
              you're trying to review.
            </p>

            <button
              onClick={() =>
                navigate("/dashboard")
              }
              className="mt-6 w-full rounded-xl bg-[#173B6C] px-5 py-3 text-sm font-semibold text-white hover:bg-[#12315B]"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN PAGE
  // =========================================================

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-900">

      {/* =====================================================
          SME NAVBAR
      ====================================================== */}

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">

        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* LOGO */}
          <button
            onClick={() =>
              handleNavigation("/dashboard")
            }
            className="flex shrink-0 items-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#173B6C] text-white">
              <Package size={19} />
            </div>

            <span className="text-lg font-bold text-[#173563]">
              ImportEase
            </span>
          </button>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden items-center gap-1 lg:flex">

            <button
              onClick={() =>
                handleNavigation(
                  "/dashboard"
                )
              }
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
            >
              Dashboard
            </button>

            <button
              onClick={() =>
                handleNavigation(
                  "/hs-code-search"
                )
              }
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
            >
              HS Code Search
            </button>

            <button
              onClick={() =>
                handleNavigation(
                  "/import-calculator"
                )
              }
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
            >
              Calculator
            </button>

            <button
              onClick={() =>
                handleNavigation(
                  "/find-agent"
                )
              }
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
            >
              Find Agent
            </button>

            <button
              onClick={() =>
                handleNavigation(
                  "/shipments"
                )
              }
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
            >
              Shipments
            </button>

          </nav>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-2">

            {/* NOTIFICATIONS */}
            <div className="relative">

              <button
                onClick={() => {
                  setNotificationOpen(
                    !notificationOpen
                  );
                  setMobileMenuOpen(false);
                }}
                className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100"
                aria-label="Notifications"
              >
                <Bell size={19} />

                {unreadNotifications.length >
                  0 && (
                  <span className="absolute right-1.5 top-1.5 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                    {unreadNotifications.length >
                    9
                      ? "9+"
                      : unreadNotifications.length}
                  </span>
                )}
              </button>

              {/* NOTIFICATION DROPDOWN */}
              {notificationOpen && (
                <div className="absolute right-0 top-12 z-50 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl sm:w-96">

                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">

                    <div>
                      <h3 className="text-sm font-bold text-[#173563]">
                        Notifications
                      </h3>

                      <p className="text-[11px] text-slate-400">
                        {unreadNotifications.length} unread
                      </p>
                    </div>

                    {unreadNotifications.length >
                      0 && (
                      <button
                        onClick={
                          markAllNotificationsRead
                        }
                        className="text-[11px] font-semibold text-blue-600 hover:text-blue-700"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-[380px] overflow-y-auto">

                    {notifications.length ===
                    0 ? (
                      <div className="px-5 py-10 text-center">

                        <Bell
                          size={25}
                          className="mx-auto text-slate-300"
                        />

                        <p className="mt-3 text-sm font-semibold text-slate-600">
                          No notifications
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          New agent bids will
                          appear here.
                        </p>

                      </div>
                    ) : (
                      notifications.map(
                        (notification) => (
                          <button
                            key={
                              notification.id
                            }
                            onClick={() =>
                              handleNotificationClick(
                                notification
                              )
                            }
                            className={`flex w-full gap-3 border-b border-slate-100 px-4 py-4 text-left transition hover:bg-slate-50 ${
                              !notification.read
                                ? "bg-blue-50/50"
                                : "bg-white"
                            }`}
                          >

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                              <Bell size={16} />
                            </div>

                            <div className="min-w-0 flex-1">

                              <div className="flex items-start justify-between gap-2">

                                <p className="text-xs font-bold text-[#173563]">
                                  {notification.title ||
                                    "New Notification"}
                                </p>

                                {!notification.read && (
                                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                                )}

                              </div>

                              <p className="mt-1 text-xs leading-5 text-slate-500">
                                {notification.message ||
                                  "You have a new update."}
                              </p>

                              {notification.createdAt && (
                                <p className="mt-1 text-[10px] text-slate-400">
                                  {new Date(
                                    notification.createdAt
                                  ).toLocaleString()}
                                </p>
                              )}

                            </div>

                          </button>
                        )
                      )
                    )}

                  </div>

                  <div className="border-t border-slate-100 p-3">

                    <button
                      onClick={() =>
                        handleNavigation(
                          "/notifications"
                        )
                      }
                      className="w-full rounded-xl bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
                    >
                      View all notifications
                    </button>

                  </div>

                </div>
              )}
            </div>

            {/* PROFILE */}
            <button
              onClick={() =>
                handleNavigation(
                  "/profile"
                )
              }
              className="hidden h-10 items-center gap-2 rounded-xl px-2 text-slate-600 transition hover:bg-slate-100 sm:flex"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <UserRound size={17} />
              </div>

              <span className="hidden text-sm font-medium md:block">
                Profile
              </span>
            </button>

            {/* MOBILE MENU */}
            <button
              onClick={() => {
                setMobileMenuOpen(
                  !mobileMenuOpen
                );
                setNotificationOpen(false);
              }}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 lg:hidden"
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <X size={21} />
              ) : (
                <Menu size={21} />
              )}
            </button>

          </div>
        </div>

        {/* =====================================================
            MOBILE NAVIGATION
        ====================================================== */}

        {mobileMenuOpen && (
          <div className="border-t border-slate-100 bg-white lg:hidden">

            <nav className="mx-auto max-w-7xl space-y-1 px-4 py-3 sm:px-6">

              <button
                onClick={() =>
                  handleNavigation(
                    "/dashboard"
                  )
                }
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                <LayoutDashboard
                  size={18}
                />
                Dashboard
              </button>

              <button
                onClick={() =>
                  handleNavigation(
                    "/hs-code-search"
                  )
                }
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                <Search size={18} />
                HS Code Search
              </button>

              <button
                onClick={() =>
                  handleNavigation(
                    "/import-calculator"
                  )
                }
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                <DollarSign
                  size={18}
                />
                Import Calculator
              </button>

              <button
                onClick={() =>
                  handleNavigation(
                    "/find-agent"
                  )
                }
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                <UserCheck
                  size={18}
                />
                Find Agent
              </button>

              <button
                onClick={() =>
                  handleNavigation(
                    "/shipments"
                  )
                }
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                <Package size={18} />
                My Shipments
              </button>

              <button
                onClick={() =>
                  handleNavigation(
                    "/profile"
                  )
                }
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                <UserRound
                  size={18}
                />
                Profile
              </button>

              <button
                onClick={() =>
                  handleNavigation(
                    "/settings"
                  )
                }
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                <Settings size={18} />
                Settings
              </button>

              <div className="my-2 border-t border-slate-100" />

              <button
                onClick={() =>
                  handleNavigation(
                    "/signin"
                  )
                }
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-red-500 hover:bg-red-50"
              >
                <LogOut size={18} />
                Sign Out
              </button>

            </nav>
          </div>
        )}
      </header>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-7 lg:px-8 lg:py-9">

        {/* ===================================================
            PAGE HEADER
        ==================================================== */}

        <section className="mb-6">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex min-w-0 items-start gap-3">

              <button
                onClick={() =>
                  navigate("/dashboard")
                }
                className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                aria-label="Back to dashboard"
              >
                <ArrowLeft
                  size={18}
                />
              </button>

              <div className="min-w-0">

                <h1 className="text-lg font-bold text-[#173563] sm:text-xl">
                  Review Agent Bids
                </h1>

                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Compare clearing agents and
                  choose the best offer
                </p>

              </div>
            </div>

            <div className="hidden shrink-0 items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 sm:flex">
              <ShieldCheck
                size={14}
              />
              Secure marketplace
            </div>

          </div>
        </section>

        {/* ===================================================
            PROGRESS
        ==================================================== */}

        <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:mb-7 sm:p-5">

          <div className="flex min-w-0 items-center">

            {/* STEP 1 */}

            <div className="flex shrink-0 items-center gap-2">

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white">
                <CheckCircle2
                  size={16}
                />
              </div>

              <span className="hidden text-xs font-semibold text-emerald-600 md:block">
                Describe Shipment
              </span>

            </div>

            <div className="mx-2 h-px min-w-[20px] flex-1 bg-emerald-200 sm:mx-3" />

            {/* STEP 2 */}

            <div className="flex shrink-0 items-center gap-2">

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#173B6C] text-xs font-bold text-white">
                2
              </div>

              <span className="hidden text-xs font-semibold text-[#173B6C] md:block">
                Review Bids
              </span>

            </div>

            <div className="mx-2 h-px min-w-[20px] flex-1 bg-slate-200 sm:mx-3" />

            {/* STEP 3 */}

            <div className="flex shrink-0 items-center gap-2">

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-400">
                3
              </div>

              <span className="hidden text-xs font-medium text-slate-400 md:block">
                Accept & Clear
              </span>

            </div>

          </div>
        </section>

        {/* ===================================================
            REQUEST SUMMARY
        ==================================================== */}

        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:mb-7 sm:p-6">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div className="min-w-0">

              <div className="flex flex-wrap items-center gap-2">

                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-700">
                  {request.id}
                </span>

                <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-700">
                  {request.urgency ||
                    "Medium"}{" "}
                  Priority
                </span>

              </div>

              <h2 className="mt-3 break-words text-xl font-bold text-[#173563] sm:text-2xl">
                {request.product ||
                  request.productDetails ||
                  "Import Shipment"}
              </h2>

              <p className="mt-1 break-words text-sm text-slate-500">
                {request.origin ||
                  "Origin not specified"}{" "}
                →{" "}
                {request.destination ||
                  "Colombo, Sri Lanka"}
              </p>

            </div>

            <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:grid-cols-3">

              <div className="rounded-xl bg-slate-50 px-4 py-3">

                <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                  Shipment Value
                </p>

                <p className="mt-1 text-sm font-bold text-slate-700">
                  $
                  {Number(
                    request.shipmentValue ||
                      request.declaredValue ||
                      0
                  ).toLocaleString()}
                </p>

              </div>

              <div className="rounded-xl bg-slate-50 px-4 py-3">

                <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                  HS Code
                </p>

                <p className="mt-1 break-all text-sm font-bold text-slate-700">
                  {request.hsCode ||
                    "Not classified"}
                </p>

              </div>

              <div className="rounded-xl bg-slate-50 px-4 py-3 min-[420px]:col-span-2 sm:col-span-1">

                <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                  Required By
                </p>

                <p className="mt-1 text-sm font-bold text-slate-700">
                  {request.requestedDate ||
                    "Within 7 days"}
                </p>

              </div>

            </div>
          </div>
        </section>

        {/* ===================================================
            BID HEADER
        ==================================================== */}

        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <h2 className="text-lg font-bold text-[#173563]">
              Agent bids
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {bids.length === 0
                ? "Waiting for clearing agents to respond."
                : `${bids.length} bid${
                    bids.length === 1
                      ? ""
                      : "s"
                  } received`}
            </p>

          </div>

          <p className="text-[10px] text-slate-400">
            Last updated{" "}
            {lastUpdated.toLocaleTimeString()}
          </p>

        </div>

        {/* ===================================================
            NO BIDS
        ==================================================== */}

        {bids.length === 0 ? (
          <section className="rounded-2xl border border-slate-200 bg-white px-5 py-12 text-center shadow-sm sm:px-6 sm:py-14">

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">

              <Loader2
                size={30}
                className="animate-spin text-blue-600"
              />

            </div>

            <h3 className="text-lg font-bold text-[#173563]">
              Waiting for agent bids
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Your shipment request has been
              published to the clearing agent
              marketplace. Agents can now review
              your request and submit their offers.
            </p>

            <div className="mx-auto mt-6 flex max-w-md items-start gap-3 rounded-xl bg-slate-50 p-4 text-left">

              <Clock3
                size={18}
                className="mt-0.5 shrink-0 text-blue-600"
              />

              <div>

                <p className="text-xs font-semibold text-slate-700">
                  This page updates automatically
                </p>

                <p className="mt-0.5 text-[11px] leading-5 text-slate-400">
                  You don't need to refresh while
                  waiting.
                </p>

              </div>
            </div>

            <button
              onClick={() =>
                navigate("/dashboard")
              }
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
            >
              Back to Dashboard
            </button>

          </section>
        ) : (

          /* =================================================
             BID LIST
          ================================================== */

          <div className="space-y-4">

            {sortedBids.map(
              (bid, index) => {

                const totalFee =
                  getTotal(bid);

                const isBestPrice =
                  index === 0;

                const isAccepted =
                  bid.status ===
                  "Accepted";

                return (
                  <article
                    key={bid.id}
                    className={`rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-md sm:p-6 ${
                      isAccepted
                        ? "border-emerald-300 ring-2 ring-emerald-100"
                        : "border-slate-200"
                    }`}
                  >

                    {/* BID TOP */}

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                      <div className="flex min-w-0 gap-3 sm:gap-4">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                          <Building2
                            size={22}
                          />
                        </div>

                        <div className="min-w-0">

                          <div className="flex flex-wrap items-center gap-2">

                            <h3 className="break-words text-base font-bold text-[#173563] sm:text-lg">
                              {bid.agencyName ||
                                bid.agentName ||
                                "Clearing Agent"}
                            </h3>

                            {isBestPrice && (
                              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600">
                                <span>
                                  ★
                                </span>
                                Best Price
                              </span>
                            )}

                            {isAccepted && (
                              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                                <CheckCircle2
                                  size={11}
                                />
                                Accepted
                              </span>
                            )}

                          </div>

                          <p className="mt-1 break-all text-xs text-slate-400">
                            Bid #{bid.id}
                          </p>

                        </div>
                      </div>

                      {/* TOTAL */}

                      <div className="w-full rounded-xl bg-blue-50 px-5 py-3 sm:w-auto lg:min-w-[180px] lg:text-right">

                        <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-500">
                          Total estimated fee
                        </p>

                        <p className="mt-1 text-xl font-bold text-[#173563]">
                          {formatCurrency(
                            totalFee
                          )}
                        </p>

                      </div>

                    </div>

                    {/* BID DETAILS */}

                    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">

                      <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">

                        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">

                          <DollarSign
                            size={14}
                          />

                          Clearance Fee

                        </div>

                        <p className="mt-2 text-sm font-bold text-slate-700">
                          {formatCurrency(
                            bid.clearanceFee
                          )}
                        </p>

                      </div>

                      <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">

                        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">

                          <DollarSign
                            size={14}
                          />

                          Additional Charges

                        </div>

                        <p className="mt-2 text-sm font-bold text-slate-700">
                          {formatCurrency(
                            bid.additionalCharges
                          )}
                        </p>

                      </div>

                      <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">

                        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">

                          <Clock3
                            size={14}
                          />

                          Processing Time

                        </div>

                        <p className="mt-2 text-sm font-bold text-slate-700">
                          {bid.processingTime ||
                            "Not specified"}
                        </p>

                      </div>

                    </div>

                    {/* MESSAGE */}

                    {bid.message && (
                      <div className="mt-4 rounded-xl border border-slate-100 bg-white p-4">

                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">

                          <MessageSquare
                            size={14}
                          />

                          Message from agent

                        </div>

                        <p className="mt-2 break-words text-sm leading-6 text-slate-600">
                          {bid.message}
                        </p>

                      </div>
                    )}

                    {/* ACTION */}

                    <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">

                      <div className="flex items-center gap-2 text-xs text-slate-400">

                        <UserCheck
                          size={14}
                        />

                        Submitted{" "}
                        {bid.createdAt
                          ? new Date(
                              bid.createdAt
                            ).toLocaleDateString()
                          : "recently"}

                      </div>

                      {!isAccepted && (
                        <button
                          onClick={() =>
                            setSelectedBid(
                              bid
                            )
                          }
                          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#173B6C] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#12315B] sm:w-auto"
                        >
                          Choose This Agent
                          <ArrowRight
                            size={16}
                          />
                        </button>
                      )}

                    </div>

                  </article>
                );
              }
            )}

          </div>
        )}

        {/* ===================================================
            FOOTER
        ==================================================== */}

        <div className="mt-7 flex items-start justify-center gap-2 px-4 text-center text-[10px] leading-5 text-slate-400">

          <ShieldCheck
            size={13}
            className="mt-0.5 shrink-0"
          />

          <span>
            Agent bids are compared using the
            information submitted through the
            ImportEase marketplace.
          </span>

        </div>

      </main>

      {/* =====================================================
          ACCEPT BID MODAL
      ====================================================== */}

      {selectedBid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-3 sm:p-4">

          <div className="flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* MODAL HEADER */}

            <div className="shrink-0 border-b border-slate-100 px-5 py-4 sm:px-6 sm:py-5">

              <div className="flex items-start justify-between gap-4">

                <div className="min-w-0">

                  <h2 className="text-lg font-bold text-[#173563]">
                    Confirm Agent Selection
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Review the offer before accepting
                    it.
                  </p>

                </div>

                <button
                  onClick={() =>
                    setSelectedBid(null)
                  }
                  disabled={isAccepting}
                  className="shrink-0 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>

              </div>
            </div>

            {/* MODAL BODY */}

            <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">

              <div className="space-y-4">

                <div className="rounded-xl bg-blue-50 p-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600">
                      <Building2
                        size={19}
                      />
                    </div>

                    <div className="min-w-0">

                      <p className="break-words text-sm font-bold text-[#173563]">
                        {selectedBid.agencyName ||
                          selectedBid.agentName ||
                          "Clearing Agent"}
                      </p>

                      <p className="break-all text-xs text-blue-600">
                        Bid #{selectedBid.id}
                      </p>

                    </div>

                  </div>
                </div>

                <div className="space-y-3">

                  <div className="flex items-center justify-between gap-4 text-sm">

                    <span className="text-slate-500">
                      Clearance fee
                    </span>

                    <span className="shrink-0 font-semibold text-slate-700">
                      {formatCurrency(
                        selectedBid.clearanceFee
                      )}
                    </span>

                  </div>

                  <div className="flex items-center justify-between gap-4 text-sm">

                    <span className="text-slate-500">
                      Additional charges
                    </span>

                    <span className="shrink-0 font-semibold text-slate-700">
                      {formatCurrency(
                        selectedBid.additionalCharges
                      )}
                    </span>

                  </div>

                  <div className="border-t border-slate-100 pt-3">

                    <div className="flex items-center justify-between gap-4">

                      <span className="font-semibold text-slate-700">
                        Total
                      </span>

                      <span className="shrink-0 text-lg font-bold text-[#173B6C]">
                        {formatCurrency(
                          getTotal(
                            selectedBid
                          )
                        )}
                      </span>

                    </div>

                  </div>

                </div>

                <div className="rounded-xl bg-slate-50 p-4">

                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">

                    <Clock3
                      size={14}
                    />

                    Processing time

                  </div>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {selectedBid.processingTime ||
                      "Not specified"}
                  </p>

                </div>

                <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">

                  <p className="text-xs leading-5 text-amber-700">
                    Once you accept this bid, the
                    other bids for this shipment
                    will no longer be available and
                    this agent will be selected for
                    your shipment.
                  </p>

                </div>

              </div>

            </div>

            {/* MODAL ACTIONS */}

            <div className="shrink-0 flex flex-col-reverse gap-3 border-t border-slate-100 p-5 sm:flex-row sm:p-6">

              <button
                onClick={() =>
                  setSelectedBid(null)
                }
                disabled={isAccepting}
                className="flex-1 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={
                  handleAcceptBid
                }
                disabled={isAccepting}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#173B6C] px-5 py-3 text-sm font-semibold text-white hover:bg-[#12315B] disabled:cursor-not-allowed disabled:opacity-70"
              >

                {isAccepting ? (
                  <>
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                    Accepting...
                  </>
                ) : (
                  <>
                    <CheckCircle2
                      size={16}
                    />
                    Accept Bid
                  </>
                )}

              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default ReviewBids;