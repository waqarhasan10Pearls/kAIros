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

    // Role descriptions for each event
    const roleDescriptions = {
      daily: "As the Scrum Master, you ensure the Daily Scrum happens and that the Developers understand its purpose. You teach the team to keep the event within the 15-minute time-box and ensure the event is positive and productive.",
      planning: "As the Scrum Master, you ensure the Sprint Planning happens and that attendees understand its purpose. You help the Scrum Team understand the need for a concise Product Backlog and Sprint Backlog, and teach them to respect the Sprint time-box.",
      review: "As the Scrum Master, you ensure the Sprint Review happens and that attendees understand its purpose. You help the Scrum Team and stakeholders collaborate effectively and create a valuable Increment.",
      retro: "As the Scrum Master, you ensure the Sprint Retrospective happens and that attendees understand its purpose. You promote a positive, productive meeting, and teach the team to keep it within the time-box while ensuring it becomes a formal opportunity to adapt."
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
        return "Good morning Developers! Welcome to our Daily Scrum. This is your 15-minute event to inspect progress toward the Sprint Goal and adapt the Sprint Backlog as needed. Let's create a plan for the next 24 hours. Who would like to start by sharing your progress toward our Sprint Goal?";
      case "planning":
        return "Welcome to our Sprint Planning! During the next few hours, we'll collaboratively define our Sprint Goal, select Product Backlog Items that align with that goal, and decompose that work into a plan. Alex, as the Product Owner, would you like to begin by discussing the highest value Product Backlog Items?";
      case "review":
        return "Welcome to our Sprint Review! This is where we inspect the Increment and adapt the Product Backlog based on what we've learned. We'll discuss what we've accomplished, answer questions, and collaborate on what to do next to optimize value. Taylor, are you ready to demonstrate what the team has completed this Sprint?";
      case "retro":
        return "Welcome to our Sprint Retrospective! This is our opportunity to inspect how the last Sprint went regarding individuals, interactions, processes, tools, and our Definition of Done. We'll identify the most helpful changes to improve our effectiveness as a Scrum Team. What went well during this Sprint that we should continue doing?";
      default:
        return "Welcome to our Scrum event! How can I help the team collaborate effectively today?";
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
