
import Blog from '../models/Blog.js';
import cloudinary from '../config/cloudinary.js';

// Helper to create slug
const createSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBlogById = async (req, res) => {
  try {
    // Try to find by ID first, then by slug if ID fails cast
    let blog;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        blog = await Blog.findById(req.params.id);
    } 
    
    if (!blog) {
        // Fallback to finding by slug (optional feature) or return 404
         blog = await Blog.findOne({ slug: req.params.id });
    }

    if (blog) {
      res.json(blog);
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createBlog = async (req, res) => {
  try {
    const { title, summary, content, image, author } = req.body;
    let finalImageUrl = image;
    let public_id = null;

    if (image && image.startsWith('data:image')) {
      try {
        const uploadRes = await cloudinary.uploader.upload(image, {
          folder: 'dr_sonil/blogs',
        });
        finalImageUrl = uploadRes.secure_url;
        public_id = uploadRes.public_id;
      } catch (err) {
        console.error("Cloudinary Blog Upload Error", err);
        return res.status(400).json({ message: 'Image upload failed' });
      }
    }

    const blog = await Blog.create({
      title,
      slug: createSlug(title) + '-' + Date.now(), // Ensure uniqueness
      summary,
      content,
      image: finalImageUrl,
      public_id,
      author: author || 'Dr. Sonil'
    });

    res.status(201).json(blog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const { title, summary, content, image, author } = req.body;
    const blog = await Blog.findById(req.params.id);

    if (blog) {
      blog.title = title || blog.title;
      blog.summary = summary || blog.summary;
      blog.content = content || blog.content;
      blog.author = author || blog.author;

      if (image && image !== blog.image && image.startsWith('data:image')) {
        // Delete old image
        if (blog.public_id) {
            await cloudinary.uploader.destroy(blog.public_id);
        }
        // Upload new
        try {
            const uploadRes = await cloudinary.uploader.upload(image, {
              folder: 'dr_sonil/blogs',
            });
            blog.image = uploadRes.secure_url;
            blog.public_id = uploadRes.public_id;
        } catch (err) {
            console.error("Cloudinary Blog Update Error", err);
        }
      }

      const updatedBlog = await blog.save();
      res.json(updatedBlog);
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (blog) {
      if (blog.public_id) {
        await cloudinary.uploader.destroy(blog.public_id);
      }
      await Blog.findByIdAndDelete(req.params.id);
      res.json({ message: 'Blog removed' });
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
