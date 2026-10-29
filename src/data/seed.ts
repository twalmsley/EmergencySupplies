import type { Category, ItemPriority, SupplyItem } from '../types';
import { slugId } from './defaults';

export type SeedItem = Omit<SupplyItem, 'id' | 'categoryId' | 'priority'> & {
  categoryName: string;
  priority?: ItemPriority;
};

/** Essentials drawn from UK Be Ready + British Red Cross guidance. */
export const SEED_ITEMS: SeedItem[] = [
  // Drinks
  {
    categoryName: 'Drinks',
    name: 'Bottled drinking water',
    unit: 'L',
    qtyRequiredBase: 3,
    scaleWithPeople: true,
    scaleWithDays: true,
    qtyInStock: 0,
    expiryDate: null,
    notes: '3 litres per person per day for drinking (Be Ready). More for cooking/washing.',
    grabBag: true,
    priority: 'high',
  },
  {
    categoryName: 'Drinks',
    name: 'Water purification tablets',
    unit: 'pack',
    qtyRequiredBase: 1,
    scaleWithPeople: false,
    scaleWithDays: false,
    qtyInStock: 0,
    expiryDate: null,
    notes: 'Follow product instructions. See Advice → Water purification.',
    grabBag: true,
    priority: 'medium',
  },
  {
    categoryName: 'Drinks',
    name: 'Portable water filter',
    unit: 'each',
    qtyRequiredBase: 1,
    scaleWithPeople: false,
    scaleWithDays: false,
    qtyInStock: 0,
    expiryDate: null,
    notes: 'Useful for treating collected water. Pre-filter cloudy water.',
    grabBag: false,
  },
  {
    categoryName: 'Drinks',
    name: 'Clean water storage containers',
    unit: 'each',
    qtyRequiredBase: 2,
    scaleWithPeople: false,
    scaleWithDays: false,
    qtyInStock: 0,
    expiryDate: null,
    notes: 'Food-grade, sealable. Label fill dates. Keep cool and dark.',
    grabBag: false,
  },

  // Food
  {
    categoryName: 'Food',
    name: 'Non-perishable / ready-to-eat food',
    unit: 'day-pack',
    qtyRequiredBase: 1,
    scaleWithPeople: true,
    scaleWithDays: true,
    qtyInStock: 0,
    expiryDate: null,
    notes: 'Long shelf life; food you would normally eat; some that needs no cooking.',
    grabBag: true,
  },
  {
    categoryName: 'Food',
    name: 'Tin opener (manual)',
    unit: 'each',
    qtyRequiredBase: 1,
    scaleWithPeople: false,
    scaleWithDays: false,
    qtyInStock: 0,
    expiryDate: null,
    notes: 'Essential if you stock tinned food.',
    grabBag: true,
  },
  {
    categoryName: 'Food',
    name: 'Snack bars / dried fruit & nuts',
    unit: 'pack',
    qtyRequiredBase: 1,
    scaleWithPeople: true,
    scaleWithDays: true,
    qtyInStock: 0,
    expiryDate: null,
    notes: 'No-cook energy snacks.',
    grabBag: true,
  },
  {
    categoryName: 'Food',
    name: 'Portable cooker (camping / solid fuel / meths)',
    unit: 'each',
    qtyRequiredBase: 1,
    scaleWithPeople: false,
    scaleWithDays: false,
    qtyInStock: 0,
    expiryDate: null,
    notes: 'Use outdoors only with ventilation. See Advice → Portable cookers.',
    grabBag: false,
  },
  {
    categoryName: 'Food',
    name: 'Cooker fuel (solid / LPG / meths)',
    unit: 'pack',
    qtyRequiredBase: 1,
    scaleWithPeople: false,
    scaleWithDays: true,
    qtyInStock: 0,
    expiryDate: null,
    notes: 'Match fuel to your cooker. Store safely away from heat sources.',
    grabBag: false,
  },

  // Hygiene
  {
    categoryName: 'Hygiene',
    name: 'Hand sanitiser',
    unit: 'bottle',
    qtyRequiredBase: 1,
    scaleWithPeople: false,
    scaleWithDays: false,
    qtyInStock: 0,
    expiryDate: null,
    notes: '',
    grabBag: true,
  },
  {
    categoryName: 'Hygiene',
    name: 'Wet wipes',
    unit: 'pack',
    qtyRequiredBase: 1,
    scaleWithPeople: true,
    scaleWithDays: false,
    qtyInStock: 0,
    expiryDate: null,
    notes: 'Useful when water is limited.',
    grabBag: true,
  },
  {
    categoryName: 'Hygiene',
    name: 'Bathroom / toiletries & sanitary supplies',
    unit: 'set',
    qtyRequiredBase: 1,
    scaleWithPeople: true,
    scaleWithDays: false,
    qtyInStock: 0,
    expiryDate: null,
    notes: 'Include what your household normally needs.',
    grabBag: true,
  },
  {
    categoryName: 'Hygiene',
    name: 'Rubbish / bin bags',
    unit: 'pack',
    qtyRequiredBase: 1,
    scaleWithPeople: false,
    scaleWithDays: false,
    qtyInStock: 0,
    expiryDate: null,
    notes: 'For waste and hygiene when services are disrupted.',
    grabBag: false,
  },

  // Heat+Light
  {
    categoryName: 'Heat+Light',
    name: 'Torch',
    unit: 'each',
    qtyRequiredBase: 1,
    scaleWithPeople: true,
    scaleWithDays: false,
    qtyInStock: 0,
    expiryDate: null,
    notes: 'Torches are safer than candles (Be Ready).',
    grabBag: true,
  },
  {
    categoryName: 'Heat+Light',
    name: 'Spare batteries (torch / radio)',
    unit: 'pack',
    qtyRequiredBase: 2,
    scaleWithPeople: false,
    scaleWithDays: false,
    qtyInStock: 0,
    expiryDate: null,
    notes: '',
    grabBag: true,
  },
  {
    categoryName: 'Heat+Light',
    name: 'Blankets / sleeping bags',
    unit: 'each',
    qtyRequiredBase: 1,
    scaleWithPeople: true,
    scaleWithDays: false,
    qtyInStock: 0,
    expiryDate: null,
    notes: 'Homes cool quickly when heating is off.',
    grabBag: true,
  },
  {
    categoryName: 'Heat+Light',
    name: 'Warm clothing layers',
    unit: 'set',
    qtyRequiredBase: 1,
    scaleWithPeople: true,
    scaleWithDays: false,
    qtyInStock: 0,
    expiryDate: null,
    notes: 'Spare warm layers for each person.',
    grabBag: true,
  },

  // Communications
  {
    categoryName: 'Communications',
    name: 'FM radio (battery or wind-up)',
    unit: 'each',
    qtyRequiredBase: 1,
    scaleWithPeople: false,
    scaleWithDays: false,
    qtyInStock: 0,
    expiryDate: null,
    notes: 'Note local/national station frequencies in Contacts or Notes.',
    grabBag: true,
  },
  {
    categoryName: 'Communications',
    name: 'Paper copy of important phone numbers',
    unit: 'each',
    qtyRequiredBase: 1,
    scaleWithPeople: false,
    scaleWithDays: false,
    qtyInStock: 0,
    expiryDate: null,
    notes: 'Include people you may need to check on.',
    grabBag: true,
  },
  {
    categoryName: 'Communications',
    name: 'Pen and paper',
    unit: 'set',
    qtyRequiredBase: 1,
    scaleWithPeople: false,
    scaleWithDays: false,
    qtyInStock: 0,
    expiryDate: null,
    notes: '',
    grabBag: true,
  },

  // Power
  {
    categoryName: 'Power',
    name: 'Charged power bank',
    unit: 'each',
    qtyRequiredBase: 1,
    scaleWithPeople: false,
    scaleWithDays: false,
    qtyInStock: 0,
    expiryDate: null,
    notes: 'For phones or compatible medical devices. Keep charged.',
    grabBag: true,
  },
  {
    categoryName: 'Power',
    name: 'Phone charger / cable',
    unit: 'each',
    qtyRequiredBase: 1,
    scaleWithPeople: true,
    scaleWithDays: false,
    qtyInStock: 0,
    expiryDate: null,
    notes: '',
    grabBag: true,
  },

  // Money
  {
    categoryName: 'Money',
    name: 'Cash (mix of coins and notes)',
    unit: 'set',
    qtyRequiredBase: 1,
    scaleWithPeople: false,
    scaleWithDays: false,
    qtyInStock: 0,
    expiryDate: null,
    notes: 'Amount depends on household needs if cards/ATMs fail.',
    grabBag: true,
  },
  {
    categoryName: 'Money',
    name: 'Bank / payment cards',
    unit: 'set',
    qtyRequiredBase: 1,
    scaleWithPeople: false,
    scaleWithDays: false,
    qtyInStock: 0,
    expiryDate: null,
    notes: '',
    grabBag: true,
  },

  // Documents
  {
    categoryName: 'Documents',
    name: 'Copies of IDs / important documents',
    unit: 'set',
    qtyRequiredBase: 1,
    scaleWithPeople: false,
    scaleWithDays: false,
    qtyInStock: 0,
    expiryDate: null,
    notes: 'Passports, birth certificates, insurance — in a waterproof bag.',
    grabBag: true,
  },
  {
    categoryName: 'Documents',
    name: 'Waterproof document bag',
    unit: 'each',
    qtyRequiredBase: 1,
    scaleWithPeople: false,
    scaleWithDays: false,
    qtyInStock: 0,
    expiryDate: null,
    notes: '',
    grabBag: true,
  },
  {
    categoryName: 'Documents',
    name: 'Spare house / car keys',
    unit: 'set',
    qtyRequiredBase: 1,
    scaleWithPeople: false,
    scaleWithDays: false,
    qtyInStock: 0,
    expiryDate: null,
    notes: '',
    grabBag: true,
  },
  {
    categoryName: 'Documents',
    name: 'Medical equipment instructions / prescriptions list',
    unit: 'set',
    qtyRequiredBase: 1,
    scaleWithPeople: false,
    scaleWithDays: false,
    qtyInStock: 0,
    expiryDate: null,
    notes: 'Include doses of regular medication.',
    grabBag: true,
  },

  // Medical
  {
    categoryName: 'Medical',
    name: 'First aid kit',
    unit: 'each',
    qtyRequiredBase: 1,
    scaleWithPeople: false,
    scaleWithDays: false,
    qtyInStock: 0,
    expiryDate: null,
    notes: 'Plasters, bandages, antiseptic, gloves, dressings, tweezers, etc.',
    grabBag: true,
  },
  {
    categoryName: 'Medical',
    name: 'Essential medication & medical supplies',
    unit: 'set',
    qtyRequiredBase: 1,
    scaleWithPeople: true,
    scaleWithDays: false,
    qtyInStock: 0,
    expiryDate: null,
    notes: 'Request repeats early (Be Ready suggests up to 5 working days before needed).',
    grabBag: true,
  },
  {
    categoryName: 'Medical',
    name: 'Thermometer',
    unit: 'each',
    qtyRequiredBase: 1,
    scaleWithPeople: false,
    scaleWithDays: false,
    qtyInStock: 0,
    expiryDate: null,
    notes: '',
    grabBag: false,
  },

  // Baby
  {
    categoryName: 'Baby',
    name: 'Ready-to-feed baby formula',
    unit: 'pack',
    qtyRequiredBase: 1,
    scaleWithPeople: false,
    scaleWithDays: true,
    qtyInStock: 0,
    expiryDate: null,
    notes: 'Preferred if you cannot boil water safely for powdered formula.',
    grabBag: true,
  },
  {
    categoryName: 'Baby',
    name: 'Nappies',
    unit: 'pack',
    qtyRequiredBase: 1,
    scaleWithPeople: false,
    scaleWithDays: true,
    qtyInStock: 0,
    expiryDate: null,
    notes: '',
    grabBag: true,
  },
  {
    categoryName: 'Baby',
    name: 'Baby wipes',
    unit: 'pack',
    qtyRequiredBase: 1,
    scaleWithPeople: false,
    scaleWithDays: false,
    qtyInStock: 0,
    expiryDate: null,
    notes: '',
    grabBag: true,
  },
  {
    categoryName: 'Baby',
    name: 'Bottles / feeding equipment',
    unit: 'set',
    qtyRequiredBase: 1,
    scaleWithPeople: false,
    scaleWithDays: false,
    qtyInStock: 0,
    expiryDate: null,
    notes: '',
    grabBag: true,
  },
  {
    categoryName: 'Baby',
    name: 'Comfort item (toy / blanket)',
    unit: 'each',
    qtyRequiredBase: 1,
    scaleWithPeople: false,
    scaleWithDays: false,
    qtyInStock: 0,
    expiryDate: null,
    notes: '',
    grabBag: true,
  },

  // Pet
  {
    categoryName: 'Pet',
    name: 'Pet food',
    unit: 'day-pack',
    qtyRequiredBase: 1,
    scaleWithPeople: false,
    scaleWithDays: true,
    qtyInStock: 0,
    expiryDate: null,
    notes: 'Scale for number of pets in notes.',
    grabBag: true,
  },
  {
    categoryName: 'Pet',
    name: 'Pet drinking water',
    unit: 'L',
    qtyRequiredBase: 1,
    scaleWithPeople: false,
    scaleWithDays: true,
    qtyInStock: 0,
    expiryDate: null,
    notes: 'Extra beyond human drinking water.',
    grabBag: true,
  },
  {
    categoryName: 'Pet',
    name: 'Lead / harness / carrier',
    unit: 'each',
    qtyRequiredBase: 1,
    scaleWithPeople: false,
    scaleWithDays: false,
    qtyInStock: 0,
    expiryDate: null,
    notes: '',
    grabBag: true,
  },
  {
    categoryName: 'Pet',
    name: 'Pet medication',
    unit: 'set',
    qtyRequiredBase: 1,
    scaleWithPeople: false,
    scaleWithDays: false,
    qtyInStock: 0,
    expiryDate: null,
    notes: '',
    grabBag: true,
  },
  {
    categoryName: 'Pet',
    name: 'Litter / waste bags',
    unit: 'pack',
    qtyRequiredBase: 1,
    scaleWithPeople: false,
    scaleWithDays: false,
    qtyInStock: 0,
    expiryDate: null,
    notes: '',
    grabBag: false,
  },
];

