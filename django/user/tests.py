from django.test import TestCase, Client
from django.contrib.auth.models import User
from django.urls import reverse


class AuthTests(TestCase):
    
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create(username='user@example.com')
        self.user.set_password('user')
        self.user.save()

    def test_register(self):
        response = self.client.post(
            reverse('api.auth:register'), 
            {'email': 'UsEr1@Example.com', 'password': 'user'}
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json(), {'email': 'user1@example.com'})

    def test_login(self):
        response = self.client.post(
            reverse('api.auth:obtain_token'),
            {'username': 'user@example.com', 'password': 'user'},
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertNotEqual(data.get('refresh', ''), '')
        self.assertNotEqual(data.get('access', ''), '')