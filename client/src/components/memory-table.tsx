import { formatDistanceToNow } from "date-fns";
import { FileText, Tag, Clock, Brain, Calendar, User, Lightbulb, StickyNote, Gamepad2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { Memory } from "@shared/schema";

interface MemoryTableProps {
  memories: Memory[];
  viewMode: "table" | "grid" | "list";
}

const categoryIcons: Record<string, any> = {
  "Game Account": Gamepad2,
  "Schedule": Calendar,
  "Contact": User,
  "Idea": Lightbulb,
  "Quick Note": StickyNote,
};

const categoryColors: Record<string, string> = {
  "Game Account": "bg-blue-100 text-blue-800",
  "Schedule": "bg-green-100 text-green-800",
  "Contact": "bg-purple-100 text-purple-800",
  "Idea": "bg-yellow-100 text-yellow-800",
  "Quick Note": "bg-orange-100 text-orange-800",
};

export default function MemoryTable({ memories, viewMode }: MemoryTableProps) {
  if (memories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-notion-600">
        <Brain className="h-12 w-12 mb-4 opacity-50" />
        <h3 className="text-lg font-medium mb-2">No memories found</h3>
        <p className="text-sm">Start by creating your first memory using the chat interface</p>
      </div>
    );
  }

  if (viewMode === "table") {
    return (
      <div className="bg-white rounded-lg border notion-border-200 overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 notion-bg-50 border-b notion-border-200 text-sm font-medium notion-text-700">
          <div className="col-span-4 flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Memory</span>
          </div>
          <div className="col-span-2 flex items-center space-x-2">
            <Tag className="h-4 w-4" />
            <span>Category</span>
          </div>
          <div className="col-span-2 flex items-center space-x-2">
            <Tag className="h-4 w-4" />
            <span>Tags</span>
          </div>
          <div className="col-span-2 flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Created</span>
          </div>
          <div className="col-span-2 flex items-center space-x-2">
            <Brain className="h-4 w-4" />
            <span>AI Score</span>
          </div>
        </div>

        {/* Table Rows */}
        <div className="divide-y notion-border-200">
          {memories.map((memory) => {
            const categoryName = getCategoryName(memory.categoryId);
            const IconComponent = categoryIcons[categoryName] || StickyNote;
            const categoryColorClass = categoryColors[categoryName] || "bg-gray-100 text-gray-800";

            return (
              <div key={memory.id} className="grid grid-cols-12 gap-4 p-4 memory-row">
                <div className="col-span-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-accent-blue rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconComponent className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium notion-text-800">{memory.title}</p>
                      <p className="text-sm notion-text-600 mt-1 line-clamp-2">{memory.content}</p>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <Badge className={categoryColorClass}>
                    {categoryName}
                  </Badge>
                </div>
                <div className="col-span-2">
                  <div className="flex flex-wrap gap-1">
                    {memory.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {memory.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{memory.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="col-span-2">
                  <span className="text-sm notion-text-600">
                    {formatDistanceToNow(new Date(memory.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <div className="col-span-2">
                  <div className="flex items-center space-x-2">
                    <Progress value={memory.aiScore} className="w-16" />
                    <span className="text-xs notion-text-600">{memory.aiScore}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Grid and List views can be implemented similarly
  return <div>Other view modes coming soon...</div>;
}

function getCategoryName(categoryId: number | null): string {
  // This would typically come from categories data
  const categoryMap: Record<number, string> = {
    1: "Game Account",
    2: "Schedule", 
    3: "Contact",
    4: "Idea",
    5: "Quick Note",
  };
  
  return categoryId ? categoryMap[categoryId] || "Other" : "Other";
}
