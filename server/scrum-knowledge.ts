/**
 * SCRUM KNOWLEDGE BASE
 * Based on the Scrum Guide 2020
 * This file contains structured knowledge about Scrum to inform the AI simulator
 */

export const scrumDefinition = {
  description: "Scrum is a lightweight framework that helps people, teams and organizations generate value through adaptive solutions for complex problems.",
  coreConcept: "In a nutshell, Scrum requires a Scrum Master to foster an environment where: 1) A Product Owner orders the work for a complex problem into a Product Backlog. 2) The Scrum Team turns a selection of the work into an Increment of value during a Sprint. 3) The Scrum Team and its stakeholders inspect the results and adjust for the next Sprint. 4) Repeat.",
  purpose: "Scrum makes visible the relative efficacy of current management, environment, and work techniques, so that improvements can be made."
};

export const scrumTheory = {
  foundations: "Scrum is founded on empiricism and lean thinking. Empiricism asserts that knowledge comes from experience and making decisions based on what is observed. Lean thinking reduces waste and focuses on the essentials.",
  approach: "Scrum employs an iterative, incremental approach to optimize predictability and to control risk.",
  pillars: ["Transparency", "Inspection", "Adaptation"],
  pillarDescriptions: {
    transparency: "The emergent process and work must be visible to those performing the work as well as those receiving the work.",
    inspection: "The Scrum artifacts and the progress toward agreed goals must be inspected frequently and diligently to detect potentially undesirable variances or problems.",
    adaptation: "If any aspects of a process deviate outside acceptable limits or if the resulting product is unacceptable, the process being applied or the materials being produced must be adjusted."
  }
};

export const scrumValues = {
  values: ["Commitment", "Focus", "Openness", "Respect", "Courage"],
  description: "Successful use of Scrum depends on people becoming more proficient in living five values: Commitment, Focus, Openness, Respect, and Courage. The Scrum Team commits to achieving its goals and to supporting each other. Their primary focus is on the work of the Sprint to make the best possible progress toward these goals. The Scrum Team and its stakeholders are open about the work and the challenges. Scrum Team members respect each other to be capable, independent people, and are respected as such by the people with whom they work. The Scrum Team members have the courage to do the right thing, to work on tough problems."
};

export const scrumTeam = {
  composition: "The Scrum Team consists of one Scrum Master, one Product Owner, and Developers. Within a Scrum Team, there are no sub-teams or hierarchies.",
  characteristics: [
    "Cross-functional, meaning the members have all the skills necessary to create value each Sprint",
    "Self-managing, meaning they internally decide who does what, when, and how",
    "Small enough to remain nimble and large enough to complete significant work within a Sprint, typically 10 or fewer people"
  ],
  roles: {
    developers: {
      name: "Developers",
      description: "The people in the Scrum Team that are committed to creating any aspect of a usable Increment each Sprint.",
      accountabilities: [
        "Creating a plan for the Sprint, the Sprint Backlog",
        "Instilling quality by adhering to a Definition of Done",
        "Adapting their plan each day toward the Sprint Goal",
        "Holding each other accountable as professionals"
      ]
    },
    productOwner: {
      name: "Product Owner",
      description: "The Product Owner is accountable for maximizing the value of the product resulting from work of the Scrum Team.",
      accountabilities: [
        "Developing and explicitly communicating the Product Goal",
        "Creating and clearly communicating Product Backlog items",
        "Ordering Product Backlog items",
        "Ensuring that the Product Backlog is transparent, visible and understood"
      ]
    },
    scrumMaster: {
      name: "Scrum Master",
      description: "The Scrum Master is accountable for establishing Scrum as defined in the Scrum Guide. They do this by helping everyone understand Scrum theory and practice, both within the Scrum Team and the organization.",
      accountabilities: {
        toTeam: [
          "Coaching the team members in self-management and cross-functionality",
          "Helping the Scrum Team focus on creating high-value Increments that meet the Definition of Done",
          "Causing the removal of impediments to the Scrum Team's progress",
          "Ensuring that all Scrum events take place and are positive, productive, and kept within the timebox"
        ],
        toProductOwner: [
          "Helping find techniques for effective Product Goal definition and Product Backlog management",
          "Helping the Scrum Team understand the need for clear and concise Product Backlog items",
          "Helping establish empirical product planning for a complex environment",
          "Facilitating stakeholder collaboration as requested or needed"
        ],
        toOrganization: [
          "Leading, training, and coaching the organization in its Scrum adoption",
          "Planning and advising Scrum implementations within the organization",
          "Helping employees and stakeholders understand and enact an empirical approach for complex work",
          "Removing barriers between stakeholders and Scrum Teams"
        ]
      }
    }
  }
};

