import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { SimulationInfo, Message } from "../shared/schema";
import { TeamMember, SprintDetails, ScenarioType } from "../client/src/lib/types";
import { scrumEvents, scrumTeam, scrumValues } from "./scrum-knowledge";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
console.log("OpenRouter API Key available:", !!OPENROUTER_API_KEY);

// Validate icebreaker request body
const icebreakerSchema = z.object({
  vibe: z.enum(["random", "funny", "deep", "creative", "teambuilding", "technical", "reflection", "energizer"])
});

// Validate message request body
const messageSchema = z.object({
  eventType: z.enum(["daily", "planning", "review", "retro"]),
  content: z.string().min(1)
});

// Validate start scenario request body
const startScenarioSchema = z.object({
  eventType: z.enum(["daily", "planning", "review", "retro"]),
  scenarioType: z.enum(["predefined", "custom"]),
  scenarioId: z.string().optional(),
  customScenario: z.string().optional()
})
.refine(data => {
  if (data.scenarioType === 'predefined') {
    return !!data.scenarioId;
  }
  if (data.scenarioType === 'custom') {
    return !!data.customScenario;
  }
  return false;
}, {
  message: "scenarioId is required for predefined scenarios, customScenario is required for custom scenarios"
});

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Icebreaker Generator endpoint
  app.post("/api/icebreaker", async (req: Request, res: Response) => {
    try {
      const { vibe } = icebreakerSchema.parse(req.body);
      
      console.log(`Generating icebreaker with vibe: ${vibe}`);
      
      // If there's no API key, return a fallback response
      if (!OPENROUTER_API_KEY) {
        console.log("No OpenRouter API key available, returning fallback response");
        return res.json({
          question: "What's one way your team demonstrated a Scrum value in the last Sprint?"
        });
      }
      
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://kairos-coach.com"
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
- ${
  vibe === "funny" ? "Lighthearted and humorous" : 
  vibe === "deep" ? "Reflective and meaningful" : 
  vibe === "creative" ? "Imaginative and innovative" : 
  vibe === "teambuilding" ? "Focused on team cohesion and collaboration" : 
  vibe === "technical" ? "Related to development practices and technical excellence" : 
  vibe === "reflection" ? "Encouraging thoughtful reflection on processes and practices" : 
  vibe === "energizer" ? "Energizing and momentum-building" : 
  "Balanced and engaging"
}

Reply with ONLY the question text.`
            }
          ],
          max_tokens: 150
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
      
      console.log(`Sending message in ${eventType} event: ${content.substring(0, 30)}...`);
      
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
You are an AI Coach supporting the user, who is a Scrum Master facilitating a ${eventType} Scrum event.

About this scenario:
${eventContext[eventType as keyof typeof eventContext]}

Team context:
- Sprint #${typedSimulationInfo.sprintDetails.number}
- Previous velocity: ${typedSimulationInfo.sprintDetails.previousVelocity} points
- Team members: ${typedSimulationInfo.teamMembers.map((m: TeamMember) => `${m.name} (${m.role})`).join(', ')}

YOUR ROLE: You are NOT the Scrum Master. You are an AI Coach supporting the user, who IS the Scrum Master.

As an AI Coach, you should:
1. Provide guidance and advice to help the user (Scrum Master) facilitate the event effectively
2. Ask powerful coaching questions that help the Scrum Master reflect and improve
3. Share relevant knowledge from the Scrum Guide 2020 and Agile Manifesto when appropriate
4. Simulate team member responses when the Scrum Master interacts with the team
5. Provide feedback on the Scrum Master's approach based on Scrum principles

Agile Manifesto Values:
- Individuals and interactions over processes and tools
- Working software over comprehensive documentation 
- Customer collaboration over contract negotiation
- Responding to change over following a plan

The Scrum Values that should be reinforced:
${scrumValues.values.map(value => `- ${value}`).join('\n')}

Additional requirements:
- Keep responses thoughtful but reasonably concise (up to 6-7 sentences) and focused on the event at hand
- Be positive and solution-oriented
- Focus on empiricism: transparency, inspection, and adaptation
- Encourage self-management and cross-functionality
- Make it clear that the USER is the Scrum Master and YOU are the coach/facilitator/simulator
`;

      // If there's no API key, return a fallback response
      if (!OPENROUTER_API_KEY) {
        console.log("No OpenRouter API key available, returning fallback response");
        // Create a generic AI Coach response based on the event type
        let aiResponse = '';
        switch(eventType) {
          case "daily":
            aiResponse = "As the Scrum Master, you might want to consider how the team is progressing toward the Sprint Goal. A powerful question you could ask might be: \"What impediments are preventing us from achieving our Sprint Goal?\" Remember, the Daily Scrum is for the Developers to inspect progress and adapt their plan.";
            break;
          case "planning":
            aiResponse = "In your role as Scrum Master, you're facilitating this Planning session. Have you considered asking the team how confident they feel about the Definition of Done for these items? The Product Owner seems concerned about the scope - how might you help balance ambition with realism?";
            break;
          case "review":
            aiResponse = "As you facilitate this Sprint Review, consider how you might help the team gather meaningful feedback from stakeholders. What questions could you ask to ensure the team understands how their work impacts the product's value? Remember the Review is an opportunity for inspection and adaptation of the Product.";
            break;
          case "retro":
            aiResponse = "In facilitating this Retrospective, you might want to focus on creating a safe space for the team to reflect honestly. Consider asking: \"What one change could make us more effective as a team?\" Remember that the Retrospective is about identifying improvements, not just listing problems.";
            break;
          default:
            aiResponse = "As the Scrum Master facilitating this event, your focus on empiricism is key. Consider how you might help the team inspect what's happening and adapt accordingly. What powerful questions could you ask that would help the team self-organize around this challenge?";
        }
        
        // Add AI response to storage
        const aiMessage = await storage.addMessage({
          type: "ai",
          content: aiResponse,
          eventType
        });
        
        return res.json({ success: true, message: aiMessage });
      }

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://kairos-coach.com"
        },
        body: JSON.stringify({
          model: "anthropic/claude-3-haiku",
          messages: [
            { role: "system", content: systemMessage },
            ...messageHistory,
            { role: "user", content }
          ],
          max_tokens: 800
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

  // Get scenario challenges for a specific event type
  app.get("/api/scenario-challenges", async (req: Request, res: Response) => {
    try {
      const eventType = req.query.eventType as string;
      if (!["daily", "planning", "review", "retro"].includes(eventType)) {
        return res.status(400).json({ message: "Invalid event type" });
      }

      const challenges = await storage.getScenarioChallenges(eventType);
      return res.json(challenges);
    } catch (error) {
      console.error("Error fetching scenario challenges:", error);
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : "Error fetching scenario challenges"
      });
    }
  });

  // Start a scenario (predefined or custom)
  app.post("/api/start-scenario", async (req: Request, res: Response) => {
    try {
      const { eventType, scenarioType, scenarioId, customScenario } = 
        startScenarioSchema.parse(req.body);
      
      console.log(`Starting ${scenarioType} scenario for ${eventType} event`);
      
      const updatedSimulationInfo = await storage.startScenario(
        eventType, 
        scenarioType as ScenarioType, 
        scenarioId, 
        customScenario
      );
      
      return res.json(updatedSimulationInfo);
    } catch (error) {
      console.error("Error starting scenario:", error);
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : "Error starting scenario"
      });
    }
  });

  return httpServer;
}
