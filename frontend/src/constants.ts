const filters = {
  UserType: {
    selectType: "single",
    subFilters: [
      "Ayurvedic Doctor",
      "Naturopathy Practitioner",
      "Health Enthusiast",
      "Patient",
    ],
  },

  HealthConcerns: {
    selectType: "double",
    subFilters: [
      "Digestive Issues",
      "Respiratory Problems",
      "Skin Disorders",
      "Joint Pain",
      "Chronic Diseases",
      "Immunity Boosting",
      "Sleep Disorders",
      "Mental Health",
      "Weight Management",
    ],
  },

  AyurvedicConstituents: {
    selectType: "double",
    subFilters: [
      "Vata Dosha",
      "Pitta Dosha",
      "Kapha Dosha",
      "Tridosha Balance",
      "Herbal Supplements",
      "Rasa (Taste) Analysis",
      "Guna (Properties) Assessment",
    ],
  },

  TreatmentApproach: {
    selectType: "double",
    subFilters: [
      "Herbal Remedies",
      "Dietary Recommendations",
      "Lifestyle Changes",
      "Yoga & Meditation",
      "Detox Therapies",
      "Massage & Panchakarma",
      "Ayurvedic Oils & Pastes",
    ],
  },

  ConsultationType: {
    selectType: "single",
    subFilters: [
      "Online Consultation",
      "In-Person Visit",
      "Telemedicine",
      "Community Programs",
    ],
  },

  PostType: {
    selectType: "double",
    subFilters: [
      "Health Tips",
      "Ayurvedic Remedies",
      "Scientific Research",
      "Patient Testimonials",
      "Wellness Programs",
      "Diet Plans",
      "Yoga & Exercise",
      "Success Stories",
      "Seasonal Health Advice",
      "Detox Plans",
    ],
  },

  NutritionGuidelines: {
    selectType: "double",
    subFilters: [
      "Sattvic Diet",
      "Balanced Dosha Diet",
      "Fasting Techniques",
      "Fermented Foods",
      "Detoxifying Drinks",
    ],
  },

  FitnessRoutine: {
    selectType: "double",
    subFilters: [
      "Yoga Postures",
      "Ayurvedic Exercises",
      "Stretching Techniques",
      "Energy-Boosting Workouts",
    ],
  },

  WomenHealth: {
    selectType: "double",
    subFilters: [
      "Menstrual Health",
      "Prenatal Care",
      "Postpartum Recovery",
      "Hormonal Balance",
    ],
  },

  SleepHealth: {
    selectType: "double",
    subFilters: [
      "Herbal Sleep Aids",
      "Night Rituals",
      "Relaxation Techniques",
      "Circadian Rhythm Balance",
    ],
  },

  ChronicConditionManagement: {
    selectType: "double",
    subFilters: [
      "Diabetes Control",
      "Hypertension Care",
      "Arthritis Management",
      "Thyroid Health",
    ],
  },
};

export default filters;
