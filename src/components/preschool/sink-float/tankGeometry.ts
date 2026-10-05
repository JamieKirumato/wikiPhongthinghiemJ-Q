import { TankDimensions, TankScale, TankShape } from './types';

export interface ShapeConfig {
  width: number;
  height: number;
  depth: number;
  baseWaterRatio: number; // Tỉ lệ nước cơ bản (52% chiều cao)
}

// Kích thước chuẩn cho bể LỚN (Normal - 100%)
const BASE_CONFIGS: Record<TankShape, ShapeConfig> = {
  rectangle: {
    width: 9.6,
    height: 4.8,
    depth: 4.6,
    baseWaterRatio: 0.52
  },
  square: {
    width: 5.6,
    height: 5.6,
    depth: 5.6,
    baseWaterRatio: 0.52
  },
  cylinder: {
    width: 6.4, // Đường kính
    height: 4.8,
    depth: 6.4,
    baseWaterRatio: 0.52
  },
  triangle: {
    width: 8.2,
    height: 4.8,
    depth: 5.8,
    baseWaterRatio: 0.52
  }
};

/**
 * Lấy kích thước bể theo hình dạng và tỉ lệ.
 * Kích thước "Nhỏ" (compact) chính xác bằng 50% mỗi chiều (x, y, z) của bể "To".
 */
export function getTankDimensions(shape: TankShape, scale: TankScale): TankDimensions {
  const base = BASE_CONFIGS[shape];
  const scaleMultiplier = scale === 'compact' ? 0.5 : 1.0;

  const width = base.width * scaleMultiplier;
  const height = base.height * scaleMultiplier;
  const depth = base.depth * scaleMultiplier;
  const waterHeight = height * base.baseWaterRatio;

  return {
    width,
    height,
    depth,
    waterHeight
  };
}

/**
 * Tính diện tích đáy bể (Footprint Area).
 * Bể nhỏ có diện tích đáy = 25% (0.5 * 0.5) của bể to,
 * do đó cùng một lượng thể tích vật thả vào, mực nước ở bể nhỏ sẽ dâng cao gấp 4 lần.
 */
export function getFootprintArea(shape: TankShape, dims: TankDimensions): number {
  switch (shape) {
    case 'rectangle':
    case 'square':
      return dims.width * dims.depth;
    case 'cylinder': {
      const radius = dims.width / 2;
      return Math.PI * radius * radius;
    }
    case 'triangle':
      return 0.5 * dims.width * dims.depth;
  }
}

/**
 * Tính mực nước dâng do lực đẩy Ác-si-mét (Archimedes Displacement).
 * submergedVolumeMl: Tổng thể tích phần chìm THỰC TẾ của các vật thể (ml = cm³).
 */
export function calculateWaterRise(
  submergedVolumeMl: number,
  shape: TankShape,
  dims: TankDimensions
): number {
  if (submergedVolumeMl <= 0) return 0;
  const area = getFootprintArea(shape, dims);
  // Hệ số quy đổi thế giới: 1000ml nước trên 1m² = 0.001m
  const kDisplacement = 0.0035;
  const rise = (submergedVolumeMl * kDisplacement) / (area / 30);
  const maxRise = (dims.height - dims.waterHeight) * 0.75;
  return Math.min(maxRise, Math.max(0, rise));
}

/**
 * Kiểm tra một điểm (x, z) có nằm trong footprint đáy/miệng bể không.
 * margin: phần mở rộng cho phép bấm gần miệng bể.
 */
export function isPointInsideFootprint(
  x: number,
  z: number,
  shape: TankShape,
  dims: TankDimensions,
  margin: number = 0
): boolean {
  const { width: W, depth: D } = dims;

  switch (shape) {
    case 'rectangle':
    case 'square':
      return Math.abs(x) <= W / 2 + margin && Math.abs(z) <= D / 2 + margin;

    case 'cylinder': {
      const maxR = W / 2 + margin;
      return x * x + z * z <= maxR * maxR;
    }

    case 'triangle': {
      // Đỉnh: (0, -D/2), Đáy trái: (-W/2, D/2), Đáy phải: (W/2, D/2)
      if (z > D / 2 + margin) return false;
      const L = Math.sqrt((W / 2) * (W / 2) + D * D);
      // Khoảng cách hướng vào trong từ 2 cạnh nghiêng
      const dLeft = (D * x + (W / 2) * z + (W * D) / 4) / L;
      const dRight = (-D * x + (W / 2) * z + (W * D) / 4) / L;
      return dLeft >= -margin && dRight >= -margin;
    }
  }
}

/**
 * Kiểm tra và gông (clamp) vị trí (x, z) của vật thể để luôn nằm an toàn
 * bên trong thành bể kính theo đúng hình học 3D thực tế của từng loại bể.
 * Đối với lăng trụ tam giác, thực hiện INSET CHÍNH XÁC cả 3 cạnh theo bán kính + padding.
 */
export function clampToTankBoundary(
  x: number,
  z: number,
  radius: number,
  shape: TankShape,
  dims: TankDimensions
): { x: number; z: number } {
  const wallPadding = 0.08;
  const rawDeff = radius + wallPadding;

  switch (shape) {
    case 'rectangle':
    case 'square': {
      const halfW = Math.max(0.15, dims.width / 2 - rawDeff);
      const halfD = Math.max(0.15, dims.depth / 2 - rawDeff);
      return {
        x: Math.max(-halfW, Math.min(halfW, x)),
        z: Math.max(-halfD, Math.min(halfD, z))
      };
    }

    case 'cylinder': {
      const maxRadius = Math.max(0.15, dims.width / 2 - rawDeff);
      const distFromCenter = Math.sqrt(x * x + z * z);
      if (distFromCenter > maxRadius) {
        const factor = maxRadius / (distFromCenter || 1);
        return {
          x: x * factor,
          z: z * factor
        };
      }
      return { x, z };
    }

    case 'triangle': {
      // Tam giác cân với tọa độ nhất quán trong mặt phẳng XZ:
      // Đỉnh A: (0, -D/2)
      // Đáy trái B: (-W/2, D/2)
      // Đáy phải C: (W/2, D/2)
      const W = dims.width;
      const D = dims.depth;
      const L = Math.sqrt((W / 2) * (W / 2) + D * D);

      // Bán kính đường tròn nội tiếp tam giác (inradius)
      const semiPerimeter = W / 2 + L;
      const inradius = (0.5 * W * D) / semiPerimeter;
      const dEff = Math.min(rawDeff, inradius * 0.85);

      // Đỉnh inset A': nơi 2 cạnh nghiêng inset giao nhau trên trục đối xứng x = 0
      const zApexInset = -D / 2 + dEff * (L / (W / 2));
      // Đáy inset B'C': dịch vào trong từ đáy Z = D/2
      const zBaseInset = D / 2 - dEff;

      // Clamp Z trước
      const clampedZ = Math.max(zApexInset, Math.min(zBaseInset, z));

      // Chiều rộng khả dụng tại Z đã clamp (tính từ khoảng cách chuẩn tới 2 cạnh nghiêng)
      const maxAvailableHalfW = Math.max(0, ((W * D) / 4 + (W / 2) * clampedZ - dEff * L) / D);

      const clampedX = Math.max(-maxAvailableHalfW, Math.min(maxAvailableHalfW, x));

      return { x: clampedX, z: clampedZ };
    }
  }
}
