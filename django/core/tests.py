from datetime import date, datetime, timedelta
from django.test import TestCase, Client, RequestFactory
from django.contrib.auth.models import User
from django.urls import reverse
from .models import Folder, Item, Entry
from .serializers import FolderSerializer, ItemSerializer, EntrySerializer
from .views import ListCreateFolders, DestroyFolder, ListCreateItems, RetrieveUpdateDestroyItem, EntryBulkCreateDelete


class SerializerTests(TestCase):

    def setUp(self):
        self.user = User.objects.create(username='user')
        self.folder = Folder.objects.create(owner=self.user, slug='papka', name='Папка')

    def test_serialize_folder(self):
        serializer = FolderSerializer(self.folder)
        self.assertEqual(serializer.data, {'slug': 'papka', 'name': 'Папка'})
    
    def test_deserialize_folder(self):
        data = {'owner': self.user.pk, 'slug': 'gruppa', 'name': 'Группа'}
        serializer = FolderSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        created_folder = serializer.save()
        self.assertEqual(created_folder.owner, self.user)
        self.assertEqual(created_folder.slug, data['slug'])
        self.assertEqual(created_folder.name, data['name'])

    def test_serialize_item(self):
        item = Item.objects.create(folder=self.folder, name='Элемент1')
        serializer = ItemSerializer(item)
        self.assertEqual(serializer.data, {'id': item.id, 'folder': 'papka', 'name': 'Элемент1'})

    def test_deserialize_item_owner_required_error(self):
        data = {'folder': 'papka', 'name': 'Элемент2'}
        serializer = ItemSerializer(data=data)
        self.assertFalse(serializer.is_valid(), serializer.errors)
        self.assertIn('owner', serializer.errors)

    def test_deserialize_item(self):
        data = {'owner': self.user.pk, 'folder': 'papka', 'name': 'Элемент2'}
        serializer = ItemSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        created_element = serializer.save()
        self.assertEqual(created_element.owner, self.user)
        self.assertEqual(created_element.folder, self.folder)
        self.assertEqual(created_element.name, data['name'])

    def test_serializer_entry(self):
        item = Item.objects.create(folder=self.folder, name='Элемент')
        entry = Entry.objects.create(timeBucket=date(2020, 1, 1), item=item)
        serializer = EntrySerializer(entry)
        self.assertEqual(serializer.data, {'timeBucket': '2020-01-01', 'item': item.id})


class CoreFoldersTests(TestCase):
    
    def setUp(self):
        self.factory = RequestFactory()
        self.user1 = User.objects.create(username='user1@example.com')
        self.user2 = User.objects.create(username='user2@example.com')

    def test_list_folders(self):
        request = self.factory.get('/api/v1/folders')
        request.user = self.user1
        response = ListCreateFolders.as_view()(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [])  # TODO

    def test_create_folder(self):
        request = self.factory.post(
            '/api/v1/folders', data={'name': 'Папка'}, content_type='application/json'
        )
        request._dont_enforce_csrf_checks = True
        request.user = self.user1
        response = ListCreateFolders.as_view()(request)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data, {'slug': 'papka', 'name': 'Папка'})

    def test_delete_folder(self):
        Folder.objects.create(owner=self.user1, slug='folder1', name='Folder1')
        Folder.objects.create(owner=self.user2, slug='folder2', name='Folder2')
        request = self.factory.delete(
            '/api/v1/folders/folder', content_type='application/json'
        )
        request._dont_enforce_csrf_checks = True
        request.user = self.user1
        response = DestroyFolder.as_view()(request, slug='folder1')
        self.assertEqual(response.status_code, 204, response.data)
        self.assertEqual(response.data, None)
        self.assertEqual(Folder.objects.count(), 1)

    def test_delete_someones_other_folder(self):
        Folder.objects.create(owner=self.user1, slug='folder1', name='Folder1')
        Folder.objects.create(owner=self.user2, slug='folder2', name='Folder2')
        request = self.factory.delete(
            '/api/v1/folders/folder', content_type='application/json'
        )
        request._dont_enforce_csrf_checks = True
        request.user = self.user2
        response = DestroyFolder.as_view()(request, slug='folder1')
        self.assertEqual(response.status_code, 404, response.data)
        self.assertEqual(Folder.objects.count(), 2)


