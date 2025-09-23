import React from "react";
import { Card, CardContent, SelectChangeEvent } from "@mui/material";
import PersonalInformationStep from "./Steps/PersonalInformationStep/PersonalInformationStep";
import ProfessionalDetailsStep from "./Steps/ProfessionalDetailsStep/ProfessionalDetailsStep";
import QualificationsStep from "./Steps/QualificationsStep/QualificationsStep";
import DocumentsStep from "./Steps/DocumentStep/DocumentsStep";
import ReviewStep from "./Steps/ReviewStep/ReviewStep";
import { ExpertProfileFormProps } from "./ExpertCompleteProfileForm.types";
import {
  councilOptions,
  languageOptions,
  specializationsOptions,
} from "@/constants/expertCompleteProfile";

const ExpertCompleteProfileForm: React.FC<ExpertProfileFormProps> = ({
  activeStep,
  control,
  errors,
  watch,
  setValue,
  trigger,
}) => {
  const formData = watch();

  const handleSpecializationChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    setValue(
      "specializations",
      value.length > 0 ? (value as [string, ...string[]]) : ([] as any)
    );
  };

  const handleLanguageChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    setValue(
      "languages",
      value.length > 0 ? (value as [string, ...string[]]) : ([] as any)
    );
  };

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <PersonalInformationStep
            trigger={trigger}
            control={control}
            errors={errors}
          />
        );
      case 1:
        return (
          <ProfessionalDetailsStep
            control={control}
            trigger={trigger}
            errors={errors}
            handleSpecializationChange={handleSpecializationChange}
            handleLanguageChange={handleLanguageChange}
            councilOptions={councilOptions}
            specializationsOptions={specializationsOptions}
            languageOptions={languageOptions}
          />
        );
      case 2:
        return (
          <QualificationsStep
            trigger={trigger}
            control={control}
            errors={errors}
          />
        );
      case 3:
        return (
          <DocumentsStep trigger={trigger} control={control} errors={errors} />
        );
      case 4:
        return <ReviewStep formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardContent>{renderStep()}</CardContent>
    </Card>
  );
};

export default ExpertCompleteProfileForm;
