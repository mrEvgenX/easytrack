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
            # 'folder': {'required': False}
            # 'owner': {'required': True}
        }


class EntrySerializer(serializers.ModelSerializer):
    item = serializers.PrimaryKeyRelatedField(queryset=Item.objects.all())

    class Meta:
        model = Entry
        fields = ['timeBucket', 'item']


class EntryBulkSerializer(serializers.Serializer):
    add = EntrySerializer(many=True, validators=[])
    remove = EntrySerializer(many=True, validators=[])

    def action_violates_access(self, value):
        return any([
            entry['item'].owner != self.context['request'].user
            for entry in value
        ])

    def validate_add(self, value):
        if self.action_violates_access(value):
            raise serializers.ValidationError('You don\'t have items you pass')
        return value

    def validate_remove(self, value):
        if self.action_violates_access(value):
            raise serializers.ValidationError('You don\'t have items you pass')
        return value
