from django.http import HttpResponse
from django.core.serializers import serialize

import json

from .models import Member

def getTeamMembers():
    try:
        return HttpResponse(serialize("json", Member.objects.all()), status=200)
    except Exception as e:
        print(e)
        return HttpResponse(status=500)
    
def addTeamMember(request):
    try :
        # Blanket assume serialization and saving are client errors
        deserialized = json.loads(request.body)
        member = Member(**deserialized)
        member.save()
        try:
            return HttpResponse(serialize("json", [member]), status=200)
        except Exception as e:
            print(e)
            return HttpResponse(status=500)
    except Exception as e:
        print(e)
        return HttpResponse("Bad request", status=400)
    
    
def handler(request):
    if request.method == "GET":
        return getTeamMembers()
    elif request.method == "PUT":
        return addTeamMember(request)
    else:
        return HttpResponse(status=501)