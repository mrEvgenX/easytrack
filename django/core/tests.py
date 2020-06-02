from datetime import date
from django.test import TestCase, Client, RequestFactory
from django.contrib.auth.models import User
from django.urls import reverse
from .models import Folder, Item, Entry
from .serializers import FolderSerializer, ItemSerializer, EntrySerializer
from .views import ListCreateFolders, ListCreateItems


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


class AuthTests(TestCase):
    
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create(username='user@example.com')
        self.user.set_password('user')
        self.user.save()

    def test_register(self):
        response = self.client.post(
            reverse('api.auth:register'), 
            {'email': 'user1@example.com', 'password': 'user'}
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json(), {'email': 'user1@example.com'})

    def test_login(self):
        response = self.client.post(
            reverse('api.auth:obtain_token'), 
            {'username': 'user@example.com', 'password': 'user'}
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertNotEqual(data.get('refresh', ''), '')
        self.assertNotEqual(data.get('access', ''), '')


class CoreTests(TestCase):
    
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
        pass

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

    def test_create_item(self):
        Folder.objects.create(owner=self.user1, slug='folder', name='Folder')
        request = self.factory.post(
            '/api/v1/items', data={'folder': 'folder', 'name': 'Item1'}, content_type='application/json'
        )
        request._dont_enforce_csrf_checks = True
        request.user = self.user1
        response = ListCreateItems.as_view()(request)
        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(response.data, {'id': 1, 'folder': 'folder', 'name': 'Item1'})
