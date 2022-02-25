import re
import unicodedata as ud

re_rounded_brackets = r"\(.*?\)"
re_square_brackets = r"\[.*?\]"
re_parenthesis_regexp = re.compile(
    "(" + "|".join([re_rounded_brackets, re_square_brackets]) + ")"
)


def remove_any_kind_of_parenthesis(string: str) -> str:
    return re.sub(re_parenthesis_regexp, " ", string)


re_empty_lines = re.compile(r"\n*\s*\n+")
re_duplicated_spaces = re.compile(r"\s{2,}")


def normalize_text_carriage_returns_and_spaces(string: str) -> str:
    string = re.sub(re_empty_lines, "\n", string)
    string = re.sub(re_duplicated_spaces, " ", string)
    return string.strip()


re_punctuation_marks = re.compile(r"\s(\.|,|;|:)")


def correct_punctuation_marks_grammar(string: str) -> str:
    return re.sub(re_punctuation_marks, r"\1", string)


re_calligraphic_double_quotation_marks = re.compile("[“”⁗]")
re_calligraphic_single_quotation_marks = re.compile("[´`‘’]")


def normalize_strange_symbols(string: str) -> str:
    string = re.sub(re_calligraphic_double_quotation_marks, '"', string)
    string = re.sub(re_calligraphic_single_quotation_marks, "'", string)
    return (
        string.replace("—", "-")  # large dashe for single dash
        .replace("е", "e")  # cyrillic e for normal e
        .replace("…", "...")  # elipsis for three dots
    )


def replace_unicode_spaces_with_normal_spaces(string: str) -> str:
    return re.sub(r"[^\S\n ]+", " ", string)


def clean_text(text: str) -> str:
    text = ud.normalize("NFC", text)
    return normalize_strange_symbols(text)


def clean_lyrics(lyrics: str) -> str:
    lyrics = lyrics.replace("\r", "\n")
    lyrics = remove_any_kind_of_parenthesis(lyrics)
    lyrics = clean_text(lyrics)
    lyrics = replace_unicode_spaces_with_normal_spaces(lyrics)
    lyrics = normalize_text_carriage_returns_and_spaces(lyrics)
    return correct_punctuation_marks_grammar(lyrics)
