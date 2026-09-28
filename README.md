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