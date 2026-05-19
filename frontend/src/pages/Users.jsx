import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Toast from '../components/Toast';
import useToast from '../hooks/useToast';
import socket from '../socket';

const API = 'http://localhost:5000/api/users';

export default function Users() {
  const [users,    setUsers]    = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [sidebarW, setSidebarW] = useState(220);
  const { toast, showToast, hideToast } = useToast();

  const token   = localStorage.getItem('token');
  const me      = JSON.parse(localStorage.getItem('user') || '{}');
  const headers = { Authorization: `Bearer ${token}` };

  // ─── Fetch users ────────────────────────────────────────────────────────────
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API, { headers });
      setUsers(res.data);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to load users.', 'error');
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  // ─── Socket: refresh user list when roles change ────────────────────────────
  useEffect(() => {
    const onRoleChanged = () => fetchUsers();
    socket.on('user:roleChanged', onRoleChanged);
    return () => socket.off('user:roleChanged', onRoleChanged);
  }, []);

  // ─── Make Admin ─────────────────────────────────────────────────────────────
  const makeAdmin = async (id, name) => {
    if (!window.confirm(`Make ${name} an admin?`)) return;
    try {
      const res = await axios.put(`${API}/${id}/make-admin`, {}, { headers });
      showToast(res.data.message, 'success');
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed.', 'error');
    }
  };

  // ─── Remove Admin ───────────────────────────────────────────────────────────
  const removeAdmin = async (id, name) => {
    if (!window.confirm(`Remove admin role from ${name}?`)) return;
    try {
      const res = await axios.put(`${API}/${id}/remove-admin`, {}, { headers });
      showToast(res.data.message, 'success');
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed.', 'error');
    }
  };

  // ─── Delete User ────────────────────────────────────────────────────────────
  const deleteUser = async (id, name, role) => {
    const isSelf = id === me.id;
    const confirmMsg = isSelf
      ? `Delete your own account (${name})? You will be logged out.`
      : `Delete ${name}? This cannot be undone.`;

    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await axios.delete(`${API}/${id}`, { headers });
      showToast(res.data.message, 'success');

      // If admin deleted themselves, log out
      if (isSelf) {
        setTimeout(() => {
          localStorage.clear();
          window.location.href = '/login';
        }, 1500);
        return;
      }

      fetchUsers();
    } catch (err) {
      const msg = err.response?.data?.message || 'Delete failed.';
      showToast(msg, 'error');
    }
  };

  // ─── Styles ─────────────────────────────────────────────────────────────────
  const roleBadgeStyle = (role) => ({
    display: 'inline-block', padding: '3px 12px', borderRadius: '12px',
    fontSize: '12px', fontWeight: 600,
    background: role === 'admin' ? '#dbeafe' : '#f3f4f6',
    color:      role === 'admin' ? '#1d4ed8' : '#374151',
  });

  const tdStyle = { padding: '14px 16px', fontSize: '14px', verticalAlign: 'middle' };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Sidebar onWidthChange={setSidebarW} />
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      <div style={{
        marginLeft: sidebarW, padding: '32px',
        width: `calc(100vw - ${sidebarW}px)`,
        transition: 'all 0.25s ease', boxSizing: 'border-box',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h4 style={{ fontWeight: 700, fontSize: '26px', margin: 0 }}>User Management</h4>
          <span style={{ color: '#888', fontSize: '14px' }}>{users.length} user{users.length !== 1 ? 's' : ''}</span>
        </div>

        <div style={{
          background: '#fff', borderRadius: '12px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)', overflow: 'auto',
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px', color: '#888' }}>
              Loading users…
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f0f0f0', background: '#f8f9fa' }}>
                  {['#', 'Name', 'Email', 'Role', 'Joined', 'Actions'].map((h) => (
                    <th key={h} style={{ ...tdStyle, fontWeight: 600, fontSize: '13px', color: '#555' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '48px', color: '#888' }}>
                      No users found.
                    </td>
                  </tr>
                ) : users.map((u, i) => (
                  <tr key={u._id} style={{
                    borderBottom: '1px solid #f0f0f0',
                    background: u._id === me.id ? '#fafffe' : 'transparent',
                    transition: 'background 0.15s',
                  }}>
                    <td style={tdStyle}>{i + 1}</td>

                    {/* Name + avatar */}
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: '50%',
                          overflow: 'hidden', flexShrink: 0,
                          background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {u.profilePicture ? (
                            <img
                              src={`http://localhost:5000${u.profilePicture}`}
                              alt={u.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <span style={{ fontWeight: 700, color: '#9ca3af', fontSize: '15px' }}>
                              {u.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '14px' }}>{u.name}</div>
                          {u._id === me.id && (
                            <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 600 }}>(You)</span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td style={tdStyle}>{u.email}</td>

                    <td style={tdStyle}>
                      <span style={roleBadgeStyle(u.role)}>{u.role}</span>
                    </td>

                    <td style={tdStyle}>{new Date(u.createdAt).toLocaleDateString()}</td>

                    {/* Actions */}
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {/* Make Admin / Remove Admin */}
                        {u.role !== 'admin' ? (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => makeAdmin(u._id, u.name)}
                            title="Grant admin privileges"
                          >
                            Make Admin
                          </button>
                        ) : (
                          u._id !== me.id && (
                            <button
                              className="btn btn-warning btn-sm"
                              onClick={() => removeAdmin(u._id, u.name)}
                              title="Revoke admin privileges"
                            >
                              Remove Admin
                            </button>
                          )
                        )}

                        {/* Delete — always visible */}
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteUser(u._id, u.name, u.role)}
                          title={u._id === me.id ? 'Delete your account' : `Delete ${u.name}`}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}