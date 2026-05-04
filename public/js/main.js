// ── Cursor personalizado ──────────────────────────────────────
const cur = document.getElementById('cur');
const curR = document.getElementById('curR');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove', e => {
  mx=e.clientX; my=e.clientY;
  cur.style.left=mx+'px'; cur.style.top=my+'px';
});
(function animR(){
  rx+=(mx-rx)*.12; ry+=(my-ry)*.12;
  curR.style.left=rx+'px'; curR.style.top=ry+'px';
  requestAnimationFrame(animR);
})();
document.addEventListener('mouseover', e => {
  if(e.target.closest('a,button,.gi,.tcard,.srv,.pkg')) curR.classList.add('big');
  else curR.classList.remove('big');
});

// ── Loader ────────────────────────────────────────────────────
window.addEventListener('load', () => setTimeout(() => document.getElementById('loader').classList.add('out'), 2200));

// ── Navbar ────────────────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('sc', scrollY > 60);
  document.getElementById('progress').style.width = (scrollY/(document.body.scrollHeight-innerHeight)*100)+'%';
  checkReveal();
  checkCounters();
});

// Hamburger
document.getElementById('ham').addEventListener('click', () => {
  document.getElementById('nav-links').classList.toggle('open');
});

// ── Hero parallax + particles ─────────────────────────────────
window.addEventListener('scroll', () => {
  const heroBg = document.getElementById('hero-bg');
  if(heroBg) heroBg.style.transform = `scale(1.06) translateY(${scrollY*.1}px)`;
});

(function(){
  const c = document.getElementById('particles');
  if(!c) return;
  for(let i=0;i<18;i++){
    const p=document.createElement('div'); p.className='particle';
    p.style.cssText=`left:${Math.random()*100}%;width:${Math.random()*2+1}px;height:${Math.random()*2+1}px;animation-duration:${Math.random()*8+6}s;animation-delay:${Math.random()*8}s`;
    c.appendChild(p);
  }
})();

// ── Reveal on scroll ──────────────────────────────────────────
function checkReveal(){
  document.querySelectorAll('.reveal:not(.vis)').forEach(el => {
    const rect = el.getBoundingClientRect();
    if(rect.top < window.innerHeight - 80) el.classList.add('vis');
  });
}
checkReveal();

// ── Animated counters ─────────────────────────────────────────
let countersRan = false;
function checkCounters(){
  if(countersRan) return;
  const strip = document.querySelector('.counter-strip');
  if(!strip) return;
  const rect = strip.getBoundingClientRect();
  if(rect.top < window.innerHeight - 50){
    countersRan = true;
    document.querySelectorAll('.count').forEach(el => {
      const target = parseInt(el.dataset.target);
      const suffix = el.dataset.target.includes('+') ? '+' : (el.textContent.includes('%') ? '%' : '');
      let current = 0;
      const step = Math.ceil(target / 60);
      const t = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current.toLocaleString('pt-BR') + suffix;
        if(current >= target) clearInterval(t);
      }, 25);
    });
  }
}

// ── Load site data & render ───────────────────────────────────
let siteData = {};
let allPhotos = [];
let lightboxIndex = 0;

async function loadSite(){
  try {
    const res = await fetch('/api/site');
    siteData = await res.json();
    renderAll();
  } catch(e){
    console.warn('Usando dados padrão');
  }
}

function renderAll(){
  renderHero();
  renderAbout();
  renderGallery();
  renderServices();
  renderPricing();
  renderTestimonials();
  renderContact();
}

function renderHero(){
  const h = siteData.hero;
  if(!h) return;
  const bg = document.getElementById('hero-bg');
  if(bg) bg.style.backgroundImage = `url(${h.bg_image})`;
  const pre = document.getElementById('hero-pre');
  if(pre) pre.innerHTML = h.pre;
  const title = document.getElementById('hero-title');
  if(title) title.innerHTML = h.title.replace(/\n/g,'<br>').replace('momento','<em>momento</em>');
  const desc = document.getElementById('hero-desc');
  if(desc) desc.textContent = h.desc;
  const num = document.getElementById('hero-num');
  if(num) num.textContent = h.badge_num;
}

