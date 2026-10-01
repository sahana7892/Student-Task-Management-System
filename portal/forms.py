from django import forms

from .models import Student, Task


class StudentForm(forms.ModelForm):
    class Meta:
        model = Student
        fields = ["student_id", "name", "email", "status"]

    def clean_email(self):
        email = self.cleaned_data["email"].strip()
        students = Student.objects.filter(email__iexact=email)
        if self.instance.pk:
            students = students.exclude(pk=self.instance.pk)
        if students.exists():
            raise forms.ValidationError("A student with this email already exists.")
        return email


class TaskForm(forms.ModelForm):
    due_at = forms.DateTimeField(
        input_formats=["%Y-%m-%dT%H:%M", "%Y-%m-%d %H:%M"],
        widget=forms.DateTimeInput(attrs={"type": "datetime-local"}, format="%Y-%m-%dT%H:%M"),
    )

    class Meta:
        model = Task
        fields = ["student", "title", "description", "due_at", "priority"]


class StudentTaskUpdateForm(forms.ModelForm):
    class Meta:
        model = Task
        fields = ["status", "submission_text"]
        widgets = {"submission_text": forms.Textarea(attrs={"rows": 5})}