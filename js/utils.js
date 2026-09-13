// =========================================================
// utils.js — funções puras, sem dependência de DOM, rede
// ou armazenamento. Só recebem valores e retornam valores.
// =========================================================

export function apenasNumeros(valor) {
  return valor.replace(/\D/g, '');
}

export function cpfValido(valorComMascara) {
  const cpf = apenasNumeros(valorComMascara);

  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(10))) return false;

  return true;
}