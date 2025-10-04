# 🚀 EcoVerse - Quick Start Guide

## 📋 How to Run This Project Tomorrow (or Anytime!)

### 🛠️ Prerequisites Check
Make sure you have these installed:
- **Node.js 18+** - Check with: `node --version`
- **npm** - Check with: `npm --version` 
- **Git** - Check with: `git --version`

### 🚀 Starting the Project - 3 Easy Steps!

#### Method 1: Manual Start (Recommended)

**Step 1: Open PowerShell/Terminal**
```powershell
# Navigate to your project folder
cd C:\projects\ecoverse-dashboard
```

**Step 2: Start Backend Server**
```powershell
# Open first PowerShell window for backend
cd backend
node server-new.js
```
*Keep this window open - you should see: "🌍 Ecoverse Backend Server running on port 5000"*

**Step 3: Start Frontend Server**
```powershell
# Open second PowerShell window for frontend
cd C:\projects\ecoverse-dashboard\frontend
npm start
```
*Keep this window open - you should see the React app compiling*

**Step 4: Access Your App**
- **Frontend (Main App)**: http://localhost:3000
- **Backend API**: http://localhost:5000/api/health

---

#### Method 2: Using Windows Scripts (Even Easier!)

I've created convenient scripts for you:

**Windows Batch Script:**
```batch
# Double-click start-ecoverse.bat (created below)
```

**PowerShell Script:**
```powershell
# Run: .\start-ecoverse.ps1 (created below)
```

---

### 🔧 If Something Goes Wrong

#### Backend Won't Start?
```powershell
cd C:\projects\ecoverse-dashboard\backend
npm install  # Reinstall dependencies
node server-new.js  # Try starting again
```

#### Frontend Won't Start?
```powershell
cd C:\projects\ecoverse-dashboard\frontend
npm install  # Reinstall dependencies
npm start    # Try starting again
```

#### Port Already in Use?
```powershell
# Kill any running Node processes
taskkill /f /im node.exe
# Then try starting again
```

#### Project Files Missing?
```powershell
# Re-download from GitHub
git clone https://github.com/Rajy777/EcoVerse1.git
cd EcoVerse1
# Then follow the installation steps
```

---

### 📁 Quick File Locations

- **Project Root**: `C:\projects\ecoverse-dashboard`
- **Backend Server**: `backend/server-new.js`
- **Frontend**: `frontend/src/App.tsx`
- **Environment File**: `backend/.env`

---

### ✨ What You'll See When Working

1. **Backend Terminal**: Shows API logs and AI chat responses
2. **Frontend Terminal**: Shows React compilation and hot reload
3. **Browser**: Your beautiful EcoVerse dashboard at localhost:3000

---

### 🎯 Quick Test - Is Everything Working?

1. ✅ Backend health: http://localhost:5000/api/health
2. ✅ Frontend loads: http://localhost:3000
3. ✅ 3D Earth is spinning
4. ✅ AI chat responds in Insights page
5. ✅ Maps show environmental data

---

### 🛑 How to Stop the Project

1. **Close both terminal windows** (Ctrl+C in each)
2. **Or use**: `taskkill /f /im node.exe` to kill all Node processes

---

### 💡 Pro Tips

- **Bookmark**: http://localhost:3000 for quick access
- **Keep terminals open** while using the app
- **Check GitHub**: https://github.com/Rajy777/EcoVerse1 for latest updates
- **Environment variables**: All in `backend/.env` file

---

### 🆘 Need Help?

1. **Check this file first** - most issues are covered above
2. **Look at README.md** - comprehensive documentation  
3. **Check GitHub issues** - common problems and solutions
4. **Terminal errors** - copy the error message for troubleshooting

**Happy Environmental Monitoring! 🌱🌍**