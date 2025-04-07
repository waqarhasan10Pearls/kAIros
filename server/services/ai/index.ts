/**
 * AI Service Layer
 * 
 * This service provides an abstraction over AI model providers (OpenRouter, OpenAI, Anthropic)
 * to enable flexible, powerful responses that leverage deep Scrum knowledge.
 */

import { scrumDefinition, scrumTheory, scrumValues, scrumTeam, scrumEvents, scrumArtifacts } from '../../scrum-knowledge';
import { ScrumEventType } from '../../../client/src/lib/types';
import { getScenarioChallengeById } from '../../scenario-challenges';
import { scrumPatterns } from './scrum-patterns';

// Environment variables
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || "";

// Possible AI providers
type AIProvider = "openrouter" | "openai" | "anthropic";

// Configuration for the AI service
interface AIServiceConfig {
  provider: AIProvider;
  preferredModel?: string;
  enhancedKnowledge?: boolean;
  temperature?: number;
  maxTokens?: number;
}

// Default configuration
const defaultConfig: AIServiceConfig = {
  provider: "openrouter", // Default to OpenRouter since we know it's available
  preferredModel: "anthropic/claude-3-haiku", // Reasonable default model
  enhancedKnowledge: true, // Use enhanced knowledge by default
  temperature: 0.7,
  maxTokens: 800
};

/**
 * Generate a systemMessage based on the event type and scenario
 */
function generateSystemMessage(
  eventType: ScrumEventType,
  scenarioId?: string,
  customScenario?: string
): string {
  const eventKey = mapEventTypeToEventKey(eventType);
  const event = scrumEvents[eventKey as keyof typeof scrumEvents];
  // Safely handle optional timebox property which might not exist on some event types
  let timeboxInfo = '';
  if ('timebox' in event) {
    timeboxInfo = `Timebox: ${event.timebox}`;
  }
  
  const eventInfo = `
    ${event.name}: ${event.description}
    ${timeboxInfo}
  `;

  const scenario = scenarioId 
    ? getScenarioChallengeById(scenarioId)
    : undefined;

  const scenarioInfo = scenario 
    ? `\nSCENARIO: ${scenario.title} - ${scenario.description}`
    : customScenario 
    ? `\nCUSTOM SCENARIO: ${customScenario}`
    : '';

  const enhancedKnowledge = generateEnhancedKnowledge(eventType);

  return `You are an expert Scrum coach with deep understanding of the Scrum Guide 2020.
Your role is to help and coach Scrum Masters, NOT to play the Scrum Master role yourself.
The user is a Scrum Master who is looking for guidance to handle a specific scenario.

CURRENT EVENT: ${eventInfo}

${scenarioInfo}

IMPORTANT COACHING GUIDELINES:
1. Provide thought-provoking questions, not direct solutions
2. Reference specific Scrum Guide 2020 principles when appropriate
3. Encourage the Scrum Master to facilitate, not dictate
4. Avoid answering with a generic format or numbered steps unless specifically asked
5. Keep responses focused, practical, and actionable
6. Remember you are coaching a Scrum Master, not team members

${enhancedKnowledge}

Now, provide coaching to the Scrum Master using your understanding of Scrum and the specific scenario.`;
}

/**
 * Generate enhanced knowledge content specific to the event type
 */
function generateEnhancedKnowledge(eventType: ScrumEventType): string {
  const eventKey = mapEventTypeToEventKey(eventType);
  const event = scrumEvents[eventKey as keyof typeof scrumEvents];
  const patterns = scrumPatterns.filter(p => p.relevantEvents.includes(eventType));
  
  let enhancedContent = `
SCRUM VALUES:
${scrumValues.values.join(', ')}
${scrumValues.description}

EVENT DETAILS:
${event.name}: ${event.description}
${'timebox' in event ? `Timebox: ${event.timebox}` : ''}

APPLICABLE SCRUM PATTERNS:
${patterns.map(p => `- ${p.name}: ${p.shortDescription}`).join('\n')}

COMMON PITFALLS:
${getCommonPitfalls(eventType)}
`;

  return enhancedContent;
}

