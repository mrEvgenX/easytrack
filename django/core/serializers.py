from rest_framework import serializers
from .models import Folder, Item, Entry


class FolderSerializer(serializers.ModelSerializer):

    class Meta:
        model = Folder
        fields = ['owner', 'slug', 'name']
        extra_kwargs = {
            'owner': {'write_only': True},
        }


class ItemSerializer(serializers.ModelSerializer):
    folder = serializers.SlugRelatedField(slug_field='slug', queryset=Folder.objects.all())

    class Meta:
        model = Item
        fields = ['id', 'folder', 'name']
        read_only_fields = ['id']


class EntrySerializer(serializers.ModelSerializer):
    item = serializers.PrimaryKeyRelatedField(queryset=Item.objects.all())

    class Meta:
        model = Entry
        fields = ['timeBucket', 'item']