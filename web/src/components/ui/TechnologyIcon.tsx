import { technologySprite, technologySymbols } from '@/data/technology-icons';

export function TechnologyIcon({ name }: { name: string }) {
  const symbol = technologySymbols[name];
  if (!symbol) return null;
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <use href={technologySprite + '#' + symbol} />
    </svg>
  );
}
