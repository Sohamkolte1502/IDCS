import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);
  
  const { login, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on role
      const roleRoutes = {
        student: '/student',
        teacher: '/faculty',
        hod: '/hod',
        admin: '/admin',
        office: '/office'
      };
      
      const redirectPath = roleRoutes[user.role] || '/';
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userData = await login(email, password);
      
      // Redirect based on role
      const roleRoutes = {
        student: '/student',
        teacher: '/faculty',
        hod: '/hod',
        admin: '/admin',
        office: '/office'
      };
      
      const redirectPath = roleRoutes[userData.role] || '/';
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRoleFromEmail = (email) => {
    const domain = email.split('@')[1]?.toLowerCase();
    
    if (domain === 'dypatil.edu' || domain === 'students.dypatil.edu') {
      return 'Student';
    }
    if (domain?.endsWith('.ac.in') || domain === 'college.ac.in') {
      return 'Teacher';
    }
    if (domain === 'idcs.dypatil.edu' || domain?.includes('office')) {
      return 'Office Staff';
    }
    if (email.toLowerCase() === 'admin@dypatil.edu') {
      return 'Administrator';
    }
    if (email.toLowerCase() === 'hod@dypatil.edu') {
      return 'HOD';
    }
    
    return null;
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    const role = getRoleFromEmail(e.target.value);
    setShowHint(!!role);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">IDCS Login</h1>
          <p className="login-subtitle">College Slip Automation System</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {showHint && (
          <div className="domain-hint">
            <h4>Role Detection</h4>
            <p>Detected role: <strong>{getRoleFromEmail(email)}</strong></p>
            <p>Role is automatically determined from your email domain.</p>
          </div>
        )}

        <div className="domain-hint">
          <h4>Test Credentials</h4>
          <ul>
            <li><strong>Admin:</strong> admin@dypatil.edu / admin123</li>
            <li><strong>Student:</strong> student1@students.dypatil.edu / student123</li>
            <li><strong>Teacher:</strong> teacher1@dypatil.edu / teacher123</li>
            <li><strong>HOD:</strong> hod@dypatil.edu / hod123</li>
            <li><strong>Office:</strong> office@idcs.dypatil.edu / office123</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;
