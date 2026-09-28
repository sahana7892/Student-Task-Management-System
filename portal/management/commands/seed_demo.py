from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from portal.models import Student, Task


class Command(BaseCommand):
    help = "Create a demo student and sample assignments."

    def handle(self, *_args, **_options):
        student, _ = Student.objects.get_or_create(
            student_id="ST-1042",
            defaults={"name": "Avery Morgan", "email": "avery@example.edu"},
        )

        samples = [
            {
                "title": "Research question and sources",
                "description": "Write a focused research question and collect three reliable sources.",
                "due_at": timezone.now() + timedelta(days=2),
                "priority": Task.Priority.HIGH,
            },
            {
                "title": "Weekly reflection",
                "description": "Summarize what you learned and identify one question to revisit.",
                "due_at": timezone.now() + timedelta(days=5),
                "priority": Task.Priority.NORMAL,
            },
        ]
        for sample in samples:
            Task.objects.get_or_create(student=student, title=sample["title"], defaults=sample)

        self.stdout.write(self.style.SUCCESS("Demo data is ready."))
