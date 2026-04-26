# NestJS Monorepo Microservices Architecture - Comprehensive Guide

## Project Overview

This is a **training monorepo application** built with NestJS that demonstrates modern microservices architecture patterns. The project serves as a practical implementation of several architectural concepts including Hexagonal Architecture, CQRS (Command Query Responsibility Segregation), Domain-Driven Design (DDD), and Event-Driven Architecture.

The application consists of a blog platform with users, blogs, and comments services, orchestrated through an API Gateway. It's designed to showcase how to build scalable, maintainable, and testable microservices applications.

## 🏗️ Architectural Patterns Explained

### 1. Hexagonal Architecture (Ports and Adapters)

#### What is Hexagonal Architecture?
Hexagonal Architecture, also known as **Ports and Adapters** pattern, is an architectural pattern that aims to create loosely coupled application components that can be easily connected to their software environment through ports and adapters.

**Key Principles:**
- **Dependency Inversion**: The domain layer depends on abstractions (ports), not concrete implementations (adapters)
- **Separation of Concerns**: Business logic is isolated from external concerns (UI, database, external APIs)
- **Testability**: Domain logic can be tested without external dependencies

#### Why Use Hexagonal Architecture?
- **Framework Independence**: Business logic doesn't depend on frameworks
- **Database Independence**: Can switch databases without changing business logic
- **Easy Testing**: Domain logic can be unit tested in isolation
- **Plugin Architecture**: New adapters can be added without modifying core logic

#### When Should You Use It?
- When you need high testability and maintainability
- When the application needs to support multiple interfaces (REST API, GraphQL, CLI)
- When you anticipate changing infrastructure (database, message queues, etc.)
- For long-term projects where technical debt accumulation is a concern

#### How It Works in This Project

```
src/
├── adapter/                    # Interface Adapters (Entry/Exit points)
│   ├── driving/               # Primary Adapters (Controllers, Event Handlers)
│   │   ├── controllers/       # HTTP REST API endpoints
│   │   └── guards/           # Authorization logic
│   └── driven/                # Secondary Adapters (External Dependencies)
│       └── persistence/       # Database implementations
├── application/               # Application Business Rules (Use Cases)
│   ├── command/              # Write operations (CQRS Commands)
│   ├── handler/              # Command/Query handlers
│   ├── query/                # Read operations (CQRS Queries)
│   └── services/             # Application services
├── domain/                   # Enterprise Business Rules (Core Business Logic)
│   ├── entities/             # Domain entities (pure business objects)
│   └── event/               # Domain events
└── ports/                    # Interfaces defining contracts
    └── repository.port.ts    # Repository abstractions
```

**Example from the codebase:**

```typescript
// Domain Entity (Pure business logic)
export class Blog {
  constructor(
    public id: number,
    public title: string,
    public description: string,
    public content: string,
    public userId: number,
    public readonly authorName: string,
    public createdAt: Date,
    public status: BlogStatus,
  ) {}
}

// Port (Interface/Contract)
export interface BlogRepository {
  create(blog: CreateBlogData): Promise<Blog>;
  findById(id: number): Promise<Blog | null>;
  findAll(): Promise<Blog[]>;
}

// Adapter Implementation (Concrete implementation)
@Injectable()
export class TypeOrmBlogRepository implements BlogRepository {
  constructor(
    @InjectRepository(BlogEntity)
    private readonly blogRepository: Repository<BlogEntity>,
  ) {}

  async create(blogData: CreateBlogData): Promise<Blog> {
    // Implementation using TypeORM
  }
}
```

### 2. Domain-Driven Design (DDD)

#### What is DDD?
Domain-Driven Design is an approach to software development that centers the development on programming a domain model that has a rich understanding of the processes and rules of a domain.

**Core Concepts:**
- **Domain**: The sphere of knowledge and activity around which the application logic revolves
- **Domain Model**: An abstract model of the domain that incorporates both behavior and data
- **Bounded Context**: A boundary within which a particular domain model applies
- **Ubiquitous Language**: A common language used by developers and domain experts

#### Strategic DDD Patterns Used:
- **Entities**: Objects with identity that are defined by their identity rather than their attributes
- **Value Objects**: Objects that describe characteristics of things
- **Domain Events**: Events that represent something that happened in the domain
- **Aggregates**: Clusters of domain objects that are treated as a single unit

#### Tactical DDD Patterns in This Project:
- **Entities**: `Blog`, `Comment` classes with identity and behavior
- **Domain Events**: Events like `blog.created`, `user.updated`
- **Application Services**: Command handlers that orchestrate domain operations
- **Repository Pattern**: Abstracts data access behind domain interfaces

### 3. CQRS (Command Query Responsibility Segregation)

#### What is CQRS?
CQRS is a pattern that separates read and write operations for a data store. In traditional CRUD systems, the same model is used for both reading and writing. CQRS uses separate models for these operations.

**Key Benefits:**
- **Independent Scaling**: Read and write workloads can scale independently
- **Optimized Data Models**: Read models can be optimized for queries, write models for business logic
- **Security**: Different security models for reads vs writes
- **Performance**: Read operations can use different storage technologies

