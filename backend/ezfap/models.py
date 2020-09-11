from django.db import models
from django.contrib.auth import get_user_model

class Weight(models.Model):
    date = models.DateField(auto_now_add=True)
    kg = models.FloatField()
    user = models.ForeignKey(
        get_user_model(),
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    def __str__(self):
        return str(self.date)

class Food(models.Model):
    menu = models.CharField(max_length=30)
    date = models.DateField(auto_now_add=True)
    protein = models.FloatField(null=True, blank=True)
    fat = models.FloatField(null=True, blank=True)
    carbon = models.FloatField(null=True, blank=True)
    fiber = models.FloatField(null=True, blank=True)
    user = models.ForeignKey(
        get_user_model(),
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    def __str__(self):
        return str(self.date) + self.menu