from django.contrib.auth import get_user_model
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
    owner = serializers.PrimaryKeyRelatedField(allow_null=False, queryset=get_user_model().objects.all(), required=True, write_only=True)
    folder = serializers.SlugRelatedField(slug_field='slug', queryset=Folder.objects.all(), required=False, allow_null=True)

    class Meta:
        model = Item
        fields = ['id', 'owner', 'folder', 'name']
        read_only_fields = ['id']
        extra_kwargs = {
            'owner': {'write_only': True},
        }


class EntrySerializer(serializers.ModelSerializer):
    item = serializers.PrimaryKeyRelatedField(queryset=Item.objects.all())

    class Meta:
        model = Entry
        fields = ['timeBucket', 'item']