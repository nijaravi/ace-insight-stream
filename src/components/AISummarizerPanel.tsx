import { useState, useEffect } from "react";
import { Brain, Send, ArrowLeft, Loader2, Edit, Check, X, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  const [tempPrompt, setTempPrompt] = useState(prompt);
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [summary, setSummary] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Auto-trigger generation when alerts are passed in
  useEffect(() => {
    if (selectedAlerts.length > 0 && !summary && !isGenerating) {
      handleGenerateSummary();
    }
  }, [selectedAlerts]);

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

  const handleEditPrompt = () => {
    setTempPrompt(prompt);
    setIsEditingPrompt(true);
  };

  const handleSavePrompt = () => {
    setPrompt(tempPrompt);
    setIsEditingPrompt(false);
  };

  const handleCancelEditPrompt = () => {
    setTempPrompt(prompt);
    setIsEditingPrompt(false);
  };

  const handleSendEmail = () => {
    onSendEmail(summary);
  };

  const handleSendToMe = () => {
    // TODO: Implement send to current user
    console.log("Sending to me:", summary);
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

      {/* Section 1: Prompt Editor */}
      <Card className="border-banking-border shadow-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              🧠 Prompt to Summarize Alerts
            </CardTitle>
            {!isEditingPrompt ? (
              <Button variant="outline" size="sm" onClick={handleEditPrompt} className="gap-2">
                <Edit className="w-4 h-4" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleSavePrompt} className="gap-2">
                  <Check className="w-4 h-4" />
                  Save
                </Button>
                <Button variant="outline" size="sm" onClick={handleCancelEditPrompt} className="gap-2">
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="prompt">AI Summarization Instructions</Label>
            {!isEditingPrompt ? (
              <div className="min-h-[100px] p-3 bg-muted rounded-md text-sm text-foreground whitespace-pre-wrap">
                {prompt}
              </div>
            ) : (
              <Textarea
                id="prompt"
                value={tempPrompt}
                onChange={(e) => setTempPrompt(e.target.value)}
                placeholder="Describe how you want the AI to summarize the alerts..."
                className="min-h-[100px] resize-none"
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Section 2: AI Summary Generation */}
      {isGenerating && (
        <Card className="border-banking-border shadow-card">
          <CardContent className="py-8">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-lg font-medium">🧠 Generating summary using AI...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Show Selected Alerts after summary generation */}
      {summary && (
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
      )}

      {/* Summary Output */}
      {summary && (
        <Card className="border-banking-border shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">
              📋 AI-Generated Summary
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

      {/* Section 3: Action Buttons */}
      {summary && (
        <div className="flex justify-center gap-4">
          <Button
            onClick={handleSendToMe}
            variant="outline"
            className="gap-2 px-8"
          >
            <Mail className="w-4 h-4" />
            Send to Me
          </Button>
          <Button
            onClick={handleSendEmail}
            className="gap-2 bg-primary hover:bg-primary/90 px-8"
          >
            <Send className="w-4 h-4" />
            📧 Send Email with AI Summary
          </Button>
          <Button
            variant="outline"
            onClick={onBackToAlerts}
            className="gap-2 px-8"
          >
            🔙 Back to Alerts
          </Button>
        </div>
      )}
    </div>
  );
}