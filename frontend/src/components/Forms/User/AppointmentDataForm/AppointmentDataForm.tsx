import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormGroup,
  Button,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  ExpandMore,
  Work,
  Schedule,
  LocalHospital,
  Psychology,
  Restaurant,
  Save,
} from "@mui/icons-material";
import { motion } from "framer-motion";

interface AppointmentFormData {
  // Professional Information
  profession: string;
  workHours: string;
  workEnvironment: string;
  physicalActivity: string;

  // Daily Routine
  wakeUpTime: string;
  sleepTime: string;
  mealTimes: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
  exerciseTime: string;
  exerciseType: string;

  // Health Issues
  currentHealthIssues: string[];
  healthConcerns: string;
  energyLevels: string;
  stressLevels: string;

  // Medical History
  medicalHistory: string;
  surgeries: string;
  allergies: string;
  familyHistory: string;

  // Current Medications
  medications: string;
  supplements: string;

  // Diet and Nutrition
  dietType: string;
  foodPreferences: string;
  foodAvoidances: string;
  waterIntake: string;

  // Goals and Expectations
  healthGoals: string[];
  specificConcerns: string;
  expectations: string;

  // Mental Health and Lifestyle
  mentalHealthConcerns: string;
  lifeChanges: string;
  socialSupport: string;
  hobbies: string;
}

interface AppointmentDataFormProps {
  onSubmit: (data: AppointmentFormData) => void;
  loading?: boolean;
}

