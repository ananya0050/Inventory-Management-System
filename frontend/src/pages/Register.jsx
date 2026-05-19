import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../Auth.css';

export default function Register() {
  const [form,     setForm]     = useState({ name: '', email: '', password: '' });
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      // role is NOT sent — backend always sets new users as 'user'
      await axios.post('http://localhost:5000/api/auth/register', form);
      setSuccess('Registered successfully! Redirecting to login…');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <h2>Create Account</h2>

        {error && (
          <div style={{
            background: '#fee2e2', border: '1px solid #fca5a5',
            borderRadius: '8px', padding: '12px 16px',
            color: '#991b1b', fontSize: '13px', marginBottom: '16px',
          }}>{error}</div>
        )}
        {success && (
          <div style={{
            background: '#d1fae5', border: '1px solid #6ee7b7',
            borderRadius: '8px', padding: '12px 16px',
            color: '#065f46', fontSize: '13px', marginBottom: '16px',
          }}>{success}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input type="text" name="name" placeholder="Enter Full Name"
              value={form.name} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input type="email" name="email" placeholder="Enter Email"
              value={form.email} onChange={handleChange} required />
          </div>

          {/* Password with eye icon */}
          <div className="input-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                name="password" placeholder="Enter Password (min 6 chars)"
                value={form.password} onChange={handleChange}
                required
                style={{ paddingRight: '44px', width: '100%' }}
              />
              <span
                onClick={() => setShowPass((s) => !s)}
                title={showPass ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute', right: '12px', top: '50%',
                  transform: 'translateY(-50%)', cursor: 'pointer',
                  color: '#888', fontSize: '16px', userSelect: 'none',
                }}
              >
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* NOTE: No role selector — new users are always 'user'.
              Admins are assigned by existing admins via the admin panel. */}

          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? 'Registering…' : 'Sign Up'}
          </button>
        </form>
      </div>

      <div className="auth-right">
        <h2>Welcome Back!</h2>
        <p>Already have an account?</p>
        <Link to="/login">
          <button className="login-btn">Login</button>
        </Link>
        <Link to="/" style={{ display: 'block', marginTop: '12px',
          color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}