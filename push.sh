#!/bin/bash
# Quick push script for Fitopia app

echo "🚀 Pushing code to GitHub..."
echo ""
echo "If you need to authenticate, you have these options:"
echo ""
echo "1. Use GitHub Desktop (easiest)"
echo "2. Use Personal Access Token:"
echo "   - Go to: https://github.com/settings/tokens"
echo "   - Generate new token (classic) with 'repo' permissions"
echo "   - Use it as password when prompted"
echo ""
echo "Pushing now..."
echo ""

cd "$(dirname "$0")"
git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed!"
    echo ""
    echo "Next steps:"
    echo "1. Go to: https://github.com/bavadaneethu-dotcom/fitopia-app/actions"
    echo "2. Go to: https://github.com/bavadaneethu-dotcom/fitopia-app/settings/pages"
    echo "   - Select 'GitHub Actions' as source"
    echo "3. Wait for deployment"
    echo "4. Visit: https://bavadaneethu-dotcom.github.io/fitopia-app/"
else
    echo ""
    echo "❌ Push failed. Try using GitHub Desktop instead."
fi

