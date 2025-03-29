import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { SimulationInfo, Message } from "../shared/schema";
import { TeamMember, SprintDetails } from "../client/src/lib/types";
import { scrumEvents, scrumTeam, scrumValues } from "./scrum-knowledge";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";

// Validate icebreaker request body
const icebreakerSchema = z.object({
  vibe: z.enum(["random", "funny", "deep", "creative"])
});

// Validate message request body
const messageSchema = z.object({
  eventType: z.enum(["daily", "planning", "review", "retro"]),
  content: z.string().min(1)
});

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Icebreaker Generator endpoint
  app.post("/api/icebreaker", async (req: Request, res: Response) => {
    try {
      const { vibe } = icebreakerSchema.parse(req.body);
      
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://scrummaster-assistant.com"
        },
        body: JSON.stringify({
          model: "gryphe/mythomax-l2-13b",
          messages: [
            {
              role: "system",
              content: `You are an expert Scrum Master assistant that generates engaging icebreaker questions that promote Agile principles and Scrum values.

Scrum Values to embody:
${scrumValues.values.map(value => `- ${value}: ${value}`).join('\n')}

${scrumValues.description}

Scrum Team Structure:
${scrumTeam.composition}
${scrumTeam.characteristics.map(char => `- ${char}`).join('\n')}
`
            },
            {
              role: "user",
              content: `Generate a ${vibe} icebreaker question for a Scrum Team meeting. The question should be:
- Thought-provoking and concise (max 25 words)
- Designed to foster transparency, inspection, and adaptation
- Supportive of building cross-functional collaboration and self-management
- Aligned with Scrum values (commitment, courage, focus, openness, respect)
- ${vibe === "funny" ? "Lighthearted and humorous" : vibe === "deep" ? "Reflective and meaningful" : vibe === "creative" ? "Imaginative and innovative" : "Balanced and engaging"}

Reply with ONLY the question text.`
            }
          ],
          max_tokens: 50
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to generate icebreaker question");
      }

      const data = await response.json();
      const question = data.choices[0]?.message?.content?.trim() || "What's something unexpected you learned recently that changed your perspective?";

      return res.json({ question });
    } catch (error) {
      console.error("Error generating icebreaker:", error);
      // Provide more detailed error logging
      if (error instanceof Error) {
        console.error("Error details:", error.message, error.stack);
      } else if (error instanceof Response) {
        console.error("Error status:", error.status, error.statusText);
        try {
          const errorData = await error.json();
          console.error("API error response:", errorData);
        } catch (e) {
          console.error("Could not parse error response");
        }
      }
      
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : "Error generating icebreaker question. Check server logs for details."
      });
    }
  });

  // Simulation info endpoint
  app.get("/api/simulation-info", async (req: Request, res: Response) => {
    try {
      const eventType = req.query.eventType as string;
      if (!["daily", "planning", "review", "retro"].includes(eventType)) {
        return res.status(400).json({ message: "Invalid event type" });
      }

      const simulationInfo = await storage.getSimulationInfo(eventType);
      return res.json(simulationInfo);
    } catch (error) {
      console.error("Error fetching simulation info:", error);
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : "Error fetching simulation info"
      });
    }
  });

  // Get messages for a simulation
  app.get("/api/messages", async (req: Request, res: Response) => {
    try {
      const eventType = req.query.eventType as string;
      if (!["daily", "planning", "review", "retro"].includes(eventType)) {
        return res.status(400).json({ message: "Invalid event type" });
      }

      const messages = await storage.getMessages(eventType);
      return res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : "Error fetching messages"
      });
    }
  });

  // Send a message in a simulation
  app.post("/api/messages", async (req: Request, res: Response) => {
    try {
      const { eventType, content } = messageSchema.parse(req.body);
      
      // Add user message
      const userMessage = await storage.addMessage({
        type: "user",
        content,
        eventType
      });

      // Get context for the AI
      const simulationInfo: SimulationInfo = await storage.getSimulationInfo(eventType);
      const previousMessages: Message[] = await storage.getMessages(eventType);
      
      // Format the conversation history for the AI
      const messageHistory = previousMessages.map(msg => ({
        role: msg.type === "user" ? "user" : "assistant",
        content: msg.content
      }));

      // Use Scrum event descriptions from the Scrum Guide 2020
      const eventContext = {
        daily: scrumEvents.dailyScrum.description,
        planning: scrumEvents.sprintPlanning.description,
        review: scrumEvents.sprintReview.description,
        retro: scrumEvents.sprintRetrospective.description
      };

      // Safely cast to expected types to handle typechecking
      const typedSimulationInfo = simulationInfo as unknown as {
        sprintDetails: SprintDetails;
        teamMembers: TeamMember[];
      };
      
      // Prepare system message with structured Scrum knowledge
      const systemMessage = `
You are an experienced Scrum Master facilitating a ${eventType} Scrum event. 

${eventContext[eventType as keyof typeof eventContext]}

Team context:
- Sprint #${typedSimulationInfo.sprintDetails.number}
- Previous velocity: ${typedSimulationInfo.sprintDetails.previousVelocity} points
- Team members: ${typedSimulationInfo.teamMembers.map((m: TeamMember) => `${m.name} (${m.role})`).join(', ')}

As a ${scrumTeam.roles.scrumMaster.name}, you:
${scrumTeam.roles.scrumMaster.description}

Your accountabilities to the Team:
${scrumTeam.roles.scrumMaster.accountabilities.toTeam.map(item => `- ${item}`).join('\n')}

The Scrum Values you embody:
${scrumValues.values.map(value => `- ${value}`).join('\n')}

Additional requirements:
- Keep responses concise (max 3-4 sentences) and focused on the event at hand
- Be positive and solution-oriented
- Focus on empiricism: transparency, inspection, and adaptation
- Encourage self-management and cross-functionality
`;

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://scrummaster-assistant.com"
        },
        body: JSON.stringify({
          model: "anthropic/claude-3-haiku",
          messages: [
            { role: "system", content: systemMessage },
            ...messageHistory,
            { role: "user", content }
          ],
          max_tokens: 250
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to generate AI response");
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content?.trim();
      
      // Add AI response
      const aiMessage = await storage.addMessage({
        type: "ai",
        content: aiResponse,
        eventType
      });

      return res.json({ success: true, message: aiMessage });
    } catch (error) {
      console.error("Error sending message:", error);
      // Provide more detailed error logging
      if (error instanceof Error) {
        console.error("Error details:", error.message, error.stack);
      } else if (error instanceof Response) {
        console.error("Error status:", error.status, error.statusText);
        try {
          const errorData = await error.json();
          console.error("API error response:", errorData);
        } catch (e) {
          console.error("Could not parse error response");
        }
      }
      
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : "Error processing message. Check server logs for details."
      });
    }
  });

  return httpServer;
}
