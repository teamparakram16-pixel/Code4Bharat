export interface VoiceToTextProps {
  onTranscriptChange: (transcript: string) => void;
  disabled?: boolean;
}

export interface VoiceToTextState {
  isListening: boolean;
  transcript: string;
  speechError: string | null;
  isBrowserSupported: boolean;
}
