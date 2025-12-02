const canvas = document.getElementById("snow-canvas");
const pileCanvas = document.getElementById("snow-pile");

const ctx = canvas.getContext("2d");
const pileCtx = pileCanvas.getContext("2d");

let pileHeight = new Array(window.innerWidth).fill(0);

function resize() {
 canvas.width = window.innerWidth;
 canvas.height = window.innerHeight;
 pileCanvas.width = window.innerWidth;
 pileCanvas.height = window.innerHeight;
 pileHeight = new Array(pileCanvas.width).fill(0);
}

resize();
window.addEventListener("resize", resize);

const NUM_FLAKES = 200;
const flakes = [];

const DEPTHS = [0.3, 0.6, 1.0];

function makeFlake(depthScale) {
 return {
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height - canvas.height,
  r: (Math.random() * 2 + 1) * depthScale,
  speed: (Math.random() * 1 + 0.5) * depthScale,
  drift: Math.random() * 0.5 * depthScale,
  depthScale
 };
}

for (let i = 0; i < NUM_FLAKES; i++) {
 let depth = DEPTHS[Math.floor(Math.random() * DEPTHS.length)];
 flakes.push(makeFlake(depth));
}

let windAngle = 0;

function animateSnow() {
 ctx.clearRect(0, 0, canvas.width, canvas.height);

 windAngle += 0.002;
 let windForce = Math.sin(windAngle) * 1.5;

 for (let f of flakes) {
  ctx.beginPath();
  ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.fill();

  f.y += f.speed;
  f.x += f.drift + windForce * f.depthScale;

  if (f.x > canvas.width) f.x = 0;
  if (f.x < 0) f.x = canvas.width;

  if (f.y > canvas.height - pileHeight[Math.floor(f.x)]) {
   let px = Math.floor(f.x);
   if (px >= 0 && px < pileHeight.length) {
    pileHeight[px] += f.r * 0.8;  
   }

   drawSnowPile();

   let depth = DEPTHS[Math.floor(Math.random() * DEPTHS.length)];
   Object.assign(f, makeFlake(depth));
   f.y = -10;
  }
 }

 requestAnimationFrame(animateSnow);
}

function drawSnowPile() {
 pileCtx.clearRect(0, 0, pileCanvas.width, pileCanvas.height);
 pileCtx.fillStyle = "white";

 for (let x = 0; x < pileCanvas.width; x++) {
  let height = pileHeight[x];
  if (height > 0) {
   pileCtx.fillRect(x, pileCanvas.height - height, 1, height);
  }
 }
}

function meltSnow() {
 for (let i = 0; i < 50; i++) {  
  const x = Math.floor(Math.random() * pileHeight.length);
  if (pileHeight[x] > 0) {
   pileHeight[x] -= (Math.random() * 0.6); // melt different amounts
   if (pileHeight[x] < 0) pileHeight[x] = 0;
  }
 }

 drawSnowPile();
}

setInterval(meltSnow, 120);
animateSnow();