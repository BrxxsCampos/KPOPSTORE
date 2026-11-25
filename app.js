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
      if (v.length === 8 && pagamento && pagamento.hidden) {
        pagamento.hidden = false;
        if (msg) {
          msg.textContent = 'Frete promocional de R$ 37,00 liberado para o seu CEP.';
          msg.classList.add('is-ok');
        }
      }
    });
  }

  /* ---------- validação do formulário ---------- */
  var form = document.getElementById('formCheckout');
  var msg = document.getElementById('formMsg');
  var pagamento = document.getElementById('pagamento');
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
        if (msg) { msg.textContent = 'Revise os campos destacados.'; msg.classList.remove('is-ok'); }
        var firstBad = form.querySelector('.field--invalid input');
        if (firstBad) firstBad.focus();
        return;
      }
      if (msg) msg.textContent = '';
      showToast('Recebido! Confira o frete promocional abaixo.');
      if (pagamento) {
        pagamento.hidden = false;
        pagamento.classList.add('is-in');
      }
      if (msg) {
        msg.textContent = 'Dados confirmados! Frete promocional de R$ 37,00 liberado abaixo.';
        msg.classList.add('is-ok');
      }
      form.reset();
      if (pagamento) pagamento.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  /* ---------- Pix: BR Code (EMV) + QR Code ---------- */
  var btnPix = document.getElementById('btnPix');
  var pixPanel = document.getElementById('pixPanel');
  var pixQr = document.getElementById('pixQr');
  var pixPayload = document.getElementById('pixPayload');
  var pixStatus = document.getElementById('pixStatus');
  var btnCopiar = document.getElementById('btnCopiar');
  var btnCopiarLink = document.getElementById('btnCopiarLink');

  var PIX = {
    valor: '37.00',
    chave: 'pix@kpopstore.com.br',
    nome: 'KPOPSTORE',
    cidade: 'SAO PAULO',
    txid: 'DROP01'
  };

  function tlv(id, value) {
    var v = String(value);
    var len = String(v.length);
    if (len.length < 2) len = '0' + len;
    return id + len + v;
  }

  function crc16(payload) {
    var crc = 0xFFFF;
    for (var i = 0; i < payload.length; i++) {
      crc ^= payload.charCodeAt(i) << 8;
      for (var j = 0; j < 8; j++) {
        crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) : (crc << 1);
        crc &= 0xFFFF;
      }
    }
    return ('0000' + crc.toString(16).toUpperCase()).slice(-4);
  }

  function buildPixPayload() {
    var merchant = tlv('00', 'br.gov.bcb.pix') + tlv('01', PIX.chave);
    var additional = tlv('05', PIX.txid);
    var body =
      tlv('00', '01') +
      tlv('01', '12') +
      tlv('26', merchant) +
      tlv('52', '0000') +
      tlv('53', '986') +
      tlv('54', PIX.valor) +
      tlv('58', 'BR') +
      tlv('59', PIX.nome) +
      tlv('60', PIX.cidade) +
      tlv('62', additional) +
      '6304';
    return body + crc16(body);
  }

  var qrLibPromise = null;
  function loadQrLib() {
    if (window.qrcode) return Promise.resolve(window.qrcode);
    if (qrLibPromise) return qrLibPromise;
    qrLibPromise = new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js';
      s.async = true;
      s.onload = function () { window.qrcode ? resolve(window.qrcode) : reject(new Error('qr')); };
      s.onerror = function () { reject(new Error('qr')); };
      document.head.appendChild(s);
    });
    return qrLibPromise;
  }

  function drawQR(container, text) {
    container.innerHTML = '<p class="pix__qrup">Gerando QR Code…</p>';
    loadQrLib().then(function (lib) {
      var qr = lib(0, 'M');
      qr.addData(text);
      qr.make();
      container.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 2, scalable: true });
      var svg = container.querySelector('svg');
      if (svg) {
        svg.setAttribute('width', '210');
        svg.setAttribute('height', '210');
        svg.style.borderRadius = '12px';
        svg.style.background = '#fff';
      }
    }).catch(function () {
      container.innerHTML = '<p class="pix__qrup">Não foi possível carregar o QR Code aqui. Use o código copia e cola ao lado para pagar pelo Pix.</p>';
    });
  }

  function copyText(text, okMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        if (pixStatus) pixStatus.textContent = okMsg;
      }).catch(function () {
        fallbackCopy(text, okMsg);
      });
    } else {
      fallbackCopy(text, okMsg);
    }
  }

  function fallbackCopy(text, okMsg) {
    if (!pixPayload) return;
    pixPayload.focus();
    pixPayload.select();
    try { document.execCommand('copy'); } catch (e) {}
    if (pixStatus) pixStatus.textContent = okMsg;
  }

  if (btnPix) {
    btnPix.addEventListener('click', function () {
      if (pagamento && pagamento.hidden) {
        pagamento.hidden = false;
      }
      var payload = buildPixPayload();
      if (pixPayload) pixPayload.value = payload;
      if (pixPanel) pixPanel.hidden = false;
      if (pixQr) drawQR(pixQr, payload);
      btnPix.textContent = 'Pix gerado ✓';
      btnPix.classList.add('is-done');
      if (pixStatus) pixStatus.textContent = 'Pix de R$ 37,00 pronto para pagamento.';
      showToast('Código Pix gerado. Pague e seu pedido é confirmado na hora.');
    });
  }

  if (btnCopiar) {
    btnCopiar.addEventListener('click', function () {
      copyText(pixPayload ? pixPayload.value : '', 'Código Pix copiado!');
    });
  }

  if (btnCopiarLink) {
    btnCopiarLink.addEventListener('click', function () {
      var payload = pixPayload ? pixPayload.value : '';
      var link = 'https://kpopstore.com.br/pagamento?pix=' + encodeURIComponent(payload);
      copyText(link, 'Link de pagamento copiado!');
    });
  }
})();
