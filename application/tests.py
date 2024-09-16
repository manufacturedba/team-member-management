from django.test import RequestFactory, TestCase

from .views import ListView, AddView
from .api import get_team_member, add_team_member
from .models import Member

class TestViews(TestCase):
    def test_template_for_list_view(self):
        request = RequestFactory().get("/")
        view = ListView()
        view.setup(request)

        template_name = view.get_template_names()
        self.assertIn("index.html", template_name)
        
    def test_store_is_loaded_into_list_view(self):
        request = RequestFactory().get("/")
        view = ListView()
        view.setup(request)

        context = view.get_context_data()
        self.assertIn("store", context)
        
    def test_template_for_add_view(self):
        request = RequestFactory().get("/")
        view = AddView()
        view.setup(request)

        template_name = view.get_template_names()
        self.assertIn("index.html", template_name)
        
class TestAPI(TestCase):
    @classmethod
    def setUpTestData(cls):
        Member.objects.create(first_name="J", last_name="D", email="jd@is.com", phone_number="5554567890", role="admin")
        
    def test_get_team_member(self):
        response = get_team_member()
        
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"J", response.content)
        self.assertIn(b"D", response.content)
        self.assertIn(b"jd@is.com", response.content)
        self.assertIn(b"5554567890", response.content)
        self.assertIn(b"admin", response.content)
    
    def test_add_team_member(self):
        request = RequestFactory().put("/", 
                                       b'{"first_name": "JD"}')
        
        response = add_team_member(request)
        
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"J", response.content)