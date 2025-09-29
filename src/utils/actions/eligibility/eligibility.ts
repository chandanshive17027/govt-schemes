// utils/eligibilityChecker.ts

interface User {
  id: string;
  name?: string;
  age?: number;
  castecategory?: string;
  occupation?: string;
  income?: number;
  state?: string;
  city?: string;
  maritalStatus?: string;
  zipCode?: number;
  education?: string;
  gender?: string;
  phoneNumber?: number;
}

interface Scheme {
  id: string;
  name: string;
  state?: string;
  ministry?: string;
  tags: string[];
  eligibility?: string;
  benefits?: string;
  application_process?: string;
  documents_required?: string;
}

interface EligibilityResult {
  isEligible: boolean;
  reasons: string[];
  passedChecks: string[];
  failedChecks: string[];
}

export function checkEligibility(user: User, scheme: Scheme): EligibilityResult {
  const result: EligibilityResult = {
    isEligible: true,
    reasons: [],
    passedChecks: [],
    failedChecks: []
  };

  if (!scheme.eligibility) {
    result.reasons.push("Scheme eligibility criteria not available");
    result.isEligible = false;
    return result;
  }

  const eligibilityText = scheme.eligibility.toLowerCase();
  const schemeTags = scheme.tags.map(tag => tag.toLowerCase());

  // Checkpoint 1: State eligibility check
  const stateCheck = checkStateEligibility(user, scheme, eligibilityText);
  if (!stateCheck.passed) {
    result.isEligible = false;
    result.failedChecks.push("State eligibility");
    result.reasons.push(stateCheck.reason);
  } else {
    result.passedChecks.push("State eligibility");
  }

  // Checkpoint 2: Age eligibility check
  const ageCheck = checkAgeEligibility(user, eligibilityText);
  if (!ageCheck.passed) {
    result.isEligible = false;
    result.failedChecks.push("Age eligibility");
    result.reasons.push(ageCheck.reason);
  } else if (ageCheck.reason) {
    result.passedChecks.push("Age eligibility");
  }

  // Checkpoint 2: Caste eligibility check
  const casteCheck = checkCasteEligibility(user, eligibilityText);
  if (!casteCheck.passed) {
    result.isEligible = false;
    result.failedChecks.push("Caste eligibility");
    result.reasons.push(casteCheck.reason);
  } else if (casteCheck.reason) {
    result.passedChecks.push("Caste eligibility");
  }

  // Checkpoint 2: Income eligibility check
  const incomeCheck = checkIncomeEligibility(user, eligibilityText);
  if (!incomeCheck.passed) {
    result.isEligible = false;
    result.failedChecks.push("Income eligibility");
    result.reasons.push(incomeCheck.reason);
  } else if (incomeCheck.reason) {
    result.passedChecks.push("Income eligibility");
  }

  // Checkpoint 2: Marital status eligibility check
  const maritalCheck = checkMaritalStatusEligibility(user, eligibilityText);
  if (!maritalCheck.passed) {
    result.isEligible = false;
    result.failedChecks.push("Marital status eligibility");
    result.reasons.push(maritalCheck.reason);
  } else if (maritalCheck.reason) {
    result.passedChecks.push("Marital status eligibility");
  }

  // Checkpoint 2: Gender eligibility check
  const genderCheck = checkGenderEligibility(user, eligibilityText);
  if (!genderCheck.passed) {
    result.isEligible = false;
    result.failedChecks.push("Gender eligibility");
    result.reasons.push(genderCheck.reason);
  } else if (genderCheck.reason) {
    result.passedChecks.push("Gender eligibility");
  }

  // Checkpoint 3: Occupation eligibility check
  const occupationCheck = checkOccupationEligibility(user, eligibilityText, schemeTags);
  if (!occupationCheck.passed) {
    result.isEligible = false;
    result.failedChecks.push("Occupation eligibility");
    result.reasons.push(occupationCheck.reason);
  } else if (occupationCheck.reason) {
    result.passedChecks.push("Occupation eligibility");
  }

  return result;
}

function checkStateEligibility(user: User, scheme: Scheme, eligibilityText: string): { passed: boolean; reason: string } {
  // If no user state provided
  if (!user.state) {
    return { passed: false, reason: "User state information not provided" };
  }

  // If scheme has no state specified, assume it's national
  if (!scheme.state) {
    return { passed: true, reason: "National scheme - applicable to all states" };
  }

  // Check if scheme state starts with 'ministry' (national schemes)
  if (scheme.state.toLowerCase().startsWith('ministry')) {
    return { passed: true, reason: "Ministry scheme - applicable to all citizens" };
  }

  // Direct state match
  if (user.state.toLowerCase() === scheme.state.toLowerCase()) {
    return { passed: true, reason: "State requirement met" };
  }

  // Check for state mentions in eligibility text
  const userStateLower = user.state.toLowerCase();
  if (eligibilityText.includes(userStateLower)) {
    return { passed: true, reason: "State requirement met as per eligibility criteria" };
  }

  return { 
    passed: false, 
    reason: `Scheme is specific to ${scheme.state}, but user is from ${user.state}` 
  };
}

