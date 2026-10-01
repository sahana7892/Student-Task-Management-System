export const PRIORITIES = ['Low', 'Medium', 'High'] as const
export const CATEGORIES = ['Assignment', 'Exam', 'Project'] as const

export type TaskPriority = typeof PRIORITIES[number]
export type TaskCategory = typeof CATEGORIES[number]
export type TaskStatus = 'Pending' | 'Completed'

export type Task = {
  id: string
  name: string
  description: string
  category: TaskCategory
  priority: TaskPriority
  dueDate: string | null
  assignee: string
  initials: string
  avatarTone: string
  status: TaskStatus
  completedAt: string | null
}

const storageKey = 'studyspace.tasks.v1'
const seedTasks: Task[] = [
  { id: 'task-2401', name: 'Research paper: urban ecology', description: 'Gather sources and outline the first draft on green corridors in city planning.', category: 'Assignment', priority: 'High', dueDate: '2026-10-02', assignee: 'Jamie Davis', initials: 'JD', avatarTone: 'green', status: 'Pending', completedAt: null },
  { id: 'task-2402', name: 'Calculus midterm review', description: 'Review integration techniques, series, and practice problems from weeks 4–7.', category: 'Exam', priority: 'High', dueDate: '2026-10-04', assignee: 'Jamie Davis', initials: 'JD', avatarTone: 'green', status: 'Pending', completedAt: null },
  { id: 'task-2403', name: 'Group presentation slides', description: 'Finalize the shared slide deck and check the references before the rehearsal.', category: 'Project', priority: 'Medium', dueDate: '2026-10-08', assignee: 'Morgan Lee', initials: 'ML', avatarTone: 'rose', status: 'Pending', completedAt: null },
  { id: 'task-2404', name: 'Read The Great Gatsby, chapters 5–7', description: 'Annotate key passages and add discussion notes to the seminar document.', category: 'Assignment', priority: 'Low', dueDate: '2026-10-10', assignee: 'Jamie Davis', initials: 'JD', avatarTone: 'green', status: 'Pending', completedAt: null },
  { id: 'task-2405', name: 'Statistics problem set 3', description: 'Complete questions 1–12 on confidence intervals and upload your work.', category: 'Assignment', priority: 'Medium', dueDate: '2026-09-25', assignee: 'Alex Chen', initials: 'AC', avatarTone: 'blue', status: 'Pending', completedAt: null },
  { id: 'task-2406', name: 'Chemistry lab report', description: 'Write up the reaction-rate experiment, including graphs and the error analysis.', category: 'Assignment', priority: 'Medium', dueDate: '2026-09-24', assignee: 'Jamie Davis', initials: 'JD', avatarTone: 'green', status: 'Completed', completedAt: '2026-09-23' },
  { id: 'task-2407', name: 'History source analysis', description: 'Compare two primary sources from the industrial revolution unit.', category: 'Assignment', priority: 'Low', dueDate: '2026-09-20', assignee: 'Taylor Kim', initials: 'TK', avatarTone: 'amber', status: 'Completed', completedAt: '2026-09-19' },
  { id: 'task-2408', name: 'Biology quiz: cell division', description: 'Review mitosis and meiosis before the in-class quiz.', category: 'Exam', priority: 'High', dueDate: '2026-09-18', assignee: 'Jamie Davis', initials: 'JD', avatarTone: 'green', status: 'Completed', completedAt: '2026-09-17' },
]

function readTasks(): Task[] {
  const stored = localStorage.getItem(storageKey)
  if (!stored) {
    localStorage.setItem(storageKey, JSON.stringify(seedTasks))
    return seedTasks
  }
  try {
    return JSON.parse(stored) as Task[]
  } catch {
    localStorage.setItem(storageKey, JSON.stringify(seedTasks))
    return seedTasks
  }
}

export async function fetchTasks(status?: TaskStatus): Promise<Task[]> {
  await new Promise((resolve) => window.setTimeout(resolve, 180))
  const tasks = readTasks()
  return status ? tasks.filter((task) => task.status === status) : tasks
}

export async function saveTask(task: Task): Promise<void> {
  const tasks = readTasks()
  const existingIndex = tasks.findIndex((item) => item.id === task.id)
  if (existingIndex === -1) tasks.unshift(task)
  else tasks[existingIndex] = task
  localStorage.setItem(storageKey, JSON.stringify(tasks))
}