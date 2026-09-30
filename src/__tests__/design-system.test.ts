/**
 * Every colour in this package is the host's theme's.
 *
 * Two failures, both shipped, both invisible to every other test here:
 *
 * - The build bundled `@sudobility/design`. The host configures the theme on
 *   ITS copy, so the one inside this package had none and answered with the
 *   un-themed palette — a blue Buy button in an app whose primary is red.
 * - Buttons were written as palette classes (`bg-neutral-900 text-white`,
 *   `bg-theme-primary`). A host's Tailwind generates rules for the classes it
 *   scans, so these had no background at all: white text on the page.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const SRC = join(__dirname, '..');
const sources = readdirSync(SRC)
  .filter(name => /\.tsx?$/.test(name))
  .map(name => ({ name, text: readFileSync(join(SRC, name), 'utf8') }));

/** Deliberately empty. An exemption is a decision somebody writes down. */
const ALLOWED: readonly string[] = [];

const PALETTE =
  /\b(?:bg|text|border|ring|divide)-(?:(?:blue|red|green|amber|yellow|gray|neutral|slate|zinc|stone|indigo|purple|pink|orange)-\d{2,3}|white|black(?!\/))\b/g;

describe('the design system is the only source of colour', () => {
  it('reads some sources', () => {
    expect(sources.length).toBeGreaterThan(5);
  });

  it.each(sources)('$name names no palette colour', ({ text }) => {
    const found = (text.match(PALETTE) ?? []).filter(
      cls => !ALLOWED.includes(cls)
    );
    expect(found).toEqual([]);
  });

  it.each(sources)('$name uses no theme-* class', ({ text }) => {
    // `theme-*` colours are one host's Tailwind extension, not the preset's.
    expect(text.match(/\b(?:bg|text|border)-theme-[a-z-]+/g) ?? []).toEqual([]);
  });

  it('leaves the design system to the host', () => {
    const config = readFileSync(join(SRC, '..', 'vite.config.ts'), 'utf8');
    expect(config).toContain('"@sudobility/design"');
    const pkg = JSON.parse(
      readFileSync(join(SRC, '..', 'package.json'), 'utf8')
    );
    expect(pkg.peerDependencies['@sudobility/design']).toBeDefined();
    expect(pkg.dependencies?.['@sudobility/design']).toBeUndefined();
  });
});
