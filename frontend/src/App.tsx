import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDownUp, BookOpen, CalendarDays, Check, CheckCircle2, ChevronDown, Circle, Clock3, FileText, Flag, FolderKanban, GraduationCap, ListTodo, Plus, Search, SlidersHorizontal, X } from 'lucide-react'
import { CATEGORIES, PRIORITIES, fetchTasks, saveTask, type Task, type TaskCategory, type TaskPriority, type TaskStatus } from './tasks'
import './App.css'

type TaskView = 'All tasks' | 'Pending' | 'Completed'
const viewStatus: Record<TaskView, TaskStatus | undefined> = { 'All tasks': undefined, Pending: 'Pending', Completed: 'Completed' }
const today = new Date()
const todayKey = today.toISOString().slice(0, 10)
const todayLabel = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(today)

function currentDate() {
  return new Date().toISOString().slice(0, 10)
}

function formatDate(date: string | null) {
  if (!date) return 'No date'
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(`${date}T12:00:00`))
}

function App() {
  const [view, setView] = useState<TaskView>('All tasks')
  const [tasks, setTasks] = useState<Task[]>([])
  const [allTasks, setAllTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [retryCount, setRetryCount] = useState(0)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [sortAscending, setSortAscending] = useState(true)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const searchInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let current = true
    Promise.all([fetchTasks(viewStatus[view]), fetchTasks()]).then(([result, all]) => { if (current) { setTasks(result); setAllTasks(all) } }).catch(() => { if (current) setError('Tasks could not be loaded. Please try again.') }).finally(() => { if (current) setLoading(false) })
    return () => { current = false }
  }, [view, retryCount])

  useEffect(() => {
    function handleSearchShortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        searchInput.current?.focus()
      }
    }
    window.addEventListener('keydown', handleSearchShortcut)
    return () => window.removeEventListener('keydown', handleSearchShortcut)
  }, [])

  const visibleTasks = useMemo(() => {
    const searchTerm = query.trim().toLowerCase()
    return tasks.filter((task) => {
      const matchesSearch = !searchTerm || [task.name, task.description, task.assignee, task.category, task.priority, task.status, task.dueDate ?? ''].some((value) => value.toLowerCase().includes(searchTerm))
      return matchesSearch && (!priorityFilter || task.priority === priorityFilter) && (!categoryFilter || task.category === categoryFilter)
    }).sort((first, second) => {
      const firstDate = first.dueDate ?? '9999-12-31'
      const secondDate = second.dueDate ?? '9999-12-31'
      return firstDate.localeCompare(secondDate) * (sortAscending ? 1 : -1)
    })
  }, [tasks, query, priorityFilter, categoryFilter, sortAscending])

  const hasFilters = Boolean(query || priorityFilter || categoryFilter)
  function navigateToView(nextView: TaskView) {
    if (nextView !== view) {
      setLoading(true)
      setError('')
      setView(nextView)
    }
  }

  async function persistTask(updatedTask: Task, openDetails = true) {
    await saveTask(updatedTask)
    setTasks((current) => {
      const inView = viewStatus[view]
      const matchesView = !inView || updatedTask.status === inView
      return current.some((task) => task.id === updatedTask.id)
        ? current.flatMap((task) => task.id === updatedTask.id && matchesView ? [updatedTask] : task.id === updatedTask.id ? [] : [task])
        : matchesView ? [updatedTask, ...current] : current
    })
    setAllTasks((current) => current.some((task) => task.id === updatedTask.id)
      ? current.map((task) => task.id === updatedTask.id ? updatedTask : task)
      : [updatedTask, ...current])
    if (openDetails) setSelectedTask(updatedTask)
  }
  async function createTask(task: Task) {
    await saveTask(task)
    navigateToView('All tasks')
    setTasks((current) => [task, ...current.filter((item) => item.id !== task.id)])
    setAllTasks((current) => [task, ...current.filter((item) => item.id !== task.id)])
    setShowCreate(false)
  }
  function changeStatus(task: Task) {
    const completed = task.status !== 'Completed'
    void persistTask({ ...task, status: completed ? 'Completed' : 'Pending', completedAt: completed ? currentDate() : null }, selectedTask?.id === task.id)
  }

  const completedCount = allTasks.filter((task) => task.status === 'Completed').length
  const pendingCount = allTasks.filter((task) => task.status === 'Pending').length

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark"><GraduationCap size={19} /></span><span>study<span className="brand-accent">space</span></span></div>
      <div className="workspace-label">WORKSPACE</div>
      <nav className="side-nav" aria-label="Main navigation">
        <button className={`nav-item ${view !== 'Completed' ? 'active' : ''}`} onClick={() => navigateToView('All tasks')}><ListTodo size={18} /><span>My tasks</span><span className="nav-count">{pendingCount}</span></button>
        <button className={`nav-item ${view === 'Completed' ? 'active' : ''}`} onClick={() => navigateToView('Completed')}><CheckCircle2 size={18} /><span>Completed</span><span className="nav-count">{completedCount}</span></button>
      </nav>
      <div className="sidebar-rule" />
      <div className="workspace-label">YOUR CATEGORIES</div>
      <div className="category-links">{CATEGORIES.map((category) => <button key={category} className={`category-link ${categoryFilter === category ? 'selected' : ''}`} onClick={() => { setCategoryFilter(categoryFilter === category ? '' : category); navigateToView('All tasks') }}><span className={`category-dot ${category.toLowerCase()}`} />{category}</button>)}</div>
      <div className="sidebar-bottom"><div className="avatar avatar-lilac">JD</div><div><strong>Jamie Davis</strong><span>Student account</span></div><button className="icon-button small-more" aria-label="Account options"><ChevronDown size={15} /></button></div>
    </aside>

    <main className="main-content">
      <header className="topbar"><div className="breadcrumb"><span>Workspace</span><span className="breadcrumb-separator">/</span><strong>{view}</strong></div><div className="topbar-right"><span className="today-label"><CalendarDays size={15} />{todayLabel}</span><div className="avatar avatar-green">JD</div></div></header>
      <section className="content-wrap">
        <div className="page-heading"><div><div className="eyebrow">YOUR STUDY PLAN</div><h1>{view === 'Completed' ? 'Completed tasks' : view === 'Pending' ? 'Pending tasks' : 'My tasks'}</h1><p className="page-subtitle">{view === 'Completed' ? 'A record of everything you’ve accomplished.' : 'Keep your coursework moving, one task at a time.'}</p></div><button className="primary-button" onClick={() => setShowCreate(true)}><Plus size={17} strokeWidth={2.4} />New task</button></div>
        <div className="overview-strip">
          <div className="overview-item"><span className="overview-icon mint"><ListTodo size={17} /></span><div><strong>{tasks.length}</strong><span>{view === 'Completed' ? 'Completed tasks' : view === 'Pending' ? 'Pending tasks' : 'Tasks in view'}</span></div></div>
          <div className="overview-divider" />
          <div className="overview-item"><span className="overview-icon peach"><Clock3 size={17} /></span><div><strong>{pendingCount}</strong><span>Still in progress</span></div></div>
          <div className="overview-divider" />
          <div className="overview-item"><span className="overview-icon blue"><Check size={17} /></span><div><strong>{completedCount}</strong><span>Completed</span></div></div>
          <div className="overview-note"><span className="note-spark">✳</span> Small steps add up.</div>
        </div>
        <div className="section-heading"><div><h2>Task list</h2><span className="result-count">{visibleTasks.length}</span></div><div className="view-switch" role="tablist" aria-label="Task status"><button role="tab" aria-selected={view === 'All tasks'} className={view === 'All tasks' ? 'chosen' : ''} onClick={() => navigateToView('All tasks')}>All</button><button role="tab" aria-selected={view === 'Pending'} className={view === 'Pending' ? 'chosen' : ''} onClick={() => navigateToView('Pending')}>Pending</button><button role="tab" aria-selected={view === 'Completed'} className={view === 'Completed' ? 'chosen' : ''} onClick={() => navigateToView('Completed')}>Completed</button></div></div>
        <div className="filter-bar">
          <label className="search-box"><Search size={17} /><input ref={searchInput} aria-label="Search tasks" placeholder="Search tasks, people, details..." value={query} onChange={(event) => setQuery(event.target.value)} /><kbd>Ctrl K</kbd></label>
          <span className="filter-label"><SlidersHorizontal size={15} />Filter by</span>
          <label className="select-wrap"><Flag size={14} /><select aria-label="Filter by priority" value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)}><option value="">Priority</option>{PRIORITIES.map((priority) => <option key={priority}>{priority}</option>)}</select><ChevronDown size={13} /></label>
          <label className="select-wrap"><FolderKanban size={14} /><select aria-label="Filter by category" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}><option value="">Category</option>{CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select><ChevronDown size={13} /></label>
          {hasFilters && <button className="clear-button" onClick={() => { setQuery(''); setPriorityFilter(''); setCategoryFilter('') }}>Clear filters</button>}
          <button className="sort-button" title={`Sort by due date, ${sortAscending ? 'oldest first' : 'newest first'}`} onClick={() => setSortAscending((ascending) => !ascending)}><ArrowDownUp size={15} /><span>Due date</span></button>
        </div>
        <div className="task-table-wrap">
          {loading ? <div className="state-panel"><div className="loader" /><strong>Loading your tasks</strong><span>Getting everything in order…</span></div> : error ? <div className="state-panel"><span className="state-icon error-icon"><X size={20} /></span><strong>We couldn’t load your tasks</strong><span>{error}</span><button className="text-action" onClick={() => { setLoading(true); setError(''); setRetryCount((count) => count + 1) }}>Try again</button></div> : visibleTasks.length === 0 ? <div className="state-panel"><span className="state-icon"><Search size={20} /></span><strong>{hasFilters ? 'No tasks match these filters' : view === 'Completed' ? 'No completed tasks yet' : 'Nothing on your list yet'}</strong><span>{hasFilters ? 'Try another search or clear your filters.' : view === 'Completed' ? 'Tasks you finish will show up here.' : 'Add a task to give your study plan a start.'}</span>{hasFilters ? <button className="text-action" onClick={() => { setQuery(''); setPriorityFilter(''); setCategoryFilter('') }}>Clear filters</button> : view !== 'Completed' && <button className="text-action" onClick={() => setShowCreate(true)}>Create your first task</button>}</div> : <table className="task-table"><thead><tr><th className="task-name-heading">TASK</th><th>CATEGORY</th><th>PRIORITY</th><th>{view === 'Completed' ? 'COMPLETED' : 'DUE DATE'}</th><th>ASSIGNEE</th><th>STATUS</th><th aria-label="Task actions" /></tr></thead><tbody>{visibleTasks.map((task) => <tr key={task.id} className="task-row"><td><div className="task-name-cell"><button className={`complete-toggle ${task.status === 'Completed' ? 'is-done' : ''}`} aria-label={task.status === 'Completed' ? `Mark ${task.name} pending` : `Mark ${task.name} completed`} onClick={(event) => { event.stopPropagation(); changeStatus(task) }}>{task.status === 'Completed' ? <Check size={13} /> : <Circle size={17} />}</button><button className="task-title-button" onClick={() => setSelectedTask(task)}><strong>{task.name}</strong><span>{task.description}</span></button></div></td><td><span className={`category-badge ${task.category.toLowerCase()}`}>{task.category === 'Assignment' ? <FileText size={13} /> : task.category === 'Exam' ? <BookOpen size={13} /> : <FolderKanban size={13} />}{task.category}</span></td><td><span className={`priority-badge ${task.priority.toLowerCase()}`}><span />{task.priority}</span></td><td><span className={`date-cell ${task.status === 'Pending' && task.dueDate && task.dueDate < todayKey ? 'overdue' : ''}`}><CalendarDays size={14} />{formatDate(task.status === 'Completed' ? task.completedAt : task.dueDate)}</span></td><td><div className="assignee-cell"><span className={`avatar avatar-${task.avatarTone}`}>{task.initials}</span>{task.assignee}</div></td><td><span className={`status-badge ${task.status.toLowerCase()}`}><span />{task.status}</span></td><td><button className="row-open" onClick={() => setSelectedTask(task)} aria-label={`Open ${task.name}`}><ChevronDown size={16} /></button></td></tr>)}</tbody></table>}
        </div>
        {!loading && !error && visibleTasks.length > 0 && <div className="table-footer"><span>Showing <strong>{visibleTasks.length}</strong> of <strong>{tasks.length}</strong> tasks</span><span className="footer-sync"><span />Saved automatically</span></div>}
      </section>
    </main>
    {selectedTask && <TaskDetails task={selectedTask} onClose={() => setSelectedTask(null)} onSave={persistTask} onToggleStatus={changeStatus} />}
    {showCreate && <TaskForm onClose={() => setShowCreate(false)} onSave={createTask} />}
  </div>
}

