import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Loader } from 'lucide-react';

export default function Login() {
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (tab === 'login') {
        await login(form.email, form.password);
        toast.success('Welcome back!');
      } else {
        await register(form.name, form.email, form.password);
        toast.success('Account created!');
      }
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="icon">P</div>
          <h1>Portfolio Dashboard</h1>
          <p>Manage your portfolio with ease</p>
        </div>

        <div className="login-tabs">
          <button className={`login-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => setTab('login')}>
            Sign In
          </button>
          <button className={`login-tab ${tab === 'register' ? 'active' : ''}`} onClick={() => setTab('register')}>
            Register
          </button>
        </div>

        <form onSubmit={submit}>
          {tab === 'register' && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input name="name" className="form-input" placeholder="John Doe" value={form.name} onChange={handle} required />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input name="email" type="email" className="form-input" placeholder="you@example.com" value={form.email} onChange={handle} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                name="password" type={show ? 'text' : 'password'}
                className="form-input" placeholder="••••••••"
                value={form.password} onChange={handle} required
                style={{ paddingRight: 44 }}
              />
              <button type="button" onClick={() => setShow(!show)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer' }}>
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} disabled={loading}>
            {loading ? <Loader size={16} className="spin" /> : tab === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
      <style>{`.spin { animation: spin 0.8s linear infinite; }`}</style>
    </div>
  );
}
