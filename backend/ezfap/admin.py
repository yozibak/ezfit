from django.contrib import admin

from .models import Weight, Food

class WeightAdmin(admin.ModelAdmin):
    pass
admin.site.register(Weight, WeightAdmin)


class FoodAdmin(admin.ModelAdmin):
    pass

admin.site.register(Food, FoodAdmin)