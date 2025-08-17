from rest_framework import serializers
from .models import Student, Teacher, Course
from django.contrib.auth import get_user_model

User = get_user_model()

class StudentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = Student
        fields = "__all__"


class TeacherSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = Teacher
        fields = "__all__"


class CourseSerializer(serializers.ModelSerializer):
    students = StudentSerializer(many=True, read_only=True)
    teacher = TeacherSerializer(read_only=True)

    student_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Student.objects.all(), write_only=True, source="students"
    )

    class Meta:
        model = Course
        fields = "__all__"

    

# Base user registration serializer
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES)

    # Extra fields for Student
    date_of_birth = serializers.DateField(required=False, allow_null=True)
    enrollment_number = serializers.CharField(required=False, allow_blank=True)
    address = serializers.CharField(required=False, allow_blank=True)
    phone_number = serializers.CharField(required=False, allow_blank=True)
    grade_level = serializers.CharField(required=False, allow_blank=True)

    # Extra fields for Teacher
    employee_id = serializers.CharField(required=False, allow_blank=True)
    specialization = serializers.CharField(required=False, allow_blank=True)
    years_of_experience = serializers.IntegerField(required=False, default=0)
    office_address = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = (
            "username", "email", "password", "role",
            "date_of_birth", "enrollment_number", "address", "phone_number", "grade_level",
            "employee_id", "specialization", "years_of_experience", "office_address"
        )

    def create(self, validated_data):
        # Extract profile fields before creating the user
        student_fields = {k: validated_data.pop(k, None) for k in ["date_of_birth", "enrollment_number", "address", "phone_number", "grade_level"]}
        teacher_fields = {k: validated_data.pop(k, None) for k in ["employee_id", "specialization", "years_of_experience", "office_address"]}

        # Create the user
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            role=validated_data["role"]
        )

        # Create corresponding profile based on role
        if user.role == "student":
            Student.objects.create(user=user, **student_fields)
        elif user.role == "teacher":
            Teacher.objects.create(user=user, **teacher_fields)

        return user


# Student registration with extra fields
class StudentRegisterSerializer(serializers.ModelSerializer):
    user = RegisterSerializer()

    class Meta:
        model = Student
        fields = ("user", "date_of_birth", "enrollment_number", "address", "phone_number", "grade_level")

    def create(self, validated_data):
        user_data = validated_data.pop("user")
        user_serializer = RegisterSerializer(data=user_data)
        user_serializer.is_valid(raise_exception=True)
        user = user_serializer.save()

        student = Student.objects.create(user=user, **validated_data)
        return student


# Teacher registration with extra fields
class TeacherRegisterSerializer(serializers.ModelSerializer):
    user = RegisterSerializer()

    class Meta:
        model = Teacher
        fields = ("user", "employee_id", "specialization", "years_of_experience", "phone_number", "office_address")

    def create(self, validated_data):
        user_data = validated_data.pop("user")
        user_serializer = RegisterSerializer(data=user_data)
        user_serializer.is_valid(raise_exception=True)
        user = user_serializer.save()

        teacher = Teacher.objects.create(user=user, **validated_data)
        return teacher