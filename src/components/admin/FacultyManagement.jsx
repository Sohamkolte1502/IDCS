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
  const [searchRollNo, setSearchRollNo] = useState('');
  const [searchResults, setSearchResults] = useState([]);

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

  const handleSearchStudent = () => {
    if (searchRollNo.trim()) {
      const foundStudents = students.filter(student => 
        student.rollNo.toLowerCase().includes(searchRollNo.toLowerCase())
      );
      setSearchResults(foundStudents);
    } else {
      setSearchResults([]);
    }
  };

  const getFilteredStudents = () => {
    if (searchResults.length > 0) {
      return searchResults;
    }
    return students;
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
            
            {/* Search Bar */}
            <div className="search-section">
              <h4>Search Student by Roll Number</h4>
              <div className="search-controls">
                <input
                  type="text"
                  placeholder="Enter Student Roll Number..."
                  value={searchRollNo}
                  onChange={(e) => setSearchRollNo(e.target.value)}
                  className="search-input"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchStudent()}
                />
                <button 
                  className="search-btn"
                  onClick={handleSearchStudent}
                >
                  Search
                </button>
                {searchRollNo && (
                  <button 
                    className="clear-btn"
                    onClick={() => {
                      setSearchRollNo('');
                      setSearchResults([]);
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>
              
              {searchResults.length > 0 && (
                <div className="search-results">
                  <p>Found {searchResults.length} student(s) matching "{searchRollNo}"</p>
                </div>
              )}
              
              {searchResults.length === 0 && searchRollNo && (
                <div className="no-results">
                  <p>No students found with roll number: {searchRollNo}</p>
                </div>
              )}
            </div>
            
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
                  {getFilteredStudents().map(s => (
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
