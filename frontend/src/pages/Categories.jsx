import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

const BASE = 'http://localhost:5000/api/categories';

export default function Categories() {
  const [categories,    setCategories]    = useState([]);
  const [categoryName,  setCategoryName]  = useState('');
  const [categoryDesc,  setCategoryDesc]  = useState('');
  const [editId,        setEditId]        = useState(null);
  const [loading,       setLoading]       = useState(false);
  const [popup,         setPopup]         = useState({ show: false, message: '' });
  const [sidebarW, setSidebarW] = useState(220);
  const showPopup  = (msg) => setPopup({ show: true,  message: msg });
  const closePopup = ()    => setPopup({ show: false, message: '' });

  /* ── fetch all categories ── */
  const fetchCategories = async () => {
    try {
      const res = await axios.get(BASE);
      setCategories(res.data);
    } catch (err) {
      console.error('Fetch error:', err.message);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  /* ── Add or Update ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await axios.put(`${BASE}/${editId}`, {
          categoryName,
          categoryDescription: categoryDesc,
        });
        showPopup('Category Updated Successfully!');
      } else {
        await axios.post(`${BASE}/add`, {
          categoryName,
          categoryDescription: categoryDesc,
        });
        showPopup('Category Added Successfully!');
      }
      setCategoryName('');
      setCategoryDesc('');
      setEditId(null);
      fetchCategories();
    } catch (err) {
      showPopup(err.response?.data?.message || 'Something went wrong');
    }
    setLoading(false);
  };

  /* ── Edit ── */
  const handleEdit = (cat) => {
    setEditId(cat._id);
    setCategoryName(cat.categoryName);
    setCategoryDesc(cat.categoryDescription);
  };

  const handleCancel = () => {
    setEditId(null);
    setCategoryName('');
    setCategoryDesc('');
  };

  /* ── Delete ── */
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await axios.delete(`${BASE}/${id}`);
      showPopup('Category Deleted Successfully!');
      fetchCategories();
    } catch (err) {
      showPopup(err.response?.data?.message || 'Delete failed');
    }
  };

  /* ════════════════════════════════════════ */
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f2f5' }}>

      <Sidebar onWidthChange={setSidebarW}/>

      {/* ── Popup ── */}
      {popup.show && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <p style={{ fontSize: '15px', color: '#333', marginBottom: '20px' }}>
              {popup.message}
            </p>
            <button onClick={closePopup} style={styles.okBtn}>OK</button>
          </div>
        </div>
      )}

      {/* ── Page ── */}
     <div
  style={{
    marginLeft: sidebarW,
    padding: '32px',
    width: `calc(100% - ${sidebarW}px)`,
    transition: 'all 0.25s ease',
    minWidth: 0,
    overflowX: 'auto',
  }}
>
        <h4
        style={{
        fontWeight: '700',
        marginBottom: '24px',
        fontSize: '28px',
        color: '#222',
      }}
      > Category Management</h4>

        <div
           style={{
            display: 'flex',
            gap: '20px',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
          }}
>

          {/* ── Form card ── */}
          <div
             style={{
             width: '360px',
             background: '#fff',
             borderRadius: '10px',
             padding: '25px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  }}
>
            <h6 style={styles.cardTitle}>
              {editId ? 'Edit Category' : 'Add Category'}
            </h6>

            <form onSubmit={handleSubmit}>
              <input
                className="form-control mb-3"
                style={{
                height: '45px',
                borderRadius: '6px',
               fontSize: '15px',
                }}
                placeholder="Category Name"
                value={categoryName}
                onChange={e => setCategoryName(e.target.value)}
                required
              />
              <input
                className="form-control mb-3"
                placeholder="Category Description"
                value={categoryDesc}
                onChange={e => setCategoryDesc(e.target.value)}
                required
              />

              {editId ? (
                <div style={{ display: 'flex', gap: '8px',marginTop: '10px' }}>
                  <button type="submit" className="btn btn-success flex-fill" disabled={loading}  style={{
                    height: '45px',
                    borderRadius: '6px',
                    fontWeight: '600',
                    fontSize: '15px'
    }}>
                    {loading ? 'Saving…' : 'Save Changes'}
                  </button>
                  <button type="button" className="btn btn-danger flex-fill" onClick={handleCancel} style={{
                 height: '45px',
                  borderRadius: '6px',
                  fontWeight: '600',
                  fontSize: '15px'
                  }}>
                    Cancel
                  </button>
                </div>
              ) : (
                <button type="submit" className="btn btn-success w-100" disabled={loading} style={{
                height: '45px',
                borderRadius: '6px',
                 fontWeight: '600',
                 fontSize: '15px',
                 marginTop: '10px'
                 }}>
                  {loading ? 'Adding…' : 'Add Category'}
                </button>
              )}
            </form>
          </div>

          {/* ── Table card ── */}
          <div
  style={{
    flex: 1,
    background: '#fff',
    borderRadius: '10px',
    padding: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    overflowX: 'auto',
  }}
>
  <table
            
             className="table table-bordered align-middle mb-0"
             style={{
             textAlign: 'center',
            }}
>
              <thead className="table-light">
                <tr>
                  <th>S No</th>
                  <th>Category Name</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center text-muted py-4">
                      No categories yet — add one!
                    </td>
                  </tr>
                ) : categories.map((cat, i) => (
                  <tr key={cat._id}>
                    <td>{i + 1}</td>
                    <td>{cat.categoryName}</td>
                    <td>{cat.categoryDescription}</td>
                    <td>
                      <button className="btn btn-primary btn-sm me-2"
                        onClick={() => handleEdit(cat)}>Edit</button>
                      <button className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(cat._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    width: '340px', flexShrink: 0,
    background: '#fff', borderRadius: '8px',
    padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
  },
  cardTitle: {
    textAlign: 'center', fontWeight: 700,
    fontSize: '16px', marginBottom: '20px',
  },
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.45)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 9999,
  },
  modal: {
    background: '#fff', borderRadius: '10px',
    padding: '36px 48px', minWidth: '300px',
    textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
  },
  okBtn: {
    background: '#0d6efd', color: '#fff',
    border: 'none', borderRadius: '6px',
    padding: '8px 36px', fontSize: '15px', cursor: 'pointer',
  },
};