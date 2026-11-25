/* Contador de escassez do Drop 01 — mostra o quanto JÁ FOI DISTRIBUÍDO (total do lote: 500). */
(function () {
  'use strict';

  var TOTAL = 500;              // packs produzido no Drop 01
  var DISTRIBUIDOS_INICIO = 380; // já distribuidos no início da campanha
  var MIN_RESTANTES = 86;        // para quando restam 86 unidades
  var INTERVALO_MS = 3200;

  var elDistribuidos = document.querySelector('[data-estoque-distribuidos]');
  var elRestantes = document.querySelector('[data-estoque-restantes]');
  var barra = document.querySelector('[data-estoque-barra]');
  var rotulo = document.querySelector('[data-estoque-rotulo]');
  var aviso = document.querySelector('[data-estoque-aviso]');
  if (!elDistribuidos) return;

  var distribuidos = DISTRIBUIDOS_INICIO;
  var timer = null;

  function formatar(n) {
    return n.toLocaleString('pt-BR');
  }

  function restantes() {
    return TOTAL - distribuidos;
  }

  function render() {
    var rest = restantes();
    elDistribuidos.textContent = formatar(distribuidos) + '+';

    if (elRestantes) {
      elRestantes.textContent = formatar(rest);
    }

    var pct = Math.max(0, Math.min(100, (distribuidos / TOTAL) * 100));
    if (barra) {
      barra.style.width = pct.toFixed(2) + '%';
      barra.setAttribute('aria-valuenow', String(distribuidos));
      if (barra.parentElement) {
        barra.parentElement.setAttribute('aria-valuetext', formatar(distribuidos) + ' de ' + TOTAL + ' packs já distribuídos');
      }
    }

    if (rotulo) {
      rotulo.textContent = formatar(distribuidos) + '+ de ' + TOTAL + ' packs já distribuídos — restam apenas ' + formatar(rest) + '.';
    }

    if (rest <= MIN_RESTANTES) {
      if (aviso) {
        aviso.textContent = 'Últimas unidades do Drop 01 — quando acabar, não repõe.';
        aviso.classList.add('is-visible');
      }
      document.documentElement.classList.add('is-low-stock');
    }
  }

  function tick() {
    if (restantes() <= MIN_RESTANTES) {
      clearInterval(timer);
      timer = null;
      return;
    }
    distribuidos += 1 + Math.floor(Math.random() * 3);
    render();
  }

  function start() {
    if (!timer) timer = setInterval(tick, INTERVALO_MS);
  }

  render();
  start();

  // Pausa a contagem quando a aba não está visível (evita "sumir" unidades em segundo plano).
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      clearInterval(timer);
      timer = null;
    } else if (restantes() > MIN_RESTANTES) {
      start();
    }
  });
})();
