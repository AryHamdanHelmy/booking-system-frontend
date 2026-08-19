import { Flower2, Footprints, Hand, Leaf, Sparkles, Waves } from 'lucide-react';

/**
 * Ikon dipilih dari kata kunci pada nama layanan, bukan dari id —
 * karena nama layanan bisa diubah admin lewat menu Pengaturan.
 */
const RULES = [
  { match: /kaki|refleksi|foot/i,        icon: Footprints },
  { match: /body|badan|full/i,           icon: Waves },
  { match: /aroma|terapi|essential/i,    icon: Leaf },
  { match: /bekam|cupping/i,             icon: Sparkles },
  { match: /kepala|head|punggung|back/i, icon: Hand },
];

export function serviceIcon(name = '') {
  return RULES.find((rule) => rule.match.test(name))?.icon ?? Flower2;
}