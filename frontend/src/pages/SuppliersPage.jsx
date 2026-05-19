// pages/SuppliersPage.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Toast from '../components/Toast';
import useToast from '../hooks/useToast';
import SupplierTable from '../components/SupplierTable';
import AddSupplierModal from '../components/AddSupplierModal';
import EditSupplierModal from '../components/EditSupplierModal';
import SupplierDetailsModal from '../components/SupplierDetailsModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const BASE = 'http://localhost:5000/api/suppliers';

export default function SuppliersPage() {
  const [suppliers,     setSuppliers]     = useState([]);
  const [filtered,      setFiltered]      = useState([]);
  const [loading,       setLoading]       = useState(false);
  const [searchQuery,   setSearchQuery]   = useState('');
  const [sidebarW,      setSidebarW]      = useState(220);

  // Modal states
  const [showAdd,       setShowAdd]       = useState(false);
  const [editTarget,    setEditTarget]    = useState(null);
  const [viewTarget,    setViewTarget]    = useState(null);
  const [deleteTarget,  setDeleteTarget]  = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { toast, showToast, hideToast } = useToast();

  const token   = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  // ── Fetch all suppliers ──────────────────────────────────────────────────
  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(BASE, { headers });
      setSuppliers(res.data);
      setFiltered(res.data);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to load suppliers', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSuppliers(); }, []);

  // ── Filter by search query ───────────────────────────────────────────────
  useEffect(() => {
    const q = searchQuery.toLowerCase();
    if (!q) {
      setFiltered(suppliers);
    } else {
      setFiltered(
        suppliers.filter(s =>
          s.supplierName.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, suppliers]);

  // ── Delete ───────────────────────────────────────────────────────────────
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await axios.delete(`${BASE}/${deleteTarget._id}`, { headers });
      showToast('Supplier deleted successfully!', 'success');
      setDeleteTarget(null);
      fetchSuppliers();
    } catch (err) {
      showToast(err.response?.data?.message || 'Delete failed', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  // ── Stats ────────────────────────────────────────────────────────────────
  const totalOrders = suppliers.reduce((sum, s) => sum + (s.totalOrders || 0), 0);

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Sidebar onWidthChange={setSidebarW} />

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      {/* ── Main Content ── */}
      <div style={{
        marginLeft:  sidebarW,
        padding:     '32px',
        width:       `calc(100vw - ${sidebarW}px)`,
        transition:  'all 0.25s ease',
        boxSizing:   'border-box',
      }}>

        {/* ── Header ── */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap',
          gap: '12px', marginBottom: '28px',
        }}>
          <div>
            <h4 style={{ fontWeight: 700, margin: 0, fontSize: '26px' }}>
              Suppliers Management
            </h4>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
              Manage all your suppliers in one place
            </p>
          </div>
          <button
            className="btn btn-success"
            onClick={() => setShowAdd(true)}
            style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            + Add Supplier
          </button>
        </div>

        {/* ── Stat Cards ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px', marginBottom: '24px',
        }}>
          <StatCard label="Total Suppliers" value={suppliers.length} icon="🏭" color="#dbeafe" textColor="#1d4ed8" />
          <StatCard label="Total Orders"    value={totalOrders}      icon="📦" color="#d1fae5" textColor="#065f46" />
          <StatCard label="Search Results"  value={filtered.length}  icon="🔍" color="#fef3c7" textColor="#92400e" />
        </div>

        {/* ── Search Bar ── */}
        <div style={{ marginBottom: '20px', position: 'relative', maxWidth: '400px' }}>
          <span style={{
            position: 'absolute', left: '12px', top: '50%',
            transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '15px',
            pointerEvents: 'none',
          }}>🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by supplier name or email..."
            style={{
              width: '100%', padding: '10px 12px 10px 38px',
              border: '1px solid #d1d5db', borderRadius: '8px',
              fontSize: '14px', outline: 'none', boxSizing: 'border-box',
              background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            }}
          />
        </div>

        {/* ── Loading Spinner ── */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '64px' }}>
            <div className="spinner-border text-success" role="status" />
            <p style={{ marginTop: '12px', color: '#6b7280', fontSize: '14px' }}>
              Loading suppliers...
            </p>
          </div>
        ) : (
          <SupplierTable
            suppliers={filtered}
            onView={s  => setViewTarget(s)}
            onEdit={s  => setEditTarget(s)}
            onDelete={s => setDeleteTarget(s)}
          />
        )}

        {/* Result count */}
        {searchQuery && !loading && (
          <p style={{ marginTop: '12px', color: '#6b7280', fontSize: '13px' }}>
            Showing {filtered.length} of {suppliers.length} suppliers
          </p>
        )}
      </div>

      {/* ── Modals ── */}
      {showAdd && (
        <AddSupplierModal
          onClose={() => setShowAdd(false)}
          onSuccess={fetchSuppliers}
          showToast={showToast}
        />
      )}

      {editTarget && (
        <EditSupplierModal
          supplier={editTarget}
          onClose={() => setEditTarget(null)}
          onSuccess={fetchSuppliers}
          showToast={showToast}
        />
      )}

      {viewTarget && (
        <SupplierDetailsModal
          supplier={viewTarget}
          onClose={() => setViewTarget(null)}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          supplier={deleteTarget}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}

// ── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color, textColor }) {
  return (
    <div style={{
      background: '#fff', borderRadius: '10px',
      padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
      display: 'flex', alignItems: 'center', gap: '14px',
    }}>
      <div style={{
        width: '46px', height: '46px', borderRadius: '10px',
        background: color, display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: '22px', flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '22px', fontWeight: 700, color: textColor }}>{value}</div>
        <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>{label}</div>
      </div>
    </div>
  );
}
