// =========================================================
// projetos.js — dados dos projetos (fonte única) e a lógica
// que os transforma em HTML. Não sabe nada sobre rotas,
// formulário ou armazenamento.
// =========================================================

export const projetosData = [
  {
    id: 'resgate',
    img: 'img/resgate.jpg',
    alt: 'Voluntário segurando um filhote resgatado embrulhado em uma toalha',
    badge: 'Plantão 24h',
    titulo: 'Resgate de Emergência',
    descricao: 'Atendemos denúncias de maus-tratos e abandono, com equipe própria e parceria com clínicas veterinárias da região.',
    itens: ['120 resgates em 2025', 'Voluntários: motorista e apoio de campo']
  },
  {
    id: 'castracao',
    img: 'img/castracao.jpg',
    alt: 'Unidade móvel de atendimento veterinário estacionada, usada nos mutirões de castração',
    badge: 'Um sábado por mês',
    titulo: 'Castramóvel',
    descricao: 'Mutirões mensais de castração gratuita em bairros de maior vulnerabilidade, com unidade móvel equipada.',
    itens: ['340 castrações em 2025', 'Voluntários: recepção e triagem']
  },
  {
    id: 'adocao',
    img: 'img/adocao.jpg',
    alt: 'Filhotes resgatados aguardando em recinto improvisado antes da feira de adoção',
    badge: 'A cada 15 dias',
    titulo: 'Feira de Adoção',
    descricao: 'Eventos quinzenais em praças e shoppings parceiros, com acompanhamento pós-adoção pelas primeiras semanas.',
    itens: ['95 adoções em 2025', 'Voluntários: cuidado com os animais no dia do evento']
  }
];

// Larguras geradas pelo script scripts/otimizar-imagens.js
const LARGURAS_WEBP = [400, 800, 1200];

// Monta o srcset a partir do caminho do JPG:
// 'img/resgate.jpg' → 'img/resgate-400.webp 400w, img/resgate-800.webp 800w, ...'
function montarSrcsetWebp(caminhoJpg) {
  const base = caminhoJpg.replace(/\.(jpe?g|png)$/i, '');
  return LARGURAS_WEBP
    .map(function (largura) {
      return base + '-' + largura + '.webp ' + largura + 'w';
    })
    .join(', ');
}

export function renderizarProjetos() {
  const container = document.getElementById('projetosContainer');
  if (!container) return;

  container.innerHTML = projetosData.map(function (projeto) {
    const listaItens = projeto.itens.map(function (item) {
      return '<li>' + item + '</li>';
    }).join('');

    return `
      <article class="projeto" id="${projeto.id}">
        <picture>
          <source
            type="image/webp"
            srcset="${montarSrcsetWebp(projeto.img)}"
            sizes="(max-width: 768px) 100vw, (max-width: 992px) 50vw, 350px" />
          <img src="${projeto.img}" alt="${projeto.alt}" loading="lazy" />
        </picture>
        <span class="badge">${projeto.badge}</span>
        <h2>${projeto.titulo}</h2>
        <p>${projeto.descricao}</p>
        <ul>${listaItens}</ul>
      </article>
    `;
  }).join('');
}