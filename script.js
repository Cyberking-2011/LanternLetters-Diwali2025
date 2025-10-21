/* ----------------------------
   🎇 Fireworks + Sparkles Setup
----------------------------- */
const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');

let sparkles = [];
let fireworks = [];
const sparkleCount = 80;
const fireworkFrequency = 100; // higher = more frequent

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Initialize sparkles
for (let i = 0; i < sparkleCount; i++) {
  sparkles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + 1,
    dx: (Math.random() - 0.5) * 0.5,
    dy: (Math.random() - 0.5) * 0.5,
    opacity: Math.random(),
    glow: Math.random() * 0.8 + 0.2
  });
}

// Sparkle drawing
function drawSparkles() {
  for (let s of sparkles) {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 215, 0, ${s.opacity})`;
    ctx.shadowColor = 'gold';
    ctx.shadowBlur = s.glow * 10;
    ctx.fill();

    s.x += s.dx;
    s.y += s.dy;
    s.opacity += (Math.random() - 0.5) * 0.05;
    s.opacity = Math.max(0.1, Math.min(1, s.opacity));

    if (s.x < 0) s.x = canvas.width;
    if (s.x > canvas.width) s.x = 0;
    if (s.y < 0) s.y = canvas.height;
    if (s.y > canvas.height) s.y = 0;
  }
}

/* Firework particle class */
class Particle {
  constructor(x, y, color, dx, dy) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.dx = dx;
    this.dy = dy;
    this.alpha = 1;
  }
  update() {
    this.x += this.dx;
    this.y += this.dy;
    this.dy += 0.02; // gravity
    this.alpha -= 0.02;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
    ctx.fill();
  }
}

/* Firework launcher */
function launchFirework() {
  const startX = Math.random() * canvas.width;
  const startY = canvas.height;
  const targetY = Math.random() * canvas.height * 0.5;
  const color = `${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)}`;
  let y = startY;

  const fireInterval = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSparkles();
    fireworks.forEach(fw => fw.forEach(p => { p.update(); p.draw(); }));

    if (y > targetY) {
      y -= 5;
    } else {
      // explode into particles
      for (let i = 0; i < 50; i++) {
        const angle = Math.random() * 2 * Math.PI;
        const speed = Math.random() * 3 + 1;
        const dx = Math.cos(angle) * speed;
        const dy = Math.sin(angle) * speed;
        const particle = new Particle(startX, targetY, color, dx, dy);
        fireworks.push([particle]);
      }
      clearInterval(fireInterval);
    }
  }, 30);
}

/* Main animation loop */
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSparkles();
  fireworks.forEach((fw, index) => {
    fw.forEach(p => {
      p.update();
      p.draw();
    });
    // remove faded particles
    fireworks[index] = fw.filter(p => p.alpha > 0);
  });
  requestAnimationFrame(animate);
}
animate();

// Launch fireworks at intervals
setInterval(launchFirework, fireworkFrequency);

/* ----------------------------
   🏮 Lanterns + Wishes
----------------------------- */
const messages = [
  "May your path shine with quiet strength.",
  "You carry light wherever you go.",
  "Peace in thoughts, fire in dreams.",
  "The brightest Diya is the one inside you.",
  "Keep rising, just like these lanterns.",
  "BlackCipher wishes you endless light ✨"
];

const sky = document.getElementById('sky');
const finalMessage = document.getElementById('final-message');
const lanternCount = 12;
let clickedLanterns = 0;

function createLantern() {
  const lantern = document.createElement('div');
  lantern.classList.add('lantern');
  lantern.style.left = Math.random() * (window.innerWidth - 50) + 'px';
  lantern.style.top = window.innerHeight + Math.random() * 200 + 'px';
  lantern.style.animationDuration = 8 + Math.random() * 5 + 's';

  lantern.addEventListener('click', () => showWish(lantern));
  sky.appendChild(lantern);

  lantern.addEventListener('animationend', () => {
    lantern.remove();
    createLantern();
  });
}

function showWish(lantern) {
  clickedLanterns++;
  lantern.style.animationPlayState = 'paused';

  const wish = document.createElement('div');
  wish.classList.add('wish');
  wish.textContent = messages[Math.floor(Math.random() * messages.length)];
  wish.style.left = lantern.offsetLeft + 'px';
  wish.style.top = (lantern.offsetTop - 60) + 'px';

  sky.appendChild(wish);

  setTimeout(() => {
    wish.style.opacity = 1;
    wish.style.transform = 'translateY(-20px)';
  }, 50);

  setTimeout(() => {
    wish.style.opacity = 0;
    setTimeout(() => wish.remove(), 800);
  }, 4000);

  if (clickedLanterns === 6) finalMessage.style.opacity = 1;
}

for (let i = 0; i < lanternCount; i++) createLantern();
