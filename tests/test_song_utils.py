from backend.song_utils import clean_lyrics, clean_text


def test_clean_text():
    assert clean_text("“”⁗") == '"""'
    assert clean_text("´`‘’") == "''''"
    assert clean_text("—е…") == "-e..."
    assert clean_text("àëìôú") == "àëìôú"


def test_clean_lyrics():
    assert clean_lyrics("\n\na\n \na\n\n") == "a\na"
    assert clean_lyrics("[a](a)b") == "b"
    assert clean_lyrics("a , ab") == "a, ab"
    assert clean_lyrics("\r\ra\r\ra\r\r") == "a\na"
