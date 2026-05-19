// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import EmployeeSidebar from '../components/EmployeeSidebar';

// export default function EmployeeOrders() {
//   const [orders,   setOrders]   = useState([]);
//   const [sidebarW, setSidebarW] = useState(220);   // unchanged

//   const token   = localStorage.getItem('token');
//   const headers = { Authorization: `Bearer ${token}` };

//   useEffect(() => {
//     axios.get('http://localhost:5000/api/orders/mine', { headers })
//       .then(res => setOrders(res.data))
//       .catch(err => console.error(err));
//   }, []);

//   const statusColor = (s) =>
//     s === 'Approved' ? '#198754' :
//     s === 'Rejected' ? '#dc3545' : '#fd7e14';

//   return (
//     // CHANGED: removed display:flex — causes double offset with fixed sidebar
//     <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>

//       <EmployeeSidebar onWidthChange={setSidebarW} />

//       {/* CHANGED: width now uses 100vw instead of 100% to fill viewport correctly */}
//       <div style={{
//         marginLeft: sidebarW,
//         padding: '32px',
//         width: `calc(100vw - ${sidebarW}px)`,   // CHANGED: 100% → 100vw
//         transition: 'all 0.25s ease',
//         minWidth: 0,
//         boxSizing: 'border-box',                 // ADDED: padding included in width
//       }}>

//         <h4 style={{ fontWeight: 700, marginBottom: '24px' }}>My Orders</h4>

//         {/* CHANGED: overflow hidden → auto so table can scroll on small screens */}
//         <div style={{
//           background: '#fff', borderRadius: '8px',
//           boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
//           overflow: 'auto',                      // CHANGED: hidden → auto
//           width: '100%',                         // ADDED
//         }}>
//           {/* ADDED: width:100% and tableLayout:fixed so table fills full width */}
//           <table className="table mb-0" style={{
//             width: '100%',                       // ADDED
//             tableLayout: 'fixed',                // ADDED: equal column distribution
//             borderCollapse: 'collapse',          // ADDED
//           }}>
//             <thead>
//               <tr style={{ borderBottom: '2px solid #dee2e6' }}>
//                 {['#','Product','Category','Price','Qty','Total','Status','Date'].map(h => (
//                   // CHANGED: added overflow+textOverflow so text doesn't break layout
//                   <th key={h} style={{
//                     padding: '14px 16px',
//                     fontWeight: 600,
//                     fontSize: '14px',
//                     overflow: 'hidden',          // ADDED
//                     textOverflow: 'ellipsis',    // ADDED
//                     whiteSpace: 'nowrap',        // ADDED
//                   }}>
//                     {h}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {orders.length === 0 ? (
//                 <tr>
//                   <td colSpan={8} style={{
//                     textAlign: 'center', padding: '32px', color: '#888'
//                   }}>
//                     No orders yet.
//                   </td>
//                 </tr>
//               ) : orders.map((o, i) => (
//                 <tr key={o._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
//                   {/* CHANGED: added overflow+ellipsis to every td */}
//                   <td style={td}>{i + 1}</td>
//                   <td style={td}>{o.productName}</td>
//                   <td style={td}>{o.category}</td>
//                   <td style={td}>${Number(o.price).toFixed(2)}</td>      {/* CHANGED: added .toFixed(2) */}
//                   <td style={td}>{o.quantity}</td>
//                   <td style={td}>${Number(o.totalPrice).toFixed(2)}</td> {/* CHANGED: added .toFixed(2) */}
//                   <td style={td}>
//                     <span style={{
//                       color: statusColor(o.status),
//                       fontWeight: 600,
//                       background:                                         // ADDED: colored badge
//                         o.status === 'Approved' ? '#d1fae5' :
//                         o.status === 'Rejected' ? '#fee2e2' : '#fff3e0',
//                       padding: '3px 10px',                               // ADDED
//                       borderRadius: '12px',                              // ADDED
//                       fontSize: '12px',                                  // ADDED
//                     }}>
//                       {o.status}
//                     </span>
//                   </td>
//                   <td style={td}>
//                     {new Date(o.createdAt).toLocaleDateString()}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ADDED: shared td style object to avoid repetition
// const td = {
//   padding: '14px 16px',
//   fontSize: '14px',
//   verticalAlign: 'middle',       // ADDED
//   overflow: 'hidden',            // ADDED
//   textOverflow: 'ellipsis',      // ADDED
//   whiteSpace: 'nowrap',          // ADDED
// };


