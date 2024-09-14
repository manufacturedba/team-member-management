from django.http import HttpResponse
from django.shortcuts import redirect
import json

from .models import Member

def addTeamMember(request):
    try :
        deserialized = json.loads(request.body)
        member = Member(**deserialized)
        member.save()
        return HttpResponse("Created", status=200)
    except Exception as e:
        print(e)
        return HttpResponse("Bad request", status=400)