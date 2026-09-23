// =========================================================
// cadastro.js — orquestra a página de cadastro: máscaras,
// validação, busca de CEP e persistência. Importa peças
// menores em vez de reimplementar cada responsabilidade
// aqui dentro.
// =========================================================

import { apenasNumeros, cpfValido } from './utils.js';
import { mostrarToast } from './toast.js';
import { buscarEndereco } from './api-cep.js';
import { obterCadastrosSalvos, salvarCadastro, removerCadastroSalvo } from './storage.js';

function renderizarRegistro() {
  const registroLista = document.getElementById('registroLista');
  const registroVazio = document.getElementById('registroVazio');
  if (!registroLista) return;

  const lista = obterCadastrosSalvos();

  if (lista.length === 0) {
    registroVazio.style.display = 'block';
    registroLista.innerHTML = '';
    return;
  }

  registroVazio.style.display = 'none';

  registroLista.innerHTML = lista.map(function (c) {
    return `
      <li class="registro-item" data-id="${c.id}">
        <span>${c.nome} — <strong>${c.tipo === 'voluntario' ? 'Voluntário(a)' : 'Doador(a)'}</strong></span>
        <button type="button" class="btn-remover-cadastro">Remover</button>
      </li>
    `;
  }).join('');

  // Delegação simples: liga o clique de cada botão de remover
  registroLista.querySelectorAll('.btn-remover-cadastro').forEach(function (botao) {
    botao.addEventListener('click', function () {
      const id = Number(botao.closest('.registro-item').dataset.id);
      removerCadastroSalvo(id);
      renderizarRegistro();
    });
  });
}

export function initPaginaCadastro() {
  renderizarRegistro();

  const camposTipo = document.querySelectorAll('input[name="tipo"]');
  const campoArea = document.getElementById('campoArea');
  const campoTelefone = document.getElementById('telefone');
  const campoCep = document.getElementById('cep');
  const campoCpf = document.getElementById('cpf');
  const formCadastro = document.getElementById('formCadastro');
  const avisoSucesso = document.getElementById('avisoSucesso');

  // ----- Esconder "área de interesse" quando marcar Doador -----
  if (camposTipo.length && campoArea) {
    camposTipo.forEach(function (radio) {
      radio.addEventListener('change', function () {
        if (radio.value === 'doador' && radio.checked) {
          campoArea.classList.add('escondido');
        } else {
          campoArea.classList.remove('escondido');
        }
      });
    });
  }

  // ----- Máscaras via biblioteca IMask.js (carregada globalmente via CDN) -----
  if (campoCpf) {
    IMask(campoCpf, { mask: '000.000.000-00' });
  }

  if (campoTelefone) {
    IMask(campoTelefone, {
      mask: [
        { mask: '(00) 0000-0000' },
        { mask: '(00) 00000-0000' }
      ]
    });
  }

  if (campoCep) {
    IMask(campoCep, { mask: '00000-000' });
  }

  // ----- Busca de endereço via ViaCEP -----
  if (campoCep) {
    const campoRua = document.getElementById('rua');
    const campoBairro = document.getElementById('bairro');
    const campoCidade = document.getElementById('cidade');
    const campoUf = document.getElementById('uf');
    const botaoBuscarCep = document.getElementById('botaoBuscarCep');

    function tratarBuscaDeCep() {
      const cep = apenasNumeros(campoCep.value);

      if (cep.length !== 8) {
        mostrarToast('Digite um CEP completo com 8 números antes de buscar.', 'erro');
        return;
      }

      buscarEndereco(cep)
        .then(function (dados) {
          if (dados.erro) {
            mostrarToast('CEP não encontrado. Confira o número ou preencha manualmente.', 'erro');
            return;
          }
          campoRua.value = dados.logradouro;
          campoBairro.value = dados.bairro;
          campoCidade.value = dados.localidade;
          campoUf.value = dados.uf;
          mostrarToast('Endereço encontrado e preenchido!', 'sucesso');
        })
        .catch(function () {
          mostrarToast('Não foi possível buscar o CEP agora. Preencha manualmente.', 'erro');
        });
    }

    if (botaoBuscarCep) {
      botaoBuscarCep.addEventListener('click', tratarBuscaDeCep);
    }
  }

  // ----- Validação e envio do formulário -----
  if (formCadastro) {
    formCadastro.addEventListener('submit', function (evento) {
      evento.preventDefault();

      let formularioValido = true;

      const campos = formCadastro.querySelectorAll('input, select');
      campos.forEach(function (campo) {
        const divCampo = campo.closest('.campo');
        if (!divCampo) return;

        const valido = campo.checkValidity();
        divCampo.classList.toggle('erro', !valido);
        if (!valido) formularioValido = false;
      });

      const divCpf = campoCpf.closest('.campo');
      if (!cpfValido(campoCpf.value)) {
        divCpf.classList.add('erro');
        formularioValido = false;
      }

      if (!formularioValido) {
        const primeiroErro = formCadastro.querySelector('.campo.erro input, .campo.erro select');
        if (primeiroErro) primeiroErro.focus();
        return;
      }

      const novoCadastro = {
        id: Date.now(),
        nome: document.getElementById('nome').value,
        tipo: formCadastro.querySelector('input[name="tipo"]:checked').value
      };
      salvarCadastro(novoCadastro);

      formCadastro.reset();
      campoArea.classList.remove('escondido');
      avisoSucesso.classList.add('visivel');
      mostrarToast('Cadastro salvo com sucesso!', 'sucesso');
      renderizarRegistro();
    });
  }
}