from django.http import HttpResponse
from django.template import loader
from django.core.serializers import serialize

from .models import Member
    
def index(request):
    all_members = Member.objects.all()
    template = loader.get_template("index.html")
    context = {"store":  serialize("json", all_members)}
    
    return HttpResponse(template.render(context, request))