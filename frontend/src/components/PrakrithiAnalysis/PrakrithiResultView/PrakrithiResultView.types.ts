export interface PrakrithiResultViewProps {
  responseData: { Dominant_Prakrithi: string };
  download: () => void;
  sendEmail: () => void;
  emailLoading: boolean;
  findSimilarPkUsers: () => void;
  findSimilarPkUsersLoad: boolean;
}
