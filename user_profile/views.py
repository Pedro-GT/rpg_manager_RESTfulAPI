from django.views.generic import TemplateView
from rest_framework import viewsets
from .model import Log, User_Profile
from .serializer import LogSerializer, UserProfileSerializer


class LogViewSet(viewsets.ModelViewSet):
    queryset = Log.objects.all()
    serializer_class = LogSerializer

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = User_Profile.objects.all()
    serializer_class = UserProfileSerializer


class ProfilePageView(TemplateView):
    template_name = 'user_profile/profile_page.html'
    extra_context = {'active_page': 'profile'}
