import { ObjectId } from 'mongodb';

let guides;

export default class GuidesDAO {
  static async injectDB(conn) {
    if (guides) {
      return;
    }
    try {
      guides = await conn.db("tarnished-tactics").collection("guides");
    } catch (e) {
      console.error(`Unable to establish collection handles in GuidesDAO: ${e}`);
    }
  }

  // Get all guides (public guides)
  static async getAllGuides({ filters = null, page = 0, guidesPerPage = 20 } = {}) {
    let query = { isPublic: true };
    
    // Add filters if provided
    if (filters) {
      if (filters.category) {
        query.category = { $eq: filters.category };
      }
      if (filters.difficulty) {
        query.difficulty = { $eq: filters.difficulty };
      }
      if (filters.tags && filters.tags.length > 0) {
        query.tags = { $in: filters.tags };
      }
    }

    let cursor;
    try {
      cursor = await guides
        .find(query)
        .sort({ createdAt: -1 })
        .limit(guidesPerPage)
        .skip(guidesPerPage * page);
      
      const guidesList = await cursor.toArray();
      const totalNumGuides = await guides.countDocuments(query);
      
      return { guidesList, totalNumGuides };
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`);
      return { guidesList: [], totalNumGuides: 0 };
    }
  }

  // Get guides by user ID
  static async getGuidesByUserId(userId) {
    try {
      const query = { authorId: userId };
      return await guides.find(query).sort({ createdAt: -1 }).toArray();
    } catch (e) {
      console.error(`Unable to get guides by user id: ${e}`);
      return [];
    }
  }

  // Get single guide by ID
  static async getGuideById(id) {
    try {
      return await guides.findOne({ _id: new ObjectId(id) });
    } catch (e) {
      console.error(`Unable to get guide: ${e}`);
      return null;
    }
  }

  // Create new guide
  static async addGuide(userId, guideData) {
    try {
      const guideDoc = {
        authorId: userId,
        title: guideData.title,
        description: guideData.description,
        content: guideData.content, // Rich text/markdown content
        category: guideData.category, // e.g., "Boss Guide", "Build Guide", "Area Guide"
        difficulty: guideData.difficulty, // e.g., "Beginner", "Intermediate", "Advanced"
        associatedBuilds: guideData.associatedBuilds || [], // Array of build IDs
        recommendedLevel: guideData.recommendedLevel,
        tags: guideData.tags || [],
        images: guideData.images || [], // Array of image URLs
        isPublic: guideData.isPublic || false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      return await guides.insertOne(guideDoc);
    } catch (e) {
      console.error(`Unable to post guide: ${e}`);
      return { error: e };
    }
  }

  // Update existing guide
  static async updateGuide(guideId, userId, guideData) {
    try {
      const updateDoc = {
        $set: {
          ...guideData,
          updatedAt: new Date()
        }
      };

      return await guides.updateOne(
        { _id: new ObjectId(guideId), authorId: userId },
        updateDoc
      );
    } catch (e) {
      console.error(`Unable to update guide: ${e}`);
      return { error: e };
    }
  }

  // Delete guide
  static async deleteGuide(guideId, userId) {
    try {
      return await guides.deleteOne({
        _id: new ObjectId(guideId),
        authorId: userId
      });
    } catch (e) {
      console.error(`Unable to delete guide: ${e}`);
      return { error: e };
    }
  }

  // Get guides by category
  static async getGuidesByCategory(category) {
    try {
      return await guides
        .find({ category: category, isPublic: true })
        .sort({ createdAt: -1 })
        .toArray();
    } catch (e) {
      console.error(`Unable to get guides by category: ${e}`);
      return [];
    }
  }

  // Search guides by title, description, or tags
  static async searchGuides(searchTerm) {
    try {
      const query = {
        $or: [
          { title: { $regex: searchTerm, $options: "i" } },
          { description: { $regex: searchTerm, $options: "i" } },
          { content: { $regex: searchTerm, $options: "i" } },
          { tags: { $in: [new RegExp(searchTerm, "i")] } }
        ],
        isPublic: true
      };
      
      return await guides.find(query).sort({ createdAt: -1 }).toArray();
    } catch (e) {
      console.error(`Unable to search guides: ${e}`);
      return [];
    }
  }

  // Get guides that reference a specific build
  static async getGuidesByBuildId(buildId) {
    try {
      return await guides
        .find({ 
          associatedBuilds: buildId,
          isPublic: true 
        })
        .sort({ createdAt: -1 })
        .toArray();
    } catch (e) {
      console.error(`Unable to get guides by build id: ${e}`);
      return [];
    }
  }
}