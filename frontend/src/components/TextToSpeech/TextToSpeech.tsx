import React, { useState, useEffect, useRef } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { VolumeUp, Pause, PlayArrow } from '@mui/icons-material';

interface TextToSpeechProps {
  text: string;
  label?: string;
  language?: string;
}

const TextToSpeech = React.forwardRef<HTMLButtonElement, TextToSpeechProps>(({
  text,
  label = 'Read aloud',
  language = 'en-IN' // Default to Indian English
}, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Initialize speech synthesis and voices
  useEffect(() => {
    // Ensure we have access to the speechSynthesis API
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      console.error('Speech synthesis not supported');
      return;
    }

    synthRef.current = window.speechSynthesis;
    const synth = synthRef.current;
    
    // Initial voices load
    const loadVoices = () => {
      const availableVoices = synth.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
        setIsReady(true);
      }
    };

    // Try loading voices immediately
    loadVoices();

    // Set up the event listener for when voices are loaded
    synth.onvoiceschanged = loadVoices;

    // Cleanup
    return () => {
      if (synth) {
        synth.cancel();
      }
    };
  }, []);

  // Create and configure utterance when text or voices change
  useEffect(() => {
    if (voices.length > 0) {
      const newUtterance = new SpeechSynthesisUtterance(text);
      
      // First try to find a clear Indian English voice
      let selectedVoice = voices.find(
        voice => voice.lang === 'en-IN' && 
                (voice.name.toLowerCase().includes('english') || 
                 voice.name.toLowerCase().includes('female'))
      );

      // If no specific Indian English voice found, try any Indian English voice
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => voice.lang === 'en-IN');
      }

      // If still no voice found, try English voices that might have Indian accent
      if (!selectedVoice) {
        selectedVoice = voices.find(
          voice => (voice.lang.startsWith('en-') || voice.lang.startsWith('en_')) &&
                  (voice.name.toLowerCase().includes('indian') || 
                   voice.name.toLowerCase().includes('south asian'))
        );
      }

      // If no Indian-accented voice found, use a clear English voice
      if (!selectedVoice) {
        selectedVoice = voices.find(
          voice => voice.lang === 'en-GB' || voice.lang === 'en-US'
        );
      }
      
      if (selectedVoice) {
        newUtterance.voice = selectedVoice;
        newUtterance.lang = selectedVoice.lang;
      } else {
        newUtterance.lang = 'en-IN';
      }
      
      // Optimize voice properties for clarity
      newUtterance.pitch = 1;  // Natural pitch
      newUtterance.rate = 0.95; // Slightly slower for clarity
      
      // Event handlers
      newUtterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };

      newUtterance.onerror = (event) => {
        if (event.error !== 'interrupted') {
          console.error('Speech synthesis error:', event);
        }
        setIsPlaying(false);
        setIsPaused(false);
      };

      utteranceRef.current = newUtterance;
    }
  }, [text, language, voices]);

  const handlePlay = () => {
    if (!utteranceRef.current || !synthRef.current || !isReady) return;

    const synth = synthRef.current;
    
    if (isPaused) {
      synth.resume();
    } else {
      // Cancel any ongoing speech
      synth.cancel();
      // Create a fresh utterance for better reliability
      const freshUtterance = new SpeechSynthesisUtterance(utteranceRef.current.text);
      freshUtterance.voice = utteranceRef.current.voice;
      freshUtterance.lang = utteranceRef.current.lang;
      freshUtterance.pitch = utteranceRef.current.pitch;
      freshUtterance.rate = utteranceRef.current.rate;
      
      // Setup event handlers on the fresh utterance
      freshUtterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };

      freshUtterance.onerror = (event) => {
        if (event.error !== 'interrupted') {
          console.error('Speech synthesis error:', event);
        }
        setIsPlaying(false);
        setIsPaused(false);
      };
      
      synth.speak(freshUtterance);
    }
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    if (!synthRef.current || !isReady) return;

    const synth = synthRef.current;
    if (isPlaying) {
      synth.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const handleToggle = () => {
    if (!isReady) return;
    
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  let icon = <VolumeUp />;
  if (isPlaying) {
    icon = <Pause />;
  } else if (isPaused) {
    icon = <PlayArrow />;
  }

  // Always render the button, but disable it until voices are ready
  return (
    <Tooltip title={!isReady ? 'Loading voice...' : isPaused ? 'Resume' : isPlaying ? 'Pause' : label}>
      <span>
        <IconButton
          ref={ref}
          onClick={handleToggle}
          size="small"
          disabled={!isReady}
          sx={{
            color: !isReady ? 'grey.400' : (isPlaying || isPaused) ? "primary.main" : "grey.600",
            '&.Mui-disabled': {
              color: 'grey.400',
            }
          }}
          aria-label={!isReady ? 'Loading voice' : isPaused ? 'Resume reading' : isPlaying ? 'Pause reading' : 'Start reading'}
        >
          {icon}
        </IconButton>
      </span>
    </Tooltip>
  );
});

export default TextToSpeech;