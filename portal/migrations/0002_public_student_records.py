from django.db import migrations, models


def copy_student_emails(apps, schema_editor):
    student_model = apps.get_model("portal", "Student")
    database = schema_editor.connection.alias
    for student in student_model.objects.using(database).select_related("user").all():
        student.email = student.user.email.strip() or f"student-{student.pk}@example.invalid"
        student.save(using=database, update_fields=["email"])


class Migration(migrations.Migration):
    dependencies = [("portal", "0001_initial")]

    operations = [
        migrations.AddField(
            model_name="student",
            name="email",
            field=models.EmailField(blank=True, max_length=254, null=True),
        ),
        migrations.RunPython(copy_student_emails, migrations.RunPython.noop),
        migrations.AlterField(
            model_name="student",
            name="email",
            field=models.EmailField(max_length=254),
        ),
        migrations.RemoveField(model_name="student", name="user"),
    ]