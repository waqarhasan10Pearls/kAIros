import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

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
              content: "You are an expert scrum master assistant that generates engaging icebreaker questions for team meetings."
            },
            {
              role: "user",
              content: `Generate a ${vibe} icebreaker question for a scrum team meeting. The question should be thought-provoking, concise (max 25 words), and suitable for work environment. Reply with ONLY the question text.`
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
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : "Error generating icebreaker question"
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
      const simulationInfo = await storage.getSimulationInfo(eventType);
      const previousMessages = await storage.getMessages(eventType);
      
      // Format the conversation history for the AI
      const messageHistory = previousMessages.map(msg => ({
        role: msg.type === "user" ? "user" : "assistant",
        content: msg.content
      }));

      // Prepare context for specific event type
      const eventContext = {
        daily: "This is a Daily Scrum. Focus on the three questions: what was done yesterday, what will be done today, and any blockers.",
        planning: "This is a Sprint Planning meeting. Focus on determining what can be delivered in the upcoming sprint and how that work will be achieved.",
        review: "This is a Sprint Review meeting. Focus on demonstrating what was accomplished during the sprint and gathering feedback.",
        retro: "This is a Sprint Retrospective meeting. Focus on what went well, what could be improved, and creating an action plan."
      };

      // Prepare system message
      const systemMessage = `
You are an experienced Scrum Master facilitating a ${eventType} Scrum event. 

${eventContext[eventType as keyof typeof eventContext]}

Team context:
- Sprint #${simulationInfo.sprintDetails.number}
- Previous velocity: ${simulationInfo.sprintDetails.previousVelocity} points
- Team members: ${simulationInfo.teamMembers.map(m => `${m.name} (${m.role})`).join(', ')}

As a Scrum Master, you:
- Facilitate the meeting but don't dominate
- Ask thoughtful questions to encourage participation
- Refer to team members by name
- Help the team address challenges according to Scrum principles
- Keep responses concise (max 3-4 sentences)
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
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : "Error sending message"
      });
    }
  });

  return httpServer;
}
