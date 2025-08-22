from django.urls import path, include
from .views import RegisterView, CourseViewSet, StudentListView, LoginView, StudentCreateView, GradeListCreateView
from rest_framework.routers import DefaultRouter
# students/urls.py
from django.urls import path
from .views import StudentSearchView

router = DefaultRouter()
router.register(r'courses', CourseViewSet, basename='course')



urlpatterns = [
    path("search/", StudentSearchView.as_view(), name="student-search"),
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("students/", StudentListView.as_view(), name="students"),
    path("students/create/", StudentCreateView.as_view(), name="student-create"),
    path('grades/', GradeListCreateView.as_view(), name='grade-list-create'),
    path("", include(router.urls)),  # <- include the router
]
