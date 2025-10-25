import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Dashboard = ({ stats, user }) => {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="section">
      <div className="admin-profile">
        <div className="profile-header">
          <div className="profile-avatar">
            {getInitials(user.name)}
          </div>
          <div className="profile-info">
            <h2>{user.name}</h2>
            <p>{user.email}</p>
          </div>
        </div>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          
          <div className="stat-value">{stats.totalStudents}</div>
          <div className="stat-label">Total Students</div>
        </div>
        <div className="stat-card">
          
          <div className="stat-value">{stats.totalFaculty}</div>
          <div className="stat-label">Total Faculty</div>
        </div>
        <div className="stat-card">
          
          <div className="stat-value">{stats.unallocatedSubjects}</div>
          <div className="stat-label">Unallocated Subjects</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
