import React, { useState } from 'react';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import useAppStore from '../store/useAppStore';
import '../styles/Login.css';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  // from store
  const login = useAppStore((s) => s.login);
  const currentUser = useAppStore((s) => s.currentUser);

  // local form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // already logged in? bounce to dashboard
  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    try {
      setSubmitting(true);
      await login(username.trim(), password);
      await useAppStore.getState().hydrateAll();

      // Respect the originally requested route set by ProtectedRoute
      const fromPath = location.state?.from?.pathname || '/';
      navigate(fromPath, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <img
            src="/assets/rigsheet-logo-dark.png"
            alt="RigSheet"
            className="login-logo"
            loading="eager"
          />
          <h1 className="login-title">Sign in to RigSheet</h1>
          <p className="login-subtitle">Manage your build, sponsors & trail presence</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <label className="login-label">
            <span>Username</span>
            <input
              className="login-input"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your_username"
            />
          </label>

          <label className="login-label">
            <span>Password</span>
            <div className="password-wrap">
              <input
                className="login-input"
                type={showPw ? 'text' : 'password'}
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="toggle-pw"
                onClick={() => setShowPw((s) => !s)}
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>

          {error && <div className="login-error" role="alert">{error}</div>}

          <button className="login-button" type="submit" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="login-footer">
          <span className="muted">Tip:</span> Use your seeded account (e.g. <code>demo / demo123</code>)
        </div>
      </div>
    </div>
  );
}

export default Login;