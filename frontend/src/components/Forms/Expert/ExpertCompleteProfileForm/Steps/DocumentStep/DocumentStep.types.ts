import { ExpertFormData } from "@/pages/Expert/ExpertCompleteProfile/ExpertCompleteProfile.types";
import { Control, FieldErrors, UseFormTrigger } from "react-hook-form";

export interface DocumentsStepProps {
  control: Control<ExpertFormData>;
  errors: FieldErrors<ExpertFormData>;
  trigger: UseFormTrigger<ExpertFormData>;
}
