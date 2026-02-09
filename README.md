# Futsal App

### Tech Stack

**Backend (API):**

- [NestJS](https://nestjs.com/) - Backend framework
- [Prisma](https://www.prisma.io/) - ORM for database
- [PostgreSQL](https://www.postgresql.org/) - Relational database

**Frontend (Web):**

- [React](https://react.dev/) - Frontend framework
- [SCSS](https://sass-lang.com/) - CSS preprocessor

**Monorepo Management:**

- [Turborepo](https://turbo.build/) - High-performance build system for monorepos
- [Yarn](https://yarnpkg.com/features/workspaces) - Package management

## Prerequisites

Before running the project, make sure you have the following installed:

- **Node.js** (v20 recommended)
- **Yarn** (v3.6.4 or higher)
- **Docker** and **Docker Compose**

## Project Structure

```
futsal-app/
├── apps/
│   ├── api/          # NestJS backend
│   └── web/          # React frontend
├── packages/
│   └── types/        # Shared TypeScript types
├── infrastructure/   # Project infrastructure
├── compose.yml       # Docker compose file
├── turbo.json        # Turborepo configuration
```

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/dump-hr/futsal-app.git
   cd futsal-app
   ```

2. **Install dependencies:**

   ```bash
   yarn install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the `apps/api` directory with the following content:

   ```env
   DATABASE_URL="postgresql://dumpovac:dump1234@localhost:3001/futsal-db?schema=public"
   ```

## How to Run

### 1. Start the Database

Start the PostgreSQL database using Docker Compose in the root directory:

```bash
docker compose up -d
```

This will start a PostgreSQL 15 container with:

- **Database:** futsal-db
- **User:** dumpovac
- **Password:** dump1234
- **Port:** 3001 (mapped to 5432 inside the container)

### 2. Apply Database Migrations

Generate the Prisma client and apply migrations:

```bash
# Generate Prisma client
yarn db:generate

# Apply database migrations
yarn db:migrate
```

### 3. Start the Development Servers

Run both the API and Web applications in development mode:

```bash
yarn dev
```

This will start:

- **API** at `http://localhost:3000` (default NestJS port)
- **Web** at `http://localhost:5173` (default Vite port)

### Running Individual Apps

To run only the API:

```bash
yarn workspace api run dev
```

To run only the Web app:

```bash
yarn workspace web run dev
```

## Database Migrations

### Available Commands

| Command            | Description                         |
| ------------------ | ----------------------------------- |
| `yarn db:generate` | Generate Prisma client from schema  |
| `yarn db:migrate`  | Create and apply new migrations     |
| `yarn db:studio`   | Open Prisma Studio (database GUI)   |
| `yarn db:seed`     | Seed the database with initial data |
| `yarn prisma`      | Run Prisma CLI commands             |

### Creating a New Migration

1. Modify the Prisma schema in `apps/api/prisma/schema.prisma`
2. Run the migration command:
   ```bash
   yarn db:migrate
   ```
3. Enter a name for your migration when prompted
