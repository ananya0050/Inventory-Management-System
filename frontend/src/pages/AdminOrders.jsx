import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Toast from '../components/Toast';
import useToast from '../hooks/useToast';
import socket from '../socket';

export default function AdminOrders() {
  const [orders,       setOrders]       = useState([]);
  const [notifCount,   setNotifCount]   = useState(0);
  const [sidebarW,     setSidebarW]     = useState(220);
  const { toast, showToast, hideToast } = useToast();

  const token   = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/orders/all', { headers });
      setOrders(res.data);
    } catch (err) {
      showToast('Failed to load orders', 'error');
    }
  };

  useEffect(() => {
    fetchOrders();

    // Real-time new order notification
    const onNewOrder = (data) => {
      showToast(`🛒 ${data.message} — ${data.productName} (x${data.quantity})`, 'info');
      setNotifCount(c => c + 1);
      fetchOrders(); // refresh orders list
    };

    socket.off('order:new');
    socket.on('order:new', onNewOrder);
    return () => socket.off('order:new', onNewOrder);
  }, []);

  const statusColor = (s) => ({
    Pending:   { bg: '#fef3c7', color: '#92400e' },
    Approved:  { bg: '#d1fae5', color: '#065f46' },
    Rejected:  { bg: '#fee2e2', color: '#991b1b' },
    Cancelled: { bg: '#f3f4f6', color: '#374151' },
  }[s] || { bg: '#f3f4f6', color: '#374151' });

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${id}/status`,
        { status }, { headers });
      showToast(`Order ${status}!`, 'success');
      fetchOrders();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed', 'error');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Sidebar onWidthChange={setSidebarW} />
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      <div style={{
        marginLeft: sidebarW, padding: '32px',
        width: `calc(100vw - ${sidebarW}px)`,
        transition: 'all 0.25s ease', boxSizing: 'border-box',
      }}>
        <div style={{ display: 'flex', alignItems: 'center',
                      justifyContent: 'space-between', marginBottom: '24px' }}>
          <h4 style={{ fontWeight: 700, fontSize: '26px', margin: 0 }}>
            Orders Management
          </h4>
          {notifCount > 0 && (
            <div style={{
              background: '#ef4444', color: '#fff', borderRadius: '20px',
              padding: '4px 14px', fontSize: '13px', fontWeight: 600,
              cursor: 'pointer',
            }} onClick={() => setNotifCount(0)}>
              🔔 {notifCount} new order{notifCount > 1 ? 's' : ''}
            </div>
          )}
        </div>

        <div style={{
          background: '#fff', borderRadius: '10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'auto',
        }}>
          <table className="table mb-0" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead className="table-light">
              <tr style={{ borderBottom: '2px solid #dee2e6' }}>
                {['#','Product','Employee','Qty','Total','Status','Date','Actions'].map(h => (
                  <th key={h} style={{ padding: '14px 16px', fontWeight: 600, fontSize: '14px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: '#888' }}>
                  No orders yet.
                </td></tr>
              ) : orders.map((o, i) => {
                const sc = statusColor(o.status);
                return (
                  <tr key={o._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={td}>{i + 1}</td>
                    <td style={td}><div style={{ fontWeight: 600 }}>{o.productName}</div></td>
                    <td style={td}>{o.orderedByName}</td>
                    <td style={td}>{o.quantity}</td>
                    <td style={td}>${o.totalPrice.toFixed(2)}</td>
                    <td style={td}>
                      <span style={{
                        background: sc.bg, color: sc.color,
                        padding: '4px 12px', borderRadius: '12px',
                        fontSize: '12px', fontWeight: 600,
                      }}>
                        {o.status}
                      </span>
                    </td>
                    <td style={td}>{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td style={td}>
                      {o.status === 'Pending' && (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button className="btn btn-success btn-sm"
                            onClick={() => updateStatus(o._id, 'Approved')}>
                            Approve
                          </button>
                          <button className="btn btn-danger btn-sm"
                            onClick={() => updateStatus(o._id, 'Rejected')}>
                            Reject
                          </button>
                        </div>
                      )}
                      {o.status !== 'Pending' && (
                        <span style={{ color: '#aaa', fontSize: '13px' }}>—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const td = { padding: '14px 16px', fontSize: '14px', verticalAlign: 'middle' };