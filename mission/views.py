
from rest_framework import viewsets
from .model import Mission
from .serializer import MissionSerializer

class MissionViewSet(viewsets.ModelViewSet):
    queryset = Mission.objects.all()
    serializer_class = MissionSerializer