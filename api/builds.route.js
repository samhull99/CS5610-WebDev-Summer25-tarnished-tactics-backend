import express from 'express';
import BuildsController from './builds.controller.js';

const router = express.Router();

// GET /api/v1/builds - Get all builds
router.route('/')
  .get(BuildsController.apiGetBuilds)
  .post(BuildsController.apiPostBuild);

// GET /api/v1/builds/preset - Get preset builds  
router.route('/preset')
  .get(BuildsController.apiGetPresetBuilds);

// GET /api/v1/builds/search - Search builds
router.route('/search')
  .get(BuildsController.apiSearchBuilds);

// GET /api/v1/builds/user/:userId - Get builds by user ID
router.route('/user/:userId')
  .get(BuildsController.apiGetBuildsByUserId);

router.route('/:buildId/generate-guide')
  .post(BuildsController.apiGenerateGuideFromBuild);

// Routes for specific build operations (MUST COME AFTER generate-guide)
router.route('/:id')
  .get(BuildsController.apiGetBuildById)
  .put(BuildsController.apiUpdateBuild)
  .delete(BuildsController.apiDeleteBuild);

export default router;