/**
 * Generate common pitfalls for each event type
 */
function getCommonPitfalls(eventType: ScrumEventType): string {
  switch(eventType) {
    case "daily":
      return `
- Status reporting to the Scrum Master instead of team coordination
- Discussing details rather than focusing on the Sprint Goal
- Exceeding the 15-minute timebox
- Not addressing impediments
- Treating it as a micromanagement opportunity`;
    case "planning":
      return `
- Focusing on output (tasks) rather than outcome (Sprint Goal)
- Insufficient Product Backlog refinement beforehand
- Product Owner dictating how work should be done
- Overcommitting based on external pressure
- Not creating a clear Sprint Goal`;
    case "review":
      return `
- Treating it as a delivery milestone rather than a learning opportunity
- Making it a presentation rather than a collaborative inspection
- Not involving stakeholders meaningfully
- Focusing only on completed items without discussing the Sprint as a whole
- Not using feedback to inform Product Backlog adaptation`;
    case "retro":
      return `
- Identifying issues without creating actionable improvement plans
- Focusing on people/blame rather than systems/processes
- Not creating psychological safety
- Manager presence inhibiting honest discussion
- Not implementing improvements from previous retrospectives`;
    default:
      return "- No specific pitfalls identified";
  }
}

/**
 * Maps the event type to the corresponding key in the scrumEvents object
 */
function mapEventTypeToEventKey(eventType: ScrumEventType): string {
  switch(eventType) {
    case "daily": return "dailyScrum";
    case "planning": return "sprintPlanning";
    case "review": return "sprintReview";
    case "retro": return "sprintRetrospective";
    default: return "dailyScrum";
  }
}

/**
 * Generate an icebreaker question
 */
export async function generateIcebreakerQuestion(
  vibe: string, 
  config: Partial<AIServiceConfig> = {}
): Promise<{ question: string }> {
  const mergedConfig = { ...defaultConfig, ...config };
  
  // Custom system message for icebreakers
  const systemMessage = `You are an expert Scrum Master assistant that generates engaging icebreaker questions that promote Agile principles and Scrum values.

Scrum Values to embody:
${scrumValues.values.map(value => `- ${value}`).join('\n')}

${scrumValues.description}

Generate a single, thought-provoking icebreaker question for a Scrum team with the following vibe: ${vibe}.
The question should be concise (1-2 sentences), open-ended, and encourage reflection or discussion related to team dynamics, collaboration, or Agile principles.
Do not include any explanations, just return the question directly.`;

  try {
    const result = await makeAIRequest(
      [{ role: "system", content: systemMessage }],
      mergedConfig
    );

    return { question: result.trim() };
  } catch (error) {
    console.error("Error generating icebreaker question:", error);
    throw error;
  }
}

/**
 * Generate a team activity
 */
export async function generateTeamActivity(
  vibe: string,
  config: Partial<AIServiceConfig> = {}
): Promise<{ 
  title: string; 
  duration: string; 
  description: string; 
  instructions: string[]; 
}> {
  const mergedConfig = { ...defaultConfig, ...config };
  
  // Custom system message for team activities
  const systemMessage = `You are an expert Scrum Master assistant that generates engaging team activities that promote Agile principles and Scrum values.

Scrum Values to embody:
${scrumValues.values.map(value => `- ${value}`).join('\n')}

${scrumValues.description}

Generate a single team activity with the following vibe: ${vibe}.
The activity should be practical, engaging, and directly related to improving team collaboration or Scrum practices.

Return your response as a JSON object with these keys:
- title: A short, catchy title for the activity (5-7 words)
- duration: Estimated time needed (e.g., "10-15 minutes")
- description: A brief 1-2 sentence description of the activity and its purpose
- instructions: An array of strings, each string being a single step in the activity instructions (keep each step concise)

Make sure the instructions are clear, actionable, and can be completed within the stated duration.`;

  try {
    const result = await makeAIRequest(
      [{ role: "system", content: systemMessage }],
      mergedConfig
    );

    // Parse JSON response
    try {
      const parsedResult = JSON.parse(result);
      return {
        title: parsedResult.title,
        duration: parsedResult.duration,
        description: parsedResult.description,
        instructions: Array.isArray(parsedResult.instructions) 
          ? parsedResult.instructions 
          : [parsedResult.instructions]
      };
    } catch (jsonError) {
      console.error("Error parsing activity JSON:", jsonError);
      
      // Fallback in case of parsing error
      return {
        title: "Team Collaboration Activity",
        duration: "15-20 minutes",
        description: "An activity to strengthen team collaboration and communication.",
        instructions: [
          "Form small groups of 2-3 people.",
          "Each group identifies one Scrum value they want to improve.",
          "Groups create a small action plan to embody this value better.",
          "Share insights with the full team.",
          "Vote on one team-wide improvement to implement."
        ]
      };
    }
  } catch (error) {
    console.error("Error generating team activity:", error);
    throw error;
  }
}

