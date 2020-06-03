from rest_framework.response import Response
from rest_framework import generics, status
from .models import Folder, Item, Entry
from .serializers import FolderSerializer, ItemSerializer, EntrySerializer

from unidecode import unidecode
from django.utils.text import slugify


class ListCreateFolders(generics.ListCreateAPIView):
    serializer_class = FolderSerializer

    def get_queryset(self, *args, **kwargs):
        return Folder.objects.filter(owner=self.request.user.pk)

    def get_serializer(self, *args, **kwargs):
        data = kwargs.get('data')
        if data:
            data.update({
                'slug': slugify(unidecode(data['name'])),
                'owner': self.request.user.pk
            })
            kwargs['data'] = data
        return super().get_serializer(*args, **kwargs)


class ListCreateItems(generics.ListCreateAPIView):
    serializer_class = ItemSerializer

    def get_queryset(self, *args, **kwargs):
        return Item.objects.filter(owner=self.request.user.pk)

    def get_serializer(self, *args, **kwargs):
        data = kwargs.get('data')
        if data:
            data.update({
                'owner': self.request.user.pk
            })
            kwargs['data'] = data
        return super().get_serializer(*args, **kwargs)


class RetrieveUpdateDestroyItem(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ItemSerializer

    def get_queryset(self, *args, **kwargs):
        return Item.objects.filter(owner=self.request.user.pk)
    
    def get_serializer(self, *args, **kwargs):
        data = kwargs.get('data')
        if data:
            data.update({
                'owner': self.request.user.pk
            })
            kwargs['data'] = data
        return super().get_serializer(*args, **kwargs)


class ListCreateEntries(generics.ListCreateAPIView):
    serializer_class = EntrySerializer

    def get_queryset(self, *args, **kwargs):
        return Entry.objects.filter(item__owner=self.request.user.pk)
