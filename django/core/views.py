from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.views import APIView
from .models import Folder, Item, Entry
from .serializers import FolderSerializer, ItemSerializer, EntrySerializer, EntryBulkSerializer

from unidecode import unidecode
from django.utils.text import slugify


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


class EntryBulkCreateDelete(APIView):

    def post(self, request):
        serializer = EntryBulkSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            for entry_to_add in serializer.validated_data['add']:
                if not Entry.objects.filter(
                        item=entry_to_add['item'],
                        timeBucket=entry_to_add['timeBucket']
                    ).exists():
                    Entry.objects.create(**entry_to_add)
            for entry in serializer.validated_data['remove']:
                Entry.objects.filter(
                    item=entry['item'],
                    timeBucket=entry['timeBucket']
                ).delete()
        else:
            return Response(serializer.errors, status=404)
        return Response()
