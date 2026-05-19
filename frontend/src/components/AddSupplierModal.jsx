// components/AddSupplierModal.jsx
import { useState } from 'react';
import axios from 'axios';

const BASE = 'http://localhost:5000/api/suppliers';

export default function AddSupplierModal({ onClose, onSuccess, showToast }) {
  const [form, setForm] = useState({
    supplierName: '',
    email:        '',
    phoneNumber:  '',
    address:      '',
    totalOrders:  0,
  });
  const [loading, setLoading] = useState(false);
  const [errors,  setErrors]  = useState({});

  const token   = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.supplierName.trim()) errs.supplierName = 'Supplier name is required';
    if (!form.email.trim())        errs.email        = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.phoneNumber.trim())  errs.phoneNumber  = 'Phone number is required';
    if (!form.address.trim())      errs.address      = 'Address is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    try {
      await axios.post(BASE, {
        ...form,
        totalOrders: Number(form.totalOrders) || 0,
      }, { headers });
      showToast('Supplier added successfully!', 'success');
      onSuccess();
      onClose();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add supplier', 'error');
    } finally {
      setLoading(false);
    }
  };

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
          padding: '28px', width: '100%', maxWidth: '480px',
          maxHeight: '90vh', overflowY: 'auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
        }}
      >
        <h5 style={{ fontWeight: 700, marginBottom: '20px', fontSize: '18px' }}>
          ➕ Add New Supplier
        </h5>

        <form onSubmit={handleSubmit}>

          {/* Supplier Name */}
          <div style={{ marginBottom: '14px' }}>
            <label style={label}>Supplier Name *</label>
            <input
              name="supplierName"
              value={form.supplierName}
              onChange={handleChange}
              placeholder="e.g. ABC Traders"
              style={input(errors.supplierName)}
            />
            {errors.supplierName && <p style={err}>{errors.supplierName}</p>}
          </div>

          {/* Email */}
          <div style={{ marginBottom: '14px' }}>
            <label style={label}>Email *</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="supplier@example.com"
              style={input(errors.email)}
            />
            {errors.email && <p style={err}>{errors.email}</p>}
          </div>

          {/* Phone */}
          <div style={{ marginBottom: '14px' }}>
            <label style={label}>Phone Number *</label>
            <input
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              style={input(errors.phoneNumber)}
            />
            {errors.phoneNumber && <p style={err}>{errors.phoneNumber}</p>}
          </div>

          {/* Address */}
          <div style={{ marginBottom: '14px' }}>
            <label style={label}>Address *</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="123 Street, City, State"
              rows={3}
              style={{ ...input(errors.address), resize: 'vertical' }}
            />
            {errors.address && <p style={err}>{errors.address}</p>}
          </div>

          {/* Total Orders */}
          <div style={{ marginBottom: '20px' }}>
            <label style={label}>Total Orders</label>
            <input
              name="totalOrders"
              type="number"
              min="0"
              value={form.totalOrders}
              onChange={handleChange}
              style={input(false)}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-success"
              style={{ flex: 1 }}
            >
              {loading ? 'Adding...' : 'Add Supplier'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              style={{ flex: 1 }}
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

// ── Shared inline styles ─────────────────────────────────────────────────────
const label = {
  display: 'block', marginBottom: '5px',
  fontWeight: 600, fontSize: '13px', color: '#374151',
};

const input = (hasError) => ({
  width: '100%', padding: '9px 12px',
  border: `1px solid ${hasError ? '#ef4444' : '#d1d5db'}`,
  borderRadius: '7px', fontSize: '14px',
  outline: 'none', boxSizing: 'border-box',
  display: 'block',
});

const err = {
  color: '#ef4444', fontSize: '12px', marginTop: '4px', marginBottom: 0,
};
