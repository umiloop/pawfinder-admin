import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminProfile.css';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

const AdminProfile: React.FC = () => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Get user from localStorage on component mount
  useEffect(() => {
    const userData = localStorage.getItem('pawfinderAdminUser');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Handle click outside of dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('pawfinderAdminUser');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="admin-profile" ref={dropdownRef}>
      <div 
        className="profile-trigger" 
        onClick={() => setShowDropdown(!showDropdown)}
        aria-expanded={showDropdown}
        aria-label="Toggle profile menu"
      >
        <img 
          src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6a5acd&color=fff`} 
          alt={`${user.name}'s avatar`} 
          className="avatar" 
        />
        <span className="profile-name">{user.name}</span>
        <i className={`fas fa-chevron-${showDropdown ? 'up' : 'down'}`}></i>
      </div>

      {showDropdown && (
        <div className="profile-dropdown">
          <div className="dropdown-header">
            <img 
              src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6a5acd&color=fff`}
              alt={`${user.name}'s avatar`} 
              className="dropdown-avatar" 
            />
            <div className="dropdown-user-info">
              <span className="dropdown-name">{user.name}</span>
              <span className="dropdown-role">{user.role}</span>
              <span className="dropdown-email">{user.email}</span>
            </div>
          </div>
          <div className="dropdown-divider"></div>
          <ul className="dropdown-menu">
            <li>
              <button className="dropdown-item">
                <i className="fas fa-user-circle"></i>
                <span>My Profile</span>
              </button>
            </li>
            <li>
              <button className="dropdown-item">
                <i className="fas fa-cog"></i>
                <span>Settings</span>
              </button>
            </li>
            <li>
              <button className="dropdown-item" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i>
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;