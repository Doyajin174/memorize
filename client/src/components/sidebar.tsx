import { Brain, Plus, Search, Calendar, User, Lightbulb, StickyNote, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCategories } from "@/hooks/use-memories";
import { cn } from "@/lib/utils";

interface SidebarProps {
  selectedCategoryId: number | null;
  onCategorySelect: (categoryId: number | null) => void;
  onNewMemory: () => void;
}

const categoryIcons: Record<string, any> = {
  "Game Account": Gamepad2,
  "Schedule": Calendar,
  "Contact": User,
  "Idea": Lightbulb,
  "Quick Note": StickyNote,
};

const categoryColors: Record<string, string> = {
  "Game Account": "text-blue-500",
  "Schedule": "text-green-500",
  "Contact": "text-purple-500",
  "Idea": "text-yellow-500",
  "Quick Note": "text-orange-500",
};

export default function Sidebar({ selectedCategoryId, onCategorySelect, onNewMemory }: SidebarProps) {
  const { data: categories = [] } = useCategories();

  return (
    <div className="w-64 notion-bg-100 border-r notion-border-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b notion-border-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 gradient-blue-purple rounded-lg flex items-center justify-center">
            <Brain className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="font-semibold notion-text-800">Memorize</h1>
            <p className="text-xs notion-text-600">Personal Workspace</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 space-y-2">
        <Button 
          variant="ghost" 
          className="w-full justify-start space-x-3 hover:notion-bg-200"
          onClick={onNewMemory}
        >
          <Plus className="h-4 w-4 notion-text-600" />
          <span className="text-sm font-medium">New Memory</span>
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start space-x-3 hover:notion-bg-200"
        >
          <Search className="h-4 w-4 notion-text-600" />
          <span className="text-sm font-medium">Search</span>
        </Button>
      </div>

      {/* Categories */}
      <div className="flex-1 p-4">
        <h3 className="text-xs font-semibold notion-text-600 uppercase tracking-wide mb-3">Categories</h3>
        <ScrollArea className="space-y-1">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start space-x-3 hover:notion-bg-200",
              selectedCategoryId === null && "notion-bg-200"
            )}
            onClick={() => onCategorySelect(null)}
          >
            <span className="text-sm">All Memories</span>
          </Button>
          
          {categories.map(category => {
            const IconComponent = categoryIcons[category.name] || StickyNote;
            const iconColor = categoryColors[category.name] || "text-gray-500";
            
            return (
              <Button
                key={category.id}
                variant="ghost"
                className={cn(
                  "w-full justify-between hover:notion-bg-200 group",
                  selectedCategoryId === category.id && "notion-bg-200"
                )}
                onClick={() => onCategorySelect(category.id)}
              >
                <div className="flex items-center space-x-3">
                  <IconComponent className={cn("h-4 w-4", iconColor)} />
                  <span className="text-sm">{category.name}</span>
                </div>
                <span className="text-xs notion-text-500 opacity-0 group-hover:opacity-100">
                  {category.count}
                </span>
              </Button>
            );
          })}
        </ScrollArea>
      </div>

      {/* Recent Memories */}
      <div className="p-4 border-t notion-border-200">
        <h3 className="text-xs font-semibold notion-text-600 uppercase tracking-wide mb-3">Recent</h3>
        <div className="space-y-2">
          <div className="p-2 rounded-lg hover:notion-bg-200 cursor-pointer">
            <p className="text-sm notion-text-800 truncate">No recent memories</p>
            <p className="text-xs notion-text-500">Start by creating your first memory</p>
          </div>
        </div>
      </div>
    </div>
  );
}
