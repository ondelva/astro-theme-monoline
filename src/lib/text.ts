// Pure helpers, no astro: imports, so src/lib/monoline.check.ts can run them under plain node.

const WORDS_PER_MINUTE = 230;

/** Words a reader reads: code, HTML comments, images, link targets and footnote labels are not counted. */
export const countWords = (markdown: string): number =>
  markdown
    .replace(/^(```|~~~)[^]*?^\1/gm, ' ')
    .replace(/<!--[^]*?-->/g, ' ')
    .replace(/!\[[^\]]*\](\([^)]*\)|\[[^\]]*\])/g, ' ')
    .replace(/\]\([^)]*\)/g, ']')
    .replace(/\[\^[^\]]+\]:?/g, ' ')
    .split(/\s+/)
    .filter((token) => /\p{L}|\p{N}/u.test(token)).length;

export const readingMinutes = (words: number): number =>
  Math.max(1, Math.round(words / WORDS_PER_MINUTE));

/** "2026-09-02". toISOString is UTC, so the date never shifts a day for readers west of Greenwich. */
export const isoDate = (date: Date): string => date.toISOString().slice(0, 10);

/** The first prose paragraph as plain text, cut at a word near `max` characters. */
export const excerpt = (markdown: string, max = 160): string => {
  const para =
    markdown
      .replace(/^(```|~~~)[^]*?^\1/gm, '')
      .split(/\n\s*\n/)
      .map((block) => block.trim())
      .find((block) => block && !/^([#>*+|<-]|\d+[.)]\s|\[\^|import\s|export\s)/.test(block)) ?? '';
  const text = para
    .replace(/\[\^[^\]]+\]/g, '')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > max ? `${text.slice(0, max - 1).replace(/\s+\S*$/, '')}…` : text;
};
