import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Alert } from "@/types/kpi";

export const useAlerts = (filters?: { 
  startDate?: string; 
  endDate?: string; 
  kpiId?: string; 
  departmentId?: string; 
}) => {
  return useQuery({
    queryKey: ["alerts", filters],
    queryFn: async () => {
      let query = supabase
        .from("alerts")
        .select(`
          *,
          kpi:kpis(name, domain),
          department:departments(name)
        `)
        .order("alert_date", { ascending: false });
      
      if (filters?.startDate) {
        query = query.gte("alert_date", filters.startDate);
      }
      
      if (filters?.endDate) {
        query = query.lte("alert_date", filters.endDate);
      }
      
      if (filters?.kpiId) {
        query = query.eq("kpi_id", filters.kpiId);
      }
      
      if (filters?.departmentId) {
        query = query.eq("department_id", filters.departmentId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Alert[];
    },
    enabled: true,
  });
};

export const useUpdateAlert = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Alert> & { id: string }) => {
      const { data, error } = await supabase
        .from("alerts")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });
};

export const useBulkUpdateAlerts = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (updates: { ids: string[], data: Partial<Alert> }) => {
      const { data, error } = await supabase
        .from("alerts")
        .update(updates.data)
        .in("id", updates.ids)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });
};