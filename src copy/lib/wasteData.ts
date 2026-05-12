import type { WasteCategory, WasteResult } from '../types/waste';

export const wasteData: Record<WasteCategory, Omit<WasteResult, 'confidence'>> = {
  plastic: {
    category: 'plastic',
    label: 'Plastic',
    binColor: '#FBBF24',
    binLabel: 'Yellow Bin',
    description: 'Plastic waste includes bottles, bags, containers, and packaging materials. Most plastics take 400–1000 years to decompose in landfills.',
    tips: [
      'Rinse containers before recycling to avoid contamination',
      'Remove caps and labels when possible',
      'Check the resin code (1–7) on the bottom for recycling guidance',
      'Avoid single-use plastics — carry a reusable bag and bottle',
      'Soft plastics like bags often need special drop-off points',
    ],
    recyclable: true,
    hazardous: false,
    icon: '♻️',
  },
  organic: {
    category: 'organic',
    label: 'Organic',
    binColor: '#84CC16',
    binLabel: 'Green Bin',
    description: 'Organic waste includes food scraps, garden clippings, and biodegradable materials. Composting organic waste reduces methane emissions from landfills.',
    tips: [
      'Compost at home with a compost bin or worm farm',
      'Keep meat and dairy out of backyard compost piles',
      'Use fruit and vegetable peels as mulch for plants',
      'Dispose of cooking oils separately — never pour down drains',
      'Convert garden waste into nutrient-rich compost',
    ],
    recyclable: true,
    hazardous: false,
    icon: '🌱',
  },
  metal: {
    category: 'metal',
    label: 'Metal',
    binColor: '#6B7280',
    binLabel: 'Grey Bin',
    description: 'Metal waste includes cans, foil, appliances, and scrap metal. Recycling metal saves up to 95% of the energy needed to produce new metal from raw ore.',
    tips: [
      'Rinse food tins and cans before recycling',
      'Aluminum cans can be recycled indefinitely without loss of quality',
      'Take large metal items to a scrap metal dealer',
      'Remove any non-metal parts like plastic lids before recycling',
      'Crush cans to save space in the recycling bin',
    ],
    recyclable: true,
    hazardous: false,
    icon: '🥫',
  },
  ewaste: {
    category: 'ewaste',
    label: 'E-Waste',
    binColor: '#EF4444',
    binLabel: 'Red Bin / Special Drop-off',
    description: 'Electronic waste includes phones, computers, batteries, and small appliances. E-waste contains toxic metals like lead, mercury, and cadmium that can leach into soil and water.',
    tips: [
      'Take e-waste to certified e-waste recycling centers',
      'Erase personal data before disposing of devices',
      'Donate working electronics to charities or schools',
      'Check if your manufacturer offers a take-back program',
      'Never burn or crush e-waste — toxic chemicals can be released',
    ],
    recyclable: true,
    hazardous: true,
    icon: '📱',
  },
  paper: {
    category: 'paper',
    label: 'Paper',
    binColor: '#3B82F6',
    binLabel: 'Blue Bin',
    description: 'Paper waste includes newspapers, cardboard, books, and office paper. Recycling one ton of paper saves 17 trees and 7,000 gallons of water.',
    tips: [
      'Flatten cardboard boxes to save space',
      'Keep paper dry — wet paper cannot be recycled',
      'Remove plastic windows from envelopes before recycling',
      'Shred sensitive documents before placing in recycling',
      'Use both sides of paper before recycling',
    ],
    recyclable: true,
    hazardous: false,
    icon: '📄',
  },
  glass: {
    category: 'glass',
    label: 'Glass',
    binColor: '#06B6D4',
    binLabel: 'Blue/Clear Bin',
    description: 'Glass waste includes bottles, jars, and broken glass. Glass can be recycled endlessly without losing purity or quality, saving raw materials and energy.',
    tips: [
      'Rinse bottles and jars before recycling',
      'Separate glass by color if required locally',
      'Never mix broken glass with regular recycling',
      'Wrap broken glass safely before disposal',
      'Reuse glass jars for food storage or as plant pots',
    ],
    recyclable: true,
    hazardous: false,
    icon: '🫙',
  },
  unknown: {
    category: 'unknown',
    label: 'Unknown',
    binColor: '#9CA3AF',
    binLabel: 'General Waste Bin',
    description: 'Unable to classify this item with certainty. When in doubt, place items in the general waste bin to avoid contaminating recycling streams.',
    tips: [
      'Check your local council website for specific disposal guidelines',
      'When unsure, opt for general waste rather than contaminating recycling',
      'Look for recycling symbols or material codes on packaging',
      'Contact your local waste management service for guidance',
      'Consider if the item can be repaired or repurposed before disposal',
    ],
    recyclable: false,
    hazardous: false,
    icon: '🗑️',
  },
};

const keywordMap: Record<string, WasteCategory> = {
  bottle: 'plastic', bag: 'plastic', straw: 'plastic', wrapper: 'plastic',
  container: 'plastic', cup: 'plastic', polythene: 'plastic', styrofoam: 'plastic',
  food: 'organic', fruit: 'organic', vegetable: 'organic', leaf: 'organic',
  grass: 'organic', compost: 'organic', peel: 'organic', banana: 'organic',
  apple: 'organic', bread: 'organic', kitchen: 'organic',
  can: 'metal', tin: 'metal', aluminum: 'metal', foil: 'metal',
  scrap: 'metal', wire: 'metal', appliance: 'metal', iron: 'metal', steel: 'metal',
  phone: 'ewaste', laptop: 'ewaste', computer: 'ewaste', battery: 'ewaste',
  charger: 'ewaste', cable: 'ewaste', electronic: 'ewaste', circuit: 'ewaste',
  keyboard: 'ewaste', mouse: 'ewaste', tablet: 'ewaste',
  paper: 'paper', cardboard: 'paper', newspaper: 'paper', book: 'paper',
  magazine: 'paper', envelope: 'paper', box: 'paper', tissue: 'paper',
  glass: 'glass', jar: 'glass', window: 'glass', mirror: 'glass', bottle_glass: 'glass',
};

export function classifyFromKeyword(text: string): WasteCategory {
  const lower = text.toLowerCase();
  for (const [keyword, category] of Object.entries(keywordMap)) {
    if (lower.includes(keyword)) return category;
  }
  return 'unknown';
}

export function buildResult(category: WasteCategory, confidence: number): WasteResult {
  return { ...wasteData[category], confidence };
}
