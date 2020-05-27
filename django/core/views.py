from rest_framework.response import Response
from rest_framework import generics
from rest_framework import status
from .models import Folder, Item, Entry
from .serializers import FolderSerializer, ItemSerializer, EntrySerializer

from unidecode import unidecode
from django.utils.text import slugify


class ListCreateFolders(generics.ListCreateAPIView):
    queryset = Folder.objects.all()
    serializer_class = FolderSerializer

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
    queryset = Item.objects.all()
    serializer_class = ItemSerializer


class ListCreateEntries(generics.ListCreateAPIView):
    queryset = Entry.objects.all()
    serializer_class = EntrySerializer
