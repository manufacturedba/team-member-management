from django.test import RequestFactory, TestCase

from .views import IndexView

class TestViews(TestCase):
    def test_store_is_loaded_into_index_view(self):
        request = RequestFactory().get("/")
        view = IndexView()
        view.setup(request)

        context = view.get_context_data()
        self.assertIn("store", context)