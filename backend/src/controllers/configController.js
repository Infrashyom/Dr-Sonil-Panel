
import Config from '../models/Config.js';
import bcrypt from 'bcryptjs';
import cloudinary from '../config/cloudinary.js';

export const getConfig = async (req, res) => {
  try {
    let config = await Config.findOne({ key: 'main' }).select('-adminPassword');
    
    if (!config) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      config = await Config.create({
        key: 'main',
        adminPassword: hashedPassword
      });
    }
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateConfig = async (req, res) => {
  try {
    const updates = req.body;
    const config = await Config.findOne({ key: 'main' });

    if (config) {
      // Handle Logo Upload
      if (updates.logo && updates.logo.startsWith('data:image')) {
          try {
             const uploadRes = await cloudinary.uploader.upload(updates.logo, {
               folder: 'dr_sonil/config',
             });
             updates.logo = uploadRes.secure_url;
          } catch(err) {
              console.error("Logo Upload Error", err);
          }
      }

      // Handle Favicon Upload
      if (updates.favicon && updates.favicon.startsWith('data:image')) {
          try {
             const uploadRes = await cloudinary.uploader.upload(updates.favicon, {
               folder: 'dr_sonil/config',
             });
             updates.favicon = uploadRes.secure_url;
          } catch(err) {
              console.error("Favicon Upload Error", err);
          }
      }

      // Handle Doctor Image Upload
      if (updates.doctorImage && updates.doctorImage.startsWith('data:image')) {
          try {
             const uploadRes = await cloudinary.uploader.upload(updates.doctorImage, {
               folder: 'dr_sonil/config',
             });
             updates.doctorImage = uploadRes.secure_url;
          } catch(err) {
              console.error("Doctor Image Upload Error", err);
          }
      }

      // Handle Reasons Image Upload
      if (updates.reasonsImage && updates.reasonsImage.startsWith('data:image')) {
          try {
             const uploadRes = await cloudinary.uploader.upload(updates.reasonsImage, {
               folder: 'dr_sonil/config',
             });
             updates.reasonsImage = uploadRes.secure_url;
          } catch(err) {
              console.error("Reasons Image Upload Error", err);
          }
      }

      // Merge updates
      Object.keys(updates).forEach(key => {
        if (key !== 'adminPassword' && key !== 'key') {
           config[key] = updates[key];
        }
      });

      const updatedConfig = await config.save();
      res.json(updatedConfig);
    } else {
      res.status(404).json({ message: 'Config not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const loginAdmin = async (req, res) => {
  const { password } = req.body;
  const config = await Config.findOne({ key: 'main' });
  if (config && (await config.matchPassword(password))) {
    res.json({ success: true, message: 'Authenticated' });
  } else {
    res.status(401).json({ message: 'Invalid password' });
  }
};

export const updatePassword = async (req, res) => {
  const { newPassword } = req.body;
  const config = await Config.findOne({ key: 'main' });
  if (config) {
    config.adminPassword = await bcrypt.hash(newPassword, 10);
    await config.save();
    res.json({ message: 'Password updated' });
  } else {
    res.status(404).json({ message: 'Error updating password' });
  }
};
