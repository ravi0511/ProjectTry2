# Full-Stack Web Application - Complete Blueprint

A production-ready, full-stack web application built with modern technologies and deployed on Microsoft Azure.

## 🎯 Technology Stack

### Frontend
- **Framework**: React.js with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: React Hooks + Context API (extensible)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js with TypeScript
- **Database**: Azure Cosmos DB (NoSQL API)
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs for password hashing

### Infrastructure & Deployment
- **Frontend Hosting**: Azure Static Web Apps
- **Backend Hosting**: Azure App Service
- **Database**: Azure Cosmos DB
- **CI/CD**: GitHub Actions
- **Domain**: Azure App Service Custom Domain + SSL/TLS

## 📁 Project Structure

```
ProjectTry2/
├── server/                          # Backend (Node/Express + Cosmos DB)
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   ├── src/
│   │   ├── server.ts               # Entry point
│   │   ├── config/
│   │   │   └── cosmos.ts           # Cosmos DB connection & setup
│   │   ├── types/
│   │   │   └── index.ts            # TypeScript types & interfaces
│   │   ├── models/
│   │   │   └── Item.ts             # Item model definition
│   │   ├── services/
│   │   │   └── ItemService.ts      # Business logic layer
│   │   ├── controllers/
│   │   │   ├── AuthController.ts   # Auth endpoints
│   │   │   └── ItemController.ts   # Item CRUD endpoints
│   │   ├── routes/
│   │   │   ├── index.ts            # Route aggregator
│   │   │   ├── auth.ts             # Auth routes
│   │   │   └── items.ts            # Item routes
│   │   └── middleware/
│   │       └── auth.ts             # JWT verification middleware
│
├── client/                          # Frontend (React + Vite + Tailwind)
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .env.example
│   ├── index.html
│   └── src/
│       ├── main.tsx                # React entry point
│       ├── App.tsx                 # Root component
│       ├── api/
│       │   └── axiosInstance.ts    # Axios config with JWT interceptors
│       ├── components/
│       │   ├── Dashboard.tsx       # Main dashboard
│       │   ├── ItemForm.tsx        # Create/Edit form
│       │   └── ItemList.tsx        # Items display
│       ├── pages/
│       │   ├── Login.tsx           # Login page
│       │   └── Signup.tsx          # Signup page
│       ├── hooks/
│       │   └── useAuth.ts          # Auth custom hook
│       ├── utils/
│       │   └── storage.ts          # LocalStorage utilities
│       └── styles/
│           └── globals.css         # Global Tailwind styles
│
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions CI/CD pipeline
│
├── ARCHITECTURE.md                 # System design & architecture
├── DEPLOYMENT.md                   # Step-by-step Azure deployment guide
└── README.md                       # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Azure Account
- GitHub Account (for CI/CD)

### Local Development

1. **Clone and setup**
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```

2. **Configure environment variables**
   ```bash
   # server/.env
   COSMOS_CONNECTION_STRING=your_cosmos_db_connection_string
   COSMOS_DB_NAME=taskdb
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRY=7d
   PORT=5000
   CORS_ORIGIN=http://localhost:5173

   # client/.env
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Run development servers**
   ```bash
   # Terminal 1: Backend
   cd server && npm run dev

   # Terminal 2: Frontend
   cd client && npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📦 Available Scripts

### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run production build

### Frontend
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## 🏗️ Architecture

### Authentication Flow
1. User signs up/logs in
2. Backend validates credentials and issues JWT token
3. Token stored in localStorage (frontend)
4. Axios interceptor automatically attaches token to all requests
5. Backend middleware verifies token on protected routes

### Database Layer
- Cosmos DB NoSQL API with JSON documents
- Partition key: `/userId` for efficient scaling
- Queries use Cosmos SDK SQL-like syntax
- Indexing automatically managed by Azure

### API Design
- RESTful endpoints
- Standard HTTP methods (GET, POST, PUT, DELETE)
- JSON request/response format
- Error handling with meaningful status codes

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcryptjs (10 salt rounds)
- CORS protection
- Environment variable isolation
- Protected routes with middleware
- Secure token storage

## 📝 Features Implemented

✅ User Authentication (Signup/Login)
✅ JWT Token Management
✅ Item CRUD Operations
✅ Protected Routes
✅ Error Handling & Validation
✅ TypeScript Type Safety
✅ Responsive UI with Tailwind CSS
✅ API Request Interceptors
✅ Cosmos DB Integration

## 🌍 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete Azure deployment instructions.

### Quick Deploy
- Push to `main` branch
- GitHub Actions automatically deploys to Azure
- Frontend → Azure Static Web Apps
- Backend → Azure App Service
- Database → Azure Cosmos DB

## 📚 Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Detailed system design and data models
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Step-by-step Azure setup and deployment

## 🤝 Contributing

1. Create a feature branch
2. Make changes
3. Test locally
4. Create PR to `main`
5. CI/CD pipeline validates and deploys

## 📄 License

MIT License - see LICENSE file for details

## 💡 Next Steps

1. Customize environment variables
2. Set up Azure resources
3. Configure GitHub Actions secrets
4. Deploy to Azure
5. Add additional features and services as needed

## Support

For issues and questions, refer to the ARCHITECTURE.md and DEPLOYMENT.md files for detailed guidance.
