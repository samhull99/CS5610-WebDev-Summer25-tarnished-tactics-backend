import BuildsDAO from '../dao/buildsDAO.js';

export default class BuildsController {
  
  // Get all builds with optional filtering and pagination
  static async apiGetBuilds(req, res, next) {
    const buildsPerPage = req.query.buildsPerPage ? parseInt(req.query.buildsPerPage, 10) : 20;
    const page = req.query.page ? parseInt(req.query.page, 10) : 0;

    let filters = {};
    if (req.query.class) {
      filters.class = req.query.class;
    }
    if (req.query.level) {
      filters.level = req.query.level;
    }
    if (req.query.isPublic !== undefined) {
      filters.isPublic = req.query.isPublic === 'true';
    }

    try {
      const { buildsList, totalNumBuilds } = await BuildsDAO.getAllBuilds({
        filters,
        page,
        buildsPerPage,
      });

      let response = {
        builds: buildsList,
        page: page,
        filters: filters,
        entries_per_page: buildsPerPage,
        total_results: totalNumBuilds,
      };

      res.json(response);
    } catch (e) {
      console.error(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }

  // Get builds by user ID
  static async apiGetBuildsByUserId(req, res, next) {
    try {
      let userId = req.params.userId;
      let builds = await BuildsDAO.getBuildsByUserId(userId);
      if (!builds) {
        res.status(404).json({ error: "No builds found for this user" });
        return;
      }
      res.json(builds);
    } catch (e) {
      console.error(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }

  // Get single build by ID
  static async apiGetBuildById(req, res, next) {
    try {
      let id = req.params.id || {};
      let build = await BuildsDAO.getBuildById(id);
      if (!build) {
        res.status(404).json({ error: "Build not found" });
        return;
      }
      res.json(build);
    } catch (e) {
      console.error(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }

  // Create new build
  static async apiPostBuild(req, res, next) {
    try {
      const userId = req.body.userId;
      const buildData = {
        name: req.body.name,
        description: req.body.description,
        class: req.body.class,
        level: req.body.level,
        stats: {
          vigor: req.body.stats?.vigor || 10,
          mind: req.body.stats?.mind || 10,
          endurance: req.body.stats?.endurance || 10,
          strength: req.body.stats?.strength || 10,
          dexterity: req.body.stats?.dexterity || 10,
          intelligence: req.body.stats?.intelligence || 10,
          faith: req.body.stats?.faith || 10,
          arcane: req.body.stats?.arcane || 10
        },
        equipment: {
          rightHand: req.body.equipment?.rightHand || [],
          leftHand: req.body.equipment?.leftHand || [],
          armor: {
            helmet: req.body.equipment?.armor?.helmet || null,
            chest: req.body.equipment?.armor?.chest || null,
            gauntlets: req.body.equipment?.armor?.gauntlets || null,
            legs: req.body.equipment?.armor?.legs || null
          },
          talismans: req.body.equipment?.talismans || []
        },
        spells: req.body.spells || [],
        isPublic: req.body.isPublic || false,
        isPreset: req.body.isPreset || false,
        tags: req.body.tags || []
      };

      // Basic validation
      if (!userId || !buildData.name || !buildData.class) {
        res.status(400).json({ error: "Missing required fields: userId, name, or class" });
        return;
      }

      const buildResponse = await BuildsDAO.addBuild(userId, buildData);
      
      if (buildResponse.error) {
        res.status(400).json({ error: buildResponse.error });
      } else {
        res.json({ status: "success", id: buildResponse.insertedId });
      }
    } catch (e) {
      console.error(`api, ${e}`);
      res.status(500).json({ error: e.message });
    }
  }

  // Update existing build
  static async apiUpdateBuild(req, res, next) {
    try {
      const buildId = req.params.id;
      const userId = req.body.userId;
      
      if (!userId) {
        res.status(400).json({ error: "Missing userId" });
        return;
      }

      const buildData = {
        name: req.body.name,
        description: req.body.description,
        class: req.body.class,
        level: req.body.level,
        stats: req.body.stats,
        equipment: req.body.equipment,
        spells: req.body.spells,
        isPublic: req.body.isPublic,
        tags: req.body.tags
      };

      // Remove undefined fields
      Object.keys(buildData).forEach(key => 
        buildData[key] === undefined && delete buildData[key]
      );

      const buildResponse = await BuildsDAO.updateBuild(buildId, userId, buildData);

      if (buildResponse.error) {
        res.status(400).json({ error: buildResponse.error });
      } else if (buildResponse.matchedCount === 0) {
        res.status(404).json({ error: "Build not found or user not authorized" });
      } else {
        res.json({ status: "success" });
      }
    } catch (e) {
      console.error(`api, ${e}`);
      res.status(500).json({ error: e.message });
    }
  }

  // Delete build
  static async apiDeleteBuild(req, res, next) {
    try {
      const buildId = req.params.id;
      const userId = req.body.userId;

      if (!userId) {
        res.status(400).json({ error: "Missing userId" });
        return;
      }

      const deleteResponse = await BuildsDAO.deleteBuild(buildId, userId);

      if (deleteResponse.error) {
        res.status(400).json({ error: deleteResponse.error });
      } else if (deleteResponse.deletedCount === 0) {
        res.status(404).json({ error: "Build not found or user not authorized" });
      } else {
        res.json({ status: "success" });
      }
    } catch (e) {
      console.error(`api, ${e}`);
      res.status(500).json({ error: e.message });
    }
  }

  // Get preset builds
  static async apiGetPresetBuilds(req, res, next) {
    try {
      let builds = await BuildsDAO.getPresetBuilds();
      res.json(builds);
    } catch (e) {
      console.error(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }

  // Search builds
  static async apiSearchBuilds(req, res, next) {
    try {
      const searchTerm = req.query.q;
      if (!searchTerm) {
        res.status(400).json({ error: "Missing search query parameter 'q'" });
        return;
      }

      let builds = await BuildsDAO.searchBuilds(searchTerm);
      res.json(builds);
    } catch (e) {
      console.error(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }
}