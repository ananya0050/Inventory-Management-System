import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const features = [
    { icon: '📦', title: 'Product Management', desc: 'Add, edit and track products with real-time stock updates.' },
    { icon: '📊', title: 'Live Dashboard',      desc: 'Monitor your inventory with live statistics and insights.' },
    { icon: '🔔', title: 'Real-time Alerts',    desc: 'Instant notifications when orders arrive or stock is low.' },
    { icon: '👥', title: 'Role Management',     desc: 'Separate admin and employee access levels.' },
    { icon: '🛒', title: 'Order Tracking',      desc: 'Employees can place and track orders seamlessly.' },
    { icon: '🔐', title: 'Secure Auth',         desc: 'JWT-based secure login with role protection.' },
  ];

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', overflowX: 'hidden' }}>

      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: 'rgba(26,26,46,0.95)', backdropFilter: 'blur(10px)',
        padding: '16px 40px', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 2px 20px rgba(0,0,0,0.3)',
      }}>
        <div style={{ fontWeight: 800, fontSize: '22px', color: '#4CAF50' }}>
          📦 Inventory MS
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button onClick={() => navigate('/login')} style={{
            background: 'none', border: '1px solid rgba(255,255,255,0.3)',
            color: '#fff', padding: '8px 20px', borderRadius: '6px',
            cursor: 'pointer', fontSize: '14px', fontWeight: 500,
          }}>
            Login
          </button>
          <button onClick={() => navigate('/register')} style={{
            background: '#4CAF50', border: 'none',
            color: '#fff', padding: '8px 20px', borderRadius: '6px',
            cursor: 'pointer', fontSize: '14px', fontWeight: 600,
          }}>
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', textAlign: 'center',
        padding: '120px 20px 60px',
      }}>
        <div>
          <div style={{
            display: 'inline-block', background: 'rgba(76,175,80,0.2)',
            border: '1px solid rgba(76,175,80,0.4)',
            borderRadius: '20px', padding: '6px 16px',
            color: '#4CAF50', fontSize: '13px', fontWeight: 600,
            marginBottom: '24px', letterSpacing: '1px',
          }}>
            🚀 PRODUCTION-READY MERN STACK
          </div>
          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 900,
            color: '#fff', marginBottom: '20px', lineHeight: 1.1,
          }}>
            Manage Your Inventory<br />
            <span style={{ color: '#4CAF50' }}>Smarter & Faster</span>
          </h1>
          <p style={{
            fontSize: '18px', color: 'rgba(255,255,255,0.7)',
            maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.7,
          }}>
            A complete inventory management system with real-time updates,
            role-based access, and powerful analytics for your business.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/register')} style={{
              background: '#4CAF50', color: '#fff', border: 'none',
              padding: '16px 40px', borderRadius: '8px', fontSize: '16px',
              fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(76,175,80,0.4)',
              transition: 'transform 0.2s',
            }}
              onMouseOver={e => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={e => e.target.style.transform = 'translateY(0)'}
            >
              Start Free →
            </button>
            <button onClick={() => navigate('/login')} style={{
              background: 'transparent', color: '#fff',
              border: '2px solid rgba(255,255,255,0.3)',
              padding: '16px 40px', borderRadius: '8px', fontSize: '16px',
              fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
            }}
              onMouseOver={e => e.target.style.borderColor = '#4CAF50'}
              onMouseOut={e => e.target.style.borderColor = 'rgba(255,255,255,0.3)'}
            >
              Login
            </button>
          </div>

          {/* Stats */}
          <div style={{
            display: 'flex', gap: '40px', justifyContent: 'center',
            marginTop: '60px', flexWrap: 'wrap',
          }}>
            {[['Real-time', 'Socket.IO'], ['Secure', 'JWT Auth'], ['Scalable', 'MERN Stack']].map(([a, b]) => (
              <div key={a} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#4CAF50' }}>{a}</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{b}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 40px', background: '#f8fafc' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '36px', fontWeight: 800,
                       color: '#1a1a2e', marginBottom: '12px' }}>
            Everything You Need
          </h2>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '50px', fontSize: '16px' }}>
            Powerful features for modern inventory management
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
          }}>
            {features.map(f => (
              <div key={f.title} style={{
                background: '#fff', borderRadius: '12px', padding: '28px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                border: '1px solid #e5e7eb', transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'default',
              }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
                }}
              >
                <div style={{ fontSize: '36px', marginBottom: '16px' }}>{f.icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: '18px', marginBottom: '8px', color: '#1a1a2e' }}>
                  {f.title}
                </h3>
                <p style={{ color: '#666', lineHeight: 1.6, fontSize: '14px' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        background: 'linear-gradient(135deg, #1a1a2e, #0f3460)',
        padding: '80px 40px', textAlign: 'center',
      }}>
        <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>
          Ready to Get Started?
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '32px', fontSize: '16px' }}>
          Join and manage your inventory smarter today.
        </p>
        <button onClick={() => navigate('/register')} style={{
          background: '#4CAF50', color: '#fff', border: 'none',
          padding: '16px 48px', borderRadius: '8px', fontSize: '18px',
          fontWeight: 700, cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(76,175,80,0.4)',
        }}>
          Create Free Account →
        </button>
      </section>

      {/* Footer */}
      <footer style={{
        background: '#0d0d1a', padding: '30px 40px',
        textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '14px',
      }}>
        © 2025 Inventory MS — Built with MERN Stack + Socket.IO
      </footer>
    </div>
  );
}