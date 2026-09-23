// =========================================================
// router.js — mapeia rotas (hash) para templates e orquestra
// a injeção de conteúdo no #app, delegando a inicialização
// específica de cada página aos módulos correspondentes.
// =========================================================

import { initPaginaCadastro } from './cadastro.js';
import { renderizarProjetos } from './projetos.js';

const app = document.getElementById('app');
const botaoMenu = document.getElementById('botaoMenu');
const menuNav = document.getElementById('menuNav');

const rotas = {
  '/': { template: 'template-home', titulo: 'Patas & Lares — Adoção responsável e resgate de animais' },
  '/projetos': { template: 'template-projetos', titulo: 'Nossos Projetos — Patas & Lares' },
  '/cadastro': { template: 'template-cadastro', titulo: 'Cadastro — Patas & Lares' }
};

function renderizarRota() {
  let caminho = window.location.hash.replace('#', '');
  if (!rotas[caminho]) caminho = '/';

  const rota = rotas[caminho];
  const template = document.getElementById(rota.template);

  app.innerHTML = '';
  app.appendChild(template.content.cloneNode(true));

  document.title = rota.titulo;

  document.querySelectorAll('#menuNav > li > a').forEach(function (link) {
    link.removeAttribute('aria-current');
  });
  const linkAtivo = document.querySelector('#menuNav > li > a[href="#' + caminho + '"]');
  if (linkAtivo) linkAtivo.setAttribute('aria-current', 'page');

  if (menuNav) {
    menuNav.classList.remove('aberto');
    botaoMenu.setAttribute('aria-expanded', 'false');
  }

  if (caminho === '/cadastro') {
    initPaginaCadastro();
  }

   if (caminho === '/projetos') {
    renderizarProjetos();

    // Se o link clicado tinha um destino específico (?destino=id), rola até lá
    const destino = window.location.hash.split('?destino=')[1];
    if (destino) {
      setTimeout(function () {
        const elemento = document.getElementById(destino);
        if (elemento) elemento.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  }

  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', renderizarRota);
window.addEventListener('DOMContentLoaded', renderizarRota);