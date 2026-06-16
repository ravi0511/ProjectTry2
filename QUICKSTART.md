# Quick Start Guide

Get this full-stack application up and running in minutes.

## Local Development (5 minutes)

### Prerequisites
- Node.js 18+ ([install](https://nodejs.org/))
- Git ([install](https://git-scm.com/))

### Step 1: Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend (new terminal)
cd client
npm install
```

### Step 2: Configure Environment

**Backend:** Create `server/.env`
```bash
COSMOS_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=...
COSMOS_DB_NAME=taskdb
COSMOS_CONTAINER_NAME=items
JWT_SECRET=your-secret-key-change-this
JWT_EXPIRY=7d
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

> For local development, you can use a local mock or skip Cosmos DB setup for testing

**Frontend:** Create `client/.env`
```bash
VITE_API_URL=http://localhost:5000/api
VITE_ENVIRONMENT=development
```

### Step 3: Start Development Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
# Starts on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
# Starts on http://localhost:5173
```

### Step 4: Test the Application

1. Open http://localhost:5173 in your browser
2. Sign up with test credentials
3. Create, edit, and delete tasks
4. Logout and login

## Project Structure at a Glance

```
ProjectTry2/
├── server/              # Backend API
│   ├── src/
│   │   ├── server.ts    # Entry point
│   │   ├── routes/      # API endpoints
│   │   ├── controllers/ # Request handlers
│   │   ├── services/    # Business logic
│   │   └── models/      # Data models
│   └── package.json
│
├── client/              # Frontend
│   ├── src/
│   │   ├── pages/       # Login, Signup
│   │   ├── components/  # Dashboard, Forms
│   │   ├── api/         # HTTP client
│   │   └── hooks/       # useAuth
│   └── package.json
│
├── ARCHITECTURE.md      # System design
├── DEPLOYMENT.md        # Azure setup guide
└── README.md            # Overview
```

## Key Features

✅ **User Authentication**
- JWT-based login/signup
- Secure password hashing
- Protected routes

✅ **Task Management**
- Create, read, update, delete tasks
- Status tracking (pending, in-progress, completed)
- Due dates

✅ **Database**
- Azure Cosmos DB (NoSQL)
- Per-user data isolation
- SQL-like queries

✅ **Responsive UI**
- Tailwind CSS styling
- Mobile-friendly design
- Real-time form validation

## Available Commands

### Backend
```bash
npm run dev      # Start dev server with hot reload
npm run build    # Compile TypeScript
npm start        # Run production build
npm run lint     # Check code quality
```

### Frontend
```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Check code quality
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (protected)

### Tasks
- `POST /api/items` - Create task
- `GET /api/items` - Get all tasks
- `GET /api/items/:id` - Get task by ID
- `PUT /api/items/:id` - Update task
- `DELETE /api/items/:id` - Delete task

### Health
- `GET /api/health` - API health check

## Deployment Guides

### Azure Deployment
See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete step-by-step guide to deploy:
- Backend to Azure App Service
- Frontend to Azure Static Web Apps
- Database setup in Cosmos DB
- CI/CD with GitHub Actions

### Quick Azure Setup (30 minutes)
1. Follow Phase 1-2 in DEPLOYMENT.md
2. Configure GitHub secrets
3. Push to main branch
4. GitHub Actions handles deployment

## Troubleshooting

### Backend won't start
```bash
cd server
npm install
npm run build
npm start
# Check if port 5000 is available
```

### Frontend shows API errors
- Check `VITE_API_URL` in `.env`
- Ensure backend is running
- Check browser console for CORS errors

### Cosmos DB connection fails
- Verify connection string
- Check network connectivity
- Ensure container exists

## Next Steps

1. **Customize Design**
   - Edit colors in `tailwind.config.js`
   - Modify components in `src/components/`

2. **Add Features**
   - Create new API endpoints
   - Add React components
   - Update database schema

3. **Deploy to Production**
   - Follow [DEPLOYMENT.md](./DEPLOYMENT.md)
   - Configure custom domain
   - Set up monitoring

4. **Scale Application**
   - Enable auto-scaling
   - Optimize Cosmos DB
   - Add caching layer

## Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Detailed system design
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Azure deployment instructions
- **[README.md](./README.md)** - Project overview

## Support Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [Azure Docs](https://docs.microsoft.com/en-us/azure/)
- [Cosmos DB Guide](https://docs.microsoft.com/en-us/azure/cosmos-db/)

## Tips for Success

1. **Before deploying**, test locally thoroughly
2. **Keep dependencies updated**: `npm outdated`
3. **Monitor costs** when using Azure services
4. **Use environment variables** for secrets (never commit `.env`)
5. **Enable logging** for troubleshooting
6. **Set up monitoring** in production

## Common Customizations

### Change API Port
Edit `server/src/server.ts`:
```typescript
const PORT = process.env.PORT || 3000;
```

### Modify Frontend Colors
Edit `client/tailwind.config.js`:
```javascript
colors: {
  primary: '#your-color-here'
}
```

### Add Database Columns
1. Update `Item` model in `server/src/models/Item.ts`
2. Update TypeScript interface in `server/src/types/index.ts`
3. Update Cosmos DB queries as needed
4. Update frontend forms to display new fields

## Performance Tips

- Build frontend in production mode: `npm run build`
- Use Cosmos DB connection pooling
- Enable image optimization
- Implement pagination for large datasets
- Use React.memo for expensive components

---

**Ready to get started?** Run `npm install` in both directories and follow Step 3 above!

Have questions? Check [ARCHITECTURE.md](./ARCHITECTURE.md) or [DEPLOYMENT.md](./DEPLOYMENT.md).
