// =========================================================
// api-cep.js — responsabilidade única: falar com a API
// ViaCEP. Não manipula DOM nem decide o que fazer com o
// resultado — só busca o dado e devolve a Promise.
// =========================================================

export function buscarEndereco(cep) {
  return fetch('https://viacep.com.br/ws/' + cep + '/json/').then(function (resposta) {
    return resposta.json();
  });
}