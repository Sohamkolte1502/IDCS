import React, { createContext, useContext, useState, useEffect } from 'react';
import usersData from '../data/users.json';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Email domain to role mapping
const getRoleFromEmail = (email) => {
  const domain = email.split('@')[1]?.toLowerCase();
  
  // Student domains
  if (domain === 'dypatil.edu' || domain === 'students.dypatil.edu') {
    return 'student';
  }
  
  // Teacher domains
  if (domain?.endsWith('.ac.in') || domain === 'college.ac.in' || domain === 'dypatil.edu') {
    return 'teacher';
  }
  
  // Office staff domains
  if (domain === 'idcs.dypatil.edu' || domain?.includes('office')) {
    return 'office';
  }
  
  // Admin - specific emails
  const adminEmails = ['admin@dypatil.edu', 'hod@dypatil.edu'];
  if (adminEmails.includes(email.toLowerCase())) {
    return email.toLowerCase() === 'hod@dypatil.edu' ? 'hod' : 'admin';
  }
  
  return null;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app load
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user in mock data
      const foundUser = usersData.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && 
        u.password === password
      );
      
      if (!foundUser) {
        throw new Error('Invalid credentials');
      }
      
      // Determine role from email domain
      const roleFromEmail = getRoleFromEmail(email);
      
      // Override role if user has specific role in data
      const userRole = foundUser.role || roleFromEmail;
      
      if (!userRole) {
        throw new Error('Unable to determine user role from email domain');
      }
      
      const userData = {
        ...foundUser,
        role: userRole,
        loginTime: new Date().toISOString()
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return userData;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isStudent: user?.role === 'student',
    isTeacher: user?.role === 'teacher',
    isHOD: user?.role === 'hod',
    isAdmin: user?.role === 'admin',
    isOffice: user?.role === 'office'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
