<<<<<<< HEAD
# Student Task Management

A student task portal with student records, assignment deadlines, and progress tracking. It uses SQLite storage and opens directly to the management workspace without a login page.

## Run locally

```powershell
py -3.11 -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py seed_demo
python manage.py runserver
```

Open http://127.0.0.1:8000/.

The demo data includes a student and sample assignments. No credentials are required.

## Features

- Student directory with search, status filters, create/edit/delete.
- Task assignment with due date, priority, search, edit, and delete.
- Student task list with keyword, deadline, priority, and status filters; task detail and submission notes.
- In-app reminders for incomplete tasks due in the next seven days.
- Progress summary and clear validation, confirmation, error, and empty states.
- CSRF protection on create, update, and delete forms.

## Production configuration

This version has no authentication or authorization. Anyone who can reach it can view, add, edit, or delete all student and task records. Run it only in a trusted local environment; do not expose it to the public internet or use real student data. Add authentication before any shared or production deployment.

## Tests

```powershell
python manage.py test portal.tests
```
=======
# Student Task Management System (Assessment Module)

**Done by:** Jason Kenneth N

---

## Tech Stacks Used

| Layer    | Technology                   |
| -------- | ---------------------------- |
| Frontend | React, CSS                   |
| Backend  | Django, Django REST Framework |
| Database | SQLite3 (Django default)     |
| API      | RESTful API                  |

---

## Features

### 1. Add Assignment
- Assignment form with fields for title, subject, and description
- Form validation to ensure all fields are filled
- Assignments are saved to the database via REST API
- Newly created assignments appear in the assignment list immediately

### 2. Set Assignment Deadline
- Deadline date picker field on the assignment form
- Date validation — past dates are rejected by the backend
- Deadline is saved alongside the assignment
- Deadline is displayed on each assignment card with visual indicators (overdue / upcoming)

### 3. Update Assignment Status
- Three status options: **Pending**, **In Progress**, **Completed**
- Status dropdown on each assignment card for quick updates
- Status changes are saved to the backend immediately via PATCH request
- Visual color coding for each status (yellow = pending, blue = in progress, green = completed)

---

## Project Structure

```
Student-Task-Management-System/
├── frontend/          # React application
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
├── backend/           # Django application
│   ├── task_manager/  # Django project settings
│   ├── assignments/   # Assignments app (models, views, serializers, tests)
│   ├── manage.py
│   └── venv/          # Python virtual environment
├── README.md
└── .gitignore
```

---

## API Endpoints

| Method | Endpoint                 | Description             |
| ------ | ------------------------ | ----------------------- |
| GET    | `/api/assignments/`      | List all assignments    |
| POST   | `/api/assignments/`      | Create a new assignment |
| GET    | `/api/assignments/{id}/` | Get assignment details  |
| PUT    | `/api/assignments/{id}/` | Update full assignment  |
| PATCH  | `/api/assignments/{id}/` | Partial update (status) |
| DELETE | `/api/assignments/{id}/` | Delete an assignment    |
>>>>>>> f294463e48476fd8e3a4143cd70b36300146462e
