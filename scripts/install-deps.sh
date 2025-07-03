#!/bin/bash

# Production-ready dependency installation script
# Handles legacy peer dependency conflicts and ensures clean builds

set -e

echo "🚀 Installing Academic CRM dependencies..."

# Clean install to avoid conflicts
echo "📦 Cleaning existing node_modules..."
rm -rf node_modules package-lock.json

# Install with legacy peer deps to handle version conflicts
echo "📦 Installing dependencies with legacy peer deps resolution..."
npm install --legacy-peer-deps

# Run security audit and fix issues automatically
echo "🔒 Running security audit..."
npm audit fix --force || true

# Verify critical dependencies are available
echo "✅ Verifying critical dependencies..."
node -e "
const deps = ['react', 'express', 'drizzle-orm', '@neondatabase/serverless', 'openai'];
deps.forEach(dep => {
  try {
    require.resolve(dep);
    console.log('✓', dep);
  } catch (e) {
    console.error('✗', dep, 'not found');
    process.exit(1);
  }
});
"

echo "✅ Dependencies installed successfully!"
echo "🏗️  Ready to build and deploy!"