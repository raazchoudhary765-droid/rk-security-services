const yearEl = document.getElementById('year');
if(yearEl){ yearEl.textContent = new Date().getFullYear(); }

window.addEventListener('load', function(){
  lucide.createIcons();
  const loaderEl = document.getElementById('loader');
  if(loaderEl){ setTimeout(function(){ loaderEl.classList.add('hide'); }, 700); }
});

/* header scroll state + progress bar */
const header = document.getElementById('siteHeader');
const progress = document.getElementById('scrollProgress');
const toTop = document.getElementById('toTop');
window.addEventListener('scroll', function(){
  const y = window.scrollY;
  if(header) header.classList.toggle('scrolled', y > 40);
  if(toTop) toTop.classList.toggle('show', y > 500);
  if(progress){
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
  }
});
if(toTop) toTop.addEventListener('click', function(){ window.scrollTo({top:0,behavior:'smooth'}); });

/* dark mode toggle */
const modeToggle = document.getElementById('modeToggle');
if(modeToggle){
  modeToggle.addEventListener('click', function(){
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    modeToggle.innerHTML = isDark ? '<i data-lucide="sun"></i>' : '<i data-lucide="moon"></i>';
    lucide.createIcons();
  });
}

/* mobile drawer */
const burger = document.getElementById('burgerBtn');
const drawer = document.getElementById('mobileDrawer');
const overlay = document.getElementById('drawerOverlay');
const drawerClose = document.getElementById('drawerClose');
function openDrawer(){ if(drawer) drawer.classList.add('open'); if(overlay) overlay.classList.add('open'); }
function closeDrawer(){ if(drawer) drawer.classList.remove('open'); if(overlay) overlay.classList.remove('open'); }
if(burger) burger.addEventListener('click', openDrawer);
if(drawerClose) drawerClose.addEventListener('click', closeDrawer);
if(overlay) overlay.addEventListener('click', closeDrawer);
if(drawer) drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));

/* reveal on scroll */
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
}, {threshold:0.15});
revealEls.forEach(el => io.observe(el));

/* animated counters */
const counters = document.querySelectorAll('[data-count]');
const counterIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-count'));
      const isPercent = el.getAttribute('data-percent') === 'true';
      let cur = 0;
      const step = Math.max(1, Math.ceil(target / 60));
      const timer = setInterval(() => {
        cur += step;
        if(cur >= target){ cur = target; clearInterval(timer); }
        el.textContent = cur + (isPercent ? '%' : '+');
      }, 25);
      counterIO.unobserve(el);
    }
  });
}, {threshold:0.4});
counters.forEach(el => counterIO.observe(el));

/* FAQ accordion */
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');
  if(item.classList.contains('open')){ a.style.maxHeight = a.scrollHeight + 'px'; }
  q.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => { i.classList.remove('open'); i.querySelector('.faq-a').style.maxHeight = null; });
    if(!isOpen){ item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; }
  });
});

/* quote form (client-side demo submit) */
const quoteForm = document.getElementById('quoteForm');
if(quoteForm){
  quoteForm.addEventListener('submit', function(e){
    e.preventDefault();
    const note = document.getElementById('formNote');
    note.textContent = 'Thank you. Your request has been received — our team will contact you shortly.';
    note.style.color = '#1c8f4a';
    this.reset();
  });
}
const careerForm = document.getElementById('careerForm');
if(careerForm){
  careerForm.addEventListener('submit', function(e){
    e.preventDefault();
    const note = document.getElementById('careerFormNote');
    note.textContent = 'Thank you. Your application has been received — our HR team will contact you shortly.';
    note.style.color = '#1c8f4a';
    this.reset();
    const fname = this.querySelector('.fname');
    if(fname) fname.textContent = '';
  });
}
const recruitApplyForm = document.getElementById('recruitApplyForm');
if(recruitApplyForm){
  recruitApplyForm.addEventListener('submit', function(e){
    e.preventDefault();
    const note = document.getElementById('recruitApplyNote');
    note.textContent = 'Thank you. Your application and resume have been received.';
    note.style.color = '#1c8f4a';
    this.reset();
    const fname = this.querySelector('.fname');
    if(fname) fname.textContent = '';
  });
}

