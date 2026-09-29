import { checkLinks, evaluateDocument } from './checks.js';

const form = document.querySelector('#preflight-form');
const input = document.querySelector('#page-url');
const submit = form.querySelector('button[type="submit"]');
const status = document.querySelector('#preflight-status');
const results = document.querySelector('#preflight-results');

function resolvePageUrl(value) {
  const url = new URL(value.trim(), window.location.origin);
  if (!['http:', 'https:'].includes(url.protocol) || url.origin !== window.location.origin) {
    throw new Error('Enter a path or URL on this site.');
  }
  if (url.username || url.password) {
    throw new Error('URLs containing credentials are not allowed.');
  }
  return url;
}

function renderItem(item) {
  const row = document.createElement('li');
  row.className = 'result-item';
  row.dataset.state = item.state;

  const message = document.createElement('span');
  message.textContent = item.message;
  const label = document.createElement('span');
  label.className = 'result-label';
  label.textContent = item.state;

  row.append(message, label);
  return row;
}

function renderGroup(group) {
  const section = document.createElement('section');
  section.className = 'result-group';
  const heading = document.createElement('h2');
  heading.textContent = group.title;
  const list = document.createElement('ul');
  list.className = 'result-list';
  group.items.forEach((item) => list.append(renderItem(item)));
  section.append(heading, list);
  return section;
}

function renderSummary(groups) {
  const counts = groups.flatMap((group) => group.items)
    .reduce((total, item) => {
      if (item.state === 'error') total.errors += 1;
      if (item.state === 'warning') total.warnings += 1;
      if (item.state === 'success') total.passed += 1;
      return total;
    }, { errors: 0, warnings: 0, passed: 0 });

  const summary = document.createElement('div');
  summary.className = 'summary';
  [
    { label: 'Passed', value: counts.passed, state: 'success' },
    { label: 'Warnings', value: counts.warnings, state: 'warning' },
    { label: 'Issues', value: counts.errors, state: 'error' },
  ].forEach((item) => {
    const card = document.createElement('div');
    card.className = 'summary-card';
    card.dataset.state = item.state;
    const value = document.createElement('strong');
    value.textContent = String(item.value);
    const label = document.createElement('span');
    label.textContent = item.label;
    card.append(value, label);
    summary.append(card);
  });
  return summary;
}

async function runPreflight(event) {
  event.preventDefault();
  results.hidden = true;
  results.replaceChildren();
  status.dataset.state = '';
  status.textContent = 'Fetching page and running checks…';
  submit.disabled = true;

  try {
    const pageUrl = resolvePageUrl(input.value);
    const response = await fetch(pageUrl.href, { headers: { Accept: 'text/html' } });
    if (!response.ok) throw new Error(`The page returned ${response.status}.`);

    const source = await response.text();
    const doc = new DOMParser().parseFromString(source, 'text/html');
    const groups = evaluateDocument(doc);
    groups.push(await checkLinks(doc, pageUrl));

    const heading = document.createElement('p');
    heading.className = 'status';
    heading.textContent = `Results for ${pageUrl.pathname}`;
    results.append(heading, renderSummary(groups), ...groups.map(renderGroup));
    results.hidden = false;
    status.textContent = 'Checks complete.';
  } catch (error) {
    status.dataset.state = 'error';
    status.textContent = error instanceof TypeError
      ? 'The page could not be fetched. Check the path and try again.'
      : error.message;
  } finally {
    submit.disabled = false;
  }
}

form.addEventListener('submit', runPreflight);
