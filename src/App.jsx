import { BrowserRouter, Routes, Route } from "react-router-dom";

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
import AgentPending from "./pages/AgentPending";
import AgencyAgents from "./pages/AgencyAgents";
import AgentDashboard from "./pages/AgentDashboard";
import AgencyInvite from "./pages/AgencyInvite";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import AgencyCreate from "./pages/AgencyCreate";

// Clearing Agent
import AgentSignIn from "./pages/AgentSignIn";
import AgencyChoice from "./pages/AgencyChoice";
import AgentSignUp from "./pages/AgentSignUp";
import AgencyCreated from "./pages/AgencyCreated";
import AgentAdminDashboard from "./pages/AgentAdminDashboard";
import JoinAgency from "./pages/JoinAgency";
import AgentMarketplace from "./pages/AgentMarketplace";
import AgencyShipments from "./pages/AgencyShipments";
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            MAIN / SME
        ========================= */}

        <Route path="/" element={<Home />} />

        <Route path="/signin" element={<SignIn />} />

        <Route path="/signup" element={<SignUp />} />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />
        <Route
  path="/agent-dashboard"
  element={<AgentDashboard />}
/>
        <Route
  path="/complete-profile"
  element={<CompleteProfile />}
/>

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* =========================
            IMPORT
        ========================= */}

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

        {/* =========================
            SME AGENTS
        ========================= */}

        <Route
          path="/find-agent"
          element={<FindAgent />}
        />

        <Route
          path="/shipment-confirmation"
          element={<ShipmentConfirmation />}
        />
        <Route
  path="/agency-create"
  element={<AgencyCreate />}
/>
<Route
  path="/agency-created"
  element={<AgencyCreated />}
/>
        {/* =========================
            SHIPMENTS
        ========================= */}

        <Route
          path="/shipments"
          element={<Shipments />}
        />

        <Route
          path="/track-shipment"
          element={<TrackShipment />}
        />

        {/* =========================
            DOCUMENTS
        ========================= */}

        <Route
          path="/documents"
          element={<Documents />}
        />

        {/* =========================
            PROFILE
        ========================= */}

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />

        {/* =========================
            CLEARING AGENT
        ========================= */}

        <Route
          path="/agent-signin"
          element={<AgentSignIn />}
        />

        <Route
          path="/agency-choice"
          element={<AgencyChoice />}
        />

        <Route
          path="/agent-signup"
          element={<AgentSignUp />}
        />
        <Route
          path="/agent-admin-dashboard"
          element={<AgentAdminDashboard />}

/>
<Route
  path="/agency-agents"
  element={<AgencyAgents />}
/>
<Route
  path="/agent-pending"
  element={<AgentPending />}
/>
<Route
  path="/join-agency"
  element={<JoinAgency />}
/>
<Route
  path="/agency-invite"
  element={<AgencyInvite />}
/>
<Route
  path="/agent-marketplace"
  element={<AgentMarketplace />}
/>
<Route
  path="/agency-shipments"
  element={<AgencyShipments />}
/>
<Route
  path="/agent-shipments"
  element={<AgencyShipments />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
