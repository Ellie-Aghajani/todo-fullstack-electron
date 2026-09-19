# To-Do App — Electron + React / ASP.NET Core + SQL Server

A full-stack to-do app: a desktop Electron app and a web app sharing one React codebase, backed by an ASP.NET Core API, Azure SQL Database, and Firebase Authentication.

## Live

- **Web app:** <https://todo-fullstack-electron.vercel.app>
- **API:** <https://todo-fullstack-electron.onrender.com>

> The backend runs on Render's free tier and spins down after inactivity — the first request after idle time can take 30–50 seconds.

## Stack

**Frontend:** React, TypeScript, Vite, MUI, Redux Toolkit, React Query, Firebase Auth, Electron
**Backend:** ASP.NET Core, Entity Framework Core, Azure SQL Database, Firebase Admin SDK

## Getting started

### 1. Clone the repo

```bash
git clone https://github.com/Ellie-Aghajani/todo-fullstack-electron.git
cd todo-fullstack-electron
```

### 2. Backend

```bash
cd backend
dotnet restore
dotnet ef database update --project TodoApi
dotnet run --project TodoApi
```

Needs a `firebase-service-account.json` in `backend/TodoApi/` (Firebase Console → Project Settings → Service Accounts → Generate new private key) and a SQL Server connection string in `appsettings.Development.json`.

### 3. Frontend — web

```bash
cd frontend
npm install
npm run dev
```

### 4. Frontend — desktop (Electron)

```bash
cd frontend
npm run electron:dev        # development
npm run electron:build      # packaged app, in frontend/dist/
```
