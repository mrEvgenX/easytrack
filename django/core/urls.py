from django.urls import path
from .views import ListCreateFolders, ListCreateItems, ListCreateEntries
from rest_framework.urlpatterns import format_suffix_patterns

app_name = 'core'
urlpatterns = format_suffix_patterns([
    path('folders', ListCreateFolders.as_view()),
    path('items', ListCreateItems.as_view()),
    path('entries', ListCreateEntries.as_view()),
])
