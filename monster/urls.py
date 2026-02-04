from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MonsterViewSet, MonsterPageView

router = DefaultRouter()
router.register(r'monsters', MonsterViewSet)

urlpatterns = [
    path('app/monsters/', MonsterPageView.as_view(), name='monster-page'),
    path('', include(router.urls)),
]
