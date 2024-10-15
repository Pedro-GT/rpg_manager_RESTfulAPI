from django.db import models
from character.model import Region
from monster.model import Monster

class Mission(models.Model):

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


    task = models.CharField(max_length=100)
    reward = models.CharField(max_length=100)
    details = models.TextField()
    region = models.ForeignKey(Region, on_delete=models.SET_NULL, null=True, blank=True)
    duration = models.CharField(max_length=100)  # Changed to DurationField
    deadline = models.CharField(max_length=100)  # Changed to DurationField
    client = models.CharField(max_length=100)
    notes = models.TextField()
    rank = models.CharField(max_length=7, choices=RANK_CHOICES, default='Unknown', blank=True, null=True)
    monster = models.ForeignKey(Monster, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.task