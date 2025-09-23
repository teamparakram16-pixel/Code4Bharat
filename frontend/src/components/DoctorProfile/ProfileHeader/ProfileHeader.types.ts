export interface Doctor {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  hospital: string;
  verified: boolean;
  location: string;
  about: string;
  followers: number;
  following: number;
  posts: number;
}

export interface ProfileHeaderProps {
  doctor: Doctor;
  isFollowing: boolean;
  onFollow: () => void;
  onMessage: () => void;
  onBookAppointment: () => void;
}