#### When Should You Use CQRS?
- When read and write workloads have different performance requirements
- When you need different data models for reading vs writing
- For complex domains with rich business logic
- When you want to implement event sourcing
- For high-performance applications with many reads

#### CQRS Implementation in This Project

**Commands (Write Operations):**
```typescript
export class CreateBlogCommand {
  constructor(
    public readonly title: string,
    public readonly description: string,
    public readonly content: string,
    public readonly userId: number,
    public readonly status: BlogStatus,
  ) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogHandler implements ICommandHandler<CreateBlogCommand> {
  async execute(command: CreateBlogCommand) {
    // Business logic for creating a blog
    const blog = await this.repository.create({
      title: command.title,
      // ... other properties
    });

    // Emit domain event
    this.eventBus.publish(new BlogCreatedEvent(blog.id, blog.title));

    return blog;
  }
}
```

**Queries (Read Operations):**
```typescript
export class FindAllBlogsQuery {}

@QueryHandler(FindAllBlogsQuery)
export class FindAllBlogsHandler implements IQueryHandler<FindAllBlogsQuery> {
  async execute(query: FindAllBlogsQuery) {
    return this.repository.findAll();
  }
}
```

### 4. Event-Driven Architecture

#### What is Event-Driven Architecture?
Event-Driven Architecture (EDA) is a software architecture pattern promoting the production, detection, consumption of, and reaction to events. An event is a change in state, or an update, like an item being placed in a shopping cart on an e-commerce website.

**Key Components:**
- **Event Producers**: Services that generate events
- **Event Consumers**: Services that react to events
- **Event Bus/Message Broker**: Infrastructure for event routing
- **Event Store**: Optional persistence for events (Event Sourcing)

#### Benefits:
- **Loose Coupling**: Services don't need to know about each other directly
- **Scalability**: Events can be processed asynchronously
- **Reliability**: Eventual consistency instead of distributed transactions
- **Auditability**: Complete history of state changes

#### Event-Driven Implementation in This Project

**Event Emission:**
```typescript
// In CreateBlogHandler
this.usersClient.emit('blog.created', {
  id: blog.id,
  title: blog.title,
  userId: blog.userId,
});
```

**Event Consumption:**
```typescript
// Other services listen for events
@EventPattern('blog.created')
async handleBlogCreated(data: { id: number; title: string; userId: number }) {
  // Update local cache or perform business logic
}
```

### 5. Domain Entity vs Database Entity

#### Domain Entity
Domain entities represent business concepts and contain business logic. They are pure objects that model the problem domain.

**Characteristics:**
- Contain business rules and behavior
- Have identity (usually an ID)
- Can validate their own state
- Are independent of persistence technology
- Focus on business meaning, not storage

```typescript
// Domain Entity - Business Logic Focused
export class Blog {
  constructor(
    public id: number,
    public title: string,
    public description: string,
    public content: string,
    public userId: number,
    public readonly authorName: string,
    public createdAt: Date,
    public status: BlogStatus,
  ) {}

  // Business methods
  canBePublished(): boolean {
    return this.status === BlogStatus.DRAFT &&
           this.title.length > 0 &&
           this.content.length > 100;
  }

  publish(): void {
    if (!this.canBePublished()) {
      throw new Error('Blog cannot be published');
    }
    this.status = BlogStatus.PUBLISHED;
  }
}
```

#### Database Entity
Database entities are optimized for persistence and database operations. They handle ORM-specific concerns.

**Characteristics:**
- Contain ORM decorators and mappings
- Handle database-specific types and constraints
- May include database-specific optimizations
- Focus on storage and retrieval
- Often mirror database table structure

```typescript
// Database Entity - Persistence Focused
@Entity({ name: 'blogs' })
export class BlogEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column('text')
  content: string;

  @Column()
  userId: number;

  @Column()
  authorName: string;

  @Column({
    type: 'simple-enum',
    enum: BlogStatus,
    default: BlogStatus.DRAFT,
  })
  status: BlogStatus;

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
```

#### When to Use Each

**Use Domain Entities When:**
- Implementing business rules and logic
- Unit testing business behavior
- Designing APIs that reflect business concepts
- Ensuring business invariants are maintained

**Use Database Entities When:**
- Interacting with the database layer
- Handling ORM-specific operations
- Optimizing database queries
- Managing database schema changes

### 6. Monorepo Architecture

#### What is a Monorepo?
A monorepo is a software development strategy where code for many projects is stored in the same repository. Instead of having separate repositories for each service, all services and shared code live together.

**Benefits:**
- **Atomic Changes**: Changes across services can be made atomically
- **Code Sharing**: Easy sharing of common code and types
- **Consistent Tooling**: Same build, test, and lint tools across all services
- **Simplified Dependencies**: Easier to manage inter-service dependencies

#### Monorepo Structure in This Project

```
nest-mono/
├── apps/                    # Applications (Microservices)
│   ├── gateway/            # API Gateway
│   ├── users/              # Users Service
│   ├── blogs/              # Blogs Service
│   └── comments/           # Comments Service
├── libs/                    # Shared Libraries
│   └── _shared/           # Common code
├── package.json            # Root dependencies
└── nest-cli.json          # Monorepo configuration
```

