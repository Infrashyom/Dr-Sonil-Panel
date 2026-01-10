
import { Gallery, Hero } from '../models/Media.js';
import cloudinary from '../config/cloudinary.js';

// --- GENERIC UPLOAD ---
export const uploadMedia = async (req, res) => {
  try {
    const { image, folder } = req.body;
    if (!image) return res.status(400).json({ message: 'No image provided' });

    const uploadRes = await cloudinary.uploader.upload(image, {
      folder: folder || 'dr_sonil/uploads',
    });

    res.json({ url: uploadRes.secure_url, public_id: uploadRes.public_id });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: 'Upload failed' });
  }
};

// --- GALLERY ---

export const getGallery = async (req, res) => {
  try {
    const items = await Gallery.find({}).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addGalleryItem = async (req, res) => {
  try {
    const { url, title, category, type, featured } = req.body;
    
    let finalUrl = url;
    let public_id = null;

    // Only upload to Cloudinary if it's an image
    if (type !== 'video') {
      try {
        const uploadRes = await cloudinary.uploader.upload(url, {
          folder: 'dr_sonil/gallery',
        });
        finalUrl = uploadRes.secure_url;
        public_id = uploadRes.public_id;
      } catch (uploadError) {
        console.error("Cloudinary Error:", uploadError);
        return res.status(400).json({ message: 'Image upload failed' });
      }
    }

    const item = await Gallery.create({ 
      url: finalUrl, 
      public_id,
      title, 
      category,
      type: type || 'image',
      featured: featured || false
    });
    
    res.status(201).json(item);
  } catch (error) {
    console.error("Controller Error:", error);
    res.status(400).json({ message: 'Operation failed' });
  }
};

export const toggleGalleryFeature = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    item.featured = !item.featured;
    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    // Delete from Cloudinary if public_id exists (images only)
    if (item.public_id) {
      await cloudinary.uploader.destroy(item.public_id);
    }

    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- HERO SLIDES ---

export const getHeroSlides = async (req, res) => {
  try {
    const slides = await Hero.find({});
    res.json(slides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addHeroSlide = async (req, res) => {
  try {
    const { image, title, subtitle } = req.body;

    // Upload to Cloudinary
    const uploadRes = await cloudinary.uploader.upload(image, {
      folder: 'dr_sonil/hero',
    });

    const slide = await Hero.create({ 
      image: uploadRes.secure_url, 
      public_id: uploadRes.public_id,
      title, 
      subtitle 
    });
    
    res.status(201).json(slide);
  } catch (error) {
    console.error("Cloudinary Error:", error);
    res.status(400).json({ message: 'Image upload failed' });
  }
};

export const updateHeroSlide = async (req, res) => {
  try {
    const { image, title, subtitle } = req.body;
    const slide = await Hero.findById(req.params.id);
    
    if (!slide) return res.status(404).json({ message: 'Slide not found' });

    // Handle Image Update
    if (image && image !== slide.image && image.startsWith('data:image')) {
       // Delete old image from Cloudinary
       if (slide.public_id) {
         await cloudinary.uploader.destroy(slide.public_id);
       }
       
       // Upload new
       const uploadRes = await cloudinary.uploader.upload(image, {
         folder: 'dr_sonil/hero',
       });
       slide.image = uploadRes.secure_url;
       slide.public_id = uploadRes.public_id;
    }

    slide.title = title || slide.title;
    slide.subtitle = subtitle || slide.subtitle;
    
    await slide.save();
    res.json(slide);
  } catch (error) {
    console.error("Update Error:", error);
    res.status(400).json({ message: 'Update failed' });
  }
};

export const deleteHeroSlide = async (req, res) => {
  try {
    const slide = await Hero.findById(req.params.id);
    if (!slide) return res.status(404).json({ message: 'Slide not found' });

    // Delete from Cloudinary
    if (slide.public_id) {
      await cloudinary.uploader.destroy(slide.public_id);
    }

    await Hero.findByIdAndDelete(req.params.id);
    res.json({ message: 'Slide removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
