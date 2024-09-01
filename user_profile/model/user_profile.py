from django.db import models
from django.contrib.auth.models import User
from .log import Log
from character.model import Character




class User_Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    characters = models.ManyToManyField(Character, related_name='users')
    inventory = models.TextField(blank=True, null=True)
    logs = models.ManyToManyField(Log)

    def __str__(self):
        return self.user.username
