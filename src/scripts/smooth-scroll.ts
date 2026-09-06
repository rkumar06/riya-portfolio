import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

const preference = matchMedia('(prefers-reduced-motion: reduce)');
let scroll: Lenis | undefined;
function configure() {
  scroll?.destroy();
  scroll = undefined;
  if (!preference.matches) {
    scroll = new Lenis({ autoRaf: true, lerp: 0.12, smoothWheel: true, syncTouch: false });
  }
}
configure();
preference.addEventListener('change', configure);
// Native keyboard anchor behavior stays immediate; pointer navigation eases home.
document.querySelector<HTMLAnchorElement>('.footer-bottom a')?.addEventListener('click', event => {
  if (event.detail === 0 || !scroll) return;
  event.preventDefault();
  scroll.scrollTo(0, { onComplete: () => {
    history.replaceState(null, '', '#top');
    const main = document.querySelector<HTMLElement>('main');
    main?.focus({ preventScroll: true });
  }});
});
window.addEventListener('pagehide', () => { scroll?.destroy(); scroll = undefined; });
window.addEventListener('pageshow', event => { if (event.persisted) configure(); });
