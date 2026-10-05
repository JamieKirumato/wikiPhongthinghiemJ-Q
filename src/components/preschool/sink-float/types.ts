export type TankShape = 'rectangle' | 'square' | 'cylinder' | 'triangle';
export type TankScale = 'normal' | 'compact';

export type InteractionMode = 'interact' | 'orbit';

export interface TankObject {
  id: string;
  name: string;
  icon: string;
  image: string;
  size: number; // Đường kính thế giới (world units)
  weightGrams: number;
  volumeMl: number;
  floatsDefault: boolean;
  desc: string;
  densityNote: string;
  inTank: boolean;
  x: number; // Tọa độ thế giới 3D X
  y: number; // Tọa độ thế giới 3D Y (trục đứng)
  z: number; // Tọa độ thế giới 3D Z (chiều sâu)
  vx: number;
  vy: number;
  vz: number;
  angle: number;
  vRot: number;
  settled: boolean;
  status: 'basket' | 'falling' | 'floating' | 'sunk' | 'pushed';
}

export interface TankDimensions {
  width: number;
  height: number;
  depth: number;
  waterHeight: number;
}

export type SaltWorkflowStep = 'idle' | 'scoopMode' | 'holdingSpoon' | 'pouring' | 'stirring';

export interface SaltGrain {
  id: number;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  alpha: number;
  size: number;
}

export interface WaterSplashEffect {
  id: number;
  x: number;
  y: number;
  z: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

export interface BubbleParticle3D {
  id: number;
  x: number;
  y: number;
  z: number;
  vy: number;
  size: number;
  wobble: number;
  alpha: number;
}
