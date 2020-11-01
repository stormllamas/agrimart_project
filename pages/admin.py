from django.contrib import admin
from .models import Article, Event, Service, Contact

#admin
from django.contrib.admin.models import LogEntry

class LogEntryAdmin(admin.ModelAdmin):
  readonly_fields = ('content_type',
    'user',
    'action_time',
    'object_id',
    'object_repr',
    'action_flag',
    'change_message'
  )

  def has_delete_permission(self, request, obj=None):
    return False

  def get_actions(self, request):
    actions = super(LogEntryAdmin, self).get_actions(request)
    # del actions['delete_selected']
    return actions

admin.site.register(LogEntry, LogEntryAdmin)

class ContactAdmin(admin.ModelAdmin):
  list_display = ('created_by', 'name', 'email', 'phone', 'subject', 'contact_date')
  list_display_links = ('name',)
  list_per_page = 50
  search_fields = ('name', 'subject')

admin.site.register(Contact, ContactAdmin)

class ArticleAdmin(admin.ModelAdmin):
  list_display = ('title', 'views', 'date_published', 'is_published', 'highlight', 'link')
  list_display_links = ('title',)
  list_editable = ('is_published', 'highlight')
  list_filter = ('date_published',)
  list_per_page = 25
  search_fields = ('title', 'summary')

admin.site.register(Article, ArticleAdmin)

class EventAdmin(admin.ModelAdmin):
  list_display = ('title', 'views', 'date', 'is_published')
  list_display_links = ('title',)
  list_editable = ('date', 'is_published')
  list_filter = ('date',)
  list_per_page = 25
  search_fields = ('title', 'summary')

admin.site.register(Event, EventAdmin)

class ServiceAdmin(admin.ModelAdmin):
  list_display = ('title', 'views', 'is_published', 'icon')
  list_display_links = ('title',)
  list_editable = ('is_published', 'icon')
  list_per_page = 25
  search_fields = ('title', 'summary')

admin.site.register(Service, ServiceAdmin)