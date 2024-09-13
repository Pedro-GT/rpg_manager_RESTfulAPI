from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from .model import Character, Race, Skill, Region
from .serializer import (
    CharacterSerializer, RaceSerializer, SkillSerializer, 
    RegionSerializer
)


class CharacterViewSet(viewsets.ModelViewSet):
    queryset = Character.objects.all()
    serializer_class = CharacterSerializer

    @action(detail=False, methods=['post'])
    def increase_age(self, request):
        characters = Character.objects.all()
        for character in characters:
            character.age += 1
            character.save()
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


