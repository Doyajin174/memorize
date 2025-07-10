import { 
  categories, 
  memories, 
  type Category, 
  type Memory, 
  type InsertCategory, 
  type InsertMemory 
} from "@shared/schema";

export interface IStorage {
  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategoryCount(id: number, count: number): Promise<void>;

  // Memories
  getMemories(): Promise<Memory[]>;
  getMemoryById(id: number): Promise<Memory | undefined>;
  getMemoriesByCategory(categoryId: number): Promise<Memory[]>;
  createMemory(memory: InsertMemory): Promise<Memory>;
  updateMemory(id: number, memory: Partial<InsertMemory>): Promise<Memory | undefined>;
  deleteMemory(id: number): Promise<boolean>;
  searchMemories(query: string): Promise<Memory[]>;
}

export class MemStorage implements IStorage {
  private categories: Map<number, Category>;
  private memories: Map<number, Memory>;
  private currentCategoryId: number;
  private currentMemoryId: number;

  constructor() {
    this.categories = new Map();
    this.memories = new Map();
    this.currentCategoryId = 1;
    this.currentMemoryId = 1;
    
    // Initialize default categories
    this.initializeDefaultCategories();
  }

  private initializeDefaultCategories() {
    const defaultCategories: InsertCategory[] = [
      { name: "Game Account", icon: "fas fa-gamepad", color: "blue" },
      { name: "Schedule", icon: "fas fa-calendar", color: "green" },
      { name: "Contact", icon: "fas fa-user", color: "purple" },
      { name: "Idea", icon: "fas fa-lightbulb", color: "yellow" },
      { name: "Quick Note", icon: "fas fa-sticky-note", color: "orange" },
    ];

    defaultCategories.forEach(cat => {
      const category: Category = {
        ...cat,
        id: this.currentCategoryId++,
        count: 0,
      };
      this.categories.set(category.id, category);
    });
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const category: Category = {
      ...insertCategory,
      id: this.currentCategoryId++,
      count: 0,
    };
    this.categories.set(category.id, category);
    return category;
  }

  async updateCategoryCount(id: number, count: number): Promise<void> {
    const category = this.categories.get(id);
    if (category) {
      category.count = count;
      this.categories.set(id, category);
    }
  }

  async getMemories(): Promise<Memory[]> {
    return Array.from(this.memories.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getMemoryById(id: number): Promise<Memory | undefined> {
    return this.memories.get(id);
  }

  async getMemoriesByCategory(categoryId: number): Promise<Memory[]> {
    return Array.from(this.memories.values())
      .filter(memory => memory.categoryId === categoryId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createMemory(insertMemory: InsertMemory): Promise<Memory> {
    const now = new Date();
    const memory: Memory = {
      ...insertMemory,
      id: this.currentMemoryId++,
      categoryId: insertMemory.categoryId ?? null,
      tags: insertMemory.tags ?? [],
      keywords: insertMemory.keywords ?? [],
      structuredData: insertMemory.structuredData ?? {},
      aiScore: insertMemory.aiScore ?? 0,
      createdAt: now,
      updatedAt: now,
    };
    this.memories.set(memory.id, memory);

    // Update category count
    if (memory.categoryId) {
      const categoryMemories = Array.from(this.memories.values())
        .filter(m => m.categoryId === memory.categoryId);
      await this.updateCategoryCount(memory.categoryId, categoryMemories.length);
    }

    return memory;
  }

  async updateMemory(id: number, updateData: Partial<InsertMemory>): Promise<Memory | undefined> {
    const memory = this.memories.get(id);
    if (!memory) return undefined;

    const updated: Memory = {
      ...memory,
      ...updateData,
      updatedAt: new Date(),
    };
    this.memories.set(id, updated);
    return updated;
  }

  async deleteMemory(id: number): Promise<boolean> {
    const memory = this.memories.get(id);
    if (!memory) return false;

    this.memories.delete(id);

    // Update category count
    if (memory.categoryId) {
      const categoryMemories = Array.from(this.memories.values())
        .filter(m => m.categoryId === memory.categoryId);
      await this.updateCategoryCount(memory.categoryId, categoryMemories.length);
    }

    return true;
  }

  async searchMemories(query: string): Promise<Memory[]> {
    const searchTerm = query.toLowerCase();
    
    return Array.from(this.memories.values())
      .filter(memory => 
        memory.title.toLowerCase().includes(searchTerm) ||
        memory.content.toLowerCase().includes(searchTerm) ||
        memory.keywords.some(k => k.toLowerCase().includes(searchTerm)) ||
        memory.tags.some(t => t.toLowerCase().includes(searchTerm))
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

export const storage = new MemStorage();
