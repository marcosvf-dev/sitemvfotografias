function toggleTheme(){
  const isDark=document.documentElement.getAttribute('data-theme')==='dark';
  const newTheme=isDark?'light':'dark';
  document.documentElement.setAttribute('data-theme',newTheme);
  localStorage.setItem('mv-theme',newTheme);
  document.getElementById('themeIcon').textContent=newTheme==='dark'?'☀️':'🌙';
  document.getElementById('themeLabel').textContent=newTheme==='dark'?'claro':'escuro';
}
(function(){
  const saved=localStorage.getItem('mv-theme')||'light';
  document.documentElement.setAttribute('data-theme',saved);
  const icon=document.getElementById('themeIcon');
  const label=document.getElementById('themeLabel');
  if(icon) icon.textContent=saved==='dark'?'☀️':'🌙';
  if(label) label.textContent=saved==='dark'?'claro':'escuro';
})();
const cur=document.getElementById('cur');
const curR=document.getElementById('curR');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px';});
(function animR(){rx+=(mx-rx)*.12;ry+=(my-ry)*.12;curR.style.left=rx+'px';curR.style.top=ry+'px';requestAnimationFrame(animR);})();
document.addEventListener('mouseover',e=>{const t=e.target.closest('a,button,.gi,.tcard,.srv,.pkg,.album-card,.cine-slide,.hf-opt');if(t){curR.classList.add('big');if(t.closest('.gi,.cine-slide,.album-card'))curR.classList.add('photo');else curR.classList.remove('photo');}else curR.classList.remove('big','photo');});
window.addEventListener('load',()=>setTimeout(()=>document.getElementById('loader').classList.add('out'),2200));
const nav=document.getElementById('nav');
window.addEventListener('scroll',()=>{nav.classList.toggle('sc',scrollY>60);document.getElementById('progress').style.width=(scrollY/(document.body.scrollHeight-innerHeight)*100)+'%';checkReveal();checkCounters();});
document.getElementById('ham').addEventListener('click',()=>document.getElementById('nav-links').classList.toggle('open'));
(function(){const c=document.getElementById('particles');if(!c)return;for(let i=0;i<18;i++){const p=document.createElement('div');p.className='particle';p.style.cssText=`left:${Math.random()*100}%;width:${Math.random()*2+1}px;height:${Math.random()*2+1}px;animation-duration:${Math.random()*8+6}s;animation-delay:${Math.random()*8}s`;c.appendChild(p);}})();

let heroImages=['/img/hero.jpg','/img/g4.jpg','/img/pw1.jpg','/img/pw2.jpg','/img/g2.jpg'];
let heroIdx=0,heroTimer;

function initHeroSlides(){
  const cont=document.getElementById('hero-slides');
  const dots=document.getElementById('hero-dots');
  if(!cont)return;
  cont.innerHTML='';
  dots.innerHTML='';
  heroImages.forEach((src,i)=>{
    const div=document.createElement('div');
    div.className='hero-slide'+(i===0?' active':'');
    div.style.backgroundImage=`url(${src})`;
    cont.appendChild(div);
    const dot=document.createElement('button');
    dot.className='hero-dot'+(i===0?' active':'');
    dot.setAttribute('aria-label','Slide '+(i+1));
    dot.onclick=()=>goHeroSlide(i);
    dots.appendChild(dot);
  });
  clearInterval(heroTimer);
  heroTimer=setInterval(()=>goHeroSlide((heroIdx+1)%heroImages.length),5000);
}

function goHeroSlide(idx){
  const slides=document.querySelectorAll('.hero-slide');
  const dots=document.querySelectorAll('.hero-dot');
  if(!slides[heroIdx]||!slides[idx])return;
  slides[heroIdx].classList.remove('active');
  dots[heroIdx].classList.remove('active');
  heroIdx=idx;
  slides[heroIdx].classList.add('active');
  dots[heroIdx].classList.add('active');
  clearInterval(heroTimer);
  heroTimer=setInterval(()=>goHeroSlide((heroIdx+1)%heroImages.length),5000);
}

function checkReveal(){document.querySelectorAll('.reveal:not(.vis),.reveal-left:not(.vis),.reveal-right:not(.vis),.reveal-scale:not(.vis)').forEach(el=>{if(el.getBoundingClientRect().top<window.innerHeight-80)el.classList.add('vis');});}
checkReveal();

let countersRan=false;
function checkCounters(){if(countersRan)return;const s=document.querySelector('.counter-strip');if(!s||s.getBoundingClientRect().top>=window.innerHeight-50)return;countersRan=true;document.querySelectorAll('.count').forEach(el=>{const target=parseInt(el.dataset.target);let c2=0;const step=Math.ceil(target/60);const t=setInterval(()=>{c2=Math.min(c2+step,target);el.textContent=c2.toLocaleString('pt-BR');if(c2>=target)clearInterval(t);},25);});}

