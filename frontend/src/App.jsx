import React, { useState } from "react";
import HomePage from "./pages/HomePage";
import WelcomePage from "./pages/WelcomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import Charts from "./pages/ChartsPage";
import Settings from "./pages/Settings";

function App() {
  const [page, setPage] = useState("home");
  const [username, setUsername] = useState("");
  const [currentPage, setCurrentPage] = useState("welcome");

  /* ======================
     AUTH HANDLERS
  ====================== */
  const handleLoginSuccess = (user) => {
    setUsername(user);
    setPage("app");
    setCurrentPage("welcome");
  };

  const handleRegisterSuccess = (user) => {
    setUsername(user);
    setPage("app");
    setCurrentPage("welcome");
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    setUsername("");
    setPage("home");
    setCurrentPage("welcome");
  };

  /* ======================
     PUBLIC PAGES
  ====================== */
  if (page === "home") {
    return (
      <HomePage
        goToLogin={() => setPage("login")}
        goToRegister={() => setPage("register")}
      />
    );
  }

  if (page === "login") {
    return (
      <Login
        onLoginSuccess={handleLoginSuccess}
        goToRegister={() => setPage("register")}
      />
    );
  }

  if (page === "register") {
    return (
      <Register
        goToLogin={() => setPage("login")}
        goToDashboard={handleRegisterSuccess}
      />
    );
  }

  /* ======================
     APP PAGES
  ====================== */
  if (page === "app") {
    const renderPage = () => {
      switch (currentPage) {
        case "welcome":
          return (
            <WelcomePage
              username={username}
              goToDashboard={() => setCurrentPage("upload")}
            />
          );

        case "upload":
          return <Dashboard username={username} />;

        case "reports":
          return <Reports username={username} />;

        case "charts":
          return <Charts username={username} />;

        case "settings":
          return (
            <Settings
              username={username}
              onLogout={handleLogout}
              goToDashboard={() => setCurrentPage("upload")}
              goToReports={() => setCurrentPage("reports")} // ✅ HISTORY FIX
            />
          );

        default:
          return (
            <WelcomePage
              username={username}
              goToDashboard={() => setCurrentPage("upload")}
            />
          );
      }
    };

    return (
      <>
        <Navbar
          currentPage={currentPage}
          setPage={setCurrentPage}
          onLogout={handleLogout}
        />

        <div className="page-container">{renderPage()}</div>
      </>
    );
  }

  return null;
}

export default App;