/**
 * Generate an AI response for a user message in the context of a Scrum event
 */
export async function generateAIResponse(
  eventType: ScrumEventType,
  messages: Array<{ role: string; content: string }>,
  scenarioId?: string,
  customScenario?: string,
  config: Partial<AIServiceConfig> = {}
): Promise<string> {
  const mergedConfig = { ...defaultConfig, ...config };
  
  const systemMessage = generateSystemMessage(eventType, scenarioId, customScenario);
  const allMessages = [
    { role: "system", content: systemMessage },
    ...messages
  ];
  
  try {
    const result = await makeAIRequest(allMessages, mergedConfig);
    return result.trim();
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw error;
  }
}

/**
 * Make an AI request using the configured provider
 */
async function makeAIRequest(
  messages: Array<{ role: string; content: string }>, 
  config: AIServiceConfig
): Promise<string> {
  // Check if we have API keys
  if (config.provider === "openrouter" && !OPENROUTER_API_KEY) {
    throw new Error("OpenRouter API key is missing");
  }
  if (config.provider === "openai" && !OPENAI_API_KEY) {
    throw new Error("OpenAI API key is missing");
  }
  if (config.provider === "anthropic" && !ANTHROPIC_API_KEY) {
    throw new Error("Anthropic API key is missing");
  }

  // Use OpenRouter (which we know is available)
  if (config.provider === "openrouter" || !config.provider) {
    return makeOpenRouterRequest(messages, config);
  }
  
  // These would be implemented if we had the API keys
  if (config.provider === "openai") {
    return makeOpenAIRequest(messages, config);
  }
  
  if (config.provider === "anthropic") {
    return makeAnthropicRequest(messages, config);
  }

  throw new Error("Invalid AI provider configured");
}

/**
 * Make a request to the OpenRouter API
 */
async function makeOpenRouterRequest(
  messages: Array<{ role: string; content: string }>,
  config: AIServiceConfig
): Promise<string> {
  const model = config.preferredModel || "anthropic/claude-3-haiku";
  
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "HTTP-Referer": "https://kairos-coach.com"
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: config.maxTokens || 800,
      temperature: config.temperature || 0.7
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to generate AI response");
  }

  const data = await response.json();
  return data.choices[0]?.message?.content?.trim() || "";
}

/**
 * Make a request to the OpenAI API (stub for future implementation)
 */
async function makeOpenAIRequest(
  messages: Array<{ role: string; content: string }>,
  config: AIServiceConfig
): Promise<string> {
  // This would be implemented if we had the OpenAI API key
  throw new Error("OpenAI API implementation not available - missing API key");
}

/**
 * Make a request to the Anthropic API (stub for future implementation)
 */
async function makeAnthropicRequest(
  messages: Array<{ role: string; content: string }>,
  config: AIServiceConfig
): Promise<string> {
  // This would be implemented if we had the Anthropic API key
  throw new Error("Anthropic API implementation not available - missing API key");
}

// Export the main functions
export const AI = {
  generateIcebreakerQuestion,
  generateTeamActivity,
  generateAIResponse
};

export default AI;