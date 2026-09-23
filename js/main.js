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

const botaoTema = document.getElementById('botaoTema');
const CHAVE_TEMA = 'patas_e_lares_tema';

function aplicarTema(tema) {
  document.documentElement.setAttribute('data-tema', tema);
  if (botaoTema) botaoTema.textContent = tema === 'escuro' ? '☀️' : '🌙';
}

aplicarTema(localStorage.getItem(CHAVE_TEMA) || 'claro');

if (botaoTema) {
  botaoTema.addEventListener('click', function () {
    const atual = document.documentElement.getAttribute('data-tema') === 'escuro' ? 'claro' : 'escuro';
    localStorage.setItem(CHAVE_TEMA, atual);
    aplicarTema(atual);
  });
}