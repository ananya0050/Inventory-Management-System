// components/DeleteConfirmModal.jsx

export default function DeleteConfirmModal({ supplier, onConfirm, onCancel, loading }) {
  return (
    <div
      onClick={onCancel}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9999, padding: '16px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: '12px',
          padding: '32px 28px', width: '100%', maxWidth: '400px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
          textAlign: 'center',
        }}
      >
        {/* Warning icon */}
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>⚠️</div>

        <h5 style={{ fontWeight: 700, marginBottom: '10px', fontSize: '18px' }}>
          Delete Supplier?
        </h5>

        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '24px', lineHeight: 1.6 }}>
          Are you sure you want to delete{' '}
          <strong style={{ color: '#111827' }}>{supplier.supplierName}</strong>?
          <br />
          <span style={{ color: '#ef4444' }}>This action cannot be undone.</span>
        </p>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="btn btn-danger"
            style={{ flex: 1 }}
          >
            {loading ? 'Deleting...' : 'Yes, Delete'}
          </button>
          <button
            onClick={onCancel}
            disabled={loading}
            className="btn btn-secondary"
            style={{ flex: 1 }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
