import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ApprovalBadge from '../components/common/ApprovalBadge';
import studentsData from '../data/students.json';
import approvalsData from '../data/approvals.json';
import '../styles/faculty.css';

const HODHistory = () => {
  const { user } = useAuth();
  const [allApprovals, setAllApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Get all approvals for history view
    setAllApprovals(approvalsData);
    setLoading(false);
  }, []);

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getApprovalHistory = (approval) => {
    const history = [];
    
    // Subject approvals
    approval.subjectApprovals.forEach(subApproval => {
      history.push({
        type: 'Subject Approval',
        subject: subApproval.subjectName,
        approver: subApproval.teacherName,
        status: subApproval.status,
        timestamp: subApproval.timestamp
      });
    });
    
    // Mini project approval
    history.push({
      type: 'Mini Project',
      subject: 'Mini Project',
      approver: approval.miniProjectApproval.supervisorName,
      status: approval.miniProjectApproval.status,
      timestamp: approval.miniProjectApproval.timestamp
    });
    
    // Mentor approval
    history.push({
      type: 'Mentor Approval',
      subject: 'Mentor',
      approver: approval.mentorApproval.mentorName,
      status: approval.mentorApproval.status,
      timestamp: approval.mentorApproval.timestamp
    });
    
    // Counsellor approval
    history.push({
      type: 'Counsellor Approval',
      subject: 'Counsellor',
      approver: approval.counsellorApproval.counsellorName,
      status: approval.counsellorApproval.status,
      timestamp: approval.counsellorApproval.timestamp
    });
    
    // HOD approval
    history.push({
      type: 'HOD Approval',
      subject: 'HOD',
      approver: 'HOD',
      status: approval.hodApproval.status,
      timestamp: approval.hodApproval.timestamp
    });
    
    return history.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  };

  const filteredApprovals = allApprovals.filter(approval => {
    const student = studentsData.find(s => s.id === approval.studentId);
    const matchesSearch = student && (
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.USN.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'approved' && approval.hodApproval.status === 'approved') ||
      (filterStatus === 'rejected' && approval.hodApproval.status === 'rejected') ||
      (filterStatus === 'pending' && approval.hodApproval.status === 'pending');
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="faculty-dashboard">
        <div className="faculty-content">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="faculty-dashboard">
      <div className="faculty-content">
        {/* Header Section */}
        <div className="section">
          <div className="faculty-profile">
            <div className="profile-header">
              <div className="profile-avatar">
                {getInitials(user.name)}
              </div>
              <div className="profile-info">
                <h2>Approval History</h2>
                <p>Complete approval history for all students</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="section">
          <div className="filters-section">
            <div className="search-filter">
              <input
                type="text"
                placeholder="Search by student name, roll no, or USN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="status-filter">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="status-select"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* History Section */}
        <div className="section">
          <div className="history-section">
            <h3>All Student Approvals</h3>
            <div className="history-grid">
              {filteredApprovals.map((approval) => {
                const student = studentsData.find(s => s.id === approval.studentId);
                if (!student) return null;
                
                return (
                  <div key={approval.id} className="history-card">
                    <div className="history-card-header">
                      <div className="student-info">
                        <h4>{student.name}</h4>
                        <div className="student-details">
                          <span>{student.rollNo}</span>
                          <span>{student.USN}</span>
                        </div>
                      </div>
                      <div className="approval-status">
                        <ApprovalBadge 
                          status={approval.hodApproval.status}
                          timestamp={approval.hodApproval.timestamp}
                        />
                      </div>
                    </div>
                    
                    <div className="approval-chain">
                      <h5>Approval Chain:</h5>
                      <div className="chain-items">
                        {approval.subjectApprovals.map((sub, index) => (
                          <div key={index} className="chain-item">
                            <span className="chain-label">Subject {index + 1}:</span>
                            <ApprovalBadge 
                              status={sub.status}
                              timestamp={sub.timestamp}
                            />
                          </div>
                        ))}
                        <div className="chain-item">
                          <span className="chain-label">Mini Project:</span>
                          <ApprovalBadge 
                            status={approval.miniProjectApproval.status}
                            timestamp={approval.miniProjectApproval.timestamp}
                          />
                        </div>
                        <div className="chain-item">
                          <span className="chain-label">Mentor:</span>
                          <ApprovalBadge 
                            status={approval.mentorApproval.status}
                            timestamp={approval.mentorApproval.timestamp}
                          />
                        </div>
                        <div className="chain-item">
                          <span className="chain-label">Counsellor:</span>
                          <ApprovalBadge 
                            status={approval.counsellorApproval.status}
                            timestamp={approval.counsellorApproval.timestamp}
                          />
                        </div>
                        <div className="chain-item">
                          <span className="chain-label">HOD:</span>
                          <ApprovalBadge 
                            status={approval.hodApproval.status}
                            timestamp={approval.hodApproval.timestamp}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="history-actions">
                      <button
                        className="btn btn-outline"
                        onClick={() => {
                          // You can implement detailed view here
                          console.log('View detailed history for:', student.name);
                        }}
                      >
                        View Detailed History
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {filteredApprovals.length === 0 && (
              <div className="no-results">
                <p>No approvals found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HODHistory;
