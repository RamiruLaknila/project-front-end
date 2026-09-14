import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import RequireAuth from "./components/RequireAuth";
import RequireSmeAccess from "./components/RequireSmeAccess";
import ScrollToTop from "./components/ScrollToTop";
import AdminAgentApprovals from "./pages/AdminAgentApprovals";

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
import SMEGuest from "./pages/SMEGuest";
import Notifications from "./pages/Notifications";
import IndividualAgentSettings from "./pages/IndividualAgentSettings";
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
import IndividualAgentDashboard from "./pages/IndividualAgentDashboard";

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
import IndividualAgentRequests from "./pages/IndividualAgentRequests";
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
import SMESignUpSuccess from "./pages/SMESignUpSuccess";
import IndividualAgentBids from "./pages/IndividualAgentBids";
import AgentAdminSettings from "./pages/AgentAdminSettings";
import IndividualAgentShipments from "./pages/IndividualAgentShipments";
import AgentSettings from "./pages/AgentSettings";
import AgentNotifications from "./pages/AgentNotifications";
import IndividualAgentNotifications from "./pages/IndividualAgentNotifications";
import AgentAdminNotifications from "./pages/AgentAdminNotifications";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <Routes>

        {/* =====================================================
            HOME
        ===================================================== */}

        <Route
          path="/"
          element={<Home />}
        />
       <Route
  path="/agent-admin-settings"
  element={<AgentAdminSettings />}
/>
        <Route
          path="/sme-guest"
          element={<SMEGuest />}
        />
        <Route
  path="/individual-agent-shipments"
  element={<IndividualAgentShipments />}
/>
        <Route
  path="/individual-agent-bids"
  element={<IndividualAgentBids />}
/>

<Route
  path="/agent-settings"
  element={<AgentSettings />}
/>
<Route
  path="/individual-agent-settings"
  element={<IndividualAgentSettings />}
/>
        <Route
  path="/individual-agent-dashboard"
  element={
    <RequireAuth roles={["clearing_agent"]}>
      <IndividualAgentDashboard />
    </RequireAuth>
  }
/>
<Route
  path="/individual-agent-requests"
  element={<IndividualAgentRequests />}
/>
        


        {/* =====================================================
            SME AUTH
        ===================================================== */}

        <Route
          path="/signin"
          element={<SignIn />}
        />
        <Route
  path="/sme-signup-success"
  element={<SMESignUpSuccess />}
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
          element={
            <RequireAuth>
              <CompleteProfile />
            </RequireAuth>
          }
        />


        {/* =====================================================
            SME DASHBOARD
        ===================================================== */}

        <Route
          path="/dashboard"
          element={
            <RequireAuth roles={["importer"]}>
              <Dashboard />
            </RequireAuth>
          }
        />


        {/* =====================================================
            SME IMPORT
        ===================================================== */}

        <Route
          path="/new-import"
          element={
            <RequireSmeAccess pageName="Starting a new import">
              <NewImport />
            </RequireSmeAccess>
          }
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
          element={
            <RequireSmeAccess pageName="Find Agent">
              <FindAgent />
            </RequireSmeAccess>
          }
        />

        <Route
          path="/shipment-confirmation"
          element={
            <RequireSmeAccess pageName="Shipment confirmation">
              <ShipmentConfirmation />
            </RequireSmeAccess>
          }
        />


        {/* =====================================================
            SME SHIPMENTS
        ===================================================== */}

        <Route
          path="/shipments"
          element={
            <RequireSmeAccess pageName="Shipments">
              <Shipments />
            </RequireSmeAccess>
          }
        />

        <Route
          path="/track-shipment"
          element={
            <RequireSmeAccess pageName="Track Shipment">
              <TrackShipment />
            </RequireSmeAccess>
          }
        />


        {/* =====================================================
            SME DOCUMENTS
        ===================================================== */}

        <Route
          path="/documents"
          element={
            <RequireSmeAccess pageName="Documents">
              <Documents />
            </RequireSmeAccess>
          }
        />


        {/* =====================================================
            SME PROFILE / SETTINGS
        ===================================================== */}

        <Route
          path="/profile"
          element={
            <RequireSmeAccess pageName="Profile">
              <Profile />
            </RequireSmeAccess>
          }
        />

        <Route
          path="/settings"
          element={
            <RequireSmeAccess pageName="Settings">
              <Settings />
            </RequireSmeAccess>
          }
        />

        <Route
          path="/messages"
          element={
            <RequireSmeAccess pageName="Messages">
              <Messages />
            </RequireSmeAccess>
          }
        />

        <Route
          path="/notifications"
          element={
            <RequireSmeAccess pageName="Notifications">
              <Notifications />
            </RequireSmeAccess>
          }
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
          element={
            <RequireAuth roles={["clearing_agent"]} allowPendingAgent>
              <AgentPending />
            </RequireAuth>
          }
        />

        <Route
          path="/admin/agent-approvals"
          element={
            <RequireAuth platformAdmin>
              <AdminAgentApprovals />
            </RequireAuth>
          }
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
          element={
            <RequireAuth roles={["clearing_agent"]} allowPendingAgent>
              <IndividualAgentVerification />
            </RequireAuth>
          }
        />


        {/* =====================================================
            CLEARING AGENT DASHBOARD
        ===================================================== */}

        <Route
          path="/agent-dashboard"
          element={
            <RequireAuth roles={["clearing_agent"]}>
              <AgentDashboard />
            </RequireAuth>
          }
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
          element={
            <RequireAuth roles={["clearing_agent"]}>
              <AgentAdminDashboard />
            </RequireAuth>
          }
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

        {/* =====================================================
            NOTIFICATIONS
        ===================================================== */}

        <Route
          path="/agent-notifications"
          element={<AgentNotifications />}
        />

        <Route
          path="/individual-agent-notifications"
          element={<IndividualAgentNotifications />}
        />

        <Route
          path="/agent-admin-notifications"
          element={<AgentAdminNotifications />}
        />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
