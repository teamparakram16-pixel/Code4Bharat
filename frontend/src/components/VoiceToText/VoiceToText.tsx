import { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Mic as MicIcon,
  MicOff as MicOffIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { VoiceToTextProps } from "./VoiceToText.types";

const VoiceToText = ({ onTranscriptChange, disabled = false }: VoiceToTextProps) => {
  const recognitionRef = useRef<any>(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [isBrowserSupported, setIsBrowserSupported] = useState(true);

  useEffect(() => {
    // Initialize speech recognition
    if (!("webkitSpeechRecognition" in window)) {
      setSpeechError("Your browser doesn't support speech recognition");
      setIsBrowserSupported(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setSpeechError(null);
    };

    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setTranscript(transcript);
    };

    recognitionRef.current.onerror = (event: any) => {
      setIsListening(false);
      setSpeechError(`Error occurred in recognition: ${event.error}`);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (transcript) {
      onTranscriptChange(transcript);
    }
  }, [transcript, onTranscriptChange]);

  const startListening = () => {
    try {
      setTranscript("");
      setSpeechError(null);
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
    } catch (err) {
      console.error(err);
      setSpeechError("Could not start microphone. Please check permissions.");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!isBrowserSupported) {
    return null;
  }

  return (
    <>
      <Tooltip title={isListening ? "Stop recording" : "Voice message"}>
        <IconButton
          onClick={toggleListening}
          color={isListening ? "error" : "default"}
          disabled={disabled}
          sx={{
            p: { xs: 0.5, sm: 1 },
            borderRadius: "50%",
            border: isListening ? "2px solid" : "none",
            borderColor: isListening ? "error.main" : "transparent",
            bgcolor: isListening ? "error.light" : "transparent",
            "&:hover": {
              bgcolor: isListening ? "error.light" : "action.hover",
              transform: "scale(1.1)",
            },
            transition: "all 0.2s ease",
          }}
        >
          {isListening ? <MicOffIcon /> : <MicIcon />}
        </IconButton>
      </Tooltip>

      {isListening && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Chip
              icon={
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    bgcolor: "error.main",
                    animation: "pulse 1.5s infinite",
                    "@keyframes pulse": {
                      "0%": { opacity: 1 },
                      "50%": { opacity: 0.5 },
                      "100%": { opacity: 1 },
                    },
                  }}
                />
              }
              label="Listening..."
              sx={{ bgcolor: "primary.light", color: "primary.dark" }}
            />
          </Box>
        </motion.div>
      )}

      {speechError && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Typography color="error" sx={{ textAlign: "center", mt: 2 }}>
            {speechError}
          </Typography>
        </motion.div>
      )}
    </>
  );
};

export default VoiceToText;
