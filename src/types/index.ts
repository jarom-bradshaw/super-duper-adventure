export interface Project {
  title: string;
  date?: string;
  description: string;
  bullets?: string[];
  links?: {
    label: string;
    url: string;
  }[];
  technologies?: string[];
  images?: string[];
}

export interface WorkExperience {
  title: string;
  company: string;
  location: string;
  period: string;
  bullets: string[];
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
  details?: string[];
}

