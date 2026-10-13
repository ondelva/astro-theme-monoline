// The source gutter, build side: a Sätteri hast plugin that writes onto each block the Markdown
// that made it, as data-md. src/styles/monoline.css draws it. Paragraphs get nothing: a line
// with a marker is structure, a line without one is prose.
//
// Lists are marked `-` whatever bullet the source used (`*`, `+`), ordered items by their real
// number (a list may start at 3). Footnotes are marked by the number the reader sees, not
// their label, so `[^why]` shows as `[^1]`. monoline.gutter in src/config.ts hides the markers
// in CSS (.no-gutter); the attributes stay.
import type { SatteriProcessorOptions } from '@astrojs/markdown-satteri';

type Entry = NonNullable<SatteriProcessorOptions['hastPlugins']>[number];
type Plugin = Extract<Entry, { name: string }>;
type El = { type: string; tagName?: string; properties?: Record<string, unknown> };
type Parent = El & { children?: El[] };

const FIXED: Record<string, string> = {
  h2: '##',
  h3: '###',
  h4: '####',
  h5: '#####',
  h6: '######',
  blockquote: '>',
  hr: '---',
  pre: '```',
};

/** The marker for one element, or null. Exported for the check script. */
export const markerFor = (el: El, at: number, parent?: Parent, grandparent?: El): string | null => {
  const tag = el.tagName ?? '';
  // The footnotes' own heading is screen-reader only.
  if (el.properties?.id === 'footnote-label') return null;
  if (tag !== 'li') return FIXED[tag] ?? null;
  if (parent?.tagName === 'ul') return '-';
  // Position among element siblings: the hast keeps the newlines between items as text nodes.
  const n = (parent?.children ?? []).slice(0, at + 1).filter((k) => k.type === 'element').length;
  const classes = grandparent?.properties?.className;
  if (Array.isArray(classes) && classes.includes('footnotes')) return `[^${n}]`;
  return `${Number(parent?.properties?.start ?? 1) + n - 1}.`;
};

export const sourceGutter: Plugin = {
  name: 'monoline-source-gutter',
  element: {
    filter: ['h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'hr', 'pre', 'li', 'table'],
    visit(node, ctx) {
      // A wide table scrolls in a wrapper: `display: block` on the table itself would cost it its
      // table semantics in WebKit's screen reader.
      if ((node as El).tagName === 'table') {
        const wrap = {
          type: 'element',
          tagName: 'div',
          properties: { className: ['table-scroll'] },
        };
        ctx.wrapNode(node, { ...wrap, children: [] } as never);
        return;
      }
      const parent = ctx.parent(node) as Parent | undefined;
      const grandparent = parent && (ctx.parent(parent as never) as El | undefined);
      const md = markerFor(node as El, ctx.indexOf(node) ?? 0, parent, grandparent);
      if (md) ctx.setProperty(node, 'dataMd', md);
    },
  },
};
