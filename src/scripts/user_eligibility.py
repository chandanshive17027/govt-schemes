# src/scripts/eligibility_checker.py
import json
from typing import List, Dict, Union


def is_state_match(user_state: str, scheme_states: Union[List[str], str, None]) -> bool:
    """
    Returns True only if:
    - scheme states is empty or 'all'
    - OR user_state exactly matches one of the scheme states
    """
    if not user_state:
        return False

    user_state_norm = user_state.strip().lower()

    # Convert scheme_states to list
    states_list: List[str] = []
    if isinstance(scheme_states, str):
        # Allow comma-separated states in string
        states_list = [s.strip() for s in scheme_states.split(",") if s.strip()]
    elif isinstance(scheme_states, list):
        states_list = [s.strip() for s in scheme_states if s.strip()]

    # If empty or 'all', always match
    if not states_list or any(s.lower() == "all" for s in states_list):
        return True

    # Exact match only
    return any(user_state_norm == s.lower() for s in states_list)


def check_eligibility(user: Dict, schemes: List[Dict]) -> List[Dict]:
    """
    Recommend top 5 schemes for a user based on criteria:
    state, education, occupation, age, gender
    """
    recommendations = []

    user_state = user.get("state", "").strip().lower()
    user_edu = (user.get("education") or "").strip().lower()
    user_occ = (user.get("occupation") or "").strip().lower()
    user_age = user.get("age")
    user_gender = (user.get("gender") or "").strip().lower()

    for scheme in schemes:
        eligibilities = scheme.get("eligible") or []
        max_score = 0

        for elig in eligibilities:
            if not isinstance(elig, dict):
                continue

            score = 0

            # 1️⃣ State match
            if not is_state_match(user_state, elig.get("state")):
                continue  # Skip this eligibility if state doesn't match
            score += 1

            # 2️⃣ Education / Occupation match (any one)
            elig_edu = elig.get("education") or []
            if isinstance(elig_edu, str):
                elig_edu = [elig_edu]
            elig_edu = [e.strip().lower() for e in elig_edu]

            elig_occ = elig.get("occupation") or []
            if isinstance(elig_occ, str):
                elig_occ = [elig_occ]
            elig_occ = [o.strip().lower() for o in elig_occ]

            if user_edu in elig_edu or user_occ in elig_occ:
                score += 1
            else:
                continue  # Skip if neither matches

            # 3️⃣ Age match (if specified)
            min_age = elig.get("minAge")
            max_age = elig.get("maxAge")
            if user_age is not None:
                if (min_age is not None and user_age < min_age) or (
                    max_age is not None and user_age > max_age
                ):
                    continue
                score += 1

            # 4️⃣ Gender match (if specified)
            elig_gender = elig.get("gender")
            if elig_gender:
                if isinstance(elig_gender, str):
                    elig_gender = [elig_gender]
                elig_gender = [g.strip().lower() for g in elig_gender]
                if user_gender not in elig_gender:
                    continue
                score += 1

            # Update max_score for this scheme
            if score > max_score:
                max_score = score

        if max_score > 0:
            recommendations.append({"scheme": scheme, "score": max_score})

    # Sort by score descending and take top 5
    recommendations.sort(key=lambda x: x["score"], reverse=True)
    top_schemes = [r["scheme"] for r in recommendations[:5]]
    return top_schemes


if __name__ == "__main__":
    import sys

    if len(sys.argv) != 3:
        print("Usage: python user_eligibility.py user.json schemes.json")
        sys.exit(1)

    user_file = sys.argv[1]
    schemes_file = sys.argv[2]

    with open(user_file) as f:
        user_data = json.load(f)

    with open(schemes_file) as f:
        schemes_data = json.load(f)

    top_schemes = check_eligibility(user_data, schemes_data)
    print(json.dumps(top_schemes, indent=2))
