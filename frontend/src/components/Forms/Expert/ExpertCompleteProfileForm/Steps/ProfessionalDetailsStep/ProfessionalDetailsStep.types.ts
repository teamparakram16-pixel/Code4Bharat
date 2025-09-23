import { Control, FieldErrors, UseFormTrigger } from "react-hook-form";
import { ExpertFormData } from "@/pages/Expert/ExpertCompleteProfile/ExpertCompleteProfile.types";
import type { SelectChangeEvent } from "@mui/material";

export interface ProfessionalDetailsStepProps {
  control: Control<ExpertFormData>;
  errors: FieldErrors<ExpertFormData>;
  councilOptions: string[];
  specializationsOptions: string[];
  languageOptions: string[];
  handleSpecializationChange: (event: SelectChangeEvent<string[]>) => void;
  handleLanguageChange: (event: SelectChangeEvent<string[]>) => void;
  trigger: UseFormTrigger<ExpertFormData>;
}
