

import { NavLink, useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt, FaThLarge, FaBoxes,
  FaTruck, FaShoppingCart, FaUsers,
  FaUserCircle, FaSignOutAlt
} from 'react-icons/fa';
import { useState, useEffect } from 'react';

export default function Sidebar({ onWidthChange }) {
  const navigate = useNavigate();

  const expandedWidth  = 220;
  const collapsedWidth = 60;

  const [width,      setWidth]      = useState(expandedWidth);
  const [isDragging, setIsDragging] = useState(false);
  const [collapsed,  setCollapsed]  = useState(false);

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // notify parent of width changes
  useEffect(() => {
    onWidthChange?.(collapsed ? collapsedWidth : width);
  }, [width, collapsed]);

  // auto-collapse below 900px
  useEffect(() => {
    const check = () => {
      if (window.innerWidth < 900) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // drag to resize
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const newWidth = e.clientX;
      if (newWidth >= 160 && newWidth <= 400) {
        setWidth(newWidth);
      }
    };
    const handleMouseUp = () => setIsDragging(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup',   handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup',   handleMouseUp);
    };
  }, [isDragging]);

  const links = [
    { to: '/admin-dashboard',            icon: <FaTachometerAlt />, label: 'Dashboard'  },
    { to: '/admin-dashboard/categories', icon: <FaThLarge />,       label: 'Categories' },
    { to: '/admin-dashboard/products',   icon: <FaBoxes />,         label: 'Products'   },
    { to: '/admin-dashboard/suppliers',  icon: <FaTruck />,         label: 'Suppliers'  },
    { to: '/admin-dashboard/orders',     icon: <FaShoppingCart />,  label: 'Orders'     },
    { to: '/admin-dashboard/users',      icon: <FaUsers />,         label: 'Users'      },
    { to: '/admin-dashboard/profile',    icon: <FaUserCircle />,    label: 'Profile'    },
  ];

  const w = collapsed ? collapsedWidth : width;

  return (
    <div style={{
      width: w,
      minHeight: '100vh',
      height: '100vh',
      background: '#1a1a2e',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      top: 0, left: 0,
      zIndex: 200,
      transition: isDragging ? 'none' : 'width 0.25s ease',
      overflow: 'hidden',
    }}>

      {/* ── Brand ── */}
      <div style={{
        padding:       collapsed ? '24px 0'   : '24px 20px',
        fontWeight:    700,
        fontSize:      collapsed ? '12px'     : '18px',
        textAlign:     collapsed ? 'center'   : 'left',
        borderBottom:  '1px solid rgba(255,255,255,0.1)',
        whiteSpace:    'nowrap',
        flexShrink:    0,
      }}>
        {collapsed ? 'IMS' : 'Inventory MS'}
      </div>

      {/* ── Toggle button ── */}
      <div
        onClick={() => setCollapsed(c => !c)}
        style={{
          padding:       collapsed ? '12px 0'   : '12px 20px',
          cursor:        'pointer',
          fontSize:      '20px',
          color:         'rgba(255,255,255,0.85)',
          textAlign:     collapsed ? 'center'   : 'left',
          userSelect:    'none',
          flexShrink:    0,
          borderBottom:  '1px solid rgba(255,255,255,0.06)',
        }}
      >
        ☰
      </div>

      {/* ── Scrollable nav ── */}
      <nav style={{
        flex:           1,
        overflowY:      'auto',
        overflowX:      'hidden',
        paddingTop:     '4px',
        paddingBottom:  '4px',
        scrollbarWidth: 'none',         // Firefox
        display:        'flex',
        flexDirection:  'column',
      }}>
        <style>{`
          .sidebar-nav::-webkit-scrollbar { display: none; }
        `}</style>

        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/admin-dashboard'}
            title={collapsed ? link.label : ''}
            style={({ isActive }) => ({
              display:         'flex',
              alignItems:      'center',
              justifyContent:  collapsed ? 'center' : 'flex-start',
              padding:         collapsed ? '14px 0' : '12px 20px',
              color:           isActive ? '#fff' : 'rgba(255,255,255,0.75)',
              textDecoration:  'none',
              fontSize:        '14px',
              background:      isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
              borderLeft:      isActive ? '3px solid #4CAF50' : '3px solid transparent',
              whiteSpace:      'nowrap',
              transition:      'background 0.15s',
            })}
          >
            <span style={{
              fontSize:    '17px',
              flexShrink:  0,
              marginRight: collapsed ? '0' : '10px',
            }}>
              {link.icon}
            </span>
            {!collapsed && link.label}
          </NavLink>
        ))}
      </nav>

      {/* ── Logout pinned to bottom ── */}
      <button
        onClick={logout}
        title={collapsed ? 'Logout' : ''}
        style={{
          display:         'flex',
          alignItems:      'center',
          justifyContent:  collapsed ? 'center' : 'flex-start',
          padding:         collapsed ? '16px 0' : '14px 20px',
          background:      'none',
          border:          'none',
          borderTop:       '1px solid rgba(255,255,255,0.08)',
          color:           'rgba(255,255,255,0.75)',
          cursor:          'pointer',
          fontSize:        '14px',
          width:           '100%',
          flexShrink:      0,
          whiteSpace:      'nowrap',
        }}
      >
        <span style={{
          fontSize:    '17px',
          flexShrink:  0,
          marginRight: collapsed ? '0' : '10px',
        }}>
          <FaSignOutAlt />
        </span>
        {!collapsed && 'Logout'}
      </button>

      {/* ── Drag resizer ── */}
      {!collapsed && (
        <div
          onMouseDown={() => setIsDragging(true)}
          style={{
            width:    '5px',
            cursor:   'col-resize',
            background: '#4CAF50',
            position: 'absolute',
            top: 0, right: 0, bottom: 0,
          }}
        />
      )}
    </div>
  );
}