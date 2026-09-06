const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const pointerPreference = matchMedia('(hover: hover) and (pointer: fine)');
const canFollow = () => !motionPreference.matches && pointerPreference.matches;

/** A small damped spring, asleep whenever its target has settled. */
function spring(paint: (x: number, y: number) => void) {
  let x = 0, y = 0, vx = 0, vy = 0, tx = 0, ty = 0, frame = 0, previous = 0;
  const tick = (time: number) => {
    const elapsed = previous ? Math.min(time - previous, 32) : 16;
    previous = time;
    const steps = Math.ceil(elapsed / 8), dt = elapsed / steps / 1000;
    for (let i = 0; i < steps; i++) {
      vx += ((tx - x) * 170 - vx * 21) * dt;
      vy += ((ty - y) * 170 - vy * 21) * dt;
      x += vx * dt; y += vy * dt;
    }
    paint(x, y);
    if (Math.abs(tx-x) + Math.abs(ty-y) + Math.abs(vx) + Math.abs(vy) > .002) {
      frame = requestAnimationFrame(tick);
    } else { frame = 0; previous = 0; x = tx; y = ty; vx = vy = 0; paint(x, y); }
  };
  const reset = () => {
    cancelAnimationFrame(frame); frame = previous = x = y = vx = vy = tx = ty = 0;
    paint(0, 0);
  };
  motionPreference.addEventListener('change', reset);
  pointerPreference.addEventListener('change', reset);
  document.addEventListener('visibilitychange', () => { if (document.hidden) reset(); });
  return (nextX: number, nextY: number) => {
    if (!canFollow()) { reset(); return; }
    tx = nextX; ty = nextY;
    if (!frame) frame = requestAnimationFrame(tick);
  };
}
function normalizedPointer(event: PointerEvent, element: Element) {
  const rect = element.getBoundingClientRect();
  const clamp = (n: number) => Math.max(-1, Math.min(1, n));
  return [clamp((event.clientX - rect.left) / rect.width * 2 - 1), clamp((event.clientY - rect.top) / rect.height * 2 - 1)];
}

const plant = document.querySelector<SVGSVGElement>('.intro-plant');
if (plant) {
  plant.classList.add('pointer-plant');
  const follow = spring((x, y) => {
    plant.style.setProperty('--leaf-lean', `${x * 10}deg`);
    plant.style.setProperty('--leaf-stretch', String(1 - y * .025));
  });
  document.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch' || !canFollow()) return;
    const rect = plant.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > innerHeight) { follow(0, 0); return; }
    const clamp = (value: number) => Math.max(-1, Math.min(1, value));
    const x = clamp((event.clientX - rect.left - rect.width / 2) / 240);
    const y = clamp((event.clientY - rect.top - rect.height / 2) / 280);
    follow(x, y);
  });
  document.documentElement.addEventListener('pointerleave', () => follow(0, 0));
  plant.addEventListener('pointercancel', () => follow(0, 0));
}

const card = document.querySelector<HTMLElement>('.photo-card');
if (card) {
  const tilt = spring((x, y) => {
    card.style.setProperty('--photo-yaw', `${x * 9}deg`);
    card.style.setProperty('--photo-pitch', `${-y * 8}deg`);
  });
  card.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch' || !canFollow()) return;
    const [x, y] = normalizedPointer(event, card);
    tilt(x, y);
  });
  card.addEventListener('pointerleave', () => tilt(0, 0));
  card.addEventListener('pointercancel', () => tilt(0, 0));
}


const plantButton = document.querySelector<HTMLButtonElement>('.plant-button');
plantButton?.addEventListener('click', () => {
  const colored = plantButton.getAttribute('aria-pressed') !== 'true';
  plantButton.setAttribute('aria-pressed', String(colored));
  plantButton.setAttribute('aria-label', colored ? 'Remove the plant color' : 'Color in the plant');
});
