
import Content from '../models/Content.js';
import cloudinary from '../config/cloudinary.js';

// Initial Data for Seeding
const INITIAL_DATA = [
  // Services
  { type: 'service', data: { id: "ivf", title: "Advanced IVF", description: "Advanced In-Vitro Fertilization offering high success rates.", icon: "TestTube2", details: ["Blastocyst Culture", "Personalized Protocol"] } },
  { type: 'service', data: { id: "delivery", title: "Painless Delivery", description: "Expert management of Painless Normal Delivery & C-sections.", icon: "Baby", details: ["Epidural Analgesia", "Emergency C-Section"] } },
  { type: 'service', data: { id: "laparoscopy", title: "3D Laparoscopy", description: "Minimally invasive surgery with depth perception.", icon: "Activity", details: ["Minimal Scarring", "Quick Recovery"] } },
  
  // FAQs
  { type: 'faq', data: { question: "When is IVF needed?", answer: "IVF is needed when a couple is unable to conceive after a year of trying." } },
  { type: 'faq', data: { question: "Is IVF painful?", answer: "Modern IVF is generally well-managed and not very painful." } },

  // Testimonials
  { type: 'testimonial', data: { id: 1, name: "Manju Sharma", rating: 5, text: "Dr sonil is one of best doctor I have ever met. She delivered our baby normally and painlessly.", type: "text" } },

  // Doctors
  { type: 'doctor', data: { name: "Dr. Sonil Srivastava", role: "IVF Specialist", specialties: ["IVF", "High-Risk Pregnancy"], qualifications: ["MBBS & MS (Gold Medalist)"], image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800", socials: { instagram: "" } } }
];

export const getContent = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = type ? { type } : {};
    
    // Auto-seed if empty
    const count = await Content.countDocuments();
    if (count === 0) {
      await Content.insertMany(INITIAL_DATA);
    }

    const content = await Content.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addContent = async (req, res) => {
  try {
    const { type, data } = req.body;
    
    // Handle Doctor Image upload if present
    if (type === 'doctor' && data.image && data.image.startsWith('data:image')) {
        try {
            const uploadRes = await cloudinary.uploader.upload(data.image, { folder: 'dr_sonil/doctors' });
            data.image = uploadRes.secure_url;
        } catch(e) { console.error(e); }
    }

    const content = await Content.create({ type, data });
    res.status(201).json(content);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateContent = async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = req.body;
    
    const item = await Content.findById(id);
    if (!item) return res.status(404).json({ message: 'Not found' });

    // Handle Doctor Image upload if changed
    if (item.type === 'doctor' && data.image && data.image.startsWith('data:image')) {
        try {
            const uploadRes = await cloudinary.uploader.upload(data.image, { folder: 'dr_sonil/doctors' });
            data.image = uploadRes.secure_url;
        } catch(e) { console.error(e); }
    }

    item.data = data;
    await item.save();
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteContent = async (req, res) => {
  try {
    await Content.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
