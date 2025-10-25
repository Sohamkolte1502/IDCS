import React, { useState } from 'react';

const MasterData = ({ uploadHistory, handleFileUpload, loading }) => {
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
        <h2>Data Ingestion & Master Management</h2>
        <button 
          className="collapse-btn"
          onClick={() => toggleSection('data-ingestion')}
        >
          {collapsedSections['data-ingestion'] ? '▼' : '▲'}
        </button>
      </div>
      
      {!collapsedSections['data-ingestion'] && (
        <div className="section-content">
          
          <div className="upload-section">
            <h3>Upload Load Allocation Data</h3>
            <div className="upload-area" onClick={() => document.getElementById('subjects-input').click()}>
              <div className="upload-icon"></div>
              <h4>Upload Load Allocation Data Only</h4>
              <p>Click to select CSV/Excel file</p>
              <input
                id="subjects-input"
                type="file"
                className="file-input"
                onChange={(e) => handleFileUpload(e, 'Subjects')}
                accept=".csv,.xlsx"
              />
            </div>
            <button className="upload-button" onClick={() => document.getElementById('subjects-input').click()}>
              Choose File
            </button>
          </div>
          {/* Upload Teachers */}
          <div className="upload-section">
            <h3>Upload Teachers</h3>
            <div className="upload-area" onClick={() => document.getElementById('teachers-input').click()}>
              <div className="upload-icon"></div>
              <h4>Upload Faculty Data Only</h4>
              <p>Click to select CSV/Excel file</p>
              <input
                id="teachers-input"
                type="file"
                className="file-input"
                onChange={(e) => handleFileUpload(e, 'Teachers')}
                accept=".csv,.xlsx"
              />
            </div>
            <button className="upload-button" onClick={() => document.getElementById('teachers-input').click()}>
              Choose File
            </button>
          </div>



          {/* Upload Students */}
          <div className="upload-section">
            <h3>Upload Students</h3>
            <div className="upload-area" onClick={() => document.getElementById('students-input').click()}>
              <div className="upload-icon"></div>
              <h4>Upload Student Data Only</h4>
              <p>Click to select CSV/Excel file</p>
              <input
                id="students-input"
                type="file"
                className="file-input"
                onChange={(e) => handleFileUpload(e, 'Students')}
                accept=".csv,.xlsx"
              />
            </div>
            <button className="upload-button" onClick={() => document.getElementById('students-input').click()}>
              Choose File
            </button>
          </div>

         
          <div className="upload-section">
            <h3>Upload Subjects</h3>
            <div className="upload-area" onClick={() => document.getElementById('subjects-input').click()}>
              <div className="upload-icon"></div>
              <h4>Upload Subject Data Only</h4>
              <p>Click to select CSV/Excel file</p>
              <input
                id="subjects-input"
                type="file"
                className="file-input"
                onChange={(e) => handleFileUpload(e, 'Subjects')}
                accept=".csv,.xlsx"
              />
            </div>
            <button className="upload-button" onClick={() => document.getElementById('subjects-input').click()}>
              Choose File
            </button>
          </div>
          {/* Upload Subjects */}
          <div className="upload-section">
            <h3>Upload Mini Project Data</h3>
            <div className="upload-area" onClick={() => document.getElementById('subjects-input').click()}>
              <div className="upload-icon"></div>
              <h4>Upload Mini Projects Data Only</h4>
              <p>Click to select CSV/Excel file</p>
              <input
                id="subjects-input"
                type="file"
                className="file-input"
                onChange={(e) => handleFileUpload(e, 'Subjects')}
                accept=".csv,.xlsx"
              />
            </div>
            <button className="upload-button" onClick={() => document.getElementById('subjects-input').click()}>
              Choose File
            </button>
          </div>


          {/* Upload History */}
          <div className="upload-history">
            <h3>Upload History Log</h3>
            <div className="history-table">
              <table>
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Filename</th>
                    <th>Data Type</th>
                    <th>Records</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {uploadHistory.map(entry => (
                    <tr key={entry.id}>
                      <td>{new Date(entry.timestamp).toLocaleString()}</td>
                      <td>{entry.filename}</td>
                      <td>{entry.dataType}</td>
                      <td>{entry.recordsProcessed}</td>
                      <td>
                        <span className={`status-badge ${entry.status}`}>
                          {entry.status}
                        </span>
                      </td>
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

export default MasterData;
