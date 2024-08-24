from django.db import models

class Race(models.Model):

    name = models.CharField(max_length=50)
    description = models.TextField(max_length=300)
    
    def __str__(self):
        return self.name