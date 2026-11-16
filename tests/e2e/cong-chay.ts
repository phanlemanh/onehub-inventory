// The port a browser run's dev server listens on (row 1u). Both Playwright configurations pick a port from a hash of
// the checkout and the run, so two runs side by side never share one. Chrome refuses to open some ports ("Bad port:
// 3659 is reserved for apple-sasl"), and three of them sit inside the two ranges: 3659 (3500–3899) and 4045, 4190
// (4000–4899). A run that hashed onto one of them failed before any test ran, about one run in 400.

/**
 * Ports Chrome refuses to open: `kRestrictedPorts` in Chromium's net/base/port_util.cc
 * (https://source.chromium.org/chromium/chromium/src/+/main:net/base/port_util.cc).
 */
export const CHROME_BLOCKED_PORTS: ReadonlySet<number> = new Set([
  1, 7, 9, 11, 13, 15, 17, 19, 20, 21, 22, 23, 25, 37, 42, 43, 53, 69, 77, 79, 87, 95, 101, 102,
  103, 104, 109, 110, 111, 113, 115, 117, 119, 123, 135, 137, 139, 143, 161, 179, 389, 427, 465,
  512, 513, 514, 515, 526, 530, 531, 532, 540, 548, 554, 556, 563, 587, 601, 636, 989, 990, 993,
  995, 1719, 1720, 1723, 2049, 3659, 4045, 4190, 5060, 5061, 6000, 6566, 6665, 6666, 6667, 6668,
  6669, 6679, 6697, 10080,
]);

/**
 * The port for a run: `first + (hash % size)`, moved on to the next port Chrome accepts, wrapping inside
 * `first … first + size - 1`. `hash` is the first two bytes of the run's digest, read big-endian.
 */
export function chonCong(digest: Buffer, first: number, size: number): number {
  const start = digest.readUInt16BE(0) % size;
  for (let step = 0; step < size; step += 1) {
    const port = first + ((start + step) % size);
    if (!CHROME_BLOCKED_PORTS.has(port)) return port;
  }
  throw new Error(`cong-chay: every port of ${first}-${first + size - 1} is refused by Chrome`);
}

/** The two ranges the configurations use: plain browser tests, and browser tests on the lane's Postgres. */
export const KHOANG_E2E = { first: 3500, size: 400 } as const;
export const KHOANG_E2E_DB = { first: 4000, size: 900 } as const;
