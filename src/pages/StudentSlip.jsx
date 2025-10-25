import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import studentsData from '../data/students.json';
import approvalsData from '../data/approvals.json';
import '../styles/student.css';

const StudentSlip = () => {
  const { user } = useAuth();
  const [student, setStudent] = useState(null);
  const [approval, setApproval] = useState(null);
  const [slipGenerated, setSlipGenerated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find student data
    const studentData = studentsData.find(s => s.email === user.email);
    setStudent(studentData);
    
    // Find approval data
    const approvalData = approvalsData.find(a => a.studentId === studentData?.id);
    setApproval(approvalData);
    
    setLoading(false);
  }, [user.email]);

  const canGenerateSlip = () => {
    if (!approval) return false;
    
    return (
      approval.subjectApprovals.every(sub => sub.status === 'approved') &&
      approval.miniProjectApproval.status === 'approved' &&
      approval.mentorApproval.status === 'approved' &&
      approval.counsellorApproval.status === 'approved' &&
      approval.hodApproval.status === 'approved'
    );
  };

  const handleGenerateSlip = async () => {
    if (!canGenerateSlip()) return;
    
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSlipGenerated(true);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="student-dashboard">
        <div className="student-content">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="student-dashboard">
        <div className="student-content">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h2>Student not found</h2>
            <p>Please contact the administrator.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="student-dashboard">
      <div className="student-content">
        {/* Header */}
        <div className="student-header">
          <h1>Slip Generation</h1>
        </div>

        {/* Slip Generation Section */}
        <div className="section">
          <div className="slip-generation">
            <h3>Slip Generation</h3>
        
            <div className="slip-status">
              <div className={`slip-status-icon ${canGenerateSlip() ? 'ready' : 'pending'}`}>
                {canGenerateSlip() ? '✓' : '○'}
              </div>
              <div className="slip-status-text">
                <h3>
                  {canGenerateSlip() ? 'Ready to Generate Slip' : 'Pending Approvals'}
                </h3>
                <p>
                  {canGenerateSlip() 
                    ? 'All approvals completed. You can now generate your slip.'
                    : 'Please wait for all required approvals to be completed.'
                  }
                </p>
              </div>
            </div>

            {approval && (
              <div className="slip-requirements">
                <h4 className="requirements-title">Approval Status</h4>
                <ul className="requirements-list">
                  {approval.subjectApprovals.map((subApproval) => (
                    <li 
                      key={subApproval.subjectId}
                      className={subApproval.status === 'approved' ? 'completed' : 'pending'}
                    >
                      {subApproval.subjectName} - {subApproval.status}
                    </li>
                  ))}
                  <li className={approval.miniProjectApproval.status === 'approved' ? 'completed' : 'pending'}>
                    Mini Project - {approval.miniProjectApproval.status}
                  </li>
                  <li className={approval.mentorApproval.status === 'approved' ? 'completed' : 'pending'}>
                    Mentor Approval - {approval.mentorApproval.status}
                  </li>
                  <li className={approval.counsellorApproval.status === 'approved' ? 'completed' : 'pending'}>
                    Counsellor Approval - {approval.counsellorApproval.status}
                  </li>
                  <li className={approval.hodApproval.status === 'approved' ? 'completed' : 'pending'}>
                    HOD Approval - {approval.hodApproval.status}
                  </li>
                </ul>
              </div>
            )}

            <button
              className="generate-slip-button"
              onClick={handleGenerateSlip}
              disabled={!canGenerateSlip() || slipGenerated}
            >
              {slipGenerated ? 'Slip Generated ✓' : 'Generate Slip'}
            </button>

            {slipGenerated && (
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
                    <div className="slip-field">
                      <span className="slip-field-label">Year:</span>
                      <span className="slip-field-value">{student.year}</span>
                    </div>
                    <div className="slip-field">
                      <span className="slip-field-label">Semester:</span>
                      <span className="slip-field-value">{student.sem}</span>
                    </div>
                  </div>
                  
                  <div className="slip-section">
                    <h4>Academic Details</h4>
                    <div className="slip-field">
                      <span className="slip-field-label">Division:</span>
                      <span className="slip-field-value">{student.divId}</span>
                    </div>
                    <div className="slip-field">
                      <span className="slip-field-label">Batch:</span>
                      <span className="slip-field-value">{student.batchId}</span>
                    </div>
                    <div className="slip-field">
                      <span className="slip-field-label">Generated:</span>
                      <span className="slip-field-value">{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="slip-approvals">
                  <h4>Approval Chain</h4>
                  <div className="approvals-grid">
                    {approval.subjectApprovals.map((subApproval) => (
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
                        {approval.miniProjectApproval.status === 'approved' ? '✓ Approved' : '○ Pending'}
                      </div>
                      <div className="approval-timestamp">
                        {approval.miniProjectApproval.timestamp ? new Date(approval.miniProjectApproval.timestamp).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                    <div className="approval-item">
                      <div className="approval-role">Mentor</div>
                      <div className="approval-signature">
                        {approval.mentorApproval.status === 'approved' ? '✓ Approved' : '○ Pending'}
                      </div>
                      <div className="approval-timestamp">
                        {approval.mentorApproval.timestamp ? new Date(approval.mentorApproval.timestamp).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                    <div className="approval-item">
                      <div className="approval-role">Counsellor</div>
                      <div className="approval-signature">
                        {approval.counsellorApproval.status === 'approved' ? '✓ Approved' : '○ Pending'}
                      </div>
                      <div className="approval-timestamp">
                        {approval.counsellorApproval.timestamp ? new Date(approval.counsellorApproval.timestamp).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                    <div className="approval-item">
                      <div className="approval-role">HOD</div>
                      <div className="approval-signature">
                        {approval.hodApproval.status === 'approved' ? '✓ Approved' : '○ Pending'}
                      </div>
                      <div className="approval-timestamp">
                        {approval.hodApproval.timestamp ? new Date(approval.hodApproval.timestamp).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSlip;
