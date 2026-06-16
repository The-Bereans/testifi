# Testifi

**Testifi** is a pseudonymous testimony-sharing platform that enables people to share lived experiences safely, honestly, and with minimal friction.

The platform is designed around a simple belief:

> Some stories change lives, but many people never share them because identity, judgment, and social consequences get in the way.

Testifi provides a secure environment where users can submit testimonies without revealing personal information, discover experiences from others, and engage with authentic human stories that might otherwise remain unheard.

---

## Core Principles

* **Pseudonymity First**
  Users can share testimonies without exposing their real-world identities.

* **Low-Friction Contribution**
  Publishing a testimony should require as few steps as possible.

* **Safety and Trust**
  The platform prioritizes user privacy, responsible moderation, and secure handling of data.

* **Meaningful Storytelling**
  Testifi exists to amplify experiences that educate, encourage, and create understanding across communities.

---

## Current Features

* Pseudonymous testimony submission
* Story feed and discovery experience
* Responsive web interface
* Secure database integration
* Authentication and identity abstraction layer
* Moderation and reporting foundation

---

## Technology Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

### Backend

* Next.js App Router
* Server Actions
* API Routes

### Infrastructure

* PostgreSQL
* Cloud object storage
* Vercel deployment pipeline

---

## Local Development

### Prerequisites

* Node.js 20+
* npm, pnpm, yarn, or bun
* PostgreSQL instance
* Environment variables configured

### Installation

```bash
git clone <repository-url>
cd testifi
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
DATABASE_URL=
NEXT_PUBLIC_APP_URL=
AUTH_SECRET=
STORAGE_BUCKET=
```

### Start Development Server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

---

## Project Structure

```text
app/                Application routes and pages
components/         Reusable UI components
lib/                Shared utilities and helpers
hooks/              Custom React hooks
types/              TypeScript definitions
public/             Static assets
```

---

## Product Vision

Testifi aims to become the internet's trusted destination for pseudonymous storytelling, making it possible for anyone, anywhere, to share experiences that inform, comfort, and inspire others without compromising personal privacy.

Every testimony has the potential to help someone feel seen, make a difficult decision, or realise they are not alone.
