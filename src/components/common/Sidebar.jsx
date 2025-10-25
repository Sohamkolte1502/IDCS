import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const getStudentNavItems = () => [
    { path: '/student', label: 'Dashboard', icon: '🏠' },
    { path: '/student/profile', label: 'Profile', icon: '👤' },
    { path: '/student/slip', label: 'Generate Slip', icon: '📄' }
  ];

  const getFacultyNavItems = () => [
    { path: '/faculty', label: 'Dashboard', icon: '🏠' },
    { path: '/faculty/approvals', label: 'Subject Approvals', icon: '✅' },
    { path: '/faculty/mentor', label: 'Mentor Approvals', icon: '👨‍🏫' },
    { path: '/faculty/counsellor', label: 'Counsellor Approvals', icon: '🎓' }
  ];

  const getHODNavItems = () => [
    { path: '/hod', label: 'Dashboard', icon: '🏠' },
    { path: '/hod/approvals', label: 'Final Approvals', icon: '✅' },
    { path: '/hod/history', label: 'Approval History', icon: '📊' }
  ];
  

  const getAdminNavItems = () => [
    { path: '/admin', label: 'Dashboard', icon: '/dashboard.svg' },
    { path: '/admin/master-data', label: 'Master Data', icon: '/data.svg' },
    { path: '/admin/faculty', label: 'Faculty Management', icon: '/management.svg' },
    { path: '/admin/students', label: 'Student Management', icon: '/student.svg' },
    { path: '/admin/sync', label: 'Data Sync', icon: '/sync.svg' }
  ];

  const getOfficeNavItems = () => [
    { path: '/office', label: 'Dashboard', icon: '🏠' },
    { path: '/office/search', label: 'Search Students', icon: '🔍' },
    { path: '/office/tickets', label: 'Hall Tickets', icon: '🎫' }
  ];

  const getNavItems = () => {
    switch (user?.role) {
      case 'student':
        return getStudentNavItems();
      case 'teacher':
        return getFacultyNavItems();
      case 'hod':
        return getHODNavItems();
      case 'admin':
        return getAdminNavItems();
      case 'office':
        return getOfficeNavItems();
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  // Helper function to render icon
  const renderIcon = (icon) => {
    if (icon.startsWith('/')) {
      // SVG file from public folder
      return <img src={icon} alt="" className="nav-icon-img" />;
    } else {
      // Emoji or text icon
      return <span className="nav-icon">{icon}</span>;
    }
  };

  return (
    <nav className="sidebar">
      <div className="sidebar-nav">
        <div className="nav-section">
          <h3 className="nav-section-title">Navigation</h3>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              {renderIcon(item.icon)}
              <span className="nav-text">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;