import React, { useState } from 'react';

const StudentManagement = ({ 
  students, 
  faculty, 
  departments, 
  batches, 
  handlePromoteStudents, 
  handleArchiveStudents, 
  handleFacultyReassignment, 
  handleBatchTransfer, 
  handleUpdateHOD 
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
        <h2>Student & Faculty Lifecycle</h2>
        <button 
          className="collapse-btn"
          onClick={() => toggleSection('lifecycle')}
        >
          {collapsedSections['lifecycle'] ? '▼' : '▲'}
        </button>
      </div>
      
      {!collapsedSections['lifecycle'] && (
        <div className="section-content">
          {/* Promote Students */}
          {/* <div className="lifecycle-section">
            <h3>Promote Students</h3>
            <button 
              className="promote-btn"
              onClick={handlePromoteStudents}
            >
              Promote All Students (Year + Sem ↑)
            </button>
          </div> */}

          {/* Archive/Delete Students */}
          {/* <div className="lifecycle-section">
            <h3>Archive / Delete Students</h3>
            <div className="archive-table">
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Semester</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.filter(s => s.sem === 8).map(s => (
                    <tr key={s.id}>
                      <td>{s.name} ({s.rollNo})</td>
                      <td>{s.sem}</td>
                      <td>Graduating</td>
                      <td>
                        <button 
                          className="archive-btn"
                          onClick={() => handleArchiveStudents(s.id)}
                        >
                          Archive
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => handleArchiveStudents(s.id)}
                        >
                          Delete Permanently
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div> */}

          {/* Faculty Reassignment */}
          <div className="lifecycle-section">
            <h3>Reassign Batch or Faculty</h3>
            <div className="reassignment-table">
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Current Faculty</th>
                    <th>New Faculty</th>
                    <th>New Batch</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(s => (
                    <tr key={s.id}>
                      <td>{s.name} ({s.rollNo})</td>
                      <td>{s.assignedFaculty || 'Not Assigned'}</td>
                      <td>
                        <select onChange={(e) => handleFacultyReassignment(s.id, e.target.value)}>
                          <option value="">Select Faculty</option>
                          {faculty.map(f => (
                            <option key={f.id} value={f.id}>{f.name}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <select onChange={(e) => handleBatchTransfer(s.id, e.target.value)}>
                          <option value="">Select Batch</option>
                          {batches.map(b => (
                            <option key={b.batchId} value={b.batchId}>{b.batchId}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <button className="save-btn">Save Changes</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Update HOD Role */}
          <div className="lifecycle-section">
            <h3>Update HOD Role</h3>
            <div className="hod-update">
              {departments.map(dept => (
                <div key={dept.deptId} className="hod-section">
                  <h4>{dept.deptName}</h4>
                  <select onChange={(e) => handleUpdateHOD(dept.deptId, e.target.value)}>
                    <option value="">Select New HOD</option>
                    {faculty.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                  <button 
                    className="update-btn"
                    onClick={() => handleUpdateHOD(dept.deptId, 'selected')}
                  >
                    Update HOD
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
