// =========================================================
// storage.js — responsabilidade única: ler e escrever no
// localStorage. Não sabe nada sobre formulário, rede ou
// como os dados são exibidos na tela.
// =========================================================

const CHAVE_STORAGE = 'patas_e_lares_cadastros';

export function obterCadastrosSalvos() {
  const dados = localStorage.getItem(CHAVE_STORAGE);
  return dados ? JSON.parse(dados) : [];
}

export function salvarCadastro(cadastro) {
  const lista = obterCadastrosSalvos();
  lista.unshift(cadastro);
  localStorage.setItem(CHAVE_STORAGE, JSON.stringify(lista));
}

export function removerCadastroSalvo(id) {
  const lista = obterCadastrosSalvos().filter(function (c) { return c.id !== id; });
  localStorage.setItem(CHAVE_STORAGE, JSON.stringify(lista));
}