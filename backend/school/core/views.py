from rest_framework import generics, permissions
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer, CourseSerializer, StudentSerializer
from .models import Course, Student

User = get_user_model()

# Registration
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


# Courses
class CourseListView(generics.ListAPIView):
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "teacher":
            return Course.objects.filter(teacher=user.teacher_profile)
        elif user.role == "student":
            return user.student_profile.courses.all()
        return Course.objects.none()


# Students
class StudentListView(generics.ListAPIView):
    serializer_class = StudentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "teacher":
            return Student.objects.all()
        elif user.role == "student":
            return [user.student_profile]
        return Student.objects.none()

from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response({"error": "Username and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)
        if user is not None:
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)

            # Add custom claim for role in access token
            access_token = refresh.access_token
            access_token['role'] = user.role  # <-- add role here
            print("user",user.role)
            # Prepare user data
            user_data = {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.role,  # still useful to send in JSON
                "access": str(access_token),
                "refresh": str(refresh),
            }

            # Include profile info based on role
            if user.role == "student":
                student_profile = getattr(user, "student_profile", None)
                if student_profile:
                    user_data.update({
                        "enrollment_number": student_profile.enrollment_number,
                        "date_of_birth": student_profile.date_of_birth,
                        "grade_level": student_profile.grade_level,
                        "address": student_profile.address,
                        "phone_number": student_profile.phone_number,
                    })
            elif user.role == "teacher":
                teacher_profile = getattr(user, "teacher_profile", None)
                if teacher_profile:
                    user_data.update({
                        "employee_id": teacher_profile.employee_id,
                        "specialization": teacher_profile.specialization,
                        "years_of_experience": teacher_profile.years_of_experience,
                        "phone_number": teacher_profile.phone_number,
                        "office_address": teacher_profile.office_address,
                    })

            return Response({"message": "Login successful", "user": user_data}, status=status.HTTP_200_OK)

        return Response({"error": "Invalid username or password"}, status=status.HTTP_401_UNAUTHORIZED)