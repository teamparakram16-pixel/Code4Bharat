import React, { useState } from 'react';
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
} from '@mui/material';
import {
  ExpandMore,
  Work,
  Schedule,
  LocalHospital,
  Psychology,
  Restaurant,
  Save
} from '@mui/icons-material';
import { motion } from 'framer-motion';

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
  loading = false
}) => {
  const [formData, setFormData] = useState<AppointmentFormData>({
    profession: '',
    workHours: '',
    workEnvironment: '',
    physicalActivity: '',
    wakeUpTime: '',
    sleepTime: '',
    mealTimes: {
      breakfast: '',
      lunch: '',
      dinner: ''
    },
    exerciseTime: '',
    exerciseType: '',
    currentHealthIssues: [],
    healthConcerns: '',
    energyLevels: '',
    stressLevels: '',
    medicalHistory: '',
    surgeries: '',
    allergies: '',
    familyHistory: '',
    medications: '',
    supplements: '',
    dietType: '',
    foodPreferences: '',
    foodAvoidances: '',
    waterIntake: '',
    healthGoals: [],
    specificConcerns: '',
    expectations: '',
    mentalHealthConcerns: '',
    lifeChanges: '',
    socialSupport: '',
    hobbies: ''
  });

  const [expanded, setExpanded] = useState<string>('professional');

  const handleAccordionChange = (panel: string) => (
    _event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    setExpanded(isExpanded ? panel : '');
  };

  const handleInputChange = (field: keyof AppointmentFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    
    if (field === 'mealTimes') {
      const mealType = event.target.name as keyof typeof formData.mealTimes;
      setFormData(prev => ({
        ...prev,
        mealTimes: {
          ...prev.mealTimes,
          [mealType]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleArrayChange = (field: 'currentHealthIssues' | 'healthGoals') => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    const isChecked = event.target.checked;
    
    setFormData(prev => ({
      ...prev,
      [field]: isChecked
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(formData);
  };

  const commonHealthIssues = [
    'Diabetes', 'Hypertension', 'Heart Disease', 'Arthritis', 'Asthma',
    'Digestive Issues', 'Sleep Disorders', 'Anxiety', 'Depression',
    'Chronic Pain', 'Skin Problems', 'Weight Issues'
  ];

  const healthGoals = [
    'Weight Management', 'Stress Reduction', 'Better Sleep', 'Increased Energy',
    'Improved Digestion', 'Mental Clarity', 'Physical Fitness', 'Disease Prevention',
    'Pain Management', 'Hormonal Balance', 'Immune Support', 'Detoxification'
  ];

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Alert severity="info" sx={{ mb: 3 }}>
        Please provide detailed information to help our experts create a personalized routine for you.
        All information is kept strictly confidential.
      </Alert>

      {/* Professional Information */}
      <Accordion 
        expanded={expanded === 'professional'} 
        onChange={handleAccordionChange('professional')}
        sx={{ mb: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box display="flex" alignItems="center" gap={2}>
            <Work color="primary" />
            <Typography variant="h6">Professional Information</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label="Profession/Occupation"
                value={formData.profession}
                onChange={handleInputChange('profession')}
                required
                sx={{ flex: 1, minWidth: '250px' }}
              />
              <TextField
                label="Work Hours (e.g., 9 AM - 6 PM)"
                value={formData.workHours}
                onChange={handleInputChange('workHours')}
                required
                sx={{ flex: 1, minWidth: '250px' }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              <FormControl component="fieldset" sx={{ minWidth: '200px' }}>
                <FormLabel>Work Environment</FormLabel>
                <RadioGroup
                  value={formData.workEnvironment}
                  onChange={handleInputChange('workEnvironment')}
                >
                  <FormControlLabel value="office" control={<Radio />} label="Office/Indoor" />
                  <FormControlLabel value="outdoor" control={<Radio />} label="Outdoor" />
                  <FormControlLabel value="mixed" control={<Radio />} label="Mixed" />
                  <FormControlLabel value="remote" control={<Radio />} label="Work from Home" />
                </RadioGroup>
              </FormControl>
              <FormControl component="fieldset" sx={{ minWidth: '200px' }}>
                <FormLabel>Physical Activity at Work</FormLabel>
                <RadioGroup
                  value={formData.physicalActivity}
                  onChange={handleInputChange('physicalActivity')}
                >
                  <FormControlLabel value="sedentary" control={<Radio />} label="Mostly Sitting" />
                  <FormControlLabel value="moderate" control={<Radio />} label="Moderate Activity" />
                  <FormControlLabel value="active" control={<Radio />} label="Very Active" />
                </RadioGroup>
              </FormControl>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Daily Routine */}
      <Accordion 
        expanded={expanded === 'routine'} 
        onChange={handleAccordionChange('routine')}
        sx={{ mb: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box display="flex" alignItems="center" gap={2}>
            <Schedule color="primary" />
            <Typography variant="h6">Daily Routine</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label="Wake Up Time"
                type="time"
                value={formData.wakeUpTime}
                onChange={handleInputChange('wakeUpTime')}
                InputLabelProps={{ shrink: true }}
                required
                sx={{ flex: 1, minWidth: '200px' }}
              />
              <TextField
                label="Sleep Time"
                type="time"
                value={formData.sleepTime}
                onChange={handleInputChange('sleepTime')}
                InputLabelProps={{ shrink: true }}
                required
                sx={{ flex: 1, minWidth: '200px' }}
              />
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Meal Times</Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                name="breakfast"
                label="Breakfast Time"
                type="time"
                value={formData.mealTimes.breakfast}
                onChange={handleInputChange('mealTimes')}
                InputLabelProps={{ shrink: true }}
                sx={{ flex: 1, minWidth: '150px' }}
              />
              <TextField
                name="lunch"
                label="Lunch Time"
                type="time"
                value={formData.mealTimes.lunch}
                onChange={handleInputChange('mealTimes')}
                InputLabelProps={{ shrink: true }}
                sx={{ flex: 1, minWidth: '150px' }}
              />
              <TextField
                name="dinner"
                label="Dinner Time"
                type="time"
                value={formData.mealTimes.dinner}
                onChange={handleInputChange('mealTimes')}
                InputLabelProps={{ shrink: true }}
                sx={{ flex: 1, minWidth: '150px' }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label="Exercise Time (if any)"
                type="time"
                value={formData.exerciseTime}
                onChange={handleInputChange('exerciseTime')}
                InputLabelProps={{ shrink: true }}
                sx={{ flex: 1, minWidth: '200px' }}
              />
              <TextField
                label="Type of Exercise"
                value={formData.exerciseType}
                onChange={handleInputChange('exerciseType')}
                placeholder="e.g., Yoga, Walking, Gym, Swimming"
                sx={{ flex: 1, minWidth: '200px' }}
              />
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Health Issues */}
      <Accordion 
        expanded={expanded === 'health'} 
        onChange={handleAccordionChange('health')}
        sx={{ mb: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box display="flex" alignItems="center" gap={2}>
            <LocalHospital color="primary" />
            <Typography variant="h6">Current Health Status</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormControl component="fieldset">
              <FormLabel>Current Health Issues (Select all that apply)</FormLabel>
              <FormGroup>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {commonHealthIssues.map((issue) => (
                    <FormControlLabel
                      key={issue}
                      control={
                        <Checkbox
                          checked={formData.currentHealthIssues.includes(issue)}
                          onChange={handleArrayChange('currentHealthIssues')}
                          value={issue}
                        />
                      }
                      label={issue}
                      sx={{ minWidth: '200px' }}
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
              onChange={handleInputChange('healthConcerns')}
              placeholder="Describe any other health issues or symptoms you're experiencing"
            />
            
            <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              <FormControl component="fieldset" sx={{ minWidth: '200px' }}>
                <FormLabel>Energy Levels</FormLabel>
                <RadioGroup
                  value={formData.energyLevels}
                  onChange={handleInputChange('energyLevels')}
                >
                  <FormControlLabel value="low" control={<Radio />} label="Generally Low" />
                  <FormControlLabel value="moderate" control={<Radio />} label="Moderate" />
                  <FormControlLabel value="high" control={<Radio />} label="Generally High" />
                  <FormControlLabel value="variable" control={<Radio />} label="Variable" />
                </RadioGroup>
              </FormControl>
              <FormControl component="fieldset" sx={{ minWidth: '200px' }}>
                <FormLabel>Stress Levels</FormLabel>
                <RadioGroup
                  value={formData.stressLevels}
                  onChange={handleInputChange('stressLevels')}
                >
                  <FormControlLabel value="low" control={<Radio />} label="Low" />
                  <FormControlLabel value="moderate" control={<Radio />} label="Moderate" />
                  <FormControlLabel value="high" control={<Radio />} label="High" />
                  <FormControlLabel value="chronic" control={<Radio />} label="Chronic Stress" />
                </RadioGroup>
              </FormControl>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Medical History & Goals */}
      <Accordion 
        expanded={expanded === 'medical'} 
        onChange={handleAccordionChange('medical')}
        sx={{ mb: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box display="flex" alignItems="center" gap={2}>
            <Psychology color="primary" />
            <Typography variant="h6">Medical History & Goals</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              multiline
              rows={3}
              label="Medical History"
              value={formData.medicalHistory}
              onChange={handleInputChange('medicalHistory')}
              placeholder="Previous diagnoses, chronic conditions, ongoing treatments"
            />
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                multiline
                rows={2}
                label="Previous Surgeries"
                value={formData.surgeries}
                onChange={handleInputChange('surgeries')}
                placeholder="List any surgeries with dates if possible"
                sx={{ flex: 1, minWidth: '250px' }}
              />
              <TextField
                multiline
                rows={2}
                label="Allergies"
                value={formData.allergies}
                onChange={handleInputChange('allergies')}
                placeholder="Food, medicine, environmental allergies"
                sx={{ flex: 1, minWidth: '250px' }}
              />
            </Box>

            <TextField
              multiline
              rows={2}
              label="Current Medications & Supplements"
              value={formData.medications}
              onChange={handleInputChange('medications')}
              placeholder="List all current medications and supplements with dosages"
            />

            <FormControl component="fieldset">
              <FormLabel>Health Goals (Select all that apply)</FormLabel>
              <FormGroup>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {healthGoals.map((goal) => (
                    <FormControlLabel
                      key={goal}
                      control={
                        <Checkbox
                          checked={formData.healthGoals.includes(goal)}
                          onChange={handleArrayChange('healthGoals')}
                          value={goal}
                        />
                      }
                      label={goal}
                      sx={{ minWidth: '200px' }}
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
              onChange={handleInputChange('expectations')}
              placeholder="What do you hope to achieve? Any specific areas you want to focus on?"
            />
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Lifestyle & Diet */}
      <Accordion 
        expanded={expanded === 'lifestyle'} 
        onChange={handleAccordionChange('lifestyle')}
        sx={{ mb: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box display="flex" alignItems="center" gap={2}>
            <Restaurant color="primary" />
            <Typography variant="h6">Lifestyle & Diet</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormControl component="fieldset">
              <FormLabel>Diet Type</FormLabel>
              <RadioGroup
                value={formData.dietType}
                onChange={handleInputChange('dietType')}
                row
              >
                <FormControlLabel value="vegetarian" control={<Radio />} label="Vegetarian" />
                <FormControlLabel value="vegan" control={<Radio />} label="Vegan" />
                <FormControlLabel value="non-vegetarian" control={<Radio />} label="Non-Vegetarian" />
                <FormControlLabel value="mixed" control={<Radio />} label="Mixed Diet" />
              </RadioGroup>
            </FormControl>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label="Daily Water Intake"
                value={formData.waterIntake}
                onChange={handleInputChange('waterIntake')}
                placeholder="e.g., 2-3 liters, 8-10 glasses"
                sx={{ flex: 1, minWidth: '200px' }}
              />
              <TextField
                label="Hobbies and Interests"
                value={formData.hobbies}
                onChange={handleInputChange('hobbies')}
                placeholder="Activities you enjoy, creative pursuits"
                sx={{ flex: 1, minWidth: '200px' }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                multiline
                rows={2}
                label="Food Preferences"
                value={formData.foodPreferences}
                onChange={handleInputChange('foodPreferences')}
                placeholder="Favorite foods, preferred cuisines"
                sx={{ flex: 1, minWidth: '250px' }}
              />
              <TextField
                multiline
                rows={2}
                label="Foods to Avoid"
                value={formData.foodAvoidances}
                onChange={handleInputChange('foodAvoidances')}
                placeholder="Dislikes, intolerances, restrictions"
                sx={{ flex: 1, minWidth: '250px' }}
              />
            </Box>

            <TextField
              multiline
              rows={3}
              label="Mental Health & Life Changes"
              value={formData.mentalHealthConcerns}
              onChange={handleInputChange('mentalHealthConcerns')}
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
            sx={{ px: 6, py: 2, fontSize: '1.1rem' }}
          >
            {loading ? 'Submitting...' : 'Submit Appointment Information'}
          </Button>
        </motion.div>
      </Box>
    </Box>
  );
};

export default AppointmentDataForm;