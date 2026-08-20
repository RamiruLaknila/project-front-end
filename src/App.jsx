import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import NewImport from "./pages/NewImport";
import HSCodeSearch from "./pages/HSCodeSearch";
import Calculator from "./pages/Calculator";
import FindAgent from "./pages/FindAgent";
import ShipmentConfirmation from "./pages/ShipmentConfirmation";
import Shipments from "./pages/Shipments";
import TrackShipment from "./pages/TrackShipment";
import Documents from "./pages/Documents";

// Profile & Settings
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            MAIN PAGES
        ========================= */}

        <Route path="/" element={<Home />} />

        <Route path="/signin" element={<SignIn />} />

        <Route path="/signup" element={<SignUp />} />

        <Route path="/dashboard" element={<Dashboard />} />

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
            AGENTS
        ========================= */}

        <Route
          path="/find-agent"
          element={<FindAgent />}
        />

        <Route
          path="/shipment-confirmation"
          element={<ShipmentConfirmation />}
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

        {/* =========================
            SETTINGS
        ========================= */}

        <Route
          path="/settings"
          element={<Settings />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;