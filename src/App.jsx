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


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/signin" element={<SignIn />} />

        <Route path="/signup" element={<SignUp />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/new-import" element={<NewImport />} />
        <Route
                  path="/hs-code-search"
                  element={<HSCodeSearch />}
        
/>
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/find-agent" element={<FindAgent />} />
        <Route
  path="/shipments"
  element={<Shipments />}
/>
        <Route
  path="/shipment-confirmation"
  element={<ShipmentConfirmation />}
  
/>
<Route
  path="/track-shipment"
  element={<TrackShipment />}
/>
<Route
  path="/documents"
  element={<Documents />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;