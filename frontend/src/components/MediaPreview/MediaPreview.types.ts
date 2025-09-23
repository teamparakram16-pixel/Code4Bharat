export interface MediaUpload {
  images: string[];
  video: string;
  document: string;
}

export interface MediaPreviewProps {
  media: MediaUpload;
  onMediaClick: (index: number, images: string[]) => void;
}
