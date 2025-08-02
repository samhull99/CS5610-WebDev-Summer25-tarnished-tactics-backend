import express from 'express';
import GuidesController from './guides.controller.js';

const router = express.Router();

// GET /api/v1/guides - Get all guides with optional filtering
// POST /api/v1/guides - Create new guide
router.route('/')
  .get(GuidesController.apiGetGuides)
  .post(GuidesController.apiPostGuide);

// GET /api/v1/guides/search?q=searchTerm - Search guides
router.route('/search')
  .get(GuidesController.apiSearchGuides);

// GET /api/v1/guides/category/:category - Get guides by category
router.route('/category/:category')
  .get(GuidesController.apiGetGuidesByCategory);

// GET /api/v1/guides/build/:buildId - Get guides that reference a specific build
router.route('/build/:buildId')
  .get(GuidesController.apiGetGuidesByBuildId);

// GET /api/v1/guides/user/:userId - Get guides by user ID
router.route('/user/:userId')
  .get(GuidesController.apiGetGuidesByUserId);

// Routes for specific guide operations
router.route('/:id')
  .get(GuidesController.apiGetGuideById)
  .put(GuidesController.apiUpdateGuide)
  .delete(GuidesController.apiDeleteGuide);

export default router;