/* =====================================================================
   V2.0 ADDITIONS
   ===================================================================== */

/* timeline reveal (recruitment-process.html) */
const timelineItems = document.querySelectorAll('.timeline-item');
if(timelineItems.length){
  const tlIO = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in-view'); tlIO.unobserve(e.target); } });
  }, {threshold:0.3});
  timelineItems.forEach(el => tlIO.observe(el));
}

/* resume / file upload display */
document.querySelectorAll('.upload-field input[type="file"]').forEach(input => {
  const field = input.closest('.upload-field');
  const label = field ? field.querySelector('.fname') : null;
  input.addEventListener('change', function(){
    if(label) label.textContent = this.files.length ? ('Selected: ' + this.files[0].name) : '';
  });
});

/* gallery filter (gallery.html) */
const gfilterBtns = document.querySelectorAll('.gfilter-btn');
if(gfilterBtns.length){
  const galleryItems = document.querySelectorAll('.gallery-grid [data-cat]');
  gfilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      gfilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-filter');
      galleryItems.forEach(item => {
        const show = cat === 'all' || item.getAttribute('data-cat') === cat;
        item.style.display = show ? '' : 'none';
      });
    });
  });
}

/* ==========================
   PREMIUM GALLERY LIGHTBOX
========================== */

const lightbox = document.getElementById("lightbox");

if(lightbox){

const lbBox = lightbox.querySelector(".lb-box");

lbBox.innerHTML = `
<button class="lb-close">&times;</button>

<img id="lbImage" src="" alt="">

<h4 id="lbTitle"></h4>

`;

const lbImage = document.getElementById("lbImage");
const lbTitle = document.getElementById("lbTitle");

document.querySelectorAll(".gallery-item").forEach(item=>{

item.addEventListener("click",()=>{

const img=item.querySelector("img");

const caption=item.querySelector(".g-caption");

lbImage.src=img.src;

lbTitle.textContent=caption.textContent;

lightbox.classList.add("open");

});

});

lightbox.querySelector(".lb-close").onclick=function(){

lightbox.classList.remove("open");

}

lightbox.onclick=function(e){

if(e.target===lightbox){

lightbox.classList.remove("open");

}

}

document.addEventListener("keydown",function(e){

if(e.key==="Escape"){

lightbox.classList.remove("open");

}

});

}

/* client logo marquee — duplicate track for seamless loop */
document.querySelectorAll('.marquee-track').forEach(track => {
  if(!track.dataset.duplicated){
    track.innerHTML += track.innerHTML;
    track.dataset.duplicated = 'true';
  }
});

/* featured testimonial auto-slider */
const testiSlides = document.querySelectorAll('.testi-slide');
if(testiSlides.length > 1){
  let tIndex = 0;
  const dotsWrap = document.querySelector('.testi-dots');
  if(dotsWrap){
    testiSlides.forEach((s, i) => {
      const dot = document.createElement('button');
      if(i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => showSlide(i));
      dotsWrap.appendChild(dot);
    });
  }
  function showSlide(i){
    testiSlides.forEach(s => s.classList.remove('active'));
    testiSlides[i].classList.add('active');
    if(dotsWrap){
      dotsWrap.querySelectorAll('button').forEach((d, di) => d.classList.toggle('active', di === i));
    }
    tIndex = i;
  }
  setInterval(() => { showSlide((tIndex + 1) % testiSlides.length); }, 6000);
}

/* lazy-loaded image fade-in */
document.querySelectorAll('img.lazy-fade').forEach(img => {
  if(img.complete){ img.classList.add('loaded'); }
  else{ img.addEventListener('load', () => img.classList.add('loaded')); }
});

/* lightweight inline form validation feedback */
document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', function(e){
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      if(!field.value.trim()){
        valid = false;
        field.style.borderColor = '#d9534f';
        field.addEventListener('input', function fix(){ field.style.borderColor = ''; field.removeEventListener('input', fix); });
      }
    });
    if(!valid){ e.preventDefault(); e.stopImmediatePropagation(); }
  }, true);
});