class CoreItemsTests(TestCase):

    def setUp(self):
        self.factory = RequestFactory()
        self.user1 = User.objects.create(username='user1@example.com')
        self.user2 = User.objects.create(username='user2@example.com')

    def test_list_items(self):
        items_data = [
            Item.objects.create(owner=self.user1, name='Item1'),
            Item.objects.create(owner=self.user2, name='Item2'),
        ]
        request = self.factory.get('/api/v1/items')
        request.user = self.user1
        response = ListCreateItems.as_view()(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [{'id': 1, 'folder': None, 'name': 'Item1'}])

    def test_create_item_without_folder(self):
        request = self.factory.post(
            '/api/v1/items', data={'name': 'Без папки'}, content_type='application/json'
        )
        request._dont_enforce_csrf_checks = True
        request.user = self.user1
        response = ListCreateItems.as_view()(request)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data, {'id': 1, 'folder': None, 'name': 'Без папки'})

    def test_create_item_in_folder(self):
        Folder.objects.create(owner=self.user1, slug='folder', name='Folder')
        request = self.factory.post(
            '/api/v1/items', data={'folder': 'folder', 'name': 'Item1'}, content_type='application/json'
        )
        request._dont_enforce_csrf_checks = True
        request.user = self.user1
        response = ListCreateItems.as_view()(request)
        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(response.data, {'id': 1, 'folder': 'folder', 'name': 'Item1'})


    def test_change_item_folder(self):
        item = Item.objects.create(owner=self.user1, name='Item1')
        folder = Folder.objects.create(owner=self.user1, slug='folder', name='Folder')
        request = self.factory.patch(
            '/api/v1/items/1', data={'folder': folder.slug}, content_type='application/json'
        )
        request._dont_enforce_csrf_checks = True
        request.user = self.user1
        response = RetrieveUpdateDestroyItem.as_view()(request, pk=item.pk)
        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(response.data, {'id': 1, 'folder': 'folder', 'name': 'Item1'})

    def test_delete_item(self):
        item = Item.objects.create(owner=self.user1, name='Item1')
        request = self.factory.delete(
            '/api/v1/items/1', content_type='application/json'
        )
        request._dont_enforce_csrf_checks = True
        request.user = self.user1
        response = RetrieveUpdateDestroyItem.as_view()(request, pk=item.pk)
        self.assertEqual(response.status_code, 204, response.data)
        self.assertIsNone(response.data)

    # TODO проверить, что создание прямым запросом от имени другого пользователя не пройдет


class BulkEntryTests(TestCase):

    def setUp(self):
        self.factory = RequestFactory()
        self.user1 = User.objects.create(username='user1@example.com')
        self.user2 = User.objects.create(username='user2@example.com')
        self.item1 = Item.objects.create(owner=self.user1, name='Item')
        self.item2 = Item.objects.create(owner=self.user2, name='Item')
        self.entries = [
            Entry.objects.create(
                timeBucket=(datetime(2020, 1, 1) + timedelta(days=i)).date(),
                item=self.item1
            )
            for i in range(3)
        ] + [
            Entry.objects.create(
                timeBucket=(datetime(2020, 1, 1) + timedelta(days=i)).date(),
                item=self.item2
            )
            for i in range(3)
        ]


    def test_bulk_update(self):
        request = self.factory.post(
            '/api/v1/entries/bulk', content_type='application/json',
            data={
                'add': [
                    {'item': self.item1.id, 'timeBucket': '2020-01-03'},
                    {'item': self.item1.id, 'timeBucket': '2020-01-04'},
                    {'item': self.item1.id, 'timeBucket': '2020-01-05'}
                ],
                'remove': [
                    {'item': self.item1.id, 'timeBucket': '2020-01-02'},
                    {'item': self.item1.id, 'timeBucket': '2020-01-03'},
                    {'item': self.item1.id, 'timeBucket': '2020-01-06'}
                ]
            }
        )
        request._dont_enforce_csrf_checks = True
        request.user = self.user1
        response = EntryBulkCreateDelete.as_view()(request)
        self.assertEqual(response.status_code, 200, response.data)
        self.assertIsNone(response.data)
        self.assertEqual(Entry.objects.filter(item=self.item1).count(), 3)

    def test_bulk_update_with_access_violation(self):
        request = self.factory.post(
            '/api/v1/entries/bulk', content_type='application/json',
            data={
                'add': [
                    {'item': self.item1.id, 'timeBucket': '2020-01-03'},
                    {'item': self.item2.id, 'timeBucket': '2020-01-04'},
                ],
                'remove': [
                    {'item': self.item1.id, 'timeBucket': '2020-01-02'},
                    {'item': self.item2.id, 'timeBucket': '2020-01-03'},
                ]
            }
        )
        request._dont_enforce_csrf_checks = True
        request.user = self.user1
        response = EntryBulkCreateDelete.as_view()(request)
        self.assertEqual(response.status_code, 404, response.data)
        self.assertEqual(response.data['add'][0], "You don't have items you pass")
        self.assertEqual(response.data['remove'][0], "You don't have items you pass")
