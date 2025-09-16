import { useState } from "react";
import { Brain, Send, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

interface Alert {
  id: string;
  alertDate: string;
  alertDetails: string;
  comment?: string;
}

interface AISummarizerPanelProps {
  selectedAlerts: Alert[];
  onBackToAlerts: () => void;
  onSendEmail: (summary: string) => void;
}

export function AISummarizerPanel({ selectedAlerts, onBackToAlerts, onSendEmail }: AISummarizerPanelProps) {
  const [prompt, setPrompt] = useState(
    "Summarize the alerts grouped by region and highlight high severity items. Please provide a clear, concise analysis of the current situation."
  );
  const [summary, setSummary] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPromptCollapsed, setIsPromptCollapsed] = useState(false);

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    
    // Simulate AI API call
    setTimeout(() => {
      const mockSummary = `# Alert Summary Report

## Overview
We have identified ${selectedAlerts.length} alerts that require attention:

## Alert Details
${selectedAlerts.map((alert, index) => 
  `${index + 1}. **${alert.alertDate}**: ${alert.alertDetails}${alert.comment ? ` (Note: ${alert.comment})` : ''}`
).join('\n')}

## Key Findings
- Multiple branches showing elevated wait times
- Pattern suggests peak hour congestion issues
- Immediate action recommended for branches exceeding SLA thresholds

## Recommended Actions
1. Review staffing levels during peak hours
2. Consider implementing queue management systems
3. Monitor branch performance closely over the next 24 hours

Generated on ${new Date().toLocaleString()}`;
      
      setSummary(mockSummary);
      setIsGenerating(false);
    }, 2000);
  };

  const handleSendEmail = () => {
    onSendEmail(summary);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
            <Brain className="w-6 h-6" />
            AI Summarizer
          </h2>
          <p className="text-muted-foreground">Generate AI-powered summaries of selected alerts</p>
        </div>
        <Button variant="outline" onClick={onBackToAlerts} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Alerts
        </Button>
      </div>

      {/* Selected Alerts Info */}
      <Card className="border-banking-border shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Selected Alerts ({selectedAlerts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {selectedAlerts.map((alert, index) => (
              <div key={alert.id} className="text-sm p-2 bg-muted rounded text-foreground">
                <span className="font-medium">{index + 1}.</span> {alert.alertDetails}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Prompt Editor */}
      <Card className="border-banking-border shadow-card">
        <Collapsible open={!isPromptCollapsed} onOpenChange={setIsPromptCollapsed}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <span className="flex items-center gap-2">
                  🧠 Prompt to Summarize Alerts
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isPromptCollapsed ? 'rotate-180' : ''}`} />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="prompt">AI Summarization Instructions</Label>
                <Textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe how you want the AI to summarize the alerts..."
                  className="min-h-[100px] resize-none"
                />
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Generate Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleGenerateSummary}
          disabled={isGenerating || selectedAlerts.length === 0}
          className="gap-2 bg-accent hover:bg-accent/90 px-8"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              🧠 Thinking...
            </>
          ) : (
            <>
              <Brain className="w-4 h-4" />
              Generate Summary
            </>
          )}
        </Button>
      </div>

      {/* Summary Output */}
      {summary && (
        <Card className="border-banking-border shadow-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              📝 AI-Generated Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg">
              <pre className="text-sm whitespace-pre-wrap font-sans leading-relaxed text-foreground">
                {summary}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      {summary && (
        <div className="flex justify-center gap-4">
          <Button
            onClick={handleSendEmail}
            className="gap-2 bg-primary hover:bg-primary/90 px-8"
          >
            <Send className="w-4 h-4" />
            Send Email with AI Summary
          </Button>
        </div>
      )}
    </div>
  );
}