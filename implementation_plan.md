# WSL Deployment & Scripts

## Goal Description
Prepare the application for execution in a WSL environment. This includes enabling dynamic port configuration for both backend and frontend, and providing shell scripts (`start.sh`, `stop.sh`, `status.sh`) to manage the application lifecycle.

## Proposed Changes

### Backend
#### [MODIFY] [server/index.cjs](file:///C:/Users/bosek/.gemini/antigravity/scratch/room-rent-manager/server/index.cjs)
-   Update `PORT` constant to use `process.env.PORT || 3001`.

### Frontend
#### [MODIFY] [src/services/authService.js](file:///C:/Users/bosek/.gemini/antigravity/scratch/room-rent-manager/src/services/authService.js)
-   Update `API_URL` to use `import.meta.env.VITE_API_URL`.

#### [MODIFY] [src/services/roomService.js](file:///C:/Users/bosek/.gemini/antigravity/scratch/room-rent-manager/src/services/roomService.js)
-   Update `API_URL` to use `import.meta.env.VITE_API_URL`.

#### [MODIFY] [src/services/storageService.js](file:///C:/Users/bosek/.gemini/antigravity/scratch/room-rent-manager/src/services/storageService.js)
-   Update `API_URL` to use `import.meta.env.VITE_API_URL`.

### Scripts (New)
#### [NEW] [start.sh](file:///C:/Users/bosek/.gemini/antigravity/scratch/room-rent-manager/start.sh)
-   Find available ports for Backend and Frontend.
-   Set `PORT` and `VITE_API_URL` environment variables.
-   Start Backend and Frontend in background.
-   Save PIDs to `.pids` file.
-   Output the dynamic URLs.

#### [NEW] [stop.sh](file:///C:/Users/bosek/.gemini/antigravity/scratch/room-rent-manager/stop.sh)
-   Read PIDs from `.pids`.
-   Kill processes.
-   Remove `.pids` file.

#### [NEW] [status.sh](file:///C:/Users/bosek/.gemini/antigravity/scratch/room-rent-manager/status.sh)
-   Check if processes listed in `.pids` are running.

## Verification Plan
### Manual Verification
-   Run `wsl bash start.sh` from PowerShell.
-   Verify output URLs are accessible.
-   Run `wsl bash status.sh`.
-   Run `wsl bash stop.sh` and verify processes terminate.