const AppointmentDataForm: React.FC<AppointmentDataFormProps> = ({
  onSubmit,
  loading = false,
}) => {
  const [formData, setFormData] = useState<AppointmentFormData>({
    profession: "",
    workHours: "",
    workEnvironment: "",
    physicalActivity: "",
    wakeUpTime: "",
    sleepTime: "",
    mealTimes: {
      breakfast: "",
      lunch: "",
      dinner: "",
    },
    exerciseTime: "",
    exerciseType: "",
    currentHealthIssues: [],
    healthConcerns: "",
    energyLevels: "",
    stressLevels: "",
    medicalHistory: "",
    surgeries: "",
    allergies: "",
    familyHistory: "",
    medications: "",
    supplements: "",
    dietType: "",
    foodPreferences: "",
    foodAvoidances: "",
    waterIntake: "",
    healthGoals: [],
    specificConcerns: "",
    expectations: "",
    mentalHealthConcerns: "",
    lifeChanges: "",
    socialSupport: "",
    hobbies: "",
  });

  const [expanded, setExpanded] = useState<string>("professional");
  const [demoIndex, setDemoIndex] = useState(0);

  const handleAccordionChange =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : "");
    };

  const handleInputChange =
    (field: keyof AppointmentFormData) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;

      if (field === "mealTimes") {
        const mealType = event.target.name as keyof typeof formData.mealTimes;
        setFormData((prev) => ({
          ...prev,
          mealTimes: {
            ...prev.mealTimes,
            [mealType]: value,
          },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [field]: value,
        }));
      }
    };

  const handleArrayChange =
    (field: "currentHealthIssues" | "healthGoals") =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      const isChecked = event.target.checked;

      setFormData((prev) => ({
        ...prev,
        [field]: isChecked
          ? [...prev[field], value]
          : prev[field].filter((item) => item !== value),
      }));
    };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(formData);
  };

  const handleDemoFill = () => {
    setFormData(demoDataSet[demoIndex]);
    setDemoIndex((prev) => (prev + 1) % demoDataSet.length);
  };

  const commonHealthIssues = [
    "Diabetes",
    "Hypertension",
    "Heart Disease",
    "Arthritis",
    "Asthma",
    "Digestive Issues",
    "Sleep Disorders",
    "Anxiety",
    "Depression",
    "Chronic Pain",
    "Skin Problems",
    "Weight Issues",
  ];

  const healthGoals = [
    "Weight Management",
    "Stress Reduction",
    "Better Sleep",
    "Increased Energy",
    "Improved Digestion",
    "Mental Clarity",
    "Physical Fitness",
    "Disease Prevention",
    "Pain Management",
    "Hormonal Balance",
    "Immune Support",
    "Detoxification",
  ];

  const demoDataSet: AppointmentFormData[] = [
    {
      profession: "Software Engineer",
      workHours: "9 AM - 6 PM",
      workEnvironment: "office",
      physicalActivity: "sedentary",
      wakeUpTime: "07:00",
      sleepTime: "23:00",
      mealTimes: { breakfast: "08:00", lunch: "13:00", dinner: "20:00" },
      exerciseTime: "18:00",
      exerciseType: "Walking",
      currentHealthIssues: ["Sleep Disorders", "Anxiety"],
      healthConcerns: "Occasional headaches and fatigue.",
      energyLevels: "moderate",
      stressLevels: "moderate",
      medicalHistory: "No major illnesses.",
      surgeries: "None",
      allergies: "Peanuts",
      familyHistory: "Diabetes, Hypertension",
      medications: "Vitamin D supplement",
      supplements: "Omega 3",
      dietType: "vegetarian",
      foodPreferences: "Indian, Italian",
      foodAvoidances: "Spicy food, Peanuts",
      waterIntake: "2 liters",
      healthGoals: ["Better Sleep", "Stress Reduction"],
      specificConcerns: "Improve sleep quality and reduce stress.",
      expectations: "Personalized routine and diet suggestions.",
      mentalHealthConcerns: "Mild anxiety during work deadlines.",
      lifeChanges: "Recently moved to a new city.",
      socialSupport: "Family and friends",
      hobbies: "Reading, Music, Gardening",
    },
    {
      profession: "Teacher",
      workHours: "8 AM - 3 PM",
      workEnvironment: "office",
      physicalActivity: "moderate",
      wakeUpTime: "06:30",
      sleepTime: "22:30",
      mealTimes: { breakfast: "07:00", lunch: "12:30", dinner: "19:30" },
      exerciseTime: "17:00",
      exerciseType: "Yoga",
      currentHealthIssues: ["Digestive Issues"],
      healthConcerns: "Frequent indigestion.",
      energyLevels: "high",
      stressLevels: "low",
      medicalHistory: "Minor allergies.",
      surgeries: "Appendix removal",
      allergies: "Dust",
      familyHistory: "Asthma",
      medications: "None",
      supplements: "Multivitamin",
      dietType: "mixed",
      foodPreferences: "South Indian",
      foodAvoidances: "Oily food",
      waterIntake: "2.5 liters",
      healthGoals: ["Improved Digestion"],
      specificConcerns: "Better gut health.",
      expectations: "Diet plan for digestion.",
      mentalHealthConcerns: "",
      lifeChanges: "Started new job.",
      socialSupport: "Colleagues",
      hobbies: "Painting, Cycling",
    },
    {
      profession: "Doctor",
      workHours: "10 AM - 7 PM",
      workEnvironment: "office",
      physicalActivity: "active",
      wakeUpTime: "05:30",
      sleepTime: "22:00",
      mealTimes: { breakfast: "06:30", lunch: "12:00", dinner: "19:00" },
      exerciseTime: "05:45",
      exerciseType: "Running",
      currentHealthIssues: ["Hypertension"],
      healthConcerns: "High blood pressure.",
      energyLevels: "variable",
      stressLevels: "high",
      medicalHistory: "Hypertension",
      surgeries: "None",
      allergies: "None",
      familyHistory: "Hypertension",
      medications: "Blood pressure medicine",
      supplements: "",
      dietType: "non-vegetarian",
      foodPreferences: "Continental",
      foodAvoidances: "Red meat",
      waterIntake: "3 liters",
      healthGoals: ["Stress Reduction"],
      specificConcerns: "Lower stress.",
      expectations: "Routine for stress.",
      mentalHealthConcerns: "Work stress.",
      lifeChanges: "New department.",
      socialSupport: "Family",
      hobbies: "Golf, Reading",
    },
    {
      profession: "Student",
      workHours: "Varies",
      workEnvironment: "mixed",
      physicalActivity: "moderate",
      wakeUpTime: "08:00",
      sleepTime: "00:00",
      mealTimes: { breakfast: "09:00", lunch: "14:00", dinner: "21:00" },
      exerciseTime: "19:00",
      exerciseType: "Gym",
      currentHealthIssues: ["Weight Issues"],
      healthConcerns: "Weight gain.",
      energyLevels: "moderate",
      stressLevels: "moderate",
      medicalHistory: "None",
      surgeries: "None",
      allergies: "None",
      familyHistory: "Obesity",
      medications: "",
      supplements: "",
      dietType: "mixed",
      foodPreferences: "Fast food",
      foodAvoidances: "None",
      waterIntake: "1.5 liters",
      healthGoals: ["Weight Management"],
      specificConcerns: "Lose weight.",
      expectations: "Fitness routine.",
      mentalHealthConcerns: "Exam stress.",
      lifeChanges: "Moved to hostel.",
      socialSupport: "Friends",
      hobbies: "Gaming, Football",
    },
    {
      profession: "Artist",
      workHours: "Flexible",
      workEnvironment: "remote",
      physicalActivity: "sedentary",
      wakeUpTime: "09:00",
      sleepTime: "01:00",
      mealTimes: { breakfast: "10:00", lunch: "15:00", dinner: "22:00" },
      exerciseTime: "20:00",
      exerciseType: "Stretching",
      currentHealthIssues: ["Chronic Pain"],
      healthConcerns: "Back pain.",
      energyLevels: "low",
      stressLevels: "chronic",
      medicalHistory: "Chronic back pain.",
      surgeries: "None",
      allergies: "None",
      familyHistory: "Arthritis",
      medications: "Painkillers",
      supplements: "",
      dietType: "vegan",
      foodPreferences: "Vegan",
      foodAvoidances: "Dairy",
      waterIntake: "2 liters",
      healthGoals: ["Pain Management"],
      specificConcerns: "Reduce pain.",
      expectations: "Pain relief routine.",
      mentalHealthConcerns: "Mood swings.",
      lifeChanges: "Started freelancing.",
      socialSupport: "Online groups",
      hobbies: "Drawing, Music",
    },
    {
      profession: "Chef",
      workHours: "2 PM - 11 PM",
      workEnvironment: "outdoor",
      physicalActivity: "active",
      wakeUpTime: "10:00",
      sleepTime: "02:00",
      mealTimes: { breakfast: "11:00", lunch: "16:00", dinner: "23:30" },
      exerciseTime: "12:00",
      exerciseType: "Swimming",
      currentHealthIssues: ["Digestive Issues"],
      healthConcerns: "Acidity.",
      energyLevels: "high",
      stressLevels: "moderate",
      medicalHistory: "Acidity",
      surgeries: "None",
      allergies: "Seafood",
      familyHistory: "None",
      medications: "",
      supplements: "",
      dietType: "non-vegetarian",
      foodPreferences: "Seafood",
      foodAvoidances: "Spicy food",
      waterIntake: "2 liters",
      healthGoals: ["Improved Digestion"],
      specificConcerns: "Reduce acidity.",
      expectations: "Diet suggestions.",
      mentalHealthConcerns: "",
      lifeChanges: "Opened new restaurant.",
      socialSupport: "Staff",
      hobbies: "Cooking, Traveling",
    },
    {
      profession: "Athlete",
      workHours: "6 AM - 10 AM, 4 PM - 8 PM",
      workEnvironment: "outdoor",
      physicalActivity: "active",
      wakeUpTime: "05:00",
      sleepTime: "21:30",
      mealTimes: { breakfast: "06:00", lunch: "12:00", dinner: "19:00" },
      exerciseTime: "06:30",
      exerciseType: "Running, Gym",
      currentHealthIssues: [],
      healthConcerns: "",
      energyLevels: "high",
      stressLevels: "low",
      medicalHistory: "None",
      surgeries: "Knee surgery",
      allergies: "None",
      familyHistory: "None",
      medications: "",
      supplements: "Protein, Creatine",
      dietType: "non-vegetarian",
      foodPreferences: "High protein",
      foodAvoidances: "Sugary foods",
      waterIntake: "4 liters",
      healthGoals: ["Physical Fitness"],
      specificConcerns: "Increase stamina.",
      expectations: "Performance tips.",
      mentalHealthConcerns: "",
      lifeChanges: "Changed coach.",
      socialSupport: "Team",
      hobbies: "Sports, Movies",
    },
    {
      profession: "Business Owner",
      workHours: "8 AM - 8 PM",
      workEnvironment: "mixed",
      physicalActivity: "moderate",
      wakeUpTime: "06:00",
      sleepTime: "23:30",
      mealTimes: { breakfast: "07:30", lunch: "13:30", dinner: "21:00" },
      exerciseTime: "07:00",
      exerciseType: "Cycling",
      currentHealthIssues: ["Stress Reduction"],
      healthConcerns: "High stress.",
      energyLevels: "variable",
      stressLevels: "high",
      medicalHistory: "None",
      surgeries: "None",
      allergies: "None",
      familyHistory: "Heart Disease",
      medications: "",
      supplements: "",
      dietType: "vegetarian",
      foodPreferences: "Indian",
      foodAvoidances: "Fried food",
      waterIntake: "2 liters",
      healthGoals: ["Stress Reduction"],
      specificConcerns: "Reduce stress.",
      expectations: "Stress management routine.",
      mentalHealthConcerns: "Work stress.",
      lifeChanges: "Expanded business.",
      socialSupport: "Family",
      hobbies: "Reading, Traveling",
    },
    {
      profession: "Retired",
      workHours: "N/A",
      workEnvironment: "remote",
      physicalActivity: "moderate",
      wakeUpTime: "06:30",
      sleepTime: "21:00",
      mealTimes: { breakfast: "07:30", lunch: "12:30", dinner: "19:30" },
      exerciseTime: "08:00",
      exerciseType: "Walking",
      currentHealthIssues: ["Arthritis"],
      healthConcerns: "Joint pain.",
      energyLevels: "low",
      stressLevels: "low",
      medicalHistory: "Arthritis",
      surgeries: "Hip replacement",
      allergies: "None",
      familyHistory: "Arthritis",
      medications: "Painkillers",
      supplements: "Calcium",
      dietType: "vegetarian",
      foodPreferences: "Simple food",
      foodAvoidances: "Oily food",
      waterIntake: "1.5 liters",
      healthGoals: ["Pain Management"],
      specificConcerns: "Reduce joint pain.",
      expectations: "Pain relief tips.",
      mentalHealthConcerns: "",
      lifeChanges: "Retirement.",
      socialSupport: "Family",
      hobbies: "Gardening, Reading",
    },
    {
      profession: "Nurse",
      workHours: "7 AM - 3 PM",
      workEnvironment: "office",
      physicalActivity: "active",
      wakeUpTime: "05:30",
      sleepTime: "22:00",
      mealTimes: { breakfast: "06:00", lunch: "12:00", dinner: "19:00" },
      exerciseTime: "17:00",
      exerciseType: "Yoga",
      currentHealthIssues: ["Chronic Pain"],
      healthConcerns: "Leg pain.",
      energyLevels: "moderate",
      stressLevels: "moderate",
      medicalHistory: "Varicose veins.",
      surgeries: "None",
      allergies: "None",
      familyHistory: "Varicose veins",
      medications: "",
      supplements: "",
      dietType: "vegetarian",
      foodPreferences: "Indian",
      foodAvoidances: "Sweet food",
      waterIntake: "2 liters",
      healthGoals: ["Pain Management"],
      specificConcerns: "Reduce leg pain.",
      expectations: "Routine for pain.",
      mentalHealthConcerns: "",
      lifeChanges: "Changed hospital.",
      socialSupport: "Colleagues",
      hobbies: "Music, Yoga",
    },
  ];

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Alert severity="info" sx={{ mb: 3 }}>
        Please provide detailed information to help our experts create a
        personalized routine for you. All information is kept strictly
        confidential.
      </Alert>

      <Box textAlign="right" mb={2}>
        <Button variant="outlined" color="secondary" onClick={handleDemoFill}>
          Fill Demo Data
        </Button>
      </Box>

      {/* Professional Information */}
      <Accordion
        expanded={expanded === "professional"}
        onChange={handleAccordionChange("professional")}
        sx={{ mb: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box display="flex" alignItems="center" gap={2}>
            <Work color="primary" />
            <Typography variant="h6">Professional Information</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <TextField
                label="Profession/Occupation"
                value={formData.profession}
                onChange={handleInputChange("profession")}
                required
                sx={{ flex: 1, minWidth: "250px" }}
              />
              <TextField
                label="Work Hours (e.g., 9 AM - 6 PM)"
                value={formData.workHours}
                onChange={handleInputChange("workHours")}
                required
                sx={{ flex: 1, minWidth: "250px" }}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              <FormControl component="fieldset" sx={{ minWidth: "200px" }}>
                <FormLabel>Work Environment</FormLabel>
                <RadioGroup
                  value={formData.workEnvironment}
                  onChange={handleInputChange("workEnvironment")}
                >
                  <FormControlLabel
                    value="office"
                    control={<Radio />}
                    label="Office/Indoor"
                  />
                  <FormControlLabel
                    value="outdoor"
                    control={<Radio />}
                    label="Outdoor"
                  />
                  <FormControlLabel
                    value="mixed"
                    control={<Radio />}
                    label="Mixed"
                  />
                  <FormControlLabel
                    value="remote"
                    control={<Radio />}
                    label="Work from Home"
                  />
                </RadioGroup>
              </FormControl>
              <FormControl component="fieldset" sx={{ minWidth: "200px" }}>
                <FormLabel>Physical Activity at Work</FormLabel>
                <RadioGroup
                  value={formData.physicalActivity}
                  onChange={handleInputChange("physicalActivity")}
                >
                  <FormControlLabel
                    value="sedentary"
                    control={<Radio />}
                    label="Mostly Sitting"
                  />
                  <FormControlLabel
                    value="moderate"
                    control={<Radio />}
                    label="Moderate Activity"
                  />
                  <FormControlLabel
                    value="active"
                    control={<Radio />}
                    label="Very Active"
                  />
                </RadioGroup>
              </FormControl>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Daily Routine */}
      <Accordion
        expanded={expanded === "routine"}
        onChange={handleAccordionChange("routine")}
        sx={{ mb: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box display="flex" alignItems="center" gap={2}>
            <Schedule color="primary" />
            <Typography variant="h6">Daily Routine</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <TextField
                label="Wake Up Time"
                type="time"
                value={formData.wakeUpTime}
                onChange={handleInputChange("wakeUpTime")}
                InputLabelProps={{ shrink: true }}
                required
                sx={{ flex: 1, minWidth: "200px" }}
              />
              <TextField
                label="Sleep Time"
                type="time"
                value={formData.sleepTime}
                onChange={handleInputChange("sleepTime")}
                InputLabelProps={{ shrink: true }}
                required
                sx={{ flex: 1, minWidth: "200px" }}
              />
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              Meal Times
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <TextField
                name="breakfast"
                label="Breakfast Time"
                type="time"
                value={formData.mealTimes.breakfast}
                onChange={handleInputChange("mealTimes")}
                InputLabelProps={{ shrink: true }}
                sx={{ flex: 1, minWidth: "150px" }}
              />
              <TextField
                name="lunch"
                label="Lunch Time"
                type="time"
                value={formData.mealTimes.lunch}
                onChange={handleInputChange("mealTimes")}
                InputLabelProps={{ shrink: true }}
                sx={{ flex: 1, minWidth: "150px" }}
              />
              <TextField
                name="dinner"
                label="Dinner Time"
                type="time"
                value={formData.mealTimes.dinner}
                onChange={handleInputChange("mealTimes")}
                InputLabelProps={{ shrink: true }}
                sx={{ flex: 1, minWidth: "150px" }}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <TextField
                label="Exercise Time (if any)"
                type="time"
                value={formData.exerciseTime}
                onChange={handleInputChange("exerciseTime")}
                InputLabelProps={{ shrink: true }}
                sx={{ flex: 1, minWidth: "200px" }}
              />
              <TextField
                label="Type of Exercise"
                value={formData.exerciseType}
                onChange={handleInputChange("exerciseType")}
                placeholder="e.g., Yoga, Walking, Gym, Swimming"
                sx={{ flex: 1, minWidth: "200px" }}
              />
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Health Issues */}
      <Accordion
        expanded={expanded === "health"}
        onChange={handleAccordionChange("health")}
        sx={{ mb: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box display="flex" alignItems="center" gap={2}>
            <LocalHospital color="primary" />
            <Typography variant="h6">Current Health Status</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <FormControl component="fieldset">
              <FormLabel>
                Current Health Issues (Select all that apply)
              </FormLabel>
              <FormGroup>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {commonHealthIssues.map((issue) => (
                    <FormControlLabel
                      key={issue}
                      control={
                        <Checkbox
                          checked={formData.currentHealthIssues.includes(issue)}
                          onChange={handleArrayChange("currentHealthIssues")}
                          value={issue}
                        />
                      }
                      label={issue}
                      sx={{ minWidth: "200px" }}
                    />
                  ))}
                </Box>
              </FormGroup>
            </FormControl>

            <TextField
              multiline
              rows={3}
              label="Other Health Concerns or Symptoms"
              value={formData.healthConcerns}
              onChange={handleInputChange("healthConcerns")}
              placeholder="Describe any other health issues or symptoms you're experiencing"
            />

            <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              <FormControl component="fieldset" sx={{ minWidth: "200px" }}>
                <FormLabel>Energy Levels</FormLabel>
                <RadioGroup
                  value={formData.energyLevels}
                  onChange={handleInputChange("energyLevels")}
                >
                  <FormControlLabel
                    value="low"
                    control={<Radio />}
                    label="Generally Low"
                  />
                  <FormControlLabel
                    value="moderate"
                    control={<Radio />}
                    label="Moderate"
                  />
                  <FormControlLabel
                    value="high"
                    control={<Radio />}
                    label="Generally High"
                  />
                  <FormControlLabel
                    value="variable"
                    control={<Radio />}
                    label="Variable"
                  />
                </RadioGroup>
              </FormControl>
              <FormControl component="fieldset" sx={{ minWidth: "200px" }}>
                <FormLabel>Stress Levels</FormLabel>
                <RadioGroup
                  value={formData.stressLevels}
                  onChange={handleInputChange("stressLevels")}
                >
                  <FormControlLabel
                    value="low"
                    control={<Radio />}
                    label="Low"
                  />
                  <FormControlLabel
                    value="moderate"
                    control={<Radio />}
                    label="Moderate"
                  />
                  <FormControlLabel
                    value="high"
                    control={<Radio />}
                    label="High"
                  />
                  <FormControlLabel
                    value="chronic"
                    control={<Radio />}
                    label="Chronic Stress"
                  />
                </RadioGroup>
              </FormControl>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Medical History & Goals */}
      <Accordion
        expanded={expanded === "medical"}
        onChange={handleAccordionChange("medical")}
        sx={{ mb: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box display="flex" alignItems="center" gap={2}>
            <Psychology color="primary" />
            <Typography variant="h6">Medical History & Goals</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              multiline
              rows={3}
              label="Medical History"
              value={formData.medicalHistory}
              onChange={handleInputChange("medicalHistory")}
              placeholder="Previous diagnoses, chronic conditions, ongoing treatments"
            />

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <TextField
                multiline
                rows={2}
                label="Previous Surgeries"
                value={formData.surgeries}
                onChange={handleInputChange("surgeries")}
                placeholder="List any surgeries with dates if possible"
                sx={{ flex: 1, minWidth: "250px" }}
              />
              <TextField
                multiline
                rows={2}
                label="Allergies"
                value={formData.allergies}
                onChange={handleInputChange("allergies")}
                placeholder="Food, medicine, environmental allergies"
                sx={{ flex: 1, minWidth: "250px" }}
              />
            </Box>

            <TextField
              multiline
              rows={2}
              label="Current Medications & Supplements"
              value={formData.medications}
              onChange={handleInputChange("medications")}
              placeholder="List all current medications and supplements with dosages"
            />

            <FormControl component="fieldset">
              <FormLabel>Health Goals (Select all that apply)</FormLabel>
              <FormGroup>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {healthGoals.map((goal) => (
                    <FormControlLabel
                      key={goal}
                      control={
                        <Checkbox
                          checked={formData.healthGoals.includes(goal)}
                          onChange={handleArrayChange("healthGoals")}
                          value={goal}
                        />
                      }
                      label={goal}
                      sx={{ minWidth: "200px" }}
                    />
                  ))}
                </Box>
              </FormGroup>
            </FormControl>

            <TextField
              multiline
              rows={3}
              label="Specific Concerns or Expectations"
              value={formData.expectations}
              onChange={handleInputChange("expectations")}
              placeholder="What do you hope to achieve? Any specific areas you want to focus on?"
            />
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Lifestyle & Diet */}
      <Accordion
        expanded={expanded === "lifestyle"}
        onChange={handleAccordionChange("lifestyle")}
        sx={{ mb: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box display="flex" alignItems="center" gap={2}>
            <Restaurant color="primary" />
            <Typography variant="h6">Lifestyle & Diet</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <FormControl component="fieldset">
              <FormLabel>Diet Type</FormLabel>
              <RadioGroup
                value={formData.dietType}
                onChange={handleInputChange("dietType")}
                row
              >
                <FormControlLabel
                  value="vegetarian"
                  control={<Radio />}
                  label="Vegetarian"
                />
                <FormControlLabel
                  value="vegan"
                  control={<Radio />}
                  label="Vegan"
                />
                <FormControlLabel
                  value="non-vegetarian"
                  control={<Radio />}
                  label="Non-Vegetarian"
                />
                <FormControlLabel
                  value="mixed"
                  control={<Radio />}
                  label="Mixed Diet"
                />
              </RadioGroup>
            </FormControl>

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <TextField
                label="Daily Water Intake"
                value={formData.waterIntake}
                onChange={handleInputChange("waterIntake")}
                placeholder="e.g., 2-3 liters, 8-10 glasses"
                sx={{ flex: 1, minWidth: "200px" }}
              />
              <TextField
                label="Hobbies and Interests"
                value={formData.hobbies}
                onChange={handleInputChange("hobbies")}
                placeholder="Activities you enjoy, creative pursuits"
                sx={{ flex: 1, minWidth: "200px" }}
              />
            </Box>

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <TextField
                multiline
                rows={2}
                label="Food Preferences"
                value={formData.foodPreferences}
                onChange={handleInputChange("foodPreferences")}
                placeholder="Favorite foods, preferred cuisines"
                sx={{ flex: 1, minWidth: "250px" }}
              />
              <TextField
                multiline
                rows={2}
                label="Foods to Avoid"
                value={formData.foodAvoidances}
                onChange={handleInputChange("foodAvoidances")}
                placeholder="Dislikes, intolerances, restrictions"
                sx={{ flex: 1, minWidth: "250px" }}
              />
            </Box>

            <TextField
              multiline
              rows={3}
              label="Mental Health & Life Changes"
              value={formData.mentalHealthConcerns}
              onChange={handleInputChange("mentalHealthConcerns")}
              placeholder="Anxiety, depression, mood issues, recent life changes, stress management needs"
            />
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Submit Button */}
      <Box mt={4} textAlign="center">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            startIcon={loading ? undefined : <Save />}
            sx={{ px: 6, py: 2, fontSize: "1.1rem" }}
          >
            {loading ? "Submitting..." : "Submit Appointment Information"}
          </Button>
        </motion.div>
      </Box>
    </Box>
  );
};

export default AppointmentDataForm;
