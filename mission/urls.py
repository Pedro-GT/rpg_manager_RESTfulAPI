from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MissionViewSet, MissionPageView

router = DefaultRouter()
router.register(r'missions', MissionViewSet)

urlpatterns = [
    path('app/missions/', MissionPageView.as_view(), name='mission-page'),
    path('', include(router.urls)),
]
