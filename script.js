document.getElementById('year').textContent = new Date().getFullYear();

// Page transition: reveal on load
window.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('page-ready');
});

// Intercept same-site nav links for a soft fade
function softNavigate(href){
  document.body.classList.add('page-fade-out');
  setTimeout(()=>{ window.location.href = href; }, 200);
}
document.addEventListener('click', (e)=>{
  const a = e.target.closest('a[data-nav]');
  if (!a) return;
  const href = a.getAttribute('href');
  if (href && !href.startsWith('http') && !href.startsWith('#') && !a.hasAttribute('target')){
    e.preventDefault();
    softNavigate(href);
  }
});

// Hamburger / right-side drawer
const body = document.body;
const menuBtn = document.querySelector('.menu.edge.right');
const drawer = document.getElementById('drawer');
const scrim = document.querySelector('.scrim');
function setNav(open){
  body.classList.toggle('nav-open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  drawer.setAttribute('aria-hidden', String(!open));
}
menuBtn?.addEventListener('click', () => setNav(!body.classList.contains('nav-open')));
scrim?.addEventListener('click', () => setNav(false));
drawer?.addEventListener('click', (e)=>{
  const target = e.target;
  if (target.tagName === 'A') setNav(false);
});
window.addEventListener('keydown', (e)=>{ if (e.key === 'Escape') setNav(false); });

// Tilt effect
const hero = document.querySelector('.hero-visual');
const img = document.querySelector('.hero-img');
if (hero && img) {
  let rect;
  const updateRect = () => (rect = hero.getBoundingClientRect());
  updateRect();
  window.addEventListener('resize', updateRect);

  hero.addEventListener('mousemove', (e) => {
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const rotY = x * 12;
    const rotX = -y * 8;
    img.style.transform = `perspective(1000px) rotateY(${rotY}deg) rotateX(${rotX}deg) translateZ(8px)`;
  });
  hero.addEventListener('mouseleave', () => {
    img.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0)';
  });
}

// Matrix background (slowed)
(function matrixBackground(){
  const canvas = document.getElementById('matrix');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  let w, h, fontSize, columns, drops;

  const chars = '01';
  const SPEED_DIVISOR = 2; // 3/4 = slower

  function resize(){
    w = canvas.clientWidth = window.innerWidth;
    h = canvas.clientHeight = window.innerHeight;
    canvas.width = w * DPR;
    canvas.height = h * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    fontSize = Math.max(12, Math.floor(w / 100));
    columns = Math.ceil(w / fontSize);
    drops = Array.from({ length: columns }, () => Math.floor(Math.random() * h / fontSize));
    ctx.font = fontSize + 'px monospace';
  }
  window.addEventListener('resize', resize);
  resize();

  let frame = 0;
  function draw(){
    frame++;
    ctx.fillStyle = 'rgba(17, 18, 22, 0.08)';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(0, 255, 160, 0.20)';
    for (let i = 0; i < drops.length; i++) {
      const text = chars[Math.floor(Math.random() * chars.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;
      ctx.fillText(text, x, y);
      if (y > h && Math.random() > 0.975) drops[i] = 0;
      if (frame % SPEED_DIVISOR === 0) drops[i]++;
    }
    requestAnimationFrame(draw);
  }
  draw();
})();