function TaskDetails({ task, onClose, onSave, onToggleStatus }: { task: Task; onClose: () => void; onSave: (task: Task) => Promise<void>; onToggleStatus: (task: Task) => void }) {
  function setField<K extends keyof Task>(field: K, value: Task[K]) { void onSave({ ...task, [field]: value }) }
  return <div className="drawer-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><aside className="detail-drawer" aria-label="Task details"><div className="drawer-top"><span className="drawer-kicker">TASK DETAILS</span><button className="icon-button" onClick={onClose} aria-label="Close task details"><X size={19} /></button></div><div className="drawer-status"><span className={`status-badge ${task.status.toLowerCase()}`}><span />{task.status}</span><span className="detail-id">TASK-{task.id.slice(-4).toUpperCase()}</span></div><h2 className="drawer-title">{task.name}</h2><p className="drawer-description">{task.description || 'No description added.'}</p><button className={`drawer-complete ${task.status === 'Completed' ? 'completed' : ''}`} onClick={() => onToggleStatus(task)}>{task.status === 'Completed' ? <><CheckCircle2 size={17} />Mark as pending</> : <><Circle size={17} />Mark as completed</>}</button><div className="drawer-rule" /><div className="detail-fields"><label><span><Flag size={15} />Priority</span><select className={`detail-select priority-${task.priority.toLowerCase()}`} value={task.priority} onChange={(event) => setField('priority', event.target.value as TaskPriority)}>{PRIORITIES.map((priority) => <option key={priority}>{priority}</option>)}</select></label><label><span><FolderKanban size={15} />Category</span><select className="detail-select" value={task.category} onChange={(event) => setField('category', event.target.value as TaskCategory)}>{CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select></label><div className="detail-field"><span><CalendarDays size={15} />{task.status === 'Completed' ? 'Completed on' : 'Due date'}</span><strong>{formatDate(task.status === 'Completed' ? task.completedAt : task.dueDate)}</strong></div><div className="detail-field"><span><GraduationCap size={15} />Assignee</span><strong><span className={`avatar avatar-${task.avatarTone}`}>{task.initials}</span>{task.assignee}</strong></div></div><div className="drawer-bottom"><span>Changes save automatically</span><span className="footer-sync"><span />Up to date</span></div></aside></div>
}