function checkAgeEligibility(user: User, eligibilityText: string): { passed: boolean; reason: string } {
  // Check if age is mentioned in eligibility
  const agePatterns = [
    /age.*?(\d+).*?(\d+)/g,
    /between\s+(\d+)\s+and\s+(\d+)\s+years/g,
    /(\d+)\s+to\s+(\d+)\s+years/g,
    /minimum.*?age.*?(\d+)/g,
    /maximum.*?age.*?(\d+)/g,
    /above\s+(\d+)\s+years/g,
    /below\s+(\d+)\s+years/g,
    /under\s+(\d+)\s+years/g
  ];

  let ageRequirementFound = false;
  
  for (const pattern of agePatterns) {
    const matches = [...eligibilityText.matchAll(pattern)];
    if (matches.length > 0) {
      ageRequirementFound = true;
      
      if (!user.age) {
        return { passed: false, reason: "Age information required but not provided by user" };
      }

      for (const match of matches) {
        // Handle range patterns (between X and Y)
        if (match[2]) {
          const minAge = parseInt(match[1]);
          const maxAge = parseInt(match[2]);
          if (user.age >= minAge && user.age <= maxAge) {
            return { passed: true, reason: `Age requirement met (${minAge}-${maxAge} years)` };
          } else {
            return { 
              passed: false, 
              reason: `Age requirement not met. Required: ${minAge}-${maxAge} years, User age: ${user.age}` 
            };
          }
        }
        // Handle single age patterns (minimum, maximum, etc.)
        else if (match[1]) {
          const ageLimit = parseInt(match[1]);
          if (eligibilityText.includes('minimum') || eligibilityText.includes('above')) {
            if (user.age >= ageLimit) {
              return { passed: true, reason: `Minimum age requirement met (${ageLimit}+ years)` };
            } else {
              return { 
                passed: false, 
                reason: `Minimum age requirement not met. Required: ${ageLimit}+ years, User age: ${user.age}` 
              };
            }
          } else if (eligibilityText.includes('maximum') || eligibilityText.includes('below') || eligibilityText.includes('under')) {
            if (user.age <= ageLimit) {
              return { passed: true, reason: `Maximum age requirement met (${ageLimit}- years)` };
            } else {
              return { 
                passed: false, 
                reason: `Maximum age requirement not met. Required: ${ageLimit}- years, User age: ${user.age}` 
              };
            }
          }
        }
      }
    }
  }

  // If no age requirement found, pass the check
  if (!ageRequirementFound) {
    return { passed: true, reason: "" };
  }

  return { passed: true, reason: "Age requirement verification completed" };
}

function checkCasteEligibility(user: User, eligibilityText: string): { passed: boolean; reason: string } {
  const casteKeywords = ['caste', 'category', 'sc', 'st', 'obc', 'general', 'reserved', 'quota'];
  
  const hasCasteRequirement = casteKeywords.some(keyword => 
    eligibilityText.includes(keyword.toLowerCase())
  );

  if (!hasCasteRequirement) {
    return { passed: true, reason: "" };
  }

  if (!user.castecategory) {
    return { passed: false, reason: "Caste category information required but not provided" };
  }

  // If eligibility mentions user's caste category
  if (eligibilityText.includes(user.castecategory.toLowerCase())) {
    return { passed: true, reason: "Caste category requirement met" };
  }

  // General category check
  if (user.castecategory.toLowerCase() === 'general' && !eligibilityText.includes('reserved')) {
    return { passed: true, reason: "General category eligible for non-reserved scheme" };
  }

  return { 
    passed: false, 
    reason: `Caste category requirement not met. Required criteria not matched for ${user.castecategory}` 
  };
}

function checkIncomeEligibility(user: User, eligibilityText: string): { passed: boolean; reason: string } {
  const incomePatterns = [
    /income.*?(\d+)/g,
    /annual.*?income.*?(\d+)/g,
    /family.*?income.*?(\d+)/g,
    /below.*?poverty.*?line/g,
    /bpl/g,
    /apl/g
  ];

  let incomeRequirementFound = false;

  for (const pattern of incomePatterns) {
    const matches = [...eligibilityText.matchAll(pattern)];
    if (matches.length > 0) {
      incomeRequirementFound = true;
      
      if (!user.income) {
        return { passed: false, reason: "Income information required but not provided" };
      }

      // Handle specific income limits
      for (const match of matches) {
        if (match[1]) {
          const incomeLimit = parseInt(match[1]);
          if (eligibilityText.includes('below') || eligibilityText.includes('maximum')) {
            if (user.income <= incomeLimit) {
              return { passed: true, reason: `Income requirement met (below ₹${incomeLimit})` };
            } else {
              return { 
                passed: false, 
                reason: `Income too high. Required: below ₹${incomeLimit}, User income: ₹${user.income}` 
              };
            }
          }
        }
      }
    }
  }

  // Check for BPL/APL mentions
  if (eligibilityText.includes('bpl') || eligibilityText.includes('below poverty line')) {
    if (!user.income) {
      return { passed: false, reason: "Income information required for BPL verification" };
    }
    // Assuming BPL threshold (this should be configurable)
    const bplThreshold = 150000; // ₹1.5 lakh annually
    if (user.income <= bplThreshold) {
      return { passed: true, reason: "BPL income requirement met" };
    } else {
      return { passed: false, reason: "Income exceeds BPL threshold" };
    }
  }

  if (!incomeRequirementFound) {
    return { passed: true, reason: "" };
  }

  return { passed: true, reason: "Income requirement verification completed" };
}

