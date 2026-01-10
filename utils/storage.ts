
import { Appointment, GalleryItem, SiteConfig, HeroSlide, ContentItem, BlogPost } from '../types';

// CHANGED: Use relative path. 
// In Dev: Vite proxies '/api' -> 'http://localhost:5000/api'
// In Prod: The backend serves the frontend, so '/api' refers to the same domain.
const API_URL = '/api';

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

// Helper: Map MongoDB _id to id for frontend
const mapId = (item: any) => {
  if (!item) return item;
  // If item has _id but no id, map it.
  if (item._id && !item.id) {
    return { ...item, id: item._id };
  }
  return item;
};

const mapList = (list: any[]) => {
  if (!Array.isArray(list)) return [];
  return list.map(mapId);
};

export const storage = {
  // --- UPLOAD ---
  uploadMedia: async (base64Image: string): Promise<string> => {
     try {
        const res = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64Image, folder: 'dr_sonil/blogs_inline' })
        });
        const data = await res.json();
        return data.url;
     } catch (err) {
        console.error("Upload failed", err);
        throw new Error("Failed to upload image");
     }
  },

  // --- APPOINTMENTS ---
  getAppointments: async (): Promise<Appointment[]> => {
    try {
      const res = await fetch(`${API_URL}/appointments`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      return mapList(data);
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
    if (!res.ok) throw new Error('Failed to create appointment');
    return mapId(await res.json());
  },

  updateAppointmentStatus: async (id: string, status: Appointment['status']) => {
    const res = await fetch(`${API_URL}/appointments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to update status: ${res.status} ${errorText}`);
    }
    return mapId(await res.json());
  },

  // --- BLOGS ---
  getBlogs: async (): Promise<BlogPost[]> => {
    try {
      const res = await fetch(`${API_URL}/blogs`, { cache: 'no-store' });
      const data = await res.json();
      return mapList(data);
    } catch (err) {
      return [];
    }
  },

  getBlogById: async (id: string): Promise<BlogPost | null> => {
    try {
      const res = await fetch(`${API_URL}/blogs/${id}`, { cache: 'no-store' });
      if (!res.ok) return null;
      const data = await res.json();
      return mapId(data);
    } catch (err) {
      return null;
    }
  },

  addBlog: async (blog: Omit<BlogPost, 'id' | 'createdAt' | 'slug'>) => {
    const res = await fetch(`${API_URL}/blogs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(blog),
    });
    if (!res.ok) throw new Error('Failed to add blog');
    return mapId(await res.json());
  },

  updateBlog: async (id: string, blog: Partial<BlogPost>) => {
    const res = await fetch(`${API_URL}/blogs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(blog),
    });
    if (!res.ok) throw new Error('Failed to update blog');
    return mapId(await res.json());
  },

  deleteBlog: async (id: string) => {
    await fetch(`${API_URL}/blogs/${id}`, { method: 'DELETE' });
  },

  // --- GALLERY ---
  getGallery: async (): Promise<GalleryItem[]> => {
    try {
      const res = await fetch(`${API_URL}/gallery`, { cache: 'no-store' });
      const data = await res.json();
      return mapList(data);
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
      const res = await fetch(`${API_URL}/hero`, { cache: 'no-store' });
      const data = await res.json();
      return mapList(data);
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

  updateHeroSlide: async (id: string, item: Partial<HeroSlide>) => {
    await fetch(`${API_URL}/hero/${id}`, {
      method: 'PUT',
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
      const res = await fetch(`${API_URL}/config`, { cache: 'no-store' });
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
      const res = await fetch(`${API_URL}/content?type=${type}`, { cache: 'no-store' });
      // Content items usually use _id directly in types, but mapping doesn't hurt
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
