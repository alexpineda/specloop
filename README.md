# SpecLoop

SpecLoop is a lightweight web application inspired by [Takeoff School's](https://www.jointakeoff.com/) prompts, designed to help developers work more effectively with O1 Pro. It provides a streamlined interface for creating, managing, and working with project specifications.

> Fun fact: This first half of this project was built using just o1 and the prompts

<div style="display: flex; gap: 16px; margin: 20px 0;">
  <img src="https://github.com/user-attachments/assets/bdcad872-7c35-47a1-a608-1ecd9e8f6a7a" alt="SpecLoop Dashboard" style="border-radius: 8px; max-width: 48%;">
  <img src="https://github.com/user-attachments/assets/12172deb-ddf5-4791-a76c-b20b239404dd" alt="SpecLoop Project View" style="border-radius: 8px; max-width: 48%;">
</div>

## About SpecLoop

SpecLoop is a small project that helps you build better software faster by providing a structured approach to project planning and execution with AI assistance. It's specifically designed to enhance your development workflow when using O1 Pro.

### Inspired by Takeoff School

This project draws inspiration from [Takeoff School's](https://www.jointakeoff.com/) prompt engineering approach, but simplified for individual developers. The guided setup helps you:

1. **Configure Prompts**: Set up custom prompts that work well with O1 Pro for your specific development needs.

2. **Configure LLM**: Connect your OpenAI API key and select appropriate models for different development tasks.

3. **Start Building**: Jump right into development with AI assistance that understands your project context.

## Features

- **Project Management**: Create and manage multiple projects
- **AI-Powered Assistance**: Leverage O1 Pro to help with project specifications
- **Modern UI**: Clean interface built with Next.js and Tailwind CSS
- **Customizable Prompts**: Tailor the AI interactions to your specific development needs

## Tech Stack

- **Frontend**: Next.js, Tailwind CSS, Shadcn UI, Framer Motion
- **Backend**: Drizzle ORM with SQLite
- **Authentication**: Clerk
- **AI Integration**: OpenAI, Anthropic

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- npm (v9 or higher)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/specloop.git
cd specloop
```

### 2. Install dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Set up environment variables

Copy the example environment file and update it with your values:

```bash
cp .env.example .env.local
```

Required environment variables:

```
# Database Configuration
DATABASE_URL="file:./specloop.db"
```

### 4. Set up the database

Run the database migrations:

```bash
npm run db:migrate
```

### 5. Start the development server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Key Commands

- `npm run dev` - Start the development server
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Drizzle Studio to view and edit database content
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check for code issues
- `npm run clean` - Fix linting issues and format code

## Project Structure

```
specloop/
├── actions/         # Server actions
├── app/             # Next.js app router
│   ├── (dashboard)/ # Dashboard routes
│   ├── onboarding/  # Onboarding routes
├── components/      # Shared components
├── db/              # Database configuration
│   ├── migrations/  # Database migrations
│   ├── schema/      # Database schema definitions
├── lib/             # Utility functions and libraries
├── public/          # Static assets
├── types/           # TypeScript type definitions
```

## Development

### Database Management

The application uses SQLite with Drizzle ORM for local development. The database file is stored at `./specloop.db`.

To view and manage the database:

```bash
npm run db:studio
```

### Environment Variables

The application uses environment variables for configuration. See `.env.example` for required variables.

If you don't want to store your OPENAI api key in the sqlite db (via the config page), either have it available in your environment or set it in `.env.local` OPENAI_API_KEY

## License

This project is licensed under the terms of the license included in the repository.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Links

- [Visual Dev Labs](https://visualdevlabs.com/) - Experimental SaaS & AI Solutions
- [Twitter](https://x.com/weloveoov) - Follow for updates
