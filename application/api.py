from django.http import HttpResponse
from django.core.serializers import serialize

import json

from .models import Member

def get_team_member():
    try:
        return HttpResponse(serialize("json", Member.objects.all()), status=200)
    except Exception as e:
        print(e)
        return HttpResponse(status=500)
    
def add_team_member(request):
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
        return get_team_member()
    elif request.method == "PUT":
        return add_team_member(request)
    else:
        return HttpResponse("Not implemented", status=501)