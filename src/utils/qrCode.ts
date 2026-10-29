/**
 * Standalone QR Code Generator in pure TypeScript
 * Based on QR Code standard ISO/IEC 18004
 * Generates an SVG module matrix without any external dependencies.
 */

// Galois Field GF(256) math tables
const EXP_TABLE = new Uint8Array(512);
const LOG_TABLE = new Uint8Array(256);

(function initGaloisField() {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    EXP_TABLE[i] = x;
    EXP_TABLE[i + 255] = x;
    LOG_TABLE[x] = i;
    x <<= 1;
    if (x & 256) {
      x ^= 0x11d; // generator polynomial x^8 + x^4 + x^3 + x^2 + 1
    }
  }
})();

function gMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return EXP_TABLE[LOG_TABLE[a] + LOG_TABLE[b]];
}

function rsGeneratorPoly(degree: number): Uint8Array {
  const poly = new Uint8Array(degree + 1);
  poly[0] = 1;
  for (let i = 0; i < degree; i++) {
    const factor = EXP_TABLE[i];
    for (let j = i + 1; j > 0; j--) {
      poly[j] = poly[j] ^ gMul(poly[j - 1], factor);
    }
    poly[0] = gMul(poly[0], factor);
  }
  return poly;
}

function rsCompute(data: Uint8Array, ecCount: number): Uint8Array {
  const gen = rsGeneratorPoly(ecCount);
  const remainder = new Uint8Array(ecCount);

  for (let i = 0; i < data.length; i++) {
    const factor = data[i] ^ remainder[0];
    remainder.copyWithin(0, 1);
    remainder[ecCount - 1] = 0;
    for (let j = 0; j < ecCount; j++) {
      remainder[j] ^= gMul(gen[ecCount - j - 1], factor);
    }
  }
  return remainder;
}

// QR Code Version 2 (25x25) and Version 3 (29x29) and Version 4 (33x33) specs (Level M)
interface VersionSpec {
  version: number;
  size: number;
  totalBytes: number;
  dataBytes: number;
  ecBytes: number;
  alignmentPattern: number[];
}

const VERSIONS: VersionSpec[] = [
  { version: 1, size: 21, totalBytes: 26, dataBytes: 16, ecBytes: 10, alignmentPattern: [] },
  { version: 2, size: 25, totalBytes: 44, dataBytes: 28, ecBytes: 16, alignmentPattern: [6, 18] },
  { version: 3, size: 29, totalBytes: 70, dataBytes: 44, ecBytes: 26, alignmentPattern: [6, 22] },
  { version: 4, size: 33, totalBytes: 100, dataBytes: 64, ecBytes: 36, alignmentPattern: [6, 26] },
];

