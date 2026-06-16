# System Architecture

## Overview

This is a production-ready, full-stack web application built with modern technologies. The application follows a clean, layered architecture with clear separation of concerns.

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client (React + Vite)                    │
│                    (Port 5173 - Frontend)                       │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTPS/HTTP
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Backend (Express + Node.js)                   │
│                    (Port 5000 - API Server)                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Routes → Controllers → Services → Models → Cosmos DB SDK   │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────────────────┬──────────────────────────────────────┘
                           │ MongoDB Wire Protocol
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│            Azure Cosmos DB (NoSQL API)                          │
│        (Production Database - Global Scale)                     │
└─────────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Technology Stack
- **React 18** - UI Framework
- **Vite** - Build tool (fast development, optimized production builds)
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client with interceptors
- **React Router** - Client-side routing

### Folder Structure

```
client/
├── src/
│   ├── api/
│   │   └── axiosInstance.ts          # Axios config with JWT interceptors
│   ├── components/
│   │   ├── Dashboard.tsx             # Main dashboard container
│   │   ├── ItemForm.tsx              # Create/Edit form
│   │   └── ItemList.tsx              # Items display
│   ├── pages/
│   │   ├── Login.tsx                 # Login page
│   │   └── Signup.tsx                # Signup page
│   ├── hooks/
│   │   └── useAuth.ts                # Auth custom hook
│   ├── utils/
│   │   └── storage.ts                # LocalStorage utilities
│   ├── styles/
│   │   └── globals.css               # Global styles
│   ├── App.tsx                       # Root component with routing
│   └── main.tsx                      # Entry point
├── index.html                        # HTML template
├── vite.config.ts                    # Vite configuration
├── tailwind.config.js                # Tailwind configuration
├── tsconfig.json                     # TypeScript configuration
└── package.json                      # Dependencies
```

### Key Features

1. **JWT Authentication**
   - Tokens stored in localStorage
   - Axios interceptor automatically attaches token to requests
   - Auto-logout on token expiration (401 response)

2. **Protected Routes**
   - Dashboard requires authentication
   - Login/Signup redirect to dashboard if already authenticated
   - ProtectedRoute wrapper component

3. **State Management**
   - React Hooks for local state
   - Custom `useAuth` hook for authentication
   - localStorage for persistent auth state

4. **API Integration**
   - Axios instance with centralized configuration
   - Request/response interceptors
   - Error handling with user-friendly messages

## Backend Architecture

### Technology Stack
- **Node.js 18+** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety and better DX
- **@azure/cosmos** - Official Cosmos DB SDK
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests

### Folder Structure

```
server/
├── src/
│   ├── server.ts                     # Express app setup & entry point
│   ├── config/
│   │   └── cosmos.ts                 # Cosmos DB connection & initialization
│   ├── types/
│   │   └── index.ts                  # TypeScript interfaces
│   ├── models/
│   │   └── Item.ts                   # Item model with methods
│   ├── services/
│   │   └── ItemService.ts            # Business logic & DB queries
│   ├── controllers/
│   │   ├── AuthController.ts         # Auth request handlers
│   │   └── ItemController.ts         # Item CRUD handlers
│   ├── routes/
│   │   ├── index.ts                  # Route aggregator
│   │   ├── auth.ts                   # Auth routes
│   │   └── items.ts                  # Item routes
│   └── middleware/
│       └── auth.ts                   # JWT verification middleware
├── tsconfig.json                     # TypeScript configuration
├── package.json                      # Dependencies
└── .env.example                      # Environment variables template
```

### Layered Architecture Pattern

1. **Routes Layer** (`routes/`)
   - Defines HTTP endpoints
   - Maps HTTP methods to controller actions
   - Applies middleware (authentication, validation)

2. **Controllers Layer** (`controllers/`)
   - Handles HTTP requests/responses
   - Input validation
   - Delegates business logic to services
   - Returns formatted responses

3. **Services Layer** (`services/`)
   - Contains business logic
   - Interacts with database
   - Performs data transformations
   - Reusable across multiple controllers

