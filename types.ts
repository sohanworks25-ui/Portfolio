
export interface SEOConfig {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  faviconUrl: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  iconName: string;
}

export interface Profile {
  name: string;
  designation: string;
  bio: string;
  aboutMe: string;
  photoUrl: string;
  resumeUrl: string;
  phone: string;
  email: string;
  yearsOfExperience: string;
  socials: SocialLink[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  category: 'Web' | 'App' | 'Design' | 'Other';
  techStack: string[];
  liveLink?: string;
  githubLink?: string;
  published: boolean;
}

export interface Skill {
  id: string;
  name: string;
  percentage: number;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  enabled: boolean;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  period: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  clientPhoto: string;
  feedback: string;
  published: boolean;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
}

export interface PortfolioData {
  siteName: string;
  logo: string;
  seo: SEOConfig;
  profile: Profile;
  skills: Skill[];
  projects: Project[];
  services: Service[];
  experience: Experience[];
  education: Education[];
  testimonials: Testimonial[];
  messages: Message[];
  analytics: {
    totalViews: number;
    viewHistory: { name: string; views: number }[];
  };
  adminCredentials?: {
    username: string;
    password: string;
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  user: string | null;
}
