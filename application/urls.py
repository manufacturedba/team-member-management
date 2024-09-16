from django.urls import path

from .views import EmptyContextView, ListView, EditView
from .api import collection_handler, instance_handler

urlpatterns = [
    path("", ListView.as_view()),
    path("add", EmptyContextView.as_view()),
    path("edit/<int:member_pk>", EditView.as_view()),
    path("api/members/<int:member_pk>/", instance_handler),
    path("api/members/", collection_handler),
]