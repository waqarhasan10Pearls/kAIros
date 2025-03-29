import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getScenarioChallenges, startScenarioChallenge, startCustomScenario } from "../../lib/api";
import { ScrumEventType, ScenarioType, ScenarioChallenge } from "../../lib/types";
import { queryClient } from "../../lib/queryClient";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

interface ScenarioSelectorProps {
  selectedEvent: ScrumEventType;
}

const ScenarioSelector = ({ selectedEvent }: ScenarioSelectorProps) => {
  const [scenarioType, setScenarioType] = useState<ScenarioType>("predefined");
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>("");
  const [customScenario, setCustomScenario] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch scenario challenges
  const { data: challenges = [], isLoading } = useQuery({
    queryKey: ['/api/scenario-challenges', selectedEvent],
    queryFn: () => getScenarioChallenges(selectedEvent),
    enabled: !!selectedEvent,
  });

  // Reset selections when event changes
  useEffect(() => {
    setSelectedScenarioId("");
    setCustomScenario("");
  }, [selectedEvent]);

  // Start predefined scenario mutation
  const { mutate: startPredefined, isPending: isPredefinedStarting } = useMutation({
    mutationFn: (scenarioId: string) => startScenarioChallenge(selectedEvent, scenarioId),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['/api/simulation-info', selectedEvent] });
      queryClient.invalidateQueries({ queryKey: ['/api/messages', selectedEvent] });
      setIsDialogOpen(false);
    },
    onError: (error) => {
      console.error("Error starting scenario:", error);
    }
  });

  // Start custom scenario mutation
  const { mutate: startCustom, isPending: isCustomStarting } = useMutation({
    mutationFn: (description: string) => startCustomScenario(selectedEvent, description),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['/api/simulation-info', selectedEvent] });
      queryClient.invalidateQueries({ queryKey: ['/api/messages', selectedEvent] });
      setIsDialogOpen(false);
    },
    onError: (error) => {
      console.error("Error starting custom scenario:", error);
    }
  });

  const handleStartScenario = () => {
    if (scenarioType === "predefined" && selectedScenarioId) {
      startPredefined(selectedScenarioId);
    } else if (scenarioType === "custom" && customScenario.trim()) {
      startCustom(customScenario.trim());
    }
  };

  // Group challenges by difficulty
  const beginnerChallenges = challenges.filter((c: ScenarioChallenge) => c.difficulty === "beginner");
  const intermediateChallenges = challenges.filter((c: ScenarioChallenge) => c.difficulty === "intermediate");
  const advancedChallenges = challenges.filter((c: ScenarioChallenge) => c.difficulty === "advanced");

  const difficultyColors = {
    beginner: "bg-green-100 text-green-800 border-green-200",
    intermediate: "bg-yellow-100 text-yellow-800 border-yellow-200",
    advanced: "bg-red-100 text-red-800 border-red-200"
  };

  return (
    <div className="mt-4">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            <i className="ri-gamepad-line mr-2"></i> Start Scenario Challenge
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Select a Scenario Challenge</DialogTitle>
            <DialogDescription>
              Choose a predefined scenario or create your own custom challenge to practice your Scrum Master skills.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="predefined" onValueChange={(value) => setScenarioType(value as ScenarioType)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="predefined">Predefined</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
            </TabsList>

            <TabsContent value="predefined" className="mt-4 max-h-[350px] overflow-y-auto pr-2">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : challenges.length === 0 ? (
                <p className="text-center py-4 text-gray-500">No challenges available for this event</p>
              ) : (
                <RadioGroup value={selectedScenarioId} onValueChange={setSelectedScenarioId}>
                  <Accordion type="single" collapsible className="w-full">
                    {beginnerChallenges.length > 0 && (
                      <AccordionItem value="beginner">
                        <AccordionTrigger className="text-sm font-medium">
                          Beginner <Badge className="ml-2 bg-green-100 text-green-800">Easy</Badge>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            {beginnerChallenges.map((challenge: ScenarioChallenge) => (
                              <div key={challenge.id} className="flex items-start space-x-2 p-2 rounded border border-gray-200 hover:bg-gray-50">
                                <RadioGroupItem value={challenge.id} id={challenge.id} className="mt-1" />
                                <Label htmlFor={challenge.id} className="flex-1 cursor-pointer">
                                  <div className="font-medium">{challenge.title}</div>
                                  <div className="text-sm text-gray-600 mt-1">{challenge.description}</div>
                                </Label>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {intermediateChallenges.length > 0 && (
                      <AccordionItem value="intermediate">
                        <AccordionTrigger className="text-sm font-medium">
                          Intermediate <Badge className="ml-2 bg-yellow-100 text-yellow-800">Medium</Badge>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            {intermediateChallenges.map((challenge: ScenarioChallenge) => (
                              <div key={challenge.id} className="flex items-start space-x-2 p-2 rounded border border-gray-200 hover:bg-gray-50">
                                <RadioGroupItem value={challenge.id} id={challenge.id} className="mt-1" />
                                <Label htmlFor={challenge.id} className="flex-1 cursor-pointer">
                                  <div className="font-medium">{challenge.title}</div>
                                  <div className="text-sm text-gray-600 mt-1">{challenge.description}</div>
                                </Label>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {advancedChallenges.length > 0 && (
                      <AccordionItem value="advanced">
                        <AccordionTrigger className="text-sm font-medium">
                          Advanced <Badge className="ml-2 bg-red-100 text-red-800">Hard</Badge>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            {advancedChallenges.map((challenge: ScenarioChallenge) => (
                              <div key={challenge.id} className="flex items-start space-x-2 p-2 rounded border border-gray-200 hover:bg-gray-50">
                                <RadioGroupItem value={challenge.id} id={challenge.id} className="mt-1" />
                                <Label htmlFor={challenge.id} className="flex-1 cursor-pointer">
                                  <div className="font-medium">{challenge.title}</div>
                                  <div className="text-sm text-gray-600 mt-1">{challenge.description}</div>
                                </Label>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}
                  </Accordion>
                </RadioGroup>
              )}
            </TabsContent>

            <TabsContent value="custom" className="mt-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="custom-scenario" className="text-sm font-medium">
                    Describe Your Scenario
                  </Label>
                  <Textarea
                    id="custom-scenario"
                    placeholder="Describe a scenario or challenge you'd like to practice as a Scrum Master..."
                    value={customScenario}
                    onChange={(e) => setCustomScenario(e.target.value)}
                    className="mt-1"
                    rows={6}
                  />
                </div>
                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-1">Tips for creating effective scenarios:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Include team member names and their roles</li>
                    <li>Describe a specific challenge or issue that needs resolution</li>
                    <li>Consider including context like sprint details or team dynamics</li>
                    <li>Be specific about what you want to practice</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleStartScenario}
              disabled={(scenarioType === "predefined" && !selectedScenarioId) || 
                        (scenarioType === "custom" && !customScenario.trim()) ||
                        isPredefinedStarting || 
                        isCustomStarting}
            >
              {isPredefinedStarting || isCustomStarting ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  Starting...
                </>
              ) : (
                <>Start Challenge</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScenarioSelector;