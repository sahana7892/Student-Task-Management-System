import { useState, useEffect, useCallback } from 'react';
import './App.css';

const API = 'http://localhost:8000/api/assignments/';

function App() {
  const [assignments, setAssignments] = useState([]);
  const [form, setForm] = useState({ title: '', subject: '', description: '', deadline: '' });
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const fetchAssignments = useCallback(async () => {
    try {
      const res = await fetch(API);
      setAssignments(await res.json());
    } catch {
      showToast('Failed to load assignments', 'error');
    }
  }, []);

  useEffect(() => { fetchAssignments(); }, [fetchAssignments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.subject || !form.description || !form.deadline) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        const msg = Object.values(data).flat().join(', ');
        showToast(msg || 'Validation failed', 'error');
        return;
      }
      setForm({ title: '', subject: '', description: '', deadline: '' });
      fetchAssignments();
      showToast('Assignment created!');
    } catch {
      showToast('Server error', 'error');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await fetch(`${API}${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      fetchAssignments();
      showToast('Status updated!');
    } catch {
      showToast('Failed to update status', 'error');
    }
  };

  const deleteAssignment = async (id) => {
    try {
      await fetch(`${API}${id}/`, { method: 'DELETE' });
      fetchAssignments();
      showToast('Assignment deleted!');
    } catch {
      showToast('Failed to delete', 'error');
    }
  };

  const getDeadlineClass = (deadline) => {
    const diff = (new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24);
    if (diff < 0) return 'overdue';
    if (diff <= 3) return 'upcoming';
    return 'future';
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="app">
      <header className="header">
        <h1>Student Task Manager</h1>
        <p>Organize your assignments, track deadlines, stay on top</p>
      </header>

      {/* ── Add Assignment Form ── */}
      <section className="form-card">
        <h2>📝 New Assignment</h2>
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input id="title" placeholder="Assignment title" value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input id="subject" placeholder="e.g. Mathematics" value={form.subject}
              onChange={e => setForm({ ...form, subject: e.target.value })} />
          </div>
          <div className="form-group">
            <label htmlFor="deadline">Deadline</label>
            <input id="deadline" type="date" min={today} value={form.deadline}
              onChange={e => setForm({ ...form, deadline: e.target.value })} />
          </div>
          <div className="form-group full">
            <label htmlFor="description">Description</label>
            <textarea id="description" placeholder="Describe the assignment…" value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <button type="submit" className="btn-submit">Create Assignment</button>
        </form>
      </section>

      {/* ── Assignment List ── */}
      <section>
        <div className="list-header">
          <h2>📋 Assignments</h2>
          <span className="count-badge">{assignments.length} total</span>
        </div>

        {assignments.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📭</div>
            <p>No assignments yet. Create one above!</p>
          </div>
        ) : (
          <div className="assignment-list">
            {assignments.map(a => (
              <div key={a.id} className="assignment-card">
                <div className="card-top">
                  <div>
                    <div className="card-title">{a.title}</div>
                    <div className="card-subject">{a.subject}</div>
                  </div>
                </div>
                <div className="card-desc">{a.description}</div>
                <div className="card-bottom">
                  <span className={`deadline-tag ${getDeadlineClass(a.deadline)}`}>
                    📅 {formatDate(a.deadline)}
                    {getDeadlineClass(a.deadline) === 'overdue' && ' — Overdue'}
                  </span>
                  <div className="card-actions">
                    <select className={`status-select status-${a.status}`}
                      value={a.status} onChange={e => updateStatus(a.id, e.target.value)}>
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    <button className="btn-delete" onClick={() => deleteAssignment(a.id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
    </div>
  );
}

export default App;
