import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '../api';
import axios from 'axios';
import { FolderKanban, Code2, CheckCircle, Clock, BarChart2, TrendingUp, Activity, Eye } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useAuth } from '../context/AuthContext';

const COLORS = ['#6c63ff', '#ff6584', '#43d4a0', '#f6ad55', '#63b3ed'];
const BASE = 'http://localhost:5000/api';

const categoryClass = {
  'Web Development': 'badge-web', 'Mobile Development': 'badge-mobile',
  'Graphic Design': 'badge-design', 'Data Analysis': 'badge-data', 'Other': 'badge-other'
};
const statusClass = {
  'Completed': 'badge-completed', 'In Progress': 'badge-progress', 'Planned': 'badge-planned'
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const getUserId = () => {
    try { return JSON.parse(atob(token.split('.')[1])).id; }
    catch { return null; }
  };

  useEffect(() => {
    Promise.all([
      getDashboardStats(),
      axios.get(`${BASE}/activities`)
    ])
      .then(([statsRes, actRes]) => {
        setStats(statsRes.data);
        setActivities(actRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" /></div>;

  const statCards = [
    { label: 'Total Projects', value: stats?.totalProjects || 0, icon: FolderKanban, color: '#6c63ff', bg: 'rgba(108,99,255,0.15)', sub: 'All projects' },
    { label: 'Total Skills', value: stats?.totalSkills || 0, icon: Code2, color: '#43d4a0', bg: 'rgba(67,212,160,0.15)', sub: 'Technologies' },
    { label: 'Completed', value: stats?.completedProjects || 0, icon: CheckCircle, color: '#43d4a0', bg: 'rgba(67,212,160,0.15)', sub: 'Projects done' },
    { label: 'In Progress', value: stats?.inProgressProjects || 0, icon: Clock, color: '#f6ad55', bg: 'rgba(246,173,85,0.15)', sub: 'Active projects' },
  ];

  const categoryData = (stats?.categoryCounts || []).map(c => ({ name: c._id, value: c.count }));
  const skillData = (stats?.skillCategories || []).map(s => ({ name: s._id, count: s.count, avg: Math.round(s.avgProficiency) }));
  const userId = getUserId();

  const timeAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div>
      {/* Stat Cards */}
      <div className="stats-grid">
        {statCards.map(({ label, value, icon: Icon, color, bg, sub }) => (
          <div className="stat-card" key={label}>
            <div className="stat-icon" style={{ background: bg }}><Icon size={24} color={color} /></div>
            <div className="stat-info">
              <div className="label">{label}</div>
              <div className="value" style={{ color }}>{value}</div>
              <div className="sub">{sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Projects by Category</div>
            <BarChart2 size={18} color="var(--text3)" />
          </div>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ percent }) => `${(percent * 100).toFixed(0)}%`}>
                  {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8 }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : <div className="empty-state"><p>No project data yet</p></div>}
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Skills by Category</div>
            <TrendingUp size={18} color="var(--text3)" />
          </div>
          {skillData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={skillData} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                <XAxis dataKey="name" tick={{ fill: 'var(--text2)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'var(--text2)', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8 }} />
                <Bar dataKey="count" fill="var(--accent)" radius={[6, 6, 0, 0]} name="Skills" />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="empty-state"><p>No skills data yet</p></div>}
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 24 }}>

        {/* Recent Projects */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Recent Projects</div>
            <FolderKanban size={18} color="var(--text3)" />
          </div>
          {stats?.recentProjects?.length > 0 ? (
            <div className="table-container">
              <table>
                <thead><tr><th>Project</th><th>Category</th><th>Status</th></tr></thead>
                <tbody>
                  {stats.recentProjects.map(p => (
                    <tr key={p._id}>
                      <td style={{ fontWeight: 500 }}>{p.title}</td>
                      <td><span className={`badge ${categoryClass[p.category] || 'badge-other'}`}>{p.category}</span></td>
                      <td><span className={`badge ${statusClass[p.status] || 'badge-other'}`}>{p.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state"><FolderKanban size={36} /><p>No projects yet</p></div>
          )}
        </div>

        {/* Recent Activities */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Recent Activities</div>
            <Activity size={18} color="var(--text3)" />
          </div>
          {activities.length > 0 ? (
            <div style={{ display: 'grid', gap: 12 }}>
              {activities.slice(0, 7).map(a => (
                <div key={a._id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                    {a.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{a.action}</div>
                    <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{timeAgo(a.createdAt)}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state"><Activity size={36} /><p>No activities yet</p></div>
          )}
        </div>
      </div>

      {/* Preview Button */}
      {userId && (
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <a href={`/preview/${userId}`} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ display: 'inline-flex' }}>
            <Eye size={16} /> View My Public Portfolio
          </a>
        </div>
      )}
    </div>
  );
}
