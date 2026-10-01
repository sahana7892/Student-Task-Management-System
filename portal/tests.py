from datetime import timedelta

from django.test import TestCase
from django.urls import reverse
from django.utils import timezone

from .models import Student, Task


class PortalWorkflowTests(TestCase):
    def setUp(self):
        self.student = Student.objects.create(
            student_id="ST-1001",
            name="Avery Student",
            email="avery@example.edu",
        )
        self.other_student = Student.objects.create(
            student_id="ST-1002",
            name="Jordan Student",
            email="jordan@example.edu",
        )
        self.task = Task.objects.create(
            student=self.student,
            title="Research notes",
            description="Collect three sources.",
            due_at=timezone.now() + timedelta(days=3),
        )

    def test_anonymous_home_opens_public_directory(self):
        response = self.client.get(reverse("home"))

        self.assertRedirects(response, reverse("admin_dashboard"), fetch_redirect_response=False)
        self.assertEqual(self.client.get(reverse("admin_dashboard")).status_code, 200)

    def test_login_page_is_removed(self):
        self.assertEqual(self.client.get("/login/").status_code, 404)

    def test_public_user_can_create_student_and_set_status(self):
        response = self.client.post(
            reverse("student_create"),
            {
                "student_id": "ST-1003",
                "name": "Sam New",
                "email": "sam@example.edu",
                "status": Student.Status.ACTIVE,
            },
        )

        self.assertRedirects(response, reverse("admin_dashboard"), fetch_redirect_response=False)
        student = Student.objects.get(student_id="ST-1003")

        response = self.client.post(
            reverse("student_edit", args=[student.pk]),
            {
                "student_id": student.student_id,
                "name": student.name,
                "email": student.email,
                "status": Student.Status.INACTIVE,
            },
        )
        student.refresh_from_db()
        self.assertRedirects(response, reverse("admin_dashboard"), fetch_redirect_response=False)
        self.assertEqual(student.status, Student.Status.INACTIVE)

    def test_public_user_deletes_student_after_confirmation(self):
        confirm = self.client.get(reverse("student_delete", args=[self.student.pk]))
        self.assertContains(confirm, "Delete this student?")
        self.assertTrue(Student.objects.filter(pk=self.student.pk).exists())

        response = self.client.post(reverse("student_delete", args=[self.student.pk]))
        self.assertRedirects(response, reverse("admin_dashboard"), fetch_redirect_response=False)
        self.assertFalse(Student.objects.filter(pk=self.student.pk).exists())

    def test_public_user_can_assign_task(self):
        due_at = (timezone.now() + timedelta(days=5)).strftime("%Y-%m-%dT%H:%M")
        response = self.client.post(
            reverse("task_create"),
            {
                "student": self.student.pk,
                "title": "Draft outline",
                "description": "Prepare the outline.",
                "due_at": due_at,
                "priority": Task.Priority.HIGH,
            },
        )

        self.assertRedirects(response, reverse("task_list"), fetch_redirect_response=False)
        self.assertTrue(Task.objects.filter(student=self.student, title="Draft outline").exists())

    def test_student_selection_filters_tasks_and_allows_updates(self):
        other_task = Task.objects.create(
            student=self.other_student,
            title="Private assignment",
            due_at=timezone.now() + timedelta(days=2),
        )
        dashboard = self.client.get(reverse("student_dashboard"), {"student_id": self.student.pk})
        self.assertContains(dashboard, "Research notes")
        self.assertNotContains(dashboard, "Private assignment")
        response = self.client.post(
            reverse("task_detail", args=[self.task.pk]),
            {"status": Task.Status.COMPLETED, "submission_text": "The sources are attached."},
        )
        self.assertRedirects(response, reverse("task_detail", args=[self.task.pk]), fetch_redirect_response=False)
        self.task.refresh_from_db()
        self.assertEqual(self.task.status, Task.Status.COMPLETED)
        self.assertEqual(self.task.submission_text, "The sources are attached.")
        self.assertIsNotNone(self.task.submitted_at)

    def test_student_task_filters_are_applied(self):
        response = self.client.get(
            reverse("student_dashboard"), {"student_id": self.student.pk, "q": "no match"}
        )

        self.assertContains(response, "No tasks match these filters")
        self.assertEqual(response.context["tasks"].count(), 0)