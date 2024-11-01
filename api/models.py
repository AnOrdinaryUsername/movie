from django.db import models
import uuid

class MoviePage(models.Model):
    # wiki_entries = 
    # wiki_news = 
    wiki_rating = models.SmallIntegerField()
    box_office_total = models.IntegerField()
    entry_views = models.IntegerField()
    release_date = models.DateField()
    
class Genre(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=80, unique=True)

    def __str__(self):
        return self.name
    
class Person(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    birthday = models.DateField()
    name = models.CharField(max_length=80)
    description = models.TextField()

class Actor(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    person = models.OneToOneField(Person, on_delete=models.CASCADE)

# Create your models here.
class MovieInfo(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    genre = models.ManyToManyField(Genre)
    actors_list = models.ManyToManyField(Actor)
    # writers_list = 
    # directors_list =
    media_title = models.CharField(max_length=100)
    media_length = models.IntegerField()
    media_description = models.TextField()