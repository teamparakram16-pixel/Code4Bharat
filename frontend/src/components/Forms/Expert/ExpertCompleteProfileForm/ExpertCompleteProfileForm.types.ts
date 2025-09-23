import { ExpertFormData } from "@/pages/Expert/ExpertCompleteProfile/ExpertCompleteProfile.types";
import {
  Control,
  FieldErrors,
  UseFormSetValue,
  UseFormTrigger,
  UseFormWatch,
} from "react-hook-form";

export interface ExpertProfileFormProps {
  activeStep: number;
  control: Control<ExpertFormData>;
  watch: UseFormWatch<ExpertFormData>;
  errors: FieldErrors<ExpertFormData>;
  setValue: UseFormSetValue<ExpertFormData>;
  trigger: UseFormTrigger<ExpertFormData>;
}

export interface StepProps {
  onNext?: () => void;
  onBack?: () => void;
}
