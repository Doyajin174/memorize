import { pgTable, text, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  count: integer("count").default(0).notNull(),
});

export const memories = pgTable("memories", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  title: text("title").notNull(),
  categoryId: integer("category_id").references(() => categories.id),
  tags: text("tags").array().default([]).notNull(),
  keywords: text("keywords").array().default([]).notNull(),
  structuredData: jsonb("structured_data"),
  aiScore: integer("ai_score").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  count: true,
});

export const insertMemorySchema = createInsertSchema(memories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const searchMemorySchema = z.object({
  query: z.string().min(1),
  categoryId: z.number().optional(),
  limit: z.number().default(50),
});

export const chatMessageSchema = z.object({
  content: z.string().min(1),
});

export type Category = typeof categories.$inferSelect;
export type Memory = typeof memories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type InsertMemory = z.infer<typeof insertMemorySchema>;
export type SearchMemory = z.infer<typeof searchMemorySchema>;
export type ChatMessage = z.infer<typeof chatMessageSchema>;

export interface AnalyzedContent {
  title: string;
  category: string;
  keywords: string[];
  tags: string[];
  structuredData: Record<string, any>;
  aiScore: number;
}
