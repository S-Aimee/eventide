import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import GuestDashboard from "./pages/GuestDashboard";
import OrganizerDashboard from "./pages/OrganizerDashboard";

function App() {
  const [role, setRole] = useState(""); // guest or organizer
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login setRole={setRole} setIsLoggedIn={setIsLoggedIn} />} />

        {/* Dashboard route redirects based on role */}
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              role === "guest" ? (
                <GuestDashboard />
              ) : role === "organizer" ? (
                <OrganizerDashboard />
              ) : (
                <p>Unknown role</p>
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
