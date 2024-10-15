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
    
    @action(detail=False, methods=['get'], url_path='by-first-name')
    def get_by_first_name(self, request):
        first_name = request.query_params.get('first_name').capitalize()
        if not first_name:
            return Response({"error": "first_name query parameter is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        characters = Character.objects.filter(first_name=first_name)
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


