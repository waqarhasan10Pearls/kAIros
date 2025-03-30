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
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";
import KairosLogo from "./KairosLogo";

interface WelcomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  showFeedback?: boolean;
}

// Welcome dialog to introduce users to the app
// If showFeedback is true, it shows the feedback form instead
export default function WelcomeDialog({ open, onOpenChange, showFeedback = false }: WelcomeDialogProps) {
  const [feedback, setFeedback] = React.useState("");
  const { toast } = useToast();
  
  // Handle feedback submission
  const handleSubmitFeedback = () => {
    // In a production app, this would be sent to a backend API
    toast({
      title: "Feedback Received",
      description: "Thank you for your feedback! We'll use it to improve kAIros.",
    });
    setFeedback("");
    onOpenChange(false);
  };

  // Render the appropriate content based on the showFeedback prop
  const renderContent = () => {
    if (showFeedback) {
      return (
        <>
          <DialogHeader>
            <DialogTitle className="text-xl">Share Your Feedback</DialogTitle>
            <DialogDescription>
              Help us improve kAIros with your thoughts and suggestions
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your feedback is invaluable in helping us improve kAIros. Please share your thoughts, 
              suggestions, or any issues you've encountered:
            </p>
            <Textarea 
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your experience with kAIros..."
              className="min-h-[150px]"
            />
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
              <p className="text-sm text-gray-500 dark:text-gray-400">
                kAIros is an AI companion for Scrum Masters and Agile Coaches. Named after the Greek concept of "the opportune moment," 
                it helps you guide teams through Sprint events with thoughtful prompts, scenarios, and insights exactly when needed.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Key Features:</h3>
              <ul className="list-disc list-inside text-sm space-y-1 text-gray-500 dark:text-gray-400">
                <li><span className="font-medium text-gray-700 dark:text-gray-300">Team Engagement Tools</span> - Icebreakers and team activities to foster collaboration</li>
                <li><span className="font-medium text-gray-700 dark:text-gray-300">Scrum Event Simulator</span> - Practice facilitation across all Sprint events</li>
                <li><span className="font-medium text-gray-700 dark:text-gray-300">AI Coaching</span> - Receive guidance based on Scrum Guide 2020 principles</li>
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}