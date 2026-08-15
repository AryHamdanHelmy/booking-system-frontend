import { toDateParam } from './formatTime';

function shiftDays(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

function startOfMonth(offsetMonth = 0) {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() + offsetMonth);
  return d;
}

function endOfMonth(offsetMonth = 0) {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() + offsetMonth + 1);
  d.setDate(0);
  return d;
}

/** Rentang siap pakai untuk filter laporan. */
export const DATE_PRESETS = [
  {
    key: 'today',
    label: 'Hari ini',
    build: () => ({ from: toDateParam(), to: toDateParam() }),
  },
  {
    key: 'week',
    label: '7 hari',
    build: () => ({ from: toDateParam(shiftDays(-6)), to: toDateParam() }),
  },
  {
    key: 'month',
    label: 'Bulan ini',
    build: () => ({ from: toDateParam(startOfMonth()), to: toDateParam() }),
  },
  {
    key: 'last_month',
    label: 'Bulan lalu',
    build: () => ({
      from: toDateParam(startOfMonth(-1)),
      to: toDateParam(endOfMonth(-1)),
    }),
  },
];

export const DEFAULT_PRESET = 'month';

export function buildPreset(key) {
  const preset = DATE_PRESETS.find((p) => p.key === key) ?? DATE_PRESETS[2];
  return preset.build();
}