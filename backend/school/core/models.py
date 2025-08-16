from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ("student", "Student"),
        ("teacher", "Teacher"),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)


class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="student_profile")

    # extra fields
    date_of_birth = models.DateField(null=True, blank=True)
    enrollment_number = models.CharField(max_length=20, unique=True, null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    grade_level = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.enrollment_number}"


class Teacher(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="teacher_profile")

    # extra fields
    employee_id = models.CharField(max_length=20, unique=True, null=True, blank=True)
    specialization = models.CharField(max_length=100, null=True, blank=True)
    years_of_experience = models.PositiveIntegerField(default=0)
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    office_address = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} ({self.specialization})"


class Course(models.Model):
    name = models.CharField(max_length=100)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name="courses")
    students = models.ManyToManyField(Student, related_name="courses")

    def __str__(self):
        return self.name
