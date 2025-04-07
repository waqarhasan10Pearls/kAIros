import { 
  type InsertMessage, 
  type Message, 
  type SimulationInfo, 
  type InsertSimulationInfo 
} from "../shared/schema";
import { scrumEvents, scrumTeam, scrumArtifacts } from "./scrum-knowledge";
import { ScenarioChallenge, ScenarioType } from "../client/src/lib/types";
import { getScenarioChallenges, getScenarioChallengeById } from "./scenario-challenges";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getSimulationInfo(eventType: string): Promise<SimulationInfo>;
  getMessages(eventType: string): Promise<Message[]>;
  addMessage(message: InsertMessage): Promise<Message>;
  getScenarioChallenges(eventType: string): Promise<ScenarioChallenge[]>;
  startScenario(eventType: string, scenarioType: ScenarioType, scenarioId?: string, customScenario?: string): Promise<SimulationInfo>;
  resetEventMessages(eventType: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private simulationInfos: Map<string, SimulationInfo>;
  private messages: Map<string, Message[]>;
  private messageCurrentId: number;
  private simulationInfoCurrentId: number;
  private scenarioChallenges: Map<string, ScenarioChallenge[]>;

  constructor() {
    this.simulationInfos = new Map();
    this.messages = new Map();
    this.messageCurrentId = 1;
    this.simulationInfoCurrentId = 1;
    this.scenarioChallenges = new Map();
    
    // Initialize with default simulation data
    this.initializeSimulationData();
  }

  private initializeSimulationData() {
    const events = ["daily", "planning", "review", "retro"];
    
    // Common team members across all events - using Scrum Guide 2020 roles
    const teamMembers = [
      { name: "Alex", role: "Product Owner", status: "available" },
      { name: "Taylor", role: "Developer", status: "available" },
      { name: "Jordan", role: "Developer", status: "available" },
      { name: "Morgan", role: "Developer", status: "available" }, // Designer is a skill, not a Scrum role
      { name: "Casey", role: "Developer", status: "unavailable" }
    ];

    // Sprint details
    const sprintDetails = {
      number: 7,
      duration: "2 weeks",
      previousVelocity: 34
    };

    // Role descriptions based on Scrum Guide 2020 for each event - User is the Scrum Master
    const roleDescriptions = {
      daily: `In this simulation, you are the ${scrumTeam.roles.scrumMaster.name}. Your primary accountability is to ensure the Daily Scrum happens, is effective, and stays within the 15-minute timebox. Remember that the purpose of the Daily Scrum is to inspect progress toward the Sprint Goal and adapt the Sprint Backlog as necessary. Additionally, the Developers can select whatever structure and techniques they want, as long as they focus on progress toward the Sprint Goal. I (the AI) will provide coaching and simulate team responses.`,
      planning: `In this simulation, you are the ${scrumTeam.roles.scrumMaster.name}. You facilitate Sprint Planning, which is where ${scrumEvents.sprintPlanning.description} The event is timeboxed to ${scrumEvents.sprintPlanning.timebox}. You help the team address: ${scrumEvents.sprintPlanning.topics.join(', ')}. I (the AI) will provide coaching and simulate team responses.`,
      review: `In this simulation, you are the ${scrumTeam.roles.scrumMaster.name}. You facilitate the Sprint Review, where ${scrumEvents.sprintReview.description} ${scrumEvents.sprintReview.nature} The event is timeboxed to ${scrumEvents.sprintReview.timebox}. I (the AI) will provide coaching and simulate team and stakeholder responses.`,
      retro: `In this simulation, you are the ${scrumTeam.roles.scrumMaster.name}. You facilitate the Sprint Retrospective, where ${scrumEvents.sprintRetrospective.description} The team examines: ${scrumEvents.sprintRetrospective.examination.join(', ')}. The event is timeboxed to ${scrumEvents.sprintRetrospective.timebox}. I (the AI) will provide coaching and simulate team responses.`
    };

    // Create simulation info for each event
    events.forEach((eventType) => {
      const id = this.simulationInfoCurrentId++;
      const info: SimulationInfo = {
        id,
        eventType,
        teamMembers,
        sprintDetails,
        roleDescription: roleDescriptions[eventType as keyof typeof roleDescriptions],
        scenarioType: null,
        scenarioChallenge: null,
        customScenario: null
      };
      this.simulationInfos.set(eventType, info);
      
      // Initialize with a welcome message for each event
      const initialMessages: Message[] = [{
        id: this.messageCurrentId++,
        eventType,
        type: "ai",
        content: this.getWelcomeMessage(eventType),
        timestamp: new Date()
      }];
      this.messages.set(eventType, initialMessages);
    });
  }

  private getWelcomeMessage(eventType: string): string {
    switch(eventType) {
      case "daily":
        return `Welcome to the Daily Scrum simulation. As the Scrum Master, you're about to facilitate this event.\n\nThe Daily Scrum is a 15-minute event for the Developers of the Scrum Team. According to the Scrum Guide, the purpose of the Daily Scrum is to inspect progress toward the Sprint Goal and adapt the Sprint Backlog as necessary, adjusting the upcoming planned work.\n\nHow would you start this Daily Scrum as the Scrum Master?`;
      case "planning":
        return `Welcome to the ${scrumEvents.sprintPlanning.name} simulation. As the Scrum Master, you'll be facilitating this ${scrumEvents.sprintPlanning.timebox} event. According to the Scrum Guide, ${scrumEvents.sprintPlanning.description}\n\nThe key topics to address are: ${scrumEvents.sprintPlanning.topics[0]}, ${scrumEvents.sprintPlanning.topics[1]}, and ${scrumEvents.sprintPlanning.topics[2]}.\n\nHow would you begin facilitating this Sprint Planning session?`;
      case "review":
        return `Welcome to the ${scrumEvents.sprintReview.name} simulation. As the Scrum Master, you'll be facilitating this ${scrumEvents.sprintReview.timebox} event. According to the Scrum Guide, ${scrumEvents.sprintReview.description}\n\nRemember, this is a working session to inspect the ${scrumArtifacts.artifacts.increment.name} and adapt the ${scrumArtifacts.artifacts.productBacklog.name}.\n\nHow would you start this Sprint Review as the Scrum Master?`;
      case "retro":
        return `Welcome to the ${scrumEvents.sprintRetrospective.name} simulation. As the Scrum Master, you'll be facilitating this ${scrumEvents.sprintRetrospective.timebox} event. According to the Scrum Guide, ${scrumEvents.sprintRetrospective.description}\n\nThis is an opportunity for the Scrum Team to identify improvements for processes, interactions, and tools.\n\nHow would you begin facilitating this Retrospective session?`;
      default:
        return `Welcome to this Scrum event simulation. As the Scrum Master, how would you like to facilitate this session?`;
    }
  }

  async getSimulationInfo(eventType: string): Promise<SimulationInfo> {
    try {
      const info = this.simulationInfos.get(eventType);
      if (!info) {
        console.error(`No simulation info found for event type: ${eventType}`);
        throw new Error(`No simulation info found for event type: ${eventType}`);
      }
      return info;
    } catch (error) {
      console.error("Error getting simulation info:", error);
      throw error;
    }
  }

  async getMessages(eventType: string): Promise<Message[]> {
    try {
      return this.messages.get(eventType) || [];
    } catch (error) {
      console.error("Error getting messages:", error);
      return [];
    }
  }

  async addMessage(insertMessage: InsertMessage): Promise<Message> {
    try {
      const id = this.messageCurrentId++;
      const timestamp = new Date();
      
      const message: Message = { 
        ...insertMessage, 
        id,
        timestamp
      };
      
      const eventMessages = this.messages.get(insertMessage.eventType) || [];
      eventMessages.push(message);
      this.messages.set(insertMessage.eventType, eventMessages);
      
      return message;
    } catch (error) {
      console.error("Error adding message:", error);
      throw error;
    }
  }

  async getScenarioChallenges(eventType: string): Promise<ScenarioChallenge[]> {
    try {
      // Return predefined challenges from the scenario-challenges.ts file
      return getScenarioChallenges(eventType);
    } catch (error) {
      console.error("Error getting scenario challenges:", error);
      return [];
    }
  }

  async startScenario(
    eventType: string, 
    scenarioType: ScenarioType, 
    scenarioId?: string, 
    customScenario?: string
  ): Promise<SimulationInfo> {
    try {
      // Get the current simulation info
      const currentInfo = await this.getSimulationInfo(eventType);
      
      // Create the updated simulation info
      const updatedInfo: SimulationInfo = {
        ...currentInfo,
        scenarioType
      };

      // Handle predefined scenario challenges
      if (scenarioType === 'predefined' && scenarioId) {
        const challenge = getScenarioChallengeById(scenarioId);
        if (!challenge) {
          throw new Error(`Scenario challenge not found: ${scenarioId}`);
        }
        updatedInfo.scenarioChallenge = challenge;
      }
      
      // Handle custom scenarios
      if (scenarioType === 'custom' && customScenario) {
        updatedInfo.customScenario = customScenario;
      }

      // Update the simulation info
      this.simulationInfos.set(eventType, updatedInfo);

      // Clear existing messages and add a new welcome message specific to the scenario
      const initialMessages: Message[] = [{
        id: this.messageCurrentId++,
        eventType,
        type: "ai",
        content: this.getScenarioWelcomeMessage(eventType, scenarioType, updatedInfo),
        timestamp: new Date()
      }];
      this.messages.set(eventType, initialMessages);

      return updatedInfo;
    } catch (error) {
      console.error("Error starting scenario:", error);
      throw error;
    }
  }

  private getScenarioWelcomeMessage(
    eventType: string, 
    scenarioType: ScenarioType | string, 
    simulationInfo: SimulationInfo
  ): string {
    if (scenarioType === 'predefined' && simulationInfo.scenarioChallenge) {
      // Access the challenge properties safely using type assertion with known structure
      const challenge = simulationInfo.scenarioChallenge as {
        id: string;
        title: string;
        description: string;
        eventType: string;
        difficulty: string;
      };
      return `Welcome to the "${challenge.title}" scenario for the ${eventType} Scrum event.\n\n${challenge.description}\n\nYou are the Scrum Master in this scenario. How would you address this challenge? I'll provide coaching and guidance as you work through it.`;
    } else if (scenarioType === 'custom' && simulationInfo.customScenario) {
      return `Welcome to your custom scenario for the ${eventType} Scrum event. Here's the situation you've described:\n\n${simulationInfo.customScenario}\n\nYou are the Scrum Master in this scenario. How would you approach this situation? I'll act as your AI coach, offering guidance and simulating team responses as needed.`;
    } else {
      return this.getWelcomeMessage(eventType);
    }
  }
  
  async resetEventMessages(eventType: string): Promise<void> {
    try {
      // Get the current simulation info
      const simulationInfo = await this.getSimulationInfo(eventType);
      
      // Create a new welcome message based on current simulation state
      const welcomeMessage: Message = {
        id: this.messageCurrentId++,
        eventType,
        type: "ai",
        content: simulationInfo.scenarioType 
          ? this.getScenarioWelcomeMessage(
              eventType, 
              simulationInfo.scenarioType as ScenarioType, 
              simulationInfo
            )
          : this.getWelcomeMessage(eventType),
        timestamp: new Date()
      };
      
      // Reset the event messages to just the welcome message
      this.messages.set(eventType, [welcomeMessage]);
      
      console.log(`Reset messages for ${eventType} event`);
    } catch (error) {
      console.error(`Error resetting messages for ${eventType} event:`, error);
      throw error;
    }
  }
}

export const storage = new MemStorage();
