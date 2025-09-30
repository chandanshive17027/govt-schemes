// src/utils/eligibility.ts

export interface User {
  state?: string;
  education?: string;
  occupation?: string;
  age?: number;
  gender?: string;
  [key: string]: any;
}

export interface SchemeEligibility {
  state?: string | string[];
  education?: string | string[];
  occupation?: string | string[];
  minAge?: number;
  maxAge?: number;
  gender?: string | string[];
  [key: string]: any;
}

export interface Scheme {
  id: string;
  name: string;
  ministry?: string;
  eligible?: SchemeEligibility[];
  details?: string;
  [key: string]: any;
}

/**
 * Helper: Check if user state matches scheme state or ministry
 */
function isStateMatch(
  userState?: string,
  schemeStates?: string | string[],
  schemeMinistry?: string
): boolean {
  if (!userState) return false;
  const userStateNorm = userState.trim().toLowerCase();

  const statesArr: string[] = Array.isArray(schemeStates)
    ? schemeStates
    : schemeStates
    ? [schemeStates]
    : [];

  // Empty states or 'all' always match
  if (statesArr.length === 0 || statesArr.map(s => s.trim().toLowerCase()).includes("all")) {
    return true;
  }

  for (const s of statesArr) {
    const sNorm = s.trim().toLowerCase();

    // Match ministry prefix
    if (schemeMinistry && sNorm.startsWith(schemeMinistry.trim().toLowerCase())) {
      return true;
    }

    // Exact or partial state match
    if (sNorm === userStateNorm || userStateNorm.includes(sNorm) || sNorm.includes(userStateNorm)) {
      return true;
    }
  }

  return false;
}

/**
 * Main function: Check eligibility
 */
export function checkEligibility(user: User, schemes: Scheme[]): Scheme[] {
  const recommendations: { scheme: Scheme; score: number }[] = [];

  const userState = (user.state ?? "").trim().toLowerCase();
  const userEdu = (user.education ?? "").trim().toLowerCase();
  const userOcc = (user.occupation ?? "").trim().toLowerCase();
  const userAge = user.age;
  const userGender = (user.gender ?? "").trim().toLowerCase();

  for (const scheme of schemes) {
    const eligibilities = Array.isArray(scheme.eligible) ? scheme.eligible : [];
    let maxScore = 0;

    for (const elig of eligibilities) {
      if (typeof elig !== "object") continue;
      let score = 0;

      // 1️⃣ State & Ministry check
      if (!isStateMatch(userState, elig.state, scheme.ministry)) continue;
      score += 1;

      // 2️⃣ Education / Occupation check
      const eligEdu: string[] = elig.education
        ? (Array.isArray(elig.education) ? elig.education : [elig.education]).map(e => e.trim().toLowerCase())
        : [];
      const eligOcc: string[] = elig.occupation
        ? (Array.isArray(elig.occupation) ? elig.occupation : [elig.occupation]).map(o => o.trim().toLowerCase())
        : [];

      if (eligEdu.includes(userEdu) || eligOcc.includes(userOcc)) {
        score += 1;
      } else {
        continue;
      }

      // 3️⃣ Age check
      if (userAge !== undefined && userAge !== null) {
        if ((elig.minAge !== undefined && userAge < elig.minAge) ||
            (elig.maxAge !== undefined && userAge > elig.maxAge)) {
          continue;
        }
        score += 1;
      }

      // 4️⃣ Gender check
      if (elig.gender) {
        const eligGender: string[] = Array.isArray(elig.gender)
          ? elig.gender.map(g => g.trim().toLowerCase())
          : [elig.gender.trim().toLowerCase()];

        if (!eligGender.includes(userGender)) continue;
        score += 1;
      }

      if (score > maxScore) maxScore = score;
    }

    if (maxScore > 0) {
      recommendations.push({ scheme, score: maxScore });
    }
  }

  // Return top 5 schemes by score
  recommendations.sort((a, b) => b.score - a.score);
  return recommendations.slice(0, 5).map(r => r.scheme);
}
