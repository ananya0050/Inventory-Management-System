// components/EditSupplierModal.jsx
import { useState } from 'react';
import axios from 'axios';
import { ModalOverlay } from './AddSupplierModal';

const BASE = 'http://localhost:5000/api/suppliers';

export default function EditSupplierModal({ supplier, onClose, onSuccess, showToast }) {
  // Pre-fill form with the supplier being edited
  const [form, setForm] = useState({
    supplierName: supplier.supplierName || '',
    email:        supplier.email        || '',
    phoneNumber:  supplier.phoneNumber  || '',
    address:      supplier.address      || '',
    totalOrders:  supplier.totalOrders  ?? 0,
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

  // Same validation as Add modal
  const validate = () => {
    const newErrors = {};
    if (!form.supplierName.trim()) newErrors.supplierName = 'Supplier name is required';
    if (!form.email.trim())        newErrors.email        = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Enter a valid email';
    if (!form.phoneNumber.trim())  newErrors.phoneNumber  = 'Phone number is required';
    if (!form.address.trim())      newErrors.address      = 'Address is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await axios.put(`${BASE}/${supplier._id}`, {
        ...form,
        totalOrders: Number(form.totalOrders) || 0,
      }, { headers });

      showToast('Supplier updated successfully!', 'success');
      onSuccess();
      onClose();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update supplier', 'error');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (hasError) => ({
    width: '100%', padding: '9px 12px',
    border: `1px solid ${hasError ? '#ef4444' : '#d1d5db'}`,
    borderRadius: '7px', fontSize: '14px',
    outline: 'none', boxSizing: 'border-box',
  });

  const labelStyle = {
    display: 'block', marginBottom: '5px',
    fontWeight: 600, fontSize: '13px', color: '#374151',
  };

  const errStyle = { color: '#ef4444', fontSize: '12px', marginTop: '4px', marginBottom: 0 };

  return (
    <ModalOverlay onClose={onClose}>
      <h5 style={{ fontWeight: 700, marginBottom: '20px', fontSize: '18px' }}>
        ✏️ Edit Supplier
      </h5>

      <form onSubmit={handleSubmit}>
        {/* Supplier Name */}
        <div style={{ marginBottom: '14px' }}>
          <label style={labelStyle}>Supplier Name *</label>
          <input name="supplierName" value={form.supplierName} onChange={handleChange}
            style={inputStyle(errors.supplierName)} placeholder="e.g. ABC Traders" />
          {errors.supplierName && <p style={errStyle}>{errors.supplierName}</p>}
        </div>

        {/* Email */}
        <div style={{ marginBottom: '14px' }}>
          <label style={labelStyle}>Email *</label>
          <input name="email" type="email" value={form.email} onChange={handleChange}
            style={inputStyle(errors.email)} placeholder="supplier@example.com" />
          {errors.email && <p style={errStyle}>{errors.email}</p>}
        </div>

        {/* Phone */}
        <div style={{ marginBottom: '14px' }}>
          <label style={labelStyle}>Phone Number *</label>
          <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange}
            style={inputStyle(errors.phoneNumber)} placeholder="+91 98765 43210" />
          {errors.phoneNumber && <p style={errStyle}>{errors.phoneNumber}</p>}
        </div>

        {/* Address */}
        <div style={{ marginBottom: '14px' }}>
          <label style={labelStyle}>Address *</label>
          <textarea name="address" value={form.address} onChange={handleChange}
            style={{ ...inputStyle(errors.address), minHeight: '72px', resize: 'vertical' }}
            placeholder="123 Street, City, State" />
          {errors.address && <p style={errStyle}>{errors.address}</p>}
        </div>

        {/* Total Orders */}
        <div style={{ marginBottom: '14px' }}>
          <label style={labelStyle}>Total Orders</label>
          <input name="totalOrders" type="number" min="0" value={form.totalOrders}
            onChange={handleChange} style={inputStyle(false)} />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 1 }}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>
            Cancel
          </button>
        </div>
      </form>
    </ModalOverlay>
  );
}