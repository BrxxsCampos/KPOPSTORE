(function () {
  /* ---------- menu mobile ---------- */
  var menuBtn = document.getElementById('menuBtn');
  var nav = document.getElementById('nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        nav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.setAttribute('aria-label', 'Abrir menu');
      }
    });
  }

  /* ---------- topbar sticky + barra de progresso ---------- */
  var topbar = document.querySelector('.topbar');
  var bar = document.getElementById('progressBar');
  function onScroll() {
    var y = window.scrollY || 0;
    if (topbar) topbar.classList.toggle('is-stuck', y > 12);
    if (bar) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- revelação ao rolar ---------- */
  var revealables = document.querySelectorAll('.reveal');
  if (revealables.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          var delay = Math.min(i * 70, 280);
          setTimeout(function () { entry.target.classList.add('is-in'); }, delay);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    Array.prototype.forEach.call(revealables, function (el) { io.observe(el); });
  } else {
    Array.prototype.forEach.call(revealables, function (el) { el.classList.add('is-in'); });
  }

  /* ---------- contadores ---------- */
  var counters = document.querySelectorAll('[data-count]');
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count')) || 0;
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    if (target === 0) { el.textContent = prefix + '0' + suffix; return; }
    var start = performance.now();
    var dur = 1100;
    function tick(now) {
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if (counters.length && 'IntersectionObserver' in window) {
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animateCount(entry.target); io2.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    Array.prototype.forEach.call(counters, function (el) { io2.observe(el); });
  }

  /* ---------- tilt suave no card do herói ---------- */
  var art = document.querySelector('.hero__art');
  if (art && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    art.addEventListener('mousemove', function (e) {
      var r = art.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      art.style.transform = 'perspective(1000px) rotateY(' + (x * 7).toFixed(2) + 'deg) rotateX(' + (-y * 7).toFixed(2) + 'deg)';
    });
    art.addEventListener('mouseleave', function () { art.style.transform = ''; });
  }

  /* ---------- toast ---------- */
  var toast = document.getElementById('toast');
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    window.setTimeout(function () { toast.classList.remove('show'); }, 4200);
  }

  /* ---------- máscara de CEP ---------- */
  var cep = document.getElementById('cep');
  if (cep) {
    cep.addEventListener('input', function () {
      var v = cep.value.replace(/\D/g, '').slice(0, 8);
      cep.value = v.length > 5 ? v.slice(0, 5) + '-' + v.slice(5) : v;
      cep.setSelectionRange(cep.value.length, cep.value.length);
    });
  }

  /* ---------- validação do formulário ---------- */
  var form = document.getElementById('formCheckout');
  var msg = document.getElementById('formMsg');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      ['nome', 'email', 'cep', 'endereco'].forEach(function (id) {
        var input = document.getElementById(id);
        var err = document.querySelector('[data-error-for="' + id + '"]');
        var value = (input.value || '').trim();
        var problem = '';
        if (!value) problem = 'Campo obrigatório.';
        else if (id === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) problem = 'E-mail inválido.';
        else if (id === 'cep' && value.replace(/\D/g, '').length !== 8) problem = 'CEP deve ter 8 dígitos.';
        if (err) err.textContent = problem;
        if (input.parentElement) input.parentElement.classList.toggle('field--invalid', !!problem);
        if (problem) ok = false;
      });
      if (!ok) {
        if (msg) msg.textContent = 'Revise os campos destacados.';
        var firstBad = form.querySelector('.field--invalid input');
        if (firstBad) firstBad.focus();
        return;
      }
      if (msg) msg.textContent = '';
      showToast('Recebido! Em breve enviamos o valor do frete para o seu e-mail.');
      form.reset();
    });
  }
})();
