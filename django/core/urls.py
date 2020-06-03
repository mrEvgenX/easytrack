from django.urls import path
from .views import ListCreateFolders, DestroyFolder, ListCreateEntries, ListCreateItems, RetrieveUpdateDestroyItem
from rest_framework.urlpatterns import format_suffix_patterns

app_name = 'core'
urlpatterns = format_suffix_patterns([
    path('folders', ListCreateFolders.as_view(), name='folders'),
    path('folders/<str:slug>', DestroyFolder.as_view(), name='folders'),
    path('items', ListCreateItems.as_view()),
    path('items/<int:pk>', RetrieveUpdateDestroyItem.as_view()),
    path('entries', ListCreateEntries.as_view()),
])
