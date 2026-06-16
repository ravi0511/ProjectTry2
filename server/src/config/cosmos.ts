// src/config/cosmos.ts

import { CosmosClient, Database, Container } from '@azure/cosmos';

let cosmosClient: CosmosClient | null = null;
let database: Database | null = null;
let container: Container | null = null;

const connectionString = process.env.COSMOS_CONNECTION_STRING || '';
const databaseId = process.env.COSMOS_DB_NAME || 'taskdb';
const containerId = process.env.COSMOS_CONTAINER_NAME || 'items';

/**
 * Initialize Cosmos DB connection
 * Creates database and container if they don't exist
 */
export async function initializeCosmosDB(): Promise<void> {
  try {
    if (!connectionString) {
      throw new Error('COSMOS_CONNECTION_STRING environment variable is not set');
    }

    cosmosClient = new CosmosClient(connectionString);

    // Create or get database
    const { database: dbInstance } = await cosmosClient.databases.createIfNotExists({
      id: databaseId,
    });
    database = dbInstance;
    console.log(`✅ Database '${databaseId}' ready`);

    // Create or get container with partition key
    const { container: containerInstance } = await database.containers.createIfNotExists(
      {
        id: containerId,
        partitionKey: {
          paths: ['/userId'], // Partition key for efficient scaling
        },
        // Optional: Define indexing policy for optimization
        indexingPolicy: {
          indexingMode: 'consistent',
          automatic: true,
          includedPaths: [
            {
              path: '/*',
            },
          ],
          excludedPaths: [
            {
              path: '/"_etag"/?',
            },
          ],
        },
      },
      { offerThroughput: 400 } // Minimum RUs for development
    );
    container = containerInstance;
    console.log(`✅ Container '${containerId}' ready`);
  } catch (error) {
    console.error('❌ Failed to initialize Cosmos DB:', error);
    throw error;
  }
}

/**
 * Get Cosmos DB client instance
 */
export function getCosmosClient(): CosmosClient {
  if (!cosmosClient) {
    throw new Error('Cosmos DB client not initialized. Call initializeCosmosDB() first.');
  }
  return cosmosClient;
}

/**
 * Get database instance
 */
export function getDatabase(): Database {
  if (!database) {
    throw new Error('Database not initialized. Call initializeCosmosDB() first.');
  }
  return database;
}

/**
 * Get container instance
 */
export function getContainer(): Container {
  if (!container) {
    throw new Error('Container not initialized. Call initializeCosmosDB() first.');
  }
  return container;
}

/**
 * Close Cosmos DB connection
 */
export async function closeCosmosDB(): Promise<void> {
  if (cosmosClient) {
    await cosmosClient.dispose();
    console.log('✅ Cosmos DB connection closed');
  }
}
