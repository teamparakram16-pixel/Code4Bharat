import { ExpertFormData } from "@/pages/Expert/ExpertCompleteProfile/ExpertCompleteProfile.types";
import { Control, FieldErrors, UseFormTrigger } from "react-hook-form";


export interface PersonalInformationStepProps {
  control: Control<ExpertFormData>;
  errors: FieldErrors<ExpertFormData>;
  defaultDate?: Date;
  trigger: UseFormTrigger<ExpertFormData>;
}
