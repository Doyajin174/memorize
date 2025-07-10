import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY || "" 
});

export async function analyzeContent(content: string): Promise<{
  title: string;
  category: string;
  keywords: string[];
  tags: string[];
  structuredData: Record<string, any>;
  aiScore: number;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant that analyzes user input and extracts structured information. 
          
          Analyze the user's content and extract:
          1. A concise title (max 60 characters)
          2. Category (one of: "Game Account", "Schedule", "Contact", "Idea", "Quick Note", "Other")
          3. Keywords (3-5 most important words/phrases)
          4. Tags (3-7 relevant tags for easy filtering)
          5. Structured data (extract specific information like emails, dates, IDs, etc.)
          6. AI confidence score (0-100 based on how well you understood the content)
          
          Respond in JSON format with these exact keys: title, category, keywords, tags, structuredData, aiScore`
        },
        {
          role: "user",
          content: content
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      title: result.title || "Untitled Memory",
      category: result.category || "Other",
      keywords: Array.isArray(result.keywords) ? result.keywords : [],
      tags: Array.isArray(result.tags) ? result.tags : [],
      structuredData: result.structuredData || {},
      aiScore: Math.max(0, Math.min(100, result.aiScore || 0)),
    };
  } catch (error) {
    console.error("OpenAI analysis failed:", error);
    
    // Fallback analysis
    return {
      title: content.slice(0, 60) + (content.length > 60 ? "..." : ""),
      category: "Other",
      keywords: extractBasicKeywords(content),
      tags: ["unprocessed"],
      structuredData: {},
      aiScore: 0,
    };
  }
}

export async function searchMemories(query: string, memories: any[]): Promise<any[]> {
  if (!memories.length) return [];
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a semantic search assistant. Given a search query and a list of memories, 
          rank the memories by relevance to the query. Consider semantic meaning, not just keyword matching.
          
          Return a JSON array of memory IDs sorted by relevance (most relevant first).
          Only include memories that are actually relevant to the query.`
        },
        {
          role: "user",
          content: `Search query: "${query}"
          
          Memories: ${JSON.stringify(memories.map(m => ({
            id: m.id,
            title: m.title,
            content: m.content,
            keywords: m.keywords,
            tags: m.tags
          })))}`
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    const rankedIds = Array.isArray(result.relevantIds) ? result.relevantIds : [];
    
    return memories
      .filter(m => rankedIds.includes(m.id))
      .sort((a, b) => rankedIds.indexOf(a.id) - rankedIds.indexOf(b.id));
      
  } catch (error) {
    console.error("AI search failed, falling back to basic search:", error);
    return basicSearch(query, memories);
  }
}

function extractBasicKeywords(text: string): string[] {
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(word => word.length > 3);
  
  return [...new Set(words)].slice(0, 5);
}

function basicSearch(query: string, memories: any[]): any[] {
  const searchTerm = query.toLowerCase();
  
  return memories.filter(memory => 
    memory.title.toLowerCase().includes(searchTerm) ||
    memory.content.toLowerCase().includes(searchTerm) ||
    memory.keywords.some((k: string) => k.toLowerCase().includes(searchTerm)) ||
    memory.tags.some((t: string) => t.toLowerCase().includes(searchTerm))
  );
}
