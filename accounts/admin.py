from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User
from logistics.models import Favorite

class FavoritesInLine(admin.TabularInline):
    model = Favorite
    extra = 0
    verbose_name_plural = "Favorites"

class MyUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        # ('Address Details', {'fields': ['address_street', 'address_line_2', 'address_city', 'address_region', 'address_country', 'address_zipcode']}),
        ('Info', {'fields': ['gender']}),
        ('Contact Info', {'fields': ['contact']}),
    )

    list_display = ('username', 'first_name', 'last_name', 'email', 'contact')
    list_display_links = ('username',)
    list_filter = ('is_active', 'is_staff', 'is_superuser')
    list_per_page = 25
    search_fields = ('username', 'first_name', 'last_name')

    inlines = [FavoritesInLine]

admin.site.register(User, MyUserAdmin)