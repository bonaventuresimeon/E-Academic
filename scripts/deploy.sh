#!/bin/bash

# Comprehensive deployment script for Academic CRM
# Supports multiple deployment platforms

set -e

PLATFORM=${1:-"local"}

echo "🚀 Academic CRM Deployment Script"
echo "Platform: $PLATFORM"

# Function to check required environment variables
check_env_vars() {
    local required_vars=("DATABASE_URL" "SESSION_SECRET")
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            echo "❌ Error: $var environment variable is required"
            echo "Please set it in your .env file or environment"
            exit 1
        fi
    done
    
    echo "✅ Required environment variables are set"
}

# Function to build the application
build_app() {
    echo "🏗️  Building application..."
    
    # Install dependencies
    ./scripts/install-deps.sh
    
    # Run type checking
    echo "🔍 Running type checks..."
    npm run check
    
    # Build the application
    echo "📦 Building for production..."
    npm run build
    
    echo "✅ Build completed successfully"
}

# Function to deploy to different platforms
deploy_to_platform() {
    case $PLATFORM in
        "local")
            echo "🏠 Starting local production server..."
            npm start
            ;;
        "vercel")
            echo "🌐 Deploying to Vercel..."
            npx vercel --prod
            ;;
        "render")
            echo "🎨 Deploying to Render..."
            echo "Push to your connected GitHub repository to trigger deployment"
            echo "Make sure render.yaml is configured in your repository"
            ;;
        "fly")
            echo "🪰 Deploying to Fly.io..."
            fly deploy
            ;;
        "heroku")
            echo "🔮 Deploying to Heroku..."
            git push heroku main
            ;;
        "docker")
            echo "🐳 Building and running Docker container..."
            docker build -t academic-crm .
            docker run -p 5000:5000 --env-file .env academic-crm
            ;;
        *)
            echo "❌ Unknown platform: $PLATFORM"
            echo "Supported platforms: local, vercel, render, fly, heroku, docker"
            exit 1
            ;;
    esac
}

# Main deployment flow
main() {
    echo "Starting deployment process..."
    
    # Check environment variables (except for docker build)
    if [ "$PLATFORM" != "docker" ]; then
        check_env_vars
    fi
    
    # Build application (except for platforms that build remotely)
    if [[ "$PLATFORM" =~ ^(local|docker)$ ]]; then
        build_app
    fi
    
    # Deploy to specified platform
    deploy_to_platform
    
    echo "🎉 Deployment process completed!"
    echo "Platform: $PLATFORM"
    
    if [ "$PLATFORM" = "local" ]; then
        echo "🌍 Application available at: http://localhost:5000"
    fi
}

# Show usage if no arguments provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 <platform>"
    echo "Platforms: local, vercel, render, fly, heroku, docker"
    echo ""
    echo "Examples:"
    echo "  $0 local     # Start local production server"
    echo "  $0 vercel    # Deploy to Vercel"
    echo "  $0 docker    # Build and run Docker container"
    exit 1
fi

# Run main function
main