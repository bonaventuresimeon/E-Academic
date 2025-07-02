#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

console.log('🚀 Academic Management Platform - Deployment Test Suite');
console.log('=' .repeat(70));

// Test configurations for each platform
const platforms = {
  'Vercel': {
    configFile: 'deployment/vercel.json',
    buildCommand: 'npm install && npm run build',
    dbSupport: 'PostgreSQL via environment variables',
    notes: 'Serverless functions with 10s timeout'
  },
  'Render': {
    configFile: 'deployment/render.yaml',
    buildCommand: 'npm install && npm run build',
    dbSupport: 'Built-in PostgreSQL database',
    notes: 'Full-stack deployment with managed database'
  },
  'Fly.io': {
    configFile: 'deployment/fly.toml',
    buildCommand: 'npm install && npm run build',
    dbSupport: 'PostgreSQL via Fly Postgres',
    notes: 'Containerized deployment with auto-scaling'
  },
  'GitHub Pages': {
    configFile: 'deployment/github-pages-static.yml',
    buildCommand: 'npm install && npx vite build',
    dbSupport: 'Frontend only - no database',
    notes: 'Static hosting - frontend only'
  },
  'Localhost': {
    configFile: 'package.json',
    buildCommand: 'npm install && npm run build',
    dbSupport: 'Local PostgreSQL/SQLite/MySQL',
    notes: 'Development environment'
  }
};

// Check npm and node versions
console.log('📋 Environment Check:');
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
  const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
  console.log(`   Node.js: ${nodeVersion}`);
  console.log(`   npm: ${npmVersion}`);
} catch (error) {
  console.log('   ❌ Error checking Node.js/npm versions');
}

// Check package.json integrity
console.log('\n📦 Package.json Analysis:');
try {
  const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
  console.log(`   Project: ${packageJson.name} v${packageJson.version}`);
  console.log(`   Dependencies: ${Object.keys(packageJson.dependencies || {}).length}`);
  console.log(`   DevDependencies: ${Object.keys(packageJson.devDependencies || {}).length}`);
  console.log(`   Scripts: ${Object.keys(packageJson.scripts || {}).join(', ')}`);
} catch (error) {
  console.log('   ❌ Error reading package.json');
}

// Check npm audit
console.log('\n🔒 Security Audit:');
try {
  const auditResult = execSync('npm audit --audit-level=moderate', { encoding: 'utf8' });
  console.log('   ✅ No security vulnerabilities found');
} catch (error) {
  console.log('   ⚠️  Security vulnerabilities detected');
}

// Test each platform configuration
console.log('\n🌐 Platform Configuration Tests:');
console.log('=' .repeat(70));

Object.entries(platforms).forEach(([platform, config]) => {
  console.log(`\n📊 ${platform} Configuration:`);
  
  // Check if config file exists
  if (existsSync(config.configFile)) {
    console.log(`   ✅ Config file: ${config.configFile}`);
  } else {
    console.log(`   ❌ Config file missing: ${config.configFile}`);
  }
  
  console.log(`   🔧 Build command: ${config.buildCommand}`);
  console.log(`   💾 Database support: ${config.dbSupport}`);
  console.log(`   📝 Notes: ${config.notes}`);
});

// Test critical dependencies
console.log('\n🔍 Critical Dependencies Check:');
const criticalDeps = [
  '@prisma/client',
  'express',
  'react',
  'vite',
  'typescript',
  'tailwindcss'
];

criticalDeps.forEach(dep => {
  if (existsSync(`node_modules/${dep}`)) {
    console.log(`   ✅ ${dep}`);
  } else {
    console.log(`   ❌ ${dep} - missing`);
  }
});

// Database schema check
console.log('\n🗄️  Database Schema:');
if (existsSync('prisma/schema.prisma')) {
  console.log('   ✅ Prisma schema file exists');
  const schema = readFileSync('prisma/schema.prisma', 'utf8');
  const models = schema.match(/model \w+/g) || [];
  console.log(`   📊 Database models: ${models.length}`);
  models.forEach(model => console.log(`      - ${model.replace('model ', '')}`));
} else {
  console.log('   ❌ Prisma schema file missing');
}

// Environment variables check
console.log('\n🔐 Environment Configuration:');
const requiredEnvVars = [
  'DATABASE_URL',
  'SESSION_SECRET',
  'NODE_ENV'
];

if (existsSync('.env.example')) {
  console.log('   ✅ .env.example file exists');
  const envExample = readFileSync('.env.example', 'utf8');
  requiredEnvVars.forEach(envVar => {
    if (envExample.includes(envVar)) {
      console.log(`   📋 ${envVar} - documented`);
    } else {
      console.log(`   ⚠️  ${envVar} - not documented`);
    }
  });
} else {
  console.log('   ❌ .env.example file missing');
}

console.log('\n🎯 Deployment Readiness Summary:');
console.log('=' .repeat(70));

// Platform-specific recommendations
console.log('\n💡 Platform-Specific Recommendations:');

console.log('\n🔵 Vercel:');
console.log('   • Best for: Frontend-heavy applications with serverless backend');
console.log('   • Database: Use Neon, PlanetScale, or Supabase');
console.log('   • Build time: 10 minute limit');
console.log('   • Environment: Set DATABASE_URL, SESSION_SECRET');

console.log('\n🔴 Render:');
console.log('   • Best for: Full-stack applications');
console.log('   • Database: Built-in PostgreSQL recommended');
console.log('   • Build time: No strict limits');
console.log('   • Environment: Auto-managed with render.yaml');

console.log('\n🟣 Fly.io:');
console.log('   • Best for: Containerized applications');
console.log('   • Database: Fly Postgres or external');
console.log('   • Build time: Docker-based, efficient');
console.log('   • Environment: fly.toml + secrets');

console.log('\n⚫ GitHub Pages:');
console.log('   • Best for: Static frontend only');
console.log('   • Database: Not supported');
console.log('   • Build time: GitHub Actions limits');
console.log('   • Environment: No backend functionality');

console.log('\n🔲 Localhost:');
console.log('   • Best for: Development and testing');
console.log('   • Database: Local PostgreSQL/SQLite/MySQL');
console.log('   • Build time: No limits');
console.log('   • Environment: .env file required');

console.log('\n✅ Test completed successfully!');