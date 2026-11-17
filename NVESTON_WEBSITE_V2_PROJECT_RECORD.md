# NVeston Website 2.0 — Project Record

Branch: `development/nveston-website-v2` (local only — not pushed, not deployed)
Baseline checkpoint: tag `v1-baseline-2026-11-17` (= `main` @ `8c293dd`, the live production site)
Last updated: 2026-11-17

---

## 1. Status at a glance

| Area | Status |
|---|---|
| Multi-page architecture with static pre-rendering | Complete, tested locally |
| Design system (tokens, light/dark/paper/navy surfaces, components) | Complete |
| Global navigation (mega menu, mobile drawer, breadcrumbs) and footer | Complete, keyboard-tested |
| Homepage, About, Contact, FAQ, 404 | Complete |
| Six service pages + overview | Complete — copy needs founder review |
| Four customer-segment pages + overview | Complete — copy needs founder review |
| Five interactive tools + hub | Complete, unit-tested |
| Personal Financial Calculator | **Not available** — product not found in workspace; no page created |
| Insights infrastructure (hub, categories, search, articles) | Complete |
| Seven draft articles | Drafts — **excluded from production builds** until approved |
| Privacy Policy, Terms of Use, Important Disclosures | Drafts — **require legal review before deployment** |
| Founder page | Preserved (head, structured data, bio, portrait identical to production) |
| HAMI | Preserved unchanged; now loads site-wide after page idle |
| Consultation / contact form | Preserved; one additive change (topic preselection) |
| Push / deploy | **Not authorized — not done** |

---

## 2. How to run

```bash
npm test                # 24 finance unit tests (node:test, no extra dependencies)
npm run build           # production build (drafts excluded) → dist/
npm run build:preview   # review build (draft articles + review notices visible)
npm run qa              # static QA of dist/: metadata, H1s, JSON-LD, alt text, internal links
npm run serve           # serve dist/ like Vercel at http://localhost:4321
npm run dev             # Vite dev server (client-rendered, drafts visible)
```

---

## 3. Architecture

**Approach: static pre-rendering on the existing Vite + React + Tailwind stack. No new dependencies.**

