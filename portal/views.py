from datetime import timedelta

from django.contrib import messages
from django.db.models import Count, Q
from django.shortcuts import get_object_or_404, redirect, render
from django.utils import timezone

from .forms import StudentForm, StudentTaskUpdateForm, TaskForm
from .models import Student, Task


def home(request):
    return redirect("admin_dashboard")


def admin_dashboard(request):
    query = request.GET.get("q", "").strip()
    status = request.GET.get("status", "")
    students = Student.objects.annotate(task_count=Count("tasks"))
    if query:
        students = students.filter(
            Q(name__icontains=query) | Q(student_id__icontains=query) | Q(email__icontains=query)
        )
    if status in Student.Status.values:
        students = students.filter(status=status)
    context = {
        "students": students,
        "query": query,
        "status_filter": status,
        "total_students": Student.objects.count(),
        "active_students": Student.objects.filter(status=Student.Status.ACTIVE).count(),
        "open_tasks": Task.objects.exclude(status=Task.Status.COMPLETED).count(),
        "upcoming_count": Task.objects.filter(
            due_at__gte=timezone.now(), due_at__lte=timezone.now() + timedelta(days=7)
        ).exclude(status=Task.Status.COMPLETED).count(),
    }
    return render(request, "portal/admin_dashboard.html", context)


def student_create(request):
    form = StudentForm(request.POST or None)
    if request.method == "POST" and form.is_valid():
        student = form.save()
        messages.success(request, f"{student.name} was added.")
        return redirect("admin_dashboard")
    return render(request, "portal/student_form.html", {"form": form, "heading": "Add student"})


def student_edit(request, pk):
    student = get_object_or_404(Student, pk=pk)
    form = StudentForm(request.POST or None, instance=student)
    if request.method == "POST" and form.is_valid():
        form.save()
        messages.success(request, f"Changes to {student.name} were saved.")
        return redirect("admin_dashboard")
    return render(
        request,
        "portal/student_form.html",
        {"form": form, "heading": "Edit student", "student": student},
    )


def student_delete(request, pk):
    student = get_object_or_404(Student, pk=pk)
    if request.method == "POST":
        name = student.name
        student.delete()
        messages.success(request, f"{name} and their task records were deleted.")
        return redirect("admin_dashboard")
    return render(request, "portal/confirm_delete.html", {"object": student, "kind": "student"})


def task_list(request):
    query = request.GET.get("q", "").strip()
    tasks = Task.objects.select_related("student")
    if query:
        tasks = tasks.filter(
            Q(title__icontains=query)
            | Q(student__name__icontains=query)
            | Q(student__student_id__icontains=query)
        )
    status = request.GET.get("status", "")
    if status in Task.Status.values:
        tasks = tasks.filter(status=status)
    return render(request, "portal/task_list.html", {"tasks": tasks, "query": query, "status_filter": status})


def task_create(request):
    form = TaskForm(request.POST or None)
    if request.method == "POST" and form.is_valid():
        task = form.save()
        messages.success(request, f"Task assigned to {task.student.name}.")
        return redirect("task_list")
    return render(request, "portal/task_form.html", {"form": form, "heading": "Assign task"})


def task_edit(request, pk):
    task = get_object_or_404(Task, pk=pk)
    form = TaskForm(request.POST or None, instance=task)
    if request.method == "POST" and form.is_valid():
        form.save()
        messages.success(request, "Task changes were saved.")
        return redirect("task_list")
    return render(request, "portal/task_form.html", {"form": form, "heading": "Edit task", "task": task})


def task_delete(request, pk):
    task = get_object_or_404(Task, pk=pk)
    if request.method == "POST":
        task.delete()
        messages.success(request, "Task deleted.")
        return redirect("task_list")
    return render(request, "portal/confirm_delete.html", {"object": task, "kind": "task"})


def student_dashboard(request):
    student_id = request.GET.get("student_id", "").strip()
    student = get_object_or_404(Student, pk=student_id) if student_id else None
    students = Student.objects.all()
    tasks = Task.objects.filter(student=student) if student else Task.objects.none()
    query = request.GET.get("q", "").strip()
    status = request.GET.get("status", "")
    priority = request.GET.get("priority", "")
    due = request.GET.get("due", "")
    if query:
        tasks = tasks.filter(Q(title__icontains=query) | Q(description__icontains=query))
    if status in Task.Status.values:
        tasks = tasks.filter(status=status)
    if priority in Task.Priority.values:
        tasks = tasks.filter(priority=priority)
    now = timezone.now()
    if due == "overdue":
        tasks = tasks.filter(due_at__lt=now).exclude(status=Task.Status.COMPLETED)
    elif due == "upcoming":
        tasks = tasks.filter(due_at__gte=now, due_at__lte=now + timedelta(days=7)).exclude(
            status=Task.Status.COMPLETED
        )
    reminders = (
        Task.objects.filter(
            student=student,
            due_at__gte=now,
            due_at__lte=now + timedelta(days=7),
        ).exclude(status=Task.Status.COMPLETED)
        if student
        else Task.objects.none()
    )
    total = student.tasks.count() if student else 0
    completed = student.tasks.filter(status=Task.Status.COMPLETED).count() if student else 0
    return render(
        request,
        "portal/student_dashboard.html",
        {
            "students": students,
            "student": student,
            "student_id": student_id,
            "tasks": tasks,
            "query": query,
            "status_filter": status,
            "priority_filter": priority,
            "due_filter": due,
            "reminders": reminders,
            "total_tasks": total,
            "completed_tasks": completed,
            "progress_percent": round(completed * 100 / total) if total else 0,
        },
    )


def task_detail(request, pk):
    task = get_object_or_404(Task, pk=pk)
    form = StudentTaskUpdateForm(request.POST or None, instance=task)
    if request.method == "POST" and form.is_valid():
        task = form.save(commit=False)
        task.submitted_at = timezone.now() if task.status == Task.Status.COMPLETED else None
        task.save()
        messages.success(request, "Task progress was updated.")
        return redirect("task_detail", pk=task.pk)
    return render(request, "portal/task_detail.html", {"task": task, "form": form})