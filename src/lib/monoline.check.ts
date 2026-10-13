// pnpm test: the source gutter plugin on a small document. Fails loudly, no framework.
import assert from 'node:assert/strict';
import { markdownToHtml, mdxToJs, type MarkdownToHtmlResult } from 'satteri';
import { sourceGutter } from './monoline-plugin.ts';

const doc = `Plain paragraph.[^why]

## Heading

### Smaller

> Quoted.

* star bullet
  1. nested ordered

3. third
4. fourth

---

\`\`\`js
let a;
\`\`\`

Second reference.[^a]

| a | b |
| - | - |
| 1 | 2 |

[^a]: Defined first, referenced second.
[^why]: Referenced first.
`;
const html = (markdownToHtml(doc, { hastPlugins: [sourceGutter] }) as MarkdownToHtmlResult).html;

// Paragraphs carry nothing; every structural block carries its source.
assert.match(html, /<p>Plain paragraph/);
assert.match(html, /<h2 data-md="##">/);
assert.match(html, /<h3 data-md="###">/);
assert.match(html, /<blockquote data-md=">">/);
assert.match(html, /<hr data-md="---">/);
assert.match(html, /<pre data-md="&#x60;&#x60;&#x60;">/);
// Any bullet reads as `-`; ordered items keep their real number, nested ones too.
assert.match(html, /<li data-md="-">star bullet/);
assert.match(html, /<li data-md="1.">nested ordered/);
assert.match(html, /<li data-md="3.">third<\/li>\s*<li data-md="4.">fourth/);
// Footnotes by the number the reader sees, in reference order, not by label.
assert.match(html, /<li id="user-content-fn-why" data-md="\[\^1\]">/);
assert.match(html, /<li id="user-content-fn-a" data-md="\[\^2\]">/);
assert.match(html, /<h2 class="sr-only" id="footnote-label">/);
// Tables scroll in a wrapper and stay tables.
assert.match(html, /<div class="table-scroll"><table>/);

// MDX notes go through the same plugin.
const mdx = String((await mdxToJs(doc, { hastPlugins: [sourceGutter] })).code);
assert.match(mdx, /"data-md": "##"/);

console.log('monoline: ok');

// Text helpers.
const { countWords, excerpt, isoDate } = await import('./text.ts');
assert.equal(countWords('Two words.\n\n```\nnot these\n```\n\n[link](/x) here[^1]\n'), 4);
assert.equal(isoDate(new Date('2026-09-02')), '2026-09-02');
assert.equal(
  excerpt('## Heading\n\n- list\n\nThe *first* [real](/x) paragraph.[^1]\n\nSecond.'),
  'The first real paragraph.',
);
assert.match(excerpt('word '.repeat(60), 40), /^(word ){6}word…$/);
console.log('text: ok');