- `src/site/routes.js` — single route table (path, page module, title, description, breadcrumbs, schema type). Article and category routes are generated from content and only included when visible.
- `src/entry-server.jsx` + `scripts/prerender.mjs` — after `vite build`, an SSR build renders every route to `dist/<path>/index.html` with page-specific `<head>` (title, description, canonical, Open Graph, Twitter, JSON-LD), plus `404.html`, `sitemap.xml` and `robots.txt`.
- `src/entry-client.jsx` — hydrates the pre-rendered HTML; each page is a lazily-loaded chunk.
- Navigation uses ordinary links (multi-page). Vercel serves `dist/<path>/index.html` for both `/path` and `/path/` (confirmed in production for `/founder`), so direct access and refresh work for every route without rewrites.
- `src/site/head.js` — head builder. The founder route uses a dedicated builder that reproduces the approved production head field for field.
- Browser-only features are mounted after hydration (`ClientOnly.jsx`): HAMI (deferred to idle time) and the existing contact form (needs the visitor's time zone).
- Draft gating: `SHOW_DRAFTS` (`VITE_SHOW_DRAFTS=true` or dev server). Draft pages are `noindex`, never in the sitemap, and absent from production builds.

**Why not a framework migration (Next.js/Astro)?** The existing stack already supports SSR rendering; a ~60-line prerender script gives search-readable HTML and per-page metadata with no new dependency, no hosting change and minimal risk.

**Critical deployment dependency:** Vercel must run `npm run build` (the package script). If the project's Build Command is overridden to `vite build`, pre-rendering will not run and sub-pages will 404. Verify in Vercel → Project Settings → Build & Development before any deployment.

### Key files
```
index.html                         template with <!--app-head--> / <!--app-html--> placeholders
src/site/{config,routes,head}.js   site config, routes, head + JSON-LD
src/content/                       all copy: catalog, services, segments, needs, articles(-index), legal, faq, founder
src/components/site/               Layout, Header, Footer, ui, charts, interactive, tools-ui, ClientOnly, HamiMount
src/pages/                         page templates (+ tools/)
src/lib/finance/                   calculation engines (pure functions)
tests/finance.test.mjs             unit tests incl. checks of every figure quoted in site copy
scripts/{prerender,serve,qa-dist}.mjs
```

### Files modified from v1
- `index.html` (now a template), `src/App.jsx`, `src/index.css` (design tokens), `tailwind.config.js` (extended tokens only), `vite.config.js` (back to single entry), `package.json` (scripts, version), `.gitignore`.
- `src/components/landing/ContactSection.jsx` — **only** an 8-line additive effect: `?topic=` preselects a topic. Submission, fields, validation, Web3Forms key and email destination untouched.
- Dark-theme `--muted-foreground` lightened from 55% to 64% for WCAG AA contrast (affects secondary text on dark surfaces, including the contact form).

### Files removed (recoverable from git / baseline tag)
v1 single-page components replaced by the new pages: `Navbar, HeroSection, ServicesSection, DetailedServicesSection, ApproachSection, ClientsSection, PhilosophySection, Footer`, `src/pages/Home.jsx`, `src/main.jsx`, `src/founder.jsx`, `founder/index.html`, `public/sitemap.xml`, `public/robots.txt` (both now generated at build).

### Assets added
`public/brand/` optimized logo (96/192px), favicon (32px), apple-touch-icon, share image (630px JPEG). Originals untouched.

---

## 4. Sitemap (production build: 26 URLs; preview adds 12 draft insight URLs)

```
/                                   Homepage
/services                           Services overview
  /services/personal-financial-services
  /services/financial-markets-portfolio-intelligence
  /services/macro-market-intelligence
  /services/risk-scenario-analysis
  /services/entrepreneur-business-advisory
  /services/premium-strategic-advisory
/who-we-serve                       Segments overview
  /who-we-serve/individuals | small-businesses | entrepreneurs | market-participants
/tools                              Tools hub
  /tools/business-profitability | cash-flow | break-even | debt-financing | financial-resilience
/about  /founder  /contact  /faq
/policies/privacy | terms | disclosures
/insights (+ /insights/{business,economy,financial-markets,risk-strategy} and 7 articles) — preview only until articles are approved
404.html                            custom, noindex, served with 404 status
```
Legal pages live under `/policies/` because the existing HAMI widget already links to `/policies/terms`; HAMI's "Request a Consultation" link to `/contact` also now resolves. Homepage anchors `#services #approach #clients #philosophy #contact` are preserved.

---

## 5. Financial tools — calculation validation

All engines are pure functions in `src/lib/finance/`, validated by `npm test` (24 tests, all passing) against independently computed values:

| Tool | Key checks |
|---|---|
| Profitability | Directive example: $50k/$45k, −5% expenses → $7,250 profit, +$2,250/mo, +$27,000/yr; losses; zero revenue (no margin) |
| Cash flow | Hand-calculated 3-month growth case (profit 5,000/6,000/7,050; cash 13,000/14,500/14,425); shortfall month & lowest balance |
| Break-even | 12,000 / (50−30) = 600 units, $30,000; target 900; fractional round-up (143); zero & negative contribution margin handled |
| Debt & financing | $100k @6% 30y = $599.55 (reference); $10k @5% 5y = $188.71; zero-rate; bi-weekly principal sums |
| Resilience | Directive example; band boundaries; validation. Uses NVeston educational reference bands — **no score** |
| Site copy | Every figure quoted in service pages and articles is re-computed in tests (this caught and corrected one article error) |

Inputs: free text with `$`/`,` accepted; blank vs. invalid text produce distinct messages; ranges and whole-number rules enforced; no input leaves the browser.

---

## 6. SEO implementation

- Unique title + description on every page; canonical `https://www.nveston.com/<path>` (no trailing slash) — verified by `npm run qa`.
- Open Graph + Twitter metadata on every page (share image: logo; founder page keeps the portrait).
- JSON-LD: `Organization` + `WebSite` (home), `WebPage`/`CollectionPage`/`AboutPage`/`ContactPage` + `BreadcrumbList` (all pages), `Article` (articles, `datePublished` only once published), founder `ProfilePage`/`Person` unchanged.
- Sitemap + robots generated at build, all on `www`. Draft pages `noindex` and excluded from sitemap.
- Legacy metadata audit: removed homepage `<meta keywords>` containing "Investment Advisory, Portfolio Advisory"; homepage title changed from "Strategic Capital Advisory" to "Financial Intelligence & Strategic Advisory" (wording from the approved founder biography).
- Founder page: 23 head fields compared with production → **identical**; ProfilePage JSON-LD **identical**; one `BreadcrumbList` block added.

---

## 7. Accessibility, performance, security — test results (local)

**Accessibility (target WCAG 2.2 AA)**
- Contrast: all text/background token pairs ≥ 5.07:1 on every surface (computed).
- One `<h1>` per page and no heading-level skips (39 pages, scripted).
- All images have alt text; decorative SVGs `aria-hidden`; charts have text summaries + screen-reader data tables.
- Skip link; visible focus rings; mega menu: Enter opens, Escape closes and returns focus, active section indicated; mobile drawer with `aria-expanded` accordions, Escape closes.
- Needs selector is an ARIA tablist with arrow/Home/End keys. Tool inputs labelled with hint/error association; results `aria-live`.
- Scroll reveals only affect below-the-fold elements after hydration and are disabled for reduced-motion users; content is visible without JavaScript.
- Not performed: automated axe/Lighthouse audit, screen-reader testing with VoiceOver/NVDA.

**Performance**
- Layout shift (CLS) measured 0.000 on homepage and a tool page (mobile viewport).
- Initial JS 62 KB gzip; page chunks 1–4 KB gzip; contact form chunk 43 KB gzip (framer-motion, lazy, form pages only); HAMI loads at idle.
- LCP could not be measured in the hidden review browser — run Lighthouse on a preview deployment.
- No horizontal overflow on 33 pages × 375/768/1024px (99 scripted checks); 1440px reviewed visually.

**Security & privacy**
- No new dependencies, tracking, cookies, analytics or third-party scripts. Calculators send nothing.
- Only credential in client code is the existing Web3Forms public access key (designed to be public). `.env.local` stays ignored.
- External links use `rel="noopener noreferrer"`. JSON-LD output escapes `<`.

---

## 8. Register — unresolved issues, compliance review and items awaiting authorization

### A. Compliance review (founder + qualified counsel) — **before any deployment**
1. **Legal pages are drafts** (`src/content/legal.js`): governing-law clause intentionally omitted; data-retention period, state privacy-rights language and limitation-of-liability wording need counsel.
2. **"Advisory" terminology** — "strategic advisory firm" (approved bio), "Premium Strategic Advisory", "Entrepreneur & Business Advisory": confirm with counsel that the terms do not imply investment-adviser status.
3. **"Financial Markets & Portfolio Intelligence"** — the established service name contains "Portfolio". Content is limited to education/research and explicitly excludes portfolio review/advice; v1's "portfolio diagnostics, exposure analysis" wording was removed. Needs counsel sign-off (marked `reviewFlag` in content).
4. **HAMI copy (not modified — separate authorization needed):** welcome text "explore investment and capital allocation decisions"; suggested questions "How can NVeston help with my portfolio?", "investment philosophy", "NEX Triangle framework". These may conflict with the site's stated boundaries.
5. **Disclaimer v1.1** (Operations folder) uses older positioning ("Strategic Capital Advisory", "Investment & Portfolio Advisory", "recommendations"). Not published; the new Important Disclosures draft supersedes it pending review.
6. **"NVeston services list.docx"** describes capital positioning, stock opportunity assessment and market-timing guidance. **Deliberately not used** — outside the approved scope.
7. Philosophy line "Capital deserves direction" retained from v1 (approved) — low risk, listed for awareness.
8. Resilience tool reference bands (3/6 months; 15%/36% debt share; 5%/20% margin) are labelled NVeston educational rules of thumb — confirm acceptable.

### B. Content awaiting founder approval
9. All new service, segment, homepage, About, FAQ and tool copy.
10. Seven draft articles (author "NVeston Intelligence"). To publish: set `status: 'published'` and a real `publishedDate` in `src/content/articles-index.js`.
11. Mission statement and operating principles on /about (derived from existing philosophy; no separate mission document found).

### C. Missing information
12. **Personal Financial Calculator** — not found in the workspace. Tools hub states it is in development; no route exists.
13. Company social profiles (e.g., NVeston LinkedIn page) — none verified; only the founder's LinkedIn is linked.
14. Pricing — `NVeston_Master_Pricing_Framework_v2.0.pdf` exists but approval status unknown; no prices published.
15. Confirm the Web3Forms access key's notification email is contact@nveston.com.
16. HAMI backend data handling/retention — Privacy Policy states messages are sent to the HAMI service; confirm details.
17. Photography — no rights-cleared photography beyond the logo and founder portrait; the design uses typography and diagrams. A designed 1200×630 social share image is recommended.

### D. Technical notes
18. Vercel Build Command must be `npm run build` (see §3).
19. HAMI now appears on every page (previously homepage only) and auto-opens once per browser session — consider limiting auto-open (requires HAMI change → separate authorization).
20. `node_modules/` is committed to the repository (pre-existing). Recommend untracking in a separate change.
21. Apex redirect `nveston.com → www` is a 307 (temporary); 308 recommended (Vercel domain setting — not changed).
22. Contact form chunk includes framer-motion (43 KB gzip); could be reduced only by modifying the form (not done).

---

## 9. Page-by-page audit checklist for the Founder & Managing Member

Review with `npm run build:preview && npm run serve` → http://localhost:4321

- [ ] `/` — headline, value statements, needs selector (each of 6 options), services grid, interactive example, scenarios, approach, segments, tools, philosophy, founder card, contact form
- [ ] `/services` and each of the 6 service pages — headline, plain-language text, questions, capabilities, "what you may receive", scenario figures, FAQ, scope note
- [ ] `/who-we-serve` and 4 segment pages — concerns, examples, links
- [ ] `/tools` and 5 tools — try your own numbers; read assumptions/limitations
- [ ] `/insights`, categories and 7 draft articles (preview only)
- [ ] `/about` — mission, principles, "today vs. ambition"
- [ ] `/founder` — confirm biography, portrait, Leadership Perspective, LinkedIn unchanged
- [ ] `/contact` — process explanation; form behaviour (do not submit unless a live test is intended)
- [ ] `/faq`
- [ ] `/policies/privacy`, `/policies/terms`, `/policies/disclosures` — send to counsel
- [ ] Mobile: menu, tools, contact form
- [ ] HAMI opens, answers, and its Terms / Request a Consultation links work

---

## 10. Recommended production deployment plan (not executed)

1. Founder review of §9; legal review of §8A; decide on §8B–C.
2. Apply approved edits; `npm test && npm run build && npm run qa`.
3. Confirm Vercel Build Command = `npm run build`, Output = `dist`.
4. With authorization, push `development/nveston-website-v2` to GitHub → Vercel **preview** deployment.
5. On the preview: open every route directly and refresh; check `/founder` head; run Lighthouse (mobile) and Google Rich Results Test; test HAMI; one authorized live contact-form submission to confirm delivery.
6. With authorization, merge to `main` → production. Immediately verify `/`, `/founder`, `/contact`, a service and a tool page, `sitemap.xml`, `robots.txt`, and a non-existent URL (expect 404).
7. Search Console: resubmit `sitemap.xml`; inspect `/` and a few new URLs. `/founder` canonical is unchanged, so its indexing is unaffected.
8. Rollback: redeploy the previous production deployment in Vercel, or revert `main` to tag `v1-baseline-2026-11-17`.

---

## 11. Continuation instructions

- Content lives in `src/content/*` — edit copy there, not in page components.
- New page: add to `PAGES` and `RAW_ROUTES` in `src/site/routes.js`; it is pre-rendered, added to the sitemap and checked by `npm run qa` automatically.
- New tool: pure function + tests in `src/lib/finance/` and `tests/`, page in `src/pages/tools/` using `ToolLayout`, entry in `TOOLS` (catalog) and routes.
- Founder content (`src/content/founder.js`) and founder head (`founderHead` in `src/site/head.js`) must not change without explicit approval.
- Do not modify `src/hami-widget/*` or the contact form's submission logic without authorization.

---

## 12. Visual enhancements (2026-11-17, checkpoint tag `v2-pre-visuals`)

| Request | Status | Placement |
|---|---|---|
| Financial Intelligence visual | Done — CSS 3D layered planes (context / drivers / decision range), slow float, reduced-motion safe, no assets | Homepage hero, right column (replaces the flat scenario-fan SVG) |
| Global Market Intelligence visual | Done — canvas dot-matrix globe, real financial-centre coordinates, decorative arcs, ~30 fps, pauses off-screen, static for reduced motion | Homepage "Our services" header, right column |
| HAMI animated character | **Not done** — cannot be produced to the required 3D-cartoon standard with code-only tools | — |
| Human-centred business visual | **Not done** — requires photography or professional illustration with usage rights | — |

Files: `src/components/site/visuals.jsx` (new), `src/index.css` (`.fi-*` styles), `src/pages/HomePage.jsx` (two placements).
To complete the remaining two: supply (a) a HAMI character as a transparent animated WebM/animated WebP plus a static PNG, and (b) a licensed or commissioned editorial photograph (with model release). Both can then be integrated without touching HAMI's functionality.

---

## 13. Production release readiness review (2026-11-17)

**Technical readiness: passed.** 24/24 unit tests; production build 26 routes + 404; static QA clean (27 pages, 1,660 internal links); draft articles absent from production build and sitemap; no committed credentials (only the public-by-design Web3Forms access key; `.env.local` untracked). Earlier responsive, keyboard, contrast, founder-head and calculator checks reused.

**Release status: HELD before deployment** — material compliance items require founder decision:

1. HAMI customer-facing copy invites investment/portfolio advice (welcome text in `HAMIWidget.jsx`; `welcomeBody` and two suggested questions in `widget.config.js`). Proposed replacement copy recorded in the release report. HAMI backend behaviour (refusal of personalized securities recommendations) cannot be verified from this repository.
2. Privacy Policy, Terms of Use and Important Disclosures are unapproved drafts and are included in the production build. Instruction: do not publish unapproved legal drafts.
3. Vercel Build Command cannot be verified from here (no dashboard access); options: founder confirms `npm run build` in Project Settings, or authorize a `vercel.json` (`buildCommand: npm run build`, `outputDirectory: dist`).
4. For counsel (non-blocking unless counsel says otherwise): "Financial Markets & Portfolio Intelligence" service name; "advisory" terminology.
