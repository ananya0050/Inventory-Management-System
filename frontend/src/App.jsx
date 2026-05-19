import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage       from './pages/LandingPage';
import Login             from './pages/Login';
import Register          from './pages/Register';
import AdminDashboard    from './pages/AdminDashboard';
import Categories        from './pages/Categories';
import Products          from './pages/Products';
import Users             from './pages/Users';
import AdminOrders       from './pages/AdminOrders';
import AdminProfile      from './pages/AdminProfile';
import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployeeOrders    from './pages/EmployeeOrders';
import SuppliersPage     from './pages/SuppliersPage';   // ← NEW
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const token   = localStorage.getItem('token');
  const user    = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = token && user.role === 'admin';
  const isUser  = token && user.role === 'user';

  return (
    <BrowserRouter>
      <AppRoutes isAdmin={isAdmin} isUser={isUser} />
    </BrowserRouter>
  );
}

// Separate component so hooks that need Router context work correctly
import { useEffect } from 'react';
import useDeletedAccount from './pages/useDeletedAccount';
import { useNavigate } from 'react-router-dom';

function AppRoutes({ isAdmin, isUser }) {
  // Listens on socket — forces logout if admin deletes this user's account
  useDeletedAccount();

  // Show "deleted by admin" toast/message if redirected from deletion
  const navigate = useNavigate();
  useEffect(() => {
    if (sessionStorage.getItem('deletedByAdmin')) {
      sessionStorage.removeItem('deletedByAdmin');
      // The Login page will pick this up via the session flag — already cleared
    }
  }, []);

  return (
    <Routes>
      {/* Public */}
      <Route path="/"         element={<LandingPage />} />
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin */}
      <Route path="/admin-dashboard"            element={isAdmin ? <AdminDashboard />  : <Navigate to="/login" />} />
      <Route path="/admin-dashboard/categories" element={isAdmin ? <Categories />      : <Navigate to="/login" />} />
      <Route path="/admin-dashboard/products"   element={isAdmin ? <Products />        : <Navigate to="/login" />} />
      <Route path="/admin-dashboard/users"      element={isAdmin ? <Users />           : <Navigate to="/login" />} />
      <Route path="/admin-dashboard/orders"     element={isAdmin ? <AdminOrders />     : <Navigate to="/login" />} />
      <Route path="/admin-dashboard/profile"    element={isAdmin ? <AdminProfile />    : <Navigate to="/login" />} />
     <Route path="/admin-dashboard/suppliers"    element={isAdmin ? <SuppliersPage />   : <Navigate to="/login" />} /> {/* ← NEW */}

      {/* Employee */}
      <Route path="/employee-dashboard"         element={isUser  ? <EmployeeDashboard />: <Navigate to="/login" />} />
      <Route path="/employee-dashboard/orders"  element={isUser  ? <EmployeeOrders />   : <Navigate to="/login" />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;