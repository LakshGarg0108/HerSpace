def test_journal_crud_and_cross_user_isolation(client, auth_headers_user_a, auth_headers_user_b):
    # 1. User A creates a private reflection
    create_res = client.post(
        "/api/journal",
        json={
            "title": "A's Private Reflection",
            "content": "Things at home felt really loud today.",
            "mood": "overwhelmed",
        },
        headers=auth_headers_user_a,
    )
    assert create_res.status_code == 201
    entry_a = create_res.json()
    entry_a_id = entry_a["id"]
    assert entry_a["user_id"] == "user-a"

    # 2. User A can retrieve her own entry
    get_res = client.get(f"/api/journal/{entry_a_id}", headers=auth_headers_user_a)
    assert get_res.status_code == 200
    assert get_res.json()["title"] == "A's Private Reflection"

    # 3. User B attempts to access User A's entry -> MUST RETURN 404
    b_res = client.get(f"/api/journal/{entry_a_id}", headers=auth_headers_user_b)
    assert b_res.status_code == 404

    # 4. User B attempts to update User A's entry -> MUST RETURN 404
    b_patch = client.patch(
        f"/api/journal/{entry_a_id}",
        json={"title": "Hacked Title"},
        headers=auth_headers_user_b,
    )
    assert b_patch.status_code == 404

    # 5. User B attempts to delete User A's entry -> MUST RETURN 404
    b_del = client.delete(f"/api/journal/{entry_a_id}", headers=auth_headers_user_b)
    assert b_del.status_code == 404

    # 6. Verify User A's entry is still completely intact
    verify_res = client.get(f"/api/journal/{entry_a_id}", headers=auth_headers_user_a)
    assert verify_res.status_code == 200
    assert verify_res.json()["title"] == "A's Private Reflection"

    # 7. User A deletes her own entry
    del_res = client.delete(f"/api/journal/{entry_a_id}", headers=auth_headers_user_a)
    assert del_res.status_code == 204

    # Now it is gone
    get_deleted = client.get(f"/api/journal/{entry_a_id}", headers=auth_headers_user_a)
    assert get_deleted.status_code == 404
