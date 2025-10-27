import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const Dashboard = ({ stats, user, systemAdmins, onUpdateSystemAdmin }) => {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const [editMode, setEditMode] = useState({ systemAdmin1: false, systemAdmin2: false });
  const [editValues, setEditValues] = useState({
    systemAdmin1: systemAdmins?.systemAdmin1?.name || 'System Admin 1',
    systemAdmin2: systemAdmins?.systemAdmin2?.name || 'System Admin 2'
  });

  // Sync editValues when systemAdmins changes
  useEffect(() => {
    setEditValues({
      systemAdmin1: systemAdmins?.systemAdmin1?.name || 'System Admin 1',
      systemAdmin2: systemAdmins?.systemAdmin2?.name || 'System Admin 2'
    });
  }, [systemAdmins]);

  const handleEdit = (admin, value) => {
    setEditValues(prev => ({
      ...prev,
      [admin]: value
    }));
  };

  const handleSave = (admin) => {
    onUpdateSystemAdmin(admin, editValues[admin]);
    setEditMode(prev => ({
      ...prev,
      [admin]: false
    }));
  };

  const handleCancel = (admin) => {
    setEditValues(prev => ({
      ...prev,
      [admin]: systemAdmins?.[admin]?.name || (admin === 'systemAdmin1' ? 'System Admin 1' : 'System Admin 2')
    }));
    setEditMode(prev => ({
      ...prev,
      [admin]: false
    }));
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

      {/* System Admin Boxes */}
      <div className="system-admins-section">
        <h3 style={{ marginBottom: '20px', color: '#333' }}>System Administrators</h3>
        <div className="system-admins-container">
          {/* System Admin 1 */}
          <div className="system-admin-card">
            <div className="system-admin-header">
              {editMode.systemAdmin1 ? (
                <div className="admin-edit-container">
                  <input
                    type="text"
                    value={editValues.systemAdmin1}
                    onChange={(e) => handleEdit('systemAdmin1', e.target.value)}
                    className="admin-name-input"
                    autoFocus
                  />
                  <div className="admin-edit-buttons">
                    <button 
                      className="admin-save-btn"
                      onClick={() => handleSave('systemAdmin1')}
                    >
                      ✓
                    </button>
                    <button 
                      className="admin-cancel-btn"
                      onClick={() => handleCancel('systemAdmin1')}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h4>{systemAdmins?.systemAdmin1?.name || 'System Admin 1'}</h4>
                  <button 
                    className="admin-edit-icon"
                    onClick={() => setEditMode(prev => ({ ...prev, systemAdmin1: true }))}
                    title="Edit name"
                  >
                    ✏️
                  </button>
                </>
              )}
            </div>
            <p className="admin-email">{systemAdmins?.systemAdmin1?.email || 'admin1@dypatil.edu'}</p>
          </div>

          {/* System Admin 2 */}
          <div className="system-admin-card">
            <div className="system-admin-header">
              {editMode.systemAdmin2 ? (
                <div className="admin-edit-container">
                  <input
                    type="text"
                    value={editValues.systemAdmin2}
                    onChange={(e) => handleEdit('systemAdmin2', e.target.value)}
                    className="admin-name-input"
                    autoFocus
                  />
                  <div className="admin-edit-buttons">
                    <button 
                      className="admin-save-btn"
                      onClick={() => handleSave('systemAdmin2')}
                    >
                      ✓
                    </button>
                    <button 
                      className="admin-cancel-btn"
                      onClick={() => handleCancel('systemAdmin2')}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h4>{systemAdmins?.systemAdmin2?.name || 'System Admin 2'}</h4>
                  <button 
                    className="admin-edit-icon"
                    onClick={() => setEditMode(prev => ({ ...prev, systemAdmin2: true }))}
                    title="Edit name"
                  >
                    ✏️
                  </button>
                </>
              )}
            </div>
            <p className="admin-email">{systemAdmins?.systemAdmin2?.email || 'admin2@dypatil.edu'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
