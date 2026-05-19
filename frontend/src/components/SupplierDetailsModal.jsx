// components/SupplierDetailsModal.jsx

export default function SupplierDetailsModal({ supplier, onClose }) {
  return (
    <div
      onClick={onClose}
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
          padding: '28px', width: '100%', maxWidth: '460px',
          maxHeight: '90vh', overflowY: 'auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
        }}
      >
        {/* ── Header with avatar ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #1a1a2e, #4CAF50)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: '22px', flexShrink: 0,
          }}>
            {supplier.supplierName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h5 style={{ fontWeight: 700, margin: 0, fontSize: '18px' }}>
              {supplier.supplierName}
            </h5>
            <span style={{
              display: 'inline-block', marginTop: '4px',
              background: '#d1fae5', color: '#065f46',
              borderRadius: '12px', padding: '2px 10px',
              fontSize: '12px', fontWeight: 600,
            }}>
              Supplier
            </span>
          </div>
        </div>

        {/* ── Detail rows ── */}
        <DetailRow label="Email"        value={supplier.email} />
        <DetailRow label="Phone Number" value={supplier.phoneNumber} />
        <DetailRow label="Address"      value={supplier.address} />
        <DetailRow label="Total Orders" value={String(supplier.totalOrders ?? 0)} />
        <DetailRow
          label="Added On"
          value={new Date(supplier.createdAt).toLocaleDateString('en-IN', {
            year: 'numeric', month: 'long', day: 'numeric',
          })}
        />

        <button
          onClick={onClose}
          className="btn btn-secondary"
          style={{ width: '100%', marginTop: '20px' }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

// ── Detail row sub-component ─────────────────────────────────────────────────
function DetailRow({ label, value }) {
  return (
    <div style={{
      padding: '12px 0',
      borderBottom: '1px solid #f3f4f6',
    }}>
      <div style={{
        fontSize: '11px', fontWeight: 600,
        color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px',
        marginBottom: '3px',
      }}>
        {label}
      </div>
      <div style={{ fontSize: '15px', color: '#111827', wordBreak: 'break-word' }}>
        {value || '—'}
      </div>
    </div>
  );
}
