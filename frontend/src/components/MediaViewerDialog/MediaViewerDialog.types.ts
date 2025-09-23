export interface MediaViewerDialogProps {
  open: boolean;
  images: string[];
  title?: string;
  selectedImageIndex: number;
  onClose: () => void;
  // onNext: () => void;
  // onPrev: () => void;
}
