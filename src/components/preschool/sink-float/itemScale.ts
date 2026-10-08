// Representative household sizes, in centimetres (longest dimension).
// One shared scale: 0.12 world units per cm, an 80 cm wide normal tank.
const lengths:Record<string,number>={
  'item-pebble':3.5,'item-keys':8,'item-spoon':16,'item-egg':6,
  'item-apple':7,'item-wood':4,'item-duck':8,'item-pingpong':22,
  'item-leaf':8,'item-bottle':12,'item-coin':2.4,'item-marble':1.6
};
export const ITEM_WORLD_SCALES=Object.fromEntries(Object.entries(lengths).map(([id,lengthCm])=>[id,{lengthCm,size:lengthCm*.12,radius:lengthCm*.06}]));
