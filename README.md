# DigiSafe AI

DigiSafe AI is a child-protection and digital-safety platform in development
for Advocacy for Youth and Vulnerable Development Initiative (AYVDI).

## Project status

The current application includes public report intake, staff sign-in, a
protected report queue, case details, status/urgency updates, staff
assignment, and access auditing. The AI companion and verified referral
directory are not live yet.
Production rollout also requires organization-approved privacy/retention
information and deployment configuration.

## Technology

- Next.js App Router with React and TypeScript
- Tailwind CSS and accessible shadcn/ui foundations
- MongoDB with Mongoose for server-side data access
- Zod for server-boundary validation

The application is a single Next.js codebase. Route files belong in `app/`;
shared site components belong in `components/`; domain-specific UI and logic
belong in `features/`; server-only integrations and utilities belong in `lib/`.

## Local development

Use Node.js 20.19 or newer.

```bash
npm install
cp .env.example .env
```

Replace the placeholder `MONGODB_URI` in `.env` with a MongoDB connection
URI. Generate a 32-byte encryption key for optional safe contact information:

```bash
node -e 'console.log(require("node:crypto").randomBytes(32).toString("base64"))'
```

Set the output as `CONTACT_ENCRYPTION_KEY`. Keep `.env` private and never
commit credentials or encryption keys.

Generate a separate Better Auth secret and set `BETTER_AUTH_SECRET`. Keep
`BETTER_AUTH_URL` set to the exact origin used to access the app.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Checks

```bash
npm run lint
npm run build
```

## Safeguarding and production readiness

Staff registration is closed. After setting the database and Better Auth
configuration, set `FIRST_ADMIN_NAME`, `FIRST_ADMIN_EMAIL`, and a unique
`FIRST_ADMIN_PASSWORD` (at least 12 characters) in your private `.env` file.
Then run:

```bash
npm run seed:first-admin
```

Sign in at `/staff/login`. The first administrator can add trusted
administrators under **Staff → Team**. Never add real account passwords to
source control.

To load the project records into MongoDB, run:

```bash
npm run seed:projects
```

The seed is safe to re-run: it upserts projects by slug. Administrators can
manage projects at `/staff/projects`, blog posts at `/staff/blog`, and reports
in the protected case queue.
To load the initial blog posts, run `npm run seed:blogs`.

Do not use real children's data in local development or demonstrations.
AYVDI must approve privacy and retention rules, verified resources, AI
provider/data-processing terms, and production monitoring before those
features are deployed.
