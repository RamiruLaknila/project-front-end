import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import AgentSignIn from "./pages/AgentSignIn";
import SMEDashboard from "./pages/SMEDashboard";
import HSCodeSearch from "./pages/HSCodeSearch";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/agent-signin" element={<AgentSignIn />} />
        <Route path="/dashboard" element={<SMEDashboard />} />
        <Route path="/hs-search" element={<HSCodeSearch />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
