from rest_framework import viewsets
from django.views.generic import TemplateView
from .model import Monster
from .serializer import MonsterSerializer


class MonsterViewSet(viewsets.ModelViewSet):
    queryset = Monster.objects.all()
    serializer_class = MonsterSerializer


class MonsterPageView(TemplateView):
    template_name = 'monster/monsters_page.html'
    extra_context = {'active_page': 'monsters'}
