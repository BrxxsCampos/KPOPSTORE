/* Contador de escassez do Drop 01 — inicia em 500 e para em 86 unidades. */
(function () {
  'use strict';

  var INICIO = 500;
  var MINIMO = 86;
  var INTERVALO_MS = 3200;

  var contador = document.querySelector('[data-estoque-atual]');
  var barra = document.querySelector('[data-estoque-barra]');
  var rotulo = document.querySelector('[data-estoque-rotulo]');
  var aviso = document.querySelector('[data-estoque-aviso]');
  if (!contador) return;

  var restante = INICIO;

  function formatar(n) {
    return n.toLocaleString('pt-BR');
  }

  function render() {
    contador.textContent = formatar(restante);
    var pct = Math.max(0, Math.min(100, (restante / INICIO) * 100));
    if (barra) {
      barra.style.width = pct.toFixed(2) + '%';
      barra.setAttribute('aria-valuenow', String(restante));
      barra.parentElement && barra.parentElement.setAttribute('aria-valuetext', formatar(restante) + ' unidades restantes');
    }
    if (restante <= MINIMO) {
      if (rotulo) rotulo.textContent = 'Restam apenas ' + formatar(restante) + ' unidades';
      if (aviso) {
        aviso.textContent = 'Últimas unidades do Drop 01 — quando acabar, não repõe.';
        aviso.classList.add('is-visible');
      }
      document.documentElement.classList.add('is-low-stock');
    }
  }

  function tick() {
    if (restante <= MINIMO) {
      clearInterval(timer);
      return;
    }
    restante = Math.max(MINIMO, restante - (1 + Math.floor(Math.random() * 3)));
    render();
  }

  render();
  var timer = setInterval(tick, INTERVALO_MS);

  // Pausa a contagem quando a aba não está visível (evita "sumir" unidades em segundo plano).
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      clearInterval(timer);
    } else if (restante > MINIMO) {
      timer = setInterval(tick, INTERVALO_MS);
    }
  });
})();