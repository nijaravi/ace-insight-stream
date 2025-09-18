import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "@/types/kpi";
import { mockAlerts } from "@/data/mockData";

let alertsStore = [...mockAlerts];

export const useAlerts = (filters?: { 
  startDate?: string; 
  endDate?: string; 
  kpiId?: string; 
  departmentId?: string; 
  status?: string;
  severity?: string;
}) => {
  return useQuery({
    queryKey: ["alerts", filters],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 350));
      
      let filteredAlerts = [...alertsStore];
      
      if (filters?.startDate) {
        filteredAlerts = filteredAlerts.filter(alert => 
          new Date(alert.alert_date) >= new Date(filters.startDate!)
        );
      }
      
      if (filters?.endDate) {
        filteredAlerts = filteredAlerts.filter(alert => 
          new Date(alert.alert_date) <= new Date(filters.endDate!)
        );
      }
      
      if (filters?.kpiId) {
        filteredAlerts = filteredAlerts.filter(alert => alert.kpi_id === filters.kpiId);
      }
      
      if (filters?.departmentId) {
        filteredAlerts = filteredAlerts.filter(alert => alert.department_id === filters.departmentId);
      }
      
      if (filters?.status) {
        filteredAlerts = filteredAlerts.filter(alert => alert.status === filters.status);
      }
      
      if (filters?.severity) {
        filteredAlerts = filteredAlerts.filter(alert => alert.severity === filters.severity);
      }
      
      // Sort by alert_date descending (most recent first)
      return filteredAlerts.sort((a, b) => 
        new Date(b.alert_date).getTime() - new Date(a.alert_date).getTime()
      );
    },
    enabled: true,
  });
};

export const useUpdateAlert = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Alert> & { id: string }) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const alertIndex = alertsStore.findIndex(a => a.id === id);
      if (alertIndex === -1) {
        throw new Error("Alert not found");
      }
      
      const updatedAlert = {
        ...alertsStore[alertIndex],
        ...updates
      };
      
      alertsStore[alertIndex] = updatedAlert;
      return updatedAlert;
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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedAlerts = [];
      
      for (const id of updates.ids) {
        const alertIndex = alertsStore.findIndex(a => a.id === id);
        if (alertIndex !== -1) {
          const updatedAlert = {
            ...alertsStore[alertIndex],
            ...updates.data
          };
          alertsStore[alertIndex] = updatedAlert;
          updatedAlerts.push(updatedAlert);
        }
      }
      
      return updatedAlerts;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });
};