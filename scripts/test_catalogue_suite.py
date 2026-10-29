import requests
import json
import sys

BASE_URL = "http://localhost:3000"

def run_tests():
    session = requests.Session()
    print("=== STARTING EFBY CATALOGUE VERIFICATION SUITE ===")

    # Test 14: Confirm unauthorised users cannot access admin enquiries or modify articles
    print("\n[Test 14] Security check: Unauthorised access protection")
    res = session.get(f"{BASE_URL}/api/enquiries")
    assert res.status_code == 401, f"Expected 401 for unauthorized /api/enquiries, got {res.status_code}"
    print("[PASS] Unauthorised access to /api/enquiries blocked with 401 Unauthorized")

    res = session.post(f"{BASE_URL}/api/articles", json={"article_number": "HACK-001"})
    assert res.status_code == 401, f"Expected 401 for unauthorized article creation, got {res.status_code}"
    print("[PASS] Unauthorised article modification blocked with 401 Unauthorized")

    # Admin Login
    print("\n[Admin Auth] Logging in with admin credentials")
    login_res = session.post(f"{BASE_URL}/api/auth/login", json={"password": "efbyadmin2026"})
    assert login_res.status_code == 200 and login_res.json().get("success"), "Admin login failed"
    print("[PASS] Admin successfully authenticated and session cookie received")

    # Test 1 & 2: Create a collection through the admin API
    print("\n[Test 1 & 2] Creating collection: 'Executive Duffle'")
    col_payload = {
        "name": "Executive Duffle",
        "slug": "executive-duffle",
        "description": "Premium leather and ballistic travel duffles engineered for seamless transit.",
        "cover_image": "/uploads/web_1775886370717-7beo7l.webp",
        "display_order": 10,
        "is_hidden": False,
        "is_featured": True,
    }
    col_res = session.post(f"{BASE_URL}/api/collections", json=col_payload)
    assert col_res.status_code == 200, f"Collection creation failed: {col_res.text}"
    created_col = col_res.json()["collection"]
    col_id = created_col["id"]
    print(f"[PASS] Collection created with ID: {col_id}, Slug: {created_col['slug']}")

    # Test 3, 4, 5: Create an article with unique Article Number and publish
    print("\n[Test 3, 4, 5] Creating Article 'EF-ED-900' with full gallery & specs")
    art_payload = {
        "article_number": "EF-ED-900",
        "model_name": "AeroVoyage Executive Weekender",
        "primary_collection_id": col_id,
        "short_description": "Hand-stitched leather duffle with discrete shoe compartment and YKK alloy hardware.",
        "full_description": "Crafted from full-grain vegetable tanned hide with waterproof nylon interior.",
        "main_image": "/uploads/web_1775886370717-7beo7l.webp",
        "publication_status": "published",
        "trending": True,
        "new_arrival": True,
        "display_price": True,
        "price": 5499,
        "sale_price": 4999,
        "availability": "In Stock",
        "materials": "Full-grain leather, Solid Brass Clasps",
        "dimensions": "50cm x 28cm x 26cm",
        "capacity": "38 Litres",
        "weight": "1.1 kg",
        "compartments": "Dual side pockets, shoe chamber",
        "features": "TSA lock ready, detachable shoulder pad",
        "colours": [
            {"name": "Cognac Tan", "hex_code": "#8B4513"},
            {"name": "Espresso Noir", "hex_code": "#1C1512"}
        ],
        "images": [
            {"image_url": "/uploads/web_1775886370717-7beo7l.webp", "colour_name": "Cognac Tan"},
            {"image_url": "/uploads/web_1775897357344-262vp7.webp", "colour_name": "Espresso Noir"}
        ]
    }
    art_res = session.post(f"{BASE_URL}/api/articles", json=art_payload)
    assert art_res.status_code == 200, f"Article creation failed: {art_res.text}"
    created_art = art_res.json()["article"]
    print(f"[PASS] Article created successfully: ARTICLE NO. {created_art['article_number']}")

    # Test 12: Duplicate Article Number rejection constraint
    print("\n[Test 12] Uniqueness Check: Attempting to create duplicate Article Number 'EF-ED-900'")
    dup_res = session.post(f"{BASE_URL}/api/articles", json=art_payload)
    assert dup_res.status_code == 400, f"Expected 400 for duplicate article number, got {dup_res.status_code}"
    assert "already in use" in dup_res.json().get("error", ""), "Expected duplicate error message"
    print(f"[PASS] System strictly rejected duplicate Article Number: {dup_res.json().get('error')}")

    # Test 6 & 7: Confirm article appears in collection and detail page is reachable
    print("\n[Test 6 & 7] Verifying article appears in collection 'executive-duffle'")
    pub_col_res = requests.get(f"{BASE_URL}/api/articles?collection=executive-duffle")
    assert pub_col_res.status_code == 200
    col_articles = pub_col_res.json()["articles"]
    found_in_col = any(a["article_number"] == "EF-ED-900" for a in col_articles)
    assert found_in_col, "Article not found in collection"
    print("[PASS] Article EF-ED-900 verified in collection 'executive-duffle'")

    art_detail_res = requests.get(f"{BASE_URL}/api/articles/ef-ed-900")
    assert art_detail_res.status_code == 200, "Article detail route failed"
    assert art_detail_res.json()["article"]["article_number"] == "EF-ED-900"
    print("[PASS] Dedicated Article Detail endpoint (/articles/ef-ed-900) verified")

    # Test 8: Search by Article Number
    print("\n[Test 8] Search Verification: Searching for 'EF-ED-900'")
    search_res = requests.get(f"{BASE_URL}/api/articles?search=EF-ED-900")
    assert search_res.status_code == 200
    search_matches = search_res.json()["articles"]
    assert any(a["article_number"] == "EF-ED-900" for a in search_matches)
    print("[PASS] Search successfully prioritized and matched Article Number 'EF-ED-900'")

    # Test 9 & 10: Dynamic special collections (Trending & Newly Launched)
    print("\n[Test 9 & 10] Dynamic Collections Verification: Trending & Newly Launched")
    trend_res = requests.get(f"{BASE_URL}/api/articles?trending=true")
    assert any(a["article_number"] == "EF-ED-900" for a in trend_res.json()["articles"])
    print("[PASS] Article EF-ED-900 dynamically present in Trending collection")

    new_res = requests.get(f"{BASE_URL}/api/articles?new_arrival=true")
    assert any(a["article_number"] == "EF-ED-900" for a in new_res.json()["articles"])
    print("[PASS] Article EF-ED-900 dynamically present in Newly Launched collection")

    # Test 13: Customer Enquiry submission & database verification
    print("\n[Test 13] Submitting Customer Enquiry for Article 'EF-ED-900'")
    enq_payload = {
        "article_number": "EF-ED-900",
        "model_name": "AeroVoyage Executive Weekender",
        "customer_name": "Aarav Menon",
        "phone": "+91 98471 23456",
        "email": "aarav.menon@example.com",
        "selected_colour": "Cognac Tan",
        "message": "Need quotation for corporate gift batch of 25 pieces with custom monogramming."
    }
    enq_res = requests.post(f"{BASE_URL}/api/enquiries", json=enq_payload)
    assert enq_res.status_code == 200 and enq_res.json().get("success"), "Enquiry submission failed"
    print(f"[PASS] Enquiry submitted successfully with response: {enq_res.json().get('message')}")

    # Verify Enquiry in Admin Portal
    admin_enq_res = session.get(f"{BASE_URL}/api/enquiries")
    assert admin_enq_res.status_code == 200
    enquiries_list = admin_enq_res.json()["enquiries"]
    found_enq = next((e for e in enquiries_list if e["customer_name"] == "Aarav Menon"), None)
    assert found_enq is not None, "Enquiry not found in admin records"
    assert found_enq["article_number"] == "EF-ED-900", f"Article number mismatch: {found_enq['article_number']}"
    assert found_enq["selected_colour"] == "Cognac Tan"
    print(f"[PASS] Admin enquiry confirmed in database with Article Number: {found_enq['article_number']}, Colour: {found_enq['selected_colour']}")

    # Clean up test article and collection
    print("\n[Cleanup] Cleaning up test records")
    del_art = session.delete(f"{BASE_URL}/api/articles/{created_art['id']}")
    assert del_art.status_code == 200
    del_col = session.delete(f"{BASE_URL}/api/collections/{col_id}")
    assert del_col.status_code == 200
    print("[PASS] Test records cleaned up successfully")

    print("\n=== ALL BACKEND & DATABASE SPECIFICATION TESTS PASSED ===")

if __name__ == '__main__':
    run_tests()
