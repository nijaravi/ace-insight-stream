import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Department } from "@/types/kpi";
import { mockDepartments } from "@/data/mockData";

let departmentsStore = [...mockDepartments];

export const useDepartments = () => {
  return useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return [...departmentsStore].sort((a, b) => a.name.localeCompare(b.name));
    },
  });
};

export const useAddDepartment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (department: Omit<Department, "id" | "created_at" | "updated_at">) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newDepartment: Department = {
        ...department,
        id: `dept-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      departmentsStore.push(newDepartment);
      return newDepartment;
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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const departmentIndex = departmentsStore.findIndex(d => d.id === id);
      if (departmentIndex === -1) {
        throw new Error("Department not found");
      }
      
      const updatedDepartment = {
        ...departmentsStore[departmentIndex],
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      departmentsStore[departmentIndex] = updatedDepartment;
      return updatedDepartment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
};