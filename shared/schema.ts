import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Simulation info schema
export const simulationInfo = pgTable("simulation_info", {
  id: serial("id").primaryKey(),
  eventType: text("event_type").notNull(),
  teamMembers: jsonb("team_members").notNull(),
  sprintDetails: jsonb("sprint_details").notNull(),
  roleDescription: text("role_description").notNull(),
});

export const insertSimulationInfoSchema = createInsertSchema(simulationInfo).pick({
  eventType: true,
  teamMembers: true,
  sprintDetails: true,
  roleDescription: true,
});

// Messages schema
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  eventType: text("event_type").notNull(),
  type: text("type").notNull(), // 'user' or 'ai'
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  eventType: true,
  type: true,
  content: true,
});

// Schema types
export type InsertSimulationInfo = z.infer<typeof insertSimulationInfoSchema>;
export type SimulationInfo = typeof simulationInfo.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
