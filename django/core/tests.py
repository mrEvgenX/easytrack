from datetime import date
from django.test import TestCase
from django.contrib.auth.models import User
from .models import Folder, Item, Entry
from .serializers import FolderSerializer, ItemSerializer, EntrySerializer


class SerializerTests(TestCase):

    def test_serializer_folder(self):
        user = User.objects.create(username='user')
        folder = Folder.objects.create(owner=user, slug='papka', name='Папка')
        serializer = FolderSerializer(folder)
        self.assertEqual(serializer.data, {'slug': 'papka', 'name': 'Папка'})

        data = {'owner': user.pk, 'slug': 'gruppa', 'name': 'Группа'}
        serializer = FolderSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.validated_data, {'owner': user, 'slug': 'gruppa', 'name': 'Группа'})
        folder = serializer.save()
        print('!!!!!!', folder)

    def test_serializer_item(self):
        user = User.objects.create(username='user')
        folder = Folder.objects.create(owner=user, slug='papka', name='Папка')
        item = Item.objects.create(folder=folder, name='Элемент1')
        serializer = ItemSerializer(item)
        self.assertEqual(serializer.data, {'id': item.id, 'folder': 'papka', 'name': 'Элемент1'})

        data = {'folder': 'papka', 'name': 'Элемент2'}
        serializer = ItemSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        self.assertEqual(serializer.validated_data, {'folder': folder, 'name': 'Элемент2'})

    def test_serializer_entry(self):
        user = User.objects.create(username='user')
        folder = Folder.objects.create(owner=user, slug='papka', name='Папка')
        item = Item.objects.create(folder=folder, name='Элемент')
        entry = Entry.objects.create(timeBucket=date(2020, 1, 1), item=item)
        serializer = EntrySerializer(entry)
        self.assertEqual(serializer.data, {'timeBucket': '2020-01-01', 'item': item.id})