4. **Models Layer** (`models/`)
   - Defines data structure
   - Encapsulates model-specific logic
   - Facilitates object-oriented design

5. **Configuration Layer** (`config/`)
   - Database connection setup
   - Environment variable management
   - Singleton instances

### Key Features

1. **Database Design**
   - **Cosmos DB NoSQL API**
   - **Partition Key**: `/userId` (scales horizontally per user)
   - **Container**: `items` (stores user tasks)
   - **Indexing**: Automatic by Cosmos DB

2. **Authentication Flow**
   ```
   1. User submits email/password
   2. Backend validates credentials
   3. Generate JWT token (HS256 algorithm)
   4. Token includes userId, email, expiration
   5. Token returned to client
   6. Client stores token in localStorage
   7. Client includes token in Authorization header for future requests
   8. Backend middleware verifies token on protected routes
   ```

3. **Error Handling**
   - Centralized error handling middleware
   - Consistent JSON error responses
   - HTTP status codes follow REST conventions
   - Development mode includes stack traces

4. **Security**
   - Passwords hashed with bcryptjs (10 salt rounds)
   - JWT secret stored in environment variables
   - CORS protection with configurable origins
   - Environment variable isolation

## Database Design

### Cosmos DB Configuration

```yaml
Database: taskdb
Container: items
Partition Key: /userId
Throughput: 400 RU/s (development)
```

### Item Document Schema

```json
{
  "id": "1234567890-abc123def",
  "userId": "user-1609459200000",
  "title": "Complete project",
  "description": "Finish the full-stack application",
  "status": "in-progress",
  "dueDate": "2025-12-31T00:00:00.000Z",
  "createdAt": "2025-01-15T10:30:00.000Z",
  "updatedAt": "2025-01-15T14:45:00.000Z"
}
```

### Query Patterns

```sql
-- Get all items for user
SELECT * FROM c WHERE c.userId = @userId ORDER BY c.createdAt DESC

-- Get items by status
SELECT * FROM c 
WHERE c.userId = @userId AND c.status = @status
ORDER BY c.dueDate ASC

-- Get overdue items
SELECT * FROM c 
WHERE c.userId = @userId 
  AND c.status != 'completed'
  AND c.dueDate < @now
ORDER BY c.dueDate ASC
```

### Indexing Strategy

- **Automatic Indexing**: All properties indexed by default
- **Partition Key**: `/userId` for efficient range queries
- **Sort Keys**: `createdAt`, `dueDate`, `status` for filtering
- **Cost Optimization**: Excludes `_etag` from indexing

## API Endpoints

### Authentication Routes

```
POST   /api/auth/signup      - Create new user account
POST   /api/auth/login       - Authenticate user
GET    /api/auth/me          - Get current user (protected)
```

### Item Routes (All Protected)

```
POST   /api/items                    - Create new item
GET    /api/items                    - Get all items for user
GET    /api/items/:id                - Get single item by ID
PUT    /api/items/:id                - Update item
DELETE /api/items/:id                - Delete item
GET    /api/items/status/:status     - Get items by status
GET    /api/items/overdue            - Get overdue items
```

### Health Check

```
GET    /api/health           - API health status
GET    /api               - API info & endpoint list
```

## Request/Response Format

### Request Headers

```
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

### Success Response (200-201)

```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation successful"
}
```

### Error Response (4xx-5xx)

```json
{
  "success": false,
  "error": "Error description"
}
```

## Deployment Architecture

### Production Infrastructure

```
┌──────────────────────────────────────────────────────────────┐
│                    Internet / DNS                            │
│                   (Custom Domain)                            │
└──────────────────┬───────────────────┬──────────────────────┘
                   │                   │
        ┌──────────▼─────────┐  ┌──────▼──────────────┐
        │ Azure Static Web   │  │ Azure App Service  │
        │    Apps (CDN)      │  │   (Backend)        │
        │  (React Frontend)  │  │                    │
        │   Port 443 (SSL)   │  │  Port 443 (SSL)    │
        └──────────┬─────────┘  └──────┬──────────────┘
                   │                   │
                   │    HTTP/HTTPS     │
                   │    (Requests)     │
                   │                   │
                   └──────────┬────────┘
                              │
                   ┌──────────▼────────────┐
                   │ API Gateway          │
                   │ (Optional)           │
                   └──────────┬────────────┘
                              │
                   ┌──────────▼────────────┐
                   │ Azure Cosmos DB      │
                   │ (Global Database)    │
                   │ Multi-region support │
                   └──────────────────────┘
