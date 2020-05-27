from django.db import models
from django.conf import settings


class Folder(models.Model):
    owner = models.ForeignKey(to=settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    slug = models.CharField(max_length=140, unique=True)
    name = models.CharField(max_length=140)

    def __str__(self):
        return '{} ({})'.format(self.name, self.owner.username)

    # TODO Включить потом, когда научимся десериализировать
    # class Meta:
    #     unique_together = (('owner', 'slug'),)


class Item(models.Model):
    folder = models.ForeignKey(to=Folder, on_delete=models.CASCADE)
    name = models.CharField(max_length=140)

    def __str__(self):
        return '{} ({}) / {}'.format(self.folder.name, self.folder.owner.username, self.name)

    class Meta:
        unique_together = (('folder', 'name'),)


class Entry(models.Model):
    timeBucket = models.DateField()
    item = models.ForeignKey(to=Item, on_delete=models.CASCADE)

    class Meta:
        unique_together = (('timeBucket', 'item'),)