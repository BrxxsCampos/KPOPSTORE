(function () {
  var menuBtn = document.getElementById('menuBtn');
  var nav = document.getElementById('nav');

  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        nav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  var toast = document.getElementById('toast');
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    window.setTimeout(function () { toast.classList.remove('show'); }, 4000);
  }

  var cep = document.getElementById('cep');
  if (cep) {
    cep.addEventListener('input', function () {
      var v = cep.value.replace(/\D/g, '').slice(0, 8);
      cep.value = v.length > 5 ? v.slice(0, 5) + '-' + v.slice(5) : v;
    });
  }

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
        return;
      }
      if (msg) msg.textContent = '';
      showToast('Recebido! Em breve enviamos o valor do frete para o seu e-mail.');
      form.reset();
    });
  }

  var cta = document.querySelector('.hero__art');
  if (cta && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    cta.addEventListener('mousemove', function (e) {
      var r = cta.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      cta.style.transform = 'perspective(900px) rotateY(' + (x * 6) + 'deg) rotateX(' + (-y * 6) + 'deg)';
    });
    cta.addEventListener('mouseleave', function () { cta.style.transform = ''; });
  }
})();
