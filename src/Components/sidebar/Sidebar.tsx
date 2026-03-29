import React from "react";
import "./Sidebar.css";

interface SidebarProps {
  setActiveTab: (tab: string) => void;
  activeTab: string;
}

const Sidebar: React.FC<SidebarProps> = ({ setActiveTab, activeTab }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <span className="logo">🐾</span>
        <h2>PawFinder</h2>
      </div>
      
      <div className="sidebar-content">
        <ul>
          <li className={activeTab === "dashboard" ? "active" : ""}>
            <a href="#!" className="sidebar-link" onClick={() => setActiveTab("dashboard")}>
              <i>📊</i> Dashboard
            </a>
          </li>
          
          <li className={activeTab === "managePets" ? "active" : ""}>
            <a href="#!" className="sidebar-link" onClick={() => setActiveTab("managePets")}>
              <i>🐶</i> Manage Pets
            </a>
          </li>
          
          <li className={activeTab === "adoptionRequests" ? "active" : ""}>
            <a href="#!" className="sidebar-link" onClick={() => setActiveTab("adoptionRequests")}>
              <i>📝</i> Adoption Requests
            </a>
          </li>
          
          <li className={activeTab === "manageUsers" ? "active" : ""}>
            <a href="#!" className="sidebar-link" onClick={() => setActiveTab("manageUsers")}>
              <i>👥</i> Manage Users
            </a>
          </li>
          
          <li className={activeTab === "reportedStrays" ? "active" : ""}>
            <a href="#!" className="sidebar-link" onClick={() => setActiveTab("reportedStrays")}>
              <i>🚨</i> Reported Strays
            </a>
          </li>
          
          <li className={activeTab === "lost" ? "active" : ""}>
            <a href="#!" className="sidebar-link" onClick={() => setActiveTab("lost")}>
              <i>🔍</i> Missing Reports
            </a>
          </li>
          
          <li className={activeTab === "addEvent" ? "active" : ""}>
            <a href="#!" className="sidebar-link" onClick={() => setActiveTab("addEvent")}>
              <i>📅</i> Add Event
            </a>
          </li>
        </ul>
      </div>
      
      <div className="sidebar-footer">
        PawFinder Admin Dashboard v1.0
      </div>
    </div>
  );
};

export default Sidebar;
