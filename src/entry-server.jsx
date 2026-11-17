import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App.jsx';
import { routes, matchRoute, NOT_FOUND } from './site/routes.js';
import { buildHead } from './site/head.js';

export { routes, NOT_FOUND };

export async function render(path) {
  const route = path === NOT_FOUND.path ? NOT_FOUND : matchRoute(path) || NOT_FOUND;
  const { default: Page } = await route.load();
  const html = renderToString(<App route={route} Page={Page} />);
  return { html, head: buildHead(route), route };
}
