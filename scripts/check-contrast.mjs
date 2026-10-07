import { readFileSync } from 'node:fs';

const tree = JSON.parse(readFileSync(new URL('../tokens/tokens.json', import.meta.url), 'utf8'));

const lookup = (path) => path.split('.').reduce((n, k) => n?.[k], tree.raw) ?? path.split('.').reduce((n, k) => n?.[k], tree.semantic);

function resolve(path) {
  const node = lookup(path);
  if (!node) throw new Error(`Missing token: ${path}`);
  const ref = /^\{(.+)\}$/.exec(node.$value);
  return ref ? resolve(ref[1]) : node.$value;
}

const channel = (v) => {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const luminance = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return 0.2126 * channel(n >> 16) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
};
const ratio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const surface = resolve('color.surface.default');
const rows = [];
const add = (label, a, b, min) => rows.push({ label, ratio: ratio(a, b), min });

for (const variant of ['primary', 'secondary', 'tertiary', 'danger']) {
  for (const state of ['default', 'hover', 'active', 'disabled']) {
    const p = (prop) => resolve(`color.button.${variant}.${prop}.${state}`);
    const bg = p('bg') === 'transparent' ? surface : p('bg');
    add(`${variant}/${state} text on bg`, p('fg'), bg, 4.5);
    // WCAG 1.4.11 exempts disabled controls, so only enabled states need a 3:1 boundary.
    if (variant !== 'tertiary' && state !== 'disabled') add(`${variant}/${state} boundary on surface`, p('border'), surface, 3);
  }
}
for (const variant of ['primary', 'secondary', 'tertiary', 'danger']) {
  for (const state of ['default', 'hover', 'active', 'disabled']) {
    const p = (prop) => resolve(`color.card.${variant}.${prop}.${state}`);
    const bg = p('bg') === 'transparent' ? surface : p('bg');
    add(`card ${variant}/${state} text on bg`, p('fg'), bg, 4.5);
    // Outlined and danger variants rely on their border to be perceived as a boundary.
    if ((variant === 'secondary' || variant === 'danger') && state !== 'disabled') add(`card ${variant}/${state} border on surface`, p('border'), surface, 3);
  }
}
add('focus ring on surface', resolve('color.focus.ring'), surface, 3);
add('text default on surface', resolve('color.text.default'), surface, 4.5);
add('text muted on surface', resolve('color.text.muted'), surface, 4.5);

let failed = 0;
for (const r of rows) {
  const ok = r.ratio >= r.min;
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${r.ratio.toFixed(2).padStart(5)}:1  (min ${r.min})  ${r.label}`);
}
console.log(failed ? `\n${failed} failing` : `\nAll ${rows.length} checks pass WCAG AA`);
process.exit(failed ? 1 : 0);
