(() => {
  const carousel = document.querySelector('.carousel');
  if (!carousel) return;
  const track = carousel.querySelector('.carousel-inner');
  const slides = [...carousel.querySelectorAll('.carousel-item')];
  const dots = [...carousel.querySelectorAll('.carousel-indicator')];
  const pause = carousel.querySelector('.carousel-pause');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0, timer, paused = reduceMotion.matches, touchStart = null;
  function show(next) {
    index = (next + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    slides.forEach((slide, i) => { slide.inert = i !== index; slide.setAttribute('aria-hidden', String(i !== index)); });
    dots.forEach((dot, i) => dot.setAttribute('aria-current', String(i === index)));
  }
  function stop() { clearInterval(timer); }
  function start() {
    stop();
    if (!paused && !document.hidden && !carousel.matches(':hover') && !carousel.contains(document.activeElement)) timer = setInterval(() => show(index + 1), 5500);
  }
  function move(step) { show(index + step); start(); }
  carousel.querySelector('.carousel-prev').addEventListener('click', () => move(-1));
  carousel.querySelector('.carousel-next').addEventListener('click', () => move(1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => { show(i); start(); }));
  carousel.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); move(e.key === 'ArrowRight' ? 1 : -1); }
  });
  function updatePause() { pause.textContent = paused ? '▷' : 'Ⅱ'; pause.setAttribute('aria-label', paused ? 'Play slideshow' : 'Pause slideshow'); }
  pause.addEventListener('click', () => { paused = !paused; updatePause(); start(); });
  carousel.addEventListener('mouseenter', stop);
  carousel.addEventListener('mouseleave', start);
  carousel.addEventListener('focusin', stop);
  carousel.addEventListener('focusout', () => setTimeout(start, 0));
  carousel.addEventListener('touchstart', e => { touchStart = e.changedTouches[0]; stop(); }, {passive:true});
  carousel.addEventListener('touchend', e => {
    if (touchStart) { const dx = e.changedTouches[0].clientX - touchStart.clientX; const dy = e.changedTouches[0].clientY - touchStart.clientY; if (Math.abs(dx)>50 && Math.abs(dx)>Math.abs(dy)) move(dx<0 ? 1 : -1); }
    touchStart = null; start();
  }, {passive:true});
  document.addEventListener('visibilitychange', start);
  reduceMotion.addEventListener('change', () => { paused = reduceMotion.matches; updatePause(); start(); });
  show(0); updatePause(); start();
})();
