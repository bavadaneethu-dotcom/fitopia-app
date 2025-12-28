# Fitopia - Zootopia Fitness App

Fitopia is a gamified Zootopia-themed fitness PWA built with React, TypeScript, and Vite.

## 🚀 Getting Started

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd fitopia-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (optional)
   Create a `.env` file in the root directory if needed:
   ```env
   VITE_BASE_PATH=/
   ```
   Note: AI features (food image analysis, plan briefing, character generation) are currently disabled. Integrate with ChatGPT API to enable these features.

4. **Run the development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`

5. **Build for production**
   ```bash
   npm run build
   ```

### 📦 Deploying to GitHub Pages

This repository is configured to automatically deploy to GitHub Pages using GitHub Actions.

#### Setup Instructions:

1. **Enable GitHub Pages**
   - Go to your repository Settings → Pages
   - Under "Source", select "GitHub Actions"
   - Save the settings

2. **Configure Base Path** (if needed)
   - If deploying to a project page (e.g., `username.github.io/repository-name`), set `VITE_BASE_PATH` in the GitHub Actions workflow
   - For root GitHub Pages (e.g., `username.github.io`), the default `/` works fine
   - Edit `.github/workflows/deploy.yml` and add `VITE_BASE_PATH` to the build step if needed

4. **Push to main/master branch**
   - The workflow will automatically build and deploy on every push to `main` or `master`
   - You can also manually trigger it from the Actions tab

5. **Access your deployed app**
   - After deployment, your app will be available at:
     - Root GitHub Pages: `https://username.github.io`
     - Project Pages: `https://username.github.io/repository-name`

#### Manual Deployment

You can also manually trigger the workflow:
1. Go to the Actions tab in your repository
2. Select "Build and Deploy to GitHub Pages"
3. Click "Run workflow"

---

## 📚 Backend Documentation (Supabase Optimized)

The following section provides the complete technical requirements for the backend implementation using **Supabase**.

---

## 🛠️ Infrastructure Overview
- **Database**: PostgreSQL (Supabase DB).
- **Authentication**: Supabase Auth (JWT).
- **Storage**: Supabase Storage Buckets.
- **Edge Functions**: Deno (for AI API proxying - ChatGPT integration recommended).

---

## 📡 API Endpoints & JSON Requirements

### 1. Cadet Profile (`/user/profile`)
**GET** - Returns the primary cadet identity and physical metrics.
**PATCH** - Updates biometrics. 
> **Logic Rule**: When physical metrics are patched, the backend should trigger a recalculation of `daily_calorie_limit` using the Mifflin-St Jeor Equation.

```json
{
  "id": "uuid",
  "name": "Judy Hopps",
  "dob": "1998-05-20",
  "gender": "female",
  "age": 26,
  "height_cm": 175.0,
  "weight_kg": 68.0,
  "activity_level": "Active",
  "unit_system": "metric", 
  "daily_calorie_limit": 2430,
  "user_goal": "maintain",
  "active_character_id": "judy",
  "current_level": 5,
  "current_xp": 1250,
  "max_xp": 1500,
  "inventory": ["none", "shades"],
  "equipped_accessory": "shades",
  "streak_days": 7
}
```

### 2. Evidence Locker (`/logs/food`)
**GET** - Query by `log_date`.
**POST** - Records food (optionally analyzed by AI - ChatGPT integration recommended).
> **Relational Logic**: Every successful log should return the updated `current_xp` and `current_level` to the frontend for real-time progress feedback.

```json
{
  "name": "Carrot Cake Pawpsicle",
  "calories": 350,
  "protein": 5,
  "carbs": 45,
  "fat": 12,
  "category": "sweet",
  "icon": "🥕",
  "display_amount": "1 piece",
  "ai_feedback": "Code Green: Standard herbivore fuel detected!",
  "zpd_status": "CLEAR PATH: OPTIMAL FUELING",
  "image_url": "storage_link_to_bucket"
}
```

### 3. Academy Drills (`/logs/activity`)
**GET** - Returns workouts/meditation sessions.
**POST** - Records a session.
> **XP Logic**: Workouts grant 10 XP/min. Meditation grants 5 XP/min.

```json
{
  "category": "workout",
  "title": "Tundratown Sprint",
  "icon": "🏃",
  "duration": "00:25:00",
  "calories_burned": 210,
  "color": "blue"
}
```

### 4. Hydration District (`/logs/water`)
**GET** - Total water for specific `log_date`.
**POST** - Add hydration record (+10 XP).

```json
{
  "amount_ml": 500,
  "log_date": "2025-05-15"
}
```

### 5. Patrol Shifts (`/logs/fasting`)
**POST** - Start/End fasting session.
**GET** - Retrieve fasting history.

```json
{
  "protocol": "16:8 Method",
  "start_time": "ISO_TIMESTAMP",
  "end_time": "ISO_TIMESTAMP",
  "duration_text": "16h 02m"
}
```

---

## 🧠 Business Logic & Relational Requirements

### A. Date-Based Queries
- All `GET` requests for logs must support a `date` or `startDate/endDate` filter. 
- Example: `GET /logs/food?date=2025-05-10` returns only entries for that specific calendar day.

### B. Calorie Math (The "Case Target")
- The backend must maintain the `daily_calorie_limit`. 
- **Recalculation Formula**:
    - *BMR (Men)*: `(10 * weight_kg) + (6.25 * height_cm) - (5 * age) + 5`
    - *BMR (Women)*: `(10 * weight_kg) + (6.25 * height_cm) - (5 * age) - 161`
    - *TDEE*: `BMR * activity_multiplier`
    - *Target*: `Lose (-500)`, `Gain (+500)`, `Maintain (TDEE)`.

### C. Gamification Logic (XP & Ranking)
The backend uses a trigger-based XP engine:
1. **Food Log**: +50 XP.
2. **Water Log**: +10 XP.
3. **Drill (Activity)**: Duration-based (e.g., 30 mins = 300 XP).
4. **Promotion**: When `current_xp >= max_xp`:
    - Increment `level`.
    - Subtract `max_xp` from `current_xp`.
    - Increase `max_xp` by 50%.

---

## 📦 Storage Requirements
Create two buckets in Supabase Storage with **Authenticated** read access:
1. `food-evidence`: Store meal photos.
2. `avatar-lab`: Store generated AI character renders.

---

## ⚡ Edge Functions (AI API Proxy)
To protect API keys, the following functions should be hosted on Supabase Edge (ChatGPT integration recommended):
1. `analyze-meal`: Input image -> Call ChatGPT Vision API -> Return JSON + Save to DB.
2. `generate-briefing`: Input Profile -> Call ChatGPT API -> Return text.
3. `generate-avatar`: Input Prompt -> Call ChatGPT DALL-E API -> Save to bucket -> Return URL.

---

## 🏁 Handoff Checklist
- [ ] Enable Supabase Auth (Email/Password).
- [ ] Run `database.sql` to initialize schema/triggers.
- [ ] Set up `food-evidence` and `avatar-lab` storage buckets.
- [ ] Enable RLS on all tables.
- [ ] Implement Edge Functions for AI processing.
