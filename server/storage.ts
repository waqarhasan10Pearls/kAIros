import { 
  type InsertMessage, 
  type Message, 
  type SimulationInfo, 
  type InsertSimulationInfo 
} from "../shared/schema";

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
    
    // Common team members across all events
    const teamMembers = [
      { name: "Alex", role: "Product Owner", status: "available" },
      { name: "Taylor", role: "Developer", status: "available" },
      { name: "Jordan", role: "Developer", status: "available" },
      { name: "Morgan", role: "Designer", status: "available" },
      { name: "Casey", role: "Developer", status: "unavailable" }
    ];

    // Sprint details
    const sprintDetails = {
      number: 7,
      duration: "2 weeks",
      previousVelocity: 34
    };

    // Role descriptions for each event
    const roleDescriptions = {
      daily: "As the Scrum Master, facilitate the Daily Scrum to help the team share progress and identify impediments.",
      planning: "As the Scrum Master, facilitate Sprint Planning to help the team determine what can be delivered and how the work will be achieved.",
      review: "As the Scrum Master, facilitate the Sprint Review to help the team demonstrate what was accomplished during the sprint.",
      retro: "As the Scrum Master, facilitate the Sprint Retrospective to help the team plan ways to improve quality and effectiveness."
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
        return "Good morning team! Welcome to our Daily Scrum. Let's each share what we worked on yesterday, what we're planning for today, and if there are any impediments. Who would like to start?";
      case "planning":
        return "Welcome to Sprint Planning! Today we'll decide what can be delivered in the upcoming sprint and how we'll accomplish it. Alex, would you like to walk us through the highest priority items in the Product Backlog?";
      case "review":
        return "Welcome to our Sprint Review! We're here to inspect the increment and adapt the Product Backlog. Taylor, are you ready to demonstrate the first feature the team completed?";
      case "retro":
        return "Welcome to our Sprint Retrospective! This is our opportunity to reflect on how the last sprint went regarding people, processes, and tools. Let's start by discussing what went well. Anyone want to share first?";
      default:
        return "Welcome to our Scrum session! How can I help facilitate today?";
    }
  }

  async getSimulationInfo(eventType: string): Promise<SimulationInfo> {
    const info = this.simulationInfos.get(eventType);
    if (!info) {
      throw new Error(`No simulation info found for event type: ${eventType}`);
    }
    return info;
  }

  async getMessages(eventType: string): Promise<Message[]> {
    return this.messages.get(eventType) || [];
  }

  async addMessage(insertMessage: InsertMessage): Promise<Message> {
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
  }
}

export const storage = new MemStorage();
