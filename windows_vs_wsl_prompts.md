# Reusable Project Prompts

## 1. Windows Environment Prompt
**Use this prompt if you want to run the project on standard Windows (PowerShell/CMD).**

---

### **Project: Room Rent Manager (Windows Edition)**

**Objective:**
Build and run a fullstack Room Rent Manager application on a Windows environment using Node.js and React.

**Tech Stack:**
-   **OS:** Windows 10/11
-   **Frontend:** React (Vite)
-   **Backend:** Node.js, Express
-   **Database:** SQLite (`sqlite3` native Windows binary)
-   **Shell:** PowerShell

**Requirements:**
1.  **Backend Setup:**
    -   Initialize a Node.js server on port `3001`.
    -   Use `sqlite3` to create a local file database (`database.sqlite`).
    -   Implement REST API endpoints for Auth, Rooms, and Bookings.
    -   **Important:** Ensure `sqlite3` is installed/compiled for Windows (`npm install sqlite3`).
2.  **Frontend Setup:**
    -   Initialize Vite on port `5173`.
    -   Configure `vite.config.js` to proxy `/api` requests to `http://localhost:3001`.
    -   Implement a modern UI with a Room Slider and Google-style Login.
3.  **Execution:**
    -   Run Backend: `node server/index.cjs`
    -   Run Frontend: `npm run dev`
    -   **Do not** use shell scripts (`.sh`); use `npm` scripts or run commands manually in two PowerShell terminals.

**Verification:**
-   Ensure the app launches at `http://localhost:5173`.
-   Verify that the SQLite database file is created and accessible in the project root.

---

## 2. WSL Environment Prompt
**Use this prompt if you want to run the project in a Linux environment (WSL/Ubuntu).**

---

### **Project: Room Rent Manager (WSL Edition)**

**Objective:**
Build and deploy the Room Rent Manager application in a native WSL (Linux) environment with dynamic configuration.

**Tech Stack:**
-   **OS:** WSL (Ubuntu/Debian)
-   **Frontend:** React (Vite)
-   **Backend:** Node.js, Express
-   **Database:** SQLite (Linux binary)
-   **Shell:** Bash

**Requirements:**
1.  **Environment Setup:**
    -   **CRITICAL:** The project MUST reside in the WSL file system (e.g., `~/room-rent-manager`), NOT in `/mnt/c/...`, to avoid file locking and performance issues.
    -   Install dependencies using `npm install` *inside* the WSL terminal.
2.  **Dynamic Configuration:**
    -   Backend must accept a custom port via `process.env.PORT`.
    -   Frontend must accept the API URL via `VITE_API_URL` environment variable.
3.  **Lifecycle Scripts (Bash):**
    -   Create `start.sh`:
        -   Dynamically find two free ports (e.g., using `ss` or `netstat`).
        -   Start Backend and Frontend in the background using `setsid` or `nohup`.
        -   Save PIDs to a `.pids` file.
    -   Create `stop.sh` to kill processes based on the `.pids` file.
    -   Create `status.sh` to check if processes are running.

**Execution:**
-   Deploy code to `~/room-rent-manager`.
-   Run `bash start.sh` to launch the full stack.
-   Access the app via the dynamically generated URLs (e.g., `http://localhost:4502`).

**Verification:**
-   Verify that `start.sh` successfully launches both services on random ports.
-   Ensure the app is accessible from the Windows browser using `localhost`.
