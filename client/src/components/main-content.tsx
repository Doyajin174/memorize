import { useState } from "react";
import { Search, Filter, Table, Grid3X3, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MemoryTable from "./memory-table";
import { useMemories } from "@/hooks/use-memories";

interface MainContentProps {
  selectedCategoryId: number | null;
}

export default function MainContent({ selectedCategoryId }: MainContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "grid" | "list">("table");
  
  const { data: memories = [], isLoading } = useMemories(selectedCategoryId);

  const filteredMemories = memories.filter(memory =>
    memory.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    memory.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    memory.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex-1 flex flex-col">
      {/* Top Bar */}
      <div className="h-16 bg-white border-b notion-border-200 flex items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold notion-text-800">
            {selectedCategoryId ? "Category Memories" : "All Memories"}
          </h2>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 notion-bg-100 rounded-full text-xs notion-text-600">
              {memories.length} memories
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 notion-text-500" />
            <Input
              type="text"
              placeholder="Search memories..."
              className="pl-10 w-80 notion-bg-100 border notion-border-200 focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* View Options */}
          <div className="flex items-center space-x-1 notion-bg-100 rounded-lg p-1">
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
            >
              <Table className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Filter Button */}
          <Button variant="ghost" size="sm">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto custom-scrollbar">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-notion-600">Loading memories...</div>
          </div>
        ) : (
          <MemoryTable memories={filteredMemories} viewMode={viewMode} />
        )}
      </div>
    </div>
  );
}
