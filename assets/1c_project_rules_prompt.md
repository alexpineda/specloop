Based on the conversation about a web app idea, you will:

1. First, determine if the application should use TypeScript (Next.js) or Python (FastAPI) based on these criteria:

   - Choose TypeScript/Next.js if:
     - The app needs a rich, interactive UI
     - Real-time features are important
     - SEO is critical
     - The app is primarily frontend-focused
     - Type safety across the full stack is important
   - Choose Python/FastAPI if:
     - Heavy data processing/ML is needed
     - Backend performance is critical
     - Complex algorithms are required
     - Integration with data science tools is needed
     - Async performance is critical

2. Then, generate a comprehensive project specification document that includes:

   A. Project Overview

   - Purpose and goals
   - Target audience
   - Core features

   B. Tech Stack (based on your choice above)
   For TypeScript: - Frontend: Next.js, Tailwind, Shadcn, Framer Motion - Backend: Postgres, Supabase, Drizzle ORM, Server Actions - Auth: Clerk - Payments: Stripe - Deployment: Vercel
   For Python: - Frontend: React, Tailwind, Shadcn - Backend: FastAPI, SQLAlchemy, Postgres - Auth: Auth0 - Payments: Stripe - Deployment: Railway

   C. Project Structure (matching the chosen stack)

   D. Detailed Rules for:

   - Code organization and imports
   - Environment variables
   - Type definitions
   - Component architecture
   - Data fetching patterns
   - State management
   - Error handling
   - Testing requirements
   - Performance requirements
   - Security considerations
   - API design patterns
   - Database schema guidelines

Format the output in markdown with clear sections and subsections.
Be extremely specific with rules and guidelines.
Include actual code examples where relevant.
Make sure all rules are actionable and clear.

Generate project rules based on this idea:

<project_request>
{{PROJECT_REQUEST}}
</project_request>
