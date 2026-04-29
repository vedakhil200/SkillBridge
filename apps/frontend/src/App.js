import "./style.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ChatWidget from "./components/ChatWidget"; // ✅ move to components

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Explore from "./pages/Explore";
import Resources from "./pages/Resources";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  return (
    <Router>

      {/* ✅ Navbar on all pages */}
      <Navbar />

      {/* ✅ Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>

      {/* ✅ AI Chat Widget (global, floating) */}
      <ChatWidget />

    </Router>
  );
}

export default App;