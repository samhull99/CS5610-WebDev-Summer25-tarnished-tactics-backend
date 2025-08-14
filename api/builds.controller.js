import BuildsDAO from '../dao/buildsDAO.js';
import OpenAI from 'openai';

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

// Initialize OpenAI client

// Add this to your builds.controller.js

static async apiGenerateGuideFromBuild(req, res, next) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    const buildId = req.params.buildId;
    const userId = req.body.userId;

    if (!userId) {
      res.status(400).json({ error: "Missing userId" });
      return;
    }

    // First, get the build data
    const build = await BuildsDAO.getBuildById(buildId);
    if (!build) {
      res.status(404).json({ error: "Build not found" });
      return;
    }

    const equipmentSummary = {
      rightHand: build.equipment.rightHand || [],
      leftHand: build.equipment.leftHand || [],
      armor: build.equipment.armor || {},
      talismans: build.equipment.talismans || []
    };

    const prompt = `Create an Elden Ring build guide for this data:

BUILD: ${build.name}
CLASS: ${build.class}
LEVEL: ${build.level}
DESCRIPTION: ${build.description || 'No description'}

STATS:
VIG:${build.stats.vigor} MND:${build.stats.mind} END:${build.stats.endurance}
STR:${build.stats.strength} DEX:${build.stats.dexterity} INT:${build.stats.intelligence}
FAI:${build.stats.faith} ARC:${build.stats.arcane}

EQUIPMENT:
Right: ${equipmentSummary.rightHand.join(', ') || 'None'}
Left: ${equipmentSummary.leftHand.join(', ') || 'None'}
Armor: ${equipmentSummary.armor.helmet || 'None'}, ${equipmentSummary.armor.chest || 'None'}
Talismans: ${equipmentSummary.talismans.join(', ') || 'None'}

Decide the difficulty level of the gameplay of this build and change the difficulty field of json accordingly. Do the same for recommendedLevel. The json format below is just an example. Respond with ONLY this JSON format:
{
  "title": "Engaging guide title",
  "description": "One sentence description",
  "content": "Multi-paragraph guide with progression tips, combat strategies, and equipment advice. Use \\n for line breaks. Give strategy advice based on the weapons and armor provided, NOT instructions simply that the build will use that weapon or armor. Describe GAMEPLAY strategy, and suggest specific spells or incantations when applicable",
  "category": "Build Guide",
  "difficulty": "Easy",
  "recommendedLevel": 20,
  "tags": ["dex", "katana", "bleed", "pvp", "samurai"],
  "isPublic": true
}`;

    console.log("📝 Sending prompt to AI...");

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert Elden Ring guide writer. You MUST respond with ONLY valid JSON. No markdown formatting, no code blocks, no explanations - just pure JSON that can be parsed directly."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.5,
      max_completion_tokens: 2000,
    });

    // Get the AI response
    const aiResponse = completion.choices[0].message.content;
    console.log("🤖 Raw AI Response:");
    console.log("Length:", aiResponse ? aiResponse.length : 0);
    console.log("First 100 chars:", aiResponse ? aiResponse.substring(0, 100) : "null");

    if (!aiResponse || aiResponse.trim().length === 0) {
      throw new Error("Empty response from OpenAI");
    }

    // Clean the response aggressively
    let cleanedResponse = aiResponse.trim();
    
    // Remove any markdown code blocks
    cleanedResponse = cleanedResponse.replace(/```json\s*\n?/g, '');
    cleanedResponse = cleanedResponse.replace(/```\s*\n?/g, '');
    
    // Remove any leading/trailing non-JSON text
    const jsonStart = cleanedResponse.indexOf('{');
    const jsonEnd = cleanedResponse.lastIndexOf('}');
    
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      cleanedResponse = cleanedResponse.substring(jsonStart, jsonEnd + 1);
    }
    
    console.log("🧹 Cleaned Response (first 200 chars):", cleanedResponse.substring(0, 200));
    
    // Try to parse - let it fail if it can't be parsed
    const guideData = JSON.parse(cleanedResponse);
    
    // Validate required fields
    if (!guideData.title || !guideData.content) {
      throw new Error("AI response missing required fields (title or content)");
    }
    
    // Add metadata
    guideData.associatedBuilds = [buildId];
    guideData.authorId = userId;

    if (guideData.tags && Array.isArray(guideData.tags)) {
  // Add to beginning of tags array if not already present
  if (!guideData.tags.includes('AI Generated')) {
    guideData.tags = ['AI Generated', ...guideData.tags];
  }
} else {
  guideData.tags = ['AI Generated'];
}

    console.log("✅ Guide generation completed successfully");
    res.json({
      success: true,
      guideData: guideData,
      message: "Guide generated successfully"
    });

  } catch (error) {
    console.error("❌ Error generating guide:", error);
    
    if (error.code === 'insufficient_quota') {
      res.status(402).json({ error: "OpenAI quota exceeded. Please try again later." });
    } else if (error.code === 'rate_limit_exceeded') {
      res.status(429).json({ error: "Rate limit exceeded. Please try again in a moment." });
    } else if (error instanceof SyntaxError) {
      res.status(500).json({ error: "AI returned invalid response format. Please try again." });
    } else {
      res.status(500).json({ error: `Failed to generate guide: ${error.message}` });
    }
  }
}
}