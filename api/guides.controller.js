import GuidesDAO from '../dao/guidesDAO.js';

export default class GuidesController {
  
  // Get all guides with optional filtering and pagination
  static async apiGetGuides(req, res, next) {
    const guidesPerPage = req.query.guidesPerPage ? parseInt(req.query.guidesPerPage, 10) : 20;
    const page = req.query.page ? parseInt(req.query.page, 10) : 0;

    let filters = {};
    if (req.query.category) {
      filters.category = req.query.category;
    }
    if (req.query.difficulty) {
      filters.difficulty = req.query.difficulty;
    }
    if (req.query.tags) {
      filters.tags = req.query.tags.split(',');
    }

    try {
      const { guidesList, totalNumGuides } = await GuidesDAO.getAllGuides({
        filters,
        page,
        guidesPerPage,
      });

      let response = {
        guides: guidesList,
        page: page,
        filters: filters,
        entries_per_page: guidesPerPage,
        total_results: totalNumGuides,
      };

      res.json(response);
    } catch (e) {
      console.error(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }

  // Get guides by user ID
  static async apiGetGuidesByUserId(req, res, next) {
    try {
      let userId = req.params.userId;
      let guides = await GuidesDAO.getGuidesByUserId(userId);
      if (!guides) {
        res.status(404).json({ error: "No guides found for this user" });
        return;
      }
      res.json(guides);
    } catch (e) {
      console.error(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }

  // Get single guide by ID
  static async apiGetGuideById(req, res, next) {
    try {
      let id = req.params.id || {};
      let guide = await GuidesDAO.getGuideById(id);
      if (!guide) {
        res.status(404).json({ error: "Guide not found" });
        return;
      }
      res.json(guide);
    } catch (e) {
      console.error(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }

  // Create new guide
  static async apiPostGuide(req, res, next) {
    try {
      const userId = req.body.userId;
      const guideData = {
        title: req.body.title,
        description: req.body.description,
        content: req.body.content,
        category: req.body.category,
        difficulty: req.body.difficulty,
        associatedBuilds: req.body.associatedBuilds || [],
        recommendedLevel: req.body.recommendedLevel,
        tags: req.body.tags || [],
        images: req.body.images || [],
        isPublic: req.body.isPublic || false
      };

      // Basic validation
      if (!userId || !guideData.title || !guideData.content || !guideData.category) {
        res.status(400).json({ 
          error: "Missing required fields: userId, title, content, or category" 
        });
        return;
      }

      const guideResponse = await GuidesDAO.addGuide(userId, guideData);
      
      if (guideResponse.error) {
        res.status(400).json({ error: guideResponse.error });
      } else {
        res.json({ status: "success", id: guideResponse.insertedId });
      }
    } catch (e) {
      console.error(`api, ${e}`);
      res.status(500).json({ error: e.message });
    }
  }

  // Update existing guide
  static async apiUpdateGuide(req, res, next) {
    try {
      const guideId = req.params.id;
      const userId = req.body.userId;
      
      if (!userId) {
        res.status(400).json({ error: "Missing userId" });
        return;
      }

      const guideData = {
        title: req.body.title,
        description: req.body.description,
        content: req.body.content,
        category: req.body.category,
        difficulty: req.body.difficulty,
        associatedBuilds: req.body.associatedBuilds,
        recommendedLevel: req.body.recommendedLevel,
        tags: req.body.tags,
        images: req.body.images,
        isPublic: req.body.isPublic
      };

      // Remove undefined fields
      Object.keys(guideData).forEach(key => 
        guideData[key] === undefined && delete guideData[key]
      );

      const guideResponse = await GuidesDAO.updateGuide(guideId, userId, guideData);

      if (guideResponse.error) {
        res.status(400).json({ error: guideResponse.error });
      } else if (guideResponse.matchedCount === 0) {
        res.status(404).json({ error: "Guide not found or user not authorized" });
      } else {
        res.json({ status: "success" });
      }
    } catch (e) {
      console.error(`api, ${e}`);
      res.status(500).json({ error: e.message });
    }
  }

  // Delete guide
  static async apiDeleteGuide(req, res, next) {
    try {
      const guideId = req.params.id;
      const userId = req.body.userId;

      if (!userId) {
        res.status(400).json({ error: "Missing userId" });
        return;
      }

      const deleteResponse = await GuidesDAO.deleteGuide(guideId, userId);

      if (deleteResponse.error) {
        res.status(400).json({ error: deleteResponse.error });
      } else if (deleteResponse.deletedCount === 0) {
        res.status(404).json({ error: "Guide not found or user not authorized" });
      } else {
        res.json({ status: "success" });
      }
    } catch (e) {
      console.error(`api, ${e}`);
      res.status(500).json({ error: e.message });
    }
  }

  // Get guides by category
  static async apiGetGuidesByCategory(req, res, next) {
    try {
      const category = req.params.category;
      let guides = await GuidesDAO.getGuidesByCategory(category);
      res.json(guides);
    } catch (e) {
      console.error(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }

  // Search guides
  static async apiSearchGuides(req, res, next) {
    try {
      const searchTerm = req.query.q;
      if (!searchTerm) {
        res.status(400).json({ error: "Missing search query parameter 'q'" });
        return;
      }

      let guides = await GuidesDAO.searchGuides(searchTerm);
      res.json(guides);
    } catch (e) {
      console.error(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }

  // Get guides that reference a specific build
  static async apiGetGuidesByBuildId(req, res, next) {
    try {
      const buildId = req.params.buildId;
      let guides = await GuidesDAO.getGuidesByBuildId(buildId);
      res.json(guides);
    } catch (e) {
      console.error(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }
}