function renderAbout(){
  const a = siteData.about;
  if(!a) return;
  const img = document.getElementById('about-img');
  if(img) img.src = a.image;
  const tag = document.getElementById('about-tag');
  if(tag) tag.textContent = a.tag;
  const p1 = document.getElementById('about-p1');
  if(p1) p1.textContent = a.p1;
  const p2 = document.getElementById('about-p2');
  if(p2) p2.textContent = a.p2;
  const stats = document.getElementById('about-stats');
  if(stats && a.stats){
    stats.innerHTML = a.stats.map(s =>
      `<div class="stat reveal"><div class="n">${s.n}</div><div class="l">${s.l}</div></div>`
    ).join('');
  }
}

function renderGallery(){
  const galleries = siteData.galleries;
  if(!galleries) return;

  // Build filter buttons
  const fw = document.getElementById('filter-wrap');
  if(fw){
    fw.innerHTML = '<button class="fbtn on" onclick="filterGallery(this,\'all\')">Todos</button>' +
      galleries.map(g => `<button class="fbtn" onclick="filterGallery(this,'${g.id}')">${g.name}</button>`).join('');
  }

  // Flatten all photos
  allPhotos = [];
  galleries.forEach(g => g.photos.forEach(p => allPhotos.push({...p, galleryId: g.id})));

  // Render grid
  renderGalleryGrid(allPhotos);
}

function renderGalleryGrid(photos){
  const grid = document.getElementById('gallery');
  if(!grid) return;
  grid.innerHTML = photos.map((p, i) => `
    <div class="gi" data-cat="${p.cat||p.galleryId}" data-index="${i}" onclick="openLightbox(${i})">
      <img src="${p.file}" alt="${p.title} - Fotógrafo casamento Divinópolis MG" loading="lazy">
      <div class="gi-ov">
        <span class="gi-tag">${getCatLabel(p.cat||p.galleryId)}</span>
        <span class="gi-title">${p.title}</span>
      </div>
    </div>`).join('');
}

function getCatLabel(cat){
  const labels = {cer:'Cerimônia', festa:'Festa', pw:'Pré-Wedding'};
  return labels[cat] || cat;
}

function filterGallery(btn, cat){
  document.querySelectorAll('.fbtn').forEach(b=>b.classList.remove('on'));
  btn.classList.add('on');
  const filtered = cat==='all' ? allPhotos : allPhotos.filter(p=>(p.cat||p.galleryId)===cat);
  renderGalleryGrid(filtered);
  checkReveal();
}

