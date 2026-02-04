from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import CursorPagination
from django.db import models
from django.db.models import F
from django.views.generic import TemplateView
from .model import Character, Race, Skill, Region
from .serializer import (
    CharacterSerializer, RaceSerializer, SkillSerializer,
    RegionSerializer
)


class CharacterCursorPagination(CursorPagination):
    page_size = 12
    ordering = '-id'


class CharacterViewSet(viewsets.ModelViewSet):
    serializer_class = CharacterSerializer
    pagination_class = CharacterCursorPagination

    def get_queryset(self):
        qs = Character.objects.select_related('race', 'region').prefetch_related('skills')
        search = self.request.query_params.get('search', '')
        race = self.request.query_params.get('race', '')
        region = self.request.query_params.get('region', '')

        if search:
            qs = qs.filter(
                models.Q(first_name__icontains=search) |
                models.Q(last_name__icontains=search)
            )
        if race:
            qs = qs.filter(race_id=race)
        if region:
            qs = qs.filter(region_id=region)

        return qs

    @action(detail=False, methods=['post'])
    def increase_age(self, request):
        Character.objects.update(age=F('age') + 1)
        characters = self.get_queryset()
        serializer = self.get_serializer(characters, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='by-first-name')
    def get_by_first_name(self, request):
        first_name = request.query_params.get('first_name').capitalize()
        if not first_name:
            return Response({"error": "first_name query parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

        characters = self.get_queryset().filter(first_name=first_name)
        if not characters.exists():
            return Response({"error": "Character not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(characters, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class RaceViewSet(viewsets.ModelViewSet):
    queryset = Race.objects.all()
    serializer_class = RaceSerializer

class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer

class RegionViewSet(viewsets.ModelViewSet):
    queryset = Region.objects.all()
    serializer_class = RegionSerializer


class CharacterPageView(TemplateView):
    template_name = 'character/characters_page.html'
    extra_context = {'active_page': 'characters'}


class SkillPageView(TemplateView):
    template_name = 'character/skills_page.html'
    extra_context = {'active_page': 'skills'}


class RegionPageView(TemplateView):
    template_name = 'character/regions_page.html'
    extra_context = {'active_page': 'regions'}
