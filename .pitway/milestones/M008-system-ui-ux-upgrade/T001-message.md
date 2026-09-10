feat: M008 T001 - Add ErrorBoundary to all 3 portals

- Created ErrorBoundary.tsx in frontend, customer-portal, and financial-portal
- Updated App.tsx in all 3 portals to wrap routes in ErrorBoundary
- Added graceful fallback UI with reload button on render errors
