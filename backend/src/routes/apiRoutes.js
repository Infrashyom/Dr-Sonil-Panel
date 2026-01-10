
import express from 'express';
import * as appointmentController from '../controllers/appointmentController.js';
import * as mediaController from '../controllers/mediaController.js';
import * as configController from '../controllers/configController.js';
import * as contentController from '../controllers/contentController.js';
import * as blogController from '../controllers/blogController.js';

const router = express.Router();

// Generic Upload
router.post('/upload', mediaController.uploadMedia);

// Appointments
router.route('/appointments')
  .get(appointmentController.getAppointments)
  .post(appointmentController.createAppointment);

router.route('/appointments/:id')
  .put(appointmentController.updateStatus);

// Gallery
router.route('/gallery')
  .get(mediaController.getGallery)
  .post(mediaController.addGalleryItem);

router.route('/gallery/:id')
  .delete(mediaController.deleteGalleryItem);

router.route('/gallery/:id/feature')
  .put(mediaController.toggleGalleryFeature);

// Hero
router.route('/hero')
  .get(mediaController.getHeroSlides)
  .post(mediaController.addHeroSlide);

router.route('/hero/:id')
  .delete(mediaController.deleteHeroSlide);

// Config
router.route('/config')
  .get(configController.getConfig)
  .put(configController.updateConfig);

router.post('/config/login', configController.loginAdmin);
router.put('/config/password', configController.updatePassword);

// Content (Services, FAQs, Doctors, Testimonials)
router.route('/content')
  .get(contentController.getContent)
  .post(contentController.addContent);

router.route('/content/:id')
  .put(contentController.updateContent)
  .delete(contentController.deleteContent);

// Blogs
router.route('/blogs')
  .get(blogController.getBlogs)
  .post(blogController.createBlog);

router.route('/blogs/:id')
  .get(blogController.getBlogById)
  .put(blogController.updateBlog)
  .delete(blogController.deleteBlog);

export default router;
