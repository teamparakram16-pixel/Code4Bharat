export interface Comment {
  _id: string;
  content: string;
  owner: {
    _id: string;
    name?: string;
    email?: string;
    profile?: {
      fullName?: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}
