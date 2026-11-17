import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.jsx';
import { matchRoute, NOT_FOUND } from './site/routes.js';
import './index.css';

async function start() {
  const route = matchRoute(window.location.pathname) || NOT_FOUND;
  const { default: Page } = await route.load();
  const container = document.getElementById('root');
  const app = <App route={route} Page={Page} />;

  // Pre-rendered pages are hydrated; the dev server renders from scratch.
  if (container.firstElementChild) {
    hydrateRoot(container, app);
  } else {
    if (import.meta.env.DEV) document.title = route.title;
    createRoot(container).render(app);
  }
}

start();
