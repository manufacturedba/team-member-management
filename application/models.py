from django.db import models

"""
Limits here should not be reused for client enforcement

"""
class Member(models.Model):
    first_name = models.CharField(max_length=3000)
    last_name = models.CharField(max_length=3000)
    email = models.EmailField()
    phone_number = models.CharField(max_length=3000)
    profile_image = models.CharField(max_length=3000) # TODO: Switch to ImageField