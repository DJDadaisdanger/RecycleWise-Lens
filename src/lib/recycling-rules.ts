import type { RecyclingRules } from './types';

export const rules: RecyclingRules = {
  'PET Bottle': {
    action: 'Recycle',
    preparation: 'Rinse the bottle and replace the cap. Labels can be left on.',
    notes: 'Only #1 and #2 plastics are widely accepted in curbside bins.',
    source: 'https://sfrecycles.org/recycles/plastic-bottles-and-jugs',
  },
  'Glass Bottle': {
    action: 'Recycle',
    preparation: 'Rinse the bottle. Metal caps can be recycled separately. Plastic caps go to landfill.',
    notes: 'Labels can be left on. Do not break the glass.',
    source: 'https://sfrecycles.org/recycles/glass-bottles-and-jars/',
    },
  'Paper Cup': {
    action: 'Compost',
    preparation: 'Empty any liquids. Plastic lids and straws go to landfill.',
    notes: 'Most paper cups have a plastic lining, making them non-recyclable. They can be composted.',
    source: 'https://sfrecycles.org/recycles/coffee-cups',
  },
  'Battery': {
    action: 'Special Drop-off',
    preparation: 'Place clear tape over the terminals of each battery.',
    notes: 'Put batteries in a clear plastic bag and place it on top of your black landfill bin on collection day or find a designated drop-off location.',
    source: 'https://sfrecycles.org/recycles/batteries',
  },
  'Apple Core': {
    action: 'Compost',
    preparation: 'No preparation needed.',
    notes: 'All food scraps can be placed in the green compost bin.',
    source: 'https://sfrecycles.org/recycles/food-scraps',
  },
};
