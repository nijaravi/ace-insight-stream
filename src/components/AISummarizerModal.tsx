import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Edit, History, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AISummarizerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kpi: {
    id: string;
    name: string;
    aiPrompt?: string;
  };
  onSave: (updates: { aiPrompt: string }) => void;
}

export function AISummarizerModal({ open, onOpenChange, kpi, onSave }: AISummarizerModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editPrompt, setEditPrompt] = useState(kpi.aiPrompt || "");
  const [showHistory, setShowHistory] = useState(false);
  const { toast } = useToast();

  const defaultPrompt = `You are an AI assistant specialized in analyzing banking alerts for ${kpi.name}. 

Your task is to:
1. Summarize the key findings from the provided alert data
2. Identify patterns and trends
3. Assess the severity and potential impact
4. Provide actionable recommendations

Please format your response in a clear, professional manner suitable for banking executives.`;

  const currentPrompt = kpi.aiPrompt || defaultPrompt;

  const handleEdit = () => {
    setEditPrompt(currentPrompt);
    setIsEditing(true);
  };

  const handleSave = () => {
    onSave({ aiPrompt: editPrompt });
    setIsEditing(false);
    toast({
      title: "AI Prompt Updated",
      description: "The AI summarizer prompt has been successfully updated.",
    });
  };

  const handleCancel = () => {
    setEditPrompt(currentPrompt);
    setIsEditing(false);
  };

  // Mock history data
  const promptHistory = [
    {
      id: "1",
      timestamp: "2025-09-16 14:30",
      user: "analyst@adib.ae",
      prompt: "Previous version focusing on technical metrics...",
    },
    {
      id: "2", 
      timestamp: "2025-09-10 09:15",
      user: "manager@adib.ae",
      prompt: "Original prompt with basic alert analysis...",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            🧠 AI Summarizer Configuration
            <Badge variant="outline">{kpi.name}</Badge>
          </DialogTitle>
          <DialogDescription>
            Configure the AI prompt that will be used to summarize alerts for this KPI.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Prompt Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">AI Prompt</h4>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHistory(!showHistory)}
                  className="gap-1"
                >
                  <History className="w-3 h-3" />
                  {showHistory ? "Hide" : "Show"} History
                </Button>
                {!isEditing && (
                  <Button variant="outline" size="sm" onClick={handleEdit} className="gap-1">
                    <Edit className="w-3 h-3" />
                    Edit
                  </Button>
                )}
              </div>
            </div>

            {isEditing ? (
              <div className="space-y-3">
                <Textarea
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  className="min-h-[200px] font-mono text-sm"
                  placeholder="Enter your AI prompt here..."
                />
                <div className="flex gap-2">
                  <Button onClick={handleSave} size="sm" className="gap-1">
                    <Save className="w-3 h-3" />
                    Save Changes
                  </Button>
                  <Button onClick={handleCancel} variant="outline" size="sm" className="gap-1">
                    <X className="w-3 h-3" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-muted p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm font-mono">{currentPrompt}</pre>
              </div>
            )}
          </div>

          {/* History Section */}
          {showHistory && (
            <div className="space-y-3 border-t pt-4">
              <h4 className="font-medium">Prompt History</h4>
              <div className="space-y-3">
                {promptHistory.map((entry) => (
                  <div key={entry.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{entry.user}</span>
                      <span className="text-muted-foreground">{entry.timestamp}</span>
                    </div>
                    <div className="bg-muted/50 p-2 rounded text-sm font-mono">
                      {entry.prompt}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}