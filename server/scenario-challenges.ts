/**
 * PREDEFINED SCENARIO CHALLENGES
 * These scenarios are designed to help Scrum Masters practice handling common challenges
 * Each challenge is linked to a specific Scrum event and has a difficulty level
 */
import { ScenarioChallenge } from "../client/src/lib/types";
import { scrumEvents, scrumTeam, scrumArtifacts } from "./scrum-knowledge";

export const predefinedChallenges: ScenarioChallenge[] = [
  // Daily Scrum Challenges
  {
    id: "daily-status-report",
    title: "Status Report Meeting",
    description: "The Daily Scrum has devolved into a status reporting session where team members are reporting progress to you instead of planning their day and coordinating with each other.",
    eventType: "daily",
    difficulty: "beginner"
  },
  {
    id: "daily-overtime",
    title: "Overtime Issues",
    description: "Developers are consistently working overtime to meet Sprint commitments, but they're not discussing these challenges during the Daily Scrum.",
    eventType: "daily",
    difficulty: "intermediate"
  },
  {
    id: "daily-absence",
    title: "Key Member Absence",
    description: "A critical Developer is unexpectedly absent, threatening the Sprint Goal. The Scrum Team needs to replan their day but is uncertain how to proceed.",
    eventType: "daily",
    difficulty: "intermediate"
  },
  {
    id: "daily-details",
    title: "Technical Deep Dive",
    description: "The Daily Scrum consistently runs over the 15-minute timebox because Developers dive into detailed technical discussions instead of focusing on progress toward the Sprint Goal.",
    eventType: "daily",
    difficulty: "beginner"
  },
  {
    id: "daily-silence",
    title: "Silent Team Members",
    description: "Some Developers rarely speak during the Daily Scrum, while others dominate the conversation, creating an imbalance in team communication.",
    eventType: "daily",
    difficulty: "advanced"
  },

  // Sprint Planning Challenges
  {
    id: "planning-refinement",
    title: "Unrefined Backlog",
    description: "The Scrum Team is attempting Sprint Planning, but many Product Backlog items are poorly defined, lacking clarity and estimation.",
    eventType: "planning",
    difficulty: "beginner"
  },
  {
    id: "planning-capacity",
    title: "Capacity Planning Issues",
    description: "The Product Owner is pushing the Developers to commit to more work than their historical velocity suggests they can accomplish.",
    eventType: "planning",
    difficulty: "intermediate"
  },
  {
    id: "planning-dependencies",
    title: "External Dependencies",
    description: "Several high-priority Product Backlog items have external dependencies on other teams or vendors, which may impact the Scrum Team's ability to meet the Sprint Goal.",
    eventType: "planning",
    difficulty: "advanced"
  },
  {
    id: "planning-scope",
    title: "Unclear Sprint Goal",
    description: "The Scrum Team is struggling to establish a clear, focused Sprint Goal that provides coherence to their work.",
    eventType: "planning",
    difficulty: "intermediate"
  },
  {
    id: "planning-technical-debt",
    title: "Technical Debt Dilemma",
    description: "The Developers have accumulated significant technical debt that is slowing development, but the Product Owner is reluctant to allocate Sprint capacity to address it.",
    eventType: "planning",
    difficulty: "advanced"
  },

  // Sprint Review Challenges
  {
    id: "review-incomplete",
    title: "Incomplete Increment",
    description: "The Scrum Team has not completed all Sprint Backlog items and is unsure how to approach the Sprint Review when the Increment is incomplete.",
    eventType: "review",
    difficulty: "beginner"
  },
  {
    id: "review-stakeholder",
    title: "Stakeholder Criticism",
    description: "A key stakeholder is expressing strong disappointment with the Increment during the Sprint Review, creating tension and defensiveness.",
    eventType: "review",
    difficulty: "advanced"
  },
  {
    id: "review-feedback",
    title: "Lack of Feedback",
    description: "During the Sprint Review, stakeholders are passively observing rather than engaging with the Increment, providing little actionable feedback.",
    eventType: "review",
    difficulty: "intermediate"
  },
  {
    id: "review-scope-change",
    title: "Scope Change Requests",
    description: "Stakeholders are requesting significant feature changes during the Sprint Review, rather than focusing on inspecting what was completed.",
    eventType: "review",
    difficulty: "intermediate"
  },
  {
    id: "review-business-value",
    title: "Business Value Concerns",
    description: "The Product Owner is struggling to articulate how the completed Increment delivers business value, making it difficult to adjust the Product Backlog effectively.",
    eventType: "review",
    difficulty: "advanced"
  },

  // Sprint Retrospective Challenges
  {
    id: "retro-silence",
    title: "Silence and Disengagement",
    description: "The Scrum Team is disengaged during the Sprint Retrospective, providing minimal input on what went well or what could be improved.",
    eventType: "retro",
    difficulty: "beginner"
  },
  {
    id: "retro-blame",
    title: "Blame Game",
    description: "The Retrospective has turned into a blame session, with Developers pointing fingers at each other rather than focusing on systemic improvements.",
    eventType: "retro",
    difficulty: "advanced"
  },
  {
    id: "retro-actionable",
    title: "Non-Actionable Items",
    description: "While the Scrum Team identifies issues during the Retrospective, they struggle to create actionable, measurable improvement plans.",
    eventType: "retro",
    difficulty: "intermediate"
  },
  {
    id: "retro-repetition",
    title: "Repeated Issues",
    description: "The same problems appear Sprint after Sprint in the Retrospective, suggesting that previous improvement plans are not being implemented effectively.",
    eventType: "retro",
    difficulty: "intermediate"
  },
  {
    id: "retro-management",
    title: "Management Interference",
    description: "A senior manager has asked to attend the Sprint Retrospective to 'help address team problems,' potentially inhibiting the team's psychological safety.",
    eventType: "retro",
    difficulty: "advanced"
  }
];

/**
 * Function to get scenario challenges for a specific event type
 */
export function getScenarioChallenges(eventType: string): ScenarioChallenge[] {
  return predefinedChallenges.filter(challenge => challenge.eventType === eventType);
}

/**
 * Function to get a specific scenario challenge by ID
 */
export function getScenarioChallengeById(scenarioId: string): ScenarioChallenge | undefined {
  return predefinedChallenges.find(challenge => challenge.id === scenarioId);
}