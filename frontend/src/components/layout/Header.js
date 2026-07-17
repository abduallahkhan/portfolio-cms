import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Bell, X, Trash2 } from 'lucide-react';
import axios from 'axios';

const BASE = 'https://portfolio-cms-production-22ff.up.railway.app';

const pageTitles = {
  '/': { title: 'Dashboard', sub: "Welcome back! Here's your portfolio overview." },
  '/projects': { title: 'Projects', sub: 'Manage and showcase your work.' },
  '/skills': { title: 'Skills', sub: 'Track your technical proficiency.' },
  '/categories': { title: 'Categories', sub: 'Organize your projects by category.' },
  '/profile': { title: 'Profile', sub: 'Manage your personal information.' },
};

export default function Header({ onMenuToggle }) {
  const { pathname } = useLocation();
  const page = pageTitles[pathname] || pageTitles['/'];
  const now = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef(null);

  const loadNotifications = async () => {
    try {
      const res = await axios.get(`${BASE}/notifications`);
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.unreadCount);
    } catch {}
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const markAllRead = async () => {
    try {
      await axios.put(`${BASE}/notifications/read-all`);
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch {}
  };

  const deleteNotif = async (id, e) => {
    e.stopPropagation();
    try {
      await axios.delete(`${BASE}/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch {}
  };

  const timeAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <header className="header">
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button className="btn-icon" id="menu-toggle" onClick={onMenuToggle} style={{ display: 'none' }}>
          <Menu size={18} />
        </button>
        <div className="header-left">
          <h1>{page.title}</h1>
          <p>{page.sub}</p>
        </div>
      </div>

      <div className="header-right">
        <div className="header-badge">
          <span className="online-dot" />
          {now}
        </div>

        {/* Notification Bell */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            className="btn-icon"
            onClick={() => { setShowNotif(!showNotif); if (!showNotif) markAllRead(); }}
            style={{ position: 'relative' }}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: -4, right: -4,
                background: 'var(--danger)', color: 'white',
                fontSize: 10, fontWeight: 700,
                width: 16, height: 16, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown */}
          {showNotif && (
            <div style={{
              position: 'absolute', top: 44, right: 0,
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: 16, width: 320, zIndex: 200,
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)'
            }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>Notifications</span>
                <button onClick={() => setShowNotif(false)} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer' }}>
                  <X size={14} />
                </button>
              </div>

              <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: 32, textAlign: 'center', color: 'var(--text3)', fontSize: 13 }}>
                    🔔 No notifications yet
                  </div>
                ) : (
                  notifications.map(n => (
                    <div key={n._id} style={{
                      padding: '12px 20px', borderBottom: '1px solid var(--border)',
                      display: 'flex', gap: 12, alignItems: 'flex-start',
                      background: n.read ? 'transparent' : 'rgba(108,99,255,0.05)',
                      transition: 'background 0.2s'
                    }}>
                      <span style={{ fontSize: 18 }}>{n.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, color: 'var(--text)' }}>{n.message}</div>
                        <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>{timeAgo(n.createdAt)}</div>
                      </div>
                      <button onClick={(e) => deleteNotif(n._id, e)}
                        style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', padding: 4 }}>
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`@media (max-width: 768px) { #menu-toggle { display: flex !important; } }`}</style>
    </header>
  );
}
