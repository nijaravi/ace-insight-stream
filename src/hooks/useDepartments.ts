import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Department } from "@/types/kpi";

export const useDepartments = () => {
  return useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("departments")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data as Department[];
    },
  });
};

export const useAddDepartment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (department: Omit<Department, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("departments")
        .insert([department])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
};

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<Omit<Department, "id" | "created_at" | "updated_at">>) => {
      const { data, error } = await supabase
        .from("departments")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
};

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("departments")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
};