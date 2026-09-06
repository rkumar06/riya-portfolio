/** Editorial reveals and scroll-linked depth, inspired by the 60fps references in README. */
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const paper = document.querySelector<HTMLElement>('.paper');
const footer = document.querySelector<HTMLElement>('.footer');
const items = document.querySelectorAll<HTMLElement>('.scroll-item');
let observer: IntersectionObserver | undefined;
let frame = 0;

function updateFooter() {
  frame = 0;
  if (!paper || !footer) return;
  const reveal = reduced.matches || getComputedStyle(footer).position !== 'sticky'
    ? 1
    : Math.max(0, Math.min(1, (innerHeight - paper.getBoundingClientRect().bottom) / footer.offsetHeight));
  footer.style.setProperty('--reveal', String(reveal));
}
function scheduleFooter() {
  if (!frame) frame = requestAnimationFrame(updateFooter);
}
function configure() {
  observer?.disconnect();
  items.forEach(item => item.classList.remove('motion-ready'));
  if (!reduced.matches && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver(entries => {
      // Items entering together get a small stagger, capped for fast scrolling.
      entries.filter(entry => entry.isIntersecting).forEach((entry, index) => {
        const item = entry.target as HTMLElement;
        item.style.setProperty('--entry-delay', `${Math.min(index, 2) * 55}ms`);
        item.classList.add('is-visible');
        observer?.unobserve(item);
      });
    }, { threshold: 0.06 });
    items.forEach(item => {
      if (item.getBoundingClientRect().top >= innerHeight && !item.classList.contains('is-visible')) {
        item.classList.add('motion-ready');
        observer?.observe(item);
      }
    });
  }
  scheduleFooter();
}
configure();
addEventListener('scroll', scheduleFooter, { passive: true });
addEventListener('resize', scheduleFooter, { passive: true });
reduced.addEventListener('change', configure);
if (paper && footer) {
  const resize = new ResizeObserver(scheduleFooter);
  resize.observe(paper);
  resize.observe(footer);
}
// Keyboard access should show the entire focused layer, regardless of scroll progress.
footer?.addEventListener('focusin', scheduleFooter);
footer?.addEventListener('focusout', scheduleFooter);
