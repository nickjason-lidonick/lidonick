import React, { useState } from "react";
import "./App.css";

const VALID_EMAIL = "nickjason@att.net";
const VALID_PASSWORD = "2018";

function LandingPage({ onLoginClick }) {
  return (
    <div className="landing">
      <nav className="nav">
        <div className="logo">Lidonick</div>
        <button className="nav-btn" onClick={onLoginClick}>Log in</button>
      </nav>
      <div className="hero">
        <h1>Intelligence that moves<br />as fast as you do.</h1>
        <p>Company intel, people search, and comp intelligence unified in one platform.</p>
        <button className="cta-btn" onClick={onLoginClick}>Get started</button>
      </div>
    </div>
  );
}

function LoginPage({ onLogin, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      onLogin();
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="logo" style={{marginBottom: "24px"}}>Lidonick</div>
        <h2>Welcome back</h2>
        <p className="login-sub">Sign in to your account</p>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="input" />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="input" />
        {error && <p className="error">{error}</p>}
        <button className="cta-btn" onClick={handleSubmit}>Sign in</button>
        <p className="back" onClick={onBack}>Back to home</p>
      </div>
    </div>
  );
}

function Dashboard() {
  const [activeTab, setActiveTab] = useState("company");

  return (
    <div className="dashboard">
      <div className="sidebar">
        <div className="logo">Lidonick</div>
        <nav className="side-nav">
          <div className={`side-item ${activeTab === "company" ? "active" : ""}`} onClick={() => setActiveTab("company")}>Company Intel</div>
          <div className={`side-item ${activeTab === "people" ? "active" : ""}`} onClick={() => setActiveTab("people")}>People Search</div>
          <div className={`side-item ${activeTab === "recruiter" ? "active" : ""}`} onClick={() => setActiveTab("recruiter")}>Comp Intelligence</div>
        </nav>
      </div>
      <div className="main-content">
        {activeTab === "company" && (
          <div className="shell-panel">
            <h2>Company Intel</h2>
            <p>Search any company for financial signals, hiring trends, and buy intelligence.</p>
            <div className="coming-soon">Search coming soon</div>
          </div>
        )}
        {activeTab === "people" && (
          <div className="shell-panel">
            <h2>People Search</h2>
            <p>Find and connect with verified contacts across companies.</p>
            <div className="coming-soon">Search coming soon</div>
          </div>
        )}
        {activeTab === "recruiter" && (
          <div className="shell-panel">
            <h2>Comp Intelligence</h2>
            <p>Estimate compensation packages using public data signals.</p>
            <div className="coming-soon">Search coming soon</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("landing");

  return (
    <div>
      {view === "landing" && <LandingPage onLoginClick={() => setView("login")} />}
      {view === "login" && <LoginPage onLogin={() => setView("dashboard")} onBack={() => setView("landing")} />}
      {view === "dashboard" && <Dashboard />}
    </div>
  );
}