```

## CI/CD Pipeline

### GitHub Actions Workflow

```
Push to main branch
    ↓
[Trigger] GitHub Actions
    ↓
[Build] Node.js dependencies
    ↓
[Test] Optional: Run tests
    ↓
[Build] Frontend: npm run build
    ↓
[Build] Backend: npm run build
    ↓
[Deploy] Frontend → Azure Static Web Apps
    ↓
[Deploy] Backend → Azure App Service
    ↓
[Notify] Deployment complete
```

### Build Optimizations

**Frontend**
- Vite generates optimized bundles
- Code splitting for better caching
- Minification and tree-shaking
- CSS purging with Tailwind

**Backend**
- TypeScript compilation to JavaScript
- Tree-shaking unused code
- Production-ready Node.js output

## Security Considerations

### Client-Side
- JWT tokens in localStorage (vulnerable to XSS)
  - Consider: HttpOnly cookies for production
- Environment variables in `.env` (not committed)
- CORS protection

### Server-Side
- Password hashing with bcryptjs
- JWT secret in environment variables
- Input validation on all endpoints
- SQL injection prevention (using Cosmos SDK)
- CORS whitelist by domain

### Network
- HTTPS/TLS for all communication
- Custom domain with SSL certificate
- Azure-managed SSL certificates
- CORS headers configured per environment

## Scalability & Performance

### Frontend Scalability
- Served via CDN (Azure Static Web Apps)
- Global edge locations
- Automatic compression and caching
- Fast time-to-interactive (TTI)

### Backend Scalability
- Stateless API servers
- Auto-scaling with Azure App Service
- Load balancing
- Connection pooling to Cosmos DB

### Database Scalability
- Partition key design (`/userId`) for horizontal scaling
- Request Units (RU) provisioning
- Auto-scaling options
- Multi-region replication (optional)

## Monitoring & Logging

### Application Insights (Optional)
- Performance monitoring
- Error tracking
- Custom metrics
- Distributed tracing

### Azure Monitor
- Application health
- Response times
- Error rates
- Cosmos DB metrics

## Development Workflow

### Local Setup
1. Clone repository
2. Install dependencies: `npm install` (both client & server)
3. Configure `.env` files
4. Start backend: `npm run dev` (from server/)
5. Start frontend: `npm run dev` (from client/)
6. Open browser: `http://localhost:5173`

### Development Features
- Hot module reloading (HMR) in Vite
- TypeScript compilation on-the-fly
- Source maps for debugging
- CORS enabled for local development

## Production Best Practices

1. **Environment Management**
   - Never commit `.env` files
   - Use managed secrets (Azure Key Vault)
   - Rotate secrets regularly

2. **Performance**
   - Enable production builds
   - Optimize images and assets
   - Implement caching strategies
   - Monitor Core Web Vitals

3. **Reliability**
   - Error monitoring and alerting
   - Automated backups
   - Multi-region deployment
   - Health checks

4. **Security**
   - Regular security updates
   - Dependency scanning
   - WAF (Web Application Firewall)
   - DDoS protection

## Future Enhancements

1. **Features**
   - User profiles and preferences
   - Collaboration and sharing
   - Real-time notifications
   - Advanced filtering and search
   - Recurring tasks/reminders

2. **Infrastructure**
   - Multi-region deployment
   - Advanced caching (Redis)
   - Message queues (Service Bus)
   - Serverless functions

3. **Observability**
   - Comprehensive logging
   - Distributed tracing
   - Custom dashboards
   - Alerting rules

## References

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Azure Cosmos DB Documentation](https://docs.microsoft.com/en-us/azure/cosmos-db/)
- [JWT.io](https://jwt.io/)
