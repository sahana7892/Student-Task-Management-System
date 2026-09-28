# Student Task Management System

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
