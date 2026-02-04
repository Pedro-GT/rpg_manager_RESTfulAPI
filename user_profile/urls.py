from rest_framework.routers import DefaultRouter
from .views import UserProfileViewSet, LogViewSet, ProfilePageView
from django.urls import include, path


router = DefaultRouter()
router.register(r'user-profiles', UserProfileViewSet)
router.register(r'logs', LogViewSet)

urlpatterns = [
    path('app/profile/', ProfilePageView.as_view(), name='profile-page'),
    path('', include(router.urls)),
]
