from backend.song_utils import clean_text


def test_clean_text():
    text = "“”´`‘’—е…àëìôú"
    real_text = '""' + "''''" + "-e...àëìôúñ"
    for clean, real in zip(clean_text(text), real_text):
        assert clean == real
