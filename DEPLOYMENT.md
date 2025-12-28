# Deployment Instructions

## 🚀 Your App URL

Once deployed, your app will be available at:
**https://bavadaneethu-dotcom.github.io/fitopia-app/**

## 📋 Steps to Deploy

### Step 1: Push to GitHub (if not already pushed)

```bash
git push origin main
```

If you encounter authentication issues:
- Use GitHub Desktop, or
- Set up SSH keys, or
- Use GitHub CLI (`gh auth login`)

### Step 2: Enable GitHub Pages

1. Go to: **https://github.com/bavadaneethu-dotcom/fitopia-app/settings/pages**
2. Under **"Source"**, select **"GitHub Actions"** (not "Deploy from a branch")
3. Click **Save**

### Step 3: Monitor Deployment

1. Go to: **https://github.com/bavadaneethu-dotcom/fitopia-app/actions**
2. You should see a workflow run called "Build and Deploy to GitHub Pages"
3. Wait for it to complete (takes 2-3 minutes)

### Step 4: Access Your App

Once the workflow completes successfully:
- Visit: **https://bavadaneethu-dotcom.github.io/fitopia-app/**

## ✅ Verification Checklist

- [ ] Code pushed to GitHub
- [ ] GitHub Pages enabled with "GitHub Actions" source
- [ ] Workflow run completed successfully
- [ ] App is accessible at the URL above

## 🔧 Troubleshooting

### Issue: Workflow fails
- Check the Actions tab for error messages
- Verify all files are committed and pushed
- Check that `package.json` has correct dependencies

### Issue: White screen after deployment
- Check browser console for errors
- Verify the build completed successfully
- Clear browser cache and hard refresh (Cmd+Shift+R)

### Issue: 404 on GitHub Pages
- Verify GitHub Pages is enabled
- Check that the workflow deployed successfully
- Wait a few minutes for DNS propagation

## 📝 Notes

- The workflow runs automatically on every push to `main`
- First deployment usually takes 2-3 minutes
- Subsequent deployments are faster
- No API keys needed (Gemini dependencies removed)

