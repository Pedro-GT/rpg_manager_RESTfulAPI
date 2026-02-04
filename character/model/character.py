from django.db import models
from .race import Race
from .region import Region
from .skill import Skill

class Character(models.Model):
    first_name = models.CharField(max_length=50, db_index=True)
    last_name = models.CharField(max_length=50)
    age = models.IntegerField()
    race = models.ForeignKey(Race, on_delete=models.SET_NULL, null=True, blank=True)
    skills = models.ManyToManyField(Skill)
    picture = models.ImageField(upload_to='characters/', blank=True)
    region = models.ForeignKey(Region, on_delete=models.SET_NULL, null=True, blank=True)
    strength = models.IntegerField()
    resistence = models.IntegerField()
    dexterity = models.IntegerField()
    intelligence = models.IntegerField()
    charisma = models.IntegerField()
    luck = models.IntegerField()
    magic = models.IntegerField()
    bio = models.TextField()
    


    def __str__(self):
        return ( 
            f"{self.first_name} {self.last_name} ({self.race.name}) -"
            f"Status: Strength: {self.strength}, Resistence: {self.resistence},"
            f"Dexterity: {self.dexterity}, Intelligence: {self.intelligence},"
            f"Charisma: {self.charisma}, Luck: {self.luck}, Magic: {self.magic}")