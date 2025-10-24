import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import ApprovalBadge from '../components/common/ApprovalBadge';
import studentsData from '../data/students.json';
import approvalsData from '../data/approvals.json';
import '../styles/office.css';

const OfficeInterface = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('rollNo');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalStudents: 0,
    approvedSlips: 0,
    distributedTickets: 0,
    pendingDistribution: 0
  });

  useEffect(() => {
    // Calculate stats
    const totalStudents = studentsData.length;
    const approvedSlips = approvalsData.filter(a => a.hodApproval.status === 'approved').length;
    const distributedTickets = approvalsData.filter(a => a.hallTicketDistributed).length;
    const pendingDistribution = approvedSlips - distributedTickets;

    setStats({
      totalStudents,
      approvedSlips,
      distributedTickets,
      pendingDistribution
    });
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let results = [];
    
    if (searchType === 'rollNo') {
      results = studentsData.filter(student => 
        student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else if (searchType === 'usn') {
      results = studentsData.filter(student => 
        student.USN.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else if (searchType === 'name') {
      results = studentsData.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Add approval status to results
    const resultsWithApproval = results.map(student => {
      const approval = approvalsData.find(a => a.studentId === student.id);
      return {
        ...student,
        approval: approval || null
      };
    });
    
    setSearchResults(resultsWithApproval);
    setLoading(false);
  };

  const handleIssueTicket = async (studentId) => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update approval to mark ticket as distributed
    setSearchResults(prev => prev.map(result => {
      if (result.id === studentId) {
        return {
          ...result,
          approval: {
            ...result.approval,
            hallTicketDistributed: true,
            ticketDistributedAt: new Date().toISOString()
          }
        };
      }
      return result;
    }));
    
    // Update stats
    setStats(prev => ({
      ...prev,
      distributedTickets: prev.distributedTickets + 1,
      pendingDistribution: prev.pendingDistribution - 1
    }));
    
    alert('Hall ticket issued successfully!');
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

  const canIssueTicket = (approval) => {
    return (
      approval &&
      approval.hodApproval.status === 'approved' &&
      !approval.hallTicketDistributed
    );
  };

  return (
    <div className="office-dashboard">
      <div className="office-content">
        {/* Office Profile */}
        <div className="office-profile">
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
        <div className="office-stats">
          <div className="stat-card">
            <div className="stat-icon">🎓</div>
            <div className="stat-value">{stats.totalStudents}</div>
            <div className="stat-label">Total Students</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-value">{stats.approvedSlips}</div>
            <div className="stat-label">Approved Slips</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎫</div>
            <div className="stat-value">{stats.distributedTickets}</div>
            <div className="stat-label">Tickets Distributed</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-value">{stats.pendingDistribution}</div>
            <div className="stat-label">Pending Distribution</div>
          </div>
        </div>

        {/* Search Section */}
        <div className="search-section">
          <div className="search-header">
            <div className="search-icon">🔍</div>
            <div>
              <h3 className="search-title">Student Search</h3>
              <p className="search-subtitle">Search and issue hall tickets</p>
            </div>
          </div>
          
          <div className="search-form">
            <input
              type="text"
              className="search-input"
              placeholder="Enter search term..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <select
              className="search-type"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="rollNo">Roll Number</option>
              <option value="usn">USN</option>
              <option value="name">Name</option>
            </select>
            <button
              className="search-button"
              onClick={handleSearch}
              disabled={loading || !searchTerm.trim()}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map((student) => (
                <div key={student.id} className="search-result-card">
                  <div className="result-header">
                    <div className="result-info">
                      <h4>{student.name}</h4>
                      <div className="result-details">
                        <span className="result-roll">{student.rollNo}</span>
                        <span className="result-usn">{student.USN}</span>
                        <span>{student.deptId}</span>
                      </div>
                    </div>
                    <div className="approval-status">
                      {student.approval ? (
                        <ApprovalBadge 
                          status={student.approval.hodApproval.status}
                          timestamp={student.approval.hodApproval.timestamp}
                        />
                      ) : (
                        <span className="approval-status pending">No Approval Data</span>
                      )}
                    </div>
                  </div>
                  
                  {student.approval && (
                    <div className="result-actions">
                      <button
                        className="view-slip-button"
                        onClick={() => {
                          // In a real app, this would open a slip preview modal
                          alert('Slip preview would open here');
                        }}
                      >
                        View Slip
                      </button>
                      <button
                        className="issue-ticket-button"
                        onClick={() => handleIssueTicket(student.id)}
                        disabled={!canIssueTicket(student.approval) || loading}
                      >
                        {student.approval.hallTicketDistributed ? 'Ticket Issued ✓' : 'Issue Hall Ticket'}
                      </button>
                    </div>
                  )}
                  
                  {student.approval && canIssueTicket(student.approval) && (
                    <div className="slip-preview">
                      <div className="slip-header">
                        <h2 className="slip-title">IDCS - College Slip</h2>
                        <p className="slip-subtitle">Digital Approval System</p>
                      </div>
                      
                      <div className="slip-content">
                        <div className="slip-section">
                          <h4>Student Information</h4>
                          <div className="slip-field">
                            <span className="slip-field-label">Name:</span>
                            <span className="slip-field-value">{student.name}</span>
                          </div>
                          <div className="slip-field">
                            <span className="slip-field-label">Roll No:</span>
                            <span className="slip-field-value">{student.rollNo}</span>
                          </div>
                          <div className="slip-field">
                            <span className="slip-field-label">USN:</span>
                            <span className="slip-field-value">{student.USN}</span>
                          </div>
                          <div className="slip-field">
                            <span className="slip-field-label">Department:</span>
                            <span className="slip-field-value">{student.deptId}</span>
                          </div>
                        </div>
                        
                        <div className="slip-section">
                          <h4>Approval Status</h4>
                          <div className="slip-field">
                            <span className="slip-field-label">HOD Approval:</span>
                            <span className="slip-field-value">
                              {student.approval.hodApproval.status === 'approved' ? '✓ Approved' : '○ Pending'}
                            </span>
                          </div>
                          <div className="slip-field">
                            <span className="slip-field-label">Approved Date:</span>
                            <span className="slip-field-value">
                              {student.approval.hodApproval.timestamp 
                                ? new Date(student.approval.hodApproval.timestamp).toLocaleDateString()
                                : 'N/A'
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="slip-approvals">
                        <h4>Approval Chain</h4>
                        <div className="approvals-grid">
                          {student.approval.subjectApprovals.map((subApproval) => (
                            <div key={subApproval.subjectId} className="approval-item">
                              <div className="approval-role">{subApproval.subjectName}</div>
                              <div className="approval-signature">
                                {subApproval.status === 'approved' ? '✓ Approved' : '○ Pending'}
                              </div>
                              <div className="approval-timestamp">
                                {subApproval.timestamp ? new Date(subApproval.timestamp).toLocaleDateString() : 'N/A'}
                              </div>
                            </div>
                          ))}
                          <div className="approval-item">
                            <div className="approval-role">Mini Project</div>
                            <div className="approval-signature">
                              {student.approval.miniProjectApproval.status === 'approved' ? '✓ Approved' : '○ Pending'}
                            </div>
                            <div className="approval-timestamp">
                              {student.approval.miniProjectApproval.timestamp ? new Date(student.approval.miniProjectApproval.timestamp).toLocaleDateString() : 'N/A'}
                            </div>
                          </div>
                          <div className="approval-item">
                            <div className="approval-role">Mentor</div>
                            <div className="approval-signature">
                              {student.approval.mentorApproval.status === 'approved' ? '✓ Approved' : '○ Pending'}
                            </div>
                            <div className="approval-timestamp">
                              {student.approval.mentorApproval.timestamp ? new Date(student.approval.mentorApproval.timestamp).toLocaleDateString() : 'N/A'}
                            </div>
                          </div>
                          <div className="approval-item">
                            <div className="approval-role">Counsellor</div>
                            <div className="approval-signature">
                              {student.approval.counsellorApproval.status === 'approved' ? '✓ Approved' : '○ Pending'}
                            </div>
                            <div className="approval-timestamp">
                              {student.approval.counsellorApproval.timestamp ? new Date(student.approval.counsellorApproval.timestamp).toLocaleDateString() : 'N/A'}
                            </div>
                          </div>
                          <div className="approval-item">
                            <div className="approval-role">HOD</div>
                            <div className="approval-signature">
                              {student.approval.hodApproval.status === 'approved' ? '✓ Approved' : '○ Pending'}
                            </div>
                            <div className="approval-timestamp">
                              {student.approval.hodApproval.timestamp ? new Date(student.approval.hodApproval.timestamp).toLocaleDateString() : 'N/A'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {searchResults.length === 0 && searchTerm && !loading && (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>No students found</h3>
              <p>Try searching with a different term or search type.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfficeInterface;
