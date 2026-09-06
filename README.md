# Riya Kumar — Portfolio

A compact Astro portfolio based on Riya’s supplied LinkedIn profile. White pages, self-hosted DM Sans, hand-drawn SVG details, and a large footer revealed from behind the page.

## Develop

Use Node.js 22.12+ (supported even-numbered release).

```sh
npm install
npm run dev
```

Open http://localhost:4321.

## Customize

- `src/data/portfolio.ts`: profile, experience, education, and LinkedIn URL.
- `src/pages/index.astro`: page structure and introduction.
- `src/styles/global.css`: type scale, layout, opening and scroll animations.
- `src/components/Sketch.astro`: original line illustrations.
- `src/scripts/smooth-scroll.ts`: Lenis wheel scrolling; touch remains native.

The footer uses CSS sticky positioning. The opening reveal and plant drawing use CSS; offscreen entries use IntersectionObserver. The footer window illustration draws as the page uncovers it. Reduced-motion preferences disable decorative movement and smooth scrolling. Short viewports use a normal-flow footer. Main content stays available without JavaScript.

## Validate and build

```sh
npm run check
npm run build
npm run preview
```

Deploy `dist/` to static hosting.

## References

- User-supplied profile screenshot: compact type, offset labels, light dividers.
- [60fps — Emphasis](https://60fps.design/shots/emphasis-get-started-splash-animation): MCP motion breakdown, subtle upward reveals and stagger without bounce.
- [Shopify Design](https://shopify.design/): Onboarding Graphic and Card Sorting showcases, informing the object depth and contained motion.

## Motion refinement references

Additional 60fps searches covered 12 examples; four motion breakdowns informed this pass:

- [Up Ahead onboarding](https://60fps.design/shots/up-ahead-onboarding): brief sequential text reveals, adapted to entry headings and descriptions.
- [Gleam intro](https://60fps.design/shots/gleam-intro-text-typewriter-fade-animation): blur-to-focus transition, shortened for the opening name.
- [Tilt 3D icon](https://60fps.design/shots/tilt-3d-app-icon-gyroscope): damped spring return and lighting, adapted to pointer movement without device-sensor permissions.
- [Air India parallax](https://60fps.design/shots/air-india-parallax-card-scroll): separate layer travel, adapted to the footer reveal.

`src/scripts/page-motion.ts` coordinates footer depth and entry reveals. Footer transforms follow actual scroll progress, so scrolling backward reverses the reveal. The original cube has been replaced by a hand-drawn window illustration. The opening caption was removed to keep the splash focused on the name. LinkedIn is an accessible icon-only link, and the footer has no promotional copy.


## Personal details

The clock uses `America/New_York` and refreshes every 15 seconds while the page is visible. The window uses local-hour bands (morning, day, evening, night), not astronomical sunrise/sunset. Hover previews the shutters; click or tap pins them open, with native keyboard button support. The photo card uses Riya’s photo from the supplied LinkedIn assets and opens on hover, focus, or tap. Escape dismisses the photo. Experience descriptions stay visible; the experimental accordion was removed.

`src/scripts/joy-motion.ts` adds pointer-following plant leaves and photo-card tilt with damped springs that stop at rest. While the shutters are open, the steam drifts slowly by just three pixels; closing the window pauses it. All three respect reduced-motion preferences, and pointer effects stay off for touch input. The photo card has an invisible hover bridge so it remains open as the pointer moves from the name onto the card.
