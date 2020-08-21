from django.urls import path
from .views import ListCreateEntries, ListCreateItems, RetrieveUpdateDestroyItem, EntryBulkCreateDelete
from rest_framework.urlpatterns import format_suffix_patterns

app_name = 'core'
urlpatterns = format_suffix_patterns([
    path('items', ListCreateItems.as_view()),
    path('items/<int:pk>', RetrieveUpdateDestroyItem.as_view()),
    path('entries/bulk', EntryBulkCreateDelete.as_view(), name='entries_bulk'),
    path('entries', ListCreateEntries.as_view()),
])
