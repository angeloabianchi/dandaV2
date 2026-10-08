from django.shortcuts import render

from .models import Projects, ProjectImages

# Create your views here.
def home(request):
    return render(request, 'home/home.html', {
        'projects': Projects.objects.all()
    })

def about(request):
    return render(request, 'about/about.html')

def contact(request):
    return render(request, 'contact/contact.html')

def project(request, proj_name):
    project = Projects.objects.filter(name=proj_name.upper()).first()
    images = ProjectImages.objects.filter(project=project)
    return render(request, 'project/project.html', {
        'project': project,
        'images': images
    })