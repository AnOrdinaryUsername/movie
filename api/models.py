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
    
    def create_superuser(self, username, email, password=None, **extra_fields):
        user = self.create_user(username, email, password=password, **extra_fields)
        user.is_active = True
        user.is_staff = True
        user.is_admin = True
        user.save(using=self._db)
        return user
    

    
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
    image_url = models.TextField(default='')

    #roles = models.
    #movie_appreances = models.

    def __str__(self):
        return self.name

class Actor(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    person = models.OneToOneField(Person, on_delete=models.CASCADE)

    def __str__(self):
        return self.person.name
    
# Writer Model
class Writer(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable = False)
    writer_credit = models.OneToOneField(Person, on_delete=models.CASCADE)

    def __str__(self):
        return self.writer_credit.name


# Director Model
class Director(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable = False)
    director_credit = models.OneToOneField(Person, on_delete=models.CASCADE)

    def __str__(self):
        return self.director_credit.name
    

# Create your models here.
class MovieInfo(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    genres = models.ManyToManyField(Genre)

    actors_list = models.ManyToManyField(Actor)
    writers_list = models.ManyToManyField(Writer)
    directors_list = models.ManyToManyField(Director)

    media_title = models.CharField(max_length=100)
    media_release_date = models.DateField()
    media_length = models.IntegerField()
    media_description = models.TextField()
    image_url = models.TextField(default='')

    def __str__(self):
        return self.media_title
    

class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=255, unique=True)
    username = models.CharField(max_length=255, unique=True)
    favorites = models.ManyToManyField(MovieInfo, blank=True, related_name="favorites")
    watchlist = models.ManyToManyField(MovieInfo, blank=True, related_name="watchlist")
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    objects = CustomUserManager()
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

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

    movie_information = models.OneToOneField(MovieInfo, on_delete=models.CASCADE)

    def __str__(self):
        return self.movie_information.media_title
    

# Review Model (made because serializer.py had reviews)
class Review(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    movie = models.ForeignKey(MovieInfo, on_delete=models.CASCADE)
    content = models.TextField()

    def __str__(self):
        return self.content
    
class Rating(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    movie = models.ManyToManyField(MovieInfo)
    rating = models.SmallIntegerField(null=True, blank=True)