import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ApprovalBadge from '../components/common/ApprovalBadge';
import studentsData from '../data/students.json';
import approvalsData from '../data/approvals.json';
import '../styles/office.css';

const OfficeTickets = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    approvedSlips: 0,
    distributedTickets: 0,
    pendingDistribution: 0
  });
  const [ticketList, setTicketList] = useState([]);
  const [loading, setLoading] = useState(false);

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

    // Create ticket list with student and approval data
    const ticketsWithStudentData = approvalsData.map(approval => {
      const student = studentsData.find(s => s.id === approval.studentId);
      return {
        ...approval,
        student: student || null
      };
    }).filter(ticket => ticket.student); // Only include tickets with valid student data

    setTicketList(ticketsWithStudentData);
  }, []);

  const handleIssueTicket = async (studentId) => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update ticket list to mark ticket as distributed
    setTicketList(prev => prev.map(ticket => {
      if (ticket.studentId === studentId) {
        return {
          ...ticket,
          hallTicketDistributed: true,
          ticketDistributedAt: new Date().toISOString()
        };
      }
      return ticket;
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

  const canIssueTicket = (approval) => {
    return (
      approval &&
      approval.hodApproval.status === 'approved' &&
      !approval.hallTicketDistributed
    );
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="office-dashboard">
      <div className="office-content">
        {/* Header */}
        <div className="office-header">
          <h1>Hall Ticket Management</h1>
        </div>

        {/* Ticket Management Section */}
        <div className="section">
          <h2>Ticket Management</h2>
          <div className="tickets-overview">
            <div className="ticket-stats">
              <div className="ticket-stat">
                <h3>Pending Distribution</h3>
                <p>{stats.pendingDistribution} tickets</p>
              </div>
              <div className="ticket-stat">
                <h3>Distributed Today</h3>
                <p>{stats.distributedTickets} tickets</p>
              </div>
              <div className="ticket-stat">
                <h3>Total Approved</h3>
                <p>{stats.approvedSlips} tickets</p>
              </div>
            </div>
          </div>

          {/* Ticket List */}
          <div className="ticket-list">
            <h3>All Tickets</h3>
            <div className="ticket-grid">
              {ticketList.map((ticket) => (
                <div key={ticket.studentId} className="ticket-card">
                  <div className="ticket-header">
                    <div className="ticket-student-info">
                      <div className="student-avatar">
                        {getInitials(ticket.student.name)}
                      </div>
                      <div className="student-details">
                        <h4>{ticket.student.name}</h4>
                        <p>{ticket.student.rollNo} • {ticket.student.USN}</p>
                        <p>{ticket.student.deptId}</p>
                      </div>
                    </div>
                    <div className="ticket-status">
                      <ApprovalBadge 
                        status={ticket.hodApproval.status}
                        timestamp={ticket.hodApproval.timestamp}
                      />
                      {ticket.hallTicketDistributed && (
                        <span className="ticket-issued">✓ Ticket Issued</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="ticket-actions">
                    <button
                      className="view-slip-button"
                      onClick={() => {
                        alert('Slip preview would open here');
                      }}
                    >
                      View Slip
                    </button>
                    <button
                      className="issue-ticket-button"
                      onClick={() => handleIssueTicket(ticket.studentId)}
                      disabled={!canIssueTicket(ticket) || loading}
                    >
                      {ticket.hallTicketDistributed ? 'Ticket Issued ✓' : 'Issue Hall Ticket'}
                    </button>
                  </div>

                  {ticket.hallTicketDistributed && (
                    <div className="ticket-distribution-info">
                      <p><strong>Distributed:</strong> {new Date(ticket.ticketDistributedAt).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Reports Section */}
          <div className="reports-section">
            <h3>Distribution Statistics</h3>
            <div className="reports-grid">
              <div className="report-card">
                <h4>Total Students</h4>
                <p className="report-value">{stats.totalStudents}</p>
              </div>
              <div className="report-card">
                <h4>Approved Slips</h4>
                <p className="report-value">{stats.approvedSlips}</p>
              </div>
              <div className="report-card">
                <h4>Distributed Tickets</h4>
                <p className="report-value">{stats.distributedTickets}</p>
              </div>
              <div className="report-card">
                <h4>Pending Distribution</h4>
                <p className="report-value">{stats.pendingDistribution}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeTickets;
