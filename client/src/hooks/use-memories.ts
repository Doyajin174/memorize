import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Memory, Category } from "@shared/schema";

export function useMemories(categoryId: number | null = null) {
  return useQuery<Memory[]>({
    queryKey: categoryId ? ["/api/memories", { categoryId }] : ["/api/memories"],
    queryFn: async () => {
      const url = categoryId ? `/api/memories?categoryId=${categoryId}` : "/api/memories";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch memories");
      return response.json();
    },
  });
}

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ["/api/categories"],
    queryFn: async () => {
      const response = await fetch("/api/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      return response.json();
    },
  });
}

export function useCreateMemory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (memoryData: any) => {
      const response = await apiRequest("POST", "/api/memories", memoryData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/memories"] });
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
    },
  });
}

export function useSearchMemories() {
  return useMutation({
    mutationFn: async (searchData: { query: string; categoryId?: number; limit?: number }) => {
      const response = await apiRequest("POST", "/api/memories/search", searchData);
      return response.json();
    },
  });
}
