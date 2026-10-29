import type { HouseholdProfile } from '../../types';

export type AdviceProfileTag = 'infants' | 'schoolAge' | 'pets' | 'medical';

export type AdviceTopic = {
  slug: string;
  title: string;
  summary: string;
  relatedCategories: string[];
  /** When household profile is active, topics with matching tags are highlighted. */
  profileTags?: AdviceProfileTag[];
  sections: { heading: string; paragraphs: string[]; bullets?: string[] }[];
};

export function topicMatchesProfile(
  topic: AdviceTopic,
  profile: HouseholdProfile,
): boolean {
  if (!topic.profileTags?.length) return false;
  return topic.profileTags.some((tag) => profile[tag]);
}

export const ADVICE_TOPICS: AdviceTopic[] = [
  {
    slug: 'no-power',
    title: 'No power',
    summary: 'Lighting, charging, food safety, information, and medical devices during an outage.',
    relatedCategories: ['Power', 'Heat+Light', 'Communications', 'Food'],
    profileTags: ['medical'],
    sections: [
      {
        heading: 'Stay informed and lit',
        paragraphs: [
          'Use torches rather than candles where possible. Keep a battery or wind-up FM radio for updates when mobile data or broadband is down. Note station frequencies in your contacts or household notes.',
        ],
        bullets: [
          'Keep power banks charged on a normal day.',
          'Conserve phone battery; use text where voice networks are congested.',
          'Know the power-cut number: 105 in Great Britain.',
        ],
      },
      {
        heading: 'Food in the fridge and freezer',
        paragraphs: [
          'Keep fridge and freezer doors closed as much as possible. A full freezer stays cold longer than a half-empty one. When in doubt about perishable food that has warmed up, throw it out.',
        ],
      },
      {
        heading: 'Medical devices and extra support',
        paragraphs: [
          'If you rely on powered medical equipment, follow your care plan and supplier advice. In England, Scotland and Wales you may be eligible for the Priority Services Register (thepsr.co.uk) so utilities know you need extra support. Northern Ireland has Customer Care Registers.',
        ],
      },
    ],
  },
  {
    slug: 'no-water',
    title: 'No water',
    summary: 'Stored drinking water, hygiene without mains supply, and what not to drink.',
    relatedCategories: ['Drinks', 'Hygiene'],
    profileTags: ['pets', 'infants'],
    sections: [
      {
        heading: 'Drinking water targets',
        paragraphs: [
          'UK Be Ready guidance suggests about 3 litres of drinking water per person per day. Plan extra for cooking, washing, and pets. Store in clean, food-grade containers; label the fill date.',
        ],
      },
      {
        heading: 'Hygiene when taps are dry',
        paragraphs: [
          'Use hand sanitiser and wet wipes to stretch limited water. Prioritise hand hygiene before eating and after toilet use. Keep a small set of toiletries in your grab bag.',
        ],
      },
      {
        heading: 'Untreated sources',
        paragraphs: [
          'Do not assume streams, garden water butts, or hot-water tanks are safe to drink without appropriate treatment. See the water purification and collection topics. Never drink flood water.',
        ],
      },
    ],
  },
  {
    slug: 'no-gas',
    title: 'No gas',
    summary: 'Heating and cooking alternatives, and why outdoor-only appliances matter.',
    relatedCategories: ['Food', 'Heat+Light'],
    sections: [
      {
        heading: 'Cooking without gas',
        paragraphs: [
          'Stock ready-to-eat and no-cook food so you are not dependent on a hob. If you keep a portable cooker, match fuel to the appliance and read the safety topic on portable cookers.',
        ],
      },
      {
        heading: 'Heating without gas',
        paragraphs: [
          'Focus on clothing layers, blankets, and a one-room strategy rather than improvised indoor combustion heaters. Never use barbecues, camping stoves, or generators indoors — carbon monoxide can kill.',
        ],
      },
      {
        heading: 'Know your isolation points',
        paragraphs: [
          'Learn how to turn off gas, electricity, and water at the mains if you must leave home (for example in a flood) or if there is a leak. Only turn supplies back on when it is safe and you know how.',
        ],
      },
    ],
  },
  {
    slug: 'summer-heat',
    title: 'Summer and heat',
    summary: 'Hydration, cooling without power, medication, and sun protection.',
    relatedCategories: ['Drinks', 'Medical', 'Hygiene'],
    profileTags: ['medical', 'infants', 'schoolAge'],
    sections: [
      {
        heading: 'Hydration and cooling',
        paragraphs: [
          'Increase drinking-water stocks in hot weather. Close curtains on sunny façades during the day; ventilate when outdoor air is cooler. Battery fans can help if power is available; without power, prioritise shade and rest.',
        ],
      },
      {
        heading: 'Medication and vulnerable people',
        paragraphs: [
          'Some medicines are heat-sensitive — check labels. Check on neighbours who may struggle in heatwaves, especially if there is also a power cut affecting cooling or lifts.',
        ],
      },
      {
        heading: 'Sun protection',
        paragraphs: [
          'Keep sunscreen, hats, and light covering clothing with your kit if you may need to spend time outdoors during disruption (for example queues or travel delays).',
        ],
      },
    ],
  },
  {
    slug: 'winter-cold',
    title: 'Winter and cold',
    summary: 'Layering, drafts, one-room living, and checking on others.',
    relatedCategories: ['Heat+Light', 'Food', 'Communications'],
    profileTags: ['medical', 'infants', 'schoolAge'],
    sections: [
      {
        heading: 'When heating fails',
        paragraphs: [
          'Homes can cool quickly. Wear layered clothing, use hats and socks indoors, and gather in one room with blankets or sleeping bags. Block obvious drafts with towels or curtains.',
        ],
      },
      {
        heading: 'Safety',
        paragraphs: [
          'Do not burn fuel in unvented spaces. Watch for symptoms of cold stress in children, older adults, and people with health conditions. Keep torches and spare batteries accessible.',
        ],
      },
      {
        heading: 'Community',
        paragraphs: [
          'Agree how you will check on anyone who lives alone if phones or roads are down. Swap contact details with neighbours before winter weather hits.',
        ],
      },
    ],
  },
  {
    slug: 'staying-warm',
    title: 'Staying warm in winter',
    summary: 'A practical warmth-without-central-heating checklist.',
    relatedCategories: ['Heat+Light'],
    profileTags: ['medical', 'infants'],
    sections: [
      {
        heading: 'Clothing and bedding',
        paragraphs: [
          'Several thin layers trap air better than one thick layer. Keep a complete change of warm clothes per person in your kit. Sleeping bags and blankets are high-value, low-tech heat retention.',
        ],
        bullets: [
          'Hat, scarf/buff, gloves, warm socks',
          'Hot-water bottle only if you can safely heat water',
          'Insulate yourself from cold floors (rug, spare mattress, cardboard under sleeping bag)',
        ],
      },
      {
        heading: 'Room strategy',
        paragraphs: [
          'Close doors to unused rooms. Hang blankets over windows at night. Sit away from external walls if possible. Share body heat safely with household members if needed.',
        ],
      },
      {
        heading: 'What not to do',
        paragraphs: [
          'Avoid using ovens for heat, running engines in enclosed spaces, or indoor charcoal. If you smell gas or suspect carbon monoxide (headache, nausea, dizziness), get fresh air and call emergency services.',
        ],
      },
    ],
  },
  {
    slug: 'cold-food',
    title: 'Cold food and no-cook prep',
    summary: 'Ready-to-eat meals when you cannot cook or refrigerate.',
    relatedCategories: ['Food', 'Drinks'],
    sections: [
      {
        heading: 'Choose food you already eat',
        paragraphs: [
          'Be Ready advice is to buy long-life food you would normally eat. Include options that need no heat: tinned fish or beans (with a manual tin opener), crackers, nut butters, dried fruit, UHT milk, snack bars.',
        ],
      },
      {
        heading: 'No refrigeration',
        paragraphs: [
          'Prefer sealed, shelf-stable products. Once opened, treat perishable leftovers carefully — without a cold fridge, finish them promptly or discard.',
        ],
      },
      {
        heading: 'Simple meal ideas',
        paragraphs: [
          'Tinned fruit + cereal + UHT milk; crackers with tinned fish; ready-to-eat rice pouches if you have a safe way to warm them, otherwise choose varieties edible cold; trail mix and water.',
        ],
      },
    ],
  },
  {
    slug: 'portable-cookers',
    title: 'Portable cookers and fuel',
    summary: 'Solid fuel, LPG, and methylated spirits — with fire and CO safety first.',
    relatedCategories: ['Food', 'Heat+Light'],
    sections: [
      {
        heading: 'Why keep a cooker?',
        paragraphs: [
          'A small camping or emergency cooker can heat water and simple meals when the kitchen is unavailable. It is optional — many households rely on no-cook food alone for a few days.',
        ],
      },
      {
        heading: 'Fuel types',
        paragraphs: [
          'Solid fuel tablets are compact and simple. LPG / camping gas cartridges are common for outdoor stoves. Methylated spirits (meths) stoves are lightweight but fuel is flammable and must be stored carefully. Always match fuel to the appliance instructions.',
        ],
      },
      {
        heading: 'Non-negotiable safety',
        paragraphs: [
          'Use outdoor cookers outdoors or only where the manufacturer explicitly allows and ventilation is excellent. Carbon monoxide from incomplete combustion is colourless and odourless. Keep fuel away from children, heat sources, and living areas. Have a clear space free of tents, dry grass, and overhanging fabric. Never leave a lit stove unattended.',
        ],
        bullets: [
          'Stock fuel as its own inventory item with notes on type and storage location.',
          'Practise lighting the stove once in safe conditions before you need it.',
          'Have a way to extinguish flames (water for some fuels is wrong — know your fuel).',
        ],
      },
    ],
  },
  {
    slug: 'water-purification',
    title: 'Water purification',
    summary: 'Boiling, tablets, and filters — what each method can and cannot do.',
    relatedCategories: ['Drinks'],
    sections: [
      {
        heading: 'Boiling',
        paragraphs: [
          'A rolling boil helps kill many disease-causing organisms. You need a heat source and a clean pot. Boiling does not remove chemical pollution or heavy metals.',
        ],
      },
      {
        heading: 'Purification tablets or drops',
        paragraphs: [
          'Chlorine or chlorine-dioxide products are compact for a grab bag. Follow contact time on the packet. Effectiveness against some parasites varies by product — read the label. Taste can be improved by waiting or using neutraliser tablets if supplied.',
        ],
      },
      {
        heading: 'Portable filters',
        paragraphs: [
          'Many portable filters (including hollow-fibre / ultrafiltration) reduce bacteria and protozoa; virus reduction depends on the design. Filters do not remove all dissolved chemicals. Pre-filter cloudy water through cloth to protect the filter.',
        ],
      },
      {
        heading: 'Limits',
        paragraphs: [
          'No field method makes heavily contaminated industrial or flood water reliably safe. When municipal advice says water is unsafe, follow boil notices or distributed bottled water.',
        ],
      },
    ],
  },
  {
    slug: 'water-collection',
    title: 'Water collection and preservation',
    summary: 'Storing, rotating, labelling, and collecting water safely.',
    relatedCategories: ['Drinks'],
    sections: [
      {
        heading: 'Storing water',
        paragraphs: [
          'Use clean, food-grade containers with tight lids. Fill from the drinking-water tap. Keep cool, dark, and away from fuels or chemicals. Label the date filled.',
        ],
      },
      {
        heading: 'Rotation',
        paragraphs: [
          'Commercially bottled water has a best-before date — rotate into normal use and replace. Home-filled containers should be emptied, cleaned, and refilled on a schedule you can remember (for example when you do your six-month kit check).',
        ],
      },
      {
        heading: 'Collection',
        paragraphs: [
          'Rain collection can supplement non-drinking uses after debris is screened out; treat before drinking. Clear snow can be melted then treated — it takes a large volume of snow for a little water. Never collect from roofs with toxic coatings or from flood water.',
        ],
      },
    ],
  },
];

export function getTopic(slug: string): AdviceTopic | undefined {
  return ADVICE_TOPICS.find((t) => t.slug === slug);
}
