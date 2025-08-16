from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Student, Teacher, Course


# Extend Django’s default UserAdmin to include the "role" field
class UserAdmin(BaseUserAdmin):
    fieldsets = BaseUserAdmin.fieldsets + (
        ("Role", {"fields": ("role",)}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ("Role", {"fields": ("role",)}),
    )
    list_display = ("username", "email", "role", "is_staff", "is_superuser")
    list_filter = ("role", "is_staff", "is_superuser")


# Inline Courses under Teacher
class CourseInline(admin.TabularInline):
    model = Course
    extra = 1


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ("user", "enrollment_number", "grade_level", "phone_number")
    search_fields = ("user__username", "enrollment_number")
    list_filter = ("grade_level",)


@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
    list_display = ("user", "employee_id", "specialization", "years_of_experience")
    search_fields = ("user__username", "employee_id", "specialization")
    list_filter = ("specialization", "years_of_experience")
    inlines = [CourseInline]   # 👈 allows adding courses while editing teacher


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ("name", "teacher")
    search_fields = ("name", "teacher__user__username")
    filter_horizontal = ("students",)  # 👈 nice UI for adding/removing students


# Register custom User
admin.site.register(User, UserAdmin)