export function generateQrMatrix(text: string): boolean[][] {
  const encoder = new TextEncoder();
  const rawBytes = encoder.encode(text || 'RECEIPT');

  // Pick smallest version that can hold rawBytes (Byte mode has 4-bit mode + 8-bit length = 12 bits header)
  let chosenVersion = VERSIONS[0];
  for (const v of VERSIONS) {
    if (rawBytes.length + 2 <= v.dataBytes) {
      chosenVersion = v;
      break;
    }
    chosenVersion = v; // fallback to largest supported
  }

  const { size, dataBytes, ecBytes, alignmentPattern } = chosenVersion;

  // 1. Encode Data Stream in 8-bit Byte Mode
  const bitStream: number[] = [];
  function pushBits(val: number, len: number) {
    for (let i = len - 1; i >= 0; i--) {
      bitStream.push((val >> i) & 1);
    }
  }

  // Mode: 0100 (Byte mode)
  pushBits(0b0100, 4);
  // Character count indicator (8 bits for V1-V9 byte mode)
  pushBits(Math.min(rawBytes.length, 255), 8);
  for (let i = 0; i < rawBytes.length; i++) {
    pushBits(rawBytes[i], 8);
  }

  // Terminator (up to 4 zeroes)
  const maxBits = dataBytes * 8;
  const termLen = Math.min(4, maxBits - bitStream.length);
  pushBits(0, termLen);

  // Pad to multiple of 8
  while (bitStream.length % 8 !== 0) {
    bitStream.push(0);
  }

  // Pad bytes 0xEC, 0x11
  const padPatterns = [0b11101100, 0b00010001];
  let padIdx = 0;
  while (bitStream.length < maxBits) {
    pushBits(padPatterns[padIdx % 2], 8);
    padIdx++;
  }

  // Convert bits to byte array
  const dataArray = new Uint8Array(dataBytes);
  for (let i = 0; i < dataBytes; i++) {
    let byte = 0;
    for (let b = 0; b < 8; b++) {
      byte = (byte << 1) | bitStream[i * 8 + b];
    }
    dataArray[i] = byte;
  }

  // Compute Error Correction
  const ecArray = rsCompute(dataArray, ecBytes);

  // Combined full codeword stream
  const fullCodewords = new Uint8Array(dataBytes + ecBytes);
  fullCodewords.set(dataArray, 0);
  fullCodewords.set(ecArray, dataBytes);

  // 2. Initialize Matrix & Function Patterns
  const matrix: (boolean | null)[][] = Array.from({ length: size }, () =>
    Array(size).fill(null)
  );

  function setFinderPattern(r: number, c: number) {
    for (let i = -1; i <= 7; i++) {
      for (let j = -1; j <= 7; j++) {
        const nr = r + i;
        const nc = c + j;
        if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
          if (i === -1 || i === 7 || j === -1 || j === 7) {
            matrix[nr][nc] = false; // white separator
          } else if (
            i === 0 ||
            i === 6 ||
            j === 0 ||
            j === 6 ||
            (i >= 2 && i <= 4 && j >= 2 && j <= 4)
          ) {
            matrix[nr][nc] = true; // black
          } else {
            matrix[nr][nc] = false; // white
          }
        }
      }
    }
  }

  // 3 Finder patterns
  setFinderPattern(0, 0);
  setFinderPattern(0, size - 7);
  setFinderPattern(size - 7, 0);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    if (matrix[6][i] === null) matrix[6][i] = i % 2 === 0;
    if (matrix[i][6] === null) matrix[i][6] = i % 2 === 0;
  }

  // Dark module
  matrix[size - 8][8] = true;

  // Alignment pattern (if version >= 2)
  if (alignmentPattern.length > 0) {
    for (const r of alignmentPattern) {
      for (const c of alignmentPattern) {
        if (matrix[r][c] !== null) continue; // Skip if collides with finder
        for (let i = -2; i <= 2; i++) {
          for (let j = -2; j <= 2; j++) {
            const isBorder = Math.abs(i) === 2 || Math.abs(j) === 2;
            const isCenter = i === 0 && j === 0;
            matrix[r + i][c + j] = isBorder || isCenter;
          }
        }
      }
    }
  }

  // Reserve format info area
  for (let i = 0; i < 9; i++) {
    if (matrix[8][i] === null) matrix[8][i] = false;
    if (matrix[i][8] === null) matrix[i][8] = false;
    if (size - 1 - i < size) {
      if (matrix[8][size - 1 - i] === null) matrix[8][size - 1 - i] = false;
      if (matrix[size - 1 - i][8] === null) matrix[size - 1 - i][8] = false;
    }
  }

  // 3. Place Data Bits with Standard Mask Pattern 0 ( (r + c) % 2 == 0 )
  let bitIdx = 0;
  const totalBits = fullCodewords.length * 8;

  let upward = true;
  for (let right = size - 1; right > 0; right -= 2) {
    if (right === 6) right--; // skip vertical timing column

    for (let vert = 0; vert < size; vert++) {
      const r = upward ? size - 1 - vert : vert;
      for (let c = right; c >= right - 1; c--) {
        if (matrix[r][c] === null) {
          let bit = 0;
          if (bitIdx < totalBits) {
            const bytePos = Math.floor(bitIdx / 8);
            const bitOffset = 7 - (bitIdx % 8);
            bit = (fullCodewords[bytePos] >> bitOffset) & 1;
            bitIdx++;
          }
          // Invert bit if mask condition applies: (r + c) % 2 === 0
          const mask = (r + c) % 2 === 0;
          matrix[r][c] = (bit === 1) !== mask;
        }
      }
    }
    upward = !upward;
  }

  // 4. Format Info for Level M + Mask 000 (101010000010010)
  const formatBits = [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0];
  // Coordinates around top-left
  const coords1 = [
    [8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 7], [8, 8],
    [7, 8], [5, 8], [4, 8], [3, 8], [2, 8], [1, 8], [0, 8]
  ];
  for (let i = 0; i < 15; i++) {
    const [r, c] = coords1[i];
    matrix[r][c] = formatBits[i] === 1;
  }

  // Second copy of format info
  for (let i = 0; i < 7; i++) {
    matrix[size - 1 - i][8] = formatBits[i] === 1;
  }
  for (let i = 7; i < 15; i++) {
    matrix[8][size - 15 + i] = formatBits[i] === 1;
  }

  // Return clean boolean 2D grid
  return matrix.map((row) => row.map((cell) => cell === true));
}
