import sys
import json

def check_user_eligibility(user, scheme_eligibilities):
    reasons = []

    for elig in scheme_eligibilities:
        eligible = True
        scheme_reasons = []

        # Age
        if elig.get("minAge") is not None and user.get("age") is not None:
            if user["age"] < elig["minAge"]:
                eligible = False
                scheme_reasons.append(f"Minimum age required: {elig['minAge']}")
        if elig.get("maxAge") is not None and user.get("age") is not None:
            if user["age"] > elig["maxAge"]:
                eligible = False
                scheme_reasons.append(f"Maximum age allowed: {elig['maxAge']}")

        # Gender
        if elig.get("gender") and user.get("gender"):
            allowed_genders = elig["gender"]
            if isinstance(allowed_genders, str):
                allowed_genders = [allowed_genders]
            allowed_genders = [g.strip().lower() for g in allowed_genders]

            if user["gender"].strip().lower() not in allowed_genders:
                eligible = False
                scheme_reasons.append(f"Applicable only for gender: {', '.join(allowed_genders)}")

        # Occupation
        if elig.get("occupation") and user.get("occupation"):
            allowed_occupations = elig["occupation"]
            if isinstance(allowed_occupations, str):
                allowed_occupations = [allowed_occupations]
            allowed_occupations = [o.strip().lower() for o in allowed_occupations]

            if user["occupation"].strip().lower() not in allowed_occupations:
                eligible = False
                scheme_reasons.append(f"Applicable only for occupations: {', '.join(allowed_occupations)}")

        # Education
        if elig.get("education") and user.get("education"):
            allowed_education = elig["education"]
            if isinstance(allowed_education, str):
                allowed_education = [allowed_education]
            allowed_education = [e.strip().lower() for e in allowed_education]

            if user["education"].strip().lower() not in allowed_education:
                eligible = False
                scheme_reasons.append(f"Required education: {', '.join(allowed_education)}")

        # Caste
        if elig.get("castecategory") and user.get("castecategory"):
            allowed_castes = elig["castecategory"]
            if isinstance(allowed_castes, str):
                allowed_castes = [allowed_castes]
            allowed_castes = [c.strip().lower() for c in allowed_castes]

            if user["castecategory"].strip().lower() not in allowed_castes:
                eligible = False
                scheme_reasons.append(f"Applicable only for caste category: {', '.join(allowed_castes)}")

        # Income
        if elig.get("income") is not None and user.get("income") is not None:
            if user["income"] > elig["income"]:
                eligible = False
                scheme_reasons.append(f"Income must be less than or equal to {elig['income']}")

        # Marital Status
        if elig.get("maritalStatus") and user.get("maritalStatus"):
            allowed_status = elig["maritalStatus"]
            if isinstance(allowed_status, str):
                allowed_status = [allowed_status]
            allowed_status = [s.strip().lower() for s in allowed_status]

            if user["maritalStatus"].strip().lower() not in allowed_status:
                eligible = False
                scheme_reasons.append(f"Applicable only for marital status: {', '.join(allowed_status)}")

        # State
        if elig.get("state") and user.get("state"):
            allowed_states = elig["state"]
            if isinstance(allowed_states, str):
                allowed_states = [allowed_states]
            allowed_states = [s.strip().lower() for s in allowed_states]

            if user["state"].strip().lower() not in allowed_states:
                eligible = False
                scheme_reasons.append(f"Applicable only for states: {', '.join(allowed_states)}")

        if eligible:
            return {"eligible": True, "reasons": []}
        else:
            reasons.extend(scheme_reasons)

    return {"eligible": False, "reasons": reasons}


if __name__ == "__main__":
    # Expecting 2 arguments: user JSON and scheme JSON
    if len(sys.argv) < 3:
        print(json.dumps({"eligible": False, "reasons": ["Missing user or scheme data"]}))
        sys.exit(1)

    user_json = json.loads(sys.argv[1])
    scheme_json = json.loads(sys.argv[2])
    if isinstance(scheme_json, list):
        scheme_json_list = scheme_json
    else:
        scheme_json_list = [scheme_json]

    result = check_user_eligibility(user_json, scheme_json_list)
    print(json.dumps(result))