let siteData={},allPhotos=[],lightboxPhotos=[],lightboxIndex=0;

async function loadSite(){
  try{
    const r=await fetch('/api/site');
    siteData=await r.json();
    if(siteData.heroPhotos&&siteData.heroPhotos.length){
      heroImages=siteData.heroPhotos;
    }
    initHeroSlides();
    renderAll();
  }catch(e){
    initHeroSlides();
    console.warn('erro ao carregar dados');
  }
}

function renderAll(){renderHero();renderAbout();renderGallery();renderAlbums();renderServices();renderPricing();renderTestimonials();renderContact();}

function renderHero(){
  const h=siteData.hero||{};
  const pre=document.getElementById('hero-pre');if(pre&&h.pre)pre.textContent=h.pre;
  const title=document.getElementById('hero-title');if(title&&h.title)title.innerHTML=h.title.replace(/\n/g,'<br>').replace('momento','<em>momento</em>');
  const desc=document.getElementById('hero-desc');if(desc&&h.desc)desc.textContent=h.desc;
}

function renderAbout(){
  const a=siteData.about||{};
  const img=document.getElementById('about-img');if(img&&a.image)img.src=a.image;
  const tag=document.getElementById('about-tag');if(tag&&a.tag)tag.textContent=a.tag;
  const p1=document.getElementById('about-p1');if(p1&&a.p1)p1.textContent=a.p1;
  const p2=document.getElementById('about-p2');if(p2&&a.p2)p2.textContent=a.p2;
  const stats=document.getElementById('about-stats');
  if(stats&&a.stats)stats.innerHTML=a.stats.map(s=>`<div class="stat reveal"><div class="n">${s.n}</div><div class="l">${s.l}</div></div>`).join('');
}

function renderGallery(){
  const gals=siteData.galleries||[];allPhotos=[];
  gals.forEach(g=>g.photos.forEach(p=>allPhotos.push({...p,galleryId:g.id,galleryName:g.name})));
  lightboxPhotos=[...allPhotos];
  const fw=document.getElementById('filter-wrap');
  if(fw)fw.innerHTML='<button class="fbtn on" onclick="filterGallery(this,\'all\')">Todos</button>'+gals.map(g=>`<button class="fbtn" onclick="filterGallery(this,'${g.id}')">${g.name}</button>`).join('');
  renderCine(allPhotos);renderGrid(allPhotos);
}

function renderCine(photos){
  const c=document.getElementById('cine-gallery');if(!c)return;
  c.innerHTML=photos.map((p,i)=>`<div class="cine-slide" onclick="openLB(${i},cinePhotos)"><img src="${p.file}" alt="${p.title}" loading="lazy"><div class="cine-info"><div><div class="cine-cat">${p.galleryName||''}</div><div class="cine-title">${p.title}</div></div><div class="cine-num">0${i+1}</div></div></div>`).join('');
  window.cinePhotos=[...photos];
}

function renderGrid(photos){
  const g=document.getElementById('gallery-grid');if(!g)return;
  g.innerHTML=photos.map((p,i)=>`<div class="gi" onclick="openLB(${i},gridPhotos)"><img src="${p.file}" alt="${p.title}" loading="lazy"><div class="gi-ov"><span class="gi-tag">${p.galleryName||''}</span><span class="gi-title">${p.title}</span></div></div>`).join('');
  window.gridPhotos=[...photos];
}

function filterGallery(btn,cat){
  document.querySelectorAll('.fbtn').forEach(b=>b.classList.remove('on'));btn.classList.add('on');
  const f=cat==='all'?[...allPhotos]:allPhotos.filter(p=>(p.cat||p.galleryId)===cat);
  lightboxPhotos=f.length?f:allPhotos;renderCine(lightboxPhotos);renderGrid(lightboxPhotos);
}

function setView(view,btn){
  document.querySelectorAll('.vtbtn').forEach(b=>b.classList.remove('on'));btn.classList.add('on');
  document.getElementById('cine-gallery').style.display=view==='cine'?'block':'none';
  document.getElementById('grid-wrap').style.display=view==='grid'?'block':'none';
}

