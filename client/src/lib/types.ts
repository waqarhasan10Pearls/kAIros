// Icebreaker Types
export type VibeType = "random" | "funny" | "deep" | "creative" | "teambuilding" | "technical" | "reflection" | "energizer";

export interface IcebreakerQuestion {
  question: string;
}

export interface IcebreakerActivity {
  title: string;
  duration: string;
  description: string;
  instructions: string[];
}

// Scrum Simulator Types
export type ScrumEventType = "daily" | "planning" | "review" | "retro";

export interface TeamMember {
  name: string;
  role: string;
  status: "available" | "unavailable";
}

export interface SprintDetails {
  number: number;
  duration: string;
  previousVelocity: number;
}

export type ScenarioType = "predefined" | "custom";

export interface ScenarioChallenge {
  id: string;
  title: string;
  description: string;
  eventType: ScrumEventType;
  difficulty: "beginner" | "intermediate" | "advanced";
}

export interface SimulationInfo {
  id: number;
  eventType: string;
  teamMembers: TeamMember[];
  sprintDetails: SprintDetails;
  roleDescription: string;
  scenarioType?: ScenarioType;
  scenarioChallenge?: ScenarioChallenge;
  customScenario?: string;
}

export type MessageType = "user" | "ai";

export interface Message {
  id: number;
  eventType: string;
  type: MessageType;
  content: string;
  timestamp: Date;
}
