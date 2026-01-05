# GitHub Web Upload Guide - Pi Math Game

## Quick Upload Steps

Since you already have all 44 files committed locally, here's the fastest way to get them on GitHub:

### Step 1: Navigate to Your Repository
Go to: https://github.com/945q6gc5dc-stack/pi-math-game

You should see an empty repository page with text like:
- "Quick setup — if you've done this kind of thing before"
- Links for "creating a new file" or "uploading an existing file"

### Step 2: Look for the Upload Link
On the empty repository page, you'll see blue text that says:
**"uploading an existing file"**

Click on that link.

### Step 3: Upload All Files
You'll be taken to an upload page where you can:
1. **Drag and drop** all your files from your local project folder
2. Or click **"choose your files"** to browse and select multiple files

**What to upload:**
- All files from: `/Users/elangkuma.srinivasan/Library/CloudStorage/OneDrive-ServiceNow/GQM/Projects/AI/pi/`
- This includes: HTML, CSS, JS files, avatars folder, README files, etc.

### Step 4: Commit the Upload
At the bottom of the upload page:
1. Commit message: Use `Initial commit: Pi Math Game with avatar scaling fix`
2. Click **"Commit changes"** button

### Step 5: Enable GitHub Pages
Once files are uploaded:
1. Go to **Settings** tab
2. Scroll down to **Pages** section (left sidebar)
3. Under **Source**, select **"Deploy from a branch"**
4. Select branch: **main** (now it should appear in dropdown!)
5. Select folder: **/ (root)**
6. Click **Save**

### Step 6: Access Your Live Site
After a few minutes, your site will be live at:
**https://945q6gc5dc-stack.github.io/pi-math-game/**

---

## Alternative: Use GitHub's Drag-and-Drop Feature

If you don't see the "uploading an existing file" link:

1. Navigate to your repository: https://github.com/945q6gc5dc-stack/pi-math-game
2. Look for an **"Add file"** dropdown button (usually near the top right, next to "Code" button)
3. Click it and select **"Upload files"**
4. Drag all 44 files into the upload area
5. Add commit message and commit

---

## Expected Result

After upload, you should see all these files in your repository:
```
pi-math-game/
├── index.html
├── style.css
├── script.js
├── ai-agent.js
├── progress.html
├── progress.css
├── progress.js
├── check_profiles.html
├── README.md
├── ARCHITECTURE.md
├── AI-AGENT-README.md
├── GITHUB_UPLOAD_GUIDE.md
└── avatars/
    ├── avatar1.png
    ├── avatar2.png
    ├── ... (26 total avatar files)
```

Once uploaded, the "Add file" dropdown button will be visible on the repository page for future uploads!

---

## Next Steps After Upload

1. ✅ Files uploaded to GitHub
2. ✅ GitHub Pages enabled (main branch, / root)
3. ✅ Wait 2-5 minutes for deployment
4. ✅ Visit: https://945q6gc5dc-stack.github.io/pi-math-game/
5. ✅ Test the game and verify avatar scaling works correctly

---

## Troubleshooting

**Q: I don't see the "uploading an existing file" link**
A: Look for an "Add file" dropdown button instead (top right area of repository page)

**Q: GitHub Pages says "Your site is ready to be published"**
A: This means deployment is in progress. Wait 2-5 minutes and refresh.

**Q: Can I upload folders?**
A: GitHub's web interface may not preserve folder structure perfectly. You might need to:
- Upload the avatars folder separately by navigating into it first
- Or use the command line method with authentication

**Q: Site is not loading after upload**
A: Check:
- Is `index.html` in the root directory? (not in a subfolder)
- Did GitHub Pages deployment complete? (Check Settings → Pages for green checkmark)
- Try accessing with and without trailing slash: `/pi-math-game/` vs `/pi-math-game`
