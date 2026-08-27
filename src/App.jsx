import { BrowserRouter, Routes, Route } from "react-router-dom";

// =========================
// SME
// =========================
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

// =========================
// EXISTING CLEARING AGENT
// =========================
import AgentSignIn from "./pages/AgentSignIn";
import AgentSignUp from "./pages/AgentSignUp";
import AgencyChoice from "./pages/AgencyChoice";
import AgencyCreate from "./pages/AgencyCreate";
import AgencyCreated from "./pages/AgencyCreated";
import JoinAgency from "./pages/JoinAgency";

import AgentPending from "./pages/AgentPending";
import AgentDashboard from "./pages/AgentDashboard";

import AgencyAgents from "./pages/AgencyAgents";
import AgencyInvite from "./pages/AgencyInvite";
import AgentMarketplace from "./pages/AgentMarketplace";
import AgencyShipments from "./pages/AgencyShipments";
import AgentAdminDashboard from "./pages/AgentAdminDashboard";
import AgencyReview from "./pages/AgencyReview";
import AgentMyBids from "./pages/AgentMyBids";
import AgentBids from "./pages/AgentBids";
import ReviewBids from "./pages/ReviewBids";
import IndividualAgentSignup from "./pages/IndividualAgentSignup";
import IndividualAgentVerification from "./pages/IndividualAgentVerification";
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
            SME PROFILE
        ===================================================== */}
        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />

        {/* =====================================================
            CLEARING AGENT AUTH
        ===================================================== */}

        {/* Agent Sign In */}
        <Route
          path="/agent-signin"
          element={<AgentSignIn />}
        />

        {/* Create Agent Account */}
        <Route
          path="/agent-signup"
          element={<AgentSignUp />}
        />

        {/* =====================================================
            CREATE AGENT ACCOUNT → CHOOSE TYPE
        ===================================================== */}

        <Route
          path="/agency-choice"
          element={<AgencyChoice />}
        />

        {/* =====================================================
            AGENCY / COMPANY
        ===================================================== */}

        {/* Register New Agency */}
        <Route
          path="/agency-create"
          element={<AgencyCreate />}
        />

        {/* Agency Created / Application Submitted */}
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
            AGENT PENDING
        ===================================================== */}

        <Route
          path="/agent-pending"
          element={<AgentPending />}
        />
        <Route
          path="/agency-review"
          element={<AgencyReview />}
        />
        <Route
          path="/agent-my-bids"
          element={<AgentMyBids />}
        />
        {/* =====================================================
            AGENCY ADMIN
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

        <Route
          path="/agency-shipments"
          element={<AgencyShipments />}
        />

        {/* =====================================================
            AGENT DASHBOARD
        ===================================================== */}

        <Route
          path="/agent-dashboard"
          element={<AgentDashboard />}
        />

        <Route
          path="/agent-marketplace"
          element={<AgentMarketplace />}
        />

        {/* =====================================================
            COMPATIBILITY ROUTE
        ===================================================== */}

        <Route
          path="/agent-shipments"
          element={<AgencyShipments />}
        />
        <Route
          path="/agent-bids"
          element={<AgentBids />}
        />
        <Route
          path="/review-bids"
          element={<ReviewBids />}
        />
        <Route
          path="/agent-signup"
          element={<AgentSignUp />}
/>
<Route
  path="/individual-agent-signup"
  element={<IndividualAgentSignup />}
/>
<Route
  path="/individual-agent-verification"
  element={<IndividualAgentVerification />}
/>
<Route
  path="/signup"
  element={<SignUp />}
/>
<Route
  path="/sme-signup"
  element={<SMESignUp />}
/>
<Route path="/messages" element={<Messages />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;