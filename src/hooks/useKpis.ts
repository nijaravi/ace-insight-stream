import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { KpiData, KpiTableData } from "@/types/kpi";

export const useKpis = (departmentId?: string) => {
  return useQuery({
    queryKey: ["kpis", departmentId],
    queryFn: async () => {
      let query = supabase
        .from("kpis")
        .select(`
          *,
          department:departments(*)
        `)
        .order("name");
      
      if (departmentId) {
        query = query.eq("owner_department_id", departmentId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Transform data to include alerts count and last alert sent
      const transformedData = await Promise.all(
        data.map(async (kpi) => {
          // Get alerts count for this month
          const startOfMonth = new Date();
          startOfMonth.setDate(1);
          startOfMonth.setHours(0, 0, 0, 0);
          
          const { count } = await supabase
            .from("alerts")
            .select("*", { count: "exact", head: true })
            .eq("kpi_id", kpi.id)
            .gte("alert_date", startOfMonth.toISOString());
          
          // Get last alert sent date
          const { data: lastAlert } = await supabase
            .from("alert_history")
            .select("sent_date")
            .eq("kpi_id", kpi.id)
            .order("sent_date", { ascending: false })
            .limit(1)
            .single();
          
          return {
            ...kpi,
            alerts_this_month: count || 0,
            last_alert_sent: lastAlert?.sent_date,
          } as KpiTableData;
        })
      );
      
      return transformedData;
    },
    enabled: true,
  });
};

export const useAddKpi = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (kpi: Omit<KpiData, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("kpis")
        .insert([kpi])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kpis"] });
    },
  });
};

export const useUpdateKpi = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<KpiData> & { id: string }) => {
      const { data, error } = await supabase
        .from("kpis")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kpis"] });
    },
  });
};