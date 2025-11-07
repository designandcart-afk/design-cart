#!/bin/bash

# Instructions for setting up git remote and pushing to GitHub

echo "=== Git Setup Instructions ==="
echo ""
echo "The code has been committed locally with message: 'D&C basic template'"
echo ""
echo "To push to GitHub, follow these steps:"
echo ""
echo "1. Create a new repository on GitHub:"
echo "   - Go to https://github.com"
echo "   - Click 'New' or '+' > 'New repository'"
echo "   - Name it 'design-and-cart-mvp' (or your preferred name)"
echo "   - Don't initialize with README (we already have files)"
echo ""
echo "2. Add the remote repository:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git"
echo ""
echo "3. Push to GitHub:"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "Note: A .gitignore file has been created to exclude node_modules and other unnecessary files."
echo "You may want to remove node_modules from the current commit in future commits."
echo ""
echo "Current status:"
git log --oneline -n 1
echo ""
git status --short | head -10
if [ $(git status --short | wc -l) -gt 10 ]; then
    echo "... and $(( $(git status --short | wc -l) - 10 )) more files"
fi