import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import KairosLogo from "./KairosLogo";

interface WelcomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  showFeedback?: boolean;
}

type FeedbackType = "feature" | "bug" | "improvement" | "content" | "other";

// Welcome dialog to introduce users to the app
// If showFeedback is true, it shows the feedback form instead
export default function WelcomeDialog({ open, onOpenChange, showFeedback = false }: WelcomeDialogProps) {
  const [feedback, setFeedback] = React.useState("");
  const [feedbackType, setFeedbackType] = React.useState<FeedbackType>("improvement");
  const { toast } = useToast();
  
  // Handle feedback submission
  const handleSubmitFeedback = () => {
    // In a production app, this would be sent to a backend API
    toast({
      title: "Feedback Received",
      description: "Thank you for your feedback! We'll use it to improve kAIros.",
    });
    setFeedback("");
    setFeedbackType("improvement");
    onOpenChange(false);
  };

  // Render the appropriate content based on the showFeedback prop
  const renderContent = () => {
    if (showFeedback) {
      return (
        <>
          <DialogHeader>
            <div className="flex items-center mb-2">
              <i className="ri-feedback-line text-primary text-2xl mr-2"></i>
              <DialogTitle className="text-xl">Help Improve kAIros</DialogTitle>
            </div>
            <DialogDescription className="text-gray-700 dark:text-gray-200">
              Your feedback helps us make kAIros better for all Scrum Masters
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <div>
              <Label className="text-base font-medium mb-2 block">What type of feedback do you have?</Label>
              <RadioGroup 
                value={feedbackType} 
                onValueChange={(value) => setFeedbackType(value as FeedbackType)}
                className="grid grid-cols-2 gap-2"
              >
                <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 p-3 rounded-md border border-gray-100 dark:border-gray-700">
                  <RadioGroupItem value="feature" id="feature" />
                  <Label htmlFor="feature" className="font-medium cursor-pointer flex items-center">
                    <i className="ri-add-circle-line mr-2 text-green-500"></i>
                    New Feature
                  </Label>
                </div>
                <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 p-3 rounded-md border border-gray-100 dark:border-gray-700">
                  <RadioGroupItem value="bug" id="bug" />
                  <Label htmlFor="bug" className="font-medium cursor-pointer flex items-center">
                    <i className="ri-bug-line mr-2 text-red-500"></i>
                    Bug Report
                  </Label>
                </div>
                <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 p-3 rounded-md border border-gray-100 dark:border-gray-700">
                  <RadioGroupItem value="improvement" id="improvement" />
                  <Label htmlFor="improvement" className="font-medium cursor-pointer flex items-center">
                    <i className="ri-tools-line mr-2 text-blue-500"></i>
                    Improvement
                  </Label>
                </div>
                <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 p-3 rounded-md border border-gray-100 dark:border-gray-700">
                  <RadioGroupItem value="content" id="content" />
                  <Label htmlFor="content" className="font-medium cursor-pointer flex items-center">
                    <i className="ri-file-text-line mr-2 text-purple-500"></i>
                    Content
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="feedback-text" className="text-base font-medium mb-2 block">
                Tell us more about your {getFeedbackTypeLabel(feedbackType)}
              </Label>
              <Textarea 
                id="feedback-text"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder={getFeedbackPlaceholder(feedbackType)}
                className="min-h-[150px]"
              />
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="sm:mr-auto"
            >
              <i className="ri-close-line mr-2"></i>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitFeedback}
              disabled={!feedback.trim()}
            >
              <i className="ri-send-plane-line mr-2"></i>
              Submit Feedback
            </Button>
          </DialogFooter>
        </>
      );
    } else {
      return (
        <>
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <KairosLogo size={60} className="text-primary mr-3" />
              <DialogTitle className="text-2xl">Welcome to kAIros</DialogTitle>
            </div>
            <DialogDescription>
              Your AI-powered partner for agile facilitation
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 bg-primary/5 rounded-md border border-primary/20">
              <h3 className="font-medium text-primary mb-2">What is kAIros?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-200">
                kAIros is an AI companion for Scrum Masters and Agile Coaches. Named after the Greek concept of "the opportune moment," 
                it helps you guide teams through Sprint events with thoughtful prompts, scenarios, and insights exactly when needed.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Key Features:</h3>
              <ul className="list-disc list-inside text-sm space-y-1 text-gray-600 dark:text-gray-200">
                <li><span className="font-medium text-gray-800 dark:text-white">Team Engagement Tools</span> - Icebreakers and team activities to foster collaboration</li>
                <li><span className="font-medium text-gray-800 dark:text-white">Scrum Event Simulator</span> - Practice facilitation across all Sprint events</li>
                <li><span className="font-medium text-gray-800 dark:text-white">AI Coaching</span> - Receive guidance based on Scrum Guide 2020 principles</li>
              </ul>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md border border-blue-100 dark:border-blue-800/30">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <span className="font-bold">Note:</span> This is an MVP (Minimum Viable Product) version of kAIros. 
                We're actively improving it based on user feedback. Thank you for being an early user!
              </p>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button onClick={() => onOpenChange(false)}>
              Get Started
              <i className="ri-arrow-right-line ml-2"></i>
            </Button>
          </DialogFooter>
        </>
      );
    }
  };

  // Helper function to get feedback type label
  function getFeedbackTypeLabel(type: FeedbackType): string {
    switch (type) {
      case "feature": return "feature request";
      case "bug": return "bug report";
      case "improvement": return "suggestion";
      case "content": return "content feedback";
      case "other": return "feedback";
    }
  }

  // Helper function to get feedback placeholder text
  function getFeedbackPlaceholder(type: FeedbackType): string {
    switch (type) {
      case "feature":
        return "Describe the new feature you'd like to see in kAIros...";
      case "bug":
        return "Describe the issue you encountered and how to reproduce it...";
      case "improvement":
        return "Share your ideas on how we can improve existing features...";
      case "content":
        return "Tell us about improving the questions, scenarios, or Scrum-related content...";
      case "other":
        return "Share your thoughts about kAIros...";
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}