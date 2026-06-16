# Production Deployment Guide - Azure

Complete step-by-step guide to deploy this full-stack application to Azure with a custom domain and automated CI/CD.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Phase 1: Azure Resource Setup](#phase-1-azure-resource-setup)
3. [Phase 2: Application Configuration](#phase-2-application-configuration)
4. [Phase 3: GitHub Setup & CI/CD](#phase-3-github-setup--cicd)
5. [Phase 4: Domain Configuration](#phase-4-domain-configuration)
6. [Phase 5: Production Deployment](#phase-5-production-deployment)
7. [Monitoring & Maintenance](#monitoring--maintenance)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
- Azure CLI (`az`) - [Install](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
- Node.js 18+ - [Install](https://nodejs.org/)
- Git - [Install](https://git-scm.com/)

### Azure Account
- Active Azure subscription
- Sufficient quota for resources
- Appropriate permissions (Owner or Contributor role)

### Domain Name
- Custom domain registered (e.g., example.com)
- Access to domain registrar/DNS settings
- Optional: SSL certificate (Azure provides free managed certificates)

---

## Phase 1: Azure Resource Setup

### Step 1: Create Resource Group

```bash
# Login to Azure
az login

# Set your subscription
az account set --subscription <subscription-id>

# Create resource group
az group create \
  --name fullstack-rg \
  --location eastus
```

### Step 2: Create Cosmos DB Account

```bash
# Create Cosmos DB account
az cosmosdb create \
  --name fullstack-cosmos-<unique-suffix> \
  --resource-group fullstack-rg \
  --kind GlobalDocumentDB \
  --locations "East US=0" \
  --default-consistency-level Eventual \
  --enable-automatic-failover false

# Create database
az cosmosdb sql database create \
  --account-name fullstack-cosmos-<unique-suffix> \
  --resource-group fullstack-rg \
  --name taskdb

# Create container with partition key
az cosmosdb sql container create \
  --account-name fullstack-cosmos-<unique-suffix> \
  --database-name taskdb \
  --resource-group fullstack-rg \
  --name items \
  --partition-key-path /userId \
  --throughput 400
```

### Step 3: Get Cosmos DB Connection String

```bash
# Retrieve connection string
az cosmosdb keys list \
  --name fullstack-cosmos-<unique-suffix> \
  --resource-group fullstack-rg \
  --type connection-strings \
  --query 'connectionStrings[0].connectionString' \
  --output tsv

# Save this value - you'll need it for backend configuration
```

### Step 4: Create App Service Plan

```bash
# Create App Service plan (for backend)
az appservice plan create \
  --name fullstack-plan \
  --resource-group fullstack-rg \
  --sku B2 \
  --is-linux

# Note: B2 is recommended for development/staging
# For production, consider: P1V2 or P2V2
```

### Step 5: Create App Service (Backend)

```bash
# Create App Service for backend API
az webapp create \
  --name fullstack-api-<unique-suffix> \
  --resource-group fullstack-rg \
  --plan fullstack-plan \
  --runtime "NODE|18-lts"

# Configure Node.js settings
az webapp config appsettings set \
  --name fullstack-api-<unique-suffix> \
  --resource-group fullstack-rg \
  --settings WEBSITE_NODE_DEFAULT_VERSION=18.17.0 SCM_DO_BUILD_DURING_DEPLOYMENT=true
```

### Step 6: Create Static Web App (Frontend)

```bash
# Create Static Web App for frontend
az staticwebapp create \
  --name fullstack-web-<unique-suffix> \
  --resource-group fullstack-rg \
  --location eastus \
  --branch main \
  --login-with-github

# Note: This will prompt GitHub authentication
# The CLI will create a GitHub Actions workflow
```

---

## Phase 2: Application Configuration

### Step 1: Configure Backend Environment Variables

```bash
# Set Cosmos DB connection string
az webapp config appsettings set \
  --name fullstack-api-<unique-suffix> \
  --resource-group fullstack-rg \
  --settings \
    COSMOS_CONNECTION_STRING="<connection-string-from-step-3>" \
    COSMOS_DB_NAME="taskdb" \
    COSMOS_CONTAINER_NAME="items" \
    JWT_SECRET="<generate-a-secure-random-string>" \
    JWT_EXPIRY="7d" \
    NODE_ENV="production" \
    PORT="8080" \
    CORS_ORIGIN="https://fullstack-web-<unique-suffix>.azurestaticapps.net"

# Generate secure JWT secret:
# Linux/Mac: openssl rand -base64 32
# Windows: Use an online generator or: python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Step 2: Configure Frontend Environment Variables

Create `.env` in the client folder:

```bash
# client/.env
VITE_API_URL=https://fullstack-api-<unique-suffix>.azurewebsites.net/api
VITE_ENVIRONMENT=production
```

### Step 3: Update CORS Settings

Edit `server/src/server.ts` to include production URL:

```typescript
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
app.use(
  cors({
    origin: corsOrigin.split(','),  // Supports multiple origins
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
```

### Step 4: Update Frontend API URL

The frontend will use `VITE_API_URL` environment variable from `.env`:

```typescript
// client/src/api/axiosInstance.ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

---

## Phase 3: GitHub Setup & CI/CD

### Step 1: Push Code to GitHub

```bash
# Initialize git repository (if not done)
git init
git remote add origin https://github.com/yourusername/your-repo.git
git add .
git commit -m "Initial commit: Full-stack web application"
git push -u origin main
```

### Step 2: Add GitHub Secrets

Add these to GitHub repository settings → Secrets and variables → Actions:

```
AZURE_SUBSCRIPTION_ID=<your-subscription-id>
AZURE_RESOURCE_GROUP=fullstack-rg
AZURE_COSMOS_CONNECTION_STRING=<cosmos-connection-string>
AZURE_STORAGE_ACCOUNT_NAME=<storage-account-name> (optional)
JWT_SECRET=<your-jwt-secret>
```

### Step 3: GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Azure

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  AZURE_RESOURCE_GROUP: fullstack-rg
  BACKEND_APP_NAME: fullstack-api-<unique-suffix>
  FRONTEND_APP_NAME: fullstack-web-<unique-suffix>

jobs:
  # Build Job
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      # Build Backend
      - name: Install backend dependencies
        run: cd server && npm ci

      - name: Build backend
        run: cd server && npm run build

      # Build Frontend
      - name: Install frontend dependencies
        run: cd client && npm ci

      - name: Build frontend
        run: cd client && npm run build

      # Upload artifacts
      - name: Upload backend artifacts
        uses: actions/upload-artifact@v3
        with:
          name: backend-dist
          path: server/dist

      - name: Upload frontend artifacts
        uses: actions/upload-artifact@v3
        with:
          name: frontend-dist
          path: client/dist

  # Deploy Job
  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'

    steps:
      - uses: actions/checkout@v3

      - name: Azure Login
        uses: azure/login@v1
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}

      # Download artifacts
      - name: Download backend artifacts
        uses: actions/download-artifact@v3
        with:
          name: backend-dist
          path: server/dist

      - name: Download frontend artifacts
        uses: actions/download-artifact@v3
        with:
          name: frontend-dist
          path: client/dist

      # Deploy Backend to App Service
      - name: Deploy backend to App Service
        uses: azure/webapps-deploy@v2
        with:
          app-name: ${{ env.BACKEND_APP_NAME }}
          slot-name: production
          package: server

      # Deploy Frontend to Static Web App
      - name: Deploy frontend to Static Web App
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.STATIC_WEB_APP_DEPLOYMENT_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "client"
          api_location: ""
          output_location: "dist"

      - name: Deployment Complete
        run: |
          echo "✅ Backend deployed to: https://${{ env.BACKEND_APP_NAME }}.azurewebsites.net"
          echo "✅ Frontend deployed to: https://${{ env.FRONTEND_APP_NAME }}.azurestaticapps.net"
```

### Step 4: Create Azure Service Principal

```bash
# Create service principal for GitHub Actions
az ad sp create-for-rbac \
  --name "github-actions-fullstack" \
  --role contributor \
  --scopes /subscriptions/<subscription-id> \
  --json-auth

# Copy the output and add as AZURE_CREDENTIALS secret to GitHub
```

---

## Phase 4: Domain Configuration

### Step 1: Configure Custom Domain on App Service (Backend)

```bash
# Add custom domain
az webapp config hostname add \
  --webapp-name fullstack-api-<unique-suffix> \
  --resource-group fullstack-rg \
  --hostname api.yourdomain.com

# Create SSL binding
az webapp config ssl bind \
  --name fullstack-api-<unique-suffix> \
  --certificate-thumbprint <cert-thumbprint> \
  --ssl-type SNI \
  --resource-group fullstack-rg
```

### Step 2: Configure Custom Domain on Static Web App (Frontend)

```bash
# Add custom domain to Static Web App
az staticwebapp custom-domain create \
  --name fullstack-web-<unique-suffix> \
  --domain-name yourdomain.com \
  --resource-group fullstack-rg \
  --validation-method dns

# Follow the prompts to add DNS records
```

### Step 3: Update DNS Records

In your domain registrar (GoDaddy, Namecheap, etc.):

**For Backend (api.yourdomain.com):**
```
Type: CNAME
Name: api
Value: fullstack-api-<unique-suffix>.azurewebsites.net
TTL: 3600
```

**For Frontend (yourdomain.com):**
```
Type: A
Name: @ (root)
Value: <IP-from-static-web-app>
TTL: 3600
```

Or use CNAME:
```
Type: CNAME
Name: www
Value: fullstack-web-<unique-suffix>.azurestaticapps.net
TTL: 3600
```

### Step 4: Enable HTTPS/SSL

```bash
# Enable managed certificate
az webapp config ssl bind \
  --name fullstack-api-<unique-suffix> \
  --certificate-name fullstackApiCert \
  --ssl-type SNI \
  --resource-group fullstack-rg
```

---

## Phase 5: Production Deployment

### Step 1: Test Everything Locally

```bash
# Backend
cd server
npm install
npm run build
npm start

# Frontend (new terminal)
cd client
npm install
VITE_API_URL=http://localhost:5000/api npm run dev
```

### Step 2: Deploy via GitHub Actions

```bash
# Simply push to main branch
git add .
git commit -m "Deployment to production"
git push origin main

# Monitor GitHub Actions → Workflows for deployment status
```

### Step 3: Verify Deployment

```bash
# Check backend health
curl https://api.yourdomain.com/api/health

# Check frontend is accessible
# Open https://yourdomain.com in browser
```

### Step 4: Database Verification

```bash
# Connect to Cosmos DB via Azure portal or CLI
az cosmosdb sql database list \
  --account-name fullstack-cosmos-<unique-suffix> \
  --resource-group fullstack-rg

# Create test data via API
curl -X POST https://api.yourdomain.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123",
    "name": "Test User"
  }'
```

---

## Monitoring & Maintenance

### Enable Application Insights (Optional)

```bash
# Create Application Insights
az monitor app-insights component create \
  --app insights-fullstack \
  --location eastus \
  --resource-group fullstack-rg

# Link to App Service
az webapp config appsettings set \
  --name fullstack-api-<unique-suffix> \
  --resource-group fullstack-rg \
  --settings APPINSIGHTS_INSTRUMENTATIONKEY=<insights-key>
```

### Monitor Logs

```bash
# View App Service logs
az webapp log tail \
  --name fullstack-api-<unique-suffix> \
  --resource-group fullstack-rg

# View Cosmos DB metrics
az monitor metrics list \
  --resource /subscriptions/<subscription-id>/resourceGroups/fullstack-rg/providers/Microsoft.DocumentDB/databaseAccounts/fullstack-cosmos-<unique-suffix> \
  --metric "RU Consumption" \
  --interval PT1M
```

### Backup Strategy

```bash
# Enable auto-backup for Cosmos DB (default: 7 days)
# No action needed - enabled by default

# Create storage account for application backups
az storage account create \
  --name fullstackbackup<unique> \
  --resource-group fullstack-rg \
  --location eastus
```

### Update Dependencies Regularly

```bash
# Check for updates
npm outdated

# Update packages
npm update

# Audit for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

---

## Scaling for Production

### Backend Auto-Scaling

```bash
# Create auto-scale rule
az monitor autoscale create \
  --resource-group fullstack-rg \
  --resource-type "Microsoft.Web/serverfarms" \
  --resource-name fullstack-plan \
  --min-count 2 \
  --max-count 10 \
  --count 2

# Set CPU-based scaling rule
az monitor autoscale rule create \
  --autoscale-name fullstack-plan-scale \
  --resource-group fullstack-rg \
  --condition "Percentage CPU > 80 avg 5m" \
  --scale out 1
```

### Cosmos DB Scaling

```bash
# Update throughput
az cosmosdb sql container throughput update \
  --account-name fullstack-cosmos-<unique-suffix> \
  --database-name taskdb \
  --name items \
  --resource-group fullstack-rg \
  --throughput 1000

# Or use autoscale
az cosmosdb sql container throughput migrate \
  --account-name fullstack-cosmos-<unique-suffix> \
  --database-name taskdb \
  --name items \
  --resource-group fullstack-rg \
  --throughput-type autoscale \
  --max-throughput 4000
```

---

## Troubleshooting

### Backend Not Starting

```bash
# Check App Service logs
az webapp log show \
  --name fullstack-api-<unique-suffix> \
  --resource-group fullstack-rg

# Check specific error
az webapp log tail \
  --name fullstack-api-<unique-suffix> \
  --resource-group fullstack-rg \
  --provider http
```

### Cosmos DB Connection Issues

```bash
# Verify connection string
az cosmosdb keys list \
  --name fullstack-cosmos-<unique-suffix> \
  --resource-group fullstack-rg \
  --type connection-strings

# Check if container was created
az cosmosdb sql container show \
  --account-name fullstack-cosmos-<unique-suffix> \
  --database-name taskdb \
  --name items \
  --resource-group fullstack-rg
```

### CORS Issues

1. Verify frontend URL in backend CORS settings
2. Check browser console for specific error messages
3. Ensure credentials flag is set if needed

```typescript
// backend/src/server.ts
cors({
  origin: corsOrigin.split(','),
  credentials: true,
})
```

### Static Web App Deploy Failure

```bash
# Check deployment status
az staticwebapp show \
  --name fullstack-web-<unique-suffix> \
  --resource-group fullstack-rg

# Re-run workflow in GitHub Actions
# Push a commit to trigger deployment
```

### SSL Certificate Issues

```bash
# Renew managed certificate
az webapp config ssl create \
  --name fullstack-api-<unique-suffix> \
  --certificate-name renew-cert \
  --resource-group fullstack-rg
```

---

## Cost Optimization

### Reduce Costs

1. **App Service Plan**: Use B1 or B2 for development
2. **Cosmos DB**: Use provisioned throughput, set minimum RU/s
3. **Static Web App**: Free tier available
4. **Storage**: Clean up old backups and logs

### Monitor Costs

```bash
# Get estimated costs
az costmanagement query \
  --timeframe "MonthToDate" \
  --type "Usage" \
  --dataset \
    granularity=Daily \
    aggregation={totalCost={name=PreTaxCost}} \
    grouping='[{type: Dimension, name: ResourceType}]' \
  --resource-group fullstack-rg
```

---

## Post-Deployment Checklist

- [ ] Backend API responds at custom domain
- [ ] Frontend loads and is accessible
- [ ] User can sign up and log in
- [ ] CRUD operations work correctly
- [ ] Data persists in Cosmos DB
- [ ] HTTPS/SSL working on both domains
- [ ] DNS records propagated (can take 24-48 hours)
- [ ] GitHub Actions CI/CD pipeline working
- [ ] Monitoring and logging enabled
- [ ] Backups configured
- [ ] Auto-scaling rules set up
- [ ] Performance tested under load
- [ ] Security best practices implemented
- [ ] Error handling working properly
- [ ] Rate limiting configured (optional)

---

## Cleanup (Remove Resources)

```bash
# Delete entire resource group
az group delete \
  --name fullstack-rg \
  --yes \
  --no-wait

# Or delete individual resources
az webapp delete \
  --name fullstack-api-<unique-suffix> \
  --resource-group fullstack-rg

az staticwebapp delete \
  --name fullstack-web-<unique-suffix> \
  --resource-group fullstack-rg

az cosmosdb delete \
  --name fullstack-cosmos-<unique-suffix> \
  --resource-group fullstack-rg
```

---

## Support & References

- [Azure Documentation](https://docs.microsoft.com/en-us/azure/)
- [App Service Documentation](https://docs.microsoft.com/en-us/azure/app-service/)
- [Cosmos DB Documentation](https://docs.microsoft.com/en-us/azure/cosmos-db/)
- [Static Web Apps Documentation](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

For issues, check Azure Portal → Your Resource → Diagnose and Solve Problems
