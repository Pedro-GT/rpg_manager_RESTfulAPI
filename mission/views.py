from rest_framework import viewsets
from django.views.generic import TemplateView
from .model import Mission
from .serializer import MissionSerializer


class MissionViewSet(viewsets.ModelViewSet):
    queryset = Mission.objects.all()
    serializer_class = MissionSerializer


class MissionPageView(TemplateView):
    template_name = 'mission/missions_page.html'
    extra_context = {'active_page': 'missions'}
