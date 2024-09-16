from django.test import RequestFactory, TestCase, Client

from .views import ListView, EmptyContextView, EditView
from .api import get_team_members, add_team_member, delete_team_member_by_id, update_team_member_by_id

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
        
    def test_template_for_empty_context_view(self):
        request = RequestFactory().get("/")
        view = EmptyContextView()
        view.setup(request)

        template_name = view.get_template_names()
        self.assertIn("index.html", template_name)
      
class TestAPI(TestCase):
    @classmethod
    def setUpTestData(cls):
        Member.objects.create(first_name="J", last_name="D", email="jd@is.com", phone_number="5554567890", role="admin")
        
    def test_get_team_members(self):
        response = get_team_members()
        
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
        
    def test_delete_team_member_by_id(self):
        response = delete_team_member_by_id(1)
        
        self.assertEqual(response.status_code, 200)
        
    def test_update_team_member_by_id(self):
        request = RequestFactory().put("/", 
                                       b'{"first_name": "UpdatedJD"}')
        
        response = update_team_member_by_id(1, request)
        
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"UpdatedJD", response.content)
        
"""
    These tests guarantee kwargs are facilitated to views from url
"""
class TestRoutes(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.member = Member.objects.create(first_name="J", last_name="D", pk=1)
        
    def test_store_is_loaded_into_edit_view(self):
        client = Client()
        response = client.get("/edit/1")

        self.assertEqual(response.status_code, 200)
        self.assertIn(b"J", response.content)
        self.assertIn(b"D", response.content)   