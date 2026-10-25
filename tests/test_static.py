def test_frontend_files_are_revalidated_not_reused_blindly(client):
    for path in ("/", "/assets/api.js", "/assets/Officer.js"):
        r = client.get(path)
        assert r.status_code == 200 and r.headers["cache-control"] == "no-cache", path


def test_unchanged_file_answers_304(client):
    first = client.get("/assets/api.js")
    again = client.get("/assets/api.js", headers={"If-None-Match": first.headers["etag"]})
    assert again.status_code == 304
