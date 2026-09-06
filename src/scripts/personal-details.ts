const clock = document.querySelector<HTMLTimeElement>('.local-time');
const hourFormat = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: 'numeric', second: 'numeric', hourCycle: 'h23' });
const clockFormat = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit' });
function updateTime() {
  const now = new Date();
  const parts = hourFormat.formatToParts(now);
  const read = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find(part => part.type === type)?.value ?? 0);
  const hour = read('hour'), minute = read('minute'), second = read('second');
  document.documentElement.dataset.daypart = hour >= 20 || hour < 6 ? 'night' : hour >= 17 ? 'evening' : hour < 8 ? 'morning' : 'day';
  if (clock) {
    const label = `${clockFormat.format(now)} in New York`;
    clock.querySelector('.clock-hour')?.setAttribute('transform', `rotate(${(hour % 12) * 30 + minute / 2} 16 16)`);
    clock.querySelector('.clock-minute')?.setAttribute('transform', `rotate(${minute * 6 + second / 10} 16 16)`);
    clock.querySelector('.clock-second')?.setAttribute('transform', `rotate(${second * 6} 16 16)`);
    clock.setAttribute('aria-label', label);
    clock.dateTime = now.toISOString();
    clock.title = label;
    clock.hidden = false;
  }
}
updateTime();
setInterval(() => { if (!document.hidden) updateTime(); }, 1000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) updateTime(); });

const windowButton = document.querySelector<HTMLButtonElement>('.window-scene');
windowButton?.addEventListener('click', () => {
  const open = windowButton.getAttribute('aria-pressed') !== 'true';
  windowButton.setAttribute('aria-pressed', String(open));
  windowButton.title = open ? 'Close the shutters' : 'Open the shutters';
});
windowButton?.addEventListener('keydown', event => {
  if (event.key === 'Escape') { windowButton.setAttribute('aria-pressed', 'false'); windowButton.title = 'Open the shutters'; }
});

const photo = document.querySelector<HTMLButtonElement>('.photo-trigger');
function setPhoto(open: boolean) {
  photo?.setAttribute('aria-expanded', String(open));
  photo?.setAttribute('aria-label', open ? 'Riya Kumar — hide photo' : 'Riya Kumar — show photo');
}
photo?.addEventListener('click', () => {
  photo.classList.remove('is-dismissed');
  setPhoto(photo.getAttribute('aria-expanded') !== 'true');
});
photo?.addEventListener('pointerenter', () => photo.classList.remove('is-dismissed'));
photo?.addEventListener('focus', () => photo.classList.remove('is-dismissed'));
photo?.addEventListener('keydown', event => {
  if (event.key === 'Escape') { setPhoto(false); photo.classList.add('is-dismissed'); }
});
document.addEventListener('pointerdown', event => {
  if (photo && event.target instanceof Node && !photo.contains(event.target)) setPhoto(false);
});
