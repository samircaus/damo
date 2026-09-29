const result = (state, message) => ({ state, message });

export function evaluateDocument(doc) {
  const results = [
    {
      title: 'Content',
      items: [],
    },
    {
      title: 'SEO',
      items: [],
    },
  ];
  const [content, seo] = results;
  const headings = doc.querySelectorAll('h1');

  if (headings.length === 0) {
    content.items.push(result('error', 'No H1 heading found.'));
  } else if (headings.length === 1) {
    content.items.push(result('success', 'Exactly one H1 heading found.'));
  } else {
    content.items.push(result('warning', `Found ${headings.length} H1 headings; pages usually work best with one.`));
  }

  const text = doc.body?.textContent?.toLowerCase() ?? '';
  if (/\b(lorem ipsum|dolor sit amet)\b/.test(text)) {
    content.items.push(result('error', 'Placeholder text such as “lorem ipsum” appears in the page.'));
  } else {
    content.items.push(result('success', 'No common placeholder text found.'));
  }

  const title = doc.querySelector('title')?.textContent?.trim();
  if (title) {
    seo.items.push(result('success', `Page title found: ${title}`));
  } else {
    seo.items.push(result('error', 'No page title found.'));
  }

  const description = doc.querySelector('meta[name="description"]')?.getAttribute('content')?.trim();
  if (description) {
    seo.items.push(result('success', 'Meta description found.'));
  } else {
    seo.items.push(result('warning', 'Meta description not found.'));
  }

  const images = [...doc.querySelectorAll('img')];
  const missingAlt = images.filter((image) => !image.hasAttribute('alt'));
  if (images.length === 0) {
    seo.items.push(result('info', 'No images found.'));
  } else if (missingAlt.length === 0) {
    seo.items.push(result('success', `All ${images.length} image${images.length === 1 ? '' : 's'} have alt attributes.`));
  } else {
    seo.items.push(result('warning', `${missingAlt.length} of ${images.length} image(s) are missing alt attributes.`));
  }

  return results;
}

export async function checkLinks(doc, pageUrl, limit = 20) {
  const seen = new Set();
  const internal = [];
  let externalCount = 0;

  [...doc.querySelectorAll('a[href]')].forEach((anchor) => {
    const href = anchor.getAttribute('href')?.trim();
    if (!href || href.startsWith('#')) return;

    let url;
    try {
      url = new URL(href, pageUrl);
    } catch {
      return;
    }

    if (!['http:', 'https:'].includes(url.protocol)) return;
    if (url.origin !== pageUrl.origin) {
      externalCount += 1;
      return;
    }
    if (seen.has(url.href)) return;
    seen.add(url.href);
    internal.push(url);
  });

  const sampled = internal.slice(0, limit);
  const items = await Promise.all(sampled.map(async (url) => {
    try {
      const response = await fetch(url.href, { method: 'HEAD', redirect: 'follow' });
      if (response.ok) return result('success', `Link responds ${response.status}: ${url.pathname}`);
      if (response.status === 405) return result('info', `Link found; server does not support HEAD: ${url.pathname}`);
      return result('error', `Link responds ${response.status}: ${url.pathname}`);
    } catch {
      return result('warning', `Could not verify link: ${url.pathname}`);
    }
  }));

  if (!internal.length) items.push(result('info', 'No same-site links found to check.'));
  if (internal.length > sampled.length) {
    items.push(result('info', `Checked ${sampled.length} of ${internal.length} same-site links.`));
  }
  if (externalCount) {
    items.push(result('info', `${externalCount} external link(s) were not checked.`));
  }

  return { title: 'Links', items };
}
