import { expect } from '@esm-bundle/chai';
import { checkLinks, evaluateDocument } from '../../tools/preflight/checks.js';

describe('Page Preflight checks', () => {
  const parse = (source) => new DOMParser().parseFromString(source, 'text/html');

  it('reports a well-formed page without placeholder text', () => {
    const doc = parse(`
      <html>
        <head>
          <title>Demo page</title>
          <meta name="description" content="A useful description">
        </head>
        <body>
          <h1>Welcome</h1>
          <img src="/image.png" alt="A demo">
        </body>
      </html>
    `);
    const groups = evaluateDocument(doc);

    expect(groups[0].items[0].state).to.equal('success');
    expect(groups[0].items[1].state).to.equal('success');
    expect(groups[1].items.every((item) => item.state === 'success')).to.be.true;
  });

  it('flags missing headings, title, description, image alt, and placeholder text', () => {
    const doc = parse(`
      <html>
        <body>
          <p>Lorem ipsum dolor sit amet</p>
          <img src="/image.png">
        </body>
      </html>
    `);
    const groups = evaluateDocument(doc);

    expect(groups[0].items.map((item) => item.state)).to.deep.equal(['error', 'error']);
    expect(groups[1].items.map((item) => item.state)).to.deep.equal(['error', 'warning', 'warning']);
  });

  it('warns when a page has multiple H1 headings', () => {
    const doc = parse('<h1>First</h1><h1>Second</h1>');
    const groups = evaluateDocument(doc);

    expect(groups[0].items[0].state).to.equal('warning');
  });

  it('checks same-site links without requesting external URLs', async () => {
    const doc = parse(`
      <a href="/en/about">About</a>
      <a href="/en/about">About again</a>
      <a href="https://outside.example/page">External</a>
      <a href="mailto:hello@example.com">Email</a>
    `);
    const originalFetch = window.fetch;
    let requests = 0;
    window.fetch = async () => {
      requests += 1;
      return { ok: true, status: 200 };
    };

    try {
      const group = await checkLinks(doc, new URL('https://damo.example/'));

      expect(requests).to.equal(1);
      expect(group.items[0].state).to.equal('success');
      expect(group.items[1].message).to.equal('1 external link(s) were not checked.');
    } finally {
      window.fetch = originalFetch;
    }
  });
});
