# ContestLC (Vite SPA)

A lightweight LeetCode contest dashboard.

## Running the App

1. **Install Dependencies** (First time only):
   ```bash
   cd contest-lc
   npm install
   ```

2. **Start Server & Client**:
   ```bash
   npm run dev
   ```
   - Proxy Server: `http://localhost:5000`
   - Client: `http://localhost:5173`

## Features
- **No Database**: Uses `localStorage` to save your username.
- **Proxy**: Bypasses LeetCode CORS issues.
- **Focus Mode**: 90-minute timer for virtual contests.
