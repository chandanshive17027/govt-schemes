import sys
import json
import re

def parse_eligibility(text: str, default_state=None, default_ministry=None):
    """
    Parse free-text eligibility into structured JSON fields.
    Supports: minAge, maxAge, gender, occupation, education, state, castecategory,
              income, maritalStatus, disability, minority, other
    """
    eligibility = {
        "minAge": None,
        "maxAge": None,
        "gender": None,            # "male", "female", "other", or None
        "occupation": [],          # multiple occupations possible
        "education": None,
        "state": [],               # will fallback to default_state
        "castecategory": None,     # SC, ST, OBC, EWS, General
        "income": None,            # max income limit
        "maritalStatus": None,     # single / married / widow
        "disability": None,        # physical/mental disability if mentioned
        "minority": None,          # religion/minority group if mentioned
        "other": [],               # fallback text snippets
        "ministry": default_ministry  # optional: fallback ministry
    }

    if not text:
        # if no eligibility text, just return state/ministry defaults
        if default_state:
            eligibility["state"] = [default_state]
        return eligibility

    lower_text = text.lower()

    # -------------------------
    # Age Parsing
    # -------------------------
    age_matches = re.findall(r'(\d{1,2})\s*(?:-|to|–)\s*(\d{1,2})\s*years?', lower_text)
    if age_matches:
        eligibility["minAge"], eligibility["maxAge"] = map(int, age_matches[0])
    else:
        min_match = re.search(r'(\d{1,2})\s*\+?\s*years?\s*(?:and above|or more)?', lower_text)
        if min_match:
            eligibility["minAge"] = int(min_match.group(1))

    # -------------------------
    # Gender
    # -------------------------
    if any(w in lower_text for w in ["women", "female", "girl"]):
        eligibility["gender"] = "female"
    elif any(w in lower_text for w in ["men", "male", "boy"]):
        eligibility["gender"] = "male"
    elif "transgender" in lower_text or "third gender" in lower_text:
        eligibility["gender"] = "other"

    # -------------------------
    # Occupation
    # -------------------------
    occupations = ["farmer", "student", "worker", "entrepreneur", "teacher",
                   "doctor", "artisan", "weaver", "fisherman", "self-employed"]
    for occ in occupations:
        if re.search(rf"\b{occ}\b", lower_text):
            eligibility["occupation"].append(occ)

    # -------------------------
    # Education
    # -------------------------
    if "graduate" in lower_text:
        eligibility["education"] = "graduate"
    elif "postgraduate" in lower_text or "pg" in lower_text:
        eligibility["education"] = "postgraduate"
    elif "matric" in lower_text or "10th" in lower_text:
        eligibility["education"] = "10th"
    elif "12th" in lower_text or "intermediate" in lower_text:
        eligibility["education"] = "12th"
    elif "illiterate" in lower_text:
        eligibility["education"] = "none"

    # -------------------------
    # Caste / Category
    # -------------------------
    categories = {"sc": "SC", "st": "ST", "obc": "OBC", "ews": "EWS", "general": "General"}
    for key, value in categories.items():
        if re.search(rf"\b{key}\b", lower_text):
            eligibility["castecategory"] = value

    # -------------------------
    # Income
    # -------------------------
    income_match = re.search(r'family income (?:less than|upto|up to|not exceeding)\s*₹?\s?([\d,]+)', lower_text)
    if income_match:
        eligibility["income"] = int(income_match.group(1).replace(",", ""))

    # -------------------------
    # Marital Status
    # -------------------------
    if "widow" in lower_text:
        eligibility["maritalStatus"] = "widow"
    elif "unmarried" in lower_text or "single" in lower_text:
        eligibility["maritalStatus"] = "single"
    elif "married" in lower_text:
        eligibility["maritalStatus"] = "married"

    # -------------------------
    # Disability
    # -------------------------
    if any(w in lower_text for w in ["disability", "handicapped", "divyang"]):
        eligibility["disability"] = True

    # -------------------------
    # Minority (religion)
    # -------------------------
    if any(w in lower_text for w in ["muslim", "christian", "sikh", "buddhist", "parsi", "minority"]):
        eligibility["minority"] = True

    # -------------------------
    # State / Region
    # -------------------------
    state_match = re.findall(r'resident of ([a-z\s]+)', lower_text)
    if state_match:
        eligibility["state"] = [s.strip().title() for s in state_match]
    elif default_state:
        eligibility["state"] = [default_state]  # fallback to scheme.state

    # -------------------------
    # Fallback
    # -------------------------
    if not any(v for k, v in eligibility.items() if k not in ["state", "ministry"] and v not in [None, [], False]):
        eligibility["other"].append(text.strip())

    return eligibility


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No eligibility text provided"}))
        sys.exit(1)

    # Optional: pass state/ministry as 2nd and 3rd argument
    eligibility_text = sys.argv[1]
    default_state = sys.argv[2] if len(sys.argv) > 2 else None
    default_ministry = sys.argv[3] if len(sys.argv) > 3 else None

    parsed = parse_eligibility(eligibility_text, default_state, default_ministry)
    print(json.dumps(parsed, ensure_ascii=False, indent=2))


