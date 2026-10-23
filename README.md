# Dating App - .NET 10 + Angular 21

This is a full-stack application where you can find matches, chat in real-time, and manage your profile. Built with modern .NET and Angular, it's designed to be smooth, responsive, and actually fun to use.

## Quick Overview

This app lets users:
- Create and customize their dating profile
- Browse and search for matches
- Like/Comment on profiles
- Send real-time messages
- Update photos via Cloudinary

## The Tech Stack

### Backend (.NET 10)
- ASP.NET Core Web API
- Entity Framework Core + SQL Server
- Identity authentication with JWT tokens
- SignalR for live messaging
- Cloudinary for photo storage

### Frontend (Angular 22)
- Angular with standalone components
- Reactive forms and signals
- TailwindCSS + DaisyUI for styling
- Vitest for testing
- @microsoft/signalR for real-time features

## Getting Started

### Prerequisites
You'll need:
- .NET 10 SDK
- Node.js 20+
- A SQL Server instance (local or cloud)
- A Cloudinary account (for the photo uploads)

### Running Locally

**Backend:**
```bash
cd Backend
dotnet restore
# Update connection string in appsettings.Development.json if needed
dotnet run --project API/
```
The API will start on https://localhost:5001. Migrations run automatically on first startup - pretty neat, right?

**Frontend:**
```bash
cd Frontend/client
npm install
npm run start
```
The dev server runs on https://localhost:4200 and automatically proxies API calls to the backend. It also uses SSL, so you'll see that lovely padlock icon in your browser. ✓

## Building for Production

```bash
cd Frontend/client
npm run build
```

This compiles the Angular app and outputs it to `Backend/API/wwwroot`, so the .NET app serves it directly. All in one flow - love it!

## Testing

**Frontend:** `cd Frontend/client && npm test` - runs Vitest unit tests

**Backend:** `cd Backend && dotnet test API/API.csproj` - runs xUnit tests

The project uses in-memory databases for testing, so tests run fast without needing a real SQL Server.

## Project Structure

```
Backend/API/          # .NET Web API
  Controllers/        # API endpoints
  Data/               # DbContext, repositories, seed data
  Entities/           # Domain models
  SignalR/            # Real-time hubs

Frontend/client/      # Angular SPA
  src/features/       # Feature-based components
  src/core/           # Services, guards, interceptors
  src/shared/         # Reusable UI components
  src/types/          # TypeScript type definitions
```

## Things I Learned

Building this taught me a lot about:
- Keeping API responses consistent with camelCase naming
- Using signals for reactive state in Angular
- The magic of SignalR for real-time updates
- How Cloudinary handles image uploads seamlessly
- Why Prettier with `singleQuote: true` makes code reviews easier

## Need Help?

If you're running into issues, check:
- The `appsettings.Development.json` for connection strings
- That your Cloudinary API keys are configured
- That both servers are running (backend on 5001, frontend on 4200)

Enjoy the app! If you build something cool with it, I'd love to hear about it.