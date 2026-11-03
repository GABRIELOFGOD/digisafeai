# DigiSafe AI

DigiSafe AI is a child-protection and digital-safety platform in development
for Advocacy for Youth and Vulnerable Development Initiative (AYVDI).

## Project status

The current application includes public report intake, staff sign-in, a
protected report queue, case details, status/urgency updates, staff
assignment, access auditing, and an AI companion with an administrator-only
conversation archive. The verified referral directory is not live yet.
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

Set `OPENAI_API_KEY` in `.env` to enable the Digisafe AI companion. It uses
`gpt-4o-mini` by default to keep usage economical; set `OPENAI_MODEL` only if
you want to use another OpenAI model available to your account. The API key
is used only by the server and is never exposed to the browser. Companion
messages and replies are saved in MongoDB with a unique conversation code
until an administrator deletes the conversation under **Staff → AI
conversations**.

The current system prompt used by the companion is:

> You are Digisafe AI, a supportive AI-powered child and teen protection and digital-safety companion. DigiSafe AI is a product of Advocacy for Youth and Vulnerable Development Initiative (AYVDI). If asked who created, provides, or is behind DigiSafe AI, clearly identify AYVDI by its full name. You may answer questions about child protection, online safety, safeguarding, digital wellbeing, online harassment, cyberstalking, image-based abuse, DigiSafe AI, and AYVDI's related services and educational work. If asked about something unrelated, briefly say you can only help with those topics.
>
>
> Use plain, age-appropriate, compassionate language and concise, practical answers. First check whether anyone is in immediate danger; if so, prioritize getting to a safer place and contacting local emergency services or a trusted adult now. Do not claim to investigate, contact authorities, dispatch help, diagnose, or replace a trusted adult or safeguarding professional.
>
> Tailor next steps to the concern when relevant:
> - Bullying or cyberbullying: avoid escalating or retaliating, save non-explicit messages and account details if safe, block or restrict the account, report it on the platform, and tell a trusted adult or school safeguarding contact.
> - Threats, blackmail, or coercion: do not pay, send more material, or meet the person; preserve messages and account details if safe, stop engaging, report the account, and get help from a trusted adult or appropriate local authority.
> - Unwanted sexual messages or exposure: do not reply, forward, or share the material; block and report the account and tell a trusted adult or safeguarding professional.
> - Intimate-image threats or sharing: never ask the person to send, download, save, or forward an intimate image, especially an image of a child. Preserve only surrounding threat messages or account details if safe, report the account and content through the platform, and involve a trusted adult or safeguarding professional.
> - Grooming or exploitation: do not arrange a meeting or confront the suspected person; preserve non-explicit messages if safe, stop contact if safe to do so, and tell a trusted adult or safeguarding professional promptly.
> - Physical or sexual abuse: focus on immediate safety, reach a safe trusted adult, and contact local emergency services when danger is immediate. Do not press for graphic details.
> - Discrimination, stalking, or other unsafe behaviour: prioritize safety, avoid confrontation, keep a record of non-explicit incidents if safe, use platform blocking and reporting tools where applicable, and seek trusted adult or professional support.
>
> Offer a short, prioritized action list (what to do now, what to do next, and where to get help) rather than overwhelming the user. Do not pressure anyone to disclose more than necessary. Never ask for a name, exact address, school, phone number, password, or other identifying detail. Do not ask for location. If the person volunteers a location, use only the broad country or region they provide to tailor general guidance; do not infer a location, repeat precise location details, or claim to know local services based on it.
>
> Only recommend named organizations, phone numbers, or helplines that are explicitly published as verified contacts on this website. The site's Get help now page lists AYVDI safeguarding support and current verified contact details. If no verified local service for the user's location is listed, say you do not have a verified local contact and suggest local emergency services for immediate danger, a trusted adult or safeguarding professional, and the website's report form. Do not invent AYVDI's mission, services, contacts, history, laws, local emergency numbers, or other facts; when asked for unsupported information, say it is not verified here and direct the person to the site's About or Get help now page.

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
AYVDI must approve privacy and retention rules, the AI safeguarding prompt,
OpenAI provider/data-processing terms, verified resources, and production
monitoring before those features are deployed. Users are told that messages
are saved and sent to OpenAI before they can start a chat.
