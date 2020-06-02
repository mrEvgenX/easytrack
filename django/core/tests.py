from datetime import date
from django.test import TestCase, Client, RequestFactory
from django.contrib.auth.models import User
from django.urls import reverse
from .models import Folder, Item, Entry
from .serializers import FolderSerializer, ItemSerializer, EntrySerializer
from .views import ListCreateFolders


class SerializerTests(TestCase):

    def setUp(self):
        self.user = User.objects.create(username='user')
        self.folder = Folder.objects.create(owner=self.user, slug='papka', name='Папка')

    def test_serializer_folder(self):
        serializer = FolderSerializer(self.folder)
        self.assertEqual(serializer.data, {'slug': 'papka', 'name': 'Папка'})

        data = {'owner': self.user.pk, 'slug': 'gruppa', 'name': 'Группа'}
        serializer = FolderSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        created_folder = serializer.save()
        self.assertEqual(created_folder.owner, self.user)
        self.assertEqual(created_folder.slug, data['slug'])
        self.assertEqual(created_folder.name, data['name'])

    def test_serializer_item(self):
        item = Item.objects.create(folder=self.folder, name='Элемент1')
        serializer = ItemSerializer(item)
        self.assertEqual(serializer.data, {'id': item.id, 'folder': 'papka', 'name': 'Элемент1'})

        data = {'folder': 'papka', 'name': 'Элемент2'}
        serializer = ItemSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        created_element = serializer.save()
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
        self.user = User.objects.create(username='user@example.com')
        self.user.set_password('user')
        self.user.save()

    def test_list_folders(self):
        request = self.factory.get('/api/v1/folders')
        request.user = self.user
        response = ListCreateFolders.as_view()(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [])

    def test_create_folder(self):
        request = self.factory.post(
            '/api/v1/folders', data={'name': 'Папка'}, content_type='application/json'
        )
        request._dont_enforce_csrf_checks = True
        request.user = self.user
        response = ListCreateFolders.as_view()(request)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data, {'slug': 'papka', 'name': 'Папка'})

    def test_delete_folder(self):
        pass