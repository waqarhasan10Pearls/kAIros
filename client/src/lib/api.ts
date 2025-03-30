import { apiRequest } from "./queryClient";
import { VibeType, ScrumEventType, ScenarioChallenge } from "./types";

// Icebreaker Generator API
export const generateIcebreaker = async (vibe: VibeType, timestamp?: number) => {
  // Add timestamp to prevent caching and ensure fresh results
  const params = timestamp ? { vibe, _t: timestamp } : { vibe };
  const res = await apiRequest("POST", "/api/icebreaker", params);
  return res.json();
};

// Team Activity Generator API
export const generateActivity = async (vibe: VibeType, timestamp?: number) => {
  // Add timestamp to prevent caching and ensure fresh results
  const params = timestamp ? { vibe, _t: timestamp } : { vibe };
  const res = await apiRequest("POST", "/api/icebreaker-activity", params);
  return res.json();
};

// Simulation Info API
export const getSimulationInfo = async (eventType: ScrumEventType) => {
  const res = await apiRequest("GET", `/api/simulation-info?eventType=${eventType}`);
  return res.json();
};

// Chat Messages API
export const getMessages = async (eventType: ScrumEventType) => {
  const res = await apiRequest("GET", `/api/messages?eventType=${eventType}`);
  return res.json();
};

export const sendMessage = async (eventType: ScrumEventType, content: string) => {
  const res = await apiRequest("POST", "/api/messages", { eventType, content });
  return res.json();
};

export const resetEventMessages = async (eventType: ScrumEventType) => {
  const res = await apiRequest("POST", `/api/reset-messages?eventType=${eventType}`);
  return res.json();
};


// Scenario Challenge APIs
export const getScenarioChallenges = async (eventType: ScrumEventType) => {
  const res = await apiRequest("GET", `/api/scenario-challenges?eventType=${eventType}`);
  return res.json();
};

export const startScenarioChallenge = async (eventType: ScrumEventType, scenarioId: string) => {
  const res = await apiRequest("POST", "/api/start-scenario", { 
    eventType, 
    scenarioId,
    scenarioType: 'predefined' 
  });
  return res.json();
};

export const startCustomScenario = async (eventType: ScrumEventType, customScenario: string) => {
  const res = await apiRequest("POST", "/api/start-scenario", { 
    eventType, 
    customScenario,
    scenarioType: 'custom' 
  });
  return res.json();
};
