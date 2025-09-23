import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import FORM_FIELDS from "@/constants/prakrithiFormFields";
import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useImperativeHandle } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import prakrithiFormSchema from "./PrakrithiFromSchema";
import { PrakrithiAnalysisFormProps } from "./PrakrithiForm.types";
import { motion, AnimatePresence } from "framer-motion";
import usePrakrithi from "@/hooks/usePrakrithi/usePrakrithi";
import { demoPrakritiData } from "@/utils/demoData";

export interface PrakritiFormRef {
  fillDemoData: (type: 'valid' | 'invalid') => void;
}

const PrakrithiForm = forwardRef<PrakritiFormRef, PrakrithiAnalysisFormProps>(({
  currentSection,
  setCurrentSection,
  setLoading,
  generatePDF,
  TOTAL_SECTIONS,
  setAnalysisComplete,
  setResponseData,
  setCanDoPk,
  canDoPk
}, ref) => {
  const { findPrakrithi } = usePrakrithi();
  const {
    control,
    handleSubmit,
    trigger,
    reset,
    formState: { isValid },
  } = useForm<z.infer<typeof prakrithiFormSchema>>({
    resolver: zodResolver(prakrithiFormSchema),
    mode: "onChange",
    defaultValues: {
      // Section 1: Basic Information
      Name: "",
      Age: 0,
      Gender: "Male",
      Height: 0,
      Weight: 0,

      // Section 2: Physical Characteristics
      Body_Type: "Medium",
      Skin_Type: "Normal",
      Hair_Type: "Straight",
      Facial_Structure: "Oval",
      Complexion: "Wheatish",

      // Section 3: Lifestyle and Habits
      Eyes: "Medium",
      Food_Preference: "Veg",
      Bowel_Movement: "Regular",
      Thirst_Level: "Medium",
      Sleep_Duration: 0,

      // Section 4: Daily Routine
      Sleep_Quality: "Good",
      Energy_Levels: "Medium",
      Daily_Activity_Level: "Medium",
      Exercise_Routine: "Moderate",
      Food_Habit: "Balanced",

      // Section 5: Health Information
      Water_Intake: "2",
      Health_Issues: "None",
      Hormonal_Imbalance: "No",
      Skin_Hair_Problems: "None",
      Ayurvedic_Treatment: "No",
    },
  });

  // Expose fillDemoData method to parent component
  useImperativeHandle(ref, () => ({
    fillDemoData: (type: 'valid' | 'invalid') => {
      const demoArray = type === 'valid' ? demoPrakritiData.valid : demoPrakritiData.invalid;
      const selectedDemo = demoArray[Math.floor(Math.random() * demoArray.length)];
      
      reset(selectedDemo as any);
      
      // Reset to first section when filling demo data
      setCurrentSection(1);
    }
  }));

  // Animation variants
  const fieldVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  /**
   * Filters form fields for the current section
   */
  const getCurrentSectionFields = () => {
    return FORM_FIELDS.filter((field) => field.section === currentSection);
  };

  /**
   * Handles moving to the next section with validation
   */
  const handleNext = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const currentFields = getCurrentSectionFields();
    const isValid = await trigger(currentFields.map((f) => f.name));

    if (isValid && currentSection < TOTAL_SECTIONS) {
      // Animate section change
      setCurrentSection(currentSection + 1);
    }
  };

  /**
   * Handles form submission to the API
   */
  const onSubmit = async (data: z.infer<typeof prakrithiFormSchema>) => {
    setLoading(true);
    try {
      const processedData = {
        ...data,
        Age: Number(data.Age),
        Height: Number(data.Height),
        Weight: Number(data.Weight),
        Sleep_Duration: Number(data.Sleep_Duration),
      };

      const response = await findPrakrithi(processedData);

      setResponseData(response.data);

      setAnalysisComplete(true);

      await generatePDF(response.data);

      // --- Update usage analytics ---
      // Only if canDoPk is present
      if (canDoPk) {
        // Max values for day/month from backend response or use previous logic
        const maxToday = canDoPk.pkDoneToday + canDoPk.leftPkToday;
        const maxMonth = canDoPk.pkDoneMonthly + canDoPk.leftPkThisMonth;

        const newPkDoneToday = canDoPk.pkDoneToday + 1;
        const newPkDoneMonthly = canDoPk.pkDoneMonthly + 1;

        const leftPkToday = Math.max(maxToday - newPkDoneToday, 0);
        const leftPkThisMonth = Math.max(maxMonth - newPkDoneMonthly, 0);

        setCanDoPk({
          ...canDoPk,
          pkDoneToday: newPkDoneToday,
          pkDoneMonthly: newPkDoneMonthly,
          leftPkToday,
          leftPkThisMonth,
          canDoPrakrithi: leftPkToday > 0 && leftPkThisMonth > 0,
        });
      }
    } catch (error: any) {
      console.error("Error submitting Prakrithi form:", error);
      console.error("Error submitting Prakrithi form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <motion.div
        key={`section-${currentSection}`}
        initial={{ opacity: 0, x: currentSection > 1 ? 20 : -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: currentSection > 1 ? -20 : 20 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {getCurrentSectionFields().map((field, index) => (
          <motion.div
            key={field.name}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={fieldVariants}
          >
            <Controller
              name={field.name}
              control={control}
              render={({ field: controllerField, fieldState: { error } }) => (
                <FormControl fullWidth className="mb-4">
                  {field.type === "select" ? (
                    <>
                      <InputLabel className="text-gray-600 dark:text-gray-300">
                        {field.label}
                      </InputLabel>
                      <Select
                        {...controllerField}
                        label={field.label}
                        error={!!error}
                        className="bg-white/80 dark:bg-gray-700/80 rounded-lg backdrop-blur-sm"
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              borderRadius: "12px",
                              marginTop: "8px",
                              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                              "& .MuiMenuItem-root": {
                                padding: "12px 16px",
                                "&:hover": {
                                  backgroundColor: "rgba(13, 148, 136, 0.1)",
                                },
                              },
                            },
                          },
                        }}
                      >
                        {field.options?.map((option) => (
                          <MenuItem
                            key={option}
                            value={option}
                            sx={{
                              "&.Mui-selected": {
                                backgroundColor: "rgba(13, 148, 136, 0.2)",
                                "&:hover": {
                                  backgroundColor: "rgba(13, 148, 136, 0.3)",
                                },
                              },
                            }}
                          >
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </>
                  ) : (
                    <TextField
                      {...controllerField}
                      label={field.label}
                      type={field.type}
                      error={!!error}
                      helperText={error?.message}
                      variant="outlined"
                      className="bg-white/80 dark:bg-gray-700/80 rounded-lg backdrop-blur-sm"
                      InputProps={{
                        className: "text-gray-800 dark:text-gray-200",
                        sx: {
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#0d9488 !important",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#0d9488 !important",
                            borderWidth: "2px",
                          },
                        },
                      }}
                      InputLabelProps={{
                        sx: {
                          "&.Mui-focused": {
                            color: "#0d9488",
                          },
                        },
                      }}
                    />
                  )}
                  {error && field.type === "select" && (
                    <FormHelperText error>{error.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </motion.div>
        ))}
      </motion.div>

      <div className="flex justify-between gap-4 pt-4">
        <AnimatePresence mode="wait">
          {currentSection > 1 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                type="button"
                variant="outlined"
                onClick={() => setCurrentSection(currentSection - 1)}
                className="w-full sm:w-auto px-6 py-3 text-indigo-600 border-indigo-600 hover:bg-indigo-50 hover:border-indigo-700 rounded-lg"
                sx={{
                  "&:hover": {
                    boxShadow: "0 4px 14px rgba(79, 70, 229, 0.2)",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Previous
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1" />

        <AnimatePresence mode="wait">
          {currentSection < TOTAL_SECTIONS ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                type="button"
                variant="contained"
                onClick={(e) => handleNext(e)}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-teal-600 hover:from-indigo-700 hover:to-teal-700 text-white rounded-lg"
                sx={{
                  "&:hover": {
                    boxShadow: "0 4px 20px rgba(79, 70, 229, 0.4)",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Continue
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "easeInOut",
                  }}
                  className="ml-2"
                >
                  →
                </motion.span>
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                type="submit"
                variant="contained"
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white rounded-lg"
                sx={{
                  "&:hover": {
                    boxShadow: "0 4px 20px rgba(5, 150, 105, 0.4)",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
                // disabled={!isValid}
              >
                <motion.span
                  animate={
                    isValid
                      ? {
                          scale: [1, 1.05, 1],
                          transition: {
                            duration: 1.5,
                            repeat: Infinity,
                          },
                        }
                      : {}
                  }
                >
                  Complete Analysis
                </motion.span>
                {isValid && (
                  <motion.div
                    className="ml-2"
                    animate={{
                      rotate: 360,
                      transition: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      },
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </motion.div>
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
});

PrakrithiForm.displayName = "PrakrithiForm";

export default PrakrithiForm;
