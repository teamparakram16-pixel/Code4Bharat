// Type definitions
interface FormFieldConfig {
  name:
    | "Name"
    | "Age"
    | "Gender"
    | "Height"
    | "Weight"
    | "Body_Type"
    | "Skin_Type"
    | "Hair_Type"
    | "Facial_Structure"
    | "Complexion"
    | "Eyes"
    | "Food_Preference"
    | "Bowel_Movement"
    | "Thirst_Level"
    | "Sleep_Duration"
    | "Sleep_Quality"
    | "Energy_Levels"
    | "Daily_Activity_Level"
    | "Exercise_Routine"
    | "Food_Habit"
    | "Water_Intake"
    | "Health_Issues"
    | "Hormonal_Imbalance"
    | "Skin_Hair_Problems"
    | "Ayurvedic_Treatment";
  label: string;
  type: "text" | "number" | "select";
  options?: string[];
  section: number;
  required?: boolean;
}

// Form configuration - all fields organized with their metadata
const FORM_FIELDS: FormFieldConfig[] = [
  // Section 1: Basic Information
  { name: "Name", label: "Name", type: "text", section: 1, required: true },
  { name: "Age", label: "Age", type: "number", section: 1, required: true },
  {
    name: "Gender",
    label: "Gender",
    type: "select",
    options: ["Male", "Female", "Other"],
    section: 1,
    required: true,
  },
  {
    name: "Height",
    label: "Height (cm)",
    type: "number",
    section: 1,
    required: true,
  },
  {
    name: "Weight",
    label: "Weight (kg)",
    type: "number",
    section: 1,
    required: true,
  },

  // Section 2: Physical Characteristics
  {
    name: "Body_Type",
    label: "Body Type",
    type: "select",
    options: ["Heavy", "Lean", "Medium"],
    section: 2,
    required: true,
  },
  {
    name: "Skin_Type",
    label: "Skin Type",
    type: "select",
    options: ["Dry", "Normal", "Oily"],
    section: 2,
    required: true,
  },
  {
    name: "Hair_Type",
    label: "Hair Type",
    type: "select",
    options: ["Curly", "Straight", "Wavy"],
    section: 2,
    required: true,
  },
  {
    name: "Facial_Structure",
    label: "Facial Structure",
    type: "select",
    options: ["Oval", "Round", "Square"],
    section: 2,
    required: true,
  },
  {
    name: "Complexion",
    label: "Complexion",
    type: "select",
    options: ["Dark", "Fair", "Wheatish"],
    section: 2,
    required: true,
  },

  // Section 3: Lifestyle and Habits
  {
    name: "Eyes",
    label: "Eyes",
    type: "select",
    options: ["Large", "Medium", "Small"],
    section: 3,
    required: true,
  },
  {
    name: "Food_Preference",
    label: "Food Preference",
    type: "select",
    options: ["Non-Veg", "Vegan", "Veg"],
    section: 3,
    required: true,
  },
  {
    name: "Bowel_Movement",
    label: "Bowel Movement",
    type: "select",
    options: ["Irregular", "Regular"],
    section: 3,
    required: true,
  },
  {
    name: "Thirst_Level",
    label: "Thirst Level",
    type: "select",
    options: ["High", "Low", "Medium"],
    section: 3,
    required: true,
  },
  {
    name: "Sleep_Duration",
    label: "Sleep Duration (hours)",
    type: "number",
    section: 3,
    required: true,
  },

  // Section 4: Daily Routine
  {
    name: "Sleep_Quality",
    label: "Sleep Quality",
    type: "select",
    options: ["Average", "Good", "Poor"],
    section: 4,
    required: true,
  },
  {
    name: "Energy_Levels",
    label: "Energy Levels",
    type: "select",
    options: ["High", "Low", "Medium"],
    section: 4,
    required: true,
  },
  {
    name: "Daily_Activity_Level",
    label: "Daily Activity Level",
    type: "select",
    options: ["High", "Low", "Medium"],
    section: 4,
    required: true,
  },
  {
    name: "Exercise_Routine",
    label: "Exercise Routine",
    type: "select",
    options: ["Intense", "Light", "Moderate", "Sedentary"],
    section: 4,
    required: true,
  },
  {
    name: "Food_Habit",
    label: "Food Habit",
    type: "select",
    options: ["Balanced", "Fast Food", "Home Cooked"],
    section: 4,
    required: true,
  },

  // Section 5: Health Information
  {
    name: "Water_Intake",
    label: "Water Intake (liters)",
    type: "select",
    options: ["1", "1.5", "2", "3"],
    section: 5,
    required: true,
  },
  {
    name: "Health_Issues",
    label: "Health Issues",
    type: "select",
    options: ["Diabetes", "Digestive Issues", "Hypertension", "None"],
    section: 5,
    required: true,
  },
  {
    name: "Hormonal_Imbalance",
    label: "Hormonal Imbalance",
    type: "select",
    options: ["Yes", "No"],
    section: 5,
    required: true,
  },
  {
    name: "Skin_Hair_Problems",
    label: "Skin/Hair Problems",
    type: "select",
    options: ["Acne", "Dandruff", "Hairfall", "None"],
    section: 5,
    required: true,
  },
  {
    name: "Ayurvedic_Treatment",
    label: "Ayurvedic Treatment",
    type: "select",
    options: ["Yes", "No"],
    section: 5,
    required: true,
  },
];

export default FORM_FIELDS;
