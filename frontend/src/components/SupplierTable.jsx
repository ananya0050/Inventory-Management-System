// components/SupplierTable.jsx

export default function SupplierTable({ suppliers, onView, onEdit, onDelete }) {
  const columns = ['#', 'Supplier Name', 'Email', 'Phone', 'Address', 'Total Orders', 'Actions'];

  const td = { padding: '14px 16px', fontSize: '14px', verticalAlign: 'middle' };

  return (
    <div style={{
      background: '#fff',
      borderRadius: '10px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      overflowX: 'auto',
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '750px' }}>

        {/* ── Head ── */}
        <thead>
          <tr style={{ borderBottom: '2px solid #dee2e6', background: '#f8f9fa' }}>
            {columns.map(col => (
              <th key={col} style={{
                padding: '14px 16px', fontWeight: 600,
                fontSize: '13px', color: '#374151',
                textAlign: col === 'Actions' ? 'center' : 'left',
                whiteSpace: 'nowrap',
              }}>
                {col}
              </th>
            ))}
          </tr>
        </thead>

        {/* ── Body ── */}
        <tbody>
          {suppliers.length === 0 ? (
            // ── Empty state ──
            <tr>
              <td colSpan={7} style={{ textAlign: 'center', padding: '56px 16px' }}>
                <div style={{ color: '#9ca3af' }}>
                  <div style={{ fontSize: '44px', marginBottom: '12px' }}>🏭</div>
                  <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '4px', color: '#6b7280' }}>
                    No suppliers found
                  </div>
                  <div style={{ fontSize: '13px' }}>
                    Add your first supplier using the button above.
                  </div>
                </div>
              </td>
            </tr>
          ) : (
            suppliers.map((s, index) => (
              <tr
                key={s._id}
                style={{ borderBottom: '1px solid #f0f0f0' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* # */}
                <td style={{ ...td, color: '#9ca3af', fontWeight: 500 }}>{index + 1}</td>

                {/* Name + Avatar */}
                <td style={td}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #1a1a2e, #4CAF50)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontWeight: 700, fontSize: '14px', flexShrink: 0,
                    }}>
                      {s.supplierName?.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontWeight: 600, color: '#111827' }}>{s.supplierName}</span>
                  </div>
                </td>

                {/* Email */}
                <td style={{ ...td, color: '#4b5563' }}>{s.email}</td>

                {/* Phone */}
                <td style={{ ...td, color: '#4b5563' }}>{s.phoneNumber}</td>

                {/* Address - truncated */}
                <td style={{ ...td, color: '#4b5563', maxWidth: '200px' }}>
                  <div
                    title={s.address}
                    style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  >
                    {s.address}
                  </div>
                </td>

                {/* Total Orders badge */}
                <td style={td}>
                  <span style={{
                    display: 'inline-block',
                    background: '#dbeafe', color: '#1d4ed8',
                    borderRadius: '12px', padding: '3px 12px',
                    fontSize: '13px', fontWeight: 600,
                  }}>
                    {s.totalOrders}
                  </span>
                </td>

                {/* Actions */}
                <td style={{ ...td, textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button
                      className="btn btn-sm btn-outline-info"
                      onClick={() => onView(s)}
                    >
                      👁 View
                    </button>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => onEdit(s)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onDelete(s)}
                    >
                      🗑 Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
