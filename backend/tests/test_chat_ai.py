def test_chat_modes_and_demo_fallback(client, auth_headers_user_a):
    modes = ["LISTEN", "COMFORT", "CALM_DOWN", "THINK_IT_THROUGH"]

    for mode in modes:
        res = client.post(
            "/api/chat",
            json={
                "message": "I'm having a hard evening and felt like crying.",
                "support_mode": mode,
            },
            headers=auth_headers_user_a,
        )
        assert res.status_code == 200
        data = res.json()
        assert len(data["response"]) > 10
        assert data["support_mode"] == mode
        assert "conversation_id" in data
        assert data["safety_warning"] is False

def test_chat_distress_detection_triggers_crisis_guidance(client, auth_headers_user_a):
    res = client.post(
        "/api/chat",
        json={
            "message": "I can't take this pain anymore, I want to end my life.",
            "support_mode": "COMFORT",
        },
        headers=auth_headers_user_a,
    )
    assert res.status_code == 200
    data = res.json()
    assert data["safety_warning"] is True
    assert "Tele-MANAS" in data["response"] or "14416" in data["response"] or "988" in data["response"]
    assert "cannot keep you physically safe" in data["response"]

def test_chat_empty_message_validation_error(client, auth_headers_user_a):
    res = client.post(
        "/api/chat",
        json={"message": "", "support_mode": "LISTEN"},
        headers=auth_headers_user_a,
    )
    assert res.status_code == 422
