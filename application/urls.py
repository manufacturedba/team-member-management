from django.urls import re_path, path, include

from .views import AddView, ListView
from .api import handler

urlpatterns = [
    path("", ListView.as_view()),
    path("api/members", handler),
    re_path(r"^(?P<slug>\w+)/$", AddView.as_view()),
]