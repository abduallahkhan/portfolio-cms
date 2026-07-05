import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Code2, User, LogOut, ChevronRight, Tag, Eye } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/projects', icon: FolderKanban, label: 'Projects' },
  { to: '/skills', icon: Code2, label: 'Skills' },
  { to: '/categories', icon: Tag, label: 'Categories' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/login');
  };

  // Get user ID from token
  const getUserId = () => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id;
    } catch { return null; }
  };

  const handlePreview = () => {
    const id = getUserId();
    if (id) window.open(`/preview/${id}`, '_blank');
  };

  return (
    <>
      {isOpen && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99 }} onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">P</div>
          <div>
            <h2>Portfolio</h2>
            <span>Admin Dashboard</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-section-title">Menu</div>
            {navItems.map(({ to, icon: Icon, label, exact }) => (
              <NavLink
                key={to}
                to={to}
                end={exact}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <Icon size={18} />
                {label}
                <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.5 }} />
              </NavLink>
            ))}
          </div>

          <div className="nav-section">
            <div className="nav-section-title">Portfolio</div>
            <button className="nav-item" style={{ width: '100%', border: 'none', cursor: 'pointer', background: 'none', textAlign: 'left' }} onClick={handlePreview}>
              <Eye size={18} />
              Preview Portfolio
              <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.5 }} />
            </button>
          </div>
        </nav>

        <div className="sidebar-user">
          <div className="user-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="user-info">
            <div className="name">{user?.name || 'User'}</div>
            <div className="role">Administrator</div>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Logout">
            <LogOut size={16} />
          </button>
        </div>
      </aside>
    </>
  );
}
