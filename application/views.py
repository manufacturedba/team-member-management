from django.views.generic import TemplateView
from django.template import loader
from django.core.serializers import serialize

from .models import Member
    
class ListView(TemplateView):
    template_name = "index.html"
    
    def get_context_data(self, **kwargs):
        kwargs["store"] = serialize("json", Member.objects.all())
        return super().get_context_data(**kwargs)
    
class AddView(TemplateView):
    template_name = "index.html"