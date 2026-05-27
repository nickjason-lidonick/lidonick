import React, { useState } from "react";
import "./App.css";

const USERS = [
  { email: "nickjason@att.net", password: "2018", name: "Nick" },
  { email: "whedrick985@gmail.com", password: "2018", name: "William" }
];

function LandingPage({ onLoginClick }) {
  return (
    <div className="landing">
      <nav className="nav">
        <div className="logo">Lidonick</div>
        <button className="nav-btn" onClick={onLoginClick}>Log in</button>
      </nav>
      <div className="hero">
        <h1>Networking built<br />on real data.</h1>
        <p>Verified connections, people search, and company intelligence unified in one platform.</p>
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
    const user = USERS.find(u => u.email === email && u.password === password);
    if (user) {
      onLogin(user);
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="logo" style={{ marginBottom: "24px" }}>Lidonick</div>
        <h2>Welcome back</h2>
        <p className="login-sub">Sign in to your account</p>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="input" />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="input" onKeyDown={e => e.key === "Enter" && handleSubmit()} />
        {error && <p className="error">{error}</p>}
        <button className="cta-btn" onClick={handleSubmit}>Sign in</button>
        <p className="back" onClick={onBack}>Back to home</p>
      </div>
    </div>
  );
}

function Sidebar({ activeTab, setActiveTab, user, onLogout }) {
  const items = [
    { id: "home", label: "Home" },
    { id: "network", label: "My Network" },
    { id: "people", label: "People Search" },
    { id: "companies", label: "Company Intel" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <div className="sidebar">
      <div className="logo">Lidonick</div>
      <nav className="side-nav">
        {items.map(item => (
          <div
            key={item.id}
            className={`side-item ${activeTab === item.id ? "active" : ""}`}
            onClick={() => setActiveTab(item.id)}
          >
            {item.label}
          </div>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="user-pill">{user.name}</div>
        <div className="logout" onClick={onLogout}>Log out</div>
      </div>
    </div>
  );
}

function HomePage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const recent = [
    { name: "Sarah Mitchell", role: "VP of Sales", company: "Stripe", type: "person" },
    { name: "Acme Corp", role: "SaaS · 500 employees", company: "", type: "company" },
    { name: "James Roark", role: "Head of Engineering", company: "Figma", type: "person" },
    { name: "Meridian Health", role: "Healthcare · Series B", company: "", type: "company" },
  ];

  return (
    <div className="home-page">
      <div className="search-hero">
        <h1 className="search-title">Find anyone. Know everything.</h1>
        <p className="search-sub">Search people and companies to build real connections backed by data.</p>
        <div className="search-wrap">
          <div className="search-filter">
            <button className={`filter-btn ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>All</button>
            <button className={`filter-btn ${filter === "people" ? "active" : ""}`} onClick={() => setFilter("people")}>People</button>
            <button className={`filter-btn ${filter === "companies" ? "active" : ""}`} onClick={() => setFilter("companies")}>Companies</button>
          </div>
          <div className="search-bar">
            <input
              type="text"
              placeholder={filter === "companies" ? "Search companies..." : filter === "people" ? "Search people..." : "Search people or companies..."}
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="search-input"
            />
            <button className="search-btn">Search</button>
          </div>
        </div>
      </div>

      <div className="recent-section">
        <div className="recent-header">Recently viewed</div>
        <div className="recent-grid">
          {recent.map((item, i) => (
            <div key={i} className="recent-card">
              <div className={`recent-avatar ${item.type === "company" ? "av-company" : "av-person"}`}>
                {item.name.charAt(0)}
              </div>
              <div className="recent-info">
                <div className="recent-name">{item.name}</div>
                <div className="recent-role">{item.role}{item.company ? ` · ${item.company}` : ""}</div>
              </div>
              <div className="recent-tag">{item.type === "company" ? "Company" : "Person"}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ComingSoon({ title }) {
  return (
    <div className="shell-panel">
      <h2>{title}</h2>
      <p>This module is coming soon.</p>
      <div className="coming-soon">In development</div>
    </div>
  );
}

function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="dashboard">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={onLogout} />
      <div className="main-content">
        {activeTab === "home" && <HomePage />}
        {activeTab === "network" && <ComingSoon title="My Network" />}
        {activeTab === "people" && <ComingSoon title="People Search" />}
        {activeTab === "companies" && <ComingSoon title="Company Intel" />}
        {activeTab === "settings" && <ComingSoon title="Settings" />}
      </div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("landing");
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setView("dashboard");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView("landing");
  };

  return (
    <div>
      {view === "landing" && <LandingPage onLoginClick={() => setView("login")} />}
      {view === "login" && <LoginPage onLogin={handleLogin} onBack={() => setView("landing")} />}
      {view === "dashboard" && <Dashboard user={currentUser} onLogout={handleLogout} />}
    </div>
  );
}
