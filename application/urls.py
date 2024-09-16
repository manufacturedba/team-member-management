from django.urls import re_path, path, include

from .views import EmptyContextView, ListView, EditView
from .api import handler

urlpatterns = [
    path("", ListView.as_view()),
    path("add", EmptyContextView.as_view()),
    path("edit/<int:member_pk>", EditView.as_view()),
    path("api/members", handler),
]