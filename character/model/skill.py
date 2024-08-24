from django.db import models

class Skill(models.Model):


    name = models.CharField(max_length=100)
    rank = models.CharField(max_length=50)
    type = models.CharField(max_length=50)
    element = models.CharField(max_length=50)
    description = models.TextField()

    def __str__(self):
        return f"{self.name}: ({self.description})"
    
