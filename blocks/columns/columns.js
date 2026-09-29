function decorateCover(col) {
  const children = [...col.children];
  if (children.length === 1 && children[0].nodeName === 'PICTURE') {
    col.classList.add('cover-image');
    col.parentElement.classList.add('cover-row');
  } else {
    col.classList.add('cover-content');
  }
}

// "01 — Browse" style headings become numbered steps.
const STEP_PATTERN = /^(\d{1,3})\s+[—–-]\s+(.+)$/;
// Headings that lead with a figure ("4.2 Million", "98.3%") become stats.
const STAT_PATTERN = /^[\d$€£]/;

function decorateText(col) {
  if (col.querySelector('picture')) return null;
  const heading = col.querySelector(':scope > :is(h2, h3, h4, h5, h6):first-child');
  if (!heading) return null;
  const text = heading.textContent.trim();
  const step = text.match(STEP_PATTERN);
  if (step) {
    const [, number, title] = step;
    const num = document.createElement('span');
    num.className = 'col-step-number';
    num.setAttribute('aria-hidden', 'true');
    num.textContent = number;
    const label = document.createElement('span');
    label.className = 'col-sr-only';
    label.textContent = `Step ${number}: `;
    heading.replaceChildren(label, title);
    col.prepend(num);
    col.classList.add('col-step');
    return 'steps';
  }
  if (STAT_PATTERN.test(text)) {
    col.classList.add('col-stat');
    return 'stats';
  }
  col.classList.add('col-text');
  return 'text';
}

function decorateCols(el, cols) {
  const hasCover = el.classList.contains('image-cover');
  const kinds = new Set();
  for (const [idx, col] of cols.entries()) {
    col.classList.add('col', `col-${idx + 1}`);
    if (hasCover) decorateCover(col);
    else kinds.add(decorateText(col));
  }
  // Only flag the block when every column follows the same text pattern.
  if (kinds.size === 1 && !kinds.has(null)) el.classList.add(`columns-${[...kinds][0]}`);
}

function decorateRows(el, rows) {
  for (const [idx, row] of rows.entries()) {
    row.classList.add('row', `row-${idx + 1}`);
    const cols = [...row.children];
    row.style = `--child-count: ${cols.length}`;
    decorateCols(el, cols);
  }
}

export default function init(el) {
  const rows = [...el.children];
  decorateRows(el, rows);
}
