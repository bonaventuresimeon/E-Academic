#!/bin/bash

# Complete GitHub Push Script - Academic Management Platform
# Consolidated script for all GitHub push operations

set -e

echo "🚀 Academic Management Platform - GitHub Push"
echo "============================================="

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository. Initialize git first:"
    echo "   git init"
    echo "   git remote add origin <your-github-repo-url>"
    exit 1
fi

# Display menu options
echo ""
echo "Choose push option:"
echo "1. Complete repository (all files and folders)"
echo "2. Core application only (client, server, shared)"
echo "3. Assets only (attached_assets folder)"
echo "4. Systematic push (organized batches)"
echo ""
read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo "📦 Pushing complete repository..."
        git add .
        git commit -m "✨ Complete Academic Management Platform

🎮 Futuristic HUD Design:
- Advanced gaming-style interface with matrix animations
- Gradient effects and holographic styling
- Responsive design with dark/light themes

🏗️ Clean Architecture:
- Organized folder structure with logical separation
- No duplicate files or configurations
- Enterprise-grade code organization

🚀 Multi-Platform Deployment:
- Docker, Vercel, Render, Fly.io, Kubernetes support
- CI/CD pipelines with GitHub Actions
- Health checks and monitoring endpoints

📚 Comprehensive Documentation:
- Complete setup and deployment guides
- API documentation and architecture overview
- Developer-friendly instructions

🔧 Technical Stack:
- Full-stack TypeScript with React 18
- Express.js backend with PostgreSQL
- Tailwind CSS with Shadcn/UI components
- Drizzle ORM with type-safe operations
- OpenAI integration for AI features"
        ;;
    2)
        echo "🎮 Pushing core application..."
        git add client/ server/ shared/
        git commit -m "🎮 Core application with futuristic HUD design and backend API"
        ;;
    3)
        echo "📁 Pushing assets only..."
        if [ ! -d "attached_assets" ]; then
            echo "❌ Error: attached_assets folder not found"
            exit 1
        fi
        git add attached_assets/
        git commit -m "📁 Project assets and screenshots"
        ;;
    4)
        echo "📚 Systematic push - multiple commits..."
        
        # Core application
        git add client/ server/ shared/
        git commit -m "🎮 Core application with futuristic HUD design and backend API"
        git push origin main
        
        # Configuration & documentation
        git add *.json *.ts *.js *.md .env.example .gitignore .replit
        git commit -m "⚙️ Configuration files and comprehensive documentation"
        git push origin main
        
        # Deployment & DevOps
        git add deployment/ devops/ k8s/ scripts/
        git commit -m "🐳 Multi-platform deployment and DevOps automation"
        git push origin main
        
        # Assets & additional directories
        git add attached_assets/ docs/ tools/ uploads/
        git commit -m "📁 Project assets, documentation, and additional directories"
        ;;
    *)
        echo "❌ Invalid choice. Exiting."
        exit 1
        ;;
esac

# Push to GitHub (for options 1, 2, 3)
if [ "$choice" != "4" ]; then
    echo "🚀 Pushing to GitHub..."
    if git push origin main; then
        echo "✅ Successfully pushed to GitHub!"
    else
        echo "❌ Failed to push to GitHub. Please check:"
        echo "   - Internet connection"
        echo "   - GitHub authentication"
        echo "   - Repository permissions"
        exit 1
    fi
fi

echo ""
echo "🎉 GitHub Push Complete!"
echo ""
echo "📊 Repository Features:"
echo "   ✅ Futuristic HUD design maintained"
echo "   ✅ Clean and organized structure"
echo "   ✅ Multi-platform deployment ready"
echo "   ✅ Comprehensive documentation"
echo "   ✅ Enterprise-grade setup"
echo ""
echo "🎯 Next Steps:"
echo "   1. Configure GitHub Actions for CI/CD"
echo "   2. Set up deployment on preferred platform"
echo "   3. Configure environment variables"
echo "   4. Monitor application health"