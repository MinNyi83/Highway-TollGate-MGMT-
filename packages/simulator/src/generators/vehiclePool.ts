export interface Vehicle {
  id: string;
  plateNumber: string;
  rfidTagId: string;
  vehicleClass: 'MOTORCYCLE' | 'SEDAN' | 'SUV' | 'TRUCK' | 'BUS';
  make: string;
  model: string;
}

export interface TollPlaza {
  id: string;
  name: string;
  mileMarker: number | null;
  lanes: number;
  status: string;
}

export interface Route {
  name: string;
  plazas: string[];
  description: string;
}

export const PREDEFINED_ROUTES: Route[] = [
  {
    name: 'Full Journey',
    plazas: [],
    description: '0 Mile -> 39 Mile -> 115 Mile -> 200 Mile (complete highway)',
  },
  {
    name: 'Short Trip',
    plazas: [],
    description: '0 Mile -> 39 Mile (local commute)',
  },
  {
    name: 'Medium Trip',
    plazas: [],
    description: '0 Mile -> 115 Mile (mid-distance)',
  },
  {
    name: 'Direct Exit',
    plazas: [],
    description: '0 Mile -> 200 Mile (express)',
  },
  {
    name: 'Return Trip',
    plazas: [],
    description: '200 Mile -> 115 Mile -> 39 Mile -> 0 Mile (return)',
  },
];

export function getRoutesForPlazas(plazas: TollPlaza[]): Route[] {
  const sorted = [...plazas].sort((a, b) => (a.mileMarker || 0) - (b.mileMarker || 0));
  const plazaIds = sorted.map((p) => p.id);

  return [
    {
      name: 'Full Journey',
      plazas: plazaIds,
      description: sorted.map((p) => `${p.mileMarker ?? '?'} Mile`).join(' -> '),
    },
    {
      name: 'Short Trip',
      plazas: plazaIds.slice(0, 2),
      description: sorted.slice(0, 2).map((p) => `${p.mileMarker ?? '?'} Mile`).join(' -> '),
    },
    {
      name: 'Medium Trip',
      plazas: plazaIds.slice(0, 3),
      description: sorted.slice(0, 3).map((p) => `${p.mileMarker ?? '?'} Mile`).join(' -> '),
    },
    {
      name: 'Direct Exit',
      plazas: [plazaIds[0], plazaIds[plazaIds.length - 1]],
      description: `${sorted[0].mileMarker ?? '?'} Mile -> ${sorted[sorted.length - 1].mileMarker ?? '?'} Mile`,
    },
    {
      name: 'Return Trip',
      plazas: [...plazaIds].reverse(),
      description: sorted.reverse().map((p) => `${p.mileMarker ?? '?'} Mile`).join(' -> '),
    },
  ];
}

export function generatePlateNumber(): string {
  const letters = 'ABCDEFGHJKLMNPRSTUVWXYZ';
  const plate = Array.from({ length: 3 }, () =>
    letters[Math.floor(Math.random() * letters.length)]
  ).join('');
  const nums = Math.floor(1000 + Math.random() * 9000);
  return `${plate}-${nums}`;
}

export function generateFakePlate(): string {
  const letters = 'ABCDEFGHJKLMNPRSTUVWXYZ';
  const plate = Array.from({ length: 3 }, () =>
    letters[Math.floor(Math.random() * letters.length)]
  ).join('');
  const nums = Math.floor(1000 + Math.random() * 9000);
  return `${plate}-${nums}`;
}
