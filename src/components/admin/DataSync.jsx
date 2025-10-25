import React, { useState } from 'react';
import ApprovalBadge from '../common/ApprovalBadge';

const DataSync = ({ 
  stats, 
  students, 
  departments, 
  filteredApprovals, 
  filters, 
  setFilters, 
  auditLogs 
}) => {
  const [collapsedSections, setCollapsedSections] = useState({});

  const toggleSection = (sectionName) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  return (
    <div className="section">
      <div className="section-header">
        <h2>Reports & Oversight</h2>
        <button 
          className="collapse-btn"
          onClick={() => toggleSection('reports')}
        >
          {collapsedSections['reports'] ? '▼' : '▲'}
        </button>
      </div>
      
      {!collapsedSections['reports'] && (
        <div className="section-content">
          {/* System Metrics */}
          <div className="metrics-section">
            <h3>System Metrics</h3>
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-value">{stats.activeUsers}</div>
                <div className="metric-label">Active Users</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">{stats.pendingApprovals}</div>
                <div className="metric-label">Pending Slips</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">
                  {Math.round((stats.completedApprovals / (stats.completedApprovals + stats.pendingApprovals)) * 100) || 0}%
                </div>
                <div className="metric-label">Approval Rate</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">{stats.unallocatedSubjects}</div>
                <div className="metric-label">Unallocated Subjects</div>
              </div>
            </div>
          </div>

          {/* Slip Status Report */}
          <div className="reports-section">
            <h3>Slip Status Report</h3>
            <div className="report-filters">
              <select 
                value={filters.status}
                onChange={(e) => setFilters(prev => ({...prev, status: e.target.value}))}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <select 
                value={filters.department}
                onChange={(e) => setFilters(prev => ({...prev, department: e.target.value}))}
              >
                <option value="all">All Departments</option>
                {departments.map(d => (
                  <option key={d.deptId} value={d.deptId}>{d.deptName}</option>
                ))}
              </select>
              <select 
                value={filters.division}
                onChange={(e) => setFilters(prev => ({...prev, division: e.target.value}))}
              >
                <option value="all">All Divisions</option>
                <option value="A">Division A</option>
                <option value="B">Division B</option>
                <option value="C">Division C</option>
              </select>
              <select 
                value={filters.year}
                onChange={(e) => setFilters(prev => ({...prev, year: e.target.value}))}
              >
                <option value="all">All Years</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
              </select>
            </div>
            
            <div className="report-table">
              <table>
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Dept</th>
                    <th>Div</th>
                    <th>Year</th>
                    <th>Slip Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApprovals.map(approval => {
                    const student = students.find(s => s.id === approval.studentId);
                    return (
                      <tr key={approval.id}>
                        <td>{student?.name}</td>
                        <td>{student?.deptId}</td>
                        <td>{student?.divId}</td>
                        <td>{student?.year}</td>
                        <td>
                          <ApprovalBadge 
                            status={approval.hodApproval.status}
                            timestamp={approval.hodApproval.timestamp}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Audit Logs */}
          <div className="reports-section">
            <h3>Audit Logs</h3>
            <div className="audit-table">
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Action</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map(log => (
                    <tr key={log.id}>
                      <td>{log.user}</td>
                      <td>{log.action}</td>
                      <td>{new Date(log.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataSync;
