
import { LucideIcon } from 'lucide-react';

export interface Doctor {
  id?: string;
  name: string;
  role: string;
  specialties: string[];
  qualifications: string[];
  image: string;
  socials: {
    instagram?: string;
  };
  achievements: string[];
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string; // Changed from LucideIcon to string for DB storage
  details: string[];
}

export interface Testimonial {
  id: number | string;
  name: string;
  rating: number;
  text: string;
  type: 'video' | 'text';
  videoUrl?: string;
}

export interface FAQ {
  id?: string;
  question: string;
  answer: string;
}

export interface Appointment {
  id: string;
  patientName: string;
  phone: string;
  department: string;
  date: string;
  reason: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  title: string;
  category: 'clinic' | 'events' | 'patients' | 'surgery' | 'videos';
  type: 'image' | 'video' | 'reel';
  featured?: boolean;
}

export interface HeroSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  image: string;
  author: string;
  createdAt: string;
}

export interface SiteConfig {
  name?: string;
  doctorName?: string;
  designation?: string;
  phone: string;
  email: string;
  address: string;
  whatsapp?: string;
  timings?: string;
  socials?: {
    instagram: string;
    facebook: string;
    youtube: string;
  };
  googleMapLink?: string;
  announcement?: string;
  googlePlaceId?: string;
  logo?: string;
  favicon?: string;
  doctorImage?: string;
  reasonsImage?: string;
  aboutVideo?: string;
}

export interface ContentItem {
  _id: string;
  type: 'service' | 'faq' | 'testimonial' | 'doctor';
  data: any;
  order: number;
}