# import sys
# import json
# import re

# def parse_eligibility(text: str):
#     """
#     Parse free-text eligibility into structured JSON fields.
#     Supports: minAge, maxAge, gender, occupation, education, state, castecategory,
#               income, maritalStatus, disability, minority, other
#     """
#     eligibility = {
#         "minAge": None,
#         "maxAge": None,
#         "gender": None,            # "male", "female", "other", or None
#         "occupation": [],          # multiple occupations possible
#         "education": None,
#         "state": [],
#         "castecategory": None,     # SC, ST, OBC, EWS, General
#         "income": None,            # max income limit
#         "maritalStatus": None,     # single / married / widow
#         "disability": None,        # physical/mental disability if mentioned
#         "minority": None,          # religion/minority group if mentioned
#         "other": []                # fallback text snippets
#     }

#     if not text:
#         return eligibility

#     lower_text = text.lower()

#     # -------------------------
#     # Age Parsing
#     # -------------------------
#     age_matches = re.findall(r'(\d{1,2})\s*(?:-|to|–)\s*(\d{1,2})\s*years?', lower_text)
#     if age_matches:
#         eligibility["minAge"], eligibility["maxAge"] = map(int, age_matches[0])
#     else:
#         min_match = re.search(r'(\d{1,2})\s*\+?\s*years?\s*(?:and above|or more)?', lower_text)
#         if min_match:
#             eligibility["minAge"] = int(min_match.group(1))

#     # -------------------------
#     # Gender
#     # -------------------------
#     if "women" in lower_text or "female" in lower_text or "girl" in lower_text:
#         eligibility["gender"] = "female"
#     elif "men" in lower_text or "male" in lower_text or "boy" in lower_text:
#         eligibility["gender"] = "male"
#     elif "transgender" in lower_text or "third gender" in lower_text:
#         eligibility["gender"] = "other"
#     # ❌ Do not assign default gender if none is found (keep None)

#     # -------------------------
#     # Occupation
#     # -------------------------
#     occupations = ["farmer", "student", "worker", "entrepreneur", "teacher",
#                    "doctor", "artisan", "weaver", "fisherman", "self-employed"]
#     for occ in occupations:
#         if re.search(rf"\b{occ}\b", lower_text):
#             eligibility["occupation"].append(occ)

#     # -------------------------
#     # Education
#     # -------------------------
#     if "graduate" in lower_text:
#         eligibility["education"] = "graduate"
#     elif "postgraduate" in lower_text or "pg" in lower_text:
#         eligibility["education"] = "postgraduate"
#     elif "matric" in lower_text or "10th" in lower_text:
#         eligibility["education"] = "10th"
#     elif "12th" in lower_text or "intermediate" in lower_text:
#         eligibility["education"] = "12th"
#     elif "illiterate" in lower_text:
#         eligibility["education"] = "none"

#     # -------------------------
#     # Caste / Category
#     # -------------------------
#     categories = {
#         "sc": "SC",
#         "st": "ST",
#         "obc": "OBC",
#         "ews": "EWS",
#         "general": "General"
#     }
#     for key, value in categories.items():
#         if re.search(rf"\b{key}\b", lower_text):
#             eligibility["castecategory"] = value

#     # -------------------------
#     # Income (max limit)
#     # -------------------------
#     income_match = re.search(r'family income (?:less than|upto|up to|not exceeding)\s*₹?\s?([\d,]+)', lower_text)
#     if income_match:
#         eligibility["income"] = int(income_match.group(1).replace(",", ""))

#     # -------------------------
#     # Marital Status
#     # -------------------------
#     if "widow" in lower_text:
#         eligibility["maritalStatus"] = "widow"
#     elif "unmarried" in lower_text or "single" in lower_text:
#         eligibility["maritalStatus"] = "single"
#     elif "married" in lower_text:
#         eligibility["maritalStatus"] = "married"

#     # -------------------------
#     # Disability
#     # -------------------------
#     if "disability" in lower_text or "handicapped" in lower_text or "divyang" in lower_text:
#         eligibility["disability"] = True

#     # -------------------------
#     # Minority (religion)
#     # -------------------------
#     if "muslim" in lower_text or "christian" in lower_text or "sikh" in lower_text \
#        or "buddhist" in lower_text or "parsi" in lower_text or "minority" in lower_text:
#         eligibility["minority"] = True

#     # -------------------------
#     # State / Region
#     # -------------------------
#     state_match = re.findall(r'resident of ([a-z\s]+)', lower_text)
#     if state_match:
#         eligibility["state"] = [s.strip().title() for s in state_match]

#     # -------------------------
#     # Fallback
#     # -------------------------
#     if not any(v for v in eligibility.values() if v not in [None, [], False]):
#         eligibility["other"].append(text.strip())

#     return eligibility


# if __name__ == "__main__":
#     if len(sys.argv) < 2:
#         print(json.dumps({"error": "No eligibility text provided"}))
#         sys.exit(1)

#     eligibility_text = sys.argv[1]
#     parsed = parse_eligibility(eligibility_text)
#     print(json.dumps(parsed, ensure_ascii=False, indent=2))


