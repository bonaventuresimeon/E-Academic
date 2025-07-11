#!/bin/bash

# Academic Management Platform - Universal Deployment Script
# Supports: Render, Fly.io, Vercel, Docker, Local

set -e

PLATFORM=${1:-"local"}

echo "🚀 Deploying Academic Management Platform to: $PLATFORM"

case $PLATFORM in
  "render")
    echo "📦 Deploying to Render..."
    if [ ! -f "render.yaml" ]; then
      echo "❌ render.yaml not found!"
      exit 1
    fi
    echo "✅ Connect your GitHub repo to Render and it will auto-deploy"
    echo "📝 Make sure to set these environment variables in Render:"
    echo "   - DATABASE_URL (auto-generated by Render)"
    echo "   - SESSION_SECRET (auto-generated by Render)"
    echo "   - OPENAI_API_KEY (if using AI features)"
    ;;

  "fly")
    echo "📦 Deploying to Fly.io..."
    if ! command -v fly &> /dev/null; then
      echo "❌ Fly CLI not installed. Install from: https://fly.io/docs/getting-started/installing-flyctl/"
      exit 1
    fi
    
    # Set environment variables
    echo "🔧 Setting up environment variables..."
    fly secrets set SESSION_SECRET=$(openssl rand -base64 32)
    
    if [ ! -z "$DATABASE_URL" ]; then
      fly secrets set DATABASE_URL="$DATABASE_URL"
    fi
    
    if [ ! -z "$OPENAI_API_KEY" ]; then
      fly secrets set OPENAI_API_KEY="$OPENAI_API_KEY"
    fi
    
    # Deploy
    fly deploy
    ;;

  "vercel")
    echo "📦 Deploying to Vercel..."
    if ! command -v vercel &> /dev/null; then
      echo "❌ Vercel CLI not installed. Installing..."
      npm install -g vercel
    fi
    
    # Set environment variables
    echo "🔧 Setting up environment variables..."
    vercel env add SESSION_SECRET production
    vercel env add DATABASE_URL production
    vercel env add OPENAI_API_KEY production
    
    # Deploy
    vercel --prod
    ;;

  "docker")
    echo "📦 Building Docker container..."
    if ! command -v docker &> /dev/null; then
      echo "❌ Docker not installed!"
      exit 1
    fi
    
    # Build and run with Docker Compose
    echo "🏗️ Building containers..."
    docker-compose build
    
    echo "🚀 Starting services..."
    docker-compose up -d
    
    echo "✅ Application running at: http://localhost:5000"
    echo "📊 Database running at: localhost:5432"
    ;;

  "local")
    echo "📦 Setting up local development..."
    
    # Install dependencies
    echo "📥 Installing dependencies..."
    npm install
    
    # Check for .env file
    if [ ! -f ".env" ]; then
      echo "📝 Creating .env file from template..."
      cp .env.example .env
      echo "⚠️  Please update .env with your database credentials"
    fi
    
    # Setup database
    echo "🗄️ Setting up database..."
    if [ ! -z "$DATABASE_URL" ]; then
      npm run db:push
    else
      echo "⚠️  DATABASE_URL not set. Please configure your database in .env"
    fi
    
    # Start development server
    echo "🚀 Starting development server..."
    npm run dev
    ;;

  *)
    echo "❌ Unknown platform: $PLATFORM"
    echo "📖 Usage: $0 [render|fly|vercel|docker|local]"
    exit 1
    ;;
esac

echo "✅ Deployment complete!"