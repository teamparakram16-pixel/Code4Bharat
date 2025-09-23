export interface SimilarPkUserDialogProps {
  open: boolean;
  onClose: () => void;
  similarPkUsers: Array<{
    user: {
      _id: string;
      profile: {
        fullName: string;
        profileImage?: string;
      };
    };
    similarityPercentage: number;
  }>;
  createNewChat: (userId: string) => void;
  createChatLoad: boolean;
  similarPkUserMessage:string;
}
