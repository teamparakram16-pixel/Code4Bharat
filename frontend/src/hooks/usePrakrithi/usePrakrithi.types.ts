export interface PrakrithiFormType {
  // Section 1: Basic Information
  Name: string;
  Age: number;
  Gender: "Male" | "Female" | "Other";
  Height: number;
  Weight: number;

  // Section 2: Physical Characteristics
  Body_Type: "Heavy" | "Lean" | "Medium";
  Skin_Type: "Dry" | "Normal" | "Oily";
  Hair_Type: "Curly" | "Straight" | "Wavy";
  Facial_Structure: "Oval" | "Round" | "Square";
  Complexion: "Dark" | "Fair" | "Wheatish";

  // Section 3: Lifestyle and Habits
  Eyes: "Large" | "Medium" | "Small";
  Food_Preference: "Non-Veg" | "Vegan" | "Veg";
  Bowel_Movement: "Irregular" | "Regular";
  Thirst_Level: "High" | "Low" | "Medium";
  Sleep_Duration: number;

  // Section 4: Daily Routine
  Sleep_Quality: "Average" | "Good" | "Poor";
  Energy_Levels: "High" | "Low" | "Medium";
  Daily_Activity_Level: "High" | "Low" | "Medium";
  Exercise_Routine: "Intense" | "Light" | "Moderate" | "Sedentary";
  Food_Habit: "Balanced" | "Fast Food" | "Home Cooked";

  // Section 5: Health Information
  Water_Intake: "1" | "1.5" | "2" | "3";
  Health_Issues: "Diabetes" | "Digestive Issues" | "Hypertension" | "None";
  Hormonal_Imbalance: "Yes" | "No";
  Skin_Hair_Problems: "Acne" | "Dandruff" | "Hairfall" | "None";
  Ayurvedic_Treatment: "Yes" | "No";
}

export type PrakrithiStatusType = {
  canDoPk: {
    pkDoneToday: number;
    pkDoneMonthly: number;
    canDoPrakrithi: boolean;
    leftPkToday: number;
    leftPkThisMonth: number;
  };
  premium: {
    premiumNo: number | null;
    validTill: string | null;
  };
  prakritiAnalysisExists: boolean;
  prakritiAnalysis: any | null; // you can type this more strictly if you have the model type
};
