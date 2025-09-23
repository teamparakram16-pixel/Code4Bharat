export const steps = [
  "Personal Information",
  "Professional Details",
  "Qualifications",
  "Documents",
  "Review & Submit",
];

export const specializationsOptions = [
  "Panchakarma",
  "Kaya Chikitsa",
  "Shalya Tantra",
  "Shalakya Tantra",
  "Bala Roga (Pediatrics)",
  "Prasuti Tantra (Obstetrics)",
  "Agada Tantra (Toxicology)",
  "Rasayana (Rejuvenation)",
  "Vajikarana (Aphrodisiac Therapy)",
];

export const languageOptions = [
  "Hindi",
  "English",
  "Sanskrit",
  "Bengali",
  "Tamil",
  "Telugu",
  "Marathi",
  "Gujarati",
  "Punjabi",
  "Malayalam",
  "Kannada",
  "Odia",
  "Urdu",
];

export const councilOptions = [
  "Central Council of Indian Medicine (CCIM)",
  "Uttar Pradesh Ayurvedic and Unani Medicine Board",
  "Maharashtra Council of Indian Medicine",
  "Kerala Ayurveda Medical Council",
  "Tamil Nadu Board of Indian Medicine",
  "Karnataka Ayurveda and Unani Practitioners Board",
  "Gujarat Ayurvedic and Unani Medicine Board",
  "Rajasthan Ayurveda and Unani Medicine Board",
];

export const documentFields = [
  {
    name: "identityProof" as const,
    label: "Identity Proof",
    tooltip: "Government issued ID (Aadhaar, PAN, or Passport)",
    description: "A clear scan/photo of any government-issued ID proof",
  },
  {
    name: "degreeCertificate" as const,
    label: "Degree Certificate",
    tooltip: "Your highest medical/healthcare degree",
    description: "Final year degree certificate from your institution",
  },
  {
    name: "registrationProof" as const,
    label: "Registration Proof",
    tooltip: "Your professional registration certificate",
    description: "Current registration with state medical council",
  },
  {
    name: "practiceProof" as const,
    label: "Practice Proof",
    tooltip: "Proof of current practice",
    description: "Clinic registration or employment certificate",
  },
];