function checkMaritalStatusEligibility(user: User, eligibilityText: string): { passed: boolean; reason: string } {
  const maritalKeywords = ['married', 'unmarried', 'single', 'widow', 'widower', 'divorced'];
  
  const hasMaritalRequirement = maritalKeywords.some(keyword => 
    eligibilityText.includes(keyword.toLowerCase())
  );

  if (!hasMaritalRequirement) {
    return { passed: true, reason: "" };
  }

  if (!user.maritalStatus) {
    return { passed: false, reason: "Marital status information required but not provided" };
  }

  const userMaritalStatus = user.maritalStatus.toLowerCase();
  
  // Check if user's marital status matches eligibility
  if (eligibilityText.includes(userMaritalStatus)) {
    return { passed: true, reason: "Marital status requirement met" };
  }

  return { 
    passed: false, 
    reason: `Marital status requirement not met. User status: ${user.maritalStatus}` 
  };
}

function checkGenderEligibility(user: User, eligibilityText: string): { passed: boolean; reason: string } {
  const genderKeywords = ['male', 'female', 'women', 'woman', 'men', 'man', 'transgender'];
  
  const hasGenderRequirement = genderKeywords.some(keyword => 
    eligibilityText.includes(keyword.toLowerCase())
  );

  if (!hasGenderRequirement) {
    return { passed: true, reason: "" };
  }

  if (!user.gender) {
    return { passed: false, reason: "Gender information required but not provided" };
  }

  const userGender = user.gender.toLowerCase();
  
  // Check direct gender match
  if (eligibilityText.includes(userGender)) {
    return { passed: true, reason: "Gender requirement met" };
  }

  // Check alternative gender terms
  if ((userGender === 'female' || userGender === 'woman') && 
      (eligibilityText.includes('women') || eligibilityText.includes('woman'))) {
    return { passed: true, reason: "Gender requirement met" };
  }

  if ((userGender === 'male' || userGender === 'man') && 
      (eligibilityText.includes('men') || eligibilityText.includes('man'))) {
    return { passed: true, reason: "Gender requirement met" };
  }

  return { 
    passed: false, 
    reason: `Gender requirement not met. User gender: ${user.gender}` 
  };
}

function checkOccupationEligibility(user: User, eligibilityText: string, schemeTags: string[]): { passed: boolean; reason: string } {
  if (!user.occupation) {
    // Check if occupation is mentioned in eligibility or tags
    const occupationKeywords = ['farmer', 'student', 'unemployed', 'self-employed', 'employee', 'business', 'entrepreneur'];
    const hasOccupationRequirement = occupationKeywords.some(keyword => 
      eligibilityText.includes(keyword) || schemeTags.some(tag => tag.includes(keyword))
    );

    if (hasOccupationRequirement) {
      return { passed: false, reason: "Occupation information required but not provided" };
    }
    return { passed: true, reason: "" };
  }

  const userOccupation = user.occupation.toLowerCase();

  // Check in eligibility text
  if (eligibilityText.includes(userOccupation)) {
    return { passed: true, reason: "Occupation requirement met in eligibility criteria" };
  }

  // Check in scheme tags
  const occupationInTags = schemeTags.some(tag => 
    tag.includes(userOccupation) || userOccupation.includes(tag)
  );

  if (occupationInTags) {
    return { passed: true, reason: "Occupation requirement met in scheme tags" };
  }

  // Check for related occupation terms
  const occupationRelations = {
    'farmer': ['agriculture', 'farming', 'plantation', 'tea', 'crop'],
    'student': ['education', 'educational', 'training', 'skill'],
    'business': ['entrepreneur', 'self-employed', 'manufacturing', 'enterprise'],
    'unemployed': ['job', 'employment', 'skill development']
  };

  for (const [occupation, relatedTerms] of Object.entries(occupationRelations)) {
    if (userOccupation.includes(occupation)) {
      const hasRelatedTerm = relatedTerms.some(term => 
        eligibilityText.includes(term) || schemeTags.some(tag => tag.includes(term))
      );
      if (hasRelatedTerm) {
        return { passed: true, reason: `Occupation-related requirement met for ${occupation}` };
      }
    }
  }

  // If occupation is mentioned in scheme but doesn't match user
  const occupationMentioned = eligibilityText.includes('farmer') || 
                             eligibilityText.includes('student') || 
                             eligibilityText.includes('business') ||
                             schemeTags.some(tag => 
                               tag.includes('farmer') || 
                               tag.includes('student') || 
                               tag.includes('business')
                             );

  if (occupationMentioned) {
    return { 
      passed: false, 
      reason: `Occupation requirement not met. User occupation: ${user.occupation}` 
    };
  }

  return { passed: true, reason: "" };
}