import { useState, useEffect } from 'react';
import axios from 'axios';
import EmployeeSidebar from '../components/EmployeeSidebar';
import Toast from '../components/Toast';
import useToast from '../hooks/useToast';
import socket from '../socket';

export default function EmployeeOrders() {
  const [orders,   setOrders]   = useState([]);
  const [sidebarW, setSidebarW] = useState(220);
  const { toast, showToast, hideToast } = useToast();

  const token   = localStorage.getItem('token');
  const me      = JSON.parse(localStorage.getItem('user') || '{}');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/orders/mine', { headers });
      setOrders(res.data);
    } catch (err) {
      const code = err.response?.data?.code;
      if (code === 'ACCOUNT_DELETED') {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
  };

  useEffect(() => {
    fetchOrders();

    // Listen for account deletion
    socket.on(`user:deleted:${me.id}`, () => {
      localStorage.clear();
      window.location.href = '/login';
    });

    return () => socket.off(`user:deleted:${me.id}`);
  }, []);

  const cancelOrder = async (id) => {
    if (!window.confirm('Cancel this order?')) return;
    try {
      const res = await axios.put(
        `http://localhost:5000/api/orders/${id}/cancel`, {}, { headers }
      );
      showToast(res.data.message, 'success');
      fetchOrders();
    } catch (err) {
      showToast(err.response?.data?.message || 'Cancel failed', 'error');
    }
  };

  const statusStyle = (s) => ({
    Pending:   { bg: '#fef3c7', color: '#92400e' },
    Approved:  { bg: '#d1fae5', color: '#065f46' },
    Rejected:  { bg: '#fee2e2', color: '#991b1b' },
    Cancelled: { bg: '#f3f4f6', color: '#6b7280' },
  }[s] || { bg: '#f3f4f6', color: '#374151' });

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <EmployeeSidebar onWidthChange={setSidebarW} />
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      <div style={{
        marginLeft: sidebarW, padding: '32px',
        width: `calc(100vw - ${sidebarW}px)`,
        transition: 'all 0.25s ease', boxSizing: 'border-box',
      }}>
        <h4 style={{ fontWeight: 700, marginBottom: '24px', fontSize: '26px' }}>My Orders</h4>

        <div style={{
          background: '#fff', borderRadius: '10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'auto',
        }}>
          <table className="table mb-0" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead className="table-light">
              <tr style={{ borderBottom: '2px solid #dee2e6' }}>
                {['#','Product','Category','Price','Qty','Total','Status','Date','Action'].map(h => (
                  <th key={h} style={{ padding: '14px 16px', fontWeight: 600, fontSize: '14px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan={9} style={{ textAlign: 'center', padding: '32px', color: '#888' }}>
                  No orders yet.
                </td></tr>
              ) : orders.map((o, i) => {
                const ss = statusStyle(o.status);
                return (
                  <tr key={o._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={td}>{i + 1}</td>
                    <td style={{ ...td, fontWeight: 600 }}>{o.productName}</td>
                    <td style={td}>{o.category}</td>
                    <td style={td}>${Number(o.price).toFixed(2)}</td>
                    <td style={td}>{o.quantity}</td>
                    <td style={td}>${Number(o.totalPrice).toFixed(2)}</td>
                    <td style={td}>
                      <span style={{
                        background: ss.bg, color: ss.color,
                        padding: '4px 12px', borderRadius: '12px',
                        fontSize: '12px', fontWeight: 600,
                      }}>
                        {o.status}
                      </span>
                    </td>
                    <td style={td}>{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td style={td}>
                      {['Pending', 'Processing'].includes(o.status) ? (
                        <button className="btn btn-outline-danger btn-sm"
                          onClick={() => cancelOrder(o._id)}>
                          Cancel
                        </button>
                      ) : (
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