import { 
  type InsertMessage, 
  type Message, 
  type SimulationInfo, 
  type InsertSimulationInfo 
} from "../shared/schema";
import { scrumEvents, scrumTeam, scrumArtifacts } from "./scrum-knowledge";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getSimulationInfo(eventType: string): Promise<SimulationInfo>;
  getMessages(eventType: string): Promise<Message[]>;
  addMessage(message: InsertMessage): Promise<Message>;
}

export class MemStorage implements IStorage {
  private simulationInfos: Map<string, SimulationInfo>;
  private messages: Map<string, Message[]>;
  private messageCurrentId: number;
  private simulationInfoCurrentId: number;

  constructor() {
    this.simulationInfos = new Map();
    this.messages = new Map();
    this.messageCurrentId = 1;
    this.simulationInfoCurrentId = 1;
    
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

    // Role descriptions based on Scrum Guide 2020 for each event
    const roleDescriptions = {
      daily: `As the ${scrumTeam.roles.scrumMaster.name}, your primary accountability is to ensure the Daily Scrum happens, is effective, and stays within the ${scrumEvents.dailyScrum.timebox} timebox. ${scrumEvents.dailyScrum.description} ${scrumEvents.dailyScrum.structure}`,
      planning: `As the ${scrumTeam.roles.scrumMaster.name}, you facilitate the Sprint Planning which ${scrumEvents.sprintPlanning.description} The event is timeboxed to ${scrumEvents.sprintPlanning.timebox}. You help the team address: ${scrumEvents.sprintPlanning.topics.join(', ')}.`,
      review: `As the ${scrumTeam.roles.scrumMaster.name}, you facilitate the Sprint Review where ${scrumEvents.sprintReview.description} ${scrumEvents.sprintReview.nature} The event is timeboxed to ${scrumEvents.sprintReview.timebox}.`,
      retro: `As the ${scrumTeam.roles.scrumMaster.name}, you facilitate the Sprint Retrospective where ${scrumEvents.sprintRetrospective.description} The team examines: ${scrumEvents.sprintRetrospective.examination.join(', ')}. The event is timeboxed to ${scrumEvents.sprintRetrospective.timebox}.`
    };

    // Create simulation info for each event
    events.forEach((eventType) => {
      const id = this.simulationInfoCurrentId++;
      const info: SimulationInfo = {
        id,
        eventType,
        teamMembers,
        sprintDetails,
        roleDescription: roleDescriptions[eventType as keyof typeof roleDescriptions]
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
        return `Good morning ${scrumTeam.roles.developers.name}! Welcome to our ${scrumEvents.dailyScrum.name}. ${scrumEvents.dailyScrum.description} This is a ${scrumEvents.dailyScrum.timebox} event. Let's focus on progress toward the ${scrumArtifacts.artifacts.sprintBacklog.commitment.name} and create a plan for the next 24 hours. Who would like to start by sharing your progress?`;
      case "planning":
        return `Welcome to our ${scrumEvents.sprintPlanning.name}! ${scrumEvents.sprintPlanning.description} We have ${scrumEvents.sprintPlanning.timebox} to address: ${scrumEvents.sprintPlanning.topics[0]}, ${scrumEvents.sprintPlanning.topics[1]}, and ${scrumEvents.sprintPlanning.topics[2]}. Alex, as the ${scrumTeam.roles.productOwner.name}, would you like to begin by discussing the highest value ${scrumArtifacts.artifacts.productBacklog.name} items?`;
      case "review":
        return `Welcome to our ${scrumEvents.sprintReview.name}! ${scrumEvents.sprintReview.description} Remember, this is a working session, not just a presentation. We'll examine what we've accomplished and discuss how to optimize value going forward. Taylor, would you like to start by showing the ${scrumArtifacts.artifacts.increment.name} the team has completed this Sprint?`;
      case "retro":
        return `Welcome to our ${scrumEvents.sprintRetrospective.name}! ${scrumEvents.sprintRetrospective.description} Let's examine: ${scrumEvents.sprintRetrospective.examination.join(', ')}. What went well during this Sprint that we should continue doing?`;
      default:
        return "Welcome to our Scrum event! How can I help the team collaborate effectively today?";
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
}

export const storage = new MemStorage();
