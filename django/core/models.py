from django.db import models
from django.conf import settings


class Folder(models.Model):
    owner = models.ForeignKey(to=settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    slug = models.CharField(max_length=140, unique=True, blank=False)
    name = models.CharField(max_length=140, blank=False)

    def __str__(self):
        return '{} ({})'.format(self.name, self.owner.username)

    # TODO Включить потом, когда научимся десериализировать
    # class Meta:
    #     unique_together = (('owner', 'slug'),)


class Item(models.Model):
    owner = models.ForeignKey(to=settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=False)
    folder = models.ForeignKey(to=Folder, on_delete=models.SET_NULL, null=True, blank=True)
    name = models.CharField(max_length=140)

    def __str__(self):
        if self.folder:
            return '{}: {} / {}'.format(self.owner.username, self.folder.name, self.name)
        return '{}: {}'.format(self.owner.username, self.name)

    class Meta:
        unique_together = (('owner', 'name'),)


class Entry(models.Model):
    timeBucket = models.DateField()
    item = models.ForeignKey(to=Item, on_delete=models.CASCADE)

    class Meta:
        unique_together = (('timeBucket', 'item'),)

# TODO data migration
# >>> for item in Item.objects.all():
# ...   item.owner = item.folder.owner
# ...   item.save()