from rest_framework.routers import DefaultRouter
from .views import UserProfileViewSet, LogViewSet
from django.urls import include, path


router = DefaultRouter()
router.register(r'user-profiles', UserProfileViewSet)
router.register(r'logs', LogViewSet)

urlpatterns = [
    # Other URL patterns
    path('', include(router.urls)),
]
