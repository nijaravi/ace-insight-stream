import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { KpiData, KpiTableData } from "@/types/kpi";
import { mockKpis, mockDepartments } from "@/data/mockData";

let kpisStore = [...mockKpis];

export const useKpis = (departmentId?: string) => {
  return useQuery({
    queryKey: ["kpis", departmentId],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 400));
      
      let filteredKpis = [...kpisStore];
      
      if (departmentId) {
        filteredKpis = filteredKpis.filter(kpi => kpi.owner_department_id === departmentId);
      }
      
      // Generate enriched KPI table data
      const enrichedData: KpiTableData[] = filteredKpis.map(kpi => {
        const department = mockDepartments.find(d => d.id === kpi.owner_department_id);
        
        // Mock alerts count for this month (random between 0-10)
        const alertsThisMonth = Math.floor(Math.random() * 11);
        
        // Mock last alert sent date (random within last 30 days or null)
        const shouldHaveLastAlert = Math.random() > 0.3;
        const lastAlertSent = shouldHaveLastAlert 
          ? new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString()
          : undefined;

        return {
          id: kpi.id,
          name: kpi.name,
          domain: kpi.domain,
          description: kpi.description || '',
          alert_table_name: kpi.alert_table_name,
          default_email_to: kpi.default_email_to,
          default_email_cc: kpi.default_email_cc,
          default_subject: kpi.default_subject,
          default_body: kpi.default_body,
          default_footer: kpi.default_footer,
          ai_prompt: kpi.ai_prompt,
          last_alert_sent: lastAlertSent,
          alerts_this_month: alertsThisMonth,
          is_active: kpi.is_active,
          owner_department_id: kpi.owner_department_id,
          department
        };
      });
      
      return enrichedData;
    },
  });
};

export const useAddKpi = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (kpi: Omit<KpiData, "id" | "created_at" | "updated_at">) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const newKpi: KpiData = {
        ...kpi,
        id: `kpi-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      kpisStore.push(newKpi);
      return newKpi;
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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const kpiIndex = kpisStore.findIndex(k => k.id === id);
      if (kpiIndex === -1) {
        throw new Error("KPI not found");
      }
      
      const updatedKpi = {
        ...kpisStore[kpiIndex],
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      kpisStore[kpiIndex] = updatedKpi;
      return updatedKpi;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kpis"] });
    },
  });
};