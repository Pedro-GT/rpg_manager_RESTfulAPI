from django.db import models

class Status(models.Model):


    strength = models.IntegerField()
    resistence = models.IntegerField()
    dexterity  = models.IntegerField()
    intelligence  = models.IntegerField()
    charisma = models.IntegerField()
    luck = models.IntegerField()
    magic = models.IntegerField() 

    def __str__(self):
        return (
            f"Status: Strength: {self.strength}, Resistence: {self.resistence}, "
            f"Dexterity: {self.dexterity}, Intelligence: {self.intelligence}, "
            f"Charisma: {self.charisma}, Luck: {self.luck}, "
            f"Magic: {self.magic}"
        )
    
