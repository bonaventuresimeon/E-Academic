#!/bin/bash

# ===========================================
# Academic Management Platform - Deployment Setup
# ===========================================
# This script configures the application for various deployment platforms
# Supports: Local, Docker, Vercel, Render, Fly.io, GitHub Actions

set -e

echo "🚀 Academic Management Platform - Deployment Setup"
echo "============================================="

# Check Node.js version
check_node_version() {
    if command -v node >/dev/null 2>&1; then
        NODE_VERSION=$(node -v | cut -d'v' -f2)
        MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1)
        
        if [ "$MAJOR_VERSION" -lt 18 ]; then
            echo "❌ Error: Node.js version $NODE_VERSION found. Minimum required: v18.0.0"
            echo "Please upgrade Node.js: https://nodejs.org"
            exit 1
        else
            echo "✅ Node.js version $NODE_VERSION (OK)"
        fi
    else
        echo "❌ Error: Node.js not found. Please install Node.js 18+ from https://nodejs.org"
        exit 1
    fi
}

# Check npm and install dependencies
install_dependencies() {
    echo "📦 Installing dependencies..."
    
    if [ -f "package-lock.json" ]; then
        npm ci --legacy-peer-deps
    else
        npm install --legacy-peer-deps
    fi
    
    echo "✅ Dependencies installed successfully"
}

# Environment setup
setup_environment() {
    echo "🔧 Setting up environment..."
    
    if [ ! -f ".env" ]; then
        echo "📄 Creating .env file from template..."
        cp .env.example .env
        echo "⚠️  Please configure .env file with your database and API credentials"
    else
        echo "✅ .env file already exists"
    fi
    
    # Create uploads directory
    mkdir -p uploads
    echo "✅ Uploads directory created"
}

# Database setup
setup_database() {
    echo "🗄️  Setting up database..."
    
    if [ -n "$DATABASE_URL" ]; then
        echo "✅ Database URL configured"
        
        # Run database migrations
        if command -v npx >/dev/null 2>&1; then
            echo "📊 Running database migrations..."
            npm run db:push
            echo "✅ Database migrations completed"
        fi
    else
        echo "⚠️  DATABASE_URL not configured. Please set it in .env file"
    fi
}

# Build application
build_application() {
    echo "🔨 Building application..."
    
    # Clean previous builds
    if [ -d "dist" ]; then
        rm -rf dist
    fi
    
    # Build frontend and backend
    npm run build
    
    if [ $? -eq 0 ]; then
        echo "✅ Application built successfully"
    else
        echo "❌ Build failed. Please check the errors above."
        exit 1
    fi
}

# Test application
test_application() {
    echo "🧪 Testing application..."
    
    # Type checking
    npm run check
    
    if [ $? -eq 0 ]; then
        echo "✅ TypeScript check passed"
    else
        echo "❌ TypeScript check failed"
        exit 1
    fi
}

# Platform-specific setup
setup_docker() {
    echo "🐳 Setting up Docker deployment..."
    
    if command -v docker >/dev/null 2>&1; then
        echo "✅ Docker found"
        echo "📝 To build: docker build -t academic-platform ."
        echo "📝 To run: docker run -p 5000:5000 --env-file .env academic-platform"
    else
        echo "❌ Docker not found. Install from https://docker.com"
    fi
}

setup_kubernetes() {
    echo "☸️  Setting up Kubernetes deployment..."
    
    if [ -d "k8s" ]; then
        echo "✅ Kubernetes manifests found in k8s/ directory"
        echo "📝 To deploy: kubectl apply -f k8s/"
    else
        echo "⚠️  Kubernetes manifests not found"
    fi
}

setup_vercel() {
    echo "▲ Setting up Vercel deployment..."
    
    if [ -f "vercel.json" ]; then
        echo "✅ Vercel configuration found"
        echo "📝 To deploy: vercel --prod"
        echo "📝 Make sure to set environment variables in Vercel dashboard"
    else
        echo "❌ vercel.json not found"
    fi
}

setup_render() {
    echo "🌐 Setting up Render deployment..."
    
    if [ -f "render.yaml" ]; then
        echo "✅ Render configuration found"
        echo "📝 Connect your GitHub repository to Render"
        echo "📝 Render will automatically deploy on git push"
    else
        echo "❌ render.yaml not found"
    fi
}

setup_flyio() {
    echo "🪰 Setting up Fly.io deployment..."
    
    if [ -f "fly.toml" ]; then
        echo "✅ Fly.io configuration found"
        echo "📝 To deploy: fly deploy"
        echo "📝 First time: fly launch"
    else
        echo "❌ fly.toml not found"
    fi
}

# Main deployment menu
show_deployment_options() {
    echo ""
    echo "🚀 Choose deployment platform:"
    echo "1) Local development"
    echo "2) Docker container"
    echo "3) Vercel (serverless)"
    echo "4) Render (full-stack)"
    echo "5) Fly.io (global edge)"
    echo "6) Kubernetes cluster"
    echo "7) All platforms"
    echo "8) Exit"
    echo ""
    read -p "Enter your choice (1-8): " choice
    
    case $choice in
        1)
            echo "🏠 Setting up for local development..."
            setup_environment
            install_dependencies
            setup_database
            echo "✅ Local setup complete! Run: npm run dev"
            ;;
        2)
            setup_docker
            ;;
        3)
            setup_vercel
            ;;
        4)
            setup_render
            ;;
        5)
            setup_flyio
            ;;
        6)
            setup_kubernetes
            ;;
        7)
            echo "🌍 Setting up for all platforms..."
            setup_environment
            install_dependencies
            setup_database
            build_application
            test_application
            setup_docker
            setup_vercel
            setup_render
            setup_flyio
            setup_kubernetes
            ;;
        8)
            echo "👋 Goodbye!"
            exit 0
            ;;
        *)
            echo "❌ Invalid choice. Please try again."
            show_deployment_options
            ;;
    esac
}

# Main execution
main() {
    check_node_version
    
    if [ "$1" = "--auto" ]; then
        echo "🤖 Running automatic setup..."
        setup_environment
        install_dependencies
        setup_database
        build_application
        test_application
        echo "✅ Automatic setup complete!"
    else
        show_deployment_options
    fi
}

# Execute main function with all arguments
main "$@"