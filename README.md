# NestJS Monorepo Microservices Project

This project is a scalable, event-driven microservices application built with [NestJS](https://nestjs.com/) in a Monorepo structure. It utilizes **Hexagonal Architecture (Ports and Adapters)** and **CQRS (Command Query Responsibility Segregation)** to ensure modularity, testability, and maintainability.

## 🏗 Project Structure

The project is organized as a Monorepo, containing multiple applications and shared libraries.

```
├── apps/
│   ├── gateway/    # API Gateway (HTTP Entry Point)
│   ├── users/      # Users Microservice (TCP)
│   ├── blogs/      # Blogs Microservice (TCP)
│   └── comments/   # Comments Microservice (TCP)
├── libs/
│   └── _shared/    # Shared code (DTOs, Interfaces, Constants, Exceptions)
├── nest-cli.json   # Monorepo Configuration
└── package.json    # Dependencies and Scripts
```

### Applications

- **Gateway**: The public-facing HTTP server. It acts as a reverse proxy, routing requests to the appropriate internal microservices via TCP. It handles authentication and request aggregation.
- **Users**: Manages user identities, profiles, and authentication. It is the source of truth for user data.
- **Blogs**: Manages blog posts. It maintains a local cache of author details to optimize read performance.
- **Comments**: Manages comments on blog posts. It also maintains a local cache of author details.

### Shared Library (`libs/_shared`)

Contains code shared across all microservices to ensure consistency and reduce duplication:

- **Global Exceptions**: Standardized error handling.
- **DTOs**: Data Transfer Objects shared between services.
- **Constants**: Shared configuration values.

---

## 🏛 Architecture: Hexagonal & CQRS

This project moves away from the traditional "3-Layer Architecture" (Controller -> Service -> Repository) in favor of **Hexagonal Architecture** (also known as Ports and Adapters) combined with **CQRS**.

### Internal Application Structure

Each microservice follows this directory structure:

```
src/
├── adapter/            # Interface Adapters (Entry/Exit points)
│   ├── driving/        # Primary Adapters (Controllers, Resolvers, Event Listeners)
│   └── driven/         # Secondary Adapters (Repositories, External APIs)
├── application/        # Application Business Rules (Use Cases)
│   ├── command/        # Write operations (Commands & Handlers)
│   ├── query/          # Read operations (Queries & Handlers)
│   └── services/       # Domain Services
├── domain/             # Enterprise Business Rules (Entities, Value Objects)
└── ports/              # Interfaces defining contracts for Adapters
```

### Hexagonal vs. 3-Layer Architecture

| Feature                  | Traditional 3-Layer Architecture                               | Hexagonal Architecture (This Project)                                                         |
| :----------------------- | :------------------------------------------------------------- | :-------------------------------------------------------------------------------------------- |
| **Dependency Direction** | Top-down (Controller → Service → Repository → DB)              | **Inward** (Adapters → Application → Domain). The Domain depends on nothing.                  |
| **Coupling**             | High. Business logic often coupled to DB or Framework.         | **Low**. Business logic is isolated from external concerns (DB, HTTP, Framework).             |
| **Testing**              | Harder to test business logic in isolation without mocking DB. | **Easy**. Domain logic is pure TypeScript. Adapters can be easily swapped or mocked.          |
| **Flexibility**          | Hard to switch DB or Transport layer.                          | **High**. You can swap TypeORM for Mongoose or HTTP for gRPC without touching business logic. |
| **Scalability**          | Logic often mixed (Reads/Writes).                              | **CQRS** separates Reads (Queries) from Writes (Commands), allowing independent scaling.      |

### Benefits of this Approach

1.  **Independence of Frameworks**: The architecture does not depend on the existence of some library of feature laden software. This allows you to use such frameworks as tools.
2.  **Testability**: The business rules can be tested without the UI, Database, Web Server, or any other external element.
3.  **Independence of UI**: The UI can change easily, without changing the rest of the system. A Web UI could be replaced with a console UI, for example.
4.  **Independence of Database**: You can swap out Oracle or SQL Server, for Mongo, BigTable, CouchDB, or something else. Your business rules are not bound to the database.
5.  **Event-Driven Consistency**: Services communicate via events (e.g., `user.updated`). When a user updates their profile, the `Users` service emits an event, and `Blogs` and `Comments` services update their local data asynchronously. This ensures **Eventual Consistency** and high read performance (no cross-service synchronous calls for reads).

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or later)
- pnpm (or npm/yarn)
- Git

### Installation

1.  Clone the repository:

    ```bash
    git clone <repository-url>
    cd nest-mono
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

### Running the Applications

Since this is a monorepo with microservices, you need to run each application. You can run them in separate terminal windows.

1.  **Start the Microservices** (Order doesn't strictly matter, but good to have them up before Gateway):

    ```bash
    # Terminal 1: Users Service
    npm run start users --watch

    # Terminal 2: Blogs Service
    npm run start blogs --watch

    # Terminal 3: Comments Service
    npm run start comments --watch
    ```

2.  **Start the Gateway**:

    ```bash
    # Terminal 4: API Gateway
    npm run start gateway --watch
    ```

The Gateway will typically run on port `3000` (HTTP), while microservices listen on TCP ports (e.g., `3001`, `3002`, `3003`).

## 🛠 Technologies Used

- **Framework**: [NestJS](https://nestjs.com/)
- **Language**: TypeScript
- **Database**: TypeORM (with SQLite/Better-SQLite3 for dev)
- **Transport**: TCP (Microservices)
- **Architecture**: Hexagonal, CQRS, Event-Driven
- **Documentation**: Swagger (OpenAPI) - typically available at `/api` on the Gateway.
