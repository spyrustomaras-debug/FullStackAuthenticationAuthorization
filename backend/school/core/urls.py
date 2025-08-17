from django.urls import path, include
from .views import RegisterView, CourseViewSet, StudentListView, LoginView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'courses', CourseViewSet, basename='course')



urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("students/", StudentListView.as_view(), name="students"),
    path("", include(router.urls)),  # <- include the router
]
