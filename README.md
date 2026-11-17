# Zenith Hospitality Website

This package contains only the current website, its editable sources and local assets.

## Run locally
1. Install Node.js (LTS) on the other device.
2. Extract this entire folder.
3. Open a terminal in the extracted folder.
4. Run: node server.cjs
5. Open http://127.0.0.1:4180/

No npm install is required. An internet connection loads the Google Fonts and existing CDN styles.

## Continue editing
- build.cjs: shared layout, navigation, footer and page templates.
- styles.css: site styles and responsive rules.
- app.js and the other .js files: animations and interactions.
- journal-articles.json: 20 imported real articles, dates, images and article body HTML.
- partner-profiles.json: partner content.
- assets/: local images, logos, icons and bundled animation libraries.

After template/content changes, run:
  node build.cjs
  node check.cjs

The generated HTML pages are included and ready to preview. Edit templates and JSON for changes you want to preserve after rebuilding.

## Current state
- The main Expertise link goes to the homepage services section; the old Expertise page redirects there.
- Service cards have dedicated detail pages.
- Careers listings are marked Closed.
- The contact form prepares an email draft; there is no submission backend.
- All pages retain the current preview noindex setting.

Packaged 17 November 2026, Asia/Makassar.
