import { createPicture } from '../../scripts/utils/picture.js';

const CARD_BREAKPOINTS = [
  { media: '(min-width: 1200px)', width: '450' },
  { media: '(min-width: 600px)', width: '600' },
  { width: '600' },
];

// "Label: value" paragraphs (e.g. "Status: Available", "Estimated Delivery: ...")
const META_PATTERN = /^([A-Z][\w ]{0,30}?):\s+(.+)$/s;

const slugify = (text) => text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function isCtaParagraph(p) {
  const links = p.querySelectorAll('a');
  if (links.length !== 1) return false;
  return p.textContent.trim() === links[0].textContent.trim();
}

function decoratePicture(card, body) {
  const pic = body.querySelector('picture');
  if (!pic) return;
  const img = pic.querySelector('img');
  const picture = img
    ? createPicture({ src: img.src, alt: img.alt, breakpoints: CARD_BREAKPOINTS })
    : pic;
  const wrapper = document.createElement('div');
  wrapper.className = 'cards-card-image';
  wrapper.append(picture);
  (pic.closest('p') || pic).remove();
  card.prepend(wrapper);
}

function decorateMeta(p) {
  if (p.querySelector('a, picture')) return;
  const match = p.textContent.trim().match(META_PATTERN);
  if (!match) return;
  const [, label, value] = match;
  const key = slugify(label);

  if (key === 'status') {
    p.className = 'cards-card-status';
    p.dataset.status = slugify(value);
    const sr = document.createElement('span');
    sr.className = 'cards-sr-only';
    sr.textContent = `${label}: `;
    p.replaceChildren(sr, value);
    return;
  }

  if (key === 'note') {
    p.className = 'cards-card-note';
    return;
  }

  p.className = 'cards-card-meta';
  const labelEl = document.createElement('span');
  labelEl.className = 'cards-card-meta-label';
  labelEl.textContent = label;
  const valueEl = document.createElement('span');
  valueEl.className = 'cards-card-meta-value';
  valueEl.textContent = value;
  p.replaceChildren(labelEl, valueEl);
}

function groupMeta(body) {
  let group;
  [...body.children].forEach((child) => {
    if (!child.classList.contains('cards-card-meta')) {
      group = null;
      return;
    }
    if (!group) {
      group = document.createElement('div');
      group.className = 'cards-card-meta-group';
      child.before(group);
    }
    group.append(child);
  });
}

function decorateCard(row) {
  row.classList.add('cards-card');
  const cells = [...row.children];
  const body = cells.pop();
  if (!body) return;
  body.classList.add('cards-card-body');
  // Fold any leading cells (e.g. an image column) into the body.
  cells.reverse().forEach((cell) => {
    body.prepend(...cell.childNodes);
    cell.remove();
  });

  decoratePicture(row, body);

  body.querySelector('h1, h2, h3, h4, h5, h6')?.classList.add('cards-card-title');

  const paragraphs = [...body.querySelectorAll(':scope > p')];
  const cta = paragraphs.findLast(isCtaParagraph);
  paragraphs.forEach((p) => {
    if (p === cta) return;
    const strong = p.querySelector(':scope > strong');
    if (strong && p.textContent.trim() === strong.textContent.trim()) {
      p.className = 'cards-card-subtitle';
      return;
    }
    decorateMeta(p);
  });

  groupMeta(body);

  if (cta) {
    cta.classList.add('cards-card-cta');
    const link = cta.querySelector('a');
    if (!link.classList.contains('btn')) link.classList.add('cards-card-link');
    body.append(cta);
  }
}

export default function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];
  rows.forEach(decorateCard);
  el.style.setProperty('--cards-count', rows.length);
}
