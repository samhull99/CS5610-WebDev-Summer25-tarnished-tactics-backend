import express from 'express';
import BuildsController from './builds.controller.js';

const router = express.Router();

// GET /api/v1/builds - Get all builds with optional filtering
router.route('/')
  .get(BuildsController.apiGetBuilds)
  .post(BuildsController.apiPostBuild);

// GET /api/v1/builds/preset - Get preset builds
router.route('/preset')
  .get(BuildsController.apiGetPresetBuilds);

// GET /api/v1/builds/search?q=searchTerm - Search builds
router.route('/search')
  .get(BuildsController.apiSearchBuilds);

// GET /api/v1/builds/user/:userId - Get builds by user ID
router.route('/user/:userId')
  .get(BuildsController.apiGetBuildsByUserId);

// Routes for specific build operations
router.route('/:id')
  .get(BuildsController.apiGetBuildById)
  .put(BuildsController.apiUpdateBuild)
  .delete(BuildsController.apiDeleteBuild);

export default router;