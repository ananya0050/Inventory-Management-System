// import { useState } from 'react';           // ← ADD THIS
// import Sidebar from '../components/Sidebar';

// export default function AdminDashboard() {
//   const user = JSON.parse(localStorage.getItem('user') || '{}');
//   const [sidebarW, setSidebarW] = useState(220);   // ← ADD THIS

//   return (
//     <div style={{ display: 'flex' }}>
//       <Sidebar onWidthChange={setSidebarW} />       {/* ← ADD onWidthChange */}

//       <div style={{                                  // ← REPLACE the old div style
//         marginLeft: sidebarW,
//         padding: '40px',
//         width: `calc(100% - ${sidebarW}px)`,
//         transition: 'all 0.25s ease',
//         minWidth: 0,
//       }}>
//         <h4 className="mb-1">Welcome, {user.name} 👋</h4>
//         <p className="text-muted mb-4">Here's your inventory overview</p>

//         <div className="row g-3">
//           {[
//             { label: 'Categories', color: '#0d6efd', icon: '🗂️' },
//             { label: 'Products',   color: '#198754', icon: '📦' },
//             { label: 'Suppliers',  color: '#fd7e14', icon: '🚚' },
//             { label: 'Orders',     color: '#6f42c1', icon: '🛒' },
//           ].map(card => (
//             <div className="col-md-3" key={card.label}>
//               <div className="card text-white text-center p-3"
//                 style={{ background: card.color, borderRadius: '10px' }}>
//                 <div style={{ fontSize: '32px' }}>{card.icon}</div>
//                 <h6 className="mt-2 mb-0">{card.label}</h6>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState } from 'react';
import Sidebar from '../components/Sidebar';

export default function AdminDashboard() {

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Sidebar Width State
  const [sidebarW, setSidebarW] = useState(220);

  return (
    <div style={{ display: 'flex' }}>

      {/* Sidebar */}
      <Sidebar onWidthChange={setSidebarW} />

      {/* Main Content */}
      <div
        style={{
          marginLeft: `${sidebarW}px`,
          width: `calc(100% - ${sidebarW}px)`,
          padding: '40px',
          transition: 'all 0.25s ease',
          minWidth: 0,
          background: '#f4f6f9',
          minHeight: '100vh',
        }}
      >

        {/* Welcome Section */}
        <h4 className="mb-1">
          Welcome, {user.name} 👋
        </h4>

        <p className="text-muted mb-4">
          Here's your inventory overview
        </p>

        {/* Cards */}
        <div className="row g-3">

          {[
            {
              label: 'Categories',
              color: '#0d6efd',
              icon: '🗂️',
            },
            {
              label: 'Products',
              color: '#198754',
              icon: '📦',
            },
            {
              label: 'Suppliers',
              color: '#fd7e14',
              icon: '🚚',
            },
            {
              label: 'Orders',
              color: '#6f42c1',
              icon: '🛒',
            },
          ].map((card) => (

            <div className="col-md-3" key={card.label}>

              <div
                className="card text-white text-center p-3"
                style={{
                  background: card.color,
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >

                <div style={{ fontSize: '32px' }}>
                  {card.icon}
                </div>

                <h6 className="mt-2 mb-0">
                  {card.label}
                </h6>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}