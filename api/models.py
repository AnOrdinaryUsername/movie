from django.db import models
import uuid

from django.contrib.auth.models import (
    AbstractBaseUser,
    PermissionsMixin,
    BaseUserManager,
)


class CustomUserManager(BaseUserManager):
    def create_user(self, email, username, password=None, **extra_fields):
        if not email:
            raise ValueError("User must have an email")
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=255, unique=True)
    username = models.CharField(max_length=255, unique=True)

    objects = CustomUserManager()

    USERNAME_FIELD = "username"

    def get_full_name(self):
        return self.username

    def get_short_name(self):
        return self.username

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

    def __str__(self):
        return self.username


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
    image_url = models.TextField(default='', null=True)