function renderAlbums(){
  const albums=siteData.albums||[];const grid=document.getElementById('albums-grid');if(!grid)return;
  if(!albums.length){grid.innerHTML=`<div style="text-align:center;padding:60px;color:var(--fg3);font-size:13px">Adicione álbuns pelo painel admin.</div>`;return;}
  grid.innerHTML=albums.map((a,i)=>`<div class="album-card reveal rd${(i%3)+1}" onclick="openAlbum(${i})"><img src="${a.cover||'/img/hero.jpg'}" alt="${a.title}" loading="lazy"><div class="album-card-ov"><div class="album-card-date">${a.date||''}</div><div class="album-card-title">${a.title}</div><div class="album-card-local">${a.local||''}</div></div><div class="album-card-count">${(a.photos||[]).length} fotos</div></div>`).join('');
}

function openAlbum(i){
  const a=(siteData.albums||[])[i];if(!a)return;
  document.getElementById('ap-date').textContent=a.date||'';
  document.getElementById('ap-title').textContent=a.title;
  document.getElementById('ap-local').textContent=a.local||'';
  document.getElementById('ap-grid').innerHTML=(a.photos||[]).map((p,j)=>`<div class="ap-photo" onclick="openAlbumLB(${j},${i})"><img src="${p.file||p}" alt="${p.title||''}" loading="lazy"></div>`).join('');
  const page=document.getElementById('album-page');
  page.style.display='block';setTimeout(()=>page.classList.add('open'),10);document.body.style.overflow='hidden';
}

function closeAlbum(){
  const page=document.getElementById('album-page');page.classList.remove('open');
  setTimeout(()=>{page.style.display='none';document.body.style.overflow='';},600);
}

function openAlbumLB(idx,ai){
  const photos=(siteData.albums[ai].photos||[]).map(p=>({file:p.file||p,title:p.title||''}));
  lightboxPhotos=photos;openLB(idx,photos);
}

function openLB(index,photos){
  if(photos)lightboxPhotos=photos;
  lightboxIndex=index;
  document.getElementById('lb-img').src=lightboxPhotos[index]?.file||'';
  document.getElementById('lb-caption').textContent=lightboxPhotos[index]?.title||'';
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow='hidden';
}

document.getElementById('lb-close').addEventListener('click',()=>{document.getElementById('lightbox').classList.remove('open');document.body.style.overflow='';});
document.getElementById('lb-prev').addEventListener('click',()=>{lightboxIndex=(lightboxIndex-1+lightboxPhotos.length)%lightboxPhotos.length;document.getElementById('lb-img').src=lightboxPhotos[lightboxIndex]?.file||'';document.getElementById('lb-caption').textContent=lightboxPhotos[lightboxIndex]?.title||'';});
document.getElementById('lb-next').addEventListener('click',()=>{lightboxIndex=(lightboxIndex+1)%lightboxPhotos.length;document.getElementById('lb-img').src=lightboxPhotos[lightboxIndex]?.file||'';document.getElementById('lb-caption').textContent=lightboxPhotos[lightboxIndex]?.title||'';});
document.addEventListener('keydown',e=>{const lb=document.getElementById('lightbox');if(!lb.classList.contains('open'))return;if(e.key==='Escape'){lb.classList.remove('open');document.body.style.overflow='';}if(e.key==='ArrowLeft')document.getElementById('lb-prev').click();if(e.key==='ArrowRight')document.getElementById('lb-next').click();});

function renderServices(){
  const s=siteData.services||[];const g=document.getElementById('srv-grid');if(!g)return;
  g.innerHTML=s.map(sv=>`<div class="srv reveal"><div class="srv-num">${sv.num}</div><div class="srv-name">${sv.name}</div><p class="srv-desc">${sv.desc}</p><ul>${sv.items.map(i=>`<li>${i}</li>`).join('')}</ul></div>`).join('');
}

function renderPricing(){
  const pkgs=siteData.packages||[];const g=document.getElementById('pkg-grid');if(!g)return;
  g.innerHTML=pkgs.map(p=>`<div class="pkg${p.featured?' feat':''} reveal">${p.featured?'<div class="pkg-badge">mais escolhido</div>':''}<div class="pkg-plan">${p.name}</div><div class="pkg-val"><span>R$</span>${p.value}</div><div class="pkg-per">${p.period}</div><ul>${p.items.map(i=>`<li class="${i.active?'':'off'}">${i.text}</li>`).join('')}</ul><button class="btn-pkg ${p.featured?'fill':'out'}" onclick="document.getElementById('contact').scrollIntoView({behavior:'smooth'})">Solicitar orçamento</button></div>`).join('');
}

function renderTestimonials(){
  const ts=siteData.testimonials||[];const g=document.getElementById('tsti-grid');if(!g)return;
  g.innerHTML=ts.map(t=>`<div class="tcard reveal-scale">${t.photo?`<img src="${t.photo}" alt="$
