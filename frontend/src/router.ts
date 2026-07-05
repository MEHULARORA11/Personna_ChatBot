import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import RootLayout from './routes/RootLayout';
import IndexPage from './routes/index';
import DocsLayout from './routes/docs';
import DocsIndex from './routes/docs.index';
import DocsPersonaData from './routes/docs.persona-data';
import DocsPromptEngineering from './routes/docs.prompt-engineering';
import DocsContextManagement from './routes/docs.context-management';
import DocsSampleConversations from './routes/docs.sample-conversations';

// 1. Root Layout Route
const rootRoute = createRootRoute({
  component: RootLayout,
});

// 2. Index / Chat Dashboard Route
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: IndexPage,
});

// 3. Documentation Layout Route
const docsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/docs',
  component: DocsLayout,
});

// 4. Documentation Overview (Index) Route
const docsIndexRoute = createRoute({
  getParentRoute: () => docsRoute,
  path: '/',
  component: DocsIndex,
});

// 5. Documentation Persona Data Route
const docsPersonaDataRoute = createRoute({
  getParentRoute: () => docsRoute,
  path: '/persona-data',
  component: DocsPersonaData,
});

// 6. Documentation Prompt Engineering Route
const docsPromptEngRoute = createRoute({
  getParentRoute: () => docsRoute,
  path: '/prompt-engineering',
  component: DocsPromptEngineering,
});

// 7. Documentation Context & Cookies Route
const docsContextRoute = createRoute({
  getParentRoute: () => docsRoute,
  path: '/context-management',
  component: DocsContextManagement,
});

// 8. Documentation Sample Conversations Route
const docsSamplesRoute = createRoute({
  getParentRoute: () => docsRoute,
  path: '/sample-conversations',
  component: DocsSampleConversations,
});

// Build the Route Tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  docsRoute.addChildren([
    docsIndexRoute,
    docsPersonaDataRoute,
    docsPromptEngRoute,
    docsContextRoute,
    docsSamplesRoute,
  ]),
]);

// Create the global router instance
export const router = createRouter({ routeTree });

// Register the router type definitions for TypeScript autocompletion
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
