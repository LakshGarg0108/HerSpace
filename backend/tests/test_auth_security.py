def test_unauthenticated_request_rejected(client):
    endpoints = [
        ("GET", "/api/journal"),
        ("GET", "/api/moods"),
        ("GET", "/api/reminders"),
        ("GET", "/api/profile"),
    ]
    for method, path in endpoints:
        res = client.request(method, path)
        assert res.status_code == 401
        assert "Authentication token is missing" in res.json()["detail"]

def test_invalid_bearer_token_rejected(client):
    res = client.get("/api/journal", headers={"Authorization": "Bearer totally-invalid-random-string"})
    assert res.status_code == 401

def test_valid_demo_bearer_token_accepted(client, auth_headers_user_a):
    res = client.get("/api/profile", headers=auth_headers_user_a)
    assert res.status_code == 200
    assert res.json()["id"] == "user-a"
