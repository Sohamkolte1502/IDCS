import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleDisplay = (role) => {
    const roleMap = {
      student: 'Student',
      teacher: 'Faculty',
      hod: 'HOD',
      admin: 'Administrator',
      office: 'Office Staff'
    };
    return roleMap[role] || role;
  };

  return (
    <header className="header">
      <div className="header-left">
        <div>
          <h1 className="header-title">IDCS - College Slip Automation</h1>
          <p className="header-subtitle">Digital Approval System</p>
        </div>
      </div>
      
      <div className="header-right">
        {user && (
          <>
            <div className="user-info">
              <div className="user-avatar">
                {getInitials(user.name)}
              </div>
              <div className="user-details">
                <p className="user-name">{user.name}</p>
                <p className="user-role">{getRoleDisplay(user.role)}</p>
              </div>
            </div>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
