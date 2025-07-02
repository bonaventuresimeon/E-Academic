#!/bin/bash

# Push only attached_assets folder to GitHub
# Academic Management Platform - Asset Push Script

set -e

echo "📁 Pushing attached_assets folder to GitHub..."
echo "=============================================="

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository. Initialize git first:"
    echo "   git init"
    echo "   git remote add origin <your-github-repo-url>"
    exit 1
fi

# Check if attached_assets folder exists
if [ ! -d "attached_assets" ]; then
    echo "❌ Error: attached_assets folder not found"
    exit 1
fi

# Show what's in the attached_assets folder
echo "📋 Contents of attached_assets folder:"
ls -la attached_assets/
echo ""

# Add only the attached_assets folder
echo "📦 Adding attached_assets folder..."
git add attached_assets/

# Check if there are changes to commit
if git diff --cached --quiet; then
    echo "ℹ️  No changes to commit in attached_assets folder"
    echo "   The folder may already be up to date in the repository"
else
    # Commit the changes
    echo "💾 Committing attached_assets..."
    git commit -m "📁 Add attached_assets folder

- Contains project assets and images
- IMG_7951_1751456118532.png - Project structure screenshot"

    # Push to GitHub
    echo "🚀 Pushing to GitHub..."
    if git push origin main; then
        echo "✅ Successfully pushed attached_assets folder to GitHub!"
        echo ""
        echo "📊 Asset Summary:"
        echo "   - Folder: attached_assets/"
        echo "   - Files: $(find attached_assets -type f | wc -l) files"
        echo "   - Size: $(du -sh attached_assets | cut -f1)"
    else
        echo "❌ Failed to push to GitHub. Please check:"
        echo "   - Internet connection"
        echo "   - GitHub authentication"
        echo "   - Repository permissions"
        exit 1
    fi
fi

echo ""
echo "🎯 attached_assets folder is now available on GitHub!"