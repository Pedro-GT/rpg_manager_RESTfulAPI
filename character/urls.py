from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import (
    CharacterViewSet, RaceViewSet, SkillViewSet, 
    RegionViewSet, 
)

router = DefaultRouter()
router.register(r'characters', CharacterViewSet)    
router.register(r'races', RaceViewSet)
router.register(r'skills', SkillViewSet)
router.register(r'regions', RegionViewSet)



urlpatterns = [
    path('', include(router.urls)),
]



