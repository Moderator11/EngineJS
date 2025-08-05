const RAMP_COLOR_SCHEME = [
  [0, 0, 255],
  [0, 255, 255],
  [0, 255, 0],
  [255, 255, 0],
  [255, 0, 0],
];

function blendColor(
  r1: number,
  g1: number,
  b1: number,
  r2: number,
  g2: number,
  b2: number,
  x: number
) {
  const rr = r1 + (r2 - r1) * x;
  const rg = g1 + (g2 - g1) * x;
  const rb = b1 + (b2 - b1) * x;
  return [rr, rg, rb];
}

export function getHeatmapRGB(x: number) {
  const range = RAMP_COLOR_SCHEME.length - 1;
  const c1 = RAMP_COLOR_SCHEME[Math.floor(x * range)];
  const c2 = RAMP_COLOR_SCHEME[Math.floor(x * range) + 1];
  return blendColor(
    c1[0],
    c1[1],
    c1[2],
    c2[0],
    c2[1],
    c2[2],
    (x % (1 / range)) * range
  );
}
