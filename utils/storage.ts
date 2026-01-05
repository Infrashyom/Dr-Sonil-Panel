
import { Appointment, GalleryItem, SiteConfig, HeroSlide, ContentItem } from '../types';

const API_URL = 'http://localhost:5000/api';

// Fallback config to prevent null crashes
const DEFAULT_CONFIG: SiteConfig = {
  name: "Dr. Sonil Women's Care Centre",
  doctorName: "Dr. Sonil Srivastava",
  phone: "+91 98765 43210",
  email: "hello@drsonil.com",
  address: "E-7/123, Arera Colony, Bhopal",
  whatsapp: "919876543210",
  timings: "Mon - Sat: 10:00 AM - 08:00 PM",
  socials: { instagram: "", facebook: "", youtube: "" }
};

export const storage = {
  // --- APPOINTMENTS ---
  getAppointments: async (): Promise<Appointment[]> => {
    try {
      const res = await fetch(`${API_URL}/appointments`);
      if (!res.ok) throw new Error('Failed to fetch');
      return await res.json();
    } catch (err) {
      console.error(err);
      return [];
    }
  },

  addAppointment: async (apt: Omit<Appointment, 'id' | 'status' | 'createdAt'>) => {
    const res = await fetch(`${API_URL}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(apt),
    });
    return await res.json();
  },

  updateAppointmentStatus: async (id: string, status: Appointment['status']) => {
    await fetch(`${API_URL}/appointments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  },

  // --- GALLERY ---
  getGallery: async (): Promise<GalleryItem[]> => {
    try {
      const res = await fetch(`${API_URL}/gallery`);
      return await res.json();
    } catch (err) {
      return [];
    }
  },

  addGalleryItem: async (item: Omit<GalleryItem, 'id'>) => {
    await fetch(`${API_URL}/gallery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
  },

  deleteGalleryItem: async (id: string) => {
    await fetch(`${API_URL}/gallery/${id}`, { method: 'DELETE' });
  },

  toggleGalleryFeature: async (id: string) => {
    await fetch(`${API_URL}/gallery/${id}/feature`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    });
  },

  // --- HERO SLIDES ---
  getHeroSlides: async (): Promise<HeroSlide[]> => {
    try {
      const res = await fetch(`${API_URL}/hero`);
      return await res.json();
    } catch (err) {
      return [];
    }
  },

  addHeroSlide: async (item: Omit<HeroSlide, 'id'>) => {
    await fetch(`${API_URL}/hero`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
  },

  deleteHeroSlide: async (id: string) => {
    await fetch(`${API_URL}/hero/${id}`, { method: 'DELETE' });
  },

  // --- CONFIG ---
  getConfig: async (): Promise<SiteConfig> => {
    try {
      const res = await fetch(`${API_URL}/config`);
      if (!res.ok) throw new Error('Backend not available');
      return await res.json();
    } catch (err) {
      return DEFAULT_CONFIG;
    }
  },

  updateConfig: async (config: SiteConfig) => {
    await fetch(`${API_URL}/config`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
  },

  // --- GENERIC CONTENT (Services, FAQs, Doctors, etc) ---
  getContent: async (type: string): Promise<ContentItem[]> => {
    try {
      const res = await fetch(`${API_URL}/content?type=${type}`);
      return await res.json();
    } catch (err) {
      return [];
    }
  },

  addContent: async (type: string, data: any) => {
    await fetch(`${API_URL}/content`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, data }),
    });
  },

  updateContent: async (id: string, data: any) => {
     await fetch(`${API_URL}/content/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data }),
    });
  },

  deleteContent: async (id: string) => {
    await fetch(`${API_URL}/content/${id}`, { method: 'DELETE' });
  },

  // --- AUTH ---
  login: async (password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/config/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('dr_sonil_auth', 'true');
        return true;
      }
      return false;
    } catch (err) {
      console.error("Login Error", err);
      return false;
    }
  },

  logout: () => localStorage.removeItem('dr_sonil_auth'),
  
  isAuthenticated: () => localStorage.getItem('dr_sonil_auth') === 'true',
  
  changePassword: async (newPassword: string) => {
    await fetch(`${API_URL}/config/password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newPassword }),
    });
  }
};
