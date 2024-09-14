from django.shortcuts import render
from rest_framework import viewsets
from .model import Monster
from .serializer import MonsterSerializer

class MonsterViewSet(viewsets.ModelViewSet):
    queryset = Monster.objects.all()
    serializer_class = MonsterSerializer