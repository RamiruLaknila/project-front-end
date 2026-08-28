import { BrowserRouter, Routes, Route } from "react-router-dom";

// =====================================================
// SME
// =====================================================
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import NewImport from "./pages/NewImport";
import HSCodeSearch from "./pages/HSCodeSearch";
import Calculator from "./pages/Calculator";
import FindAgent from "./pages/FindAgent";
import ShipmentConfirmation from "./pages/ShipmentConfirmation";
import Shipments from "./pages/Shipments";
import TrackShipment from "./pages/TrackShipment";
import Documents from "./pages/Documents";
import CompleteProfile from "./pages/CompleteProfile";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

// =====================================================
// CLEARING AGENT AUTH
// =====================================================
import AgentSignIn from "./pages/AgentSignIn";
import AgentSignUp from "./pages/AgentSignUp";
import AgencyChoice from "./pages/AgencyChoice";
import AgencyCreate from "./pages/AgencyCreate";
import AgencyCreated from "./pages/AgencyCreated";
import JoinAgency from "./pages/JoinAgency";
import AgentPending from "./pages/AgentPending";

// =====================================================
// CLEARING AGENT DASHBOARD
// =====================================================
import AgentDashboard from "./pages/AgentDashboard";

// =====================================================
// AGENCY ADMIN
// =====================================================
import AgencyAgents from "./pages/AgencyAgents";
import AgencyInvite from "./pages/AgencyInvite";
import AgentAdminDashboard from "./pages/AgentAdminDashboard";
import AgencyReview from "./pages/AgencyReview";
import AgencyWaitingApproval from "./pages/AgencyWaitingApproval";

// =====================================================
// AGENT FEATURES
// =====================================================
import AgentRequests from "./pages/AgentRequests";
import AgentMarketplace from "./pages/AgentMarketplace";
import AgentMyBids from "./pages/AgentMyBids";
import AgentBids from "./pages/AgentBids";
import ReviewBids from "./pages/ReviewBids";

// =====================================================
// AGENT SHIPMENTS
// IMPORTANT: This must be AgentShipments.jsx
// and it must have: export default AgentShipments;
// =====================================================
import AgentShipments from "./pages/AgentShipments";

// =====================================================
// INDIVIDUAL AGENT
// =====================================================
import IndividualAgentSignup from "./pages/IndividualAgentSignup";
import IndividualAgentVerification from "./pages/IndividualAgentVerification";

// =====================================================
// SME SIGNUP / MESSAGES
// =====================================================
import SMESignUp from "./pages/SMESignUp";
import Messages from "./pages/Messages";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =====================================================
            HOME
        ===================================================== */}

        <Route
          path="/"
          element={<Home />}
        />


        {/* =====================================================
            SME AUTH
        ===================================================== */}

        <Route
          path="/signin"
          element={<SignIn />}
        />

        <Route
          path="/signup"
          element={<SignUp />}
        />

        <Route
          path="/sme-signup"
          element={<SMESignUp />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/complete-profile"
          element={<CompleteProfile />}
        />


        {/* =====================================================
            SME DASHBOARD
        ===================================================== */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />


        {/* =====================================================
            SME IMPORT
        ===================================================== */}

        <Route
          path="/new-import"
          element={<NewImport />}
        />

        <Route
          path="/hs-code-search"
          element={<HSCodeSearch />}
        />

        <Route
          path="/calculator"
          element={<Calculator />}
        />


        {/* =====================================================
            SME CLEARING AGENT
        ===================================================== */}

        <Route
          path="/find-agent"
          element={<FindAgent />}
        />

        <Route
          path="/shipment-confirmation"
          element={<ShipmentConfirmation />}
        />


        {/* =====================================================
            SME SHIPMENTS
        ===================================================== */}

        <Route
          path="/shipments"
          element={<Shipments />}
        />

        <Route
          path="/track-shipment"
          element={<TrackShipment />}
        />


        {/* =====================================================
            SME DOCUMENTS
        ===================================================== */}

        <Route
          path="/documents"
          element={<Documents />}
        />


        {/* =====================================================
            SME PROFILE / SETTINGS
        ===================================================== */}

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />

        <Route
          path="/messages"
          element={<Messages />}
        />


        {/* =====================================================
            CLEARING AGENT AUTH
        ===================================================== */}

        <Route
          path="/agent-signin"
          element={<AgentSignIn />}
        />

        <Route
          path="/agent-signup"
          element={<AgentSignUp />}
        />


        {/* =====================================================
            AGENCY CHOICE
        ===================================================== */}

        <Route
          path="/agency-choice"
          element={<AgencyChoice />}
        />


        {/* =====================================================
            CREATE AGENCY
        ===================================================== */}

        <Route
          path="/agency-create"
          element={<AgencyCreate />}
        />

        <Route
          path="/agency-created"
          element={<AgencyCreated />}
        />


        {/* =====================================================
            JOIN EXISTING AGENCY
        ===================================================== */}

        <Route
          path="/join-agency"
          element={<JoinAgency />}
        />


        {/* =====================================================
            AGENT PENDING / APPROVAL
        ===================================================== */}

        <Route
          path="/agent-pending"
          element={<AgentPending />}
        />

        <Route
          path="/waiting-for-approval"
          element={<AgencyWaitingApproval />}
        />

        <Route
          path="/agency-review"
          element={<AgencyReview />}
        />


        {/* =====================================================
            INDIVIDUAL AGENT
        ===================================================== */}

        <Route
          path="/individual-agent-signup"
          element={<IndividualAgentSignup />}
        />

        <Route
          path="/individual-agent-verification"
          element={<IndividualAgentVerification />}
        />


        {/* =====================================================
            CLEARING AGENT DASHBOARD
        ===================================================== */}

        <Route
          path="/agent-dashboard"
          element={<AgentDashboard />}
        />


        {/* =====================================================
            AGENT SME REQUESTS
        ===================================================== */}

        <Route
          path="/agent-requests"
          element={<AgentRequests />}
        />


        {/* =====================================================
            AGENT MARKETPLACE
        ===================================================== */}

        <Route
          path="/agent-marketplace"
          element={<AgentMarketplace />}
        />


        {/* =====================================================
            AGENT BIDS
        ===================================================== */}

        <Route
          path="/agent-my-bids"
          element={<AgentMyBids />}
        />

        <Route
          path="/agent-bids"
          element={<AgentBids />}
        />

        <Route
          path="/review-bids"
          element={<ReviewBids />}
        />


        {/* =====================================================
            AGENCY ADMIN DASHBOARD
        ===================================================== */}

        <Route
          path="/agent-admin-dashboard"
          element={<AgentAdminDashboard />}
        />

        <Route
          path="/agency-agents"
          element={<AgencyAgents />}
        />

        <Route
          path="/agency-invite"
          element={<AgencyInvite />}
        />


        {/* =====================================================
            AGENT SHIPMENTS
            =====================================================
            
            AgentDashboard.jsx
                  ↓
            /agent-shipments
                  ↓
            AgentShipments.jsx

            DO NOT use AgencyShipments here.
        ===================================================== */}

      <Route
  path="/agent-shipments"
  element={<AgentShipments />}
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;