from django.views.generic import TemplateView
from django.core.serializers import serialize

from .models import Member
    
class ListView(TemplateView):
    template_name = "index.html"
    
    def get_context_data(self, **kwargs):
        kwargs["store"] = serialize("json", Member.objects.all())
        return super().get_context_data(**kwargs)

class EditView(TemplateView):
    template_name = "index.html"
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        kwargs["store"] = serialize("json", [Member.objects.get(pk=kwargs["member_pk"])])
        return context
    
class EmptyContextView(TemplateView):
    template_name = "index.html"