import { createCanvas } from '@napi-rs/canvas';
import { writeFileSync } from 'fs';

function drawIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const s = size / 512; // scale factor

  // Background circle
  ctx.beginPath();
  ctx.arc(256 * s, 256 * s, 240 * s, 0, Math.PI * 2);
  const bgGrad = ctx.createLinearGradient(0, 0, size, size);
  bgGrad.addColorStop(0, '#1a1a1a');
  bgGrad.addColorStop(1, '#111111');
  ctx.fillStyle = bgGrad;
  ctx.fill();
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 4 * s;
  ctx.stroke();

  // Rotate for cigarette angle
  ctx.save();
  ctx.translate(256 * s, 256 * s);
  ctx.rotate(-30 * Math.PI / 180);
  ctx.translate(-256 * s, -256 * s);

  const cx = 226 * s, cw = 60 * s;

  // Ash
  ctx.fillStyle = '#888';
  ctx.beginPath();
  ctx.roundRect(cx, 100 * s, cw, 30 * s, [15 * s, 15 * s, 0, 0]);
  ctx.fill();

  // Ember glow
  ctx.shadowColor = 'rgba(255, 100, 0, 0.8)';
  ctx.shadowBlur = 12 * s;
  const emberGrad = ctx.createLinearGradient(0, 128 * s, 0, 140 * s);
  emberGrad.addColorStop(0, '#ff4500');
  emberGrad.addColorStop(0.5, '#ff6b00');
  emberGrad.addColorStop(1, '#ffaa00');
  ctx.fillStyle = emberGrad;
  ctx.fillRect(cx, 128 * s, cw, 12 * s);
  ctx.shadowBlur = 0;

  // Paper
  const paperGrad = ctx.createLinearGradient(0, 138 * s, 0, 318 * s);
  paperGrad.addColorStop(0, '#ffffff');
  paperGrad.addColorStop(1, '#f0f0f0');
  ctx.fillStyle = paperGrad;
  ctx.fillRect(cx, 138 * s, cw, 180 * s);

  // Filter
  const filterGrad = ctx.createLinearGradient(0, 316 * s, 0, 396 * s);
  filterGrad.addColorStop(0, '#e8a862');
  filterGrad.addColorStop(0.5, '#dda15e');
  filterGrad.addColorStop(1, '#d4a574');
  ctx.fillStyle = filterGrad;
  ctx.beginPath();
  ctx.roundRect(cx, 316 * s, cw, 80 * s, [0, 0, 3 * s, 3 * s]);
  ctx.fill();

  // Filter lines
  ctx.strokeStyle = 'rgba(255,140,0,0.15)';
  ctx.lineWidth = 1 * s;
  for (let i = 0; i < 5; i++) {
    const x = (236 + i * 10) * s;
    ctx.beginPath();
    ctx.moveTo(x, 316 * s);
    ctx.lineTo(x, 396 * s);
    ctx.stroke();
  }

  ctx.restore();

  // Smoke wisps
  ctx.save();
  ctx.translate(256 * s, 256 * s);
  ctx.rotate(-30 * Math.PI / 180);
  ctx.translate(-256 * s, -256 * s);
  ctx.globalAlpha = 0.25;

  ctx.fillStyle = '#ccc';
  ctx.beginPath();
  ctx.ellipse(250 * s, 75 * s, 15 * s, 20 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ddd';
  ctx.globalAlpha = 0.18;
  ctx.beginPath();
  ctx.ellipse(265 * s, 50 * s, 20 * s, 15 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  return canvas;
}

// Generate all sizes
const sizes = { 'icon.png': 512, '32x32.png': 32, '128x128.png': 128, '128x128@2x.png': 256 };
const dir = 'src-tauri/icons/';

for (const [file, size] of Object.entries(sizes)) {
  const canvas = drawIcon(size);
  const buf = canvas.toBuffer('image/png');
  writeFileSync(dir + file, buf);
  console.log(`Generated ${file} (${size}x${size})`);
}

console.log('Done! Run: npm run tauri icon src-tauri/icons/icon.png');
