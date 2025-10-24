import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import ApprovalBadge from '../components/common/ApprovalBadge';
import studentsData from '../data/students.json';
import facultyData from '../data/faculty.json';
import approvalsData from '../data/approvals.json';
import '../styles/admin.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    pendingApprovals: 0,
    completedApprovals: 0
  });
  const [faculty, setFaculty] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    // Calculate stats
    const totalStudents = studentsData.length;
    const totalFaculty = facultyData.length;
    const pendingApprovals = approvalsData.filter(a => 
      a.hodApproval.status === 'pending'
    ).length;
    const completedApprovals = approvalsData.filter(a => 
      a.hodApproval.status === 'approved'
    ).length;

    setStats({
      totalStudents,
      totalFaculty,
      pendingApprovals,
      completedApprovals
    });

    setFaculty(facultyData);
    setApprovals(approvalsData);
    setLoading(false);
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    
    // Simulate file processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert(`File "${file.name}" uploaded successfully!`);
    setLoading(false);
  };

  const handleFacultyRoleUpdate = async (facultyId, role, checked) => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update faculty roles
    setFaculty(prev => prev.map(f => {
      if (f.id === facultyId) {
        const updatedRoles = checked 
          ? [...(f.roles || []), role]
          : (f.roles || []).filter(r => r !== role);
        
        return { ...f, roles: updatedRoles };
      }
      return f;
    }));
    
    setLoading(false);
  };

  const handleSync = async (type) => {
    setLoading(true);
    
    // Simulate sync operation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    alert(`${type} sync completed successfully!`);
    setLoading(false);
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-content">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-content">
        {/* Admin Profile */}
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

        {/* Stats Overview */}
        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-icon">🎓</div>
            <div className="stat-value">{stats.totalStudents}</div>
            <div className="stat-label">Total Students</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-value">{stats.totalFaculty}</div>
            <div className="stat-label">Total Faculty</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-value">{stats.pendingApprovals}</div>
            <div className="stat-label">Pending Approvals</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-value">{stats.completedApprovals}</div>
            <div className="stat-label">Completed Approvals</div>
          </div>
        </div>

        {/* Admin Sections */}
        <div className="admin-sections">
          {/* Master Data Upload */}
          <div className="admin-section">
            <div className="section-header">
              <h3 className="section-title">Master Data Upload</h3>
              <p className="section-subtitle">Upload student and faculty data</p>
            </div>
            <div className="section-content">
              <div className="master-data-upload">
                <div className="upload-area" onClick={() => document.getElementById('file-input').click()}>
                  <div className="upload-icon">📁</div>
                  <h4 className="upload-text">Upload Data Files</h4>
                  <p className="upload-hint">Click to select files or drag and drop</p>
                  <input
                    id="file-input"
                    type="file"
                    className="file-input"
                    onChange={handleFileUpload}
                    accept=".csv,.xlsx,.json"
                  />
                </div>
                <button className="upload-button" onClick={() => document.getElementById('file-input').click()}>
                  Choose Files
                </button>
              </div>
            </div>
          </div>

          {/* Faculty Role Mapping */}
          <div className="admin-section">
            <div className="section-header">
              <h3 className="section-title">Faculty Role Management</h3>
              <p className="section-subtitle">Assign roles to faculty members</p>
            </div>
            <div className="section-content">
              <div className="faculty-role-mapping">
                <div className="faculty-list">
                  {faculty.map((facultyMember) => (
                    <div key={facultyMember.id} className="faculty-item">
                      <div className="faculty-info">
                        <h4 className="faculty-name">{facultyMember.name}</h4>
                        <p className="faculty-email">{facultyMember.email}</p>
                      </div>
                      <div className="faculty-roles">
                        {['SubjectTeacher', 'Mentor', 'ClassCounsellor', 'HOD'].map((role) => (
                          <div key={role} className="role-checkbox">
                            <input
                              type="checkbox"
                              id={`${facultyMember.id}-${role}`}
                              checked={(facultyMember.roles || []).includes(role)}
                              onChange={(e) => handleFacultyRoleUpdate(facultyMember.id, role, e.target.checked)}
                            />
                            <label htmlFor={`${facultyMember.id}-${role}`}>
                              {role}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Student Lifecycle Management */}
          <div className="admin-section">
            <div className="section-header">
              <h3 className="section-title">Student Lifecycle</h3>
              <p className="section-subtitle">Manage student enrollment and graduation</p>
            </div>
            <div className="section-content">
              <div className="student-lifecycle">
                <div className="lifecycle-actions">
                  <div className="lifecycle-button">
                    <div className="lifecycle-icon">📝</div>
                    <h4 className="lifecycle-title">Enroll Students</h4>
                    <p className="lifecycle-description">Add new students to the system</p>
                  </div>
                  <div className="lifecycle-button">
                    <div className="lifecycle-icon">🔄</div>
                    <h4 className="lifecycle-title">Update Records</h4>
                    <p className="lifecycle-description">Modify student information</p>
                  </div>
                  <div className="lifecycle-button">
                    <div className="lifecycle-icon">🎓</div>
                    <h4 className="lifecycle-title">Graduate Students</h4>
                    <p className="lifecycle-description">Mark students as graduated</p>
                  </div>
                  <div className="lifecycle-button">
                    <div className="lifecycle-icon">📊</div>
                    <h4 className="lifecycle-title">Generate Reports</h4>
                    <p className="lifecycle-description">Create student reports</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Data Sync */}
          <div className="admin-section">
            <div className="section-header">
              <h3 className="section-title">Data Synchronization</h3>
              <p className="section-subtitle">Sync data with external systems</p>
            </div>
            <div className="section-content">
              <div className="slip-sync">
                <div className="sync-actions">
                  <button 
                    className="sync-button"
                    onClick={() => handleSync('Student Data')}
                    disabled={loading}
                  >
                    Sync Student Data
                  </button>
                  <button 
                    className="sync-button secondary"
                    onClick={() => handleSync('Faculty Data')}
                    disabled={loading}
                  >
                    Sync Faculty Data
                  </button>
                  <button 
                    className="sync-button"
                    onClick={() => handleSync('Approval Status')}
                    disabled={loading}
                  >
                    Sync Approvals
                  </button>
                  <button 
                    className="sync-button secondary"
                    onClick={() => handleSync('All Data')}
                    disabled={loading}
                  >
                    Full Sync
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Approval History */}
          <div className="admin-section">
            <div className="section-header">
              <h3 className="section-title">Approval History</h3>
              <p className="section-subtitle">View all approval records</p>
            </div>
            <div className="section-content">
              <div className="approval-history">
                <div className="history-filters">
                  <select className="filter-select">
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <select className="filter-select">
                    <option value="all">All Students</option>
                    {studentsData.map(student => (
                      <option key={student.id} value={student.id}>
                        {student.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="history-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Roll No</th>
                        <th>Status</th>
                        <th>Last Updated</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {approvals.map((approval) => {
                        const student = studentsData.find(s => s.id === approval.studentId);
                        return (
                          <tr key={approval.id}>
                            <td>{student?.name}</td>
                            <td>{approval.rollNo}</td>
                            <td>
                              <ApprovalBadge 
                                status={approval.hodApproval.status}
                                timestamp={approval.hodApproval.timestamp}
                              />
                            </td>
                            <td>
                              {approval.hodApproval.timestamp 
                                ? new Date(approval.hodApproval.timestamp).toLocaleDateString()
                                : 'N/A'
                              }
                            </td>
                            <td>
                              <button className="btn btn-sm btn-outline">
                                View Details
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
