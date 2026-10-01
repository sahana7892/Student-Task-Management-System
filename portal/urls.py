from django.urls import path

from .views import (
    admin_dashboard,
    home,
    student_create,
    student_dashboard,
    student_delete,
    student_edit,
    task_create,
    task_delete,
    task_detail,
    task_edit,
    task_list,
)


urlpatterns = [
    path("", home, name="home"),
    path("admin/", admin_dashboard, name="admin_dashboard"),
    path("admin/students/new/", student_create, name="student_create"),
    path("admin/students/<int:pk>/edit/", student_edit, name="student_edit"),
    path("admin/students/<int:pk>/delete/", student_delete, name="student_delete"),
    path("admin/tasks/", task_list, name="task_list"),
    path("admin/tasks/new/", task_create, name="task_create"),
    path("admin/tasks/<int:pk>/edit/", task_edit, name="task_edit"),
    path("admin/tasks/<int:pk>/delete/", task_delete, name="task_delete"),
    path("tasks/", student_dashboard, name="student_dashboard"),
    path("tasks/<int:pk>/", task_detail, name="task_detail"),
]