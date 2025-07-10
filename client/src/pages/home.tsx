import { useState } from "react";
import Sidebar from "@/components/sidebar";
import MainContent from "@/components/main-content";
import ChatInterface from "@/components/chat-interface";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  return (
    <div className="flex h-screen bg-notion-bg-50">
      <Sidebar 
        selectedCategoryId={selectedCategoryId}
        onCategorySelect={setSelectedCategoryId}
        onNewMemory={() => setIsChatOpen(true)}
      />
      
      <MainContent 
        selectedCategoryId={selectedCategoryId}
      />

      {isChatOpen && (
        <ChatInterface 
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        />
      )}

      {!isChatOpen && (
        <Button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl gradient-blue-purple hover:scale-110 transition-transform z-40"
          size="icon"
        >
          <Plus className="h-6 w-6 text-white" />
        </Button>
      )}
    </div>
  );
}
