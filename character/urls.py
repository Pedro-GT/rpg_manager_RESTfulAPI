from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import (
    CharacterViewSet, RaceViewSet, SkillViewSet,
    RegionViewSet, CharacterPageView, SkillPageView,
    RegionPageView,
)

router = DefaultRouter()
router.register(r'characters', CharacterViewSet, basename='character')
router.register(r'races', RaceViewSet)
router.register(r'skills', SkillViewSet)
router.register(r'regions', RegionViewSet)

urlpatterns = [
    path('app/characters/', CharacterPageView.as_view(), name='character-page'),
    path('app/skills/', SkillPageView.as_view(), name='skill-page'),
    path('app/regions/', RegionPageView.as_view(), name='region-page'),
    path('', include(router.urls)),
]
