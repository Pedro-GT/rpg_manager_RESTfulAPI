from django.db import models
from character.model import Region

class Monster(models.Model):
    RANK_CHOICES = [
        ('S', 'S'),
        ('A', 'A'),
        ('B', 'B'),
        ('C', 'C'),
        ('D', 'D'),
        ('E', 'E'),
        ('F', 'F'),
        ('Unknown', 'Unknown'),
    ]

    name = models.CharField(max_length=100)
    type = models.CharField(max_length=100, blank=True, null=True)
    region = models.ForeignKey(Region, on_delete=models.SET_NULL, null=True, blank=True)
    rank = models.CharField(max_length=7, choices=RANK_CHOICES, default='Unknown', blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    picture = models.ImageField(upload_to='media/', blank=True, null=True)

    def __str__(self):
        return self.name