// =========================================================
// main.js — ponto de entrada da aplicação. Importa o router
// (que se auto-inicializa) e configura o único comportamento
// verdadeiramente global e independente de rota: o menu
// hambúrguer.
// =========================================================

import './router.js';

const botaoMenu = document.getElementById('botaoMenu');
const menuNav = document.getElementById('menuNav');

if (botaoMenu && menuNav) {
  botaoMenu.addEventListener('click', function () {
    const menuAberto = menuNav.classList.toggle('aberto');
    botaoMenu.setAttribute('aria-expanded', menuAberto);
  });
}