def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "Her Safe Space" in data["service"]
    assert "You don't have to be okay all the time." in data["motto"]
