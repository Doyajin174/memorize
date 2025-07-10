import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeContent, searchMemories } from "./services/openai";
import { 
  insertMemorySchema, 
  insertCategorySchema, 
  searchMemorySchema, 
  chatMessageSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Categories routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ message: "Invalid category data" });
    }
  });

  // Memories routes
  app.get("/api/memories", async (req, res) => {
    try {
      const { categoryId } = req.query;
      
      let memories;
      if (categoryId) {
        memories = await storage.getMemoriesByCategory(Number(categoryId));
      } else {
        memories = await storage.getMemories();
      }
      
      res.json(memories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch memories" });
    }
  });

  app.get("/api/memories/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const memory = await storage.getMemoryById(id);
      
      if (!memory) {
        return res.status(404).json({ message: "Memory not found" });
      }
      
      res.json(memory);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch memory" });
    }
  });

  app.post("/api/memories", async (req, res) => {
    try {
      const memoryData = insertMemorySchema.parse(req.body);
      const memory = await storage.createMemory(memoryData);
      res.status(201).json(memory);
    } catch (error) {
      res.status(400).json({ message: "Invalid memory data" });
    }
  });

  app.patch("/api/memories/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const updateData = insertMemorySchema.partial().parse(req.body);
      const memory = await storage.updateMemory(id, updateData);
      
      if (!memory) {
        return res.status(404).json({ message: "Memory not found" });
      }
      
      res.json(memory);
    } catch (error) {
      res.status(400).json({ message: "Invalid update data" });
    }
  });

  app.delete("/api/memories/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const deleted = await storage.deleteMemory(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Memory not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete memory" });
    }
  });

  // Search route
  app.post("/api/memories/search", async (req, res) => {
    try {
      const { query, categoryId, limit } = searchMemorySchema.parse(req.body);
      
      let memories;
      if (categoryId) {
        memories = await storage.getMemoriesByCategory(categoryId);
      } else {
        memories = await storage.getMemories();
      }

      // Use AI-powered search
      const searchResults = await searchMemories(query, memories);
      const limitedResults = searchResults.slice(0, limit);
      
      res.json(limitedResults);
    } catch (error) {
      res.status(400).json({ message: "Invalid search parameters" });
    }
  });

  // Chat route for AI analysis
  app.post("/api/chat/analyze", async (req, res) => {
    try {
      const { content } = chatMessageSchema.parse(req.body);
      
      // Analyze content with AI
      const analysis = await analyzeContent(content);
      
      // Find or create category
      const categories = await storage.getCategories();
      let category = categories.find(c => c.name === analysis.category);
      
      if (!category) {
        // Create new category if it doesn't exist
        category = await storage.createCategory({
          name: analysis.category,
          icon: "fas fa-folder",
          color: "gray"
        });
      }

      // Create memory
      const memory = await storage.createMemory({
        content,
        title: analysis.title,
        categoryId: category.id,
        tags: analysis.tags,
        keywords: analysis.keywords,
        structuredData: analysis.structuredData,
        aiScore: analysis.aiScore,
      });

      res.json({
        memory,
        analysis,
        category
      });
    } catch (error) {
      console.error("Chat analysis error:", error);
      res.status(500).json({ message: "Failed to analyze content" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
