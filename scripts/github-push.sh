#!/bin/bash

# GitHub Push Script for Academic Management Platform
# This script helps systematically push all organized files to GitHub

set -e

echo "🚀 GitHub Push Script - Academic Management Platform"
echo "=================================================="

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository. Initialize git first:"
    echo "   git init"
    echo "   git remote add origin <your-github-repo-url>"
    exit 1
fi

# Function to add and commit files
commit_files() {
    local message="$1"
    shift
    local files=("$@")
    
    echo "📦 Adding files: ${message}"
    for file in "${files[@]}"; do
        if [ -e "$file" ]; then
            git add "$file"
            echo "  ✓ Added: $file"
        else
            echo "  ⚠️  Not found: $file"
        fi
    done
    
    if git diff --cached --quiet; then
        echo "  ℹ️  No changes to commit for this batch"
    else
        git commit -m "$message"
        echo "  ✅ Committed: $message"
    fi
}

echo "Starting systematic push to GitHub..."
echo ""

# 1. Root configuration files
echo "1️⃣ Root Configuration Files"
commit_files "📝 Root configuration and documentation files" \
    ".env.example" \
    ".gitignore" \
    ".replit" \
    "LICENSE" \
    "README.md" \
    "replit.md" \
    "PROJECT_STRUCTURE.md" \
    "GITHUB_PUSH_GUIDE.md"

# 2. Build and configuration files
echo "2️⃣ Build and Configuration Files"
commit_files "⚙️ Build and configuration files" \
    "components.json" \
    "drizzle.config.ts" \
    "package.json" \
    "package-lock.json" \
    "postcss.config.js" \
    "tailwind.config.ts" \
    "tsconfig.json" \
    "vite.config.ts"

# 3. Client directory (Frontend)
echo "3️⃣ Client Directory (Frontend)"
commit_files "🎨 Frontend React application with futuristic HUD design" \
    "client/"

# 4. Server directory (Backend)  
echo "4️⃣ Server Directory (Backend)"
commit_files "🔧 Backend Express application with authentication and API" \
    "server/"

# 5. Shared directory
echo "5️⃣ Shared Directory"
commit_files "🔗 Shared types and database schemas" \
    "shared/"

# 6. Deployment directory
echo "6️⃣ Deployment Directory"
commit_files "🐳 Deployment configurations for multiple platforms" \
    "deployment/"

# 7. DevOps directory
echo "7️⃣ DevOps Directory"
commit_files "🔄 DevOps automation and infrastructure" \
    "devops/"

# 8. Kubernetes directory
echo "8️⃣ Kubernetes Directory"
commit_files "☸️ Kubernetes manifests and configurations" \
    "k8s/"

# 9. Documentation directory
echo "9️⃣ Documentation Directory"
commit_files "📚 Comprehensive project documentation" \
    "docs/"

# 10. Scripts directory
echo "🔟 Scripts Directory"
commit_files "🛠️ Automation and deployment scripts" \
    "scripts/"

# 11. Additional directories
echo "1️⃣1️⃣ Additional Directories"
commit_files "📁 Additional tools and upload directories" \
    "tools/" \
    "uploads/"

# Push all commits to GitHub
echo ""
echo "🚀 Pushing all commits to GitHub..."
if git push origin main; then
    echo "✅ Successfully pushed all files to GitHub!"
    echo ""
    echo "🎉 Repository Status:"
    echo "   - Clean and organized structure"
    echo "   - Futuristic HUD design maintained"
    echo "   - Multi-platform deployment ready"
    echo "   - Comprehensive documentation"
    echo "   - Enterprise-grade development setup"
else
    echo "❌ Failed to push to GitHub. Please check:"
    echo "   - Internet connection"
    echo "   - GitHub authentication"
    echo "   - Repository permissions"
    exit 1
fi

echo ""
echo "🌟 Next Steps:"
echo "   1. Configure GitHub Actions for CI/CD"
echo "   2. Set up deployment on your preferred platform"
echo "   3. Configure environment variables"
echo "   4. Monitor application health"
echo ""
echo "Your Academic Management Platform is now ready for production! 🚀"