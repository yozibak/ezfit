from django.contrib import admin

from .models import Weight

class WeightAdmin(admin.ModelAdmin):
    pass
admin.site.register(Weight, WeightAdmin)