### 7. Microservices Data Design and Communication

#### Database per Service Pattern
Each microservice owns its own database, ensuring loose coupling and independent deployments.

**Benefits:**
- **Independent Deployments**: Services can be deployed independently
- **Technology Diversity**: Different services can use different database technologies
- **Performance Isolation**: One service's database issues don't affect others
- **Schema Evolution**: Services can evolve their schemas independently

**Communication Patterns:**

1. **Synchronous Communication (Request/Response):**
   - Used for immediate responses
   - Example: Gateway calling Users service to validate authentication

2. **Asynchronous Communication (Events):**
   - Used for eventual consistency
   - Example: User service emits `user.updated` event, Blogs service updates cached user data

#### Service Communication in This Project

**Synchronous (TCP with NestJS Microservices):**
```typescript
// Gateway calls Users service
const user = await firstValueFrom(
  this.usersClient.send({ cmd: 'find_one_user' }, { id: userId })
);
```

**Asynchronous (Event Emission):**
```typescript
// Blogs service emits event after creating a blog
this.usersClient.emit('blog.created', {
  id: blog.id,
  title: blog.title,
  userId: blog.userId,
});
```

## 📁 Folder Structure Deep Dive

### Apps Structure

```
apps/
├── gateway/                    # API Gateway Service
│   ├── src/
│   │   ├── app.module.ts      # Main application module
│   │   ├── main.ts           # Application bootstrap
│   │   ├── controllers/      # HTTP API endpoints
│   │   └── filters/          # Global exception filters
├── blogs/                     # Blogs Microservice
│   ├── src/
│   │   ├── blogs.module.ts   # Service module
│   │   ├── main.ts          # Service bootstrap
│   │   ├── adapter/
│   │   │   ├── driving/      # Controllers, Guards (entry points)
│   │   │   └── driven/       # Repositories (exit points)
│   │   ├── application/      # Use cases (CQRS commands/queries)
│   │   ├── domain/          # Business entities and rules
│   │   └── ports/           # Interface contracts
```

### Shared Libraries

```
libs/_shared/
├── src/
│   ├── _shared.module.ts     # Shared module exports
│   ├── error/               # Common error handling
│   │   ├── app.exception.ts # Custom exceptions
│   │   └── error-codes.ts   # Error code constants
│   ├── filters/            # Shared filters
│   ├── global/             # Global types and interfaces
│   └── ports/              # Shared interface contracts
```

## 🔄 Transition to Real Microservices

### Current State (Monorepo)
- All services in one repository
- Shared build and deployment
- Easy code sharing and refactoring
- Simplified development workflow

### Real Microservices Changes Needed

#### 1. Repository Separation
```
# Separate repositories for each service
users-service/
blogs-service/
comments-service/
gateway-service/
shared-libraries/  # Separate repo for shared code
```

#### 2. Independent Deployment
- Each service has its own CI/CD pipeline
- Independent versioning and releases
- Container orchestration (Kubernetes, Docker Compose)

#### 3. Service Discovery
- Implement service registry (Consul, Eureka)
- Dynamic service location instead of hardcoded TCP ports

#### 4. API Gateway Enhancement
- Load balancing across multiple instances
- Circuit breakers for resilience
- Request routing and transformation

#### 5. Communication Infrastructure
- Message broker (RabbitMQ, Kafka) for events
- API versioning strategy
- Contract testing between services

#### 6. Observability
- Distributed tracing (Jaeger, Zipkin)
- Centralized logging (ELK stack)
- Health checks and monitoring

#### 7. Data Consistency
- Saga pattern for distributed transactions
- Event sourcing for audit trails
- CQRS read models for performance

## 🚀 How to Run the Application

### Prerequisites
- Node.js v16+
- npm or pnpm

### Running Services

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start Services (in separate terminals):**
   ```bash
   # Users Service
   npm run start users --watch

   # Blogs Service
   npm run start blogs --watch

   # Comments Service
   npm run start comments --watch

   # Gateway (HTTP API)
   npm run start gateway --watch
   ```

3. **Access the API:**
   - Gateway: http://localhost:3000
   - Swagger Docs: http://localhost:3000/api-docs

## 🛠️ Technologies Used

- **Framework:** NestJS with CQRS and Microservices
- **Database:** TypeORM with SQLite (development)
- **Communication:** TCP (internal), HTTP (external)
- **Architecture:** Hexagonal, DDD, Event-Driven
- **Documentation:** Swagger/OpenAPI

## 📚 Key Learning Points

This project demonstrates:
1. **Separation of Concerns** through Hexagonal Architecture
2. **Business Logic Isolation** using DDD principles
3. **Scalable Read/Write Operations** with CQRS
4. **Loose Coupling** through Event-Driven Architecture
5. **Independent Services** with Database per Service
6. **Shared Code Management** in a Monorepo
7. **API Orchestration** with Gateway Pattern

Each pattern addresses specific challenges in building maintainable, scalable microservices applications.
