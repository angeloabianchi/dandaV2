from django.db import models

# Create your models here.
class Projects(models.Model):
    name = models.CharField(max_length=200)
    display_name = models.CharField(max_length=200, blank=True)
    video = models.CharField(max_length=300)
    image = models.CharField(max_length=300)
    description = models.CharField(max_length=3000, blank=True)
    category = models.CharField(max_length=200)
    client = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return f"Project: {self.name}"


class ProjectImages(models.Model):
    project = models.ForeignKey(Projects, on_delete=models.CASCADE)
    url = models.CharField(max_length=300)
    alt_text = models.CharField(max_length=200, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image: {self.url}"