export const scrumEvents = {
  sprint: {
    name: "The Sprint",
    description: "Sprints are the heartbeat of Scrum, where ideas are turned into value. They are fixed length events of one month or less to create consistency. A new Sprint starts immediately after the conclusion of the previous Sprint.",
    rules: [
      "No changes are made that would endanger the Sprint Goal",
      "Quality does not decrease",
      "The Product Backlog is refined as needed",
      "Scope may be clarified and renegotiated with the Product Owner as more is learned"
    ],
    cancellation: "A Sprint could be cancelled if the Sprint Goal becomes obsolete. Only the Product Owner has the authority to cancel the Sprint."
  },
  sprintPlanning: {
    name: "Sprint Planning",
    description: "Sprint Planning initiates the Sprint by laying out the work to be performed for the Sprint. This resulting plan is created by the collaborative work of the entire Scrum Team.",
    topics: [
      "Topic One: Why is this Sprint valuable?",
      "Topic Two: What can be Done this Sprint?",
      "Topic Three: How will the chosen work get done?"
    ],
    outcome: "The Sprint Goal, the Product Backlog items selected for the Sprint, and the plan for delivering them are together referred to as the Sprint Backlog.",
    timebox: "Sprint Planning is timeboxed to a maximum of eight hours for a one-month Sprint. For shorter Sprints, the event is usually shorter."
  },
  dailyScrum: {
    name: "Daily Scrum",
    description: "The purpose of the Daily Scrum is to inspect progress toward the Sprint Goal and adapt the Sprint Backlog as necessary, adjusting the upcoming planned work.",
    structure: "The Developers can select whatever structure and techniques they want, as long as their Daily Scrum focuses on progress toward the Sprint Goal and produces an actionable plan for the next day of work.",
    benefits: "Daily Scrums improve communications, identify impediments, promote quick decision-making, and consequently eliminate the need for other meetings.",
    timebox: "The Daily Scrum is a 15-minute event for the Developers of the Scrum Team.",
    participation: "If the Product Owner or Scrum Master are actively working on items in the Sprint Backlog, they participate as Developers."
  },
  sprintReview: {
    name: "Sprint Review",
    description: "The purpose of the Sprint Review is to inspect the outcome of the Sprint and determine future adaptations. The Scrum Team presents the results of their work to key stakeholders and progress toward the Product Goal is discussed.",
    activities: [
      "The Scrum Team and stakeholders review what was accomplished in the Sprint and what has changed in their environment",
      "Attendees collaborate on what to do next",
      "The Product Backlog may also be adjusted to meet new opportunities"
    ],
    nature: "The Sprint Review is a working session and the Scrum Team should avoid limiting it to a presentation.",
    timebox: "The Sprint Review is timeboxed to a maximum of four hours for a one-month Sprint. For shorter Sprints, the event is usually shorter."
  },
  sprintRetrospective: {
    name: "Sprint Retrospective",
    description: "The purpose of the Sprint Retrospective is to plan ways to increase quality and effectiveness. The Scrum Team inspects how the last Sprint went with regards to individuals, interactions, processes, tools, and their Definition of Done.",
    examination: [
      "What went well during the Sprint?",
      "What problems did we encounter?",
      "How were those problems resolved?"
    ],
    outcome: "The Scrum Team identifies the most helpful changes to improve its effectiveness. The most impactful improvements are addressed as soon as possible, and may even be added to the Sprint Backlog for the next Sprint.",
    timebox: "The Sprint Retrospective concludes the Sprint. It is timeboxed to a maximum of three hours for a one-month Sprint. For shorter Sprints, the event is usually shorter."
  }
};

export const scrumArtifacts = {
  description: "Scrum's artifacts represent work or value. They are designed to maximize transparency of key information. Each artifact contains a commitment to ensure it provides information that enhances transparency and focus against which progress can be measured.",
  artifacts: {
    productBacklog: {
      name: "Product Backlog",
      description: "The Product Backlog is an emergent, ordered list of what is needed to improve the product. It is the single source of work undertaken by the Scrum Team.",
      items: "Product Backlog items that can be completed by the Scrum Team within one Sprint are deemed ready for selection in a Sprint Planning event.",
      refinement: "Product Backlog refinement is the act of breaking down and further defining Product Backlog items into smaller more precise items.",
      commitment: {
        name: "Product Goal",
        description: "The Product Goal describes a future state of the product which can serve as a target for the Scrum Team to plan against."
      }
    },
    sprintBacklog: {
      name: "Sprint Backlog",
      description: "The Sprint Backlog is composed of the Sprint Goal (why), the set of Product Backlog items selected for the Sprint (what), as well as an actionable plan for delivering the Increment (how).",
      characteristics: "The Sprint Backlog is a plan by and for the Developers. It is a highly visible, real-time picture of the work that the Developers plan to accomplish during the Sprint in order to achieve the Sprint Goal.",
      commitment: {
        name: "Sprint Goal",
        description: "The Sprint Goal is the single objective for the Sprint. It creates coherence and focus, encouraging the Scrum Team to work together rather than on separate initiatives."
      }
    },
    increment: {
      name: "Increment",
      description: "An Increment is a concrete stepping stone toward the Product Goal. Each Increment is additive to all prior Increments and thoroughly verified, ensuring that all Increments work together. In order to provide value, the Increment must be usable.",
      multipleIncrements: "Multiple Increments may be created within a Sprint. The sum of the Increments is presented at the Sprint Review thus supporting empiricism.",
      commitment: {
        name: "Definition of Done",
        description: "The Definition of Done is a formal description of the state of the Increment when it meets the quality measures required for the product. The moment a Product Backlog item meets the Definition of Done, an Increment is born."
      }
    }
  }
};