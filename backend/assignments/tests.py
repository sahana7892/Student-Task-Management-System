from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework import status
from datetime import timedelta
from .models import Assignment


class AssignmentModelTest(TestCase):
    def test_create_assignment(self):
        a = Assignment.objects.create(
            title="Math Homework",
            subject="Mathematics",
            description="Complete chapter 5 exercises",
            deadline=timezone.now().date() + timedelta(days=7),
        )
        self.assertEqual(str(a), "Math Homework")
        self.assertEqual(a.status, "pending")


class AssignmentAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.valid_data = {
            "title": "Physics Lab Report",
            "subject": "Physics",
            "description": "Write lab report for experiment 3",
            "deadline": (timezone.now().date() + timedelta(days=5)).isoformat(),
        }

    # --- Feature 1: Add Assignment ---
    def test_create_assignment(self):
        res = self.client.post("/api/assignments/", self.valid_data, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data["title"], "Physics Lab Report")
        self.assertEqual(res.data["subject"], "Physics")

    def test_list_assignments(self):
        self.client.post("/api/assignments/", self.valid_data, format="json")
        res = self.client.get("/api/assignments/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)

    # --- Feature 2: Deadline validation ---
    def test_deadline_saved_and_displayed(self):
        res = self.client.post("/api/assignments/", self.valid_data, format="json")
        self.assertEqual(res.data["deadline"], self.valid_data["deadline"])

    def test_past_deadline_rejected(self):
        bad = {**self.valid_data, "deadline": "2020-01-01"}
        res = self.client.post("/api/assignments/", bad, format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    # --- Feature 3: Update status ---
    def test_update_status(self):
        create = self.client.post("/api/assignments/", self.valid_data, format="json")
        pk = create.data["id"]
        res = self.client.patch(f"/api/assignments/{pk}/", {"status": "completed"}, format="json")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["status"], "completed")

    def test_default_status_is_pending(self):
        res = self.client.post("/api/assignments/", self.valid_data, format="json")
        self.assertEqual(res.data["status"], "pending")
