import React, { useState } from 'react';

const FacultyManagement = ({ 
  faculty, 
  students, 
  subjects, 
  batches, 
  handleFacultyRoleUpdate, 
  handleStudentSubjectUpdate, 
  handleAssignDLO, 
  handleSyncSlips, 
  loading 
}) => {
  const [collapsedSections, setCollapsedSections] = useState({});
  const [editModes, setEditModes] = useState({});

  const toggleSection = (sectionName) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  const toggleEditMode = (tableName, id) => {
    const key = `${tableName}-${id}`;
    setEditModes(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="section">
      <div className="section-header">
        <h2>System Configuration & Mapping</h2>
        <button 
          className="collapse-btn"
          onClick={() => toggleSection('mapping')}
        >
          {collapsedSections['mapping'] ? '▼' : '▲'}
        </button>
      </div>
      
      {!collapsedSections['mapping'] && (
        <div className="section-content">
          {/* Faculty Load Allocation */}
          <div className="mapping-section">
            <h3>Faculty Load Allocation</h3>
            <div className="faculty-allocation-table">
              <table>
                <thead>
                  <tr>
                    <th>Faculty</th>
                    <th>Roles</th>
                    <th>Subjects</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {faculty.map(f => (
                    <tr key={f.id}>
                      <td>
                        <div>
                          <strong>{f.name}</strong>
                          <br />
                          <small>{f.email}</small>
                        </div>
                      </td>
                      <td>
                        {f.roles?.map(role => (
                          <span key={role} className="role-badge">{role}</span>
                        ))}
                      </td>
                      <td>
                        {f.subjects?.map(sub => (
                          <span key={sub.subjectId} className="subject-badge">
                            {sub.subjectName}
                          </span>
                        ))}
                      </td>
                      <td>
                        <button 
                          className="edit-btn"
                          onClick={() => toggleEditMode('faculty', f.id)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Subject Remapping */}
          <div className="mapping-section">
            <h3>Change Subjects in Slip</h3>
            <div className="subject-remapping">
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Current Subjects</th>
                    <th>Add Subject</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(s => (
                    <tr key={s.id}>
                      <td>{s.name} ({s.rollNo})</td>
                      <td>
                        {s.subjects?.map(sub => (
                          <span key={sub.subjectId} className="subject-badge">
                            {sub.subjectName}
                            <button 
                              className="remove-btn"
                              onClick={() => handleStudentSubjectUpdate(s.id, sub.subjectId, 'remove')}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </td>
                      <td>
                        <select onChange={(e) => handleStudentSubjectUpdate(s.id, e.target.value, 'add')}>
                          <option value="">Select Subject</option>
                          {subjects.map(sub => (
                            <option key={sub.subjectId} value={sub.subjectId}>
                              {sub.subjectName}
                            </option>
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

          {/* DLO/ILO Assignment */}
          <div className="mapping-section">
            <h3>Assign DLO/ILO Incharge</h3>
            <div className="dlo-assignment">
              <select onChange={(e) => handleAssignDLO(e.target.value)}>
                <option value="">Select Faculty</option>
                {faculty.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
              <button 
                className="assign-btn"
                onClick={() => handleAssignDLO('selected')}
              >
                Assign as Incharge
              </button>
            </div>
          </div>

          {/* Slip Synchronization */}
          <div className="mapping-section">
            <h3>Slip Synchronization</h3>
            <button 
              className="sync-btn"
              onClick={handleSyncSlips}
              disabled={loading}
            >
              Generate / Sync Slips for Current Semester
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyManagement;
