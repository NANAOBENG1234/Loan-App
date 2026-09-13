// Generates the PWA app icons (BoA Micro Finance brand) as PNG without
// any image library. Run: node scripts/generate-icons.mjs
import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";

const CRC_TABLE = new Int32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c;
});

function crc32(buf) {
  let c = -1;
  for (const byte of buf) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crc]);
}

function png(width, height, pixelFn) {
  const raw = Buffer.alloc(height * (width * 4 + 1));
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0; // filter: none
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = pixelFn(x, y);
      const offset = y * (width * 4 + 1) + 1 + x * 4;
      raw[offset] = r;
      raw[offset + 1] = g;
      raw[offset + 2] = b;
      raw[offset + 3] = a;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// Brand-green gradient (#7ED957 -> #15803D) with a white coin badge.
function drawIcon(size) {
  return png(size, size, (x, y) => {
    const t = y / (size - 1);
    const lerp = (a, b) => Math.round(a + (b - a) * t);
    const cx = size / 2;
    const cy = size * 0.42;
    const rad = size * 0.26;
    const dx = x - cx;
    const dy = y - cy;
    if (dx * dx + dy * dy <= rad * rad) return [255, 255, 255, 255];
    return [lerp(0x7e, 0x15), lerp(0xd9, 0x80), lerp(0x57, 0x3d), 255];
  });
}

function inRoundedRect(x, y, x0, y0, x1, y1, r) {
  if (x < x0 || x > x1 || y < y0 || y > y1) return false;
  const cx = Math.max(x0 + r, Math.min(x, x1 - r));
  const cy = Math.max(y0 + r, Math.min(y, y1 - r));
  const dx = x - cx;
  const dy = y - cy;
  return dx * dx + dy * dy <= r * r;
}

// 9:16 add-to-home-screen placeholder (750x1334): brand gradient with a
// white UI card, so the manifest screenshot passes app-store validation.
function drawScreenshot(width, height) {
  return png(width, height, (x, y) => {
    const t = y / (height - 1);
    const lerp = (a, b) => Math.round(a + (b - a) * t);
    if (inRoundedRect(x, y, 70, 420, width - 70, 980, 28)) return [255, 255, 255, 255];
    // status-bar dots
    if (inRoundedRect(x, y, width / 2 - 40, 90, width / 2 + 40, 110, 10)) return [255, 255, 255, 230];
    return [lerp(0xf0, 0x7e), lerp(0xfd, 0xd9), lerp(0xf4, 0x57), 255];
  });
}

mkdirSync("public/icons", { recursive: true });
mkdirSync("public/screenshots", { recursive: true });
writeFileSync("public/icons/icon-192.png", drawIcon(192));
writeFileSync("public/icons/icon-512.png", drawIcon(512));
writeFileSync("public/screenshots/phone-home-750x1334.png", drawScreenshot(750, 1334));
console.log("Generated icons and 9:16 screenshot");