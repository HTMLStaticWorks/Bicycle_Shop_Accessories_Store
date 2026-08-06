/**
 * CycleNest - Catalogue category filtering
 *
 * The filter pills are ordinary links (bicycles.html?category=road), so each
 * category is a real URL: shareable, bookmarkable, and reachable with the Back
 * button. This script runs on arrival, reads ?category, and hides the cards
 * that don't belong. Without JS the page still loads with every card visible,
 * which is the honest fallback for a static site.
 */

document.addEventListener('DOMContentLoaded', () => {
  const bar = document.querySelector('[data-filter-bar]');
  const grid = document.querySelector('[data-filter-grid]');
  if (!bar || !grid) return;

  const links = Array.from(bar.querySelectorAll('[data-filter]'));
  const cards = Array.from(grid.querySelectorAll('[data-category]'));
  const empty = document.querySelector('[data-filter-empty]');

  const requested = (new URLSearchParams(window.location.search).get('category') || 'all').toLowerCase();
  // An unknown or hand-edited ?category falls back to the full listing rather
  // than leaving the visitor staring at an empty grid.
  const active = links.some(link => link.dataset.filter === requested) ? requested : 'all';

  let shown = 0;
  cards.forEach(card => {
    const match = active === 'all' || card.dataset.category === active;
    card.hidden = !match;
    if (match) shown += 1;
  });

  links.forEach(link => {
    const on = link.dataset.filter === active;
    link.classList.toggle('btn-primary', on);
    link.classList.toggle('btn-outline', !on);
    if (on) {
      link.setAttribute('aria-current', 'true');
    } else {
      link.removeAttribute('aria-current');
    }
  });

  if (empty) empty.hidden = shown > 0;
});
