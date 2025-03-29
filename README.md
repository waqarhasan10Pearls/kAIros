
# kAIros - AI-powered Team Coaching

An AI-powered application designed to facilitate team coaching and Scrum ceremonies through interactive simulations and icebreaker activities.

## Features

- **Icebreaker Questions**: Generate insightful icebreaker questions for team building
- **Scrum Simulation**: Interactive scenarios based on Scrum Guide 2020
- **Real-time Chat Interface**: Dynamic conversation with AI-powered responses

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Radix UI
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **Development**: Vite, TSX

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://0.0.0.0:5000`

## Project Structure

```
├── client/          # Frontend React application
├── server/          # Express.js backend
├── shared/          # Shared TypeScript types
└── attached_assets/ # Project documentation and assets
```

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run check` - TypeScript type checking
- `npm run db:push` - Update database schema
