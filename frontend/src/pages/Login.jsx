import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../Auth.css';

export default function Login() {
  const [form,     setForm]     = useState({ email: '', password: '' });
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user',  JSON.stringify(res.data.user));

      if (res.data.user.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/employee-dashboard');
      }
    } catch (err) {
      const code = err.response?.data?.code;
      const msg  = err.response?.data?.message || 'Login failed.';

      // Special banner for deleted accounts
      if (code === 'ACCOUNT_DELETED') {
        setError('🚫 Your account has been deleted by admin. Please contact support.');
      } else {
        setError(msg);
      }
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <h2>Login</h2>

        {error && (
          <div style={{
            background: '#fee2e2', border: '1px solid #fca5a5',
            borderRadius: '8px', padding: '12px 16px',
            color: '#991b1b', fontSize: '13px', marginBottom: '18px',
            lineHeight: 1.5,
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="input-group">
            <label>Email</label>
            <input
              type="email" name="email" placeholder="Enter Email"
              value={form.email} onChange={handleChange} required
            />
          </div>

          {/* Password with eye toggle */}
          <div className="input-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                name="password" placeholder="Enter Password"
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

          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>
      </div>

      <div className="auth-right">
        <h2>Hello Friend!</h2>
        <p>Don't have an account?</p>
        <Link to="/register">
          <button className="login-btn">Sign Up</button>
        </Link>
        <Link to="/" style={{ display: 'block', marginTop: '12px',
          color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}