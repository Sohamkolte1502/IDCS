import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import ApprovalBadge from '../components/common/ApprovalBadge';
import Dashboard from '../components/admin/Dashboard';
import MasterData from '../components/admin/MasterData';
import FacultyManagement from '../components/admin/FacultyManagement';
import StudentManagement from '../components/admin/StudentManagement';
import DataSync from '../components/admin/DataSync';
import studentsData from '../data/students.json';
import facultyData from '../data/faculty.json';
import subjectsData from '../data/subjects.json';
import departmentsData from '../data/departments.json';
import batchesData from '../data/batches.json';
import miniProjectsData from '../data/miniProjects.json';
import approvalsData from '../data/approvals.json';
import '../styles/admin.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  // Determine current section based on URL
  const getCurrentSection = () => {
    const path = location.pathname;
    if (path === '/admin' || path === '/admin/') return 'dashboard';
    if (path === '/admin/master-data') return 'master-data';
    if (path === '/admin/faculty') return 'faculty-management';
    if (path === '/admin/students') return 'student-management';
    if (path === '/admin/sync') return 'data-sync';
    return 'dashboard';
  };

  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    pendingApprovals: 0,
    completedApprovals: 0,
    activeUsers: 0,
    unallocatedSubjects: 0
  });
  const [faculty, setFaculty] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [miniProjects, setMiniProjects] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [collapsedSections, setCollapsedSections] = useState({});
  const [editModes, setEditModes] = useState({});
  const [uploadHistory, setUploadHistory] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [filteredApprovals, setFilteredApprovals] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all',
    department: 'all',
    division: 'all',
    year: 'all'
  });
  const [systemAdmins, setSystemAdmins] = useState(() => {
    const saved = localStorage.getItem('systemAdmins');
    return saved ? JSON.parse(saved) : {
      systemAdmin1: { name: 'System Admin 1', email: 'admin1@dypatil.edu' },
      systemAdmin2: { name: 'System Admin 2', email: 'admin2@dypatil.edu' }
    };
  });

  useEffect(() => {
    // Initialize data
    setFaculty(facultyData);
    setStudents(studentsData);
    setSubjects(subjectsData);
    setDepartments(departmentsData);
    setBatches(batchesData);
    setMiniProjects(miniProjectsData);
    setApprovals(approvalsData);
    setFilteredApprovals(approvalsData);
    
    // Calculate stats
    const totalStudents = studentsData.length;
    const totalFaculty = facultyData.length;
    const pendingApprovals = approvalsData.filter(a => 
      a.hodApproval.status === 'pending'
    ).length;
    const completedApprovals = approvalsData.filter(a => 
      a.hodApproval.status === 'approved'
    ).length;
    const activeUsers = totalStudents + totalFaculty;
    const unallocatedSubjects = subjectsData.filter(s => !s.teacher).length;

    setStats({
      totalStudents,
      totalFaculty,
      pendingApprovals,
      completedApprovals,
      activeUsers,
      unallocatedSubjects
    });

    // Initialize audit logs
    const initialLogs = [
      { id: 1, user: 'Admin', action: 'System initialized', timestamp: new Date().toISOString() },
      { id: 2, user: 'Admin', action: 'Data loaded successfully', timestamp: new Date().toISOString() }
    ];
    setAuditLogs(initialLogs);
    
    setLoading(false);
  }, []);

  // Filter approvals based on current filters
  useEffect(() => {
    let filtered = approvals;
    
    if (filters.status !== 'all') {
      filtered = filtered.filter(a => a.hodApproval.status === filters.status);
    }
    
    if (filters.department !== 'all') {
      filtered = filtered.filter(a => {
        const student = students.find(s => s.id === a.studentId);
        return student?.deptId === filters.department;
      });
    }
    
    if (filters.division !== 'all') {
      filtered = filtered.filter(a => {
        const student = students.find(s => s.id === a.studentId);
        return student?.divId === filters.division;
      });
    }
    
    if (filters.year !== 'all') {
      filtered = filtered.filter(a => {
        const student = students.find(s => s.id === a.studentId);
        return student?.year === parseInt(filters.year);
      });
    }
    
    setFilteredApprovals(filtered);
  }, [filters, approvals, students]);

  // Utility functions
  const showToast = (message, type = 'success') => {
    alert(`${type.toUpperCase()}: ${message}`);
  };

  const addAuditLog = (action) => {
    const newLog = {
      id: auditLogs.length + 1,
      user: user.name,
      action,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

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

  // File upload handlers
  const handleFileUpload = async (event, dataType) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    
    // Simulate file processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Add to upload history
    const uploadEntry = {
      id: uploadHistory.length + 1,
      filename: file.name,
      dataType,
      timestamp: new Date().toISOString(),
      status: 'success',
      recordsProcessed: Math.floor(Math.random() * 100) + 10
    };
    setUploadHistory(prev => [uploadEntry, ...prev]);
    
    showToast(`File "${file.name}" uploaded successfully! ${uploadEntry.recordsProcessed} records processed.`);
    addAuditLog(`Uploaded ${dataType} data from ${file.name}`);
    setLoading(false);
  };

  // Data editing handlers
  const handleFacultyRoleUpdate = async (facultyId, role, checked) => {
    setLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setFaculty(prev => prev.map(f => {
      if (f.id === facultyId) {
        const updatedRoles = checked 
          ? [...(f.roles || []), role]
          : (f.roles || []).filter(r => r !== role);
        
        return { ...f, roles: updatedRoles };
      }
      return f;
    }));
    
    addAuditLog(`Updated faculty roles for ${facultyId}`);
    setLoading(false);
  };

  const handleStudentSubjectUpdate = (studentId, subjectId, action) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        if (action === 'remove') {
          return {
            ...s,
            subjects: s.subjects.filter(sub => sub.subjectId !== subjectId)
          };
        } else if (action === 'add') {
          const newSubject = subjects.find(sub => sub.subjectId === subjectId);
          if (newSubject && !s.subjects.find(sub => sub.subjectId === subjectId)) {
            return {
              ...s,
              subjects: [...s.subjects, newSubject]
            };
          }
        }
      }
      return s;
    }));
    addAuditLog(`Updated subjects for student ${studentId}`);
  };

  const handleFacultyReassignment = (studentId, newFacultyId) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return { ...s, assignedFaculty: newFacultyId };
      }
      return s;
    }));
    addAuditLog(`Reassigned student ${studentId} to faculty ${newFacultyId}`);
  };

  const handleBatchTransfer = (studentId, newBatchId) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return { ...s, batchId: newBatchId };
      }
      return s;
    }));
    addAuditLog(`Transferred student ${studentId} to batch ${newBatchId}`);
  };

  const handlePromoteStudents = () => {
    if (window.confirm('Are you sure you want to promote all students to the next semester?')) {
      setStudents(prev => prev.map(s => ({
        ...s,
        sem: s.sem < 8 ? s.sem + 1 : s.sem,
        year: s.sem === 8 ? s.year + 1 : s.year
      })));
      showToast('All students promoted successfully!');
      addAuditLog('Promoted all students to next semester');
    }
  };

  const handleArchiveStudents = (studentId) => {
    if (window.confirm('Are you sure you want to archive this student?')) {
      setStudents(prev => prev.filter(s => s.id !== studentId));
      showToast('Student archived successfully!');
      addAuditLog(`Archived student ${studentId}`);
    }
  };

  const handleUpdateHOD = (departmentId, newHODId) => {
    setDepartments(prev => prev.map(d => {
      if (d.deptId === departmentId) {
        const newHOD = faculty.find(f => f.id === newHODId);
        return {
          ...d,
          hodId: newHODId,
          hodName: newHOD?.name || 'Unknown'
        };
      }
      return d;
    }));
    showToast('HOD updated successfully!');
    addAuditLog(`Updated HOD for department ${departmentId}`);
  };

  const handleAssignDLO = (facultyId) => {
    showToast(`Faculty ${facultyId} assigned as DLO/ILO Incharge!`);
    addAuditLog(`Assigned faculty ${facultyId} as DLO/ILO Incharge`);
  };

  const handleSyncSlips = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    showToast('Slips generated and synchronized successfully!');
    addAuditLog('Generated and synchronized all slips');
    setLoading(false);
  };

  const handleTransferAdminRole = (newAdminId) => {
    if (window.confirm('Are you sure you want to transfer admin role? This will log you out.')) {
      showToast('Admin role transferred successfully! Please login again.');
      addAuditLog(`Transferred admin role to ${newAdminId}`);
      // In a real app, this would trigger logout
    }
  };

  const handleResetPassword = (newPassword) => {
    if (window.confirm('Are you sure you want to reset the admin password?')) {
      showToast('Admin password reset successfully!');
      addAuditLog('Reset admin password');
    }
  };

  const handleSync = async (type) => {
    setLoading(true);
    
    // Simulate sync operation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    alert(`${type} sync completed successfully!`);
    setLoading(false);
  };

  const handleUpdateSystemAdmin = (admin, newName) => {
    setSystemAdmins(prev => {
      const updated = {
        ...prev,
        [admin]: {
          ...prev[admin],
          name: newName
        }
      };
      localStorage.setItem('systemAdmins', JSON.stringify(updated));
      return updated;
    });
    showToast('System admin name updated successfully!');
    addAuditLog(`Updated ${admin} name to "${newName}"`);
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

  const currentSection = getCurrentSection();

  return (
    <div className="admin-dashboard">
      <div className="admin-content">
        {/* Header */}
        

        {/* Dashboard Section */}
        {currentSection === 'dashboard' && (
          <Dashboard 
            stats={stats} 
            user={user}
            systemAdmins={systemAdmins}
            onUpdateSystemAdmin={handleUpdateSystemAdmin}
          />
        )}

        {/* Master Data Section */}
        {currentSection === 'master-data' && (
          <MasterData 
            uploadHistory={uploadHistory} 
            handleFileUpload={handleFileUpload} 
            loading={loading} 
          />
        )}

        {/* Faculty Management Section */}
        {currentSection === 'faculty-management' && (
          <FacultyManagement 
            faculty={faculty}
            students={students}
            subjects={subjects}
            batches={batches}
            handleFacultyRoleUpdate={handleFacultyRoleUpdate}
            handleStudentSubjectUpdate={handleStudentSubjectUpdate}
            handleAssignDLO={handleAssignDLO}
            handleSyncSlips={handleSyncSlips}
            loading={loading}
          />
        )}

        {/* Student Management Section */}
        {currentSection === 'student-management' && (
          <StudentManagement 
            students={students}
            faculty={faculty}
            departments={departments}
            batches={batches}
            handlePromoteStudents={handlePromoteStudents}
            handleArchiveStudents={handleArchiveStudents}
            handleFacultyReassignment={handleFacultyReassignment}
            handleBatchTransfer={handleBatchTransfer}
            handleUpdateHOD={handleUpdateHOD}
          />
        )}

        {/* Data Sync Section */}
        {currentSection === 'data-sync' && (
          <DataSync 
            stats={stats}
            students={students}
            departments={departments}
            filteredApprovals={filteredApprovals}
            filters={filters}
            setFilters={setFilters}
            auditLogs={auditLogs}
          />
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
