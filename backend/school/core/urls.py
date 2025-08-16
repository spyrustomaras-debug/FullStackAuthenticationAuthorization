from django.urls import path
from .views import RegisterView, CourseListView, StudentListView, LoginView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("courses/", CourseListView.as_view(), name="courses"),
    path("students/", StudentListView.as_view(), name="students"),
]
