import { Bottle } from './types';

export type AgingStatus = 'too_young' | 'ready' | 'peak' | 'past';

export interface AgingInfo {
  status: AgingStatus;
  label: string;
  sublabel: string;
  color: string;
  bgColor: string;
  drinkFrom: number;
  drinkUntil: number;
}

function estimateWindow(bottle: Bottle): { from: number; until: number } | null {
  const vintage = bottle.vintage;
  if (!vintage) return null;

  const type = bottle.type;
  const combined = `${bottle.name} ${bottle.domain} ${bottle.region ?? ''}`.toLowerCase();

  const isGrandCru = /grand.?cru|premier.?cru|1er.?cru|grand.?vin|gran.?reserva|reserva|riserva|barolo|brunello|amarone|petrus|romanée|montrachet|haut.?brion|margaux|latour|lafite/.test(combined);

  const regionLow = (bottle.region ?? '').toLowerCase();

  // Rosé
  if (type === 'Rosé') return { from: vintage, until: vintage + 3 };

  // Pétillant / Champagne
  if (type === 'Pétillant' || type === 'Champagne') {
    return isGrandCru
      ? { from: vintage + 3, until: vintage + 12 }
      : { from: vintage + 1, until: vintage + 7 };
  }

  // Blanc
  if (type === 'Blanc') {
    if (/bourgogne|burgundy|chablis|meursault|puligny|chassagne|montrachet/.test(regionLow + combined)) {
      return isGrandCru ? { from: vintage + 5, until: vintage + 20 } : { from: vintage + 3, until: vintage + 12 };
    }
    if (/alsace/.test(regionLow)) return { from: vintage + 3, until: vintage + 15 };
    if (/loire|vouvray|chenin|sancerre|pouilly/.test(regionLow + combined)) return { from: vintage + 2, until: vintage + 10 };
    if (/rhône|rhone|roussillon/.test(regionLow)) return { from: vintage + 2, until: vintage + 8 };
    return { from: vintage + 1, until: vintage + 5 };
  }

  // Rouge
  if (type === 'Rouge') {
    if (/bordeaux|médoc|pomerol|saint.?émilion|graves/.test(regionLow + combined)) {
      return isGrandCru ? { from: vintage + 8, until: vintage + 30 } : { from: vintage + 5, until: vintage + 20 };
    }
    if (/bourgogne|burgundy|pinot.?noir|gevrey|chambolle|vosne|nuits/.test(regionLow + combined)) {
      return isGrandCru ? { from: vintage + 5, until: vintage + 25 } : { from: vintage + 3, until: vintage + 15 };
    }
    if (/rhône|rhone|hermitage|châteauneuf|grenache|syrah/.test(regionLow + combined)) {
      return isGrandCru ? { from: vintage + 6, until: vintage + 25 } : { from: vintage + 3, until: vintage + 15 };
    }
    if (/beaujolais|gamay/.test(regionLow + combined)) return { from: vintage, until: vintage + 4 };
    if (/toscane|tuscany|italie|italy|barolo|brunello|amarone|chianti/.test(regionLow + combined)) {
      return isGrandCru ? { from: vintage + 8, until: vintage + 25 } : { from: vintage + 3, until: vintage + 12 };
    }
    if (/espagne|spain|rioja|ribera|priorat/.test(regionLow + combined)) {
      return isGrandCru ? { from: vintage + 5, until: vintage + 20 } : { from: vintage + 3, until: vintage + 12 };
    }
    if (/languedoc|provence|roussillon/.test(regionLow)) return { from: vintage + 1, until: vintage + 6 };
    // Rouge générique
    return isGrandCru ? { from: vintage + 5, until: vintage + 20 } : { from: vintage + 2, until: vintage + 10 };
  }

  // Dessert / Moelleux / Liquoreux
  if (/dessert|moelleux|liquoreux|sauternes|barsac|jurançon/.test(type.toLowerCase() + combined)) {
    return { from: vintage + 3, until: vintage + 30 };
  }

  return { from: vintage + 1, until: vintage + 7 };
}

export function getAgingInfo(bottle: Bottle): AgingInfo | null {
  const window = estimateWindow(bottle);
  if (!window) return null;

  const { from, until } = window;
  const now = new Date().getFullYear();
  const peakStart = Math.round(from + (until - from) * 0.65);

  let status: AgingStatus;
  if (now < from) status = 'too_young';
  else if (now >= from && now < peakStart) status = 'ready';
  else if (now >= peakStart && now <= until) status = 'peak';
  else status = 'past';

  const yearsLeft = from - now;
  const yearsOver = now - until;

  const map: Record<AgingStatus, { label: string; sublabel: string; color: string; bgColor: string }> = {
    too_young: {
      label: 'Trop jeune',
      sublabel: yearsLeft === 1 ? 'Encore 1 an de patience' : `Encore ${yearsLeft} ans de patience`,
      color: '#3B82F6',
      bgColor: '#EFF6FF',
    },
    ready: {
      label: 'Prêt à boire',
      sublabel: `Fenêtre idéale : ${from} – ${until}`,
      color: '#16A34A',
      bgColor: '#F0FDF4',
    },
    peak: {
      label: 'À son apogée',
      sublabel: `À boire avant ${until}`,
      color: '#D97706',
      bgColor: '#FFFBEB',
    },
    past: {
      label: 'Passé son apogée',
      sublabel: yearsOver === 1 ? 'Depuis 1 an' : `Depuis ${yearsOver} ans`,
      color: '#DC2626',
      bgColor: '#FEF2F2',
    },
  };

  return { status, drinkFrom: from, drinkUntil: until, ...map[status] };
}
