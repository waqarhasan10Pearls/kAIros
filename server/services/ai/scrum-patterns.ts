/**
 * Scrum Patterns
 * 
 * Based on "A Scrum Book: The Spirit of the Game" by Jeff Sutherland, James O. Coplien, et al.
 * This file contains valuable pattern-based knowledge to enhance AI responses.
 */

import { ScrumEventType } from '../../../client/src/lib/types';

interface ScrumPattern {
  name: string;
  shortDescription: string;
  fullDescription: string;
  problemContext: string;
  solution: string;
  relevantEvents: ScrumEventType[];
}

export const scrumPatterns: ScrumPattern[] = [
  {
    name: "The Spirit of the Game",
    shortDescription: "The foundational principle of Scrum emphasizing values and mindset over mechanics.",
    fullDescription: "The essence of Scrum is not in its practices but in the mindset of empiricism, self-organization, and continuous improvement. The Spirit of the Game is about understanding the why behind Scrum practices.",
    problemContext: "Teams often focus on following Scrum practices mechanically without understanding their purpose, leading to ritualistic behavior rather than empirical process control.",
    solution: "Build a culture grounded in Scrum values that allows the team to make decisions that honor the spirit of Scrum rather than just the letter of its practices.",
    relevantEvents: ["daily", "planning", "review", "retro"]
  },
  {
    name: "Stable Teams",
    shortDescription: "Keeping team membership consistent to build trust and improve performance.",
    fullDescription: "Long-standing teams with stable membership develop strong relationships, shared understanding, and consistent velocity that allows for more accurate planning and higher performance.",
    problemContext: "Organizations frequently move people between teams based on project needs, which disrupts team dynamics and reduces productivity.",
    solution: "Maintain consistent team membership across Sprints and projects. Avoid adding or removing team members except when absolutely necessary.",
    relevantEvents: ["planning", "retro"]
  },
  {
    name: "Yesterday's Weather",
    shortDescription: "Using past performance to predict future capacity.",
    fullDescription: "Teams use their recent past performance as the most reliable predictor of how much they can accomplish in the upcoming Sprint.",
    problemContext: "Teams struggle to estimate how much work they can complete in a Sprint, often leading to overcommitment or underdelivery.",
    solution: "Use the team's recent velocity (typically from the last 3 Sprints) as the baseline for how much work they should take on in the upcoming Sprint.",
    relevantEvents: ["planning"]
  },
  {
    name: "Swarming",
    shortDescription: "The whole team focuses on one item at a time to maximize flow and minimize work in progress.",
    fullDescription: "Multiple team members work together on a single Product Backlog item to complete it faster, rather than each working on separate items.",
    problemContext: "Teams often have too much work in progress (WIP) when each person works on different tasks, leading to bottlenecks and delayed delivery of value.",
    solution: "Encourage multiple team members to collaborate on the highest priority items first, completing them before starting new work.",
    relevantEvents: ["daily", "planning"]
  },
  {
    name: "Emergency Procedure",
    shortDescription: "A well-defined process for handling urgent production issues without disrupting the Sprint.",
    fullDescription: "The team establishes a clear protocol for addressing true emergencies that balances responsiveness to critical issues with protecting the team's focus on Sprint work.",
    problemContext: "Unplanned work and 'emergencies' constantly disrupt Sprints, making it difficult for teams to meet their Sprint Goals.",
    solution: "Define criteria for what constitutes a true emergency and establish a procedure for handling these situations, including who responds and how to adjust Sprint expectations if needed.",
    relevantEvents: ["daily", "planning", "retro"]
  },
  {
    name: "Daily Clean Code",
    shortDescription: "Continuously maintain high code quality rather than accumulating technical debt.",
    fullDescription: "The team commits to improving code quality every day rather than letting technical debt build up for future 'cleanup Sprints.'",
    problemContext: "Teams often prioritize new features over code quality, leading to accumulated technical debt that eventually cripples productivity.",
    solution: "Make code quality a daily priority by refactoring as you go, writing tests, and addressing small issues immediately rather than postponing them.",
    relevantEvents: ["daily", "planning"]
  },
  {
    name: "Scrumming the Scrum",
    shortDescription: "Regularly inspect and adapt the team's Scrum practices themselves.",
    fullDescription: "Teams apply empiricism to their own Scrum implementation, continuously improving how they work together and perform Scrum events.",
    problemContext: "Teams follow Scrum procedures mechanically without reflecting on whether they're actually helping the team improve.",
    solution: "Regularly inspect and adapt the team's Scrum practices themselves, using the Sprint Retrospective to identify improvements to how the team applies Scrum.",
    relevantEvents: ["retro"]
  },
  {
    name: "Sprint Goal",
    shortDescription: "A concise, cohesive objective that unifies the Sprint's work and provides focus.",
    fullDescription: "The Sprint Goal gives purpose and identity to a Sprint that transcends individual Product Backlog items. It aligns the team toward a common outcome rather than just completing tasks.",
    problemContext: "Teams often treat Sprints as arbitrary time boxes for completing random work items, without a unified direction or purpose.",
    solution: "Establish a clear, compelling Sprint Goal that gives meaning to the Sprint and allows the team to make decisions about how to achieve it.",
    relevantEvents: ["planning", "daily"]
  },
  {
    name: "Interruption Buffer",
    shortDescription: "Setting aside capacity to handle expected interruptions without jeopardizing the Sprint Goal.",
    fullDescription: "Teams allocate a portion of their capacity for handling expected interruptions and small urgent requests that inevitably arise during a Sprint.",
    problemContext: "Even well-planned Sprints face interruptions from production issues, stakeholder questions, or essential meetings that weren't anticipated.",
    solution: "Based on historical data, reserve a percentage of team capacity (typically 10-20%) for handling interruptions, allowing the rest of the capacity to be devoted to Sprint Backlog items.",
    relevantEvents: ["planning"]
  },
  {
    name: "Happiness Metric",
    shortDescription: "Using team happiness as a leading indicator of performance and health.",
    fullDescription: "Teams regularly measure their happiness or satisfaction as a way to identify issues before they impact performance, using simple techniques like happiness ratings.",
    problemContext: "Traditional metrics often lag behind reality, showing problems only after they've already affected team performance.",
    solution: "Regularly ask team members to rate their happiness or satisfaction on a simple scale, using this as an early warning system and discussion starter in the Sprint Retrospective.",
    relevantEvents: ["retro"]
  },
  {
    name: "Enabling Specification",
    shortDescription: "Creating just enough documentation to enable development, not to constrain it.",
    fullDescription: "Teams create lightweight, evolving specifications that enable work to begin while leaving room for discovery and adaptation as the product emerges.",
    problemContext: "Teams either over-document requirements (constraining creativity and adaptation) or under-document them (leading to misunderstandings and rework).",
    solution: "Create 'enabling' specifications that capture essential requirements while leaving room for the team to figure out implementation details through collaboration.",
    relevantEvents: ["planning"]
  },
  {
    name: "Greatest Value",
    shortDescription: "Continuously focusing on delivering the highest value items first.",
    fullDescription: "The team and Product Owner maintain a relentless focus on delivering the highest value items first, constantly re-evaluating priorities based on new information.",
    problemContext: "Teams often work on what's technically interesting or easy rather than what delivers the most value to customers and the business.",
    solution: "Maintain a value-ordered Product Backlog and regularly reassess priorities based on feedback and changing conditions. Always work on the highest value items first.",
    relevantEvents: ["planning", "review"]
  },
  {
    name: "Release Plan",
    shortDescription: "A high-level plan that provides direction across multiple Sprints.",
    fullDescription: "The team creates a lightweight, adaptable release plan that maps out expected delivery over multiple Sprints, providing context for Sprint Planning and stakeholder alignment.",
    problemContext: "Teams focus on one Sprint at a time without a clear view of how their work fits into a larger product roadmap, making it difficult to communicate progress to stakeholders.",
    solution: "Maintain a high-level release plan that shows expected delivery milestones across multiple Sprints, while keeping it flexible enough to adapt based on what is learned.",
    relevantEvents: ["planning", "review"]
  },
  {
    name: "Kaizen Mind",
    shortDescription: "Fostering a mindset of continuous small improvements in all aspects of work.",
    fullDescription: "The team embraces the philosophy of Kaizen (continuous improvement) by constantly seeking small improvements in their processes, practices, and products.",
    problemContext: "Teams often look for big, dramatic improvements and ignore the power of small, incremental changes that compound over time.",
    solution: "Encourage everyone to identify and implement small improvements continuously, rather than waiting for perfect solutions or major reform initiatives.",
    relevantEvents: ["daily", "retro"]
  },
  {
    name: "Three Questions",
    shortDescription: "Using the three Daily Scrum questions as a framework for effective daily planning.",
    fullDescription: "The classic three questions (What did I do yesterday? What will I do today? What impediments do I have?) provide a simple, effective structure for the Daily Scrum that focuses on progress toward the Sprint Goal.",
    problemContext: "Teams struggle with unfocused or ineffective Daily Scrums that don't help them adapt their plan to achieve the Sprint Goal.",
    solution: "Use the three questions as a framework for the Daily Scrum, ensuring that each team member addresses their progress, plans, and problems in a concise, focused way.",
    relevantEvents: ["daily"]
  }
];