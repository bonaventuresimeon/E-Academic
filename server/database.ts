import { Pool } from '@neondatabase/serverless';
import { drizzle as drizzlePostgres } from 'drizzle-orm/neon-serverless';
import { drizzle as drizzleMysql } from 'drizzle-orm/mysql2';
import { drizzle as drizzleSqlite } from 'drizzle-orm/better-sqlite3';
import { createConnection } from 'mysql2/promise';
import Database from 'better-sqlite3';
import { sql } from 'drizzle-orm';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure Neon for WebSocket support
import { neonConfig } from '@neondatabase/serverless';
neonConfig.webSocketConstructor = ws;

export interface DatabaseConfig {
  type: 'postgresql' | 'mysql' | 'sqlite';
  url: string;
}

export function detectDatabaseType(url: string): DatabaseConfig['type'] {
  if (url.startsWith('postgres://') || url.startsWith('postgresql://')) {
    return 'postgresql';
  }
  if (url.startsWith('mysql://')) {
    return 'mysql';
  }
  if (url.startsWith('file:') || url.includes('.db')) {
    return 'sqlite';
  }
  return 'postgresql'; // default
}

export function createDatabaseConnection() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    throw new Error("DATABASE_URL must be set. Please configure your database connection.");
  }

  const dbType = process.env.DATABASE_TYPE || detectDatabaseType(databaseUrl);
  
  switch (dbType) {
    case 'postgresql': {
      try {
        // Try Neon first (for cloud deployments)
        const pool = new Pool({ connectionString: databaseUrl });
        return drizzlePostgres({ client: pool, schema });
      } catch (error) {
        // Fallback to regular PostgreSQL
        const { Pool: PgPool } = require('pg');
        const pool = new PgPool({ connectionString: databaseUrl });
        const { drizzle } = require('drizzle-orm/node-postgres');
        return drizzle(pool, { schema });
      }
    }
    
    case 'mysql': {
      // Use string connection for MySQL
      return drizzleMysql(databaseUrl, { schema, mode: 'default' });
    }
    
    case 'sqlite': {
      const dbPath = databaseUrl.replace('file:', '') || './dev.db';
      const sqlite = new Database(dbPath);
      return drizzleSqlite(sqlite, { schema });
    }
    
    default:
      throw new Error(`Unsupported database type: ${dbType}`);
  }
}

export async function testDatabaseConnection() {
  try {
    const db = createDatabaseConnection();
    
    // Test with a simple query
    const result = await db.execute(sql`SELECT 1 as test`);
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// Create and export the database instance
export const db = createDatabaseConnection();

// Export for legacy compatibility
export const pool = db;