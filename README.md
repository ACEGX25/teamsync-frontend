# Project Structure

This document outlines the folder structure of the project to help contributors navigate the codebase efficiently.

---

## Root Structure

```
src/
├── app/
├── components/
├── constants/
├── context/
├── utils/
├── hooks/
├── types/
├── styles/
└── config/
```

---

## Detailed Breakdown

### `app/`
Contains all Next.js pages and routing logic.

```
app/
├── auth/
│   └── login/
│       └── page.tsx         # Login page
│
├── authenticated/           # All protected/authenticated routes
│   ├── dashboard/           # Dashboard page
│   ├── department/          # Department management page
│   ├── projects/            # Projects listing page
│   ├── project-tasks/       # Project tasks page
│   └── timesheet/           # Timesheet page
│
└── layout.tsx               # Root layout wrapper
```

---

### `components/`
Reusable UI components organized by feature and shared utilities.

```
components/
├── dashboard/               # Components specific to the dashboard
├── department/              # Components specific to department management
├── project/                 # Components specific to projects
├── projectTask/             # Components specific to project tasks
├── timesheet/               # Components specific to timesheets
│
├── shared/                  # Shared components used across multiple features
│   ├── Table.tsx            # Generic reusable table component
│   ├── Modal.tsx            # Generic modal/dialog component
│   └── Pagination.tsx       # Pagination component
│
└── ui/                      # Base-level UI primitives
    ├── Button.tsx            # Button component
    ├── Input.tsx             # Input field component
    └── Badge.tsx             # Badge/tag component
```

---

### `constants/`
Application-wide constant values.

```
constants/
└── validation/              # Validation rules and error messages
```

---

### `context/`
React Context providers for global state management across the application.

---

### `utils/`
Utility functions and helpers.

```
utils/
└── api/                     # API helper functions and request handlers
```

---

### `hooks/`
Custom React hooks for reusable stateful logic across components.

---

### `types/`
TypeScript type definitions and interfaces shared across the application.

---

### `styles/`
Global styles, theme variables, and shared CSS/SCSS files.

---

### `config/`
Application configuration files (e.g., environment setup, constants, third-party config).

---

## Contributing

- Feature-specific components go inside their respective folder under `components/`.
- Shared/reusable components go inside `components/shared/` or `components/ui/`.
- All API calls should be handled inside `utils/api/`.
- TypeScript types/interfaces should be defined in `types/` and imported where needed.
- New pages must be created under `app/authenticated/` (for protected routes) or `app/auth/` (for public routes).
