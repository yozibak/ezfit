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