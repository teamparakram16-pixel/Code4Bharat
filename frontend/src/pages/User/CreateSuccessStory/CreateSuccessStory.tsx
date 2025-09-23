import { useRef } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import AddSuccessStoryForm, { SuccessStoryFormRef } from "@/components/Forms/User/AddSuccessStoryForm/AddSuccessStoryForm";

const CreateSuccessStory = () => {
  const formRef = useRef<SuccessStoryFormRef>(null);

  const handleDemoFill = (type: 'valid' | 'invalid') => {
    formRef.current?.fillDemoData(type);
  };

  return (
    <Box sx={{ position: "relative" }}>
      {/* Demo Buttons - positioned outside the form */}
      <Box
        sx={{
          position: "fixed",
          top: 80,
          right: 20,
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            color: "text.secondary",
          }}
        >
          Demo
        </Typography>
        <Stack spacing={1}>
          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={() => handleDemoFill('valid')}
            sx={{
              minWidth: 80,
              fontSize: "0.75rem",
              boxShadow: 2,
            }}
          >
            Valid
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleDemoFill('invalid')}
            sx={{
              minWidth: 80,
              fontSize: "0.75rem",
              boxShadow: 2,
            }}
          >
            Invalid
          </Button>
        </Stack>
      </Box>

      <AddSuccessStoryForm ref={formRef} />
    </Box>
  );
};

export default CreateSuccessStory;
