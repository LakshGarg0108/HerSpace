import pytest
from starlette.testclient import TestClient
import sys
import os

# Add backend directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.main import app
from app.services.supabase_service import storage

@pytest.fixture(autouse=True)
def clean_storage():
    """Ensure test users have clean state before each test"""
    storage.delete_all_user_data("user-a")
    storage.delete_all_user_data("user-b")
    storage.delete_all_user_data("demo-user-id")
    yield

@pytest.fixture
def auth_headers_user_a():
    return {"Authorization": "Bearer demo-token:user-a"}

@pytest.fixture
def auth_headers_user_b():
    return {"Authorization": "Bearer demo-token:user-b"}

@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c
