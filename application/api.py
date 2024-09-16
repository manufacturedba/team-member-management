from django.http import HttpResponse
from django.core.serializers import serialize

import json

from .models import Member

def get_team_members():
    try:
        return HttpResponse(serialize("json", Member.objects.all()), status=200)
    except Exception as e:
        print(e)
        return HttpResponse(status=500)
    
def get_team_member_by_id(member_pk):
    try:
        return HttpResponse(serialize("json", [Member.objects.get(pk=member_pk)]), status=200)
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
    
    
def collection_handler(request):
    if request.method == "GET":
        return get_team_members()
    elif request.method == "PUT":
        return add_team_member(request)
    else:
        return HttpResponse("Not implemented", status=501)

def instance_handler(request, member_pk):
    if request.method == "GET":
        return get_team_member_by_id(member_pk)
    else:
        return HttpResponse("Not implemented", status=501)