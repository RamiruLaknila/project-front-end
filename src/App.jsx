import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import AgentSignIn from "./pages/AgentSignIn";
import SMEDashboard from "./pages/SMEDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/agent-signin" element={<AgentSignIn />} />
        <Route path="/dashboard" element={<SMEDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