// ── Lightbox ──────────────────────────────────────────────────
function openLightbox(index){
  lightboxIndex = index;
  updateLightbox();
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function updateLightbox(){
  const p = allPhotos[lightboxIndex];
  if(!p) return;
  document.getElementById('lb-img').src = p.file;
  document.getElementById('lb-img').alt = p.title;
  document.getElementById('lb-caption').textContent = p.title;
}

document.getElementById('lb-close').addEventListener('click', () => {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
});
document.getElementById('lb-prev').addEventListener('click', () => {
  lightboxIndex = (lightboxIndex - 1 + allPhotos.length) % allPhotos.length;
  updateLightbox();
});
document.getElementById('lb-next').addEventListener('click', () => {
  lightboxIndex = (lightboxIndex + 1) % allPhotos.length;
  updateLightbox();
});
document.addEventListener('keydown', e => {
  if(!document.getElementById('lightbox').classList.contains('open')) return;
  if(e.key==='Escape') document.getElementById('lightbox').classList.remove('open'), document.body.style.overflow='';
  if(e.key==='ArrowLeft') { lightboxIndex=(lightboxIndex-1+allPhotos.length)%allPhotos.length; updateLightbox(); }
  if(e.key==='ArrowRight') { lightboxIndex=(lightboxIndex+1)%allPhotos.length; updateLightbox(); }
});

function renderServices(){
  const services = siteData.services;
  if(!services) return;
  const grid = document.getElementById('srv-grid');
  if(!grid) return;
  grid.innerHTML = services.map(s => `
    <div class="srv reveal">
      <div class="srv-num">${s.num}</div>
      <div class="srv-name">${s.name}</div>
      <p class="srv-desc">${s.desc}</p>
      <ul>${s.items.map(i=>`<li>${i}</li>`).join('')}</ul>
    </div>`).join('');
}

function renderPricing(){
  const pkgs = siteData.packages;
  if(!pkgs) return;
  const grid = document.getElementById('pkg-grid');
  if(!grid) return;
  grid.innerHTML = pkgs.map(p => `
    <div class="pkg${p.featured?' feat':''} reveal">
      ${p.featured?'<div class="pkg-badge">mais escolhido</div>':''}
      <div class="pkg-plan">${p.name}</div>
      <div class="pkg-val"><span>R$</span>${p.value}</div>
      <div class="pkg-per">${p.period}</div>
      <ul>${p.items.map(i=>`<li class="${i.active?'':'off'}">${i.text}</li>`).join('')}</ul>
      <button class="btn-pkg ${p.featured?'fill':'out'}" onclick="document.getElementById('contact').scrollIntoView({behavior:'smooth'})">Solicitar orçamento</button>
    </div>`).join('');
}

function renderTestimonials(){
  const ts = siteData.testimonials;
  if(!ts) return;
  const grid = document.getElementById('tsti-grid');
  if(!grid) return;
  grid.innerHTML = ts.map(t => {
    const initials = t.name.split('&').map(n=>n.trim()[0]).join('&');
    return `<div class="tcard reveal">
      <div class="tquote">"</div>
      <div class="tstars">★★★★★</div>
      <p class="ttext">${t.text}</p>
      <div class="tauthor">
        <div class="tavatar">${initials}</div>
        <div><div class="tname">${t.name}</div><div class="tdate">${t.date}</div></div>
      </div></div>`;
  }).join('');
}

function renderContact(){
  const c = siteData.contact;
  if(!c) return;
  const local = document.getElementById('c-local');
  if(local) local.textContent = c.local;
  const wpp = document.getElementById('c-wpp');
  if(wpp) wpp.textContent = c.wpp_display;
  const email = document.getElementById('c-email');
  if(email) email.textContent = c.email;
  const wa = document.getElementById('wa-btn');
  if(wa) wa.href = `https://wa.me/${c.wpp_link}`;
  const socials = document.getElementById('socials');
  if(socials){
    let links = '';
    if(c.instagram) links += `<a href="${c.instagram}" target="_blank" rel="noopener" class="slink" title="Instagram">📸</a>`;
    if(c.youtube) links += `<a href="${c.youtube}" target="_blank" rel="noopener" class="slink" title="YouTube">▶</a>`;
    links += `<a href="https://wa.me/${c.wpp_link}" target="_blank" rel="noopener" class="slink" title="WhatsApp">💬</a>`;
    socials.innerHTML = links;
  }
}

// ── Formulário de contato ─────────────────────────────────────
document.getElementById('contact-form').addEventListener('submit', async e => {
  e.preventDefault();
  const btn = document.getElementById('submit-btn');
  const suc = document.getElementById('fsuc');
  const err = document.getElementById('ferr');
  suc.style.display='none'; err.style.display='none';
  btn.disabled=true; btn.textContent='Enviando...';

  const body = {
    nome: document.getElementById('fnome').value,
    noivo: document.getElementById('fnoivo').value,
    tel: document.getElementById('ftel').value,
    data: document.getElementById('fdata').value,
    pacote: document.getElementById('fpkg').value,
    msg: document.getElementById('fmsg').value,
  };

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if(data.ok){
      suc.textContent = '✦ ' + data.message;
      suc.style.display='block';
      e.target.reset();
    } else {
      throw new Error(data.error);
    }
  } catch(ex){
    err.textContent = '✕ Erro ao enviar. Tente pelo WhatsApp.';
    err.style.display='block';
  }
  btn.disabled=false;
  btn.innerHTML='Enviar mensagem <span class="ar">→</span>';
});

// ── Init ──────────────────────────────────────────────────────
loadSite();
