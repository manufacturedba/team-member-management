from django.test import RequestFactory, TestCase

from .views import ListView

class TestViews(TestCase):
    def test_store_is_loaded_into_list_view(self):
        request = RequestFactory().get("/")
        view = ListView()
        view.setup(request)

        context = view.get_context_data()
        self.assertIn("store", context)