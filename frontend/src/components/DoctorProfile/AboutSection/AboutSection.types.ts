export interface Education {
  degree: string;
  university: string;
  year: string;
}

export interface Experience {
  position: string;
  hospital: string;
  period: string;
}

export interface AboutSectionProps {
  doctor: {
    about: string;
    languages: string[];
    email: string;
    phone: string;
    hospital: string;
    location: string;
    university: string;
    experience: number;
    rating: number;
    reviews: number;
    education: Education[];
    experienceList: Experience[];
    specializations: string[];
  };
}