export function newId(): string {
  return crypto.randomUUID();
}

export function ensureCategoriesForSeed(
  categories: Category[],
  seed: SeedItem[],
): Category[] {
  const byName = new Map(categories.map((c) => [c.name.toLowerCase(), c]));
  const next = [...categories];
  for (const item of seed) {
    const key = item.categoryName.toLowerCase();
    if (!byName.has(key)) {
      const cat: Category = { id: slugId(item.categoryName), name: item.categoryName };
      next.push(cat);
      byName.set(key, cat);
    }
  }
  return next;
}

export function seedToItems(seed: SeedItem[], categories: Category[]): SupplyItem[] {
  const byName = new Map(categories.map((c) => [c.name.toLowerCase(), c.id]));
  return seed.map((s) => {
    const categoryId = byName.get(s.categoryName.toLowerCase());
    if (!categoryId) {
      throw new Error(`Missing category: ${s.categoryName}`);
    }
    const { categoryName: _, priority, ...rest } = s;
    return {
      ...rest,
      id: newId(),
      categoryId,
      priority: priority ?? defaultSeedPriority(s),
    };
  });
}

function defaultSeedPriority(item: SeedItem): ItemPriority {
  const name = item.name.toLowerCase();
  if (
    name.includes('water') ||
    name.includes('medication') ||
    name.includes('first aid') ||
    name.includes('formula') ||
    name.includes('power bank') ||
    name.includes('torch')
  ) {
    return 'high';
  }
  if (
    name.includes('cooker') ||
    name.includes('fuel') ||
    name.includes('filter') ||
    name.includes('comfort')
  ) {
    return 'low';
  }
  return 'medium';
}

export function mergeSeedItems(
  existing: SupplyItem[],
  seeded: SupplyItem[],
): SupplyItem[] {
  const names = new Set(existing.map((i) => i.name.toLowerCase()));
  const additions = seeded.filter((i) => !names.has(i.name.toLowerCase()));
  return [...existing, ...additions];
}
