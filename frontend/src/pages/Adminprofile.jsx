import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaCamera, FaEdit, FaKey, FaUserCircle, FaEye, FaEyeSlash } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import Toast from '../components/Toast';
import useToast from '../hooks/useToast';

const API = 'http://localhost:5000/api/users';

export default function AdminProfile() {
  const [profile,    setProfile]    = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [sidebarW,   setSidebarW]   = useState(220);

  // Edit profile
  const [editMode,   setEditMode]   = useState(false);
  const [editForm,   setEditForm]   = useState({ name: '', email: '' });
  const [editSaving, setEditSaving] = useState(false);

  // Change password
  const [pwMode,     setPwMode]     = useState(false);
  const [pwForm,     setPwForm]     = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPw,     setShowPw]     = useState({ current: false, new: false, confirm: false });
  const [pwSaving,   setPwSaving]   = useState(false);

  // Profile picture
  const [picLoading, setPicLoading] = useState(false);
  const fileRef = useRef();

  const { toast, showToast, hideToast } = useToast();
  const navigate = useNavigate();
  const token   = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  // ─── Fetch profile ──────────────────────────────────────────────────────────
  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API}/me`, { headers });
      setProfile(res.data);
      setEditForm({ name: res.data.name, email: res.data.email });
    } catch (err) {
      if (err.response?.data?.code === 'ACCOUNT_DELETED') {
        localStorage.clear();
        navigate('/login');
      }
      showToast('Failed to load profile.', 'error');
    }
    setLoading(false);
  };

  useEffect(() => { fetchProfile(); }, []);

  // ─── Update profile ─────────────────────────────────────────────────────────
  const handleEditSave = async () => {
    if (!editForm.name.trim() || !editForm.email.trim()) {
      showToast('Name and email are required.', 'error'); return;
    }
    setEditSaving(true);
    try {
      const res = await axios.put(`${API}/me/update`, editForm, { headers });
      showToast(res.data.message, 'success');
      // Update localStorage so Sidebar/header reflects new name
      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({
        ...stored,
        name:  res.data.user.name,
        email: res.data.user.email,
      }));
      setProfile((p) => ({ ...p, ...res.data.user }));
      setEditMode(false);
    } catch (err) {
      showToast(err.response?.data?.message || 'Update failed.', 'error');
    }
    setEditSaving(false);
  };

  // ─── Change password ────────────────────────────────────────────────────────
  const handlePasswordSave = async () => {
    if (!pwForm.currentPassword || !pwForm.newPassword || !pwForm.confirmPassword) {
      showToast('All fields are required.', 'error'); return;
    }
    if (pwForm.newPassword.length < 6) {
      showToast('New password must be at least 6 characters.', 'error'); return;
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      showToast('New passwords do not match.', 'error'); return;
    }
    setPwSaving(true);
    try {
      const res = await axios.put(
        `${API}/me/password`,
        { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword },
        { headers }
      );
      showToast(res.data.message, 'success');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPwMode(false);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to change password.', 'error');
    }
    setPwSaving(false);
  };

  // ─── Upload profile picture ─────────────────────────────────────────────────
  const handlePicture = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      showToast('Image must be under 3 MB.', 'error'); return;
    }

    const fd = new FormData();
    fd.append('profilePicture', file);

    setPicLoading(true);
    try {
      const res = await axios.post(`${API}/me/picture`, fd, {
        headers: { ...headers, 'Content-Type': 'multipart/form-data' },
      });
      const newPic = res.data.profilePicture;
      setProfile((p) => ({ ...p, profilePicture: newPic }));

      // Sync localStorage
      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...stored, profilePicture: newPic }));

      showToast('Profile picture updated!', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Upload failed.', 'error');
    }
    setPicLoading(false);
    e.target.value = ''; // reset file input
  };

  // ─── Helpers ────────────────────────────────────────────────────────────────
  const togglePw = (field) => setShowPw((s) => ({ ...s, [field]: !s[field] }));

  const PasswordInput = ({ field, label, placeholder }) => (
    <div style={{ marginBottom: '14px' }}>
      <label style={labelStyle}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          type={showPw[field] ? 'text' : 'password'}
          placeholder={placeholder}
          value={pwForm[field]}
          onChange={(e) => setPwForm((p) => ({ ...p, [field]: e.target.value }))}
          style={{ ...inputStyle, paddingRight: '44px' }}
        />
        <span onClick={() => togglePw(field)} style={eyeStyle}>
          {showPw[field] ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5' }}>
        <div style={{ color: '#888' }}>Loading profile…</div>
      </div>
    );
  }

  const avatarUrl = profile?.profilePicture
    ? `http://localhost:5000${profile.profilePicture}`
    : null;

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Sidebar onWidthChange={setSidebarW} />
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      <div style={{
        marginLeft: sidebarW, padding: '32px',
        width: `calc(100vw - ${sidebarW}px)`,
        transition: 'all 0.25s ease', boxSizing: 'border-box',
      }}>
        <h4 style={{ fontWeight: 700, fontSize: '26px', marginBottom: '28px' }}>My Profile</h4>

        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', flexWrap: 'wrap' }}>

          {/* ── Left card: avatar + basic info ── */}
          <div style={card}>
            {/* Avatar */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{
                position: 'relative', display: 'inline-block',
                width: 110, height: 110,
              }}>
                <div style={{
                  width: 110, height: 110, borderRadius: '50%',
                  overflow: 'hidden', border: '3px solid #e5e7eb',
                  background: '#f3f4f6', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <FaUserCircle style={{ fontSize: '80px', color: '#d1d5db' }} />
                  )}
                </div>

                {/* Camera button overlay */}
                <button
                  onClick={() => fileRef.current.click()}
                  disabled={picLoading}
                  title="Change profile picture"
                  style={{
                    position: 'absolute', bottom: 0, right: 0,
                    width: 32, height: 32, borderRadius: '50%',
                    background: '#4f46e5', border: '2px solid #fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: '#fff', fontSize: '13px',
                  }}
                >
                  {picLoading ? '…' : <FaCamera />}
                </button>

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  style={{ display: 'none' }}
                  onChange={handlePicture}
                />
              </div>

              <div style={{ marginTop: '14px' }}>
                <div style={{ fontWeight: 700, fontSize: '18px', color: '#111' }}>{profile?.name}</div>
                <div style={{ color: '#888', fontSize: '13px', marginTop: '4px' }}>{profile?.email}</div>
                <span style={{
                  display: 'inline-block', marginTop: '8px',
                  padding: '3px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600,
                  background: profile?.role === 'admin' ? '#dbeafe' : '#f3f4f6',
                  color:      profile?.role === 'admin' ? '#1d4ed8' : '#374151',
                }}>
                  {profile?.role}
                </span>
              </div>
            </div>

            {/* Meta info */}
            <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '16px' }}>
              <div style={infoRow}>
                <span style={infoLabel}>Member since</span>
                <span style={infoValue}>{new Date(profile?.createdAt).toLocaleDateString()}</span>
              </div>
              <div style={infoRow}>
                <span style={infoLabel}>Account type</span>
                <span style={infoValue}>{profile?.role === 'admin' ? 'Administrator' : 'Employee'}</span>
              </div>
            </div>
          </div>

          {/* ── Right column: edit + password panels ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Edit Profile Card */}
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h5 style={{ fontWeight: 700, margin: 0 }}>
                  <FaEdit style={{ marginRight: '8px', color: '#4f46e5' }} />
                  Edit Profile
                </h5>
                {!editMode && (
                  <button
                    onClick={() => setEditMode(true)}
                    style={outlineBtn}
                  >
                    Edit
                  </button>
                )}
              </div>

              <div>
                <div style={{ marginBottom: '14px' }}>
                  <label style={labelStyle}>Full Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                    disabled={!editMode}
                    style={{ ...inputStyle, background: editMode ? '#fff' : '#f9fafb' }}
                    placeholder="Your full name"
                  />
                </div>
                <div style={{ marginBottom: '14px' }}>
                  <label style={labelStyle}>Email Address</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                    disabled={!editMode}
                    style={{ ...inputStyle, background: editMode ? '#fff' : '#f9fafb' }}
                    placeholder="your@email.com"
                  />
                </div>
                <div style={{ marginBottom: '4px' }}>
                  <label style={labelStyle}>Role</label>
                  <input
                    type="text"
                    value={profile?.role}
                    disabled
                    style={{ ...inputStyle, background: '#f9fafb', color: '#888', cursor: 'not-allowed' }}
                  />
                  <p style={{ fontSize: '12px', color: '#9ca3af', margin: '4px 0 0' }}>
                    Role can only be changed by another admin.
                  </p>
                </div>
              </div>

              {editMode && (
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <button
                    onClick={handleEditSave}
                    disabled={editSaving}
                    style={primaryBtn}
                  >
                    {editSaving ? 'Saving…' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => {
                      setEditMode(false);
                      setEditForm({ name: profile.name, email: profile.email });
                    }}
                    style={outlineBtn}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Change Password Card */}
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h5 style={{ fontWeight: 700, margin: 0 }}>
                  <FaKey style={{ marginRight: '8px', color: '#4f46e5' }} />
                  Change Password
                </h5>
                {!pwMode && (
                  <button onClick={() => setPwMode(true)} style={outlineBtn}>
                    Change
                  </button>
                )}
              </div>

              {pwMode ? (
                <>
                  <PasswordInput field="current" label="Current Password" placeholder="Enter current password" />
                  <PasswordInput field="new"     label="New Password"     placeholder="At least 6 characters" />
                  <PasswordInput field="confirm" label="Confirm New Password" placeholder="Repeat new password" />

                  <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                    <button onClick={handlePasswordSave} disabled={pwSaving} style={primaryBtn}>
                      {pwSaving ? 'Saving…' : 'Update Password'}
                    </button>
                    <button
                      onClick={() => {
                        setPwMode(false);
                        setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      }}
                      style={outlineBtn}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0 }}>
                  Keep your account secure with a strong password.
                </p>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Shared styles ───────────────────────────────────────────────────────────
const card = {
  background: '#fff', borderRadius: '12px',
  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  padding: '28px',
};

const inputStyle = {
  width: '100%', padding: '10px 14px',
  border: '1px solid #e5e7eb', borderRadius: '8px',
  fontSize: '14px', outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.15s',
};

const labelStyle = {
  display: 'block', fontSize: '13px', fontWeight: 600,
  color: '#374151', marginBottom: '6px',
};

const primaryBtn = {
  padding: '10px 20px', background: '#4f46e5', color: '#fff',
  border: 'none', borderRadius: '8px', fontWeight: 600,
  fontSize: '14px', cursor: 'pointer',
};

const outlineBtn = {
  padding: '8px 18px', background: 'transparent',
  border: '1px solid #d1d5db', borderRadius: '8px',
  fontWeight: 600, fontSize: '14px', cursor: 'pointer', color: '#374151',
};

const eyeStyle = {
  position: 'absolute', right: '12px', top: '50%',
  transform: 'translateY(-50%)', cursor: 'pointer',
  color: '#9ca3af', fontSize: '16px', userSelect: 'none',
};

const infoRow = {
  display: 'flex', justifyContent: 'space-between',
  padding: '10px 0', borderBottom: '1px solid #f9fafb',
};

const infoLabel = { fontSize: '13px', color: '#9ca3af' };
const infoValue = { fontSize: '13px', fontWeight: 600, color: '#374151' };