function TaskForm({ onClose, onSave }: { onClose: () => void; onSave: (task: Task) => Promise<void> }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [assignee, setAssignee] = useState('Jamie Davis')
  const [priority, setPriority] = useState<TaskPriority>('Medium')
  const [category, setCategory] = useState<TaskCategory>('Assignment')
  const [dueDate, setDueDate] = useState('')
  const [saving, setSaving] = useState(false)
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    const initials = assignee.trim().split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()
    await onSave({ id: crypto.randomUUID(), name: name.trim(), description: description.trim(), category, priority, dueDate: dueDate || null, assignee: assignee.trim(), initials, avatarTone: 'green', status: 'Pending', completedAt: null })
    setSaving(false)
  }
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><form className="task-modal" onSubmit={(event) => { void submit(event) }}><div className="modal-header"><div><span className="drawer-kicker">MAKE A PLAN</span><h2>New task</h2></div><button type="button" className="icon-button" onClick={onClose} aria-label="Close"><X size={19} /></button></div><label className="form-field"><span>Task name</span><input autoFocus required maxLength={100} placeholder="e.g. Read chapter four" value={name} onChange={(event) => setName(event.target.value)} /></label><label className="form-field"><span>Description <em>Optional</em></span><textarea rows={3} maxLength={500} placeholder="Add a few details to help you get started..." value={description} onChange={(event) => setDescription(event.target.value)} /></label><div className="form-grid"><label className="form-field"><span>Category</span><select value={category} onChange={(event) => setCategory(event.target.value as TaskCategory)}>{CATEGORIES.map((option) => <option key={option}>{option}</option>)}</select></label><label className="form-field"><span>Priority</span><select value={priority} onChange={(event) => setPriority(event.target.value as TaskPriority)}>{PRIORITIES.map((option) => <option key={option}>{option}</option>)}</select></label><label className="form-field"><span>Due date</span><input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} /></label><label className="form-field"><span>Assignee</span><input required value={assignee} onChange={(event) => setAssignee(event.target.value)} /></label></div><div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button className="primary-button" disabled={saving}><Plus size={16} />Create task</button></div></form></div>
}

export default App
