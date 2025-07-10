import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { AnalyzedContent } from "@shared/schema";

export function useChat() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const analyzeContentMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest("POST", "/api/chat/analyze", { content });
      return response.json();
    },
    onSuccess: (data) => {
      // Invalidate and refetch memories and categories
      queryClient.invalidateQueries({ queryKey: ["/api/memories"] });
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      
      toast({
        title: "Memory saved!",
        description: `Successfully categorized as ${data.analysis.category}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to process your memory. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    analyzeContent: analyzeContentMutation.mutateAsync,
    isAnalyzing: analyzeContentMutation.isPending,
  };
}
