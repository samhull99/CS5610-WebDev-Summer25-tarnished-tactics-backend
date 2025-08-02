import { ObjectId } from 'mongodb';

let builds;

export default class BuildsDAO {
  static async injectDB(conn) {
    if (builds) {
      return;
    }
    try {
      builds = await conn.db("tarnished-tactics").collection("builds");
    } catch (e) {
      console.error(`Unable to establish collection handles in BuildsDAO: ${e}`);
    }
  }

  // Get all builds (public and preset builds)
  static async getAllBuilds({ filters = null, page = 0, buildsPerPage = 20 } = {}) {
    let query = {};
    
    // Add filters if provided
    if (filters) {
      if (filters.class) {
        query.class = { $eq: filters.class };
      }
      if (filters.level) {
        query.level = { $lte: parseInt(filters.level) };
      }
      if (filters.isPublic !== undefined) {
        query.isPublic = { $eq: filters.isPublic };
      }
    }

    let cursor;
    try {
      cursor = await builds
        .find(query)
        .limit(buildsPerPage)
        .skip(buildsPerPage * page);
      
      const buildsList = await cursor.toArray();
      const totalNumBuilds = await builds.countDocuments(query);
      
      return { buildsList, totalNumBuilds };
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`);
      return { buildsList: [], totalNumBuilds: 0 };
    }
  }

  // Get builds by user ID
  static async getBuildsByUserId(userId) {
    try {
      const query = { userId: userId };
      return await builds.find(query).toArray();
    } catch (e) {
      console.error(`Unable to get builds by user id: ${e}`);
      return [];
    }
  }

  // Get single build by ID
  static async getBuildById(id) {
    try {
      return await builds.findOne({ _id: new ObjectId(id) });
    } catch (e) {
      console.error(`Unable to get build: ${e}`);
      return null;
    }
  }

  // Create new build
  static async addBuild(userId, buildData) {
    try {
      const buildDoc = {
        userId: userId,
        name: buildData.name,
        description: buildData.description,
        class: buildData.class,
        level: buildData.level,
        stats: {
          vigor: buildData.stats.vigor,
          mind: buildData.stats.mind,
          endurance: buildData.stats.endurance,
          strength: buildData.stats.strength,
          dexterity: buildData.stats.dexterity,
          intelligence: buildData.stats.intelligence,
          faith: buildData.stats.faith,
          arcane: buildData.stats.arcane
        },
        equipment: {
          rightHand: buildData.equipment.rightHand || [],
          leftHand: buildData.equipment.leftHand || [],
          armor: {
            helmet: buildData.equipment.armor.helmet,
            chest: buildData.equipment.armor.chest,
            gauntlets: buildData.equipment.armor.gauntlets,
            legs: buildData.equipment.armor.legs
          },
          talismans: buildData.equipment.talismans || []
        },
        spells: buildData.spells || [],
        isPublic: buildData.isPublic || false,
        isPreset: buildData.isPreset || false,
        tags: buildData.tags || [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      return await builds.insertOne(buildDoc);
    } catch (e) {
      console.error(`Unable to post build: ${e}`);
      return { error: e };
    }
  }

  // Update existing build
  static async updateBuild(buildId, userId, buildData) {
    try {
      const updateDoc = {
        $set: {
          ...buildData,
          updatedAt: new Date()
        }
      };

      return await builds.updateOne(
        { _id: new ObjectId(buildId), userId: userId },
        updateDoc
      );
    } catch (e) {
      console.error(`Unable to update build: ${e}`);
      return { error: e };
    }
  }

  // Delete build
  static async deleteBuild(buildId, userId) {
    try {
      return await builds.deleteOne({
        _id: new ObjectId(buildId),
        userId: userId
      });
    } catch (e) {
      console.error(`Unable to delete build: ${e}`);
      return { error: e };
    }
  }

  // Get preset builds (created by admin/system)
  static async getPresetBuilds() {
    try {
      return await builds.find({ isPreset: true }).toArray();
    } catch (e) {
      console.error(`Unable to get preset builds: ${e}`);
      return [];
    }
  }

  // Search builds by name or tags
  static async searchBuilds(searchTerm) {
    try {
      const query = {
        $or: [
          { name: { $regex: searchTerm, $options: "i" } },
          { description: { $regex: searchTerm, $options: "i" } },
          { tags: { $in: [new RegExp(searchTerm, "i")] } }
        ],
        isPublic: true
      };
      
      return await builds.find(query).toArray();
    } catch (e) {
      console.error(`Unable to search builds: ${e}`);
      return [];
    }
  }
}