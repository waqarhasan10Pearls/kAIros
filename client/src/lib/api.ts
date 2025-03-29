import { apiRequest } from "@/lib/queryClient";
import { VibeType, ScrumEventType } from "./types";

// Icebreaker Generator API
export const generateIcebreaker = async (vibe: VibeType) => {
  const res = await apiRequest("POST", "/api/icebreaker", { vibe });
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
