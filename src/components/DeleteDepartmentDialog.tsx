import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import type { Department } from "@/types/kpi";

interface DeleteDepartmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department: Department | null;
  onConfirmDelete: () => void;
}

export function DeleteDepartmentDialog({
  open,
  onOpenChange,
  department,
  onConfirmDelete,
}: DeleteDepartmentDialogProps) {
  if (!department) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <AlertDialogTitle>Delete Department</AlertDialogTitle>
              <AlertDialogDescription className="mt-2">
                Are you sure you want to delete the <strong>"{department.name}"</strong> department? 
                This action cannot be undone and will permanently remove all associated data.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